#!/usr/bin/env node

/**
 * 测试文件上传接口
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

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

async function testUpload() {
  log('\n开始测试文件上传接口...', 'blue');
  
  try {
    // 创建一个简单的测试图片（1x1 PNG）
    const testImageBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );
    
    // 创建 FormData
    const formData = new FormData();
    const blob = new Blob([testImageBuffer], { type: 'image/png' });
    formData.append('file', blob, 'test.png');
    
    log('发送上传请求...', 'yellow');
    log(`URL: ${API_BASE_URL}/book/upload`, 'yellow');
    
    const response = await fetch(`${API_BASE_URL}/book/upload`, {
      method: 'POST',
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
      log('响应数据:', 'green');
      console.log(JSON.stringify(data, null, 2));
    } else {
      log('✗ 上传失败！', 'red');
      log('错误信息:', 'red');
      console.log(data);
    }
    
  } catch (error) {
    log('✗ 请求失败！', 'red');
    log(`错误: ${error.message}`, 'red');
    console.error(error);
  }
}

testUpload();
