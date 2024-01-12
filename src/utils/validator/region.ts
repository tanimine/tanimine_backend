import { z } from 'zod'

export const getAllRegionSchema = z.object({
  name: z.string().optional(),
  code: z
    .string()
    .regex(/^(?:\d{1,2})(?:\.\d{1,2}){0,2}(?:\.\d{4})?$/, { message: 'code tidak sesuai dengan format' })
    .optional(),
  type: z.enum(['province', 'city', 'district', 'village']).optional()
})
