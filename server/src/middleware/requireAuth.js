/*
 * Checks if account is logged in.
 *
 * Sends 401 error if user is not logged in.
 */

import passport from 'passport'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'

require('dotenv').config()

// Setup options for JWT strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeader(),
  secretOrKey: process.env.JWT_SECRET
}

// Create JWT strategy
// payload: decoded jwt token
// done: callback function
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  let now = new Date().getTime()
  let expireDate = new Date(payload.expire).getTime()
  if (expireDate < now) {
    done(null, false)
    return
  }
  done(null, payload._id)
})

passport.use(jwtLogin)

export const ACCOUNT_ID_PROPERTY = '__auth_id__'

export const requireAuth = passport.authenticate('jwt', {
  session: false,
  assignProperty: ACCOUNT_ID_PROPERTY
})
