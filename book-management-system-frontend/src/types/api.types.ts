// 通用 API 响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// API 错误类型
export interface ApiError {
  message: string;
  statusCode?: number;
  error?: string;
}

// HTTP 请求配置
export interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
}

// 分页参数（预留，当前未使用）
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

// 分页响应（预留，当前未使用）
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
