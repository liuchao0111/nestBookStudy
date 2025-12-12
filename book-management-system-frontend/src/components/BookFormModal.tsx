import { useEffect, useState } from 'react'
import { Modal, Form, Input, Upload, Button, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import type { UploadFile, UploadProps } from 'antd'
import { uploadFile } from '@/api/book.api'
import { UPLOAD_CONFIG, VALIDATION_RULES, getImageUrl } from '@/utils'
import type { Book, BookFormData } from '@/types'

interface BookFormModalProps {
  visible: boolean
  book?: Book
  onSubmit: (data: BookFormData) => Promise<void>
  onCancel: () => void
}

export const BookFormModal: React.FC<BookFormModalProps> = ({
  visible,
  book,
  onSubmit,
  onCancel,
}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [uploadedCoverUrl, setUploadedCoverUrl] = useState<string>('')

  // 判断是编辑模式还是添加模式
  const isEditMode = !!book

  // 当弹窗打开或关闭时，重置表单和状态
  useEffect(() => {
    if (visible) {
      if (isEditMode && book) {
        // 编辑模式：预填充数据
        form.setFieldsValue({
          name: book.name,
          author: book.author,
          description: book.description,
        })
        setUploadedCoverUrl(book.cover)
        // 如果有封面，显示在文件列表中
        if (book.cover) {
          setFileList([
            {
              uid: '-1',
              name: '当前封面',
              status: 'done',
              url: getImageUrl(book.cover), // 使用完整 URL
            },
          ])
        }
      } else {
        // 添加模式：清空表单
        form.resetFields()
        setFileList([])
        setUploadedCoverUrl('')
      }
    } else {
      // 弹窗关闭时清空所有状态
      form.resetFields()
      setFileList([])
      setUploadedCoverUrl('')
    }
  }, [visible, book, isEditMode, form])

  // 处理文件上传
  const handleUpload: UploadProps['customRequest'] = async (options) => {
    const { file, onSuccess, onError } = options

    try {
      // 验证文件类型
      const fileObj = file as File
      const acceptedTypes = UPLOAD_CONFIG.ACCEPTED_IMAGE_TYPES as readonly string[]
      if (!acceptedTypes.includes(fileObj.type)) {
        message.error('只支持 PNG、JPG、JPEG 格式的图片')
        onError?.(new Error('不支持的文件类型'))
        return
      }

      // 验证文件大小
      if (fileObj.size > UPLOAD_CONFIG.MAX_FILE_SIZE) {
        message.error('文件大小不能超过 10MB')
        onError?.(new Error('文件过大'))
        return
      }

      // 上传文件
      const response = await uploadFile(fileObj)
      setUploadedCoverUrl(response.path)
      message.success('封面上传成功')
      onSuccess?.(response)
    } catch (error) {
      message.error('封面上传失败')
      onError?.(error as Error)
    }
  }

  // 处理文件列表变化
  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList)
  }

  // 处理文件移除
  const handleRemove = () => {
    setUploadedCoverUrl('')
    setFileList([])
  }

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      // 验证表单
      const values = await form.validateFields()

      setLoading(true)

      // 构建提交数据
      const formData: BookFormData = {
        name: values.name,
        author: values.author,
        description: values.description,
        cover: uploadedCoverUrl || (isEditMode && book ? book.cover : ''),
      }

      // 调用父组件的提交回调
      await onSubmit(formData)

      // 提交成功后关闭弹窗
      form.resetFields()
      setFileList([])
      setUploadedCoverUrl('')
    } catch (error) {
      // 表单验证失败或提交失败
      console.error('表单提交失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 处理取消
  const handleCancel = () => {
    form.resetFields()
    setFileList([])
    setUploadedCoverUrl('')
    onCancel()
  }

  return (
    <Modal
      title={isEditMode ? '编辑图书' : '添加图书'}
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      okText="提交"
      cancelText="取消"
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
      >
        <Form.Item
          label="图书名称"
          name="name"
          rules={[
            { required: true, message: '请输入图书名称' },
            {
              min: VALIDATION_RULES.BOOK_NAME.MIN_LENGTH,
              message: `图书名称至少 ${VALIDATION_RULES.BOOK_NAME.MIN_LENGTH} 个字符`,
            },
            {
              max: VALIDATION_RULES.BOOK_NAME.MAX_LENGTH,
              message: `图书名称最多 ${VALIDATION_RULES.BOOK_NAME.MAX_LENGTH} 个字符`,
            },
            {
              whitespace: true,
              message: '图书名称不能只包含空格',
            },
          ]}
        >
          <Input placeholder="请输入图书名称" />
        </Form.Item>

        <Form.Item
          label="作者"
          name="author"
          rules={[
            { required: true, message: '请输入作者' },
            {
              min: VALIDATION_RULES.BOOK_AUTHOR.MIN_LENGTH,
              message: `作者至少 ${VALIDATION_RULES.BOOK_AUTHOR.MIN_LENGTH} 个字符`,
            },
            {
              max: VALIDATION_RULES.BOOK_AUTHOR.MAX_LENGTH,
              message: `作者最多 ${VALIDATION_RULES.BOOK_AUTHOR.MAX_LENGTH} 个字符`,
            },
            {
              whitespace: true,
              message: '作者不能只包含空格',
            },
          ]}
        >
          <Input placeholder="请输入作者" />
        </Form.Item>

        <Form.Item
          label="描述"
          name="description"
          rules={[
            { required: true, message: '请输入描述' },
            {
              max: VALIDATION_RULES.BOOK_DESCRIPTION.MAX_LENGTH,
              message: `描述最多 ${VALIDATION_RULES.BOOK_DESCRIPTION.MAX_LENGTH} 个字符`,
            },
            {
              whitespace: true,
              message: '描述不能只包含空格',
            },
          ]}
        >
          <Input.TextArea
            placeholder="请输入图书描述"
            rows={4}
            showCount
            maxLength={VALIDATION_RULES.BOOK_DESCRIPTION.MAX_LENGTH}
          />
        </Form.Item>

        <Form.Item label="封面图片">
          <Upload
            listType="picture"
            fileList={fileList}
            customRequest={handleUpload}
            onChange={handleChange}
            onRemove={handleRemove}
            maxCount={1}
            accept={UPLOAD_CONFIG.ACCEPTED_IMAGE_EXTENSIONS.join(',')}
          >
            {fileList.length === 0 && (
              <Button icon={<UploadOutlined />}>上传封面</Button>
            )}
          </Upload>
          <div style={{ marginTop: 8, color: '#999', fontSize: 12 }}>
            支持 PNG、JPG、JPEG 格式，文件大小不超过 10MB
          </div>
        </Form.Item>
      </Form>
    </Modal>
  )
}
