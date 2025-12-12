import React, { useState } from 'react'
import { Form, Input, Button, Card, Typography, Space, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks'
import type { LoginFormData } from '@/types'
import './LoginPage.css'

const { Title, Text } = Typography

/**
 * 登录页面组件
 * 
 * 功能：
 * - 显示登录表单（用户名、密码）
 * - 验证表单输入
 * - 处理登录请求
 * - 显示错误信息
 * - 提供跳转到注册页面的链接
 * 
 * 验证规则：
 * - 用户名：必填
 * - 密码：必填
 */
const LoginPage: React.FC = () => {
  const [form] = Form.useForm<LoginFormData>()
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  /**
   * 处理表单提交
   * @param values 表单数据
   */
  const handleSubmit = async (values: LoginFormData) => {
    try {
      setLoading(true)
      
      // 调用登录 API
      await login(values.username, values.password)
      
      // 登录成功，显示提示并跳转到图书管理页面
      message.success('登录成功！')
      navigate('/books')
    } catch (error: unknown) {
      // 显示错误信息
      const errorMessage = 
        (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message ||
        (error as { message?: string })?.message ||
        '用户名或密码错误'
      message.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <Card className="login-card">
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div className="login-header">
            <Title level={2}>用户登录</Title>
          </div>

          <Form
            form={form}
            name="login"
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
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="请输入密码"
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
                登录
              </Button>
            </Form.Item>

            {/* 跳转到注册页面的链接 */}
            <Form.Item style={{ marginBottom: 0 }}>
              <Text>
                还没有账号？{' '}
                <Link to="/register">立即注册</Link>
              </Text>
            </Form.Item>
          </Form>
        </Space>
      </Card>
    </div>
  )
}

export default LoginPage
