import ctx from '../context'

let state = ctx.tagsView

export default {
  add(view) {
    if (state.some((v) => v.path === view.path)) return
    state.push(
      Object.assign({}, view, {
        title: view.meta?.title || 'no-name',
      }),
    )
  },
  // visitedViews
  remove(view) {
    if (state.length <= 1) return
    for (const [i, v] of state.entries()) {
      if (v.path === view.path) {
        state.splice(i, 1)
        break
      }
    }
  },
  update(view) {
    console.log('===up')
    for (let v of state) {
      if (v.path === view.path) {
        console.log(v, view)
        v = Object.assign(v, view)
        break
      }
    }
  },
  removeOthers(view) {
    if (state.length <= 1) return
    for (let i = 0; i < state.length; i++) {
      let v = state[i]
      if (!v.meta.affix && v.path !== view.path) {
        state.splice(i, 1)
        i--
      }
    }
  },
}
