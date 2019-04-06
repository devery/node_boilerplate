/*
 * Adds "sendSuccess" method to response object
 *
 * Signature: sendSuccess(data, status = 200)
 *
 * ex: res.sendSuccess()
 * ex: res.sendSuccess({ok: true}, 202)
 *
 * Note: injects "success=true" to any responses
 */

import _ from 'lodash'
import { createDebugger, RESPONSE } from '../services/debugger'

const debug = createDebugger(RESPONSE)

const _sendSuccess = (res, status = 200) => {
  return (data = {}) => {
    /***/ debug('Success %o', data)
    return res.status(status).json(_.assign({ success: true }, data))
  }
}

export const sendSuccessMiddleware = (req, res, next) => {
  res.sendSuccess = (data, status) => {
    return _sendSuccess(res, status)(data)
  }
  next()
}
