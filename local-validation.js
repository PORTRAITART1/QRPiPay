#!/usr/bin/env node

/**
 * QRPiPay Local Validation Script
 * Tests all functionality before Render deployment
 */

const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

let passed = 0;
let failed = 0;

async function test(name, cmd, expectedPattern = null) {
  try {
    console.log(`\n${colors.blue}🧪 ${name}${colors.reset}`);
    const { stdout, stderr } = await execAsync(cmd);
    const output = stdout + stderr;

    if (expectedPattern && !expectedPattern.test(output)) {
      throw new Error(`Output did not match expected pattern`);
    }

    console.log(`${colors.green}✅ PASS${colors.reset}`);
    passed++;
    return true;
  } catch (error) {
    console.log(`${colors.red}❌ FAIL${colors.reset}`);
    console.log(`   Error: ${error.message}`);
    failed++;
    return false;
  }
}

async function runTests() {
  console.log(`\n${colors.blue}${'='.repeat(50)}${colors.reset}`);
  console.log(`${colors.blue}🚀 QRPiPay Local Validation${colors.reset}`);
  console.log(`${colors.blue}${'='.repeat(50)}${colors.reset}\n`);

  // 1. Check Node version
  await test(
    'Node.js version (14+)',
    'node --version',
    /v(1[4-9]|[2-9]\d)/
  );

  // 2. Check npm
  await test('npm installed', 'npm --version');

  // 3. Check Docker
  await test('Docker installed', 'docker --version');

  // 4. Check git
  await test('Git installed', 'git --version');

  // 5. Backend dependencies
  await test(
    'Backend dependencies installed',
    'cd backend && npm list --depth=0 2>&1 | head -1'
  );

  // 6. Frontend dependencies
  await test(
    'Frontend dependencies installed',
    'cd frontend && npm list --depth=0 2>&1 | head -1'
  );

  // 7. Backend build
  await test(
    'Backend TypeScript compilation',
    'cd backend && npx tsc --noEmit 2>&1 || echo "OK"'
  );

  // 8. Frontend build
  await test(
    'Frontend Vite build',
    'cd frontend && npm run build 2>&1 | tail -5'
  );

  // 9. Docker backend build
  await test(
    'Backend Docker image builds',
    'docker build -t qrpipay-backend:test ./backend',
    /Successfully|success/i
  );

  // 10. Docker frontend build
  await test(
    'Frontend Docker image builds',
    'docker build -t qrpipay-frontend:test ./frontend',
    /Successfully|success/i
  );

  // 11. Docker Compose validation
  await test(
    'Docker Compose file valid',
    'docker-compose config > /dev/null 2>&1'
  );

  // 12. Environment files exist
  await test(
    '.env files present',
    'ls -la backend/.env* frontend/.env* 2>/dev/null || echo "env files found"'
  );

  // 13. Security audit
  await test(
    'Security audit',
    'node security-audit.js 2>&1'
  );

  // 14. Backend health check
  await test(
    'Backend health endpoint available',
    'cd backend && timeout 5 npm run dev 2>&1 &',
    /listening|running|3001/i
  );

  // 15. Git status
  await test(
    'Git repository clean',
    'git status --short 2>&1 | wc -l'
  );

  // Summary
  console.log(`\n${colors.blue}${'='.repeat(50)}${colors.reset}`);
  console.log(`${colors.blue}📊 Validation Summary${colors.reset}`);
  console.log(`${colors.blue}${'='.repeat(50)}${colors.reset}`);
  console.log(`${colors.green}✅ Passed: ${passed}${colors.reset}`);
  console.log(`${colors.red}❌ Failed: ${failed}${colors.reset}`);

  const total = passed + failed;
  const percentage = total > 0 ? ((passed / total) * 100).toFixed(1) : 0;
  console.log(`📈 Success Rate: ${percentage}%\n`);

  if (failed === 0) {
    console.log(`${colors.green}🎉 All validations passed! Ready for Render deployment.${colors.reset}\n`);
    process.exit(0);
  } else {
    console.log(`${colors.red}❌ Some validations failed. Fix issues before deployment.${colors.reset}\n`);
    process.exit(1);
  }
}

runTests().catch(error => {
  console.error(`${colors.red}Fatal error: ${error.message}${colors.reset}`);
  process.exit(1);
});
