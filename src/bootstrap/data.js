/**
 * Bootstrap of data
 */
import { createLogger } from '../services/logger'
import { hashPassword } from '../services/password'
import Account from '../models/account.model'
import Email from '../models/email.model'
import User from '../models/user.model'
import Event from '../models/event.model'
import Confirmation from '../models/confirmation.model'
import { createAccount } from '../controllers/account.controller'
import { SUPERADMIN } from '../constants/roles'
import Promise from 'bluebird'
import constants from '../constants'

const logger = createLogger('Bootstrap')

const accounts = [
  {
    user: {
      name: 'test_devery',
      email: 'test@devery.devery'
    },
    provider: constants.providers.EMAIL,
    password: '12345678',
    roles: [
      {
        type: SUPERADMIN
      }
    ]
  }
]

const bootstrapAccounts = () => {
  return Account.findOne().then(account => {
    if (account) {
      return Promise.resolve()
    }
    return Promise.all(
      accounts.map(data => {
        return hashPassword(data.password).then(hash => {
          return createAccount(
            data.provider,
            {
              password: hash,
              email: data.user.email,
              confirmed: true
            },
            data.user,
            data.roles
          )
        })
      })
    )
  })
}

export const bootstrap = () => {
  /***/ logger.info('Data...')

  Promise.resolve()
    .then(() => {
      if (process.env.FORCE_BOOTSTRAP_DATA === 'true') {
        Promise.all([
          Account.deleteMany().exec(),
          User.deleteMany().exec(),
          Confirmation.deleteMany().exec(),
          Email.deleteMany().exec(),
          Event.deleteMany().exec()
        ])
      }
    })
    .then(() => {
      bootstrapAccounts().then(() => {
        /***/ logger.info('Data finished.')
      })
    })
}
