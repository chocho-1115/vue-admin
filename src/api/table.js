import request from '@/common/request'

export function getList(params) {
  return request({
    url: '/table/list',
    method: 'get',
    params
  })
}
