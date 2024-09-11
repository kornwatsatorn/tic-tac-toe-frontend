import { emailRegex } from "@/utils/regex"
import { z } from "zod"

export const LoginSchema = z.object({
  email: z
    .string()
    .default("")
    .refine((data) => data.trim() !== "" && emailRegex.test(data)),
  password: z
    .string()
    .default("")
    .refine((data) => data.trim() !== ""),
})

export type ILoginSchema = z.infer<typeof LoginSchema>
