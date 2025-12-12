// 用户类型
export interface User {
  username: string
  password: string
}

// 登录请求
export interface LoginRequest {
  username: string
  password: string
}

// 登录响应（后端直接返回 User 对象）
export interface LoginResponse {
  username: string
  password: string
}

// 注册请求
export interface RegisterRequest {
  username: string
  password: string
}

// 注册响应（后端直接返回 User 对象）
export interface RegisterResponse {
  username: string
  password: string
}

// 登录表单数据
export interface LoginFormData {
  username: string
  password: string
}

// 注册表单数据
export interface RegisterFormData {
  username: string
  password: string
  confirmPassword: string
}
