'use client'

import type React from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import { type User as FirebaseUser, onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase/config'
import { User } from '@/lib/models'
import { getUserByUid } from '@/lib/firestore/users'

interface AuthContextType {
  user: FirebaseUser | null
  userData: User | null
  token: string | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  token: null,
  loading: true,
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [userData, setUserData] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribeAuthState = onAuthStateChanged(auth, async (user) => {
      setLoading(true)
      setUser(user)
      if (!user) {
        setToken(null)
        setLoading(false)
        return
      }
      // Get the ID token and set it in the cookie
      const idToken = await user.getIdToken()
      setToken(idToken)
      setLoading(false)
    })

    // Listens for changes to the user's ID token and forwards to cookies
    // and server app
    const unsubscribeIdToken = auth.onIdTokenChanged(async (user) => {
      setLoading(true)
      if (!user) {
        setLoading(false)
        return
      }

      const idToken = await user.getIdToken()
      setToken(idToken)

      getUserByUid(user.uid).then((userData) => {
        if (!userData) {
          setUserData(null)
        } else {
          setUserData(userData)
        }
      })

      setLoading(false)
    })

    return () => {
      unsubscribeAuthState()
      unsubscribeIdToken()
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        token,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
