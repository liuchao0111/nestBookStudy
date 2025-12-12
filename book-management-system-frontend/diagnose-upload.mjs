#!/usr/bin/env node

/**
 * 诊断上传接口问题
 */

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

async function diagnoseUpload() {
  log('\n========================================', 'blue');
  log('上传接口诊断工具', 'blue');
  log('========================================\n', 'blue');

  // 测试 1: 检查后端是否运行
  log('📡 检查后端服务...', 'cyan');
  try {
    const healthCheck = await fetch(`${API_BASE_URL}`);
    if (healthCheck.ok) {
      log('✓ 后端服务正常运行', 'green');
    } else {
      log(`✗ 后端服务响应异常: ${healthCheck.status}`, 'red');
    }
  } catch (error) {
    log('✗ 无法连接到后端服务', 'red');
    log(`  错误: ${error.message}`, 'red');
    log('\n请确保后端服务正在运行：', 'yellow');
    log('  cd book-management-system-backend', 'yellow');
    log('  npm run start:dev', 'yellow');
    return;
  }

  // 测试 2: 正确的上传方式（不设置 Content-Type）
  log('\n📤 测试正确的上传方式...', 'cyan');
  try {
    const testImageBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );
    
    const formData = new FormData();
    const blob = new Blob([testImageBuffer], { type: 'image/png' });
    formData.append('file', blob, 'test.png');
    
    const response = await fetch(`${API_BASE_URL}/book/upload`, {
      method: 'POST',
      body: formData,
    });
    
    const data = await response.json().catch(() => response.text());
    
    if (response.ok) {
      log('✓ 上传成功！', 'green');
      log('  响应数据:', 'green');
      console.log('  ', JSON.stringify(data, null, 2).replace(/\n/g, '\n  '));
    } else {
      log(`✗ 上传失败: ${response.status}`, 'red');
      log('  错误信息:', 'red');
      console.log('  ', JSON.stringify(data, null, 2).replace(/\n/g, '\n  '));
    }
  } catch (error) {
    log('✗ 请求失败', 'red');
    log(`  错误: ${error.message}`, 'red');
  }

  // 测试 3: 错误的上传方式（手动设置 Content-Type）
  log('\n❌ 测试错误的上传方式（用于对比）...', 'cyan');
  try {
    const testImageBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );
    
    const formData = new FormData();
    const blob = new Blob([testImageBuffer], { type: 'image/png' });
    formData.append('file', blob, 'test.png');
    
    const response = await fetch(`${API_BASE_URL}/book/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data', // 错误：缺少 boundary
      },
      body: formData,
    });
    
    const data = await response.json().catch(() => response.text());
    
    if (response.ok) {
      log('? 意外成功（这不应该发生）', 'yellow');
    } else {
      log(`✓ 预期失败: ${response.status}`, 'green');
      log('  错误信息（这是预期的）:', 'yellow');
      console.log('  ', JSON.stringify(data, null, 2).replace(/\n/g, '\n  '));
    }
  } catch (error) {
    log('✗ 请求失败', 'red');
    log(`  错误: ${error.message}`, 'red');
  }

  // 总结
  log('\n========================================', 'blue');
  log('诊断总结', 'blue');
  log('========================================\n', 'blue');
  
  log('如果测试 2 成功，说明：', 'cyan');
  log('  ✓ 后端接口正常', 'green');
  log('  ✓ 代码修复正确', 'green');
  log('  → 请清除浏览器缓存或硬刷新页面', 'yellow');
  
  log('\n如果测试 2 失败，请检查：', 'cyan');
  log('  1. 后端服务是否正常运行', 'yellow');
  log('  2. uploads 目录是否有写入权限', 'yellow');
  log('  3. 后端日志中的错误信息', 'yellow');
  
  log('\n如何清除浏览器缓存：', 'cyan');
  log('  • Chrome/Edge: Ctrl+Shift+R (Windows) 或 Cmd+Shift+R (Mac)', 'yellow');
  log('  • Firefox: Ctrl+Shift+R (Windows) 或 Cmd+Shift+R (Mac)', 'yellow');
  log('  • Safari: Cmd+Option+R', 'yellow');
  log('  • 或在开发者工具中勾选 "Disable cache"\n', 'yellow');
}

diagnoseUpload();
