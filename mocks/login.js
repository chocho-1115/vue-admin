import {
  tokens,
} from './config'
import {
  response
} from './response.js'

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
        return response({
          status: 0,
          message: 'Account and password are incorrect.'
        })
      }
      return response({
        data: token
      })
    }
  },
  {
    path: '/login/logout',
    type: 'post',
    handler: () => {
      return response()
    }
  },
  {
    path: '/login/checkToken',
    type: 'get',
    handler: () => {
      return response()
    }
  },

];
