import { collectErrorLog, retryPending } from "./error.js"

function installRetryTriggers() {
	setTimeout(retryPending, 3000)
	window.addEventListener("online", retryPending)
	document.addEventListener("visibilitychange", () => {
		if (document.visibilityState === "visible") retryPending()
	})
}

export function setupErrorCapture(app) {
	app.config.errorHandler = (err) => {
		// stack: err?.stack
		collectErrorLog("vue", { msg: err?.message || String(err) })
	}
	window.addEventListener("error", (event) => {
		// event.lineno / colno
		collectErrorLog("window", { msg: event.message, url: event.filename })
	})
	window.addEventListener("unhandledrejection", (event) => {
		collectErrorLog("promise", { msg: String(event.reason?.message ?? event.reason) })
	})
	installRetryTriggers()
}
