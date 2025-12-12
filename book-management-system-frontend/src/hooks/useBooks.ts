import { useState, useCallback } from 'react'
import * as bookApi from '@/api/book.api'
import type { Book, CreateBookRequest, UpdateBookRequest } from '@/types'

/**
 * useBooks Hook 返回类型
 */
export interface UseBooksReturn {
  books: Book[]
  loading: boolean
  error: string | null
  fetchBooks: () => Promise<void>
  createBook: (data: CreateBookRequest) => Promise<void>
  updateBook: (id: number, data: Partial<Omit<UpdateBookRequest, 'id'>>) => Promise<void>
  deleteBook: (id: number) => Promise<void>
}

/**
 * 图书管理 Hook
 * 提供图书列表的 CRUD 操作和状态管理
 * 
 * @returns {UseBooksReturn} 图书状态和操作方法
 */
export const useBooks = (): UseBooksReturn => {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * 获取图书列表
   * 需求：4.1
   */
  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await bookApi.listBooks()
      setBooks(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取图书列表失败'
      setError(errorMessage)
      console.error('获取图书列表失败:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * 创建新图书
   * 需求：5.2
   */
  const createBook = useCallback(async (data: CreateBookRequest) => {
    try {
      setLoading(true)
      setError(null)
      await bookApi.createBook(data)
      // 创建成功后重新获取图书列表
      await fetchBooks()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '创建图书失败'
      setError(errorMessage)
      console.error('创建图书失败:', err)
      throw err // 重新抛出错误，让调用者可以处理
    } finally {
      setLoading(false)
    }
  }, [fetchBooks])

  /**
   * 更新图书信息
   * 需求：6.2
   */
  const updateBook = useCallback(async (
    id: number,
    data: Partial<Omit<UpdateBookRequest, 'id'>>
  ) => {
    try {
      setLoading(true)
      setError(null)
      await bookApi.updateBook({ id, ...data })
      // 更新成功后重新获取图书列表
      await fetchBooks()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '更新图书失败'
      setError(errorMessage)
      console.error('更新图书失败:', err)
      throw err // 重新抛出错误，让调用者可以处理
    } finally {
      setLoading(false)
    }
  }, [fetchBooks])

  /**
   * 删除图书
   * 需求：7.2
   */
  const deleteBook = useCallback(async (id: number) => {
    try {
      setLoading(true)
      setError(null)
      await bookApi.deleteBook(id)
      // 删除成功后重新获取图书列表
      await fetchBooks()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '删除图书失败'
      setError(errorMessage)
      console.error('删除图书失败:', err)
      throw err // 重新抛出错误，让调用者可以处理
    } finally {
      setLoading(false)
    }
  }, [fetchBooks])

  return {
    books,
    loading,
    error,
    fetchBooks,
    createBook,
    updateBook,
    deleteBook,
  }
}
