// 错误日志收集器：只收集，不弹列表。
// 职责 = 布线（setupErrorCapture）→ 白名单清洗 → 环形缓冲 → 防抖批量投递 + 本地留档。
// 两张表（同一个库）：
//   - recent：本地留档，滚动保留最近 RECENT_LIMIT 条，纯给人看（将来做日志面板）
//   - pending：投递队列，只装还没上报成功的；上报成功后按 id 删掉
//   「在不在 pending 里」本身就是状态位，不需要额外字段。
// 三点纪律：
//   - 入口即白名单清洗，token 等敏感字段在入队前要过滤掉
//   - 环形缓冲 50 条上限 + 防抖，错误大量发生时不拖垮主线程
//   - 收集器自己绝不 throw 给业务代码（idb.js 的 put/del/clear 永不抛错，只返回布尔值）

import { openIDBStore } from "./idb.js"

const DB = { dbName: "VA_error-log", version: 2 } // version 2：schema 从单表变双表，旧的 error-log 表成为孤儿
const recentStore = openIDBStore({ ...DB, storeName: "recent", keyPath: "id" })
const pendingStore = openIDBStore({ ...DB, storeName: "pending", keyPath: "id" })

const RING_LIMIT = 50 // 内存缓冲上限：超过丢最旧的，防错误风暴拖垮内存
const RECENT_LIMIT = 200 // 留档表上限：滚动裁剪，纯粹给本地看
const PENDING_LIMIT = 200 // 投递队列上限：滚动丢最旧，防止后端长时间挂掉时无限吃配额
const FLUSH_DEBOUNCE_MS = 3000 // 首条错误起 3s 攒一批再投递
const RETRY_INTERVAL_MS = 60000 // 定时重投周期
const RETRY_BATCH = 50 // 单次重投条数
const SAFE_FIELDS = ["type", "url", "msg", "status", "route", "time"] // 只存这些字段进 db，其余字段（token 等）一律丢弃

const ring = []
let flushTimer = null
let seq = 0

/** 记录 id：毫秒时间戳 + 补零序号。补零是必须的——倒序游标按 key 字典序排，不补零同毫秒的 -2 会排到 -10 后面。 */
const nextId = () => `${Date.now()}-${(++seq).toString().padStart(6, "0")}`

/**
 * 全局兜底接线：Vue errorHandler + window error + unhandledrejection，并起定时重投。
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
	setInterval(retryPending, RETRY_INTERVAL_MS)
}

/** 主入口：收一条错误，清洗后入队，并保证有个攒批定时器在跑。 */
export function collectErrorLog(type, payload = {}) {
	// id 在白名单清洗之后注入，用户 payload 里的同名字段已被撕掉
	ring.push({ id: nextId(), type, time: Date.now(), ...pickSafeFields(payload) })
	if (ring.length > RING_LIMIT) ring.shift()
	flushTimer ??= setTimeout(flushNow, FLUSH_DEBOUNCE_MS)
}

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

/** 定时重投：取 pending 最早的一批试报，成功就从队列里删掉。 */
export async function retryPending() {
	const waiting = await pendingStore.getAll(RETRY_BATCH, "next")
	if (waiting.length === 0) return
	if (!(await reportErrorLog(waiting))) return
	await pendingStore.del(waiting.map((e) => e.id))
}

/** 写库并滚动裁剪：总数超 limit 就从最旧开始删。 */
async function putCapped(store, batch, limit) {
	if (!(await store.put(batch))) return
	const overflow = (await store.count()) - limit
	if (overflow <= 0) return
	const oldest = await store.getAll(overflow, "next")
	await store.del(oldest.map((e) => e.id))
}

/** 清空已收集的日志（内存 + 留档 + 投递队列一起）。 */
export async function clearErrorLog() {
	ring.length = 0
	clearTimeout(flushTimer)
	flushTimer = null
	await recentStore.clear()
	await pendingStore.clear()
}

/** 看本地留档（最新在前）。 */
export const readRecent = (qty = 200) => recentStore.getAll(qty)
/** 看投递队列：还在排队等上报的那些（最旧在前）。 */
export const readPending = (qty = 200) => pendingStore.getAll(qty, "next")

let reporter = fakeReporter

/** 覆盖上报出口（默认是假接口）。不改变「绝不 throw」纪律。 */
export function setReporter(fn) {
	if (typeof fn === "function") reporter = fn
}

/** 默认上报出口 = 假接口：50% 概率失败 + 300ms 延迟模拟网络。没有后端时用它观察队列行为，接后端后删掉。 */
function fakeReporter() {
	return new Promise((resolve) => setTimeout(() => resolve(Math.random() > 0.5), 300))
}

/** 上报出口：返回是否送达。reporter 抛异常 / 返回非 true 都算失败，绝不把异常抛给调用方。 */
export async function reportErrorLog(batch) {
	try {
		return (await reporter(batch)) === true
	} catch (err) {
		console.error("[errorLog] 上报异常", err)
		return false
	}
}
