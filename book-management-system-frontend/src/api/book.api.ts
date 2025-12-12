import apiClient from './client'
import { API_ENDPOINTS } from '@/utils/constants'
import type {
  ListBooksResponse,
  GetBookResponse,
  CreateBookRequest,
  CreateBookResponse,
  UpdateBookRequest,
  UpdateBookResponse,
  DeleteBookResponse,
  UploadFileResponse,
} from '@/types'

/**
 * 获取图书列表
 * @returns 图书列表
 */
export const listBooks = async (): Promise<ListBooksResponse> => {
  const response = await apiClient.get<ListBooksResponse>(
    API_ENDPOINTS.BOOK_LIST
  )
  return response.data
}

/**
 * 获取单个图书详情
 * @param id 图书 ID
 * @returns 图书详情
 */
export const getBook = async (id: number): Promise<GetBookResponse> => {
  const response = await apiClient.get<GetBookResponse>(
    `${API_ENDPOINTS.BOOK_GET}/${id}`
  )
  return response.data
}

/**
 * 创建新图书
 * @param data 图书数据
 * @returns 创建的图书
 */
export const createBook = async (
  data: CreateBookRequest
): Promise<CreateBookResponse> => {
  const response = await apiClient.post<CreateBookResponse>(
    API_ENDPOINTS.BOOK_CREATE,
    data
  )
  return response.data
}

/**
 * 更新图书信息
 * @param data 更新的图书数据
 * @returns 更新响应
 */
export const updateBook = async (
  data: UpdateBookRequest
): Promise<UpdateBookResponse> => {
  const response = await apiClient.put<UpdateBookResponse>(
    API_ENDPOINTS.BOOK_UPDATE,
    data
  )
  return response.data
}

/**
 * 删除图书
 * @param id 图书 ID
 * @returns 删除响应
 */
export const deleteBook = async (id: number): Promise<DeleteBookResponse> => {
  const response = await apiClient.delete<DeleteBookResponse>(
    `${API_ENDPOINTS.BOOK_DELETE}/${id}`
  )
  return response.data
}

/**
 * 上传文件（图书封面）
 * @param file 文件对象
 * @returns 上传响应
 */
export const uploadFile = async (file: File): Promise<UploadFileResponse> => {
  const formData = new FormData()
  formData.append('file', file)

  // 注意：不要手动设置 Content-Type，让 axios 自动处理
  // axios 会自动设置正确的 Content-Type 和 boundary
  const response = await apiClient.post<UploadFileResponse>(
    API_ENDPOINTS.BOOK_UPLOAD,
    formData
  )
  return response.data
}
