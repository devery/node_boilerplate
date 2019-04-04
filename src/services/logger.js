/* Logger service

  Common usage:

  import { creatLogger } from 'services/logger'
  const logger = createLogger(namespace)
  ...
  logger.info(...)
  logger.warn(...)

*/

import winston from 'winston'

// set default log level.
var logLevel = process.env.LOG_LEVEL || 'trace'

// Set up logger
var customColors = {
  trace: 'white',
  debug: 'green',
  info: 'blue',
  warn: 'yellow',
  crit: 'red',
  fatal: 'red'
}

winston.addColors(customColors)

export const createLogger = namespace => {
  var logger = new winston.Logger({
    colors: customColors,
    level: logLevel,
    levels: {
      fatal: 0,
      crit: 1,
      warn: 2,
      info: 3,
      debug: 4,
      trace: 5
    },
    transports: [
      new winston.transports.Console({
        colorize: true,
        timestamp: process.env.NODE_ENV === 'production'
      })
    ]
  })

  // adding namespace to log message

  var origLog = logger.log

  logger.log = function(level, ...args) {
    let cloneArgs = args.slice(0)
    if (cloneArgs[0] instanceof Error) {
      cloneArgs[0] = cloneArgs[0].stack
      origLog.apply(logger, [level, '\x1b[36m[ ' + namespace + ' ]\x1b[0m'].concat(cloneArgs))
    } else {
      origLog.apply(logger, [level, '\x1b[36m[ ' + namespace + ' ]\x1b[0m'].concat(args))
    }
  }
  return logger
}
