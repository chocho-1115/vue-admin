// 全局错误收集：布线 → 白名单清洗 → 环形缓冲 → 3s 攒批投递 + 本地留档 → 事件驱动重投。
// 两张表同一个库：recent 是本地留档，pending 是投递队列，容量各自滚动裁剪。
// 「在不在 pending 里」本身就是状态位，不需要额外字段。
// 已知边界：3s 攒批窗口内刷新 / 关页面，内存里这批会丢。

import { openIDBStore } from "@/core/idb"

const DB = { dbName: "VA_error-log", version: 2 } // 老库残留的单表 error-log 不影响读写
const recentStore = openIDBStore({ ...DB, storeName: "recent", keyPath: "id" })
const pendingStore = openIDBStore({ ...DB, storeName: "pending", keyPath: "id" })

const RING_LIMIT = 50 // 防错误风暴拖垮内存
const RECENT_LIMIT = 200 // 留档上限
const PENDING_LIMIT = 200 // 队列上限，防后端长挂吃光配额
const FLUSH_DEBOUNCE_MS = 3000 // 首条错误起算的攒批窗口
const RETRY_ONLOAD_DELAY_MS = 3000 // 加载后消化遗留队列的延迟上限，打散同时刷新的尖峰
const RETRY_BATCH = 50 // 单次请求批量
const SAFE_FIELDS = ["type", "url", "msg", "status", "route", "time"] // 白名单，其余字段（token 等）一律丢弃

const ring = []
let flushTimer = null
let flushing = false // 攒批在飞：手里攥着内存数据，不让位
let retrying = false // 重投在飞：多条事件路径会撞车，重叠就会把同一批打两遍
let seq = 0
let reporter = fakeReporter // 上报出口，setReporter 可换

/**
 * id = `<时间戳>-<序号>-<随机段>`：时间戳定字典序（倒序游标取最新在前），序号补零到 6 位
 * 否则同毫秒的 -2 排到 -10 后面；随机段防跨标签页撞号——各页 seq 各自从 1 起，同毫秒会
 * 生成同一个 id，而 put 是 upsert，撞号等于无声覆盖。
 */
const nextId = () => `${Date.now()}-${(++seq).toString().padStart(6, "0")}-${Math.random().toString(36).slice(2, 8)}`

/** 白名单清洗：撕掉 token、密码等字段。 */
function pickSafeFields(payload) {
	return Object.fromEntries(Object.entries(payload).filter(([k, v]) => SAFE_FIELDS.includes(k) && v !== undefined))
}

/** 攒批到点：先留档再投递，投递失败的入队等重投。 */
async function flushNow() {
	flushTimer = null
	if (ring.length === 0) return
	flushing = true
	try {
		const batch = ring.splice(0, ring.length)
		await putCapped(recentStore, batch, RECENT_LIMIT) // 留档失败不阻断投递，内存这批才是最后的底
		if (await reportErrorLog(batch)) return
		if (!(await putCapped(pendingStore, batch, PENDING_LIMIT))) {
			// 入队也失败 = 这批彻底没了，塞回 ring 等下个窗口。不重排定时器，否则 IDB 一直坏着会每 3s 空写一轮
			ring.unshift(...batch)
			if (ring.length > RING_LIMIT) ring.length = RING_LIMIT
		}
	} finally {
		flushing = false
	}
}

/** 写库并滚动裁剪：超 limit 就从最旧开始删。任一步失败回 false。 */
async function putCapped(store, batch, limit) {
	if (!(await store.put(batch))) return false
	const overflow = (await store.count()) - limit
	if (overflow <= 0) return true
	const oldest = await store.getAll(overflow, "next")
	return await store.del(oldest.map((e) => e.id))
}

/** 假接口：50% 概率失败，延迟随批量放大。只用于本地观察队列，接后端用 setReporter 换掉（别删，删了失败原因会被吞掉）。 */
function fakeReporter(batch) {
	return new Promise((resolve) => setTimeout(() => resolve(Math.random() > 0.5), 200 + batch.length * 10))
}

/** 重投触发点：加载时 / 网络恢复 / 回到前台，都无条件调，队列空时只读一次 IDB。 */
function installRetryTriggers() {
	setTimeout(retryPending, Math.random() * RETRY_ONLOAD_DELAY_MS) // 随机延迟打散同时刷新的尖峰
	// online 不可靠：只有系统认为网络真断过才触发，后端 500 这类根本不会动网卡
	window.addEventListener("online", retryPending)
	document.addEventListener("visibilitychange", () => {
		if (document.visibilityState === "visible") retryPending() // 回到前台，最可靠的一环
	})
}

// ---------------- 对外接口 ----------------

/**
 * 全局兜底接线：Vue errorHandler + window error + unhandledrejection。
 * createApp 后、mount 前调一次（监听没去重，重复调用会叠加）。
 */
export function setupErrorCapture(app, getRoute = () => "") {
	// 配了 errorHandler，Vue 就不打 console 也不往外抛，所以这行 console.error 得自己补
	app.config.errorHandler = (err) => {
		console.error(err)
		// stack: err?.stack, // 采集端待支持；加进 SAFE_FIELDS 只会让用户能伪造它
		collectErrorLog("vue", { msg: err?.message || String(err), route: getRoute() })
	}
	window.addEventListener("error", (event) => {
		// event.lineno / colno 是行列号，和 HTTP status 冲突，暂不入库
		collectErrorLog("window", { msg: event.message, url: event.filename, route: getRoute() })
	})
	window.addEventListener("unhandledrejection", (event) => {
		collectErrorLog("promise", { msg: String(event.reason?.message ?? event.reason), route: getRoute() })
	})
	installRetryTriggers()
}

/** 主入口：收一条错误，清洗后入队并起攒批窗口。 */
export function collectErrorLog(type, payload = {}) {
	// id 在清洗之后注入，payload 里的同名字段已被撕掉
	ring.push({ id: nextId(), type, time: Date.now(), ...pickSafeFields(payload) })
	if (ring.length > RING_LIMIT) ring.shift()
	flushTimer ??= setTimeout(flushNow, FLUSH_DEBOUNCE_MS)
}

/**
 * 事件驱动重投：队列分块扫完，某块失败即停（每次事件最多 1 个请求，攒批在飞时也让位）。
 * 没有常驻定时器：后端不可用时压力为 0，代价是队列积压到上限后丢最旧的。
 */
export async function retryPending() {
	if (retrying || flushing) return
	retrying = true
	try {
		const waiting = await pendingStore.getAll(PENDING_LIMIT, "next")
		for (let i = 0; i < waiting.length; i += RETRY_BATCH) {
			const chunk = waiting.slice(i, i + RETRY_BATCH)
			if (!(await reportErrorLog(chunk))) break // 网络不通就别继续打，下个事件再来
			if (!(await pendingStore.del(chunk.map((e) => e.id)))) {
				// 投出去了但删不掉，这块会被重投，后端需按 id 幂等去重；再打下去只会堆更多重复
				console.error("[errorLog] 投递成功但队列删除失败，将重复上报，后端需按 id 去重")
				break
			}
		}
	} finally {
		retrying = false
	}
}

/** 清空内存 + 留档 + 队列（不打断在飞的任务，之后可能仍有旧数据落库）。 */
export async function clearErrorLog() {
	ring.length = 0
	clearTimeout(flushTimer)
	flushTimer = null
	await recentStore.clear()
	await pendingStore.clear()
}

/** 看本地留档（最新在前），预留给日志面板。 */
export const readRecent = (qty = 200) => recentStore.getAll(qty)
/** 看投递队列（最旧在前），预留给日志面板。 */
export const readPending = (qty = 200) => pendingStore.getAll(qty, "next")

/** 上报出口：返回是否送达。抛异常或返回非 true 都算失败，不往外抛。 */
export async function reportErrorLog(batch) {
	try {
		return (await reporter(batch)) === true
	} catch (err) {
		console.error("[errorLog] 上报异常", err)
		return false
	}
}

/** 覆盖上报出口。改的是模块级全局单例，多个调用方会互相覆盖。 */
export function setReporter(fn) {
	if (typeof fn === "function") reporter = fn
}
