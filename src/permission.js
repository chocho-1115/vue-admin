import router, { isWhitePage } from './router'
import { getInfo } from './api/user'
import { checkToken } from './api/login'
import { ctx, dispatch } from './store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({
  showSpinner: false,
})

router.beforeEach(async (to) => {
  // start progress bar
  NProgress.start()
  // store token
  const token = ctx.login.token
  if (token) return

  // cache token
  const cahceToken = dispatch.login.getTokenStorage()
  const needLogin = !isWhitePage(to.path)

  if (!cahceToken) {
    if (needLogin) {
      // blacklist pages that do not have permission to access are redirected to the login page.
      return {
        path: '/account/login',
        query: { redirect: to.fullPath || '/' },
      }
    } else {
      return
    }
  }

  if (!needLogin) {
    // 后台异步验证票据（不阻塞路由）
    checkToken().then(() => (ctx.login.token = cahceToken)) // code == 200 才会执行then
    return // ✅ 立即跳转，不阻塞
  }

  try {
    await checkToken()
    ctx.login.token = cahceToken
    // 跳转页面
    if (to.path === '/account/login') {
      return { path: to.query.redirect || '/' } // 这里不需要考虑 redirect === /account/login 因为不会这样设置，如果有也只是停留在登录页而已
    }
    return
  } catch (error) {
    const res = error?.response?.data

    NProgress.done()

    // 如果是401 403接口拦截处会跳转到登录页面 这里就不跳转了
    // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
    if (res && (res.code === 50008 || res.code === 50012 || res.code === 50014)) {
      return false
    }
    // 如果是其他错误 如网络错误 500错误等
    // 抛出错误 终止跳转 保持停留在本页面 让用户去刷新重试
    throw error // 抛出错误 不跳转
  }
})

router.afterEach(async () => {
  NProgress.done()

  const hasUserInfo = ctx.userInfo.userId
  const cahceToken = dispatch.login.getTokenStorage()

  if (!hasUserInfo && cahceToken) {
    const { data } = await getInfo()
    dispatch.user.saveInfo(data)
  }
})
