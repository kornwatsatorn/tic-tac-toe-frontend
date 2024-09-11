import NextAuth from "next-auth"
import { DefaultSession } from "next-auth"
declare module "next-auth" {
  interface Session {
    id: string
    accessToken: string
    refreshToken: string
    error?: string | undefined
    user:
      | ({
          displayName: string
          email: string
          displayImage: string | null
          point: number
          type: string
          botWinStack: number
        } & DefaultSession["user"])
      | null
  }
}
