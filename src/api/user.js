import request from "@/common/request"
import { session } from "@/store"

export function getInfo() {
	return request({
		url: "/user/info",
		headers: { token: session.login.getTokenStorage() },
		method: "get",
	})
}
