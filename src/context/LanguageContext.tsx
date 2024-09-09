"use client"

import React, { createContext, useState, useEffect, ReactNode } from "react"
import i18n from "@i18nConfig"

interface LanguageContextProps {
  language: string
  switchLanguage: (lang: string) => void
}

// This creates a React Context, not a namespace
export const LanguageContext = createContext<LanguageContextProps>({
  language: "th",
  switchLanguage: () => {},
})

interface LanguageProviderProps {
  children: ReactNode
}

const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<string>("th")

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language") || "th"
    setLanguage(storedLanguage)
    i18n.changeLanguage(storedLanguage)
  }, [])

  const switchLanguage = (lang: string) => {
    setLanguage(lang)
    i18n.changeLanguage(lang)
    localStorage.setItem("language", lang)
  }

  return (
    <LanguageContext.Provider value={{ language, switchLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export default LanguageProvider
