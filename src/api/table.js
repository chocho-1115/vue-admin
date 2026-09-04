import request from "@/common/request"
import { session } from "@/store"

export function getList(params) {
	return request({
		url: "/table/list",
		method: "get",
		headers: { token: session.login.getToken() },
		params,
	})
}
