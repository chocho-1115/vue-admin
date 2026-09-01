import { setThemeName, getThemeName } from "../storage"

import ctx from "../context"

const state = ctx.theme

export default {
	init() {
		if (getThemeName() === "dark") document.documentElement.classList.add("dark")
	},
	toggle() {
		state.name = state.name === "dark" ? "light" : "dark"
		setThemeName(state.name)
		document.documentElement.classList.toggle("dark")
	},

}
