import { dispatch } from '@/store'
import { isWhitePage } from '@/router'

import { EventBus } from '@/core/eventBus'

export function initHttpSubscriber() {
  EventBus.on('auth:unauthorized', () => {
    dispatch.login.removeToken()
    dispatch.user.removeInfo()
    if (!isWhitePage()) {
      dispatch.login.go()
    }
  })

  EventBus.on('auth:expired', () => {
    dispatch.login.removeToken()
    dispatch.user.removeInfo()
    if (!isWhitePage()) {
      dispatch.login.go()
    }
  })

  EventBus.on('request:error', ({ code, message, status, url }) => {
    console.log('统一错误日志上报', code, message, status, url)
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