import { z } from "zod"

export const authSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters long",
    })
    .max(100)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/, {
      message:
        "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character",
    }),
})

export type ZAuthSchema = z.infer<typeof authSchema>

export const verfifyEmailSchema = z.object({
  code: z
    .string()
    .min(6, {
      message: "Verification code must be 6 characters long",
    })
    .max(6, { message: "Verification code must be 6 characters long" }),
})

export type ZVerifyEmailSchema = z.infer<typeof verfifyEmailSchema>

export const checkEmailSchema = z.object({
  email: authSchema.shape.email,
})

export type ZCheckEmailSchema = z.infer<typeof checkEmailSchema>

export const resetPasswordSchema = z
  .object({
    password: authSchema.shape.password,
    confirmPassword: authSchema.shape.password,
    code: verfifyEmailSchema.shape.code,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export type ZResetPasswordSchema = z.infer<typeof resetPasswordSchema>
