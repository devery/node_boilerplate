import { Router } from 'express'
import { requireAccessLevel } from '../middleware/requireAccessLevel'
import { checkParam, validate } from '../middleware/validation'
import { getStat } from '../controllers/event.controller'
import constants from '../constants'
import { WRONG_REQUEST } from '../constants/errors'
import { SUPERADMIN_ACCESS } from '../constants/accessLevels'

/**** Routes ****/

const router = new Router()
const eventTypes = Object.keys(constants.events)

/**
 * @api {get} /:type/stat Get stat of event by type
 * @apiName GetStat
 * @apiGroup Event
 *
 * @apiParam {String} type Event type

 * @apiSuccess {Object} stat Stat data
 * @apiSuccess {Number} stat.count Count of this event type
 *
 * @apiError FORBIDDEN
 * @apiError WRONG_REQUEST
 * @apiError INTERNAL_ERROR
 */
router.get(
  '/:type/stat',
  requireAccessLevel(SUPERADMIN_ACCESS),
  validate([checkParam('type', WRONG_REQUEST).isIn(eventTypes)]),
  _getStatRequest
)

function _getStatRequest(req, res) {
  getStat(req.params.type, req.query.cid)
    .then(stat => {
      res.sendSuccess(stat)
    })
    .catch(err => {
      res.sendError(err)
    })
}

export default router
