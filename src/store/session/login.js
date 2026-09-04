import { getToken as getTokenStorage, saveToken as saveTokenStorage, removeToken as removeTokenStorage } from "../storage"

let token = ''

export default {
	getTokenStorage,
	saveTokenStorage,
	removeTokenStorage,
	getToken() {
		return token
	},
	saveToken(value) {
		token = value
	},
	removeToken() {
		token = ""
	},
}