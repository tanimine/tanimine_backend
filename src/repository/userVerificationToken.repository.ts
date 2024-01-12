import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export class UserVerificationTokenRepository {
  async createUserVerificationToken(data: any) {
    const userToken = await prisma.user_verification_tokens.create({
      data: {
        userId: data.userId,
        expires: data.expires,
        token: data.token
      }
    })
    return userToken
  }

  async deleteUserVerificationToken(id: string) {
    const userToken = await prisma.user_verification_tokens.delete({
      where: {
        id: id
      }
    })
    return userToken
  }

  async findUserVerificationTokenByToken(token: string) {
    const userToken = await prisma.user_verification_tokens.findFirst({
      where: {
        token: token
      }
    })
    return userToken
  }
}
