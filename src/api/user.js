import request from '@/common/request'
import { dispatch } from '@/store'

export function getInfo() {
	return request({
		url: '/user/info',
		headers: { token: dispatch.login.getTokenStorage() },
		method: 'get',
	})
}
