import { dispatch } from "@/store"
import { isWhitePage } from "@/router"

import { EventBus } from "@/core/eventBus"

// to re-login
// ElMessageBox.confirm(
//   'You have been logged out, you can cancel to stay on this page, or log in again',
//   'Confirm logout', {
//     confirmButtonText: 'Re-Login',
//     cancelButtonText: 'Cancel',
//     type: 'warning'
//   }).then(() => {
//   location.reload()
// })

export function initHttpSubscriber() {
	// unauthorized (no token / invalid token)
	EventBus.on("auth:unauthorized", () => {
		dispatch.login.removeToken()
		dispatch.user.removeInfo()
		if (!isWhitePage()) {
			dispatch.login.go()
		}
	})
	// expired
	EventBus.on("auth:expired", () => {
		dispatch.login.removeToken()
		dispatch.user.removeInfo()
		if (!isWhitePage()) {
			dispatch.login.go()
		}
	})

	EventBus.on("request:error", (errorInfo) => {
		console.log("Unified error log reporting:", errorInfo)
		ElMessage({
			message: errorInfo.message || "Error",
			type: "error",
			duration: 5 * 1000,
		})
	})
}

export function destroyHttpSubscriber() {
	EventBus.off("auth:unauthorized")
	EventBus.off("auth:expired")
	EventBus.off("request:error")
}

export default { initHttpSubscriber, destroyHttpSubscriber }
