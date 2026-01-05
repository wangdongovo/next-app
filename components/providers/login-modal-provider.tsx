"use client"

import * as React from "react"

interface LoginModalContextType {
  isOpen: boolean
  open: () => void
  close: () => void
}

const LoginModalContext = React.createContext<LoginModalContextType | undefined>(undefined)

export function LoginModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false)

  const open = React.useCallback(() => setIsOpen(true), [])
  const close = React.useCallback(() => setIsOpen(false), [])

  return (
    <LoginModalContext.Provider value={{ isOpen, open, close }}>
      {children}
    </LoginModalContext.Provider>
  )
}

export function useLoginModal() {
  const context = React.useContext(LoginModalContext)
  if (!context) {
    throw new Error("useLoginModal must be used within a LoginModalProvider")
  }
  return context
}
