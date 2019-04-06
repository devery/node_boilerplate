import { OAuth2Client } from 'google-auth-library'

const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'postmessage'
)

/**
 * Get google user by auth code
 *
 * @param {String} code Google auth code
 *
 * @return {Promise} Promise resolved with google user data, like ({gUserId, name, email})
 */
export function getUser(code) {
  return oauth2Client
    .getToken(code)
    .then(resp => {
      if (resp && resp.tokens && resp.tokens.access_token) {
        return resp.tokens
      } else {
        return Promise.reject('Cannot get google access token cause', resp)
      }
    })
    .then(tokens => {
      return oauth2Client
        .verifyIdToken({
          idToken: tokens.id_token,
          audience: process.env.GOOGLE_CLIENT_ID
        })
        .then(vtoken => vtoken.getPayload())
    })
    .then(data => {
      data.gUserId = data.sub
      return data
    })
}
