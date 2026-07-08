import {
  http
} from 'msw'
import login from './api/login'
import user from './api/user'
import table from './api/table'

const handlers = [
  ...login,
  ...user,
  ...table,
];

export default handlers.map(({
  method,
  path,
  handler
}) => {
  return http[method](`${import.meta.env.VITE_BASE_API}${path}`, handler)
})
