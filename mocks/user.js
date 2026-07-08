import {
  users
} from './config'
import {
  response
} from './response.js'

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
        return response({
          status: -1,
        })
      }
      return response({
        data: info
      })
    }
  },
];
