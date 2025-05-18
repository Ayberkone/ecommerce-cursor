'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type UserType = 'pharmacy' | 'doctor' | 'regular'
export type User = {
  username: string
  type: UserType
}

type AuthContextType = {
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  register: (username: string, password: string, type: UserType) => Promise<boolean>
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

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('user') : null
    if (stored) setUser(JSON.parse(stored))
  }, [])

  const login = async (username: string, password: string) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const found = users.find((u: any) => u.username === username && u.password === password)
    if (found) {
      setUser({ username: found.username, type: found.type })
      localStorage.setItem('user', JSON.stringify({ username: found.username, type: found.type }))
      return true
    }
    return false
  }

  const register = async (username: string, password: string, type: UserType) => {
    let users = JSON.parse(localStorage.getItem('users') || '[]')
    if (users.find((u: any) => u.username === username)) return false
    users.push({ username, password, type })
    localStorage.setItem('users', JSON.stringify(users))
    setUser({ username, type })
    localStorage.setItem('user', JSON.stringify({ username, type }))
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
