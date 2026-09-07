import {
	getToken as getTokenStorage,
	setToken as setTokenStorage,
	removeToken as removeTokenStorage,
} from "../storage"

let token = ""

export default {
	getTokenStorage,
	setTokenStorage,
	removeTokenStorage,
	getToken() {
		return token
	},
	setToken(value) {
		token = value
	},
	removeToken() {
		token = ""
	},
}
