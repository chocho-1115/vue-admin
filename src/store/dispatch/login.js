import router from "@/router"

import { getToken, saveToken, removeToken } from "../storage"
import session from "../session"

const state = session.login

export default {
	getTokenStorage() {
		return getToken()
	},
	saveToken(token) {
		saveToken(token)
		state.token = token
	},
	removeToken() {
		removeToken()
		state.token = ""
	},
	go() {
		if (router.currentRoute.value.path === "/account/login") return
		router.push(`/account/login?redirect=${router.currentRoute.value.fullPath || "/"}`)
	},
}
