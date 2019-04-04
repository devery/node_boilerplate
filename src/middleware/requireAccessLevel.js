/*
 * Checks access level for passing throught this route.
 *
 * Sends 403 error if account does not have required access level.
 *
 * Note: Uses "requireAuth" and "populateAuth" middleware by default
 */

import { WRONG_REQUEST, FORBIDDEN } from '../constants/errors'
import { requireAuth } from './requireAuth'
import { populateAuth } from './populateAuth'

/**
 * @param {Number} accessLevel Access level number
 *
 */
export const requireAccessLevel = accessLevel => {
  return (req, res, next) => {
    if (typeof accessLevel === 'undefined') {
      return res.sendError(WRONG_REQUEST, 400)
    }
    requireAuth(req, res, () => {
      populateAuth(req, res, () => {
        let roles = res.locals.account.roles,
          accountRole
        for (let i = 0, len = roles.length; i < len; i++) {
          if (accessLevel & roles[i].type) {
            accountRole = roles[i]
          }
        }
        if (!accountRole) {
          return res.sendError(FORBIDDEN, 403)
        }
        next()
      })
    })
  }
}
