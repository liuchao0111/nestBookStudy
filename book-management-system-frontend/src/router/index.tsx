import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProtectedRoute, PublicRoute, RootRedirect } from '@/components'
import { RegisterPage, LoginPage, BookManagementPage } from '@/pages'

/**
 * 应用路由配置
 * 
 * 路由结构：
 * - / : 根路径，根据认证状态重定向
 * - /login : 登录页面（公共路由）
 * - /register : 注册页面（公共路由）
 * - /books : 图书管理页面（受保护路由）
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootRedirect />,
  },
  {
    path: '/login',
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: '/register',
    element: (
      <PublicRoute>
        <RegisterPage />
      </PublicRoute>
    ),
  },
  {
    path: '/books',
    element: (
      <ProtectedRoute>
        <BookManagementPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])
