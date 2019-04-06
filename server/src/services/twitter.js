import Twitter from 'twitter'
import queryString from 'query-string'

let _tokenSecretsMap = {
  //
}

/**
 * Init twitter login
 *
 * @return {Promise} Promise resolved with twitter login url
 */
export function initLogin() {
  let client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_SECRET
  })

  return new Promise((resolve, reject) => {
    client.post(
      'https://api.twitter.com/oauth/request_token',
      {
        oauth_callback: encodeURIComponent(process.env.TWITTER_CALLBACK_URL)
      },
      (error, response, data) => {
        if (error && data && typeof data.body == 'string') {
          // maybe JSON parse error - parse by own
          try {
            data = queryString.parse(data.body)
          } catch (e) {
            return reject(error)
          }
        } else if (error) {
          return reject(error)
        }
        _tokenSecretsMap[data.oauth_token] = data.oauth_token_secret
        resolve(
          `https://api.twitter.com/oauth/authenticate?oauth_token=${
            data.oauth_token
          }&force_login=false`
        )
      }
    )
  })
}

/**
 * Get twitter user
 *
 * @param oauth_token
 * @param oauth_verifier
 *
 * @return {Promise} Promise resolved with twitter user data like {twUserId, name}
 */
export function getUser(oauth_token, oauth_verifier) {
  let client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: oauth_token,
    access_token_secret: _tokenSecretsMap[oauth_token]
  })

  return new Promise((resolve, reject) => {
    client.post(
      'https://api.twitter.com/oauth/access_token',
      {
        oauth_verifier
      },
      (error, response, data) => {
        if (error && data && typeof data.body == 'string') {
          // maybe JSON parse error - parse by own
          try {
            data = queryString.parse(data.body)
          } catch (e) {
            return reject(error)
          }
        } else if (error) {
          return reject(error)
        }
        resolve({
          twUserId: data.user_id,
          name: data.screen_name
        })
      }
    )
  })
}
