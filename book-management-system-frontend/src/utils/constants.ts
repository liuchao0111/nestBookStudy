// API 配置常量
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

// API 端点
export const API_ENDPOINTS = {
  // 用户认证
  REGISTER: '/user/register',
  LOGIN: '/user/login',

  // 图书管理
  BOOK_LIST: '/book/list',
  BOOK_SEARCH: '/book/search',
  BOOK_GET: '/book', // GET /book/:id
  BOOK_CREATE: '/book/create',
  BOOK_UPDATE: '/book/update',
  BOOK_DELETE: '/book/delete', // DELETE /book/delete/:id
  BOOK_UPLOAD: '/book/upload',
} as const

// 本地存储键名
export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'user_info',
} as const

// 表单验证规则
export const VALIDATION_RULES = {
  USERNAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 50,
    PATTERN: /^[a-zA-Z0-9_]+$/,
  },
  PASSWORD: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 100,
  },
  BOOK_NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 200,
  },
  BOOK_AUTHOR: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 100,
  },
  BOOK_DESCRIPTION: {
    MAX_LENGTH: 1000,
  },
} as const

// 文件上传配置
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ACCEPTED_IMAGE_TYPES: ['image/png', 'image/jpeg', 'image/jpg'],
  ACCEPTED_IMAGE_EXTENSIONS: ['.png', '.jpg', '.jpeg'],
} as const

// 消息提示配置
export const MESSAGE_CONFIG = {
  SUCCESS_DURATION: 3, // 3秒
  ERROR_DURATION: 0, // 手动关闭
} as const

// 路由路径
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  BOOKS: '/books',
} as const
