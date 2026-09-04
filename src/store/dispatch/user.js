import ctx from "../context"

const state = ctx.userInfo

export default {
	removeInfo() {
		Object.keys(state).forEach((key) => delete state[key])
	},
	saveInfo(data) {
		Object.assign(state, data)
	},
}
