import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks'

/**
 * PublicRoute 组件的 Props
 */
interface PublicRouteProps {
  children: React.ReactNode
}

/**
 * 公共路由组件
 * 用于登录和注册页面，已认证用户将被重定向到图书管理页面
 * 
 * @example
 * ```tsx
 * <Route path="/login" element={
 *   <PublicRoute>
 *     <LoginPage />
 *   </PublicRoute>
 * } />
 * ```
 */
export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    // 已认证用户重定向到图书管理页面
    return <Navigate to="/books" replace />
  }

  return <>{children}</>
}
