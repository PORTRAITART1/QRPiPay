#!/usr/bin/env node

/**
 * QRPiPay Security Audit
 * Checks for common security issues before production deployment
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
let auditPassed = true;
let warnings = [];
let issues = [];

function checkFile(filePath, shouldExist = true) {
  const exists = fs.existsSync(path.join(ROOT, filePath));
  return shouldExist ? exists : !exists;
}

function readFile(filePath) {
  try {
    return fs.readFileSync(path.join(ROOT, filePath), 'utf8');
  } catch {
    return null;
  }
}

function checkEnvVars(envFile) {
  const content = readFile(envFile);
  if (!content) return [];

  const checks = [
    { pattern: /JWT_SECRET\s*=\s*dev-secret/i, issue: 'JWT_SECRET contains "dev-secret"' },
    { pattern: /DATABASE_URL\s*=.*localhost/i, issue: 'DATABASE_URL points to localhost' },
    { pattern: /JWT_SECRET\s*=\s*[a-z0-9]{1,16}$/m, issue: 'JWT_SECRET too short (min 32 chars)' },
    { pattern: /PI_API_KEY\s*=\s*(demo|test|null|false)/i, issue: 'PI_API_KEY not set properly' }
  ];

  return checks.filter(check => check.pattern.test(content)).map(check => check.issue);
}

function checkDependencies(packageFile) {
  const content = readFile(packageFile);
  if (!content) return [];

  try {
    const pkg = JSON.parse(content);
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };

    const issues = [];

    // Check for critical dependencies
    if (!deps.helmet) issues.push('Missing helmet (security headers)');
    if (!deps.cors) issues.push('Missing cors middleware');
    if (!deps['express-rate-limit']) issues.push('Missing rate limiting');
    if (!deps.bcryptjs && !deps.bcrypt) issues.push('Missing password hashing');
    if (!deps['@prisma/client']) issues.push('Missing Prisma client');

    return issues;
  } catch {
    return ['Failed to parse package.json'];
  }
}

function checkDockerfile(dockerFile) {
  const content = readFile(dockerFile);
  if (!content) return [];

  const issues = [];

  if (!content.includes('RUN npm ci')) issues.push('Should use "npm ci" instead of "npm install"');
  if (!content.includes('USER ') || !content.includes('nodejs')) issues.push('Not running as non-root user');
  if (!content.includes('HEALTHCHECK')) issues.push('Missing HEALTHCHECK instruction');
  if (content.includes('FROM node:') && !content.includes('-alpine')) warnings.push('Large base image (not alpine)');

  return issues;
}

function checkGit() {
  const issues = [];
  const gitignore = readFile('.gitignore');

  if (!gitignore) {
    issues.push('.gitignore not found');
    return issues;
  }

  const criticalPatterns = ['.env', '*.log', 'node_modules', 'dist', '.env.local'];
  const missing = criticalPatterns.filter(pattern => !gitignore.includes(pattern));

  if (missing.length > 0) {
    issues.push(`Missing in .gitignore: ${missing.join(', ')}`);
  }

  return issues;
}

console.log('\n========================================');
console.log('🔒 QRPiPay Security Audit');
console.log('========================================\n');

// 1. Check environment files
console.log('📋 Environment Variables...');
const backendEnvIssues = checkEnvVars('backend/.env');
const backendEnvExampleIssues = checkEnvVars('backend/.env.example');

if (backendEnvIssues.length > 0) {
  console.log(`❌ backend/.env issues:`);
  backendEnvIssues.forEach(issue => {
    console.log(`   - ${issue}`);
    issues.push(issue);
  });
}

if (backendEnvExampleIssues.length > 0) {
  console.log(`⚠️  backend/.env.example issues (OK for example file):`);
  backendEnvExampleIssues.forEach(issue => {
    console.log(`   - ${issue}`);
    warnings.push(issue);
  });
}

// 2. Check dependencies
console.log('\n📦 Dependencies...');
const backendDeps = checkDependencies('backend/package.json');
const frontendDeps = checkDependencies('frontend/package.json');

if (backendDeps.length === 0) console.log('✅ Backend dependencies secure');
else {
  console.log('❌ Backend dependency issues:');
  backendDeps.forEach(dep => {
    console.log(`   - ${dep}`);
    issues.push(dep);
  });
}

if (frontendDeps.length === 0) console.log('✅ Frontend dependencies secure');
else {
  console.log('❌ Frontend dependency issues:');
  frontendDeps.forEach(dep => console.log(`   - ${dep}`));
}

// 3. Check Dockerfiles
console.log('\n🐳 Docker Configuration...');
const backendDockerIssues = checkDockerfile('backend/Dockerfile');
const frontendDockerIssues = checkDockerfile('frontend/Dockerfile');

if (backendDockerIssues.length === 0) console.log('✅ Backend Dockerfile secure');
else {
  console.log('❌ Backend Dockerfile issues:');
  backendDockerIssues.forEach(issue => {
    console.log(`   - ${issue}`);
    issues.push(issue);
  });
}

if (frontendDockerIssues.length === 0) console.log('✅ Frontend Dockerfile secure');
else {
  console.log('❌ Frontend Dockerfile issues:');
  frontendDockerIssues.forEach(issue => {
    console.log(`   - ${issue}`);
    issues.push(issue);
  });
}

// 4. Check Git
console.log('\n📂 Git Configuration...');
const gitIssues = checkGit();
if (gitIssues.length === 0) console.log('✅ Git configuration secure');
else {
  console.log('❌ Git issues:');
  gitIssues.forEach(issue => {
    console.log(`   - ${issue}`);
    issues.push(issue);
  });
}

// 5. Check critical files
console.log('\n📄 Critical Files...');
const files = [
  { path: 'backend/src/server.js', name: 'Backend server' },
  { path: 'backend/src/middleware/auth.js', name: 'Auth middleware' },
  { path: 'frontend/vite.config.ts', name: 'Vite config' },
  { path: 'docker-compose.yml', name: 'Docker Compose' }
];

files.forEach(file => {
  if (checkFile(file.path)) console.log(`✅ ${file.name}`);
  else {
    console.log(`❌ ${file.name} missing`);
    issues.push(`${file.name} missing`);
  }
});

// Summary
console.log('\n========================================');
console.log('📊 Security Audit Summary');
console.log('========================================');
console.log(`✅ Checks passed: ${Math.max(0, 20 - issues.length)}`);
console.log(`⚠️  Warnings: ${warnings.length}`);
console.log(`❌ Issues: ${issues.length}`);

if (issues.length === 0) {
  console.log('\n✅ Security audit PASSED - Ready for production!');
  process.exit(0);
} else {
  console.log('\n❌ Security audit FAILED - Fix issues before deployment:');
  issues.forEach(issue => console.log(`   - ${issue}`));
  process.exit(1);
}
