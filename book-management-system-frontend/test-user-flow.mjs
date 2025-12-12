#!/usr/bin/env node

/**
 * 完整用户流程测试脚本
 * 测试：注册 -> 登录 -> 图书管理（添加、查看、编辑、删除）-> 登出
 */

const API_BASE_URL = 'http://localhost:3000';

// 生成随机用户名以避免冲突
const randomUsername = `testuser_${Date.now()}`;
const testPassword = 'test123456';

let authToken = null;
let createdBookId = null;

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

function logStep(step, message) {
  log(`\n[步骤 ${step}] ${message}`, 'blue');
}

function logSuccess(message) {
  log(`✓ ${message}`, 'green');
}

function logError(message) {
  log(`✗ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠ ${message}`, 'yellow');
}

// HTTP 请求辅助函数
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (authToken && !options.skipAuth) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    return {
      ok: response.ok,
      status: response.status,
      data,
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      error: error.message,
    };
  }
}

// 测试步骤
async function testRegister() {
  logStep(1, '测试用户注册');
  
  const response = await request('/user/register', {
    method: 'POST',
    body: JSON.stringify({
      username: randomUsername,
      password: testPassword,
    }),
  });

  if (response.ok) {
    logSuccess(`用户注册成功: ${randomUsername}`);
    return true;
  } else {
    logError(`用户注册失败: ${JSON.stringify(response.data)}`);
    return false;
  }
}

async function testLogin() {
  logStep(2, '测试用户登录');
  
  const response = await request('/user/login', {
    method: 'POST',
    body: JSON.stringify({
      username: randomUsername,
      password: testPassword,
    }),
  });

  if (response.ok && response.data.token) {
    authToken = response.data.token;
    logSuccess(`用户登录成功，获得令牌: ${authToken.substring(0, 20)}...`);
    return true;
  } else {
    logError(`用户登录失败: ${JSON.stringify(response.data)}`);
    return false;
  }
}

async function testGetBookList() {
  logStep(3, '测试获取图书列表');
  
  const response = await request('/book/list', {
    method: 'GET',
  });

  if (response.ok) {
    const books = Array.isArray(response.data) ? response.data : [];
    logSuccess(`成功获取图书列表，共 ${books.length} 本图书`);
    return true;
  } else {
    logError(`获取图书列表失败: ${JSON.stringify(response.data)}`);
    return false;
  }
}

async function testCreateBook() {
  logStep(4, '测试添加新图书');
  
  const bookData = {
    name: '测试图书 - JavaScript 高级程序设计',
    author: '测试作者',
    description: '这是一本测试图书的描述信息',
    cover: 'https://via.placeholder.com/150',
  };

  const response = await request('/book/create', {
    method: 'POST',
    body: JSON.stringify(bookData),
  });

  if (response.ok && response.data.id) {
    createdBookId = response.data.id;
    logSuccess(`成功添加图书，ID: ${createdBookId}`);
    return true;
  } else {
    logError(`添加图书失败: ${JSON.stringify(response.data)}`);
    return false;
  }
}

async function testUpdateBook() {
  logStep(5, '测试编辑图书');
  
  if (!createdBookId) {
    logWarning('跳过编辑测试：没有可编辑的图书');
    return true;
  }

  const updatedData = {
    id: createdBookId,
    name: '测试图书 - JavaScript 高级程序设计（第四版）',
    author: '测试作者（更新）',
    description: '这是更新后的图书描述信息',
    cover: 'https://via.placeholder.com/200',
  };

  const response = await request('/book/update', {
    method: 'PUT',
    body: JSON.stringify(updatedData),
  });

  if (response.ok) {
    logSuccess(`成功更新图书 ID: ${createdBookId}`);
    return true;
  } else {
    logError(`更新图书失败: ${JSON.stringify(response.data)}`);
    return false;
  }
}

async function testDeleteBook() {
  logStep(6, '测试删除图书');
  
  if (!createdBookId) {
    logWarning('跳过删除测试：没有可删除的图书');
    return true;
  }

  const response = await request(`/book/delete/${createdBookId}`, {
    method: 'DELETE',
  });

  if (response.ok) {
    logSuccess(`成功删除图书 ID: ${createdBookId}`);
    return true;
  } else {
    logError(`删除图书失败: ${JSON.stringify(response.data)}`);
    return false;
  }
}

async function testLogout() {
  logStep(7, '测试用户登出');
  
  // 前端登出主要是清除本地令牌，这里模拟清除
  authToken = null;
  logSuccess('用户登出成功（令牌已清除）');
  return true;
}

async function testProtectedRouteWithoutAuth() {
  logStep(8, '测试未认证访问保护路由');
  
  const response = await request('/book/list', {
    method: 'GET',
    skipAuth: true,
  });

  if (!response.ok && response.status === 401) {
    logSuccess('保护路由正确拒绝未认证访问');
    return true;
  } else {
    logError('保护路由未正确拒绝未认证访问');
    return false;
  }
}

// 主测试流程
async function runTests() {
  log('\n========================================', 'blue');
  log('开始完整用户流程测试', 'blue');
  log('========================================', 'blue');

  const results = [];

  // 执行所有测试步骤
  results.push(await testRegister());
  results.push(await testLogin());
  results.push(await testGetBookList());
  results.push(await testCreateBook());
  results.push(await testUpdateBook());
  results.push(await testDeleteBook());
  results.push(await testLogout());
  results.push(await testProtectedRouteWithoutAuth());

  // 统计结果
  const passed = results.filter(r => r).length;
  const failed = results.filter(r => !r).length;

  log('\n========================================', 'blue');
  log('测试结果汇总', 'blue');
  log('========================================', 'blue');
  log(`总测试数: ${results.length}`);
  log(`通过: ${passed}`, passed === results.length ? 'green' : 'yellow');
  log(`失败: ${failed}`, failed > 0 ? 'red' : 'green');

  if (failed === 0) {
    log('\n🎉 所有测试通过！', 'green');
    process.exit(0);
  } else {
    log('\n❌ 部分测试失败，请检查上述错误信息', 'red');
    process.exit(1);
  }
}

// 运行测试
runTests().catch(error => {
  logError(`测试执行出错: ${error.message}`);
  console.error(error);
  process.exit(1);
});
