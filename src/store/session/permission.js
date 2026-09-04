// store/session.js —— 非响应式、运行时接口注入的业务状态
let permission = { roles: [], permissions: [], routes: [] }

export default {
  permission: {
    get: () => permission,
    set: (v) => Object.assign(permission, v),
    clear: () => (permission = { roles: [], permissions: [], routes: [] }),
  },
}