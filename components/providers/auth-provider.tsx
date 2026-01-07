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
      
      // 设置登录状态
      setIsLoggedIn(true)
      setUser(data.user)

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
    // 清除登录状态和存储的令牌
    setIsLoggedIn(false)
    setUser(null)
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    
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