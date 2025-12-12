import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { API_BASE_URL, STORAGE_KEYS } from '@/utils/constants'
import type { ApiError } from '@/types'

// 创建 axios 实例
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30秒超时
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器：添加认证令牌
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 从 localStorage 获取令牌
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
    
    // 如果存在令牌，添加到请求头
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // 如果请求体是 FormData，删除 Content-Type 让浏览器自动设置
    // 这样浏览器会自动添加正确的 boundary 参数
    if (config.data instanceof FormData) {
      if (config.headers) {
        delete config.headers['Content-Type']
      }
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器：处理错误
apiClient.interceptors.response.use(
  (response) => {
    // 直接返回响应数据
    return response
  },
  (error: AxiosError) => {
    // 处理错误响应
    const apiError: ApiError = {
      message: '请求失败',
      statusCode: error.response?.status,
    }

    if (error.response) {
      // 服务器返回错误响应
      const data = error.response.data as any
      
      // 提取错误信息
      apiError.message = data?.message || data?.error || '服务器错误'
      apiError.error = data?.error
      
      // 处理特定状态码
      switch (error.response.status) {
        case 401:
          // 未授权：清除令牌并重定向到登录页
          localStorage.removeItem(STORAGE_KEYS.TOKEN)
          localStorage.removeItem(STORAGE_KEYS.USER)
          apiError.message = '会话已过期，请重新登录'
          // 如果不在登录页，重定向到登录页
          if (window.location.pathname !== '/login') {
            window.location.href = '/login'
          }
          break
        case 403:
          apiError.message = '没有权限访问'
          break
        case 404:
          apiError.message = '请求的资源不存在'
          break
        case 500:
          apiError.message = '服务器内部错误'
          break
        default:
          break
      }
    } else if (error.request) {
      // 请求已发送但没有收到响应
      apiError.message = '网络连接失败，请检查网络'
    } else {
      // 请求配置出错
      apiError.message = error.message || '请求配置错误'
    }

    return Promise.reject(apiError)
  }
)

export default apiClient
