// 非响应式、运行时接口注入的权限状态（来源：/permission）
// roles       —— 角色列表
// permissions —— 权限点列表（RBAC 粒度：resource:action）
// routes      —— 预留字段：动态路由配置对象数组（path/name/component/meta），当前模板为静态路由，暂不消费
let permission = { roles: [], permissions: [], routes: [] }

export default {
	get() {
		return permission
	},
	set(v) {
		Object.assign(permission, v)
	},
	clear() {
		permission = { roles: [], permissions: [], routes: [] }
	},
}