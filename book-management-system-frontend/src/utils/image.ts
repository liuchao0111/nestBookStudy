import { API_BASE_URL } from './constants'

/**
 * 获取完整的图片 URL
 * @param path 图片路径（可能是相对路径或完整 URL）
 * @returns 完整的图片 URL
 */
export const getImageUrl = (path: string): string => {
  if (!path) {
    return ''
  }

  // 如果已经是完整的 URL（http:// 或 https://），直接返回
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }

  // 如果是相对路径（以 / 开头），拼接 API_BASE_URL
  if (path.startsWith('/')) {
    return `${API_BASE_URL}${path}`
  }

  // 其他情况，假设是相对路径，添加 /
  return `${API_BASE_URL}/${path}`
}
