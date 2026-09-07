import {
	getToken as getStorage,
	setToken as setStorage,
	removeToken as removeStorage,
} from "../storage"

let token = ""

export default {
	getStorage,
	setStorage,
	removeStorage,
	get() {
		return token
	},
	set(value) {
		token = value
	},
	clear() {
		token = ""
	},
}