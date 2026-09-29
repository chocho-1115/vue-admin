// 错误日志收集器：暂时只收集。
// 职责 = 布线（setupErrorCapture）→ 白名单清洗 → 环形缓冲 → 防抖批量写入 IndexedDB（走 idb.js 通用工厂）。
// 三点纪律：
//   - 入口即白名单清洗，token 等敏感字段在入队前要过滤掉
//   - 环形缓冲 50 条上限 + 防抖，错误大量发生时不拖垮主线程
//   - 收集器自己绝不 throw 给业务代码（idb.js 的 put/clear 永不抛错，只返回布尔值）

import { openIDBStore } from "./idb.js"

// autoIncrement：主键自增，避免同毫秒多条错误撞 key 相互覆盖
const logStore = openIDBStore({ dbName: "VA_error-log", storeName: "error-log", autoIncrement: true })

const RING_LIMIT = 50 // 超过就丢最旧的，防错误大量发生不拖垮内存
const FLUSH_DEBOUNCE_MS = 3000 // 首条错误起 3s 攒一批再写库
const SAFE_FIELDS = ["type", "url", "msg", "status", "route", "time"] // 只存这些字段进 db，其余字段（token 等）一律丢弃

const ring = []
let flushTimer = null

/**
 * 全局兜底接线：Vue errorHandler + window error + unhandledrejection。
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
}

/** 主入口：收一条错误，清洗后入队，并保证有个攒批定时器在跑。 */
export function collectErrorLog(type, payload = {}) {
	ring.push({ type, time: Date.now(), ...pickSafeFields(payload) })
	if (ring.length > RING_LIMIT) ring.shift()
	flushTimer ??= setTimeout(flushNow, FLUSH_DEBOUNCE_MS)
}

/** 白名单清洗：过滤 token、密码等不在 SAFE_FIELDS 里的字段。 */
function pickSafeFields(payload) {
	return Object.fromEntries(Object.entries(payload).filter(([k, v]) => SAFE_FIELDS.includes(k) && v !== undefined))
}

async function flushNow() {
	flushTimer = null
	if (ring.length === 0) return
	const batch = ring.splice(0, ring.length)
	reportErrorLog(batch) // 上报出口，默认空实现
	if (!(await logStore.put(batch))) console.error("[errorLog] 写库失败，本批丢弃（原因见 idb 打点）")
}

/** 清空已收集的日志（内存 + IndexedDB 一起）。 */
export async function clearErrorLog() {
	ring.length = 0
	clearTimeout(flushTimer)
	flushTimer = null
	if (!(await logStore.clear())) console.error("[errorLog] 清空失败")
}

/** 上报出口：flushNow 每批写库前先调到这里；接 Sentry/自建后端时补上 batch 参数在此发送。 */
export function reportErrorLog() {}
