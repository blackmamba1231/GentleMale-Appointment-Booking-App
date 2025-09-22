"use client"
import { createContext, useContext, useState, useEffect, type ReactNode, use } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import jwt, { type JwtPayload } from "jsonwebtoken"


interface User {
  id: string
  email: string
  name?: string
  phone?: string
  role: "CUSTOMER" | "ADMIN" | "STYLIST"
  avatarUrl?: string
}
interface AuthContextType {
  user: User | null
  accessToken: string | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, phone: string, password: string) => Promise<void>
  verifyOtp: (email: string, otp: string) => Promise<void>
  logout: () => Promise<void>
  refreshToken: () => Promise<void>
  refreshTokenLogin: () => Promise<void>
  loading: boolean
}


const AuthContext = createContext<AuthContextType | undefined>(undefined)

export async function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  

  const register = async (name: string, email: string, phone: string, password: string) => {
    try {
      const response = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name ,phone, email, password }),
      });
      console.log(response);
      const json = await response.json();
      if(!response.ok){
        console.log("throw trigerred");
        console.log("error is ",json);
        throw new Error(json);
      }
      console.log("Success:", json);
      return json;
  
    } catch (error: any) {
      console.log("raw error", error);
      console.log("error catched", error.message);
      throw new Error(error.message);
    }
  };
  

  const verifyOtp = async (email: string, otp: string) => {
    try{
      const response = await fetch("/api/v1/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      })
  
      if (!response.ok) {
        const error = await response.json()
        console.log("verification Catch triggered", error);
        throw new Error(error || "OTP verification failed")
      }
  
      return response.json()
    }catch(error: any){
      console.log("error catched", error.message);
      throw new Error(error.message);
    }
  }

  const login = async (email: string, password: string) => {
    try{
      const response = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })
  
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error || "Login failed")
      }
  
      const data = await response.json()
      setAccessToken(data.accessToken)
      // Store refresh token and session ID in HTTP-only cookie via API route
      await fetch("/api/v1/auth/set-tokens", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refreshToken: data.refreshToken,
          sessionId: data.sessionId
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
        setUser(userData.user)
      }else{
        const json = await userResponse.json()
        throw new Error(json);
      }
    }catch(error: any){
      console.log("error catched", error.message);
      throw new Error(error.message);
    }
  }

  const refreshToken = async () => {
    try {
      const res = await fetch("/api/v1/auth/get-tokens", {
        method: "GET",
      })
      if (!res.ok) {
        throw new Error("Failed to get tokens")
      }

      const data = await res.json()
      const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + "/api/v1/auth/refresh", {
        refreshToken: data.refreshToken.value,
        sessionId: data.sessionId.value
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      if (response.status !== 201) {
        router.push("/login")
      }
      setAccessToken(response.data.accessToken)
      const userResponse = await fetch("/api/v1/auth/me", {
        headers: { Authorization: `Bearer ${response.data.accessToken}` },
      })
      if (userResponse.ok) {
        const userData = await userResponse.json()
        setUser(userData.user)
      }
    } catch (error) {
      console.error("Auth check failed:", error)
    } finally {
      setLoading(false)
    }
  }
  const refreshTokenLogin = async () => {
    try {
      const res = await fetch("/api/v1/auth/get-tokens", {
        method: "GET",
      })
      if (!res.ok) {
        throw new Error("Failed to get tokens")
      }

      const data = await res.json()
      const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + "/api/v1/auth/refresh", {
        refreshToken: data.refreshToken.value,
        sessionId: data.sessionId.value
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      if (response.status !== 201) {
        router.push("/login")
      }
      setAccessToken(response.data.accessToken)
      const userResponse = await fetch("/api/v1/auth/me", {
        headers: { Authorization: `Bearer ${response.data.accessToken}` },
      })
      if (userResponse.ok) {
        const userData = await userResponse.json()
        setUser(userData.user)
      }
      router.push('/profile');
    } catch (error) {
      console.error("Auth check failed:", error)
    } finally {
      setLoading(false)
    }
  }
  const logout = async () => {
    try {
      await fetch("/api/v1/auth/logout", {
        method: "POST",
      })
      setUser(null);
      setAccessToken(null)
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
        accessToken: accessToken ?? null,
        login,
        register,
        verifyOtp,
        logout,
        refreshToken,
        loading,
        refreshTokenLogin
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
