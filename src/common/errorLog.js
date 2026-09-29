// 职责 = 布线（setupErrorCapture）→ 白名单清洗 → 环形缓冲 → 防抖批量投递 + 本地留档。
// 两张表（同一个库）：
//   - recent：本地留档，滚动保留最近 RECENT_LIMIT 条，纯给人看（将来做日志面板）
//   - pending：投递队列，只装还没上报成功的；上报成功后按 id 删掉
//   「在不在 pending 里」本身就是状态位，不需要额外字段。
// 重投是事件驱动（加载时 / 网络恢复 / 回到前台），没有常驻定时器：后端不可用时压力为 0，
// 代价是队列会积压到 PENDING_LIMIT 后丢最旧的，等下一个事件再消化。
// 三点纪律：
//   - 入口即白名单清洗，token 等敏感字段在入队前要过滤掉
//   - 三层上限各管一头：ring 50 防内存爆、recent 200 纯粹本地看、pending 200 防后端长挂吃光配额
//   - 收集器自己绝不 throw 给业务代码（idb.js 的 put/del/clear 永不抛错，只返回布尔值）

import { openIDBStore } from "@/core/idb"

const DB = { dbName: "VA_error-log", version: 2 } // version 2：schema 由单表 error-log 改为双表（老库残留的 error-log 表不影响读写）
const recentStore = openIDBStore({ ...DB, storeName: "recent", keyPath: "id" })
const pendingStore = openIDBStore({ ...DB, storeName: "pending", keyPath: "id" })

const RING_LIMIT = 50 // 内存缓冲上限：超过丢最旧的，防错误风暴拖垮内存
const RECENT_LIMIT = 200 // 留档表上限：滚动裁剪，纯粹给本地看
const PENDING_LIMIT = 200 // 投递队列上限：滚动丢最旧，防止后端长时间挂掉时无限吃配额
const FLUSH_DEBOUNCE_MS = 3000 // 首条错误起 3s 攒一批再投递
const RETRY_ONLOAD_DELAY_MS = 3000 // 加载后延迟这么久再消化遗留队列，打散"所有人同时刷新"的尖峰
const RETRY_BATCH = 50 // 单次请求的批量大小（不是单轮覆盖量，队列会分块扫完）
const SAFE_FIELDS = ["type", "url", "msg", "status", "route", "time"] // 只存这些字段进 db，其余字段（token 等）一律丢弃

const ring = []
let flushTimer = null
let retrying = false // 重投 in-flight 标志：事件驱动下多条路径会撞车，重叠就会把同一批打两遍
let seq = 0
let reporter = fakeReporter // 上报出口，全局单例，setReporter 可换

/** 记录 id：毫秒时间戳 + 补零序号。补零是必须的——倒序游标按 key 字典序排，不补零同毫秒的 -2 会排到 -10 后面。 */
const nextId = () => `${Date.now()}-${(++seq).toString().padStart(6, "0")}`

/** 白名单清洗：撕掉 token、密码等不在 SAFE_FIELDS 里的字段。 */
function pickSafeFields(payload) {
	return Object.fromEntries(Object.entries(payload).filter(([k, v]) => SAFE_FIELDS.includes(k) && v !== undefined))
}

/** 攒批定时器到点：先写留档，再试投递；报成功的只留档，报失败的额外入队等重投。 */
async function flushNow() {
	flushTimer = null
	if (ring.length === 0) return
	const batch = ring.splice(0, ring.length)
	await putCapped(recentStore, batch, RECENT_LIMIT)
	if (await reportErrorLog(batch)) return // 投递成功，无需入队
	await putCapped(pendingStore, batch, PENDING_LIMIT)
}

/** 写库并滚动裁剪：总数超 limit 就从最旧开始删。 */
async function putCapped(store, batch, limit) {
	if (!(await store.put(batch))) return
	const overflow = (await store.count()) - limit
	if (overflow <= 0) return
	const oldest = await store.getAll(overflow, "next")
	await store.del(oldest.map((e) => e.id))
}

/** 默认上报出口 = 假接口：50% 概率失败，延迟随批量放大模拟网络。没有后端时用它观察队列行为，接后端后删掉。 */
function fakeReporter(batch) {
	return new Promise((resolve) => setTimeout(() => resolve(Math.random() > 0.5), 200 + batch.length * 10))
}

/** 挂上重投触发点：加载时 / 网络恢复 / 回到前台。只在"真有东西该投"的时刻才发请求。 */
function installRetryTriggers() {
	// 加载后随机延迟一小会儿，消化上次遗留的队列。不加延迟的话，后端刚发布时所有客户端
	// 同时刷新会撞在一起形成尖峰
	setTimeout(retryPending, Math.random() * RETRY_ONLOAD_DELAY_MS)
	window.addEventListener("online", retryPending) // 网卡恢复，此刻命中率最高（但网卡一直是通的就不会触发）
	document.addEventListener("visibilitychange", () => {
		if (document.visibilityState === "visible") retryPending() // 用户切回前台，后台管理系统里这个事件不稀
	})
}

// ---------------- 对外接口 ----------------

/**
 * 全局兜底接线：Vue errorHandler + window error + unhandledrejection，并挂上重投触发点。
 * createApp 后、mount 前调一次；getRoute 延迟求值，避免硬依赖 router。
 */
export function setupErrorCapture(app, getRoute = () => "") {
	// 配了 errorHandler，Vue 就把错误吞了，根本不冒泡到 window
	app.config.errorHandler = (err) => {
		// stack: err?.stack, // 暂不存进 db：等 SAFE_FIELDS 加字段后再启用
		collectErrorLog("vue", { msg: err?.message || String(err), route: getRoute() })
	}
	window.addEventListener("error", (event) => {
		// status: event.lineno, // 语义是行号，暂不存进 db，避免误当 HTTP 状态码
		collectErrorLog("window", { msg: event.message, url: event.filename, route: getRoute() })
	})
	window.addEventListener("unhandledrejection", (event) => {
		collectErrorLog("promise", { msg: String(event.reason?.message ?? event.reason), route: getRoute() })
	})
	installRetryTriggers()
}

/** 主入口：收一条错误，清洗后入队，并保证有个攒批定时器在跑。 */
export function collectErrorLog(type, payload = {}) {
	// id 在白名单清洗之后注入，用户 payload 里的同名字段已被撕掉
	ring.push({ id: nextId(), type, time: Date.now(), ...pickSafeFields(payload) })
	if (ring.length > RING_LIMIT) ring.shift()
	flushTimer ??= setTimeout(flushNow, FLUSH_DEBOUNCE_MS)
}

/**
 * 事件驱动重投：整队列分块扫完，某块失败即停（每次事件最多打 1 个请求）。
 * 不再有常驻定时器——后端不可用时压力为 0，代价是队列会积压到 PENDING_LIMIT 后丢最旧的。
 */
export async function retryPending() {
	if (retrying) return // 上一轮还在飞，等它打完
	retrying = true
	try {
		const waiting = await pendingStore.getAll(PENDING_LIMIT, "next")
		for (let i = 0; i < waiting.length; i += RETRY_BATCH) {
			const chunk = waiting.slice(i, i + RETRY_BATCH)
			if (!(await reportErrorLog(chunk))) break // 网络不通就别继续打了，下个事件再来
			await pendingStore.del(chunk.map((e) => e.id))
		}
	} finally {
		retrying = false
	}
}

/** 清空已收集的日志（内存 + 留档 + 投递队列一起）。 */
export async function clearErrorLog() {
	ring.length = 0
	clearTimeout(flushTimer)
	flushTimer = null
	await recentStore.clear()
	await pendingStore.clear()
}

/** 看本地留档（最新在前）。预留给将来的日志面板，当前无调用方。 */
export const readRecent = (qty = 200) => recentStore.getAll(qty)
/** 看投递队列：还在排队等上报的那些（最旧在前）。预留给将来的日志面板，当前无调用方。 */
export const readPending = (qty = 200) => pendingStore.getAll(qty, "next")

/** 上报出口：返回是否送达。reporter 抛异常 / 返回非 true 都算失败，绝不把异常抛给调用方。 */
export async function reportErrorLog(batch) {
	try {
		return (await reporter(batch)) === true
	} catch (err) {
		console.error("[errorLog] 上报异常", err)
		return false
	}
}

/** 覆盖上报出口（默认是假接口）。改的是模块级全局单例，多个调用方会互相覆盖。 */
export function setReporter(fn) {
	if (typeof fn === "function") reporter = fn
}
