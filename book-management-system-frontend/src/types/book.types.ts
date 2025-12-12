// 图书类型
export interface Book {
  id: number;
  name: string;
  author: string;
  description: string;
  cover: string; // 封面图片 URL
}

// 创建图书请求
export interface CreateBookRequest {
  name: string;
  author: string;
  description: string;
  cover: string;
}

// 创建图书响应（后端直接返回 Book 对象）
export interface CreateBookResponse extends Book {}

// 更新图书请求
export interface UpdateBookRequest {
  id: number;
  name?: string;
  author?: string;
  description?: string;
  cover?: string;
}

// 更新图书响应
export interface UpdateBookResponse {
  message: string;
  code: number;
}

// 删除图书响应
export interface DeleteBookResponse {
  message: string;
  code: number;
}

// 图书列表响应（后端直接返回 Book 数组）
export type ListBooksResponse = Book[];

// 获取单个图书响应（后端直接返回 Book 对象或 undefined）
export type GetBookResponse = Book | undefined;

// 文件上传响应
export interface UploadFileResponse {
  message: string;
  filename: string;
  path: string;
  size: number;
}

// 图书表单数据
export interface BookFormData {
  name: string;
  author: string;
  description: string;
  cover: File | string; // 文件对象或 URL
}
