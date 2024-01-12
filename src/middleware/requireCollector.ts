import { getResponse } from '../utils'
import { NextFunction, Request, Response } from 'express'

export function requireCollector(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return getResponse(res, 401, 'Unauthorized', {})
  }
  if (req.user.role !== 'collector') {
    return getResponse(res, 403, 'Forbidden', {})
  }
  return next()
}
