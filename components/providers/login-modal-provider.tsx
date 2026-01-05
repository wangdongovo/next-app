"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { useAuth } from "./auth-provider"

interface LoginModalContextType {
  isOpen: boolean
  open: () => void
  close: () => void
}

const LoginModalContext = React.createContext<LoginModalContextType | undefined>(undefined)

export function LoginModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false)
  const pathname = usePathname()
  const { isLoggedIn } = useAuth()

  const open = React.useCallback(() => setIsOpen(true), [])
  const close = React.useCallback(() => setIsOpen(false), [])

  // 监听路由变化，检查是否需要显示登录模态框
  React.useEffect(() => {
    // 如果不是首页且未登录，则显示登录模态框
    if (pathname !== "/" && !isLoggedIn) {
      open()
    }
  }, [pathname, isLoggedIn, open])

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