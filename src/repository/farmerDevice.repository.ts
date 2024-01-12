import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export class FarmerDeviceRepository {
  async createDeviceToken(token: string, farmerId: string) {
    return await prisma.farmer_device.create({
      data: {
        deviceToken: token,
        farmerId: farmerId
      }
    })
  }

  async findDeviceTokenByFarmerId(farmerId: string) {
    return await prisma.farmer_device.findFirst({
      where: {
        farmerId: farmerId
      }
    })
  }

  async deleteDeviceToken(id: string) {
    return await prisma.farmer_device.delete({
      where: {
        id: id
      }
    })
  }

  async updateDeviceToken(id: string, token: string) {
    return await prisma.farmer_device.update({
      where: {
        id: id
      },
      data: {
        deviceToken: token
      }
    })
  }

  async emptyDeviceToken(farmerId: string) {
    return await prisma.farmer_device.update({
      where: {
        id: farmerId
      },
      data: {
        deviceToken: null
      }
    })
  }
}
