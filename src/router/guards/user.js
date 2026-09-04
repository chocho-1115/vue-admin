import { ctx, session, dispatch } from "@/store"
import { getInfo } from "@/api/user"

export const setupUserGuard = (router) => {
  router.afterEach(async () => {
    const hasUserInfo = ctx.userInfo.userId
    const cahceToken = session.login.getTokenStorage()
  
    if (!hasUserInfo && cahceToken) {
      const { data } = await getInfo()
      dispatch.user.saveInfo(data)
    }
  })
}