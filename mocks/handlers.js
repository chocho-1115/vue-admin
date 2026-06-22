import {
  http
} from 'msw'
import login from './login'
import user from './user'
import table from './table'
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
