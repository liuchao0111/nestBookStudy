#!/usr/bin/env node

/**
 * 测试 axios 上传（模拟修复后的行为）
 */

import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testAxiosUpload() {
  log('\n========================================', 'blue');
  log('测试 Axios 上传（模拟修复后的行为）', 'blue');
  log('========================================\n', 'blue');

  // 创建 axios 实例（模拟前端配置）
  const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // 添加请求拦截器（模拟修复后的代码）
  apiClient.interceptors.request.use(
    (config) => {
      log('📤 请求拦截器执行...', 'cyan');
      
      // 检查是否是 FormData
      if (config.data instanceof FormData) {
        log('  检测到 FormData，删除 Content-Type', 'yellow');
        delete config.headers['Content-Type'];
      } else {
        log('  普通请求，保持 Content-Type: application/json', 'yellow');
      }
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // 测试上传
  try {
    log('\n📤 开始上传测试...', 'cyan');
    
    const testImageBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );
    
    const formData = new FormData();
    const blob = new Blob([testImageBuffer], { type: 'image/png' });
    formData.append('file', blob, 'test.png');
    
    const response = await apiClient.post('/book/upload', formData);
    
    if (response.status === 201) {
      log('\n✓ 上传成功！', 'green');
      log('响应数据:', 'green');
      console.log(JSON.stringify(response.data, null, 2));
    } else {
      log(`\n⚠ 意外的响应状态: ${response.status}`, 'yellow');
    }
  } catch (error) {
    log('\n✗ 上传失败！', 'red');
    if (error.response) {
      log(`状态码: ${error.response.status}`, 'red');
      log('错误信息:', 'red');
      console.log(JSON.stringify(error.response.data, null, 2));
    } else {
      log(`错误: ${error.message}`, 'red');
    }
  }

  log('\n========================================', 'blue');
  log('测试完成', 'blue');
  log('========================================\n', 'blue');
}

testAxiosUpload();
