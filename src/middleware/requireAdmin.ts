import { getResponse } from '../utils'
import { NextFunction, Request, Response } from 'express'

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return getResponse(res, 401, 'Unauthorized', {})
  }
  if (req.user.role !== 'admin') {
    return getResponse(res, 403, 'Forbidden', {})
  }
  return next()
}
