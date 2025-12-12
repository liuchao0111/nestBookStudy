import { useEffect, useState } from 'react'
import { Layout, Button, Modal, message, Space, Typography } from 'antd'
import { PlusOutlined, LogoutOutlined } from '@ant-design/icons'
import { BookList } from '@/components/BookList'
import { BookFormModal } from '@/components/BookFormModal'
import { useBooks } from '@/hooks/useBooks'
import { useAuth } from '@/hooks/useAuth'
import type { Book, BookFormData } from '@/types'
import './BookManagementPage.css'

const { Header, Content } = Layout
const { Title } = Typography

/**
 * 图书管理主页面
 * 提供图书的查看、添加、编辑、删除功能
 * 需求：4.1-8.3
 */
export const BookManagementPage: React.FC = () => {
  const { books, loading, fetchBooks, createBook, updateBook, deleteBook } = useBooks()
  const { logout, user } = useAuth()
  
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | undefined>(undefined)

  // 组件挂载时获取图书列表 - 需求 4.1
  useEffect(() => {
    fetchBooks()
  }, [fetchBooks])

  // 打开添加图书弹窗 - 需求 5.1
  const handleAddBook = () => {
    setEditingBook(undefined)
    setIsModalVisible(true)
  }

  // 打开编辑图书弹窗 - 需求 6.1
  const handleEditBook = (book: Book) => {
    setEditingBook(book)
    setIsModalVisible(true)
  }

  // 处理删除图书 - 需求 7.1, 7.2
  const handleDeleteBook = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这本图书吗？此操作不可恢复。',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteBook(id)
          message.success('图书删除成功') // 需求 7.4
        } catch {
          message.error('图书删除失败') // 需求 7.5
        }
      },
    })
  }

  // 处理表单提交（添加或编辑）
  const handleFormSubmit = async (data: BookFormData) => {
    try {
      // 确保 cover 是 string 类型（BookFormModal 已经处理了文件上传）
      const bookData = {
        name: data.name,
        author: data.author,
        description: data.description,
        cover: typeof data.cover === 'string' ? data.cover : '',
      }

      if (editingBook) {
        // 编辑模式 - 需求 6.2
        await updateBook(editingBook.id, bookData)
        message.success('图书更新成功') // 需求 6.5
      } else {
        // 添加模式 - 需求 5.2
        await createBook(bookData)
        message.success('图书添加成功') // 需求 5.5
      }
      setIsModalVisible(false)
      setEditingBook(undefined)
    } catch {
      // 错误信息已在 useBooks hook 中处理
      if (editingBook) {
        message.error('图书更新失败') // 需求 6.6
      } else {
        message.error('图书添加失败') // 需求 5.6
      }
    }
  }

  // 处理取消弹窗 - 需求 5.4, 6.4
  const handleModalCancel = () => {
    setIsModalVisible(false)
    setEditingBook(undefined)
  }

  // 处理登出 - 需求 8.1, 8.2
  const handleLogout = () => {
    logout()
    message.success('已成功登出')
  }

  return (
    <Layout className="book-management-layout">
      <Header className="book-management-header">
        <div className="header-content">
          <Title level={3} className="header-title">
            图书管理系统
          </Title>
          <Space>
            <span className="user-info">欢迎，{user?.username}</span>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddBook}
            >
              添加图书
            </Button>
            <Button
              icon={<LogoutOutlined />}
              onClick={handleLogout}
            >
              登出
            </Button>
          </Space>
        </div>
      </Header>

      <Content className="book-management-content">
        <div className="content-wrapper">
          <BookList
            books={books}
            loading={loading}
            onEdit={handleEditBook}
            onDelete={handleDeleteBook}
          />
        </div>
      </Content>

      <BookFormModal
        visible={isModalVisible}
        book={editingBook}
        onSubmit={handleFormSubmit}
        onCancel={handleModalCancel}
      />
    </Layout>
  )
}
