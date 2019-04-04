import constants from '../constants'
import Event from '../models/event.model'
import { createDebugger, EVENTS } from '../services/debugger'

const debug = createDebugger(EVENTS)

/**
 * Period of time for which events are grouped together
 */
const GROUP_PERIOD_IN_MIN = 4 * 60

/**
 * Add event
 *
 * @param {String} type Type of event
 * @param {String|ObjectId} user User id (optional)
 *
 * @return {Promise} With saved event data
 */
export const addEvent = (type, user = null) => {
  if (Object.keys(constants.events).indexOf(type) === -1) {
    const error = `Cannot add unknown event type ${type}.`
    /***/ debug(error)
    return Promise.reject(error)
  }
  /***/ debug('New event: "%s", user: %o', type, user)
  return _findGroup(type, user).then(group => {
    if (group) {
      group.count++
      group.updatedAt = Date.now()
      return group.save()
    } else {
      const event = new Event({
        type,
        user
      })
      return event.save()
    }
  })
}

/**
 * Get event stat
 *
 * @param {String} type Type of event
 * @param {String} uid User id (optional)
 *
 * @return {Promise} With saved event data
 */
export const getStat = (type, uid = null) => {
  let query = {
    $match: {
      type: type
    }
  }
  if (uid) {
    query.$match.user = mongoose.Types.ObjectId(uid)
  }
  return Event.aggregate(query, {
    $group: { _id: '$type', count: { $sum: '$count' } }
  }).then(data => {
    return { count: data.length ? data[0].count : 0 }
  })
}

function _findGroup(type, user) {
  const mustGreaterThanDate = Date.now() - GROUP_PERIOD_IN_MIN * 60 * 1000
  return Event.findOne({
    type: type,
    user: user,
    createdAt: { $gte: mustGreaterThanDate }
  })
}
