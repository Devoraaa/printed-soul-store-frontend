import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { authApi } from "../lib/api"

interface User {
  _id: string
  name: string
  email: string
  role: "user" | "admin" | "superadmin"
  phone?: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  isAuthModalOpen: boolean
  openAuthModal: () => void
  closeAuthModal: () => void
  sendOtp: (data: { email: string; name?: string; phone?: string }) => Promise<{ isNewUser: boolean }>
  verifyOtp: (email: string, otp: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  const openAuthModal = () => setIsAuthModalOpen(true)
  const closeAuthModal = () => setIsAuthModalOpen(false)

  const refreshUser = async () => {
    try {
      const token = localStorage.getItem("pss_token")
      if (!token) { setIsLoading(false); return }
      const { data } = await authApi.getMe()
      setUser(data.data)
    } catch {
      localStorage.removeItem("pss_token")
      localStorage.removeItem("pss_user")
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { refreshUser() }, [])

  const sendOtp = async (data: { email: string; name?: string; phone?: string }) => {
    const res = await authApi.sendOtp(data)
    return res.data.data // { isNewUser: boolean }
  }

  const verifyOtp = async (email: string, otp: string) => {
    const { data } = await authApi.verifyOtp({ email, otp })
    if (data.meta?.token) localStorage.setItem("pss_token", data.meta.token)
    localStorage.setItem("pss_user", JSON.stringify(data.data))
    setUser(data.data)
    closeAuthModal()
  }

  const logout = async () => {
    await authApi.logout().catch(() => {})
    localStorage.removeItem("pss_token")
    localStorage.removeItem("pss_user")
    setUser(null)
    window.location.href = "/"
  }

  return (
    <AuthContext.Provider value={{ 
      user, isAuthenticated: !!user, isLoading, 
      isAuthModalOpen, openAuthModal, closeAuthModal,
      sendOtp, verifyOtp, logout, refreshUser 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
