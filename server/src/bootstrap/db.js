import { createLogger } from '../services/logger'
import mongoose from 'mongoose'
import util from 'util'
import { DATABASE as DB_NAMESPACE, isDebuggerOn } from '../services/debugger'
import { bootstrap as bootstrapData } from './data'

const logger = createLogger('Bootstrap')
const debugMongo = require('debug')('mongo')

require('dotenv').config()

// forwarding bluebird to mongoose instance
mongoose.Promise = require('bluebird')

// connect
mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true })
mongoose.connection.on('connected', function() {
  /***/ logger.info('DB connected')
})
mongoose.connection.on('error', function() {
  /***/ logger.fatal(`Unable to connect to database: ${process.env.MONGODB_URI}`)
})

// attach debug
if (isDebuggerOn(DB_NAMESPACE)) {
  mongoose.set('debug', (collectionName, method, query, doc) => {
    debugMongo(`${collectionName}.${method}`, util.inspect(query, false, 20), doc)
  })
}

// seed data

let isDataBootstraped = false
mongoose.connection.on('connected', function() {
  if (isDataBootstraped) return
  bootstrapData()
  isDataBootstraped = true
})

export default function() {}
