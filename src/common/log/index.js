import { collectErrorLog, retryPending } from "./error.js"

const RETRY_ONLOAD_DELAY_MS = 3000 // 加载后消化遗留队列的延迟上限，打散同时刷新的尖峰


/** 重投触发点：加载时 / 网络恢复 / 回到前台，都无条件调，队列空时只读一次 IDB。 */
function installRetryTriggers() {
	setTimeout(retryPending, Math.random() * RETRY_ONLOAD_DELAY_MS) // 随机延迟打散同时刷新的尖峰
	// online 不可靠：只有系统认为网络真断过才触发，后端 500 这类根本不会动网卡
	window.addEventListener("online", retryPending)
	document.addEventListener("visibilitychange", () => {
		console.log('visibilitychange')
		if (document.visibilityState === "visible") retryPending() // 回到前台，最可靠的一环
	})
}
/**
 * 全局兜底接线：Vue errorHandler + window error + unhandledrejection。
 * createApp 后、mount 前调一次（监听没去重，重复调用会叠加）。
 */
export function setupErrorCapture(app) {

  app.config.errorHandler = (err) => {
    // stack: err?.stack, // 采集端待支持；加进 SAFE_FIELDS 只会让用户能伪造它
    collectErrorLog("vue", { msg: err?.message || String(err) })
  }

  window.addEventListener("error", (event) => {
    // event.lineno / colno 是行列号，和 HTTP status 冲突，暂不入库
    collectErrorLog("window", { msg: event.message, url: event.filename })
  })
  window.addEventListener("unhandledrejection", (event) => {
    collectErrorLog("promise", { msg: String(event.reason?.message ?? event.reason) })
  })
  installRetryTriggers()
}