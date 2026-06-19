import request from '@/common/request'

export function login(data) {
  return request({
    url: '/login/loginByAccount',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

export function checkToken(params) {
  return request({
    url: '/login/checkToken',
    method: 'get',
    params
  })
}
