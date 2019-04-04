import { Router } from 'express'
import { requireAuth, ACCOUNT_ID_PROPERTY } from '../middleware/requireAuth'
import { requireAccessLevel } from '../middleware/requireAccessLevel'
import { checkBody, checkParam, validate } from '../middleware/validation'
import {
  login,
  loginByFacebook,
  loginByGoogle,
  loginByTwitter,
  initLoginByTwitter,
  register,
  passwordReset,
  getAccountFull,
  isNotUsedEmail,
  isConfirmedEmail,
  getStat
} from '../controllers/account.controller'
import { SUPERADMIN_ACCESS } from '../constants/accessLevels'
import {
  WRONG_REQUEST,
  VALIDATION_ERROR,
  UNAUTHORIZED,
  WRONG_LOGIN_OR_PASSWORD,
  EMAIL_ALREADY_IN_USE,
  EMAIL_IS_NOT_CONFIRMED
} from '../constants/errors'

const router = new Router()

/**
 * @api {post} /login Login account
 * @apiName LoginAccount
 * @apiGroup Account
 *
 * @apiParam {String} email Account email
 * @apiParam {String} password Account password
 *
 * @apiSuccess {String} token Account auth token
 *
 * @apiError WRONG_REQUEST
 * @apiError VALIDATION_ERROR
 * @apiError WRONG_LOGIN_OR_PASSWORD
 * @apiError INTERNAL_ERROR
 */
router.post(
  '/login',
  validate([
    checkBody(['email', 'password'], WRONG_REQUEST).exists(),
    checkBody('email', VALIDATION_ERROR)
      .isEmail()
      .normalizeEmail(),
    checkBody('email', EMAIL_IS_NOT_CONFIRMED).custom(isConfirmedEmail),
    checkBody('password', VALIDATION_ERROR).isLength({
      min: process.env.PASSWORDS_REQUIRED_LENGTH
    })
  ]),
  _loginRequest
)

/**
 * @api {post} /login/facebook Login by facebook
 * @apiName LoginAccountByFacebook
 * @apiGroup Account
 *
 * @apiParam {String} fbUserId Facebook user id
 * @apiParam {String} accessToken Facebook user access token
 *
 * @apiSuccess {String} token Account auth token
 *
 * @apiError WRONG_REQUEST
 * @apiError INTERNAL_ERROR
 */
router.post(
  '/login/facebook',
  validate([checkBody(['fbUserId', 'accessToken'], WRONG_REQUEST).exists()]),
  _loginFacebookRequest
)

/**
 * @api {post} /login/google Login by google
 * @apiName LoginAccountByGoogle
 * @apiGroup Account
 *
 * @apiParam {String} code Google auth code
 *
 * @apiSuccess {String} token Account auth token
 *
 * @apiError WRONG_REQUEST
 * @apiError INTERNAL_ERROR
 */
router.post(
  '/login/google',
  validate([checkBody(['code'], WRONG_REQUEST).exists()]),
  _loginGoogleRequest
)

/**
 * @api {get} /login/twitter Init twitter login
 * @apiName InitLoginByTwitter
 * @apiGroup Account
 *
 * @apiSuccess {String} loginUrl Twitter login url
 *
 * @apiError WRONG_REQUEST
 * @apiError INTERNAL_ERROR
 */
router.get('/login/twitter', _initTwitterLoginRequest)

/**
 * @api {post} /login/twitter Login by twitter
 * @apiName LoginAccountByTwitter
 * @apiGroup Account
 *
 * @apiParam {String} authToken
 * @apiParam {String} authVerifier
 *
 * @apiSuccess {String} token Account auth token
 *
 * @apiError WRONG_REQUEST
 * @apiError INTERNAL_ERROR
 */
router.post(
  '/login/twitter',
  validate([checkBody(['authToken', 'authVerifier'], WRONG_REQUEST).exists()]),
  _loginTwitterRequest
)

/**
 * @api {post} / Register user account
 * @apiName RegisterAccount
 * @apiGroup Account
 *
 * @apiParam {String} email Account email
 * @apiParam {String} password Account password
 * @apiParam {String} name User name
 *
 * @apiSuccess {String} token Account auth token
 *
 * @apiError WRONG_REQUEST
 * @apiError VALIDATION_ERROR
 * @apiError EMAIL_ALREADY_IN_USE
 * @apiError INTERNAL_ERROR
 */
router.post(
  '/register',
  validate([
    checkBody(['email', 'password', 'name'], WRONG_REQUEST)
      .exists()
      .not()
      .isEmpty(),
    checkBody('email', VALIDATION_ERROR)
      .isEmail()
      .normalizeEmail(),
    checkBody('email', EMAIL_ALREADY_IN_USE).custom(isNotUsedEmail),
    checkBody('password', VALIDATION_ERROR).isLength({
      min: process.env.PASSWORDS_REQUIRED_LENGTH
    })
  ]),
  _registerRequest
)

/**
 * @api {get} /me Get account data
 * @apiName GetAccount
 * @apiGroup Account
 *
 * @apiSuccess {Object} account
 * @apiSuccess {String} account._id
 * @apiSuccess {Object[]} account.roles Account roles
 * @apiSuccess {String} account.roles._id Role id
 * @apiSuccess {String} account.roles.type Role type
 * @apiSuccess {Date} account.createdAt Account created date
 *
 * @apiError FORBIDDEN
 * @apiError UNAUTHORIZED
 * @apiError INTERNAL_ERROR
 */
router.get('/me', requireAuth, _getMeRequest)

/**
 * @api {post} /password_reset Init twitter login
 * @apiName InitPasswordReset
 * @apiGroup Account
 *
 * @apiParam {String} email Account email
 *
 * @apiError WRONG_REQUEST
 * @apiError INTERNAL_ERROR
 */
router.post(
  '/password_reset',
  validate([
    checkBody('email', WRONG_REQUEST)
      .isEmail()
      .normalizeEmail()
  ]),
  _passwordResetRequest
)

/**
 * @api {get} /stat Get accounts role stat
 * @apiName GetStat
 * @apiGroup Account
 *
 * @apiParam {String} type Type of role
 *
 * @apiSuccess {Object} stat
 * @apiSuccess {Number} stat.count Count of account with that role
 *
 * @apiError WRONG_REQUEST
 * @apiError FORBIDDEN
 * @apiError INTERNAL_ERROR
 */
router.get(
  '/stat/:type',
  requireAccessLevel(SUPERADMIN_ACCESS),
  validate([
    checkParam('type', WRONG_REQUEST)
      .exists()
      .toInt()
  ]),
  _getStatRequest
)

function _loginRequest(req, res) {
  login(req.body.email, req.body.password)
    .then(token => {
      if (!token) {
        return res.sendError(WRONG_LOGIN_OR_PASSWORD)
      }
      return res.sendSuccess({ token })
    })
    .catch(err => {
      res.sendError(err)
    })
}

function _loginFacebookRequest(req, res) {
  loginByFacebook(req.body.fbUserId, req.body.accessToken)
    .then(token => {
      return res.sendSuccess({ token })
    })
    .catch(err => {
      res.sendError(err)
    })
}

function _loginGoogleRequest(req, res) {
  loginByGoogle(req.body.code)
    .then(token => {
      return res.sendSuccess({ token })
    })
    .catch(err => {
      res.sendError(err)
    })
}

function _initTwitterLoginRequest(req, res) {
  initLoginByTwitter()
    .then(loginUrl => {
      res.sendSuccess({ loginUrl })
    })
    .catch(err => {
      res.sendError(err)
    })
}

function _loginTwitterRequest(req, res) {
  loginByTwitter(req.body.authToken, req.body.authVerifier)
    .then(token => {
      return res.sendSuccess({ token })
    })
    .catch(err => {
      res.sendError(err)
    })
}

function _registerRequest(req, res) {
  register(req.body.email, req.body.password, req.body.name)
    .then(() => {
      return res.sendSuccess()
    })
    .catch(err => {
      res.sendError(err)
    })
}

function _getMeRequest(req, res) {
  getAccountFull(req[ACCOUNT_ID_PROPERTY])
    .then(account => {
      if (!account) {
        return res.sendError(UNAUTHORIZED)
      }
      res.sendSuccess({ account: account })
    })
    .catch(err => {
      res.sendError(err)
    })
}

function _passwordResetRequest(req, res) {
  passwordReset(req.body.email)
    .then(() => {
      res.sendSuccess()
    })
    .catch(err => {
      res.sendError(err)
    })
}

function _getStatRequest(req, res) {
  getStat(req.params.type)
    .then(stat => {
      res.sendSuccess({ stat })
    })
    .catch(err => {
      res.sendError(err)
    })
}

export default router
