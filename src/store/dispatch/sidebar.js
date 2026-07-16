import { setMiniSidebar } from "../storage"

import ctx from "../context"

const state = ctx.sidebar

export default {
	// set
	toggle() {
		state.miniSidebar = !state.miniSidebar
		setMiniSidebar(state.miniSidebar ? 1 : 0)
	},
}
