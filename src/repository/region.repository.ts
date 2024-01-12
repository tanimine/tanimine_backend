import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export class RegionRepository {
  async getAllRegion() {
    const regions = await prisma.region.findMany()
    return regions
  }
  async getRegionByCode(code: string) {
    const region = await prisma.region.findUnique({
      where: {
        code: code
      }
    })
    return region
  }
  async getRegionByName(name: string) {
    const region = await prisma.region.findFirst({
      where: {
        name: name
      }
    })
    return region
  }
  async getAllProvince() {
    const province = await prisma.$queryRaw`
    SELECT * FROM region
    WHERE LENGTH(code) = 2
  `
    return province
  }
  async getAllCity() {
    const city = await prisma.$queryRaw`
    SELECT * FROM region
    WHERE LENGTH(code) = 5
  `
    return city
  }
  async getAllDistrict() {
    const district = await prisma.$queryRaw`
    SELECT * FROM region
    WHERE LENGTH(code) = 8
  `
    return district
  }
  async getAllVillage() {
    const subdistrict = await prisma.$queryRaw`
    SELECT * FROM region
    WHERE LENGTH(code) = 13
  `
    return subdistrict
  }
  async getCityByProvinceCode(code: string) {
    const city = await prisma.$queryRaw`
    SELECT * FROM region
     WHERE LEFT(code, 2) = ${code}  AND LENGTH(code) = 5
    `
    return city
  }
  async getDistrictByCityCode(code: string) {
    const district = await prisma.$queryRaw`
    SELECT * FROM region
    WHERE LEFT(code, 5) = ${code} AND LENGTH(code) = 8
  `
    return district
  }
  async getVillageByDistrictCode(code: string) {
    const village = await prisma.$queryRaw`
    SELECT * FROM region
     WHERE LEFT(code, 8) = ${code}  AND LENGTH(code) = 13
  `
    return village
  }
}
