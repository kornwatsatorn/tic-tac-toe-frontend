import { emailRegex, nameRegex } from "@/utils/regex"
import { z } from "zod"

export const RegisterSchema = z.object({
  email: z
    .string()
    .default("")
    .refine((data) => data.trim() !== "" && emailRegex.test(data)),
  displayName: z
    .string()
    .default("")
    .refine((data) => data.trim() !== "" && nameRegex.test(data)),
  password: z
    .string()
    .default("")
    .refine((data) => data.trim() !== ""),
})

export type IRegisterSchema = z.infer<typeof RegisterSchema>
