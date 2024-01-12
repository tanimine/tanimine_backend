import { z } from 'zod'
export const signUpSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8, { message: 'Minimal Password 8 Karakter' }),
    confirmPassword: z.string().min(8, { message: 'Minimal Password 8 Karakter' }),
    role: z.enum(['offtaker', 'collector', 'farmer']),
    data: z.object({
      name: z.string().optional(),
      address: z.string().optional(),
      phone: z.string().optional(),
      provinceId: z.string().optional(),
      cityId: z.string().optional(),
      districtId: z.string().optional(),
      villageId: z.string().optional()
    })
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        path: ['confirmPassword'],
        code: z.ZodIssueCode.custom,
        message: 'Password Dan Confirm Password Tidak Sama'
      })
    }
    if (data.role === 'farmer') {
      if (!data.data.provinceId) {
        ctx.addIssue({
          path: ['province'],
          code: z.ZodIssueCode.custom,
          message: 'Provinsi Tidak Boleh Kosong'
        })
      } else if (!data.data.cityId) {
        ctx.addIssue({
          path: ['city'],
          code: z.ZodIssueCode.custom,
          message: 'Kota Tidak Boleh Kosong'
        })
      } else if (!data.data.districtId) {
        ctx.addIssue({
          path: ['district'],
          code: z.ZodIssueCode.custom,
          message: 'Kecamatan Tidak Boleh Kosong'
        })
      } else if (!data.data.villageId) {
        ctx.addIssue({
          path: ['village'],
          code: z.ZodIssueCode.custom,
          message: 'Desa Tidak Boleh Kosong'
        })
      }
    }
  })

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, { message: 'Minimal Password 8 Karakter' })
})

export const verifyAccountSchema = z.object({
  token: z.string(),
  id: z.string().uuid()
})

export const forgotPasswordSchema = z.object({
  email: z.string().email({
    message: 'Email Tidak Valid'
  })
})

export const changePasswordSchema = z
  .object({
    password: z.string().min(8, { message: 'Minimal Password 8 Karakter' }),
    confirmPassword: z.string().min(8, { message: 'Minimal Password 8 Karakter' }),
    token: z.string()
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        path: ['confirmPassword'],
        code: z.ZodIssueCode.custom,
        message: 'Password Dan Confirm Password Tidak Sama'
      })
    }
  })
