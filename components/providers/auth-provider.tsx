"use client"

import * as React from "react"

interface AuthContextType {
  isLoggedIn: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false)

  // 初始化时检查登录状态
  React.useEffect(() => {
    const savedLoginState = localStorage.getItem("isLoggedIn")
    if (savedLoginState === "true") {
      setIsLoggedIn(true)
    }
  }, [])

  const login = React.useCallback(async (username: string, password: string) => {
    // 这里可以添加实际的登录逻辑
    // 模拟登录成功
    setIsLoggedIn(true)
    localStorage.setItem("isLoggedIn", "true")
  }, [])

  const logout = React.useCallback(() => {
    setIsLoggedIn(false)
    localStorage.removeItem("isLoggedIn")
  }, [])

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