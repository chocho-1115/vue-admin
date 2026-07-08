import {
  tokens,
} from './common/config'
import { BIZ_CODES } from './common/bizCodes'
import { createSuccess, createError } from './common/responseHelpers'

export default [{
    path: '/login/loginByAccount',
    type: 'post',
    handler: async ({
      request
    }) => {
      const {
        username
      } = await request.json()
      const token = tokens[username]
      if (!token) {
        return createError(BIZ_CODES.USER_NOT_FOUND)
      }
      return createSuccess(token)
    }
  },
  {
    path: '/login/logout',
    type: 'post',
    handler: () => {
      return createSuccess()
    }
  },
  {
    path: '/login/checkToken',
    type: 'get',
    handler: () => {
      return createSuccess()
    }
  },

];
