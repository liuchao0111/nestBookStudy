import React, { useState, useCallback } from 'react'
import { login as loginApi, register as registerApi } from '@/api/auth.api'
import {
  setToken,
  getToken,
  setUser,
  getUser,
  clearAuthStorage,
} from '@/utils/storage'
import type { User, LoginRequest, RegisterRequest } from '@/types'
import { AuthContext, type AuthContextType } from './AuthContext'

/**
 * 认证提供者组件的 Props
 */
interface AuthProviderProps {
  children: React.ReactNode
}

/**
 * 认证提供者组件
 * 管理用户认证状态和相关操作
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // 使用 lazy initialization 从 localStorage 恢复认证状态
  const [user, setUserState] = useState<User | null>(() => getUser<User>())
  const [token, setTokenState] = useState<string | null>(() => getToken())

  /**
   * 用户登录
   * @param username 用户名
   * @param password 密码
   */
  const login = useCallback(async (username: string, password: string) => {
    const loginData: LoginRequest = { username, password }
    const response = await loginApi(loginData)

    // 后端返回的是 User 对象，我们需要生成一个 token
    // 根据后端实现，这里使用 username 作为 token
    const userToken = response.username
    const userData: User = {
      username: response.username,
      password: response.password,
    }

    // 保存到 localStorage
    setToken(userToken)
    setUser(userData)

    // 更新状态
    setTokenState(userToken)
    setUserState(userData)
  }, [])

  /**
   * 用户注册
   * @param username 用户名
   * @param password 密码
   */
  const register = useCallback(
    async (username: string, password: string) => {
      const registerData: RegisterRequest = { username, password }
      await registerApi(registerData)
      // 注册成功后不自动登录，由用户手动登录
    },
    []
  )

  /**
   * 用户登出
   * 清除认证状态和本地存储
   */
  const logout = useCallback(() => {
    // 清除 localStorage
    clearAuthStorage()

    // 清除状态
    setTokenState(null)
    setUserState(null)
  }, [])

  /**
   * 计算是否已认证
   */
  const isAuthenticated = token !== null && user !== null

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
