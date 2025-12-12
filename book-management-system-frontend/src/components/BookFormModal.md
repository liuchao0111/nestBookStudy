# BookFormModal 组件

图书表单弹窗组件，用于添加和编辑图书信息。

## 功能特性

- ✅ 支持添加和编辑两种模式
- ✅ 使用 Ant Design 的 Modal、Form、Input、Upload 组件
- ✅ 实现文件上传功能（封面图片）
- ✅ 表单验证（必填字段、长度限制、空白字符检查）
- ✅ 文件类型和大小验证
- ✅ 支持预览已上传的封面
- ✅ 表单提交和取消逻辑

## Props

```typescript
interface BookFormModalProps {
  visible: boolean          // 控制弹窗显示/隐藏
  book?: Book              // 编辑模式时传入的图书数据（可选）
  onSubmit: (data: BookFormData) => Promise<void>  // 表单提交回调
  onCancel: () => void     // 取消/关闭回调
}
```

## 使用示例

### 添加图书模式

```tsx
import { BookFormModal } from '@/components'
import { useState } from 'react'

function BookManagement() {
  const [visible, setVisible] = useState(false)

  const handleSubmit = async (data: BookFormData) => {
    // 调用 API 创建图书
    await createBook(data)
    setVisible(false)
  }

  return (
    <>
      <Button onClick={() => setVisible(true)}>添加图书</Button>
      <BookFormModal
        visible={visible}
        onSubmit={handleSubmit}
        onCancel={() => setVisible(false)}
      />
    </>
  )
}
```

### 编辑图书模式

```tsx
import { BookFormModal } from '@/components'
import { useState } from 'react'

function BookManagement() {
  const [visible, setVisible] = useState(false)
  const [selectedBook, setSelectedBook] = useState<Book | undefined>()

  const handleEdit = (book: Book) => {
    setSelectedBook(book)
    setVisible(true)
  }

  const handleSubmit = async (data: BookFormData) => {
    // 调用 API 更新图书
    await updateBook(selectedBook!.id, data)
    setVisible(false)
  }

  return (
    <>
      <BookFormModal
        visible={visible}
        book={selectedBook}
        onSubmit={handleSubmit}
        onCancel={() => setVisible(false)}
      />
    </>
  )
}
```

## 表单验证规则

### 图书名称
- 必填
- 最少 1 个字符
- 最多 200 个字符
- 不能只包含空格

### 作者
- 必填
- 最少 1 个字符
- 最多 100 个字符
- 不能只包含空格

### 描述
- 必填
- 最多 1000 个字符
- 不能只包含空格

### 封面图片
- 可选
- 支持格式：PNG、JPG、JPEG
- 最大文件大小：10MB
- 最多上传 1 个文件

## 需求覆盖

该组件满足以下需求：

- **需求 5.1**: 点击添加图书按钮时打开包含空白表单的弹窗
- **需求 5.2**: 填写图书信息并提交后发送创建请求
- **需求 5.3**: 必填字段为空时阻止提交并显示验证错误
- **需求 6.1**: 点击编辑按钮时打开预填充图书信息的编辑弹窗
- **需求 6.2**: 修改图书信息并提交后发送更新请求
- **需求 6.3**: 编辑时必填字段被清空时阻止提交并显示验证错误

## 技术实现

- 使用 Ant Design Form 进行表单管理和验证
- 使用 Upload 组件的 customRequest 实现自定义上传逻辑
- 使用 useEffect 监听弹窗状态，自动重置或预填充表单
- 支持文件类型和大小的前端验证
- 提供友好的错误提示和成功反馈
