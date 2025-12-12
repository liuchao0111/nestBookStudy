#!/usr/bin/env node

/**
 * 测试上传接口返回的路径
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

async function testUploadPath() {
  log('\n========================================', 'blue');
  log('测试上传路径返回', 'blue');
  log('========================================\n', 'blue');

  try {
    // 1. 上传文件
    log('📤 上传文件...', 'cyan');
    const testImageBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );
    
    const formData = new FormData();
    const blob = new Blob([testImageBuffer], { type: 'image/png' });
    formData.append('file', blob, 'test.png');
    
    const uploadResponse = await fetch(`${API_BASE_URL}/book/upload`, {
      method: 'POST',
      body: formData,
    });
    
    if (!uploadResponse.ok) {
      log('✗ 上传失败', 'red');
      return;
    }
    
    const uploadData = await uploadResponse.json();
    log('✓ 上传成功', 'green');
    log(`  返回的路径: ${uploadData.path}`, 'yellow');
    
    // 2. 检查路径格式
    log('\n🔍 检查路径格式...', 'cyan');
    if (uploadData.path.startsWith('/uploads/')) {
      log('✓ 路径格式正确（相对路径）', 'green');
    } else if (uploadData.path.includes('/Users/') || uploadData.path.includes('C:\\')) {
      log('✗ 路径格式错误（绝对路径）', 'red');
      log('  前端无法访问服务器的绝对路径', 'red');
    } else {
      log('⚠ 路径格式未知', 'yellow');
    }
    
    // 3. 测试访问上传的文件
    log('\n🌐 测试访问上传的文件...', 'cyan');
    const fileUrl = `${API_BASE_URL}${uploadData.path}`;
    log(`  完整 URL: ${fileUrl}`, 'yellow');
    
    const fileResponse = await fetch(fileUrl);
    
    if (fileResponse.ok) {
      log('✓ 文件可以正常访问', 'green');
      log(`  Content-Type: ${fileResponse.headers.get('content-type')}`, 'green');
    } else {
      log(`✗ 文件无法访问: ${fileResponse.status}`, 'red');
    }
    
    // 4. 总结
    log('\n========================================', 'blue');
    log('测试总结', 'blue');
    log('========================================\n', 'blue');
    
    if (uploadData.path.startsWith('/uploads/') && fileResponse.ok) {
      log('✓ 所有测试通过！', 'green');
      log('\n前端使用方式:', 'cyan');
      log(`  1. 上传后获得路径: ${uploadData.path}`, 'yellow');
      log(`  2. 拼接完整 URL: \${API_BASE_URL}${uploadData.path}`, 'yellow');
      log(`  3. 在 <img> 中使用: <img src="\${API_BASE_URL}${uploadData.path}" />`, 'yellow');
    } else {
      log('✗ 存在问题，请检查上述错误', 'red');
    }
    
  } catch (error) {
    log('\n✗ 测试失败', 'red');
    log(`错误: ${error.message}`, 'red');
    console.error(error);
  }
}

testUploadPath();
