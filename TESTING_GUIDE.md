# 🧪 Testing Guide - Jest + Cypress

**Date:** $(date)
**Status:** ✅ Ready to Use
**Version:** 1.0

---

## 📋 Overview

Comprehensive testing strategy for QRPiPay:

- **Unit Tests (Jest)**: Individual functions and services
- **Component Tests (Jest + RTL)**: React components
- **Integration Tests**: Multiple components working together
- **E2E Tests (Cypress)**: Full user workflows

---

## 🚀 Setup

### Install Dependencies

```bash
# Backend tests
cd backend
npm install --save-dev jest @testing-library/react @testing-library/jest-dom

# Frontend tests
cd frontend
npm install --save-dev jest @testing-library/react @testing-library/user-event cypress

# Install Cypress
npm install --save-dev cypress
```

### Configure Jest (Backend)

**backend/jest.config.js:**
```javascript
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverageFrom: ['src/**/*.js'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80
    }
  }
};
```

### Configure Jest (Frontend)

**frontend/jest.config.js:**
```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  testMatch: ['**/__tests__/**/*.test.jsx'],
  collectCoverageFrom: ['src/**/*.jsx']
};
```

### Configure Cypress

**cypress.config.js:**
```javascript
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {},
  },
  video: true,
  screenshots: true,
  defaultCommandTimeout: 10000
});
```

---

## 📝 Running Tests

### Run All Tests
```bash
# Backend unit tests
cd backend && npm test

# Frontend component tests
cd frontend && npm test

# E2E tests
npm run cypress:open  # Interactive
npm run cypress:run   # Headless
```

### Run Specific Test
```bash
# Run specific file
npm test analytics.service.test.js

# Run tests matching pattern
npm test --testNamePattern="getDashboardStats"

# Run with coverage
npm test -- --coverage
```

### Watch Mode
```bash
npm test -- --watch
```

---

## 🧪 Test Structure

### Unit Tests
```javascript
describe('Module/Service', () => {
  beforeEach(() => {
    // Setup
  });

  afterEach(() => {
    // Cleanup
  });

  describe('Specific Function', () => {
    it('should do something', () => {
      // Arrange
      const input = 'test';

      // Act
      const result = myFunction(input);

      // Assert
      expect(result).toBe('expected');
    });
  });
});
```

### Component Tests
```javascript
describe('Component', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('should handle user interaction', async () => {
    render(<MyComponent />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Clicked')).toBeInTheDocument();
  });
});
```

### E2E Tests
```javascript
describe('User Flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should complete payment', () => {
    cy.login();
    cy.contains('Generate QR').click();
    cy.get('input').type('100');
    cy.contains('Pay').click();
    cy.contains('Success').should('be.visible');
  });
});
```

---

## ✅ Test Coverage Goals

```
Module            | Unit | Component | E2E | Coverage
---------------------------------------------------
Authentication   |  ✅  |    ✅     |  ✅  |  90%+
Payments         |  ✅  |    ✅     |  ✅  |  90%+
Analytics        |  ✅  |    ✅     |  ✅  |  85%+
WebSocket        |  ✅  |    ✅     |  ✅  |  85%+
QR Generation    |  ✅  |    ✅     |  ✅  |  90%+
History/Export   |  ✅  |    ✅     |  ✅  |  80%+
```

---

## 📊 Test Examples

### Backend: Analytics Service Test
**File:** `backend/__tests__/analytics.service.test.js`

Tests:
- ✅ getDashboardStats()
- ✅ getPaymentTrends()
- ✅ getDailySummary()
- ✅ Error handling

### Frontend: Analytics Component Test
**File:** `frontend/src/__tests__/AnalyticsDashboard.test.jsx`

Tests:
- ✅ Dashboard renders
- ✅ Metrics display
- ✅ Charts render
- ✅ Date range filter
- ✅ Export functionality

### E2E: Full Workflow Test
**File:** `cypress/e2e/qrpipay.cy.js`

Tests:
- ✅ Login flow
- ✅ QR generation
- ✅ Payment completion
- ✅ History viewing
- ✅ Analytics dashboard
- ✅ Real-time updates

---

## 🔍 Best Practices

### DO ✅
- Test behavior, not implementation
- Use meaningful test names
- Keep tests small and focused
- Mock external dependencies
- Use setup/teardown properly
- Test error cases
- Aim for 80%+ coverage
- Run tests before commit

### DON'T ❌
- Test implementation details
- Write vague test names
- Create huge test files
- Mock everything
- Skip error testing
- Test third-party libraries
- Aim for 100% coverage obsessively
- Ignore test failures

---

## 🐛 Debugging Tests

### Jest Debugging
```bash
# Debug mode
node --inspect-brk node_modules/.bin/jest --runInBand

# Verbose output
npm test -- --verbose

# Show which tests ran
npm test -- --verbose --detectOpenHandles
```

### Cypress Debugging
```bash
# Open Cypress UI
npm run cypress:open

# Run in debug mode
npx cypress open --config watchForFileChanges=false

# View test videos
# Videos saved in: cypress/videos/
```

### Common Issues

**Tests timeout**
```javascript
// Increase timeout
jest.setTimeout(10000);
// or
cy.visit('/page', { timeout: 15000 });
```

**Async issues**
```javascript
// Properly handle promises
await expect(asyncFunction()).resolves.toEqual(value);
// or use done callback
it('test', (done) => {
  asyncFunction().then(() => done());
});
```

**Mock not working**
```javascript
// Clear mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
});
```

---

## 📈 CI/CD Integration

### GitHub Actions Workflow
```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '20'
      
      - name: Backend Tests
        run: cd backend && npm test -- --coverage
      
      - name: Frontend Tests
        run: cd frontend && npm test -- --coverage
      
      - name: E2E Tests
        run: npm run cypress:run
      
      - name: Upload Coverage
        uses: codecov/codecov-action@v2
```

---

## 📊 Coverage Reports

```bash
# Generate coverage
npm test -- --coverage

# View HTML report
open coverage/lcov-report/index.html

# Set minimum thresholds
# In jest.config.js:
coverageThreshold: {
  global: {
    branches: 80,
    functions: 80,
    lines: 80
  }
}
```

---

## 🚀 Pre-Commit Hook

**Setup husky:**
```bash
npm install husky --save-dev
npx husky install
npx husky add .husky/pre-commit "npm test"
```

**Run tests before commit:**
```bash
git add .
git commit -m "Feature: X"
# Tests run automatically ✅
```

---

## 📚 Testing Checklist

- [ ] Unit tests written for services
- [ ] Component tests for React components
- [ ] E2E tests for critical flows
- [ ] Error cases tested
- [ ] Mocks properly configured
- [ ] Coverage > 80%
- [ ] Tests pass locally
- [ ] Tests pass in CI/CD
- [ ] Documentation updated
- [ ] Pre-commit hooks setup

---

## 🎯 Next Steps

1. Run: `npm test` to verify setup
2. Write tests for new features
3. Maintain 80%+ coverage
4. Run E2E before releases
5. Monitor coverage trends

---

**Status:** ✅ Complete and Ready

**Next:** Run tests and fix coverage gaps!
