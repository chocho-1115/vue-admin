import { setTagsView } from '../storage'

import ctx from '../context'

const state = ctx.tagsView

const filterParameter = (view) => {
  return {
    path: view.path,
    fullPath: view.fullPath,
    query: { ...view.query },
    meta: { ...view.meta }
  }
}

export default {
  add(view) {
    if (state.some((v) => v.path === view.path)) return
    view = filterParameter(view)
    state.push(view)
    setTagsView(state)
  },
  // visitedViews
  remove(view) {
    if (state.length <= 1) return
    view = filterParameter(view)
    for (const [i, v] of state.entries()) {
      if (v.path === view.path) {
        state.splice(i, 1)
        break
      }
    }
    setTagsView(state)
  },
  update(view) {
    view = filterParameter(view)
    for (let v of state) {
      if (v.path === view.path) {
        v = Object.assign(v, view)
        break
      }
    }
    setTagsView(state)
  },
  removeOthers(view) {
    if (state.length <= 1) return
    view = filterParameter(view)
    for (let i = 0; i < state.length; i++) {
      let v = state[i]
      if (!v.meta.affix && v.path !== view.path) {
        state.splice(i, 1)
        i--
      }
    }
    setTagsView(state)
  },
}
