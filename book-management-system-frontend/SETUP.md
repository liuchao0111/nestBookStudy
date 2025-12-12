# 项目配置说明

## 已完成的基础设施搭建

### 1. 依赖包安装
已安装以下核心依赖：
- `react-router-dom` - 路由管理
- `antd` - UI 组件库
- `axios` - HTTP 客户端

### 2. Ant Design 配置
- Ant Design 已集成到项目中
- 可以直接导入和使用 Ant Design 组件
- 示例：`import { Button } from 'antd'`

### 3. TypeScript 路径别名
已配置路径别名 `@/` 指向 `src/` 目录：
- 在 `tsconfig.app.json` 中配置了 TypeScript 路径映射
- 在 `vite.config.ts` 中配置了 Vite 路径解析
- 使用示例：`import { API_BASE_URL } from '@/utils/constants'`

### 4. 环境变量
- 创建了 `.env` 文件用于配置环境变量
- 创建了 `.env.example` 作为示例模板
- 配置了 `VITE_API_BASE_URL` 用于 API 基础地址
- 在 `src/utils/constants.ts` 中定义了 API 常量

## 使用说明

### 开发模式
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 预览生产构建
```bash
npm run preview
```

## 项目结构
```
src/
├── utils/
│   └── constants.ts    # API 常量和配置
├── App.tsx            # 根组件
└── main.tsx           # 应用入口
```

## 下一步
项目基础设施已搭建完成，可以开始实施后续任务：
- 创建类型定义
- 实现 API 客户端
- 创建页面组件
- 实现业务逻辑
