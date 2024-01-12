import type { FarmerInput, ResetPasswordInput } from '../types'
import {
  signUpSchema,
  signInSchema,
  verifyAccountSchema,
  forgotPasswordSchema,
  changePasswordSchema
} from '../utils/validator'
import { errorHandle, sendMail } from '../utils'
import { indonesiaPhoneNumberFormat } from '../helper'
import { signJWT } from '../config/jwt'
import {
  FarmerRepository,
  UserRepository,
  UserVerificationTokenRepository,
  FarmerDeviceRepository,
  ChangePasswordTokenRepository
} from '../repository'
import argon2 from 'argon2'
import { v4 as uuidv4 } from 'uuid'
const farmerRepository = new FarmerRepository()
const farmerDeviceRepository = new FarmerDeviceRepository()
const userRepository = new UserRepository()
const userVerificationTokenRepository = new UserVerificationTokenRepository()
const changePasswordTokenRepository = new ChangePasswordTokenRepository()
export class AuthService {
  private failedOrSuccessRequest(status: string, data?: any) {
    return {
      status,
      data
    }
  }

  private hashData(data: string) {
    return argon2.hash(data)
  }

  private checkPassword(password: string, hashedPassword: string) {
    return argon2.verify(hashedPassword, password)
  }

  private generateUniqueToken() {
    const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let token = ''
    for (let i = 0; i < 7; i++) {
      token += alphabet[Math.floor(Math.random() * alphabet.length)]
    }
    return token
  }

  async signUp(email: string, password: string, confirmPassword: string, role: string, data: FarmerInput) {
    const validateArgs = signUpSchema.safeParse({ email, password, confirmPassword, role, data })
    if (!validateArgs.success) {
      return this.failedOrSuccessRequest('failed', errorHandle(validateArgs.error))
    }
    const hashedPassword = await this.hashData(password)
    const phoneNumber = indonesiaPhoneNumberFormat(data.phone)

    // check email
    const checkEmail = await userRepository.findUserByEmail(email)
    if (checkEmail) {
      return this.failedOrSuccessRequest('failed', 'Email sudah terdaftar')
    }

    // TODO: create user
    let user
    try {
      user = await userRepository.createUser({ email, role, password: hashedPassword })
    } catch (error) {
      console.log(error)
      return this.failedOrSuccessRequest('failed', 'Gagal membuat user')
    }

    // TODO: Create the userVerificationToken to database
    const userVerificationToken = uuidv4() + '-' + uuidv4()
    let resultUVTReq
    try {
      const expiresTime = 15 * 60 * 1000 // 15 minutes
      const hashedUserVerificationToken = await this.hashData(userVerificationToken)
      resultUVTReq = await userVerificationTokenRepository.createUserVerificationToken({
        expires: new Date(new Date().getTime() + expiresTime),
        token: hashedUserVerificationToken,
        userId: user.id
      })
    } catch (error) {
      await userRepository.deleteUser(user.id)
    }

    if (!resultUVTReq) {
      return this.failedOrSuccessRequest('failed', 'Gagal membuat user')
    }

    try {
      switch (role) {
        case 'farmer':
          await farmerRepository.createFarmer({ ...data, userId: user.id, phone: phoneNumber })
          break
        case 'offtaker':
          break
        default:
          return this.failedOrSuccessRequest('failed', 'Invalid role')
      }
    } catch (error) {
      await userVerificationTokenRepository.deleteUserVerificationToken(resultUVTReq.id)
      await userRepository.deleteUser(user.id)
      return this.failedOrSuccessRequest('failed', 'Gagal membuat user')
    }

    // send email verification
    try {
      sendMail(email, 'Verifikasi Email', resultUVTReq, 'verify-email')
    } catch (error) {
      await userVerificationTokenRepository.deleteUserVerificationToken(resultUVTReq.id)
      return this.failedOrSuccessRequest('failed', error)
    }
    return this.failedOrSuccessRequest('success', {})
  }

  async verifyEmail(token: string, id: string) {
    const validateArgs = verifyAccountSchema.safeParse({ token, id })
    if (!validateArgs.success) {
      return this.failedOrSuccessRequest('failed', errorHandle(validateArgs.error))
    }
    try {
      const userVerificationToken = await userVerificationTokenRepository.findUserVerificationTokenByToken(token)
      if (!userVerificationToken) {
        return this.failedOrSuccessRequest('failed', 'Token tidak valid')
      }
      // check token expires
      if (new Date() > userVerificationToken.expires) {
        await userVerificationTokenRepository.deleteUserVerificationToken(userVerificationToken.id)
        return this.failedOrSuccessRequest('failed', 'Token sudah kadaluarsa')
      }
      const verify = await userRepository.verifyUser(id)
      if (!verify) {
        return this.failedOrSuccessRequest('failed', 'Gagal verifikasi')
      }
      await userVerificationTokenRepository.deleteUserVerificationToken(userVerificationToken.id)
    } catch (error) {
      return this.failedOrSuccessRequest('failed', error)
    }
    return this.failedOrSuccessRequest('success', {})
  }

  async signIn(email: string, password: string, deviceToken: string) {
    const validateArgs = signInSchema.safeParse({ email, password })
    if (!validateArgs.success) {
      return this.failedOrSuccessRequest('failed', errorHandle(validateArgs.error))
    }
    try {
      const user = await userRepository.findUserByEmail(email)
      if (!user) {
        return this.failedOrSuccessRequest('failed', 'Email atau password salah')
      }
      const checkUser = await this.checkPassword(password, user.password)
      if (!checkUser) {
        return this.failedOrSuccessRequest('failed', 'Email atau password salah')
      }
      let userDetail
      switch (user.roles) {
        case 'farmer':
          userDetail = await farmerRepository.findFarmerByUserId(user.id)
          if (!userDetail) {
            return this.failedOrSuccessRequest('failed', 'Email atau password salah')
          }
          // if device token not exist, create device token
          const checkDeviceToken = await farmerDeviceRepository.findDeviceTokenByFarmerId(userDetail.id)
          if (!checkDeviceToken) {
            await farmerDeviceRepository.createDeviceToken(deviceToken, userDetail.id)
          } else {
            await farmerDeviceRepository.updateDeviceToken(checkDeviceToken.id, deviceToken)
          }
          // manipulate data
          userDetail = {
            farmerId: userDetail?.id,
            name: userDetail?.name
          }
      }
      const accesToken = signJWT({ id: user.id, email: user.email, role: user.roles, userDetail }, '1d')
      const refreshToken = signJWT({ id: user.id, email: user.email, role: user.roles, userDetail }, '7d')

      //save refresh token to database
      await userRepository.updateUserLogin(user.id, refreshToken)
      return this.failedOrSuccessRequest('success', { accesToken, refreshToken })
    } catch (error) {
      return this.failedOrSuccessRequest('failed', error)
    }
  }

  async logout(userId: string, userDetail: any) {
    try {
      // Check user has session
      const user = await userRepository.findUserById(userId)
      if (!user?.has_session && !user?.refreshToken) {
        return this.failedOrSuccessRequest('failed', 'Gagal logout')
      }
      switch (user.roles) {
        case 'farmer':
          // find device token by farmer id
          const deviceToken = await farmerDeviceRepository.findDeviceTokenByFarmerId(userDetail?.farmerId)
          if (!deviceToken) {
            return this.failedOrSuccessRequest('failed', 'Gagal logout')
          }
          // empty device token
          await farmerDeviceRepository.emptyDeviceToken(deviceToken.id)
          break
        default:
          return this.failedOrSuccessRequest('failed', 'Invalid role')
      }
      await userRepository.userLogout(userId)
      return this.failedOrSuccessRequest('success', {})
    } catch (error) {
      return this.failedOrSuccessRequest('failed', error)
    }
  }

  async forgotPassword(email: string) {
    try {
      // Validate input
      const validateArgs = forgotPasswordSchema.safeParse({ email })
      if (!validateArgs.success) {
        return this.failedOrSuccessRequest('failed', errorHandle(validateArgs.error))
      }

      // Find user by email
      const user = await userRepository.findUserByEmail(email)
      if (!user) {
        return this.failedOrSuccessRequest('failed', 'Email tidak terdaftar')
      }

      // Generate token
      const changePasswordToken = this.generateUniqueToken()

      const maxRequestsPerDay = 3
      const countRequest = await changePasswordTokenRepository.countChangePasswordTokenPerDayByUserId(
        user.id,
        new Date()
      )
      if (countRequest >= maxRequestsPerDay) {
        return this.failedOrSuccessRequest('failed', 'Batas maksimal permintaan reset password telah tercapai')
      }

      // Set token expiration time
      const expiresTime = 15 * 60 * 1000 // 15 minutes
      const tokenExpiration = new Date(Date.now() + expiresTime)

      // Create token
      const resultUVTReq = await changePasswordTokenRepository.createChangePasswordToken({
        expires: tokenExpiration,
        token: changePasswordToken,
        userId: user.id
      })

      if (!resultUVTReq) {
        return this.failedOrSuccessRequest('failed', 'Gagal membuat user')
      }

      // Send email
      try {
        sendMail(email, 'Reset Password', changePasswordToken, 'forgot-password')
      } catch (error) {
        await changePasswordTokenRepository.deleteChangePasswordToken(resultUVTReq.id)
        return this.failedOrSuccessRequest('failed', error)
      }

      return this.failedOrSuccessRequest('success', {})
    } catch (error) {
      return this.failedOrSuccessRequest('failed', error)
    }
  }

  async resetPassword(payload: ResetPasswordInput) {
    const validateArgs = changePasswordSchema.safeParse(payload)
    if (!validateArgs.success) {
      return this.failedOrSuccessRequest('failed', errorHandle(validateArgs.error))
    }
    try {
      const checkToken = await changePasswordTokenRepository.findChangePasswordTokenByToken(payload.token)
      if (!checkToken) {
        return this.failedOrSuccessRequest('failed', 'Token tidak valid')
      }
      // check token expires
      if (new Date() > checkToken.expires) {
        await changePasswordTokenRepository.deleteChangePasswordToken(checkToken.id)
        return this.failedOrSuccessRequest('failed', 'Token sudah kadaluarsa')
      }
      // check user
      const user = await userRepository.findUserById(checkToken.userId)
      if (!user) {
        return this.failedOrSuccessRequest('failed', 'User tidak ditemukan')
      }
      // change password
      const hashedPassword = await this.hashData(payload.password)
      await userRepository.updateUserPassword(user.id, hashedPassword)
      await changePasswordTokenRepository.deleteChangePasswordToken(checkToken.id)
      return this.failedOrSuccessRequest('success', {})
    } catch (error) {
      return this.failedOrSuccessRequest('failed', error)
    }
  }
}
