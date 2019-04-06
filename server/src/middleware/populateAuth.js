/*
 * Populates auth "assign property" (see requireAuth middleware)
 *
 * Sends 401 error if account not found
 */

import { ACCOUNT_ID_PROPERTY } from './requireAuth'
import Account from '../models/account.model'

export const populateAuth = (req, res, next) => {
  Account.findById(req[ACCOUNT_ID_PROPERTY])
    .select('+roles')
    .lean()
    .then(account => {
      if (!account) {
        res.sendError('', 401)
        return
      }
      req.userId = String(account.user)
      res.locals.account = account
      next()
    })
    .catch(err => {
      res.sendError(err)
    })
}
