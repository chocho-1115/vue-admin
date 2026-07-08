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
 * - 10000-19999: Generic errors
 *                e.g. invalid parameter, missing field, malformed JSON
 * - 20000-29999: Auth errors
 *                e.g. unauthorized (no token / invalid token), expired, forbidden, other client logged in
 * - 30000-39999: Business errors
 *                e.g. user not found, order not found, insufficient stock, payment failed
 * - 50000-59999: System errors
 *                e.g. database connection failed, cache unavailable, RPC timeout
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
  // AUTH_OTHER_CLIENT_LOGGED_IN: 20004,

  // Business errors (30000-39999) - Reserved
  USER_NOT_FOUND: 30001, // User not found
  // ORDER_NOT_FOUND: 30002,
  // INSUFFICIENT_STOCK: 30003,

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
  // [BIZ_CODES.AUTH_OTHER_CLIENT_LOGGED_IN]: 'Other client logged in',

  [BIZ_CODES.USER_NOT_FOUND]: 'User not found',
};
