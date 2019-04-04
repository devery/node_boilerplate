import Promise from 'bluebird'
import cbCrypto from 'crypto'

const crypto = Promise.promisifyAll(cbCrypto)

const { WALLETS_CRYPTO_METHOD, WALLETS_CRYPTO_SECRET } = process.env

export const encrypt = data => {
  const cipher = crypto.createCipher(WALLETS_CRYPTO_METHOD, WALLETS_CRYPTO_SECRET)
  let crypted = cipher.update(data, 'utf8', 'hex')
  crypted += cipher.final('hex')
  return crypted
}

export const decrypt = data => {
  const decipher = crypto.createDecipher(WALLETS_CRYPTO_METHOD, WALLETS_CRYPTO_SECRET)
  let dec = decipher.update(data, 'hex', 'utf8')
  dec += decipher.final('utf8')
  return dec
}
