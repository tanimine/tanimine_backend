export interface SignUpFarmerInput {
  email: string
  name: string
  password: string
  confirmPassword: string
  role: string
}

export interface LoginInput {
  email: string
  password: string
  registrationToken: string
}

export interface ResetPasswordInput {
  token: string
  password: string
  confirmPassword: string
}
