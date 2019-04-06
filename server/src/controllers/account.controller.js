import jwt from 'jwt-simple'
import { createRegConfirmation, createPasswordResetConfirmation } from './confirmation.controller'
import { createDebugger, ACCOUNT } from '../services/debugger'
import { hashPassword, verifyPassword } from '../services/password'
import { getUser as getFacebookUser } from '../services/facebook'
import { getUser as getGoogleUser } from '../services/google'
import { getUser as getTwitterUser, initLogin as initTwitterLogin } from '../services/twitter'
import Promise from 'bluebird'
import Account from '../models/account.model'
import User from '../models/user.model'
import { USER } from '../constants/roles'
import { EMAIL, FACEBOOK, GOOGLE, TWITTER } from '../constants/providers'

const debug = createDebugger(ACCOUNT)

/**
 * Create account
 *
 * @param {String} provider Account provider
 * @param {Object} credentials Account credentials
 * @param {Object} user User data or document
 * @param {Array} [roles]
 *
 * @return {Promise} Promise resolved with new account
 *
 */
export function createAccount(provider, credentials, user, roles = [{ type: USER }]) {
  return Promise.resolve()
    .then(() => {
      if (!user._id) {
        return new User(user).save()
      }
      return user
    })
    .then(user => {
      return new Account({
        provider,
        credentials,
        roles,
        user
      }).save()
    })
}

export function createEmailAccount(email, password, user, roles) {
  return hashPassword(password).then(hashedPassword =>
    createAccount(EMAIL, { email: email, password: hashedPassword }, user, roles)
  )
}

export function createFbAccount(fbUserId, user, roles) {
  return createAccount(FACEBOOK, { fbUserId }, user, roles)
}

export function createGoogleAccount(gUserId, user, roles) {
  return createAccount(GOOGLE, { gUserId }, user, roles)
}

export function createTwitterAccount(twUserId, user, roles) {
  return createAccount(TWITTER, { twUserId }, user, roles)
}

/**
 * Confirm email account
 *
 * @param {String} id Account id
 *
 * @return {Promise} Promise resolved with confirmed account
 *
 */
export function confirmEmailAccount(id) {
  return Account.findById(id)
    .select('+credentials')
    .then(account => {
      if (!account) {
        return Promise.reject(`Cannot confirm account cause it cannot be found by id ${id}`)
      }
      account.credentials.confirmed = true
      account.markModified('credentials.confirmed')
      return account.save()
    })
}

/**
 * Set account password
 *
 * @param {String} id Account id
 * @param {String} password New password
 *
 * @return {Promise} Promise resolved with saved account
 *
 */
export function setPassword(id, password) {
  return hashPassword(password).then(hashedPassword => {
    return Account.findById(id)
      .select('+credentials')
      .then(account => {
        if (!account) {
          return Promise.reject(`Cannot set password cause acc cannot be found by id ${id}`)
        }
        account.credentials.password = hashedPassword
        account.markModified('credentials.password')
        return account.save()
      })
  })
}

/**
 * Get full account with roles and user by id
 *
 * @param {String} id Account id
 *
 * @return {Promise} Promise resolved with account or null if found nothing
 *
 */
export function getAccountFull(id) {
  return Account.findById(id)
    .select('+roles')
    .populate({ path: 'user', options: { lean: true } })
    .lean()
}

/**
 * Login
 *
 * @param {String} email
 * @param {String} password
 *
 * @return {Promise} Promise resolved with auth token
 *
 */
export function login(email, password) {
  return Account.findOne({
    provider: EMAIL,
    'credentials.email': email
  })
    .select('+credentials')
    .lean()
    .then(account => {
      if (account) {
        return verifyPassword(password, account.credentials.password).then(verified => {
          if (verified) {
            return account
          }
        })
      }
    })
    .then(account => {
      if (account) {
        return _issueToken(account)
      }
    })
}

/**
 * Login by facebook
 *
 * @param {String} fbUserId
 * @param {String} accessToken
 *
 * @return {Promise} Promise resolved with auth token
 *
 */
export function loginByFacebook(fbUserId, accessToken) {
  return getFacebookUser(fbUserId, accessToken).then(({ name, email }) => {
    return Account.findOne({
      provider: FACEBOOK,
      'credentials.fbUserId': fbUserId
    })
      .then(account => {
        if (!account) {
          return createFbAccount(fbUserId, { name, email })
        }
      })
      .then(account => {
        return _issueToken(account)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  })
}

/**
 * Login by google
 *
 * @param {String} code Google auth code
 *
 * @return {Promise} Promise resolved with auth token
 *
 */
export function loginByGoogle(code) {
  return getGoogleUser(code)
    .then(({ gUserId, name, email }) => {
      return Account.findOne({
        provider: GOOGLE,
        credentials: { gUserId }
      }).then(account => {
        if (!account) {
          return createGoogleAccount(gUserId, { name, email })
        }
        return account
      })
    })
    .then(account => {
      return _issueToken(account)
    })
}

/**
 * Init login by twitter
 *
 * @return {Promise} Promise resolved with twitter login url
 */
export function initLoginByTwitter() {
  return initTwitterLogin()
}

/**
 * Login by twitter
 *
 * @param {String} authToken
 * @param {String} authVerifier
 *
 * @return {Promise} Promise resolved with auth token
 *
 */
export function loginByTwitter(authToken, authVerifier) {
  return getTwitterUser(authToken, authVerifier)
    .then(({ twUserId, name, email }) => {
      return Account.findOne({
        provider: TWITTER,
        credentials: { twUserId }
      }).then(account => {
        if (!account) {
          return createTwitterAccount(twUserId, { name, email })
        }
        return account
      })
    })
    .then(account => {
      return _issueToken(account)
    })
}

/**
 * Register new account
 *
 * @param {String} email
 * @param {String} password
 * @param {String} name
 *
 * @return {Promise} Promise resolved with new account
 *
 */
export function register(email, password, name) {
  return Account.findOne({
    provider: EMAIL,
    'credentials.email': email
  })
    .then(account => {
      if (!account) {
        return createEmailAccount(email, password, { name, email })
      }
      return account
    })
    .then(account => {
      return createRegConfirmation(account, email)
    })
}

/**
 * Init password reset
 *
 * @param {String} email
 *
 * @return {Promise} Promise resolved with nothing
 *
 */
export function passwordReset(email) {
  return Account.findOne({
    provider: EMAIL,
    'credentials.email': email
  })
    .then(account => {
      if (account) {
        return createPasswordResetConfirmation(account, email)
      }
    })
    .then(() => {
      return
    })
}

/**
 * Get role stat
 *
 * @param {String} roleType Type of role
 *
 * @return {Promise} Promise resolved with role stat data (ex: {count: 10} })
 *
 */
export function getStat(roleType) {
  return Account.find({ 'roles.type': roleType })
    .lean()
    .count()
    .then(count => {
      return { count }
    })
}

/**
 * Find account by email
 * @param {String} email Email address
 *
 * @return {Promise} Promise resolved with account data
 */
export function findByEmail(email) {
  return Account.findOne({
    provider: EMAIL,
    'credentials.email': email
  })
}

/**
 * Validator isNotUsedEmail ::: "true" if email is not used
 */
export function isNotUsedEmail(email) {
  return Account.findOne({
    provider: EMAIL,
    'credentials.email': email
  })
    .select('+credentials')
    .lean()
    .then(account => {
      return !account || !account.credentials.confirmed ? true : false
    })
}

/**
 * Validator isConfirmed ::: "true" if email is confirmed
 */
export function isConfirmedEmail(email) {
  return Account.findOne({
    provider: EMAIL,
    'credentials.email': email
  })
    .select('+credentials')
    .lean()
    .then(account => {
      return account && account.credentials.confirmed ? true : false
    })
}

function _issueToken(account) {
  let now = new Date().getTime()
  let payload = {
    _id: account._id,
    expire: now + process.env.JWT_VALID_DAYS * 24 * 60 * 60 * 1000
  }
  let token = jwt.encode(payload, process.env.JWT_SECRET)
  return token
}
