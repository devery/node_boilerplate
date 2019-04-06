/*
 * Adds "sendError" method to response object
 *
 * Signature: sendError(err, status = 500)
 *
 * ex: res.sendError()
 * ex: res.sendError("Forbidden", 403)
 *
 * Note:
 * - injects "success=false" to any responses
 * - replaces server error objects to client readable objects like { success: false, type: <ERROR_TYPE> }
 */

import _ from 'lodash'
import * as errors from '../constants/errors'
import { createDebugger, RESPONSE } from '../services/debugger'

const debug = createDebugger(RESPONSE)
const predefinedErrors = Object.keys(errors)

export function sendErrorMiddleware(req, res, next) {
  res.sendError = (err, status) => {
    return _sendError(res, status)(err)
  }
  next()
}

function _getClientError(err) {
  if (typeof err === 'string' && _.indexOf(predefinedErrors, err) !== -1) {
    return { type: err }
  } else if (typeof err === 'object' && _.indexOf(predefinedErrors, err.type) !== -1) {
    return err
  } else {
    return { type: errors.INTERNAL_ERROR }
  }
}

function _getErrorStatus(error) {
  switch (error.type) {
    case errors.UNAUTHORIZED:
      return 401
    case errors.FORBIDDEN:
      return 403
    case errors.NOT_FOUND:
      return 404
    case errors.INTERNAL_ERROR:
      500
    default:
      return 400 // wrong request, etc
  }
}

function _sendError(res, status) {
  return err => {
    /***/ debug('Error %o', err)
    const clientError = _getClientError(err)
    const clientErrorStatus = status || _getErrorStatus(clientError)
    return res.status(clientErrorStatus).json({ success: false, error: clientError })
  }
}
