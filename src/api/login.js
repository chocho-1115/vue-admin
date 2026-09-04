import request from "@/common/request"
import { session } from "@/store"

export function login(data) {
	return request({
		url: "/login/loginByAccount",
		method: "post",
		data,
	})
}

export function logout() {
	return request({
		url: "/login/logout",
		headers: { token: session.login.getTokenStorage() },
		method: "post",
	})
}

export function checkToken(params) {
	return request({
		url: "/login/checkToken",
		headers: { token: session.login.getTokenStorage() },
		method: "get",
		params,
	})
}
