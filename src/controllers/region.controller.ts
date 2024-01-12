import { getResponse, getHttpCode } from '../utils'
import { RegionService } from '../service'
import { Request, Response } from 'express'

const regionService = new RegionService()

const getAllRegion = async (req: Request, res: Response) => {
  const { code, name, type } = req.query
  const result = await regionService.getAllRegion(code as string, name as string, type as string)
  if (result.status === 'failed') {
    return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, result.data, null)
  }
  return getResponse(res, getHttpCode.OK, 'Berhasil mendapatkan data wilayah', result.data)
}

export { getAllRegion }
