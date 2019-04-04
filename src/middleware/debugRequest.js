/*
 * Just debugging request params.
 */

import { createDebugger, REQUEST } from '../services/debugger'

const debug = createDebugger(REQUEST)

export const debugRequestMiddleware = (req, res, next) => {
  let params = {}
  if (req.params) {
    params = Object.assign(params, req.params)
  }
  if (req.body) {
    params = Object.assign(params, req.body)
  }

  /***/ debug('params %o', params)

  next()
}
