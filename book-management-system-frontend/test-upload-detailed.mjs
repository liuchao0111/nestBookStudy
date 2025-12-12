#!/usr/bin/env node

/**
 * 详细测试文件上传接口（模拟前端请求）
 */

const API_BASE_URL = 'http://localhost:3000';

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testUploadWithAxiosLikeHeaders() {
  log('\n=== 测试 1: 模拟 axios 请求（带 Content-Type: multipart/form-data）===', 'blue');
  
  try {
    const testImageBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );
    
    const formData = new FormData();
    const blob = new Blob([testImageBuffer], { type: 'image/png' });
    formData.append('file', blob, 'test.png');
    
    log('发送请求...', 'yellow');
    
    const response = await fetch(`${API_BASE_URL}/book/upload`, {
      method: 'POST',
      headers: {
        // 模拟 axios 设置的 Content-Type
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });
    
    log(`响应状态: ${response.status}`, response.ok ? 'green' : 'red');
    
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }
    
    if (response.ok) {
      log('✓ 上传成功！', 'green');
      console.log(JSON.stringify(data, null, 2));
    } else {
      log('✗ 上传失败！', 'red');
      console.log(data);
    }
    
  } catch (error) {
    log('✗ 请求失败！', 'red');
    log(`错误: ${error.message}`, 'red');
    console.error(error);
  }
}

async function testUploadWithoutContentType() {
  log('\n=== 测试 2: 不设置 Content-Type（让浏览器自动设置）===', 'blue');
  
  try {
    const testImageBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );
    
    const formData = new FormData();
    const blob = new Blob([testImageBuffer], { type: 'image/png' });
    formData.append('file', blob, 'test.png');
    
    log('发送请求...', 'yellow');
    
    const response = await fetch(`${API_BASE_URL}/book/upload`, {
      method: 'POST',
      // 不设置 Content-Type，让浏览器自动设置
      body: formData,
    });
    
    log(`响应状态: ${response.status}`, response.ok ? 'green' : 'red');
    
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }
    
    if (response.ok) {
      log('✓ 上传成功！', 'green');
      console.log(JSON.stringify(data, null, 2));
    } else {
      log('✗ 上传失败！', 'red');
      console.log(data);
    }
    
  } catch (error) {
    log('✗ 请求失败！', 'red');
    log(`错误: ${error.message}`, 'red');
    console.error(error);
  }
}

async function testUploadWithToken() {
  log('\n=== 测试 3: 带认证 Token 的请求 ===', 'blue');
  
  try {
    const testImageBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );
    
    const formData = new FormData();
    const blob = new Blob([testImageBuffer], { type: 'image/png' });
    formData.append('file', blob, 'test.png');
    
    log('发送请求（带 Authorization header）...', 'yellow');
    
    const response = await fetch(`${API_BASE_URL}/book/upload`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer test_token',
      },
      body: formData,
    });
    
    log(`响应状态: ${response.status}`, response.ok ? 'green' : 'red');
    
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }
    
    if (response.ok) {
      log('✓ 上传成功！', 'green');
      console.log(JSON.stringify(data, null, 2));
    } else {
      log('✗ 上传失败！', 'red');
      console.log(data);
    }
    
  } catch (error) {
    log('✗ 请求失败！', 'red');
    log(`错误: ${error.message}`, 'red');
    console.error(error);
  }
}

async function runTests() {
  await testUploadWithAxiosLikeHeaders();
  await testUploadWithoutContentType();
  await testUploadWithToken();
  
  log('\n=== 测试完成 ===', 'blue');
}

runTests();
