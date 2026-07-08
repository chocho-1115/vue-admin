import {
  HttpResponse
} from 'msw'
import { BIZ_CODES } from './bizCodes'

const getCode = (status, message) => {
  const res = {}
  switch (status) {
    case 1:
      res.code = 0
      res.message = message || 'Success'
      break;
    case -1:
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      res.code = 50008
      res.message = message || 'Illegal token'
      break;
    default:
      res.code = 40000
      res.message = message || 'Error'
  }
  return res
}

export const response = ({
  status = 1,
  message,
  data
} = {}) => {
  const res = {}
  Object.assign(res, getCode(status, message))

  if (data) res['data'] = data
  return HttpResponse.json(res)
}
