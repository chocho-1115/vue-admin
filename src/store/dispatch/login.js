import router from '@/router'

import { getTokenStorage, saveTokenStorage, removeTokenStorage } from '../storage'
import ctx from '../context'

const state = ctx.login

export default {
  getTokenStorage,
  saveToken(token){
    saveTokenStorage(token)
    state.token = token
  },
  removeToken(){
    removeTokenStorage()
    state.token = ''
  },
  go() {
    if(router.currentRoute.value.path === '/account/login') return
    router.push(`/account/login?redirect=${router.currentRoute.value.fullPath || '/'}`)
  },
}
