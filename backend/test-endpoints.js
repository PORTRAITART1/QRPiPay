#!/usr/bin/env node

/**
 * QRPiPay Production Endpoint Validator
 * Tests all major endpoints and validates responses
 */

const http = require('http');

const API_URL = process.env.API_URL || 'http://localhost:3001';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

let testsPassed = 0;
let testsFailed = 0;

function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(API_URL + path);
    const options = {
      hostname: url.hostname,
      port: url.port || 3001,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: data ? JSON.parse(data) : null
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: data
          });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function test(name, fn) {
  try {
    console.log(`\n🧪 Testing: ${name}`);
    await fn();
    console.log(`✅ PASS: ${name}`);
    testsPassed++;
  } catch (error) {
    console.error(`❌ FAIL: ${name}`);
    console.error(`   Error: ${error.message}`);
    testsFailed++;
  }
}

async function runTests() {
  console.log('========================================');
  console.log('🚀 QRPiPay Production Endpoint Tests');
  console.log('========================================');
  console.log(`API URL: ${API_URL}`);
  console.log(`Frontend URL: ${FRONTEND_URL}`);
  console.log('========================================\n');

  // Test 1: Health endpoint
  await test('GET /health', async () => {
    const res = await makeRequest('GET', '/health');
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    if (!res.body.status) throw new Error('Missing status field');
    console.log(`   Status: ${res.body.status}`);
    console.log(`   Uptime: ${res.body.uptime}s`);
  });

  // Test 2: API Status endpoint
  await test('GET /api/status', async () => {
    const res = await makeRequest('GET', '/api/status');
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    if (res.body.app !== 'QRPiPay Backend') throw new Error('Wrong app name');
    console.log(`   Version: ${res.body.version}`);
    console.log(`   Environment: ${res.body.environment}`);
    console.log(`   WebSocket: ${res.body.websocket}`);
  });

  // Test 3: Auth endpoint (expect 400 without token)
  await test('POST /api/auth/callback (no token)', async () => {
    const res = await makeRequest('POST', '/api/auth/callback', {});
    if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
    console.log(`   Response: ${res.body.error}`);
  });

  // Test 4: Get current user (no auth token)
  await test('GET /api/auth/me (no token)', async () => {
    const res = await makeRequest('GET', '/api/auth/me');
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
    console.log(`   Response: ${res.body.error}`);
  });

  // Test 5: Payments endpoint (expect 401 without auth)
  await test('POST /api/payments/create (no auth)', async () => {
    const res = await makeRequest('POST', '/api/payments/create', {
      amount: 10,
      description: 'test'
    });
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
    console.log(`   Response: ${res.body.error || res.body.message}`);
  });

  // Test 6: Test rate limiting headers
  await test('Rate Limiting Headers', async () => {
    const res = await makeRequest('GET', '/health');
    console.log(`   Rate-Limit info available: ${!!res.headers['x-ratelimit-limit']}`);
  });

  // Test 7: CORS Headers
  await test('CORS Headers', async () => {
    const res = await makeRequest('GET', '/health');
    const hasCors = res.headers['access-control-allow-origin'] || 
                    res.headers['access-control-allow-credentials'];
    console.log(`   CORS enabled: ${!!hasCors}`);
  });

  // Test 8: Security Headers
  await test('Security Headers (Helmet)', async () => {
    const res = await makeRequest('GET', '/health');
    const securityHeaders = [
      'x-content-type-options',
      'x-frame-options',
      'x-xss-protection'
    ];
    const found = securityHeaders.filter(h => res.headers[h]);
    console.log(`   Security headers found: ${found.length}/${securityHeaders.length}`);
    if (found.length === 0) throw new Error('No security headers found');
  });

  // Test 9: Response time
  await test('Response Time', async () => {
    const start = Date.now();
    await makeRequest('GET', '/health');
    const time = Date.now() - start;
    console.log(`   Response time: ${time}ms`);
    if (time > 5000) throw new Error('Response too slow');
  });

  // Test 10: Concurrent requests (rate limit test)
  await test('Concurrent Requests (5x)', async () => {
    const promises = [];
    for (let i = 0; i < 5; i++) {
      promises.push(makeRequest('GET', '/health'));
    }
    const results = await Promise.all(promises);
    const success = results.filter(r => r.status === 200).length;
    console.log(`   Successful requests: ${success}/5`);
    if (success < 5) throw new Error('Some requests failed');
  });

  console.log('\n========================================');
  console.log('📊 Test Summary');
  console.log('========================================');
  console.log(`✅ Passed: ${testsPassed}`);
  console.log(`❌ Failed: ${testsFailed}`);
  console.log(`📈 Success Rate: ${((testsPassed / (testsPassed + testsFailed)) * 100).toFixed(1)}%`);
  console.log('========================================\n');

  process.exit(testsFailed > 0 ? 1 : 0);
}

runTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
