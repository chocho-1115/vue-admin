import { logout } from "@/common/logout"
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
		logout()
	})
	// expired
	EventBus.on("auth:expired", () => {
		logout()
	})

	EventBus.on("request:error", (errorInfo) => {
		if (import.meta.env.DEV) {
			console.log("Unified error log reporting:", errorInfo)
		}
		const msg = errorInfo?.message || errorInfo?.res?.msg
		ElMessage({
			message: msg || "Error",
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
