import { createEmail } from './email.controller'
import { confirmEmailAccount, setPassword } from '../controllers/account.controller'
import Confirmation from '../models/confirmation.model'
import { REGISTRATION, PASSWORD_RESET } from '../constants/confirmationTypes'
import { CREATED, RESOLVED } from '../constants/confirmationStatuses'

export function createRegConfirmation(account, email) {
  return new Confirmation({
    type: REGISTRATION,
    data: { accid: account._id }
  })
    .save()
    .then(confirmation => {
      return createEmail(email, process.env.MAIL_TEMPLATE_ID_REG, {
        cid: confirmation._id
      }).then(() => {
        return confirmation
      })
    })
}

export function resolveRegConfirmation(id) {
  return Confirmation.findById(id)
    .then(confirmation => {
      return confirmEmailAccount(confirmation.data.accid).then(() => {
        return confirmation
      })
    })
    .then(confirmation => {
      confirmation.status = RESOLVED
      return confirmation.save()
    })
}

export function createPasswordResetConfirmation(account, email) {
  return new Confirmation({
    type: PASSWORD_RESET,
    data: { accid: account._id }
  })
    .save()
    .then(confirmation => {
      return createEmail(email, process.env.MAIL_TEMPLATE_ID_PSW_RESET, {
        cid: confirmation._id
      }).then(() => {
        return confirmation
      })
    })
}

export function resolvePasswordResetConfirmation(id, password) {
  return Confirmation.findById(id)
    .then(confirmation => {
      return setPassword(confirmation.data.accid, password).then(() => {
        return confirmation
      })
    })
    .then(confirmation => {
      confirmation.status = RESOLVED
      return confirmation.save()
    })
}

/**
 * Validator ::: "true" if confirmation can be resolved
 */
export function isResolvable(id) {
  return Confirmation.findById(id)
    .lean()
    .then(confirmation => {
      return confirmation && confirmation.status === CREATED
    })
}
