import { useContext } from 'react'
import { AuthContext } from '@/context'

/**
 * useAuth Hook
 * 提供访问认证上下文的便捷方式
 * 
 * @throws {Error} 如果在 AuthProvider 外部使用
 * @returns 认证上下文对象
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { user, login, logout, isAuthenticated } = useAuth()
 *   
 *   if (!isAuthenticated) {
 *     return <LoginForm onSubmit={login} />
 *   }
 *   
 *   return (
 *     <div>
 *       <p>Welcome, {user?.username}!</p>
 *       <button onClick={logout}>Logout</button>
 *     </div>
 *   )
 * }
 * ```
 */
export function useAuth() {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}
