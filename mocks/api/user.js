import { users } from './common/config'
import { BIZ_CODES } from './common/bizCodes'
import { createSuccess, createError } from './common/responseHelpers'
export default [
  {
    path: '/user/info',
    method: 'get',
    handler: ({
      request
    }) => {
      const token = request.headers.get('token')
      const info = users[token]
      if (!info) {
        return createError(BIZ_CODES.AUTH_UNAUTHORIZED)
      }
      return createSuccess(info)
    }
  },
];
