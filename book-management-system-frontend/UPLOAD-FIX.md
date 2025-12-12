# 文件上传 500 错误修复报告

## 问题描述

前端项目使用上传接口时报错 500（实际上是 400 Bad Request）。

## 问题原因

在 `src/api/book.api.ts` 的 `uploadFile` 函数中，手动设置了 `Content-Type: multipart/form-data`：

```typescript
const response = await apiClient.post<UploadFileResponse>(
  API_ENDPOINTS.BOOK_UPLOAD,
  formData,
  {
    headers: {
      'Content-Type': 'multipart/form-data',  // ❌ 问题所在
    },
  }
)
```

### 为什么会出错？

当上传文件时，`Content-Type` 必须是 `multipart/form-data; boundary=----WebKitFormBoundary...` 这样的格式，其中 `boundary` 参数是一个随机生成的字符串，用于分隔表单中的不同字段。

如果手动设置 `Content-Type: multipart/form-data` 而不包含 boundary 参数，服务器会返回错误：

```
Multipart: Boundary not found
```

## 测试验证

我们进行了三个测试：

### 测试 1: 手动设置 Content-Type
```javascript
headers: {
  'Content-Type': 'multipart/form-data'
}
```
**结果**: ❌ 失败 - 400 Bad Request (Boundary not found)

### 测试 2: 不设置 Content-Type
```javascript
// 不设置 headers，让浏览器/axios 自动处理
```
**结果**: ✅ 成功 - 201 Created

### 测试 3: 带认证 Token
```javascript
headers: {
  'Authorization': 'Bearer test_token'
  // 不设置 Content-Type
}
```
**结果**: ✅ 成功 - 201 Created

## 解决方案

### 修改前
```typescript
export const uploadFile = async (file: File): Promise<UploadFileResponse> => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await apiClient.post<UploadFileResponse>(
    API_ENDPOINTS.BOOK_UPLOAD,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',  // ❌ 删除这行
      },
    }
  )
  return response.data
}
```

### 修改后
```typescript
export const uploadFile = async (file: File): Promise<UploadFileResponse> => {
  const formData = new FormData()
  formData.append('file', file)

  // 注意：不要手动设置 Content-Type，让 axios 自动处理
  // axios 会自动设置正确的 Content-Type 和 boundary
  const response = await apiClient.post<UploadFileResponse>(
    API_ENDPOINTS.BOOK_UPLOAD,
    formData
  )
  return response.data
}
```

## 技术说明

### Axios 的自动处理

当你向 axios 传递 `FormData` 对象时，axios 会：

1. 检测到 body 是 `FormData` 类型
2. 自动设置正确的 `Content-Type` 头，包含 boundary 参数
3. 例如：`Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW`

### 为什么不能手动设置？

如果你手动设置 `Content-Type: multipart/form-data`：
- 会覆盖 axios 的自动设置
- 缺少必需的 boundary 参数
- 服务器无法正确解析 multipart 数据

### 正确的做法

对于文件上传：
- ✅ **不设置** Content-Type，让 axios/fetch 自动处理
- ✅ 只设置其他必要的 headers（如 Authorization）
- ✅ 让库自动添加正确的 boundary 参数

## 验证修复

修复后，文件上传应该正常工作：

1. 打开浏览器开发者工具
2. 访问图书管理页面
3. 点击"添加图书"
4. 上传一个图片文件
5. 查看 Network 标签中的请求

**预期结果**:
- 请求头包含：`Content-Type: multipart/form-data; boundary=----WebKitFormBoundary...`
- 响应状态：201 Created
- 响应数据包含上传的文件信息

## 相关文件

- ✅ 已修复：`src/api/book.api.ts`
- 无需修改：`src/components/BookFormModal.tsx`（组件实现正确）
- 无需修改：后端上传接口（后端实现正确）

## 总结

这是一个常见的文件上传错误。记住：

> **当使用 FormData 上传文件时，永远不要手动设置 Content-Type！**

让 axios、fetch 或其他 HTTP 库自动处理 Content-Type 和 boundary 参数。

---

**修复日期**: 2024年12月12日  
**修复人员**: Kiro AI Assistant  
**状态**: ✅ 已修复
