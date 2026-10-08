import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthChange } from '@shared/firebase/auth'

const AuthContext = createContext({ user: null, loading: true })

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthChange((u) => {
      setUser(u)
      setLoading(false)
    })
    return () => unsubscribe && unsubscribe()
  }, [])

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)

// 학생 계정인지 (학번@student.local)
export const isStudent = (user) => !!user?.email?.endsWith('@student.local')
