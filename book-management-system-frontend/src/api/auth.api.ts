import apiClient from './client'
import { API_ENDPOINTS } from '@/utils/constants'
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '@/types'

/**
 * 用户注册
 * @param data 注册请求数据
 * @returns 注册响应
 */
export const register = async (
  data: RegisterRequest
): Promise<RegisterResponse> => {
  const response = await apiClient.post<RegisterResponse>(
    API_ENDPOINTS.REGISTER,
    data
  )
  return response.data
}

/**
 * 用户登录
 * @param data 登录请求数据
 * @returns 登录响应
 */
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>(
    API_ENDPOINTS.LOGIN,
    data
  )
  return response.data
}
