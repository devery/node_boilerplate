// debug namespaces
export const REQUEST = 'request'
export const RESPONSE = 'response'
export const DATABASE = 'database'
export const EVENTS = 'events'
export const ACCOUNT = 'account'

export const createDebugger = source => require('debug')(source)

export const isDebuggerOn = namespace =>
  process.env.DEBUG && process.env.DEBUG.indexOf(namespace) !== -1
