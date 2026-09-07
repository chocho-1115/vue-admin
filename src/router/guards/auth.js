import isWhitePage from "../helpers/isWhitePage"
import { checkToken } from "@/api/login"
import { getPermission } from "@/api/permission"
import { hasRole } from "@/common/permission"
import { session } from "@/store"
import NProgress from "nprogress"
import "nprogress/nprogress.css"

NProgress.configure({
	showSpinner: false,
})

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
 * token 已确认有效后的统一出口：先补拉权限数据，再做目标路由的角色校验
 * —— 必须放在 beforeEach 而非 afterEach：首次导航时 before 先于页面渲染执行，
 * 若拖到 afterEach，受保护页会因未加载权限而被误判 403，菜单也会闪缺权限数据
 */
async function withPermission(to) {
	await ensurePermission().catch(() => {}) // 拉取失败不阻断导航，交由下方 token 流程兜底
	if (to.meta?.roles && !hasRole(to.meta.roles)) {
		return { path: "/error/403" }
	}
}

export const setupAuthGuard = (router) => {
	router.beforeEach(async (to) => {
		// start progress bar
		NProgress.start()
		// store token（内存态：已登录，直接校验角色后放行）
		const token = session.token.get()
		if (token) return withPermission(to)

		// cache token
		const cacheToken = session.token.getStorage()
		const needLogin = !isWhitePage(to.path)

		if (!cacheToken) {
			if (needLogin) {
				// blacklist pages that do not have permission to access are redirected to the login page.
				return {
					path: "/account/login",
					query: { redirect: to.fullPath || "/" },
				}
			} else {
				return
			}
		}

		if (!needLogin) {
			// 后台异步验证票据（不阻塞路由）
			checkToken().then(() => session.token.set(cacheToken)) // code == 200 才会执行then
			return // ✅ 立即跳转，不阻塞
		}

		try {
			await checkToken()
			session.token.set(cacheToken)
			// 跳转页面
			if (to.path === "/account/login") {
				return { path: to.query.redirect || "/" } // 这里不需要考虑 redirect === /account/login 因为不会这样设置，如果有也只是停留在登录页而已
			}
			return withPermission(to)
		} catch (error) {
			const res = error?.response?.data

			NProgress.done()

			// 接口拦截处会跳转到登录页面 这里就不跳转了
			// unauthorized (no token / invalid token), expired
			if (res && (res.code === 20001 || res.code === 20002)) {
				return false
			}
			// 如果是其他错误 如网络错误 500错误等
			// 抛出错误 终止跳转 保持停留在本页面 让用户去刷新重试
			throw error // 抛出错误 不跳转
		}
	})

	router.afterEach(async () => {
		NProgress.done()
	})
}