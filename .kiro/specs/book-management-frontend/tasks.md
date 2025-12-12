# 实施计划

- [x] 1. 项目基础设施搭建
  - 安装必要的依赖包（React Router、Ant Design、axios）
  - 配置 Ant Design 样式导入
  - 配置 TypeScript 路径别名
  - _需求：所有需求的基础_
- [x] 2. 创建类型定义和常量
  - 定义 User、Book、API 响应等 TypeScript 类型
  - 创建 API 端点常量
  - _需求：1.1-8.3_

- [x] 3. 实现 API 客户端
  - 创建 axios 实例配置
  - 实现认证 API（register, login）
  - 实现图书 API（list, create, update, delete）
  - 实现文件上传 API
  - 添加请求拦截器处理认证令牌
  - 添加响应拦截器处理错误
  - _需求：1.2, 1.4, 2.2, 2.3, 4.1, 5.2, 6.2, 7.2_

- [x] 4. 实现本地存储工具
  - 创建 localStorage 封装函数
  - 实现令牌存储和读取
  - 实现令牌清除功能
  - _需求：2.5, 8.1_

- [x] 5. 创建 AuthContext 和 useAuth Hook
  - 实现 AuthContext 提供认证状态
  - 实现 login 方法
  - 实现 register 方法
  - 实现 logout 方法
  - 从 localStorage 恢复认证状态
  - _需求：1.2, 2.2, 8.1, 8.2_

- [x] 6. 配置路由系统
  - 安装并配置 React Router
  - 创建路由配置（/, /login, /register, /books）
  - 实现 ProtectedRoute 组件（路由守卫）
  - 实现根路径重定向逻辑
  - _需求：3.1, 3.2, 3.3_

- [x] 7. 实现注册页面
  - 创建 RegisterPage 组件
  - 使用 Ant Design 的 Form、Input、Button 组件
  - 实现表单提交逻辑
  - 显示验证错误信息
  - 添加跳转到登录页面的链接
  - _需求：1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

- [x] 8. 实现登录页面
  - 创建 LoginPage 组件
  - 使用 Ant Design 的 Form、Input、Button 组件
  - 实现表单提交逻辑
  - 显示验证错误信息
  - 添加跳转到注册页面的链接
  - _需求：2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

- [x] 9. 创建 useBooks Hook
  - 实现 fetchBooks 方法
  - 实现 createBook 方法
  - 实现 updateBook 方法
  - 实现 deleteBook 方法
  - 管理加载状态
  - _需求：4.1, 5.2, 6.2, 7.2_

- [x] 10. 实现图书卡片组件
  - 创建 BookCard 组件
  - 使用 Ant Design 的 Card 组件
  - 显示图书封面、标题、作者、描述
  - 添加编辑和删除按钮
  - _需求：4.4, 4.5_

- [x] 11. 实现图书列表组件
  - 创建 BookList 组件
  - 使用 Ant Design 的 Spin 显示加载状态
  - 使用 Ant Design 的 Empty 显示空状态
  - 渲染 BookCard 组件
  - _需求：4.1, 4.2, 4.3_

- [x] 12. 实现图书表单弹窗组件
  - 创建 BookFormModal 组件
  - 使用 Ant Design 的 Modal、Form、Input、Upload 组件
  - 实现文件上传功能（封面图片）
  - 支持添加和编辑模式
  - 实现表单提交和取消逻辑
  - _需求：5.1, 5.2, 5.3, 6.1, 6.2, 6.3_

- [x] 13. 实现图书管理主页面
  - 创建 BookManagementPage 组件
  - 使用 Ant Design 的 Layout 组件构建页面布局
  - 集成 BookList 组件
  - 集成 BookFormModal 组件
  - 添加"添加图书"按钮
  - 实现编辑图书功能
  - 实现删除图书功能（使用 Modal.confirm）
  - 添加登出按钮
  - _需求：4.1-8.3_

- [x] 14. 集成所有组件到 App
  - 在 App.tsx 中集成 AuthProvider
  - 集成 Router
  - 配置 Ant Design 全局样式
  - _需求：所有需求_

- [x] 15. 配置环境变量
  - 创建 .env 文件
  - 配置 API 基础 URL
  - _需求：所有需求_

- [x] 16. 最终测试和调试
  - 测试完整的用户流程（注册、登录、图书管理、登出）
  - 修复发现的问题
  - _需求：所有需求_
