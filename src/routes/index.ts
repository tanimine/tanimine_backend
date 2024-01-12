import { Router } from 'express'
import { Server } from 'socket.io'

import auth from './api/auth'
import region from './api/region'
const dataRoutes = (io: Server) => {
  const router = Router()
  router.use('/auth', auth)
  router.use('/region', region)
  return router
}
export default dataRoutes
