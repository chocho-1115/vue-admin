import router, { isWhitePage } from './router'
import {
  getInfo
} from './api/user'
import {
  ctx,
  dispatch
} from './store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({
  showSpinner: false,
})

router.beforeEach(async (to, from) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = to.meta.title ? `${to.meta.title} - Vue Admin` : `Vue Admin`

  // determine whether the user has logged in
  const hasToken = dispatch.login.getTokenStorage()

  if (hasToken) {

    if (to.path === '/account/login') {
      // if is logged in, redirect to the home page
      NProgress.done()
      return {
        path: '/',
      }
    } else {
      const hasUserInfo = ctx.userInfo.name

      if (hasUserInfo) {
        return
      } else {
        try {
          // get user info
          const {
            body
          } = await getInfo(hasToken)
          if (!body) {
            throw new Error("Verification failed, please Login again.");
          }
          dispatch.user.saveInfo(body)
          return
        } catch (error) {
          // remove token and go to login page to re-login
          dispatch.login.removeToken()
          dispatch.user.removeInfo()
          ElMessage.error(error || 'Has Error')
          if (isWhitePage(to.path)) {
            return
          }else{
            NProgress.done()
            return {
              path: '/account/login', 
              query: { redirect: to.fullPath || '/' } 
            }
          }
        }
      }
    }
  } else {
    /* has no token*/

    if (isWhitePage(to.path)) {
      // in the free login whitelist, go directly
      return
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      NProgress.done()
      return {
        path: '/account/login', 
        query: { redirect: to.fullPath || '/' } 
      }
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
