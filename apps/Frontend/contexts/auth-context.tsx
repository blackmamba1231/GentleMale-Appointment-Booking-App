"use client"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import axios from "axios"
interface User {
  id: string
  email: string
  name?: string
  phone?: string
  role: "CUSTOMER" | "ADMIN"
}

interface AuthContextType {
  user: User | null
  accessToken: string | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, phone: string, password: string) => Promise<void>
  verifyOtp: (email: string, otp: string) => Promise<void>
  logout: () => Promise<void>
  refreshToken: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch("/api/v1/auth/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      }
    } catch (error) {
      console.error("Auth check failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const register = async (name: string, email: string, phone: string, password: string) => {
    const response = await axios.post("/api/v1/auth/register", {
      name, email, phone, password
    })
    if (response.status !== 201) {
      const error = await response.data
      console.log(error)
      throw new Error(error.message)
    }

    return response.data;
  }

  const verifyOtp = async (email: string, otp: string) => {
    const response = await fetch("/api/v1/auth/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "OTP verification failed")
    }

    return response.json()
  }

  const login = async (email: string, password: string) => {
    const response = await fetch("/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Login failed")
    }

    const data = await response.json()
    setAccessToken(data.accessToken)

    // Store refresh token and session ID in HTTP-only cookie via API route
    await fetch("/api/auth/set-tokens", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refreshToken: data.refreshToken,
        sessionId: data.sessionId,
      }),
    })

    // Get user info
    const userResponse = await fetch("/api/v1/auth/me", {
      headers: {
        Authorization: `Bearer ${data.accessToken}`,
      },
    })

    if (userResponse.ok) {
      const userData = await userResponse.json()
      setUser(userData)
    }
  }

  const refreshToken = async () => {
    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
      })

      if (response.ok) {
        const data = await response.json()
        setAccessToken(data.accessToken)
        return data.accessToken
      }
    } catch (error) {
      console.error("Token refresh failed:", error)
      logout()
    }
  }

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      })
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setUser(null)
      setAccessToken(null)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        login,
        register,
        verifyOtp,
        logout,
        refreshToken,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
