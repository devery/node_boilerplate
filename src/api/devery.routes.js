import { Router } from 'express'
import { requireAuth } from '../middleware/requireAuth'
import { getApps, getAppByAddress } from '../controllers/devery.controller'

const router = new Router()

router.route('/').get(requireAuth, getApps)

router.route('/:address').get(requireAuth, getAppByAddress)

export default router
