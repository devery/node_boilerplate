import axios from 'axios'
import queryString from 'query-string'

const graph = (url, params = {}) => {
  return axios.get(`https://graph.facebook.com/${url}?${queryString.stringify(params)}`)
}

const parseError = (req, defaultValue) =>
  req && req.response && req.response.data && req.response.data.error
    ? req.response.data.error
    : defaultValue

export function getUser(fbUserId, accessToken) {
  return graph(fbUserId, {
    fields: 'name,email',
    access_token: accessToken
  })
    .then(resp => {
      return resp.data
    })
    .catch(err => {
      return Promise.reject(parseError(err, err))
    })
}
