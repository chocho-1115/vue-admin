import request from "@/common/request"
import { session } from "@/store"

export function getPermission() {
	return request({
		url: "/permission",
		headers: { token: session.login.getTokenStorage() },
		method: "get",
	})
}