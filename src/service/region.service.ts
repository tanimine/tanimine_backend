import { errorHandle } from '../utils'
import { RegionRepository } from '../repository'
import { getAllRegionSchema } from '../utils/validator'
const regionRepository = new RegionRepository()
export class RegionService {
  private failedOrSuccessRequest(status: string, data?: any) {
    return {
      status,
      data
    }
  }
  async getAllRegion(code: string, name: string, type: string) {
    const validateArgs = getAllRegionSchema.safeParse({ code, name, type })
    if (!validateArgs.success) return this.failedOrSuccessRequest('failed', errorHandle(validateArgs.error))
    let region
    if (type === 'province') region = await regionRepository.getAllProvince()
    else if (type === 'city' && code) region = await regionRepository.getCityByProvinceCode(code)
    else if (type === 'city') region = await regionRepository.getAllCity()
    else if (type === 'district' && code) region = await regionRepository.getDistrictByCityCode(code)
    else if (type === 'district') region = await regionRepository.getAllDistrict()
    else if (type === 'village' && code) region = await regionRepository.getVillageByDistrictCode(code)
    else if (type === 'village') region = await regionRepository.getAllVillage()
    else if (code) region = await regionRepository.getRegionByCode(code)
    else if (name) region = await regionRepository.getRegionByName(name)
    else region = await regionRepository.getAllRegion()

    return this.failedOrSuccessRequest('success', region)
  }
}
