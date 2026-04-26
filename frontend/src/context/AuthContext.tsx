import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import { authApi, type AuthUser, type RegisterPayload, type LoginPayload } from '../api/auth.api'

interface AuthContextValue {
  user: AuthUser | null
  token: string | null
  isLoading: boolean
  login: (payload: LoginPayload) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return ctx
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Rehydrate session from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken')
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedUser) {
      try {
        setToken(storedToken)
        setUser(JSON.parse(storedUser) as AuthUser)
      } catch {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('user')
      }
    }

    setIsLoading(false)
  }, [])

  const persistSession = useCallback((accessToken: string, authUser: AuthUser) => {
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('user', JSON.stringify(authUser))
    setToken(accessToken)
    setUser(authUser)
  }, [])

  const login = useCallback(async (payload: LoginPayload): Promise<void> => {
    const response = await authApi.login(payload)
    persistSession(response.accessToken, response.user)
  }, [persistSession])

  const register = useCallback(async (payload: RegisterPayload): Promise<void> => {
    const response = await authApi.register(payload)
    persistSession(response.accessToken, response.user)
  }, [persistSession])

  const logout = useCallback((): void => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
