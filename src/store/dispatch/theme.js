import { setThemeName, getThemeName } from "../storage"

import ctx from "../context"

const state = ctx.theme

export default {
	init() {
		if (getThemeName() === "dark") document.documentElement.classList.add("dark")
	},
	toggle() {
		state.isDark = getThemeName() !== "dark"
		state.name = state.isDark ? "dark" : "light"
		setThemeName(state.name)
		document.documentElement.classList.toggle("dark")
	},

}
