# 重复请求问题修复

## 问题描述

刷新界面时，`/book/list` 接口被调用了两次。

## 问题原因

### 1. React 18 Strict Mode

在开发模式下，React 18 的 `StrictMode` 会**故意**调用两次副作用（useEffect），这是为了帮助开发者发现潜在的问题。

```tsx
// main.tsx
<StrictMode>
  <App />
</StrictMode>
```

**为什么这样做？**
- 帮助发现副作用中的 bug
- 确保组件可以安全地重新挂载
- 为未来的 React 特性（如 Offscreen API）做准备

**注意**：这只在开发模式下发生，生产构建不会有这个问题。

### 2. useEffect 依赖

```tsx
// BookManagementPage.tsx
useEffect(() => {
  fetchBooks()
}, [fetchBooks])  // fetchBooks 作为依赖
```

每次组件渲染时，如果 `fetchBooks` 函数重新创建，就会触发 useEffect。

## 解决方案

### 方案 1：移除 StrictMode（❌ 不推荐）

```tsx
// main.tsx - 不推荐
createRoot(document.getElementById('root')!).render(
  <App />  // 移除 StrictMode
)
```

**缺点**：
- 失去 React 的开发时检查
- 可能隐藏潜在的 bug
- 不符合 React 最佳实践

### 方案 2：添加请求去重逻辑（✅ 推荐）

使用 `useRef` 跟踪请求状态，避免重复请求：

```typescript
// useBooks.ts
const isFetchingRef = useRef<boolean>(false)

const fetchBooks = useCallback(async () => {
  // 如果正在请求中，直接返回
  if (isFetchingRef.current) {
    console.log('📌 跳过重复的 fetchBooks 请求')
    return
  }

  try {
    isFetchingRef.current = true
    setLoading(true)
    // ... 请求逻辑
  } finally {
    setLoading(false)
    isFetchingRef.current = false
  }
}, [])
```

**优点**：
- 保留 StrictMode 的好处
- 避免真正的重复请求
- 性能更好
- 符合 React 最佳实践

### 方案 3：使用 AbortController（高级）

```typescript
const fetchBooks = useCallback(async () => {
  const controller = new AbortController()
  
  try {
    const data = await bookApi.listBooks({ signal: controller.signal })
    setBooks(data)
  } catch (err) {
    if (err.name === 'AbortError') {
      console.log('请求被取消')
      return
    }
    // 处理其他错误
  }
  
  return () => controller.abort()
}, [])
```

## 实现细节

### 修改的文件

**文件**: `src/hooks/useBooks.ts`

### 关键改动

1. **导入 useRef**
```typescript
import { useState, useCallback, useRef } from 'react'
```

2. **添加请求标志**
```typescript
const isFetchingRef = useRef<boolean>(false)
```

3. **请求去重逻辑**
```typescript
if (isFetchingRef.current) {
  console.log('📌 跳过重复的 fetchBooks 请求')
  return
}
```

4. **设置和清除标志**
```typescript
try {
  isFetchingRef.current = true
  // ... 请求
} finally {
  isFetchingRef.current = false
}
```

## 验证修复

### 开发模式

打开浏览器控制台，刷新页面，你会看到：

```
🔄 开始获取图书列表...
📌 跳过重复的 fetchBooks 请求
✅ 成功获取 4 本图书
```

**结果**：虽然 useEffect 被调用两次，但实际只发送了一次网络请求。

### 生产模式

```bash
npm run build
npm run preview
```

在生产模式下，StrictMode 不会重复调用，所以只会看到一次请求。

## 为什么使用 useRef 而不是 useState？

### useState 的问题

```typescript
const [isFetching, setIsFetching] = useState(false)

const fetchBooks = useCallback(async () => {
  if (isFetching) return  // ❌ 问题：闭包陷阱
  
  setIsFetching(true)
  // ...
}, [isFetching])  // ❌ 依赖变化会重新创建函数
```

**问题**：
1. `isFetching` 作为依赖会导致 `fetchBooks` 重新创建
2. 可能导致闭包陷阱，读取到旧的状态值

### useRef 的优势

```typescript
const isFetchingRef = useRef(false)

const fetchBooks = useCallback(async () => {
  if (isFetchingRef.current) return  // ✅ 总是读取最新值
  
  isFetchingRef.current = true
  // ...
}, [])  // ✅ 空依赖，函数不会重新创建
```

**优势**：
1. `useRef` 的值变化不会触发重新渲染
2. 总是读取最新的值，没有闭包问题
3. 函数不需要重新创建，性能更好

## 其他场景的应用

这个模式可以应用到其他需要防止重复请求的场景：

### 1. 防止重复提交

```typescript
const isSubmittingRef = useRef(false)

const handleSubmit = async () => {
  if (isSubmittingRef.current) return
  
  try {
    isSubmittingRef.current = true
    await submitForm()
  } finally {
    isSubmittingRef.current = false
  }
}
```

### 2. 防止重复删除

```typescript
const isDeletingRef = useRef(false)

const handleDelete = async (id: number) => {
  if (isDeletingRef.current) return
  
  try {
    isDeletingRef.current = true
    await deleteItem(id)
  } finally {
    isDeletingRef.current = false
  }
}
```

### 3. 防止重复加载更多

```typescript
const isLoadingMoreRef = useRef(false)

const loadMore = async () => {
  if (isLoadingMoreRef.current) return
  
  try {
    isLoadingMoreRef.current = true
    await fetchMoreData()
  } finally {
    isLoadingMoreRef.current = false
  }
}
```

## 调试技巧

### 1. 添加日志

```typescript
console.log('🔄 开始获取图书列表...')
console.log('📌 跳过重复的请求')
console.log('✅ 成功获取数据')
console.log('❌ 请求失败')
```

### 2. 使用 React DevTools

- 打开 React DevTools
- 查看 Components 标签
- 观察组件的渲染次数和 props 变化

### 3. 使用 Network 面板

- 打开浏览器开发者工具
- 进入 Network 标签
- 观察实际的网络请求次数

## 总结

### 问题
- React 18 StrictMode 在开发模式下会调用两次 useEffect
- 导致接口被调用两次

### 解决
- 使用 `useRef` 添加请求去重逻辑
- 保留 StrictMode 的好处
- 避免真正的重复网络请求

### 效果
- ✅ 开发模式：useEffect 调用 2 次，网络请求 1 次
- ✅ 生产模式：useEffect 调用 1 次，网络请求 1 次
- ✅ 性能优化：避免不必要的网络请求
- ✅ 代码质量：符合 React 最佳实践

---

**修复日期**: 2024年12月12日  
**修复方式**: 使用 useRef 实现请求去重  
**状态**: ✅ 已修复
