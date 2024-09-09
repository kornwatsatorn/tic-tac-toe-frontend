"use client"

import React, { ReactNode, createContext, useContext, useState } from "react"

type LoadingContextType = {
  isLoading: boolean
  setLoading: (isLoading: boolean) => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export const LoadingProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isLoading, setLoading] = useState(false)

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  )
}

export const useLoading = () => {
  const context = useContext(LoadingContext)
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider")
  }
  return context
}
