import { Navigate } from 'react-router-dom';

/**
 * 根路径重定向组件
 * 根据认证状态重定向到登录页面或图书管理页面
 */
export const RootRedirect = () => {
  // 检查是否有 token 来判断是否已认证
  const token = localStorage.getItem('auth_token');
  const isAuthenticated = token !== null && token.length > 0;

  if (isAuthenticated) {
    return <Navigate to="/books" replace />;
  }

  return <Navigate to="/login" replace />;
};
