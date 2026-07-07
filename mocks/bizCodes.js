/**
 * ==========================================
 * Business Status Codes
 * ==========================================
 *
 * Design:
 * - 0 = Success (industry standard)
 * - HTTP status = 200, business result = code
 *
 * Ranges:
 * - 0          : Success
 * - 10000-19999: Generic errors - parameter validation, request format, data parsing, etc.
 * - 20000-29999: Auth errors - missing token, invalid token, token expired, insufficient permissions, etc.
 * - 30000-39999: Business errors - order not found, insufficient stock, payment failed, etc.
 * - 50000-59999: System errors - database error, cache error, RPC timeout, file operation failed, etc.
 * ==========================================
 */

// ---------- Codes ----------
export const BIZ_CODES = {
  // Success
  SUCCESS: 0,

  // Generic errors (10000-19999)
  PARAM_INVALID: 10001,
  PARAM_MISSING: 10002,
  REQUEST_FORMAT_ERROR: 10003,

  // Auth errors (20000-29999)
  AUTH_UNAUTHORIZED: 20001,
  AUTH_EXPIRED: 20002,
  AUTH_FORBIDDEN: 20003,

  // Business errors (30000-39999) - Reserved
  // ORDER_NOT_FOUND: 30001,
  // INSUFFICIENT_STOCK: 30002,

  // System errors (50000-59999) - Reserved
  // DB_ERROR: 50001,
  // CACHE_ERROR: 50002,
};

// ---------- Messages ----------
export const BIZ_MESSAGES = {
  [BIZ_CODES.SUCCESS]: 'Success',

  [BIZ_CODES.PARAM_INVALID]: 'Invalid parameter',
  [BIZ_CODES.PARAM_MISSING]: 'Missing parameter',
  [BIZ_CODES.REQUEST_FORMAT_ERROR]: 'Invalid request format',

  [BIZ_CODES.AUTH_UNAUTHORIZED]: 'Unauthorized',
  [BIZ_CODES.AUTH_EXPIRED]: 'Expired',
  [BIZ_CODES.AUTH_FORBIDDEN]: 'Forbidden',
};

// ---------- Helpers ----------

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

/** Build success response */
export function buildSuccess(data, message = 'Success') {
  return {
    code: BIZ_CODES.SUCCESS,
    message,
    data,
    timestamp: Date.now(),
  };
}

/** Build error response */
export function buildError(code, data = null) {
  return {
    code,
    message: getMessage(code),
    data,
    timestamp: Date.now(),
  };
}