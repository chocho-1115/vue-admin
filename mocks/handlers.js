import {
  http
} from 'msw'
import login from './api/login'
import user from './api/user'
import table from './api/table'
// // { request, params, cookies }
const handlers = [
  ...login,
  ...user,
  ...table,
];

export default handlers.map(({
  type,
  path,
  handler
}) => {
  return http[type](`${import.meta.env.VITE_BASE_API}${path}`, handler)
})
