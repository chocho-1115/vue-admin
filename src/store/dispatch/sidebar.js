import {
  setSidebarStatus
} from '../storage'

import ctx from '../context'

const state = ctx.sidebar

export default {
  setWithoutAnimation(v){
    state.withoutAnimation = v
  },
  close() {
    state.opened = false
    setSidebarStatus(0)
  },
  // set
  toggle() {
    state.opened = !state.opened
    state.withoutAnimation = false
    setSidebarStatus(state.opened ? 1 : 0)
  },
}
