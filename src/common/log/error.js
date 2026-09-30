// 全局错误收集。三段结构，按因果顺序从上往下读：
//   存 → 存到哪、本地最近记录 recent、待投递队列 pending、上限怎么裁
//   投 → 唯一的出站口 send，和它背后可替换的 reporter
//   编排 → 内存暂存 ring、攒批定时器、flushNow / retryPending 什么时候调存和投
// 已知边界：3s 攒批窗口内刷新 / 关页面，ring 里这批会丢。

import { openIDBStore } from "@/core/idb"

// ==================== 存 ====================
const DB = { dbName: "VA_error-log", version: 3 }
const recentStore = openIDBStore({ ...DB, storeName: `v${DB.version}_recent`, autoIncrement: true })
const pendingStore = openIDBStore({ ...DB, storeName: `v${DB.version}_pending`, autoIncrement: true })

const RECENT_LIMIT = 200 // 最近记录条数上限，超了整表清
const PENDING_LIMIT = 200 // 队列上限，防后端长挂吃光配额

/** 存·写一张表：超上限就整表清空，不做逐条裁剪。只给日志面板看，没人翻页，粗粒度够了。任一步失败回 false。 */
async function putCapped(store, batch, limit) {
	if (!(await store.put(batch))) return false
	if ((await store.count()) <= limit) return true
	return await store.clear()
}

/** 存·写本地最近记录。投递成败与它无关，先记下来。 */
const save = (batch) => putCapped(recentStore, batch, RECENT_LIMIT)

/** 存·投递失败时落 pending 等重投。写不进去就退回内存 ring，不静默丢。 */
async function enqueue(batch) {
	if (await putCapped(pendingStore, batch, PENDING_LIMIT)) return true
	// 入队也失败 = 这批彻底没了，塞回 ring 等下个窗口。不重排定时器，否则 IDB 一直坏着会每 3s 空写一轮
	ring.unshift(...batch)
	if (ring.length > RING_LIMIT) ring.length = RING_LIMIT
	return false
}

/** 存·取整个投递队列（最旧在前）。qty 默认整个队列上限。 */
const dequeue = (qty = PENDING_LIMIT) => pendingStore.getAll(qty, "next")

/** 存·队列已确认送达，清空。 */
const clearPending = () => pendingStore.clear()

/** 看本地最近记录（最新在前），预留给日志面板。 */
export const readRecent = (qty = 200) => recentStore.getAll(qty)

/** 看投递队列（最旧在前），预留给日志面板。 */
export const readPending = (qty) => dequeue(qty)

/** 清空内存 + 最近记录 + 待投递队列（不打断在飞的任务，之后可能仍有旧数据落库）。 */
export async function clearErrorLog() {
	ring.length = 0
	clearTimeout(flushTimer)
	flushTimer = null
	await recentStore.clear()
	await pendingStore.clear()
}

// ==================== 投 ====================

let reporter = fakeReporter // 出站口，setReporter 可换

/** 投·唯一的出站口。返回是否送达：抛异常或返回非 true 都算失败，不往外抛。 */
export async function send(batch) {
	try {
		return (await reporter(batch)) === true
	} catch (err) {
		console.error("[errorLog] 上报异常", err)
		return false
	}
}

/** 投·覆盖出站口。改的是模块级全局单例，多个调用方会互相覆盖。 */
export function setReporter(fn) {
	if (typeof fn === "function") reporter = fn
}

/** 假接口：50% 概率失败，延迟随批量放大。只用于本地观察队列，接后端用 setReporter 换掉（别删，删了失败原因会被吞掉）。 */
function fakeReporter(batch) {
	return new Promise((resolve) => setTimeout(() => resolve(Math.random() > 0.5), 200 + batch.length * 10))
}

// ==================== 编排 ====================

const RING_LIMIT = 50 // 防错误风暴拖垮内存
const FLUSH_DEBOUNCE_MS = 3000 // 首条错误起算的攒批窗口
// 白名单只收调用方能贡献的字段，其余（token 等）一律丢弃；type / time / route 由本模块兜底，不接受传入
const SAFE_FIELDS = ["url", "msg", "status"]

const ring = []
let flushTimer = null
let flushing = false // 攒批在飞：手里攥着内存数据，不让位
let retrying = false // 重投在飞：多条事件路径会撞车，重叠就会把同一批打两遍

/** 白名单清洗：撕掉 token、密码等字段。 */
function pickSafeFields(payload) {
	return Object.fromEntries(Object.entries(payload).filter(([k, v]) => SAFE_FIELDS.includes(k) && v !== undefined))
}

/** 主入口：收一条错误，清洗后入队并起攒批窗口。 */
export function collectErrorLog(type, payload = {}) {
	// 路由以当前地址兜底：query 留着（能区分同页不同 tab），hash 丢掉（对本项目没信息量）
	const route = window.location.pathname + window.location.search
	// 三个兜底字段排在展开之后，即便白名单哪天放开了同名键也覆盖不掉它们
	ring.push({ ...pickSafeFields(payload), type, time: Date.now(), route })
	if (ring.length > RING_LIMIT) ring.shift()
	flushTimer ??= setTimeout(flushNow, FLUSH_DEBOUNCE_MS)
}

/** 攒批到点：先记到 recent，再投；投不出去就存进 pending 等重投。 */
async function flushNow() {
	flushTimer = null
	if (ring.length === 0) return
	flushing = true
	try {
		const batch = ring.splice(0, ring.length)
		await save(batch) // 存。记不下来不阻断投递，内存这批才是最后的底
		if (await send(batch)) return
		await enqueue(batch) // 存。等下个事件重投
	} finally {
		flushing = false
	}
}

/**
 * 事件驱动重投：取整个 pending 一次投出去，投成功就清空、失败原样留着等下个事件。
 * 攒批在飞时让位。没有常驻定时器：后端不可用时压力为 0，代价是积压超上限丢最旧。
 */
export async function retryPending() {
	if (retrying || flushing) return
	retrying = true
	try {
		const batch = await dequeue()
		if (!batch.length) return
		if (await send(batch)) await clearPending()
		// 投成功但 clear 失败 = 这批会被重投。后端手上没有稳定 id 能去重（主键是本地库自增的、
		// 且不外发），真要精确幂等得在采集侧补一个客户端生成的 traceId，等上报接口契约定了再加
	} finally {
		retrying = false
	}
}
