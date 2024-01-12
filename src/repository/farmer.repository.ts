import { PrismaClient } from '@prisma/client'
import { FarmerInput } from '../types/farmer'
const prisma = new PrismaClient()

export class FarmerRepository {
  async createFarmer(data: FarmerInput) {
    const farmer = await prisma.farmers.create({
      data: {
        userId: data.userId,
        name: data.name,
        phone: data.phone,
        provinceId: data.provinceId,
        cityId: data.cityId,
        districtId: data.districtId,
        villageId: data.villageId,
        address: data.address
      }
    })
    return farmer
  }

  async findFarmerByUserId(userId: string) {
    return await prisma.farmers.findFirst({
      where: {
        userId: userId
      }
    })
  }
}
