import request from '@/common/request'
import { dispatch } from '@/store'

export function getList(params) {
	return request({
		url: '/table/list',
		method: 'get',
		headers: { token: dispatch.login.getTokenStorage() },
		params,
	})
}
