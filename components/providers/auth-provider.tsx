"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

interface AuthContextType {
  isLoggedIn: boolean
  login: (username: string, password: string, targetUrl?: string) => Promise<void>
  logout: () => void
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false)
  const router = useRouter()

  // 初始化时检查登录状态
  React.useEffect(() => {
    const savedLoginState = localStorage.getItem("isLoggedIn")
    if (savedLoginState === "true") {
      setIsLoggedIn(true)
    }
  }, [])

  const login = React.useCallback(async (username: string, password: string, targetUrl?: string) => {
    // 这里可以添加实际的登录逻辑
    // 模拟登录成功
    setIsLoggedIn(true)
    
    // 同时存储到localStorage和cookie
    localStorage.setItem("isLoggedIn", "true")
    document.cookie = "isLoggedIn=true; path=/; max-age=86400" // 1天过期

    // 登录成功后跳转到目标页面，如果没有目标页面则跳转到首页
    if (targetUrl) {
      router.push(targetUrl)
    } else {
      router.push("/")
    }
  }, [router])

  const logout = React.useCallback(() => {
    setIsLoggedIn(false)
    
    // 同时从localStorage和cookie移除
    localStorage.removeItem("isLoggedIn")
    document.cookie = "isLoggedIn=; path=/; max-age=0" // 立即过期
    
    // 登出后跳转到首页
    router.push("/")
  }, [router])

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}