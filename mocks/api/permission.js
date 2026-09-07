import { permissions } from './common/config'
import { BIZ_CODES } from './common/bizCodes'
import { createSuccess, createError } from './common/responseHelpers'

export default [
  {
    path: '/permission',
    method: 'get',
    handler: ({ request }) => {
      const token = request.headers.get('token')
      const perm = permissions[token]
      if (!perm) {
        return createError(BIZ_CODES.AUTH_UNAUTHORIZED)
      }
      return createSuccess(perm)
    },
  },
];