# 设计文档

## 概述

图书管理系统前端是一个基于 React 19 + TypeScript + Vite 构建的单页应用（SPA）。系统提供完整的用户认证流程和图书管理功能，采用现代化的组件化架构设计，确保代码的可维护性和可扩展性。

应用的核心功能包括：
- 用户注册和登录
- 基于令牌的身份认证
- 图书列表展示
- 图书的增删改查操作
- 响应式用户界面

## 架构

### 整体架构

系统采用分层架构设计：

```
┌─────────────────────────────────────┐
│         展示层 (Presentation)        │
│    Pages / Components / Modals      │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│         业务逻辑层 (Business)        │
│      Hooks / Services / Utils       │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│         数据访问层 (Data Access)     │
│          API Client / Types         │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│         后端 API (Backend)          │
│      NestJS REST API Services       │
└─────────────────────────────────────┘
```

### 技术栈

- **UI 框架**: React 19
- **语言**: TypeScript 5.9
- **构建工具**: Vite 7
- **路由**: React Router v6
- **状态管理**: React Context API + Hooks
- **HTTP 客户端**: Fetch API
- **UI 组件库**: Ant Design 5.x
- **表单处理**: Ant Design Form
- **表单验证**: Zod
- **样式方案**: Ant Design 主题定制 + CSS Modules

### 目录结构

```
src/
├── api/                    # API 客户端
│   ├── client.ts          # HTTP 客户端配置
│   ├── auth.api.ts        # 认证相关 API
│   └── book.api.ts        # 图书相关 API
├── components/            # 可复用组件
│   ├── layout/           # 布局组件
│   │   ├── Header/
│   │   └── AppLayout/
│   └── book/             # 图书相关组件
│       ├── BookCard/
│       ├── BookList/
│       ├── BookForm/
│       └── BookFormModal/
├── pages/                # 页面组件
│   ├── Login/
│   ├── Register/
│   └── BookManagement/
├── hooks/                # 自定义 Hooks
│   ├── useAuth.ts
│   ├── useBooks.ts
│   └── useToast.ts
├── context/              # Context 提供者
│   ├── AuthContext.tsx
│   └── ToastContext.tsx
├── types/                # TypeScript 类型定义
│   ├── auth.types.ts
│   ├── book.types.ts
│   └── api.types.ts
├── utils/                # 工具函数
│   ├── validation.ts
│   ├── storage.ts
│   └── constants.ts
├── router/               # 路由配置
│   └── index.tsx
├── App.tsx              # 根组件
└── main.tsx             # 应用入口
```

## 组件和接口

### 核心组件

#### 1. 认证相关组件

**LoginPage**
- 职责：渲染登录表单，处理用户登录
- Props：无
- State：表单数据、加载状态、错误信息
- 主要方法：
  - `handleSubmit`: 提交登录表单
  - `validateForm`: 验证表单数据

**RegisterPage**
- 职责：渲染注册表单，处理用户注册
- Props：无
- State：表单数据、加载状态、错误信息
- 主要方法：
  - `handleSubmit`: 提交注册表单
  - `validateForm`: 验证表单数据
  - `checkPasswordMatch`: 检查密码匹配

#### 2. 图书管理组件

**BookManagementPage**
- 职责：图书管理主页面，协调子组件
- Props：无
- State：图书列表、加载状态、选中的图书
- 主要方法：
  - `fetchBooks`: 获取图书列表
  - `handleAddBook`: 打开添加图书弹窗
  - `handleEditBook`: 打开编辑图书弹窗
  - `handleDeleteBook`: 删除图书

**BookList**
- 职责：展示图书列表
- Props：
  - `books: Book[]` - 图书数组
  - `onEdit: (book: Book) => void` - 编辑回调
  - `onDelete: (id: number) => void` - 删除回调
  - `loading: boolean` - 加载状态

**BookCard**
- 职责：展示单个图书信息
- Props：
  - `book: Book` - 图书对象
  - `onEdit: () => void` - 编辑回调
  - `onDelete: () => void` - 删除回调

**BookFormModal**
- 职责：图书添加/编辑弹窗
- Props：
  - `visible: boolean` - 是否显示
  - `book?: Book` - 编辑时的图书数据
  - `onSubmit: (data: BookFormData) => void` - 提交回调
  - `onCancel: () => void` - 取消回调
- State：表单数据、验证错误、上传进度

#### 3. Ant Design 组件使用

本项目使用 Ant Design 作为 UI 组件库，主要使用以下组件：

**布局组件**
- `Layout`, `Header`, `Content` - 页面布局
- `Row`, `Col` - 响应式网格系统

**表单组件**
- `Form`, `Form.Item` - 表单容器和表单项
- `Input`, `Input.Password` - 输入框
- `Button` - 按钮
- `Upload` - 文件上传

**数据展示组件**
- `Card` - 卡片容器
- `Empty` - 空状态
- `Spin` - 加载指示器
- `Skeleton` - 骨架屏

**反馈组件**
- `Modal` - 对话框
- `message` - 全局提示
- `Alert` - 警告提示
- `Result` - 结果页

**其他组件**
- `Space` - 间距组件
- `Divider` - 分割线

### Context 和 Hooks

#### AuthContext
```typescript
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}
```

#### useAuth Hook
```typescript
function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

#### useBooks Hook
```typescript
interface UseBooksReturn {
  books: Book[];
  loading: boolean;
  error: string | null;
  fetchBooks: () => Promise<void>;
  createBook: (data: CreateBookData) => Promise<void>;
  updateBook: (id: number, data: UpdateBookData) => Promise<void>;
  deleteBook: (id: number) => Promise<void>;
}
```

### API 接口

#### 认证 API

```typescript
// POST /user/register
interface RegisterRequest {
  username: string;
  password: string;
}

interface RegisterResponse {
  message: string;
}

// POST /user/login
interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
  };
}
```

#### 图书 API

```typescript
// GET /book/list
interface ListBooksResponse {
  books: Book[];
}

// GET /book/:id
interface GetBookResponse {
  book: Book;
}

// POST /book/create
interface CreateBookRequest {
  name: string;
  author: string;
  description: string;
  cover: string;
}

interface CreateBookResponse {
  message: string;
  book: Book;
}

// PUT /book/update
interface UpdateBookRequest {
  id: number;
  name: string;
  author: string;
  description: string;
  cover: string;
}

interface UpdateBookResponse {
  message: string;
  book: Book;
}

// DELETE /book/delete/:id
interface DeleteBookResponse {
  message: string;
}

// POST /book/upload
interface UploadFileResponse {
  message: string;
  filename: string;
  path: string;
  size: number;
}
```

## 数据模型

### User（用户）
```typescript
interface User {
  id: number;
  username: string;
}
```

### Book（图书）
```typescript
interface Book {
  id: number;
  name: string;
  author: string;
  description: string;
  cover: string;  // 封面图片 URL
}
```

### FormData（表单数据）

```typescript
// 登录表单
interface LoginFormData {
  username: string;
  password: string;
}

// 注册表单
interface RegisterFormData {
  username: string;
  password: string;
  confirmPassword: string;
}

// 图书表单
interface BookFormData {
  name: string;
  author: string;
  description: string;
  cover: File | string;  // 文件对象或 URL
}
```

### API Response（API 响应）
```typescript
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
```

## 正确性属性

*属性是一个特征或行为，应该在系统的所有有效执行中保持为真——本质上是关于系统应该做什么的正式声明。属性作为人类可读规范和机器可验证正确性保证之间的桥梁。*


### 属性 1：有效注册数据创建账号
*对于任何*有效的用户名和密码组合，提交注册表单应该成功创建账号并跳转到登录页面
**验证需求：1.2**

### 属性 2：密码不匹配阻止注册
*对于任何*密码和确认密码不匹配的输入，系统应该阻止表单提交并显示错误信息
**验证需求：1.3**

### 属性 3：空白用户名验证
*对于任何*仅包含空白字符的用户名（空字符串、空格、制表符等），系统应该阻止表单提交并显示必填字段提示
**验证需求：1.5**

### 属性 4：有效凭证登录成功
*对于任何*有效的登录凭证，系统应该验证凭证、保存认证令牌到本地存储并跳转到图书管理页面
**验证需求：2.2, 2.5**

### 属性 5：无效凭证显示错误
*对于任何*无效的登录凭证，系统应该显示错误提示信息
**验证需求：2.3**

### 属性 6：根据认证状态重定向
*对于任何*用户访问根路径，系统应该根据认证状态重定向到相应页面（未认证→登录页，已认证→图书管理页）
**验证需求：3.1**

### 属性 7：未认证访问保护
*对于任何*未认证用户尝试访问图书管理页面，系统应该重定向到登录页面
**验证需求：3.2**

### 属性 8：已认证用户重定向
*对于任何*已认证用户访问登录或注册页面，系统应该重定向到图书管理页面
**验证需求：3.3**

### 属性 9：图书列表加载和显示
*对于任何*已认证用户访问图书管理页面，系统应该从后端API获取并显示所有图书记录
**验证需求：4.1**

### 属性 10：图书记录完整显示
*对于任何*图书记录，系统应该显示所有必需字段（标题、作者、描述、封面图片）
**验证需求：4.4**

### 属性 11：图书记录操作按钮
*对于任何*图书记录，系统应该提供编辑和删除操作按钮
**验证需求：4.5**

### 属性 12：有效图书数据创建成功
*对于任何*有效的图书数据，提交添加表单应该向后端发送创建请求、刷新图书列表、关闭弹窗并显示成功提示
**验证需求：5.2, 5.5**

### 属性 13：缺少必填字段阻止提交
*对于任何*缺少必填字段的图书表单数据，系统应该阻止表单提交并显示验证错误信息
**验证需求：5.3**

### 属性 14：编辑弹窗预填充数据
*对于任何*图书记录，点击编辑按钮应该打开预填充该图书信息的编辑弹窗
**验证需求：6.1**

### 属性 15：有效更新数据保存成功
*对于任何*有效的图书更新数据，提交编辑表单应该向后端发送更新请求、刷新图书列表、关闭弹窗并显示成功提示
**验证需求：6.2, 6.5**

### 属性 16：编辑时清空必填字段阻止提交
*对于任何*编辑表单中被清空的必填字段，系统应该阻止表单提交并显示验证错误信息
**验证需求：6.3**

### 属性 17：删除操作移除图书
*对于任何*图书记录，确认删除应该向后端发送删除请求、从列表中移除该图书并显示成功提示
**验证需求：7.2, 7.4**

### 属性 18：登出清除令牌
*对于任何*已认证用户，点击登出应该清除本地存储的认证令牌
**验证需求：8.1**

### 属性 19：登出后重定向和权限控制
*对于任何*用户登出操作，系统应该重定向到登录页面并阻止访问需要认证的页面
**验证需求：8.2, 8.3**

### 属性 20：无效输入显示错误
*对于任何*表单字段中的无效数据，系统应该在字段失去焦点时显示内联错误信息
**验证需求：9.1**

### 属性 21：修正错误清除提示
*对于任何*表单字段的错误，当用户修正输入后，系统应该立即清除该字段的错误信息
**验证需求：9.2**

### 属性 22：成功提示自动消失
*对于任何*成功完成的操作，系统应该显示成功提示消息并在3秒后自动消失
**验证需求：9.4**

### 属性 23：错误提示手动关闭
*对于任何*失败的操作，系统应该显示错误提示消息直到用户手动关闭
**验证需求：9.5**

### 属性 24：响应式布局适配
*对于任何*视口宽度，系统应该调整布局以适应屏幕尺寸（移动端、平板、桌面）
**验证需求：10.1, 10.2, 10.3**

### 属性 25：弹窗响应式调整
*对于任何*视口宽度，弹窗应该调整尺寸以适应屏幕宽度
**验证需求：10.4**

### 属性 26：图书列表响应式网格
*对于任何*视口宽度，图书列表应该采用响应式网格布局自动调整列数
**验证需求：10.5**

## 错误处理

### 网络错误处理

1. **API 请求失败**
   - 捕获所有 HTTP 错误（4xx, 5xx）
   - 显示用户友好的错误消息
   - 提供重试机制（可选）
   - 记录错误日志用于调试

2. **网络超时**
   - 设置合理的请求超时时间（如 30 秒）
   - 超时后显示提示信息
   - 允许用户手动重试

3. **网络断开**
   - 检测网络连接状态
   - 显示离线提示
   - 缓存用户操作，网络恢复后同步

### 认证错误处理

1. **令牌过期**
   - 检测 401 未授权响应
   - 清除本地令牌
   - 重定向到登录页面
   - 显示会话过期提示

2. **令牌无效**
   - 验证令牌格式
   - 清除无效令牌
   - 重定向到登录页面

### 表单验证错误

1. **客户端验证**
   - 实时验证用户输入
   - 显示内联错误信息
   - 阻止无效表单提交

2. **服务端验证**
   - 处理后端返回的验证错误
   - 映射错误到对应表单字段
   - 显示详细错误信息

### 文件上传错误

1. **文件类型错误**
   - 验证文件扩展名（png, jpg, jpeg）
   - 显示支持的文件类型提示

2. **文件大小错误**
   - 限制文件大小（如 10MB）
   - 显示文件过大提示

3. **上传失败**
   - 捕获上传错误
   - 显示失败原因
   - 允许重新上传

### 错误边界

使用 React Error Boundary 捕获组件渲染错误：
- 防止整个应用崩溃
- 显示友好的错误页面
- 提供返回首页或刷新选项
- 记录错误信息用于调试

## 测试策略

### 单元测试（可选）

如需要单元测试，可使用 **Vitest** 作为测试框架，测试以下内容：

1. **工具函数测试**
   - 验证函数（validation.ts）
   - 存储工具（storage.ts）
   - 常量和配置

2. **Hooks 测试**
   - useAuth hook 的各种状态
   - useBooks hook 的 CRUD 操作

3. **API 客户端测试**
   - 使用 Mock Service Worker (MSW) 模拟 API
   - 测试请求/响应处理
   - 测试错误处理逻辑

### 属性测试

使用 **fast-check** 库进行属性测试，每个测试运行至少 100 次迭代：

1. **表单验证属性测试**
   - 生成随机用户输入
   - 验证验证规则的一致性
   - 测试边界条件

2. **路由保护属性测试**
   - 生成随机认证状态
   - 验证路由守卫的正确性
   - 测试重定向逻辑

3. **数据转换属性测试**
   - 生成随机 API 响应
   - 验证数据映射的正确性
   - 测试类型安全

4. **响应式布局属性测试**
   - 生成随机视口尺寸
   - 验证布局适配的正确性
   - 测试断点行为

**属性测试标注规范**：
- 每个属性测试必须使用注释标注对应的设计文档属性
- 格式：`// Feature: book-management-frontend, Property {number}: {property_text}`
- 每个正确性属性必须对应一个属性测试

### 集成测试（可选）

如需要集成测试，可使用 **React Testing Library**：

1. **认证流程测试**
   - 完整的注册流程
   - 完整的登录流程
   - 登出流程

2. **图书管理流程测试**
   - 添加图书的完整流程
   - 编辑图书的完整流程
   - 删除图书的完整流程

3. **路由导航测试**
   - 页面间导航
   - 路由守卫
   - 重定向逻辑

### 端到端测试（可选）

使用 **Playwright** 或 **Cypress** 进行 E2E 测试：

1. **关键用户路径**
   - 新用户注册并添加第一本图书
   - 用户登录并管理图书
   - 用户登出

2. **跨浏览器测试**
   - Chrome
   - Firefox
   - Safari

### 测试覆盖率目标

- 属性测试：覆盖所有正确性属性
- 单元测试和集成测试为可选项

### 测试最佳实践

1. **测试隔离**
   - 每个测试独立运行
   - 使用 beforeEach/afterEach 清理状态
   - 避免测试间依赖

2. **Mock 策略**
   - Mock 外部依赖（API、localStorage）
   - 不 Mock 被测试的核心逻辑
   - 使用真实数据结构

3. **测试可读性**
   - 使用描述性的测试名称
   - 遵循 AAA 模式（Arrange-Act-Assert）
   - 添加必要的注释

4. **持续集成**
   - 在 CI/CD 管道中运行所有测试
   - 测试失败时阻止部署
   - 生成测试报告

## 性能优化

### 代码分割

1. **路由级别分割**
   - 使用 React.lazy 和 Suspense
   - 按页面拆分代码包
   - 减少初始加载时间

2. **组件级别分割**
   - 懒加载大型组件（如富文本编辑器）
   - 按需加载第三方库

### 状态管理优化

1. **避免不必要的重渲染**
   - 使用 React.memo 优化组件
   - 使用 useMemo 和 useCallback 缓存值和函数
   - 合理拆分 Context

2. **数据缓存**
   - 缓存 API 响应
   - 使用 SWR 或 React Query（可选）
   - 实现乐观更新

### 资源优化

1. **图片优化**
   - 压缩上传的图片
   - 使用适当的图片格式（WebP）
   - 实现图片懒加载

2. **打包优化**
   - Tree shaking 移除未使用代码
   - 压缩 JavaScript 和 CSS
   - 使用 CDN 加速静态资源

### 网络优化

1. **请求优化**
   - 合并多个 API 请求
   - 实现请求防抖和节流
   - 使用 HTTP 缓存头

2. **预加载**
   - 预加载关键资源
   - 预取可能访问的页面

## 安全考虑

### 认证安全

1. **令牌管理**
   - 使用 HttpOnly Cookie 存储令牌（推荐）
   - 或使用 localStorage 并注意 XSS 风险
   - 实现令牌刷新机制

2. **密码安全**
   - 前端不存储明文密码
   - 使用 HTTPS 传输
   - 实现密码强度检查

### XSS 防护

1. **输入清理**
   - 对用户输入进行转义
   - 使用 React 的自动转义
   - 避免使用 dangerouslySetInnerHTML

2. **内容安全策略**
   - 配置 CSP 头
   - 限制脚本来源

### CSRF 防护

1. **令牌验证**
   - 使用 CSRF 令牌
   - 验证请求来源

2. **SameSite Cookie**
   - 设置 SameSite 属性
   - 防止跨站请求

### 数据验证

1. **客户端验证**
   - 验证所有用户输入
   - 使用类型安全的验证库（Zod）

2. **服务端验证**
   - 不信任客户端数据
   - 后端进行二次验证

## 可访问性

### ARIA 支持

1. **语义化 HTML**
   - 使用正确的 HTML 标签
   - 添加 ARIA 标签和角色

2. **键盘导航**
   - 支持 Tab 键导航
   - 实现快捷键
   - 管理焦点状态

### 屏幕阅读器

1. **标签和描述**
   - 为表单字段添加 label
   - 使用 aria-label 和 aria-describedby
   - 提供替代文本

2. **状态通知**
   - 使用 aria-live 区域
   - 通知加载和错误状态

### 视觉设计

1. **颜色对比**
   - 确保足够的颜色对比度（WCAG AA）
   - 不仅依赖颜色传达信息

2. **字体大小**
   - 使用相对单位（rem, em）
   - 支持文本缩放

## 国际化（可选）

### 多语言支持

1. **文本外部化**
   - 使用 i18n 库（如 react-i18next）
   - 将所有文本提取到语言文件

2. **日期和数字格式**
   - 使用 Intl API
   - 支持不同地区格式

## 部署

### 构建配置

1. **环境变量**
   - 配置不同环境的 API 端点
   - 使用 .env 文件管理配置

2. **构建优化**
   - 生产环境启用压缩
   - 生成 source map（可选）

### 部署策略

1. **静态托管**
   - 部署到 Vercel、Netlify 或 AWS S3
   - 配置 SPA 路由重定向

2. **CI/CD**
   - 自动化构建和部署
   - 运行测试后再部署

### 监控

1. **错误监控**
   - 集成 Sentry 或类似工具
   - 收集和分析错误

2. **性能监控**
   - 使用 Web Vitals
   - 监控加载时间和交互性能
