import request from '@/common/request'

export function test_404() {
  return request({
    url: '/404',
    method: 'get',
  })
}

export function test_500() {
  return request({
    url: '/500',
    method: 'get',
  })
}
