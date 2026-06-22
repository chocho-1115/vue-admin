import { dispatch } from '@/store'
import { isWhitePage } from '@/router'

import { EventBus } from '@/core/eventBus'

// to re-login
// ElMessageBox.confirm(
//   'You have been logged out, you can cancel to stay on this page, or log in again',
//   'Confirm logout', {
//     confirmButtonText: 'Re-Login',
//     cancelButtonText: 'Cancel',
//     type: 'warning'
//   }).then(() => {
//   location.reload()
// })

export function initHttpSubscriber() {
  // 50008: Illegal token
  EventBus.on('auth:unauthorized', () => {
    dispatch.login.removeToken()
    dispatch.user.removeInfo()
    if (!isWhitePage()) {
      dispatch.login.go()
    }
  })
  // 50012: Other clients logged in; 50014: Token expired;
  EventBus.on('auth:expired', () => {
    dispatch.login.removeToken()
    dispatch.user.removeInfo()
    if (!isWhitePage()) {
      dispatch.login.go()
    }
  })

  EventBus.on('request:error', ({ code, message, status, url }) => {
    console.log('统一错误日志上报:', {code, message, status, url})
    ElMessage({
      message: message || 'Error',
      type: 'error',
      duration: 5 * 1000,
    })
  })

}

export function destroyHttpSubscriber() {
  EventBus.off('auth:unauthorized')
  EventBus.off('auth:expired')
  EventBus.off('request:error')
}

export default { initHttpSubscriber, destroyHttpSubscriber }