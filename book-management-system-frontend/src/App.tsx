import { RouterProvider } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { AuthProvider } from '@/context';
import { router } from '@/router';
import './App.css';

/**
 * 应用根组件
 * 
 * 集成了以下功能：
 * - Ant Design ConfigProvider：配置全局主题和国际化
 * - AuthProvider：提供认证上下文
 * - RouterProvider：提供路由功能
 */
function App() {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          // 主题色配置
          colorPrimary: '#1890ff',
          borderRadius: 6,
          // 字体配置
          fontSize: 14,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        },
        algorithm: theme.defaultAlgorithm,
      }}
    >
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;
