"use client"

import { useEffect, useState } from "react"
import { LoadingProvider } from "@/context/LoadingContext"
import { getSession, SessionProvider } from "next-auth/react"
import { Session } from "next-auth"
import LoadingWrapper from "./LoadingWrapper"
import LanguageProvider from "@/context/LanguageContext"
import NavbarWrapper from "../navbar/NavbarWrapper"
import FooterWrapper from "../navbar/FooterWrapper"
// import MainFooter from "../Footer/MainFooter";

// import { useRouter } from "next/navigation";
// import { motion, AnimatePresence } from "framer-motion";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  // variable
  const [session, setSession] = useState<Session | null>(null)
  const [isClient, setIsClient] = useState(false)
  // const [pageTransition, setPageTransition] = useState(false);

  // init
  useEffect(() => {
    const fetchSession = async () => {
      const sessionData = await getSession()
      setSession(sessionData)
      setIsClient(true)
    }
    fetchSession()
  }, [])

  // render
  if (!isClient) {
    return null
  }
  return (
    <LanguageProvider>
      <LoadingProvider>
        <SessionProvider session={session}>
          {isClient && <LoadingWrapper />}
          <NavbarWrapper />
          <div id="content-box">{children}</div>
          <FooterWrapper />
        </SessionProvider>
      </LoadingProvider>
    </LanguageProvider>
  )
}
