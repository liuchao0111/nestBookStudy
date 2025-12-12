import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks'

/**
 * ProtectedRoute 组件的 Props
 */
interface ProtectedRouteProps {
  children: React.ReactNode
}

/**
 * 路由守卫组件
 * 保护需要认证的路由，未认证用户将被重定向到登录页面
 * 
 * @example
 * ```tsx
 * <Route path="/books" element={
 *   <ProtectedRoute>
 *     <BookManagementPage />
 *   </ProtectedRoute>
 * } />
 * ```
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    // 未认证用户重定向到登录页面
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
