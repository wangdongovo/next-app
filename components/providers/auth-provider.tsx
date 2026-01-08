"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

interface AuthContextType {
  isLoggedIn: boolean
  login: (email: string, password: string, targetUrl?: string) => Promise<void>
  logout: () => void
  user: { id: string; email: string } | null
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

// 设置 cookie
const setCookie = (name: string, value: string, days: number = 1) => {
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`
}

// 清除 cookie
const deleteCookie = (name: string) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false)
  const [user, setUser] = React.useState<{ id: string; email: string } | null>(null)
  const router = useRouter()

  // 初始化时检查登录状态
  React.useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")
    if (token && userData) {
      setIsLoggedIn(true)
      setUser(JSON.parse(userData))
      // 重新设置cookie，确保中间件能识别登录状态
      setCookie("isLoggedIn", "true")
    }
  }, [])

  const login = React.useCallback(async (email: string, password: string, targetUrl?: string) => {
    try {
      // 调用登录API
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Login failed")
      }

      const data = await response.json()
      
      // 存储令牌和用户信息
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))
      
      // 设置登录状态和 cookie
      setIsLoggedIn(true)
      setUser(data.user)
      setCookie("isLoggedIn", "true")

      // 登录成功后跳转到目标页面
      if (targetUrl) {
        router.push(targetUrl)
      } else {
        router.push("/")
      }
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }, [router])

  const logout = React.useCallback(() => {
    // 清除登录状态、存储的令牌和 cookie
    setIsLoggedIn(false)
    setUser(null)
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    deleteCookie("isLoggedIn")
    
    // 登出后跳转到首页
    router.push("/")
  }, [router])

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, user }}>
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