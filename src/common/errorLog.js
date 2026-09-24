// src/common/errorLog.js —— 错误日志收集器（只收集，不弹列表）
//
// 全仓唯一认识 "error" 的文件。职责 = 布线 + 收 + 洗 + 环形缓冲 + 防抖落盘。
// 布线：setupErrorCapture 在这里接 Vue errorHandler / window error / unhandledrejection。
// 落盘走 idb.js 的通用工厂（本文件只负责给错误日志开一张抽屉）。
// 三点纪律：
//   - 入口即白名单清洗，config.headers(token) 在 httpSubscriber 入口就被撕掉
//   - 环形缓冲 + 防抖批量，错误风暴时不拖垮主线程
//   - 每口 try/catch 兜死，收集器自己绝不 throw 给业务代码

import { openIDBStore } from "./idb.js"

// autoIncrement：主键自增，避免同毫秒多条错误撞 key 相互覆盖；读取仍按插入序倒排
const logStore = openIDBStore({ dbName: "VA_error-log", storeName: "error-log", autoIncrement: true })

const RING_LIMIT = 50 // 环形缓冲区上限：超过则丢最旧的，防止错误风暴拖垮内存
const FLUSH_DEBOUNCE_MS = 3000 // 防抖落盘间隔：最后一条错误后 3s 才批量写入
const SAFE_FIELDS = ["type", "url", "msg", "status", "route", "time"] // 落盘白名单，只保留这些字段

const ring = [] // 内存环形缓冲：待落盘的错误条目，防抖到点后 splice 清空
let flushTimer = null // 防抖定时器句柄：scheduleFlush 里判空避免重复起定时器

/**
 * 全局兜底接线：Vue 组件错误 + window error + 未处理 Promise 拒绝，全部收进日志抽屉。
 * 在 createApp 后、mount 前调一次；getRoute 返回当前路由路径（延迟求值，避免硬依赖 router）。
 */
export function setupErrorCapture(app, getRoute = () => "") {
	// 
	// 一旦配置了 app.config.errorHandler，Vue 就把错误吞了，根本不冒泡到 window
	app.config.errorHandler = (err, instance, info) => {
		collectErrorLog("vue", { msg: err?.message || String(err), stack: err?.stack, info, route: getRoute() })
	}
	window.addEventListener("error", (event) => {
		collectErrorLog("window", { msg: event.message, url: event.filename, status: event.lineno, route: getRoute() })
	})
	window.addEventListener("unhandledrejection", (event) => {
		collectErrorLog("promise", { msg: String(event.reason?.message ?? event.reason), route: getRoute() })
	})
}

/** 主入口：收集一条错误。 */
export function collectErrorLog(type, payload = {}) {
	const entry = { type, time: Date.now(), ...pickSafeFields(payload) }
	ring.push(entry)
	if (ring.length > RING_LIMIT) ring.shift()
	scheduleFlush()
}

/** 数据清洗：只留 SAFE_FIELDS 里 payload 真正带上的字段，撕掉 token、密码等敏感信息。 */
function pickSafeFields(payload) {
	const clean = {}
	for (const field of SAFE_FIELDS) {
		if (field in payload && payload[field] !== undefined) {
			clean[field] = payload[field]
		}
	}
	return clean
}

function scheduleFlush() {
	if (flushTimer) return
	flushTimer = setTimeout(flushNow, FLUSH_DEBOUNCE_MS)
}

async function flushNow() {
	flushTimer = null
	if (ring.length === 0) return
	const batch = ring.splice(0, ring.length)
	try {
		await logStore.put(batch)
	} catch {
		// put 自身已兜底不抛，这里是双保险
	}
}

/** 清空已收集的日志（内存 + IndexedDB 一起）。 */
export async function clearErrorLog() {
	ring.length = 0
	if (flushTimer) {
		clearTimeout(flushTimer)
		flushTimer = null
	}
	try {
		await logStore.clear()
	} catch {
		// 同上：清空失败也不抛
	}
}

/** 上报出口占位 —— 将来接 Sentry / 自建后端，只填这一个函数 */
export function reportErrorLog(/* batch */) {}

export default {
	collectErrorLog,
	clearErrorLog,
	reportErrorLog,
	setupErrorCapture,
}
