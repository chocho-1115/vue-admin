import request from '@/common/request'

export function getInfo() {
  return request({
    url: '/user/info',
    method: 'get',
  })
}
