import { ctx, session, dispatch } from "@/store"
import { getInfo } from "@/api/user"

export const setupUserGuard = (router) => {
	router.afterEach(async () => {
		const hasUserInfo = ctx.userInfo.userId
		const cacheToken = session.login.getTokenStorage()

		if (!hasUserInfo && cacheToken) {
			const { data } = await getInfo()
			dispatch.user.saveInfo(data)
		}
	})
}