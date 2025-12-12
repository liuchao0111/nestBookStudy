import React, { useState } from 'react'
import { Form, Input, Button, Card, Typography, Space, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks'
import type { RegisterFormData } from '@/types'
import './RegisterPage.css'

const { Title, Text } = Typography

/**
 * 注册页面组件
 * 
 * 功能：
 * - 显示注册表单（用户名、密码、确认密码）
 * - 验证表单输入
 * - 处理注册请求
 * - 显示错误信息
 * - 提供跳转到登录页面的链接
 * 
 * 验证规则：
 * - 用户名：必填，不能为空或仅包含空白字符
 * - 密码：必填，最小长度 6 个字符
 * - 确认密码：必填，必须与密码匹配
 */
const RegisterPage: React.FC = () => {
  const [form] = Form.useForm<RegisterFormData>()
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  /**
   * 处理表单提交
   * @param values 表单数据
   */
  const handleSubmit = async (values: RegisterFormData) => {
    try {
      setLoading(true)
      
      // 调用注册 API
      await register(values.username, values.password)
      
      // 注册成功，显示提示并跳转到登录页面
      message.success('注册成功！请登录')
      navigate('/login')
    } catch (error: unknown) {
      // 显示错误信息
      const errorMessage = 
        (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message ||
        (error as { message?: string })?.message ||
        '注册失败，请重试'
      message.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-page">
      <Card className="register-card">
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div className="register-header">
            <Title level={2}>用户注册</Title>
            <Text type="secondary">创建新账号以使用图书管理系统</Text>
          </div>

          <Form
            form={form}
            name="register"
            onFinish={handleSubmit}
            autoComplete="off"
            layout="vertical"
            size="large"
          >
            {/* 用户名字段 */}
            <Form.Item
              name="username"
              label="用户名"
              rules={[
                { required: true, message: '请输入用户名' },
                {
                  validator: (_, value) => {
                    // 验证用户名不能为空或仅包含空白字符
                    if (value && value.trim().length === 0) {
                      return Promise.reject(new Error('用户名不能为空或仅包含空白字符'))
                    }
                    return Promise.resolve()
                  },
                },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="请输入用户名"
                disabled={loading}
              />
            </Form.Item>

            {/* 密码字段 */}
            <Form.Item
              name="password"
              label="密码"
              rules={[
                { required: true, message: '请输入密码' },
                { min: 6, message: '密码长度至少为 6 个字符' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="请输入密码（至少 6 个字符）"
                disabled={loading}
              />
            </Form.Item>

            {/* 确认密码字段 */}
            <Form.Item
              name="confirmPassword"
              label="确认密码"
              dependencies={['password']}
              rules={[
                { required: true, message: '请确认密码' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(new Error('两次输入的密码不匹配'))
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="请再次输入密码"
                disabled={loading}
              />
            </Form.Item>

            {/* 提交按钮 */}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
              >
                注册
              </Button>
            </Form.Item>

            {/* 跳转到登录页面的链接 */}
            <Form.Item style={{ marginBottom: 0 }}>
              <Text>
                已有账号？{' '}
                <Link to="/login">立即登录</Link>
              </Text>
            </Form.Item>
          </Form>
        </Space>
      </Card>
    </div>
  )
}

export default RegisterPage
