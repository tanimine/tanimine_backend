import { Router } from 'express'
import { getAllRegion } from '../../controllers/region.controller'
const router = Router()

router.get('/', getAllRegion)

export default router
