import { createContext } from 'react'
import type { User } from '@/types'

/**
 * 认证上下文类型定义
 */
export interface AuthContextType {
  user: User | null
  token: string | null
  login: (username: string, password: string) => Promise<void>
  register: (username: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

/**
 * 创建认证上下文
 */
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
)
