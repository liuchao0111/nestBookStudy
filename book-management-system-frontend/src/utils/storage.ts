import { STORAGE_KEYS } from './constants'

/**
 * 本地存储工具类
 * 提供类型安全的 localStorage 封装
 */

/**
 * 存储认证令牌
 * @param token - JWT 认证令牌
 */
export function setToken(token: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token)
  } catch (error) {
    console.error('Failed to save token to localStorage:', error)
  }
}

/**
 * 获取认证令牌
 * @returns 存储的令牌，如果不存在则返回 null
 */
export function getToken(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEYS.TOKEN)
  } catch (error) {
    console.error('Failed to read token from localStorage:', error)
    return null
  }
}

/**
 * 清除认证令牌
 */
export function removeToken(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.TOKEN)
  } catch (error) {
    console.error('Failed to remove token from localStorage:', error)
  }
}

/**
 * 存储用户信息
 * @param user - 用户对象
 */
export function setUser(user: unknown): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
  } catch (error) {
    console.error('Failed to save user to localStorage:', error)
  }
}

/**
 * 获取用户信息
 * @returns 存储的用户对象，如果不存在则返回 null
 */
export function getUser<T = unknown>(): T | null {
  try {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER)
    if (!userStr) {
      return null
    }
    return JSON.parse(userStr) as T
  } catch (error) {
    console.error('Failed to read user from localStorage:', error)
    return null
  }
}

/**
 * 清除用户信息
 */
export function removeUser(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.USER)
  } catch (error) {
    console.error('Failed to remove user from localStorage:', error)
  }
}

/**
 * 清除所有认证相关的本地存储数据
 * 用于用户登出时清理
 */
export function clearAuthStorage(): void {
  removeToken()
  removeUser()
}

/**
 * 检查是否存在有效的认证令牌
 * @returns 如果存在令牌返回 true，否则返回 false
 */
export function hasToken(): boolean {
  const token = getToken()
  return token !== null && token.length > 0
}
