import { users } from '../config'
import { BIZ_CODES } from '../bizCodes'
import { createSuccess, createError } from '../responseHelpers'
export default [
  {
    path: '/user/info',
    type: 'get',
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
