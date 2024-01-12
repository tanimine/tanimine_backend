import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export class ChangePasswordTokenRepository {
  async createChangePasswordToken(data: any) {
    const userToken = await prisma.change_password_tokens.create({
      data: {
        userId: data.userId,
        expires: data.expires,
        token: data.token
      }
    })
    return userToken
  }
  async deleteChangePasswordToken(id: string) {
    const userToken = await prisma.change_password_tokens.delete({
      where: {
        id: id
      }
    })
    return userToken
  }
  async findChangePasswordTokenByToken(token: string) {
    const userToken = await prisma.change_password_tokens.findUnique({
      where: {
        token: token
      }
    })
    return userToken
  }

  async countChangePasswordTokenPerDayByUserId(userId: string, date: Date) {
    const userToken = await prisma.change_password_tokens.count({
      where: {
        userId: userId,
        expires: {
          gte: date
        }
      }
    })
    return userToken
  }
}
