import {
  setSidebarStatus
} from '../storage'

import ctx from '../context'

const state = ctx.sidebar

export default {
  close() {
    state.opened = false
    setSidebarStatus(0)
  },
  // set
  toggle() {
    state.opened = !state.opened
    setSidebarStatus(state.opened ? 1 : 0)
  },
}
