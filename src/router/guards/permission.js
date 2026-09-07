import { getPermission } from "@/api/permission"
import { hasRole } from "@/common/permission"
import { session } from "@/store"

/**
 * 确保权限数据（roles/permissions）已加载
 * 仅在存在 token 且尚未加载时请求一次；后续导航命中 roles.length 直接跳过
 */
async function ensurePermission() {
	if (session.permission.get().roles.length) return
	const { data } = await getPermission()
	session.permission.set(data)
}

/**
 * 角色权限守卫：在 auth 守卫（token 已确认有效）之后执行
 * —— 先补拉权限数据，再做目标路由 meta.roles 的角色校验，未命中跳 403
 * 依赖 auth 先行：auth 保证 token 有效后才放行到此；此守卫按注册顺序在 auth 之后
 */
export const setupPermissionGuard = (router) => {
	router.beforeEach(async (to) => {
		const token = session.token.get()
		if (!token) return
		await ensurePermission().catch(() => {}) // 拉取失败不阻断导航，交由下方兜底
		if (to.meta?.roles && !hasRole(to.meta.roles)) {
			return { path: "/error/403" }
		}
	})
}