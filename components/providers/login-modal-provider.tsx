"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { useAuth } from "./auth-provider"

interface LoginModalContextType {
  isOpen: boolean
  open: () => void
  close: () => void
  targetUrl: string | null
  setTargetUrl: (url: string | null) => void
}

const LoginModalContext = React.createContext<LoginModalContextType | undefined>(undefined)

export function LoginModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [targetUrl, setTargetUrl] = React.useState<string | null>(null)
  const pathname = usePathname()
  const { isLoggedIn, ready } = useAuth()

  const open = React.useCallback(() => setIsOpen(true), [])
  const close = React.useCallback(() => setIsOpen(false), [])

  // 监听路由变化，检查是否需要显示登录模态框
  React.useEffect(() => {
    // 如果不是首页且未登录，则显示登录模态框
    if (ready && pathname !== "/" && !isLoggedIn) {
      // 存储用户尝试访问的页面URL
      setTargetUrl(pathname)
      open()
    } else {
      // 已登录或访问的是首页，清空目标URL
      setTargetUrl(null)
    }
  }, [pathname, isLoggedIn, ready, open])

  return (
    <LoginModalContext.Provider value={{ isOpen, open, close, targetUrl, setTargetUrl }}>
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
