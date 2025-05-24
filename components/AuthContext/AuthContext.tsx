'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { api } from '@/utils/api'
import { toast } from 'sonner'

export type UserType = 'pharmacy' | 'doctor' | 'regular'
export type User = {
  username: string
  type: UserType
}

type AuthContextType = {
  user: User | null
  login: (username: string, password: string) => Promise<boolean | string>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)

  // On mount, restore user from localStorage (if any)
  useEffect(() => {
    // Only run on mount (client-side)
    const checkSession = async () => {
      try {
        const user = await api('/api/auth/me')
        setUser({
          username: user.email,
          type: user.type,
        })
        if (typeof window !== 'undefined')
          localStorage.setItem('user', JSON.stringify({ username: user.email, type: user.type }))
      } catch {
        setUser(null)
        if (typeof window !== 'undefined')
          localStorage.removeItem('user')
      }
    }
    checkSession()
  }, [])

  const login = async (username: string, password: string) => {
    try {
      const data = await api('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: username, password })
      })
      setUser({
        username: data.user.email,
        type: data.user.type,
      })
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify({ username: data.user.email, type: data.user.type }))
      }
      return true
    } catch (err) {
      toast.error((err as Error)?.message || "Bir hata oluştu")
      return (err as Error)?.message || "Bir hata oluştu"
    }
  }

  const logout = async () => {
    setUser(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user')
    }
    const data = await api('/api/auth/logout', { method: 'POST' })
    window.location.reload()
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}