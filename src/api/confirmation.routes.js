import { Router } from 'express'
import {
  resolveRegConfirmation,
  resolvePasswordResetConfirmation,
  isResolvable
} from '../controllers/confirmation.controller'
import { checkBody, checkParam, validate } from '../middleware/validation'
import { WRONG_REQUEST, VALIDATION_ERROR } from '../constants/errors'

const router = new Router()

/**
 * @api {put} /:id/register Resolve register confirmation
 * @apiName ResolveRegisterConfirmation
 * @apiGroup Confirmation
 *
 * @apiParam {String} id Confirmation id
 *
 * @apiError WRONG_REQUEST
 * @apiError INTERNAL_ERROR
 */
router.put(
  '/:id/register',
  validate([
    checkParam('id', WRONG_REQUEST).isObjectId(),
    checkParam('id', WRONG_REQUEST).custom(isResolvable)
  ]),
  _resolveRegisterConfirmationRequest
)

/**
 * @api {put} /:id/password_reset Resolve password reset confirmation
 * @apiName ResolvePasswordResetConfirmation
 * @apiGroup Confirmation
 *
 * @apiParam {String} id Confirmation id
 * @apiParam {String} password New password
 *
 * @apiError WRONG_REQUEST
 * @apiError VALIDATION_ERROR
 * @apiError INTERNAL_ERROR
 */
router.put(
  '/:id/password_reset',
  validate([
    checkParam('id', WRONG_REQUEST)
      .exists()
      .isObjectId()
      .custom(isResolvable),
    checkBody('password', WRONG_REQUEST).exists(),
    checkBody('password', VALIDATION_ERROR).isLength({
      min: process.env.PASSWORDS_REQUIRED_LENGTH
    })
  ]),
  _resolvePasswordResetConfirmationRequest
)

function _resolveRegisterConfirmationRequest(req, res) {
  resolveRegConfirmation(req.params.id)
    .then(() => {
      res.sendSuccess()
    })
    .catch(err => {
      res.sendError(err)
    })
}

function _resolvePasswordResetConfirmationRequest(req, res) {
  resolvePasswordResetConfirmation(req.params.id, req.body.password)
    .then(() => {
      res.sendSuccess()
    })
    .catch(err => {
      res.sendError(err)
    })
}

export default router
