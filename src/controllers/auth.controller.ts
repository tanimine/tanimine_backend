import { getResponse, getHttpCode } from '../utils'
import { AuthService } from '../service'
import { Request, Response } from 'express'

const authService = new AuthService()

const signUp = async (req: Request, res: Response) => {
  const { email, password, confirmPassword, role } = req.body
  let data: any
  switch (role) {
    case 'farmer':
      const { name, phone, provinceId, cityId, districtId, villageId, address } = req.body
      data = { name, phone, provinceId, cityId, districtId, villageId, address }
      break
    case 'offtaker':
      break
    case 'collector':
      break
    default:
      return getResponse(res, 400, 'Invalid role', 'error')
  }
  const result = await authService.signUp(email, password, confirmPassword, role, data)
  if (result.status === 'failed') {
    return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, result.data, null)
  }
  return getResponse(
    res,
    getHttpCode.OK,
    'Berhasil Membuat Akun, Silahkan Cek Email Untuk Verifikasi Akun',
    result.data
  )
}

const signIn = async (req: Request, res: Response) => {
  const { email, password, deviceToken } = req.body
  const result = await authService.signIn(email, password, deviceToken)
  if (result.status === 'failed') {
    return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, result.data, null)
  }
  return getResponse(res, getHttpCode.OK, 'Berhasil Login', result.data)
}

const verify = async (req: Request, res: Response) => {
  const token = req.body.token
  const id = req.body.userId
  const result = await authService.verifyEmail(token, id)
  if (result.status === 'failed') {
    return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, result.data, null)
  }
  return getResponse(res, getHttpCode.OK, 'Berhasil Verifikasi Akun', result.data)
}

const logout = async (req: Request, res: Response) => {
  const userId = req.user?.id
  const userDetail = req.user?.userDetail
  const result = await authService.logout(userId, userDetail)
  if (result.status === 'failed') {
    return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, result.data, null)
  }
  return getResponse(res, getHttpCode.OK, 'Berhasil Logout', result.data)
}

const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body
  const result = await authService.forgotPassword(email)
  if (result.status === 'failed') {
    return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, result.data, null)
  }
  return getResponse(res, getHttpCode.OK, 'Berhasil Mengirim Email', result.data)
}

const resetPassword = async (req: Request, res: Response) => {
  const { token, password, confirmPassword } = req.body
  const result = await authService.resetPassword({ token, password, confirmPassword })
  if (result.status === 'failed') {
    return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, result.data, null)
  }
  return getResponse(res, getHttpCode.OK, 'Berhasil Mereset Password', result.data)
}

export { signUp, signIn, verify, logout, forgotPassword, resetPassword }
