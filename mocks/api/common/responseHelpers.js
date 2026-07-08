import {
  HttpResponse
} from 'msw'
import { BIZ_CODES, BIZ_MESSAGES } from './bizCodes'

/** Check if code is success */
export function isSuccess(code) {
  return code === BIZ_CODES.SUCCESS;
}

/** Check if code is auth error */
export function isAuthError(code) {
  return code >= 20000 && code < 30000;
}

/** Get message by code */
export function getMessage(code, fallback = 'Error') {
  return BIZ_MESSAGES[code] || fallback;
}

/** Create success response */
export function createSuccess(data, message = 'Success') {
  return HttpResponse.json({
    code: BIZ_CODES.SUCCESS,
    message,
    data,
    timestamp: Date.now(),
  });
}

/** Create error response */
export function createError(code, data = null) {
  return HttpResponse.json({
    code,
    message: getMessage(code),
    data,
    timestamp: Date.now(),
  });
}