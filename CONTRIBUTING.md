# 🤝 Contributing to QRPiPay

Thank you for your interest in contributing to QRPiPay! This document provides guidelines and instructions for contributing.

---

## 📋 Code of Conduct

- Be respectful and inclusive
- Welcome all skill levels
- Provide constructive feedback
- Report issues responsibly

---

## 🚀 Getting Started

### 1. Fork the Repository
```bash
# Fork on GitHub, then:
git clone https://github.com/YOUR_USERNAME/QRPiPay.git
cd QRPiPay
```

### 2. Create Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### 3. Setup Development Environment
```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install

# Or use Docker
docker-compose up
```

### 4. Make Changes
- Write clean, documented code
- Follow existing patterns
- Add tests for new features
- Update documentation

### 5. Run Tests
```bash
npm test                    # All tests
npm test -- --watch       # Watch mode
npm run cypress:run       # E2E tests
```

### 6. Commit & Push
```bash
git add .
git commit -m "Feature: description"
git push origin feature/your-feature-name
```

### 7. Create Pull Request
- Describe what changed
- Link related issues
- Request reviewers

---

## 📝 Commit Messages

### Format
```
<type>: <subject>

<body>

<footer>
```

### Types
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code restructuring
- `perf:` Performance improvement
- `test:` Test additions
- `chore:` Maintenance

### Examples
```
feat: Add real-time payment notifications

Add WebSocket integration for instant payment updates.
Implements socket.io connection pool management.

Fixes #123
```

---

## ✅ Code Style

### TypeScript
```typescript
// Use types
const getValue = (key: string): string => {
  return key;
};

// Prefer interfaces over types
interface User {
  id: string;
  name: string;
}

// Use const by default
const value = 10;

// Use arrow functions
const fn = () => {};
```

### React
```typescript
// Functional components
export const MyComponent: React.FC = () => {
  return <div>Content</div>;
};

// Use hooks
const { data } = useData();

// Props interface
interface Props {
  title: string;
  onClick: () => void;
}
```

### Comments
```javascript
// ✅ Good: Explain WHY
// We debounce here to prevent excessive API calls
const debouncedSearch = debounce(search, 500);

// ❌ Bad: State the obvious
// Set count to 0
setCount(0);
```

---

## 🧪 Testing Requirements

### Unit Tests (Jest)
```javascript
describe('MyFunction', () => {
  it('should return expected value', () => {
    const result = myFunction('input');
    expect(result).toBe('expected');
  });

  it('should handle errors', () => {
    expect(() => myFunction(null)).toThrow();
  });
});
```

### Component Tests
```typescript
import { render, screen } from '@testing-library/react';

describe('MyComponent', () => {
  it('should render', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### E2E Tests
```javascript
describe('User Flow', () => {
  it('should complete action', () => {
    cy.visit('/');
    cy.contains('Button').click();
    cy.contains('Success').should('be.visible');
  });
});
```

### Coverage Requirements
- Minimum 80% coverage
- All critical paths tested
- Error cases covered
- Run: `npm test -- --coverage`

---

## 📚 Documentation

### Update Relevant Files
- `README.md` - Major changes
- Feature-specific guides
- API documentation
- Comments in code

### Code Comments
```javascript
/**
 * Calculate payment fee
 * @param amount - Payment amount in Pi
 * @returns Fee amount
 */
function calculateFee(amount: number): number {
  return amount * 0.025;
}
```

---

## 🔒 Security Guidelines

### Do
- ✅ Use environment variables for secrets
- ✅ Validate all input
- ✅ Sanitize user data
- ✅ Use parameterized queries
- ✅ Report vulnerabilities responsibly
- ✅ Keep dependencies updated

### Don't
- ❌ Commit secrets/API keys
- ❌ Use `eval()` or `exec()`
- ❌ Store passwords in plain text
- ❌ Disable security headers
- ❌ Skip input validation
- ❌ Ignore security warnings

---

## 🐛 Bug Reports

### Include
- Description of the bug
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment (OS, browser, Node version)
- Screenshots if applicable

### Template
```markdown
## Description
Brief description of the issue.

## Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

## Expected Behavior
What should happen.

## Actual Behavior
What actually happened.

## Environment
- OS: macOS 13
- Browser: Chrome 120
- Node: 20.10.0
```

---

## 💡 Feature Requests

### Include
- Clear description
- Use case
- Proposed solution (optional)
- Related issues

### Template
```markdown
## Feature Request
Title: Brief title

## Description
Detailed description of the feature.

## Use Case
Why this feature is needed.

## Proposed Solution
How it could be implemented (optional).
```

---

## 🔄 PR Review Process

### What to Expect
- Automated tests must pass
- Code review by maintainers
- Feedback and suggestions
- Approval and merge

### Review Checklist
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] Code follows style guide
- [ ] No breaking changes
- [ ] Performance considered
- [ ] Security reviewed

---

## 📦 Dependencies

### Before Adding
- Justify why it's needed
- Check for alternatives
- Verify security
- Check bundle size

### Addition Process
```bash
# Add dependency
npm install package-name

# Commit changes
git add package.json package-lock.json
git commit -m "deps: add package-name"
```

---

## 🚀 Release Process

### Version Format
```
v{major}.{minor}.{patch}

v1.0.0 - Initial release
v1.1.0 - New feature
v1.1.1 - Bug fix
```

### Release Checklist
- [ ] Update version number
- [ ] Update CHANGELOG
- [ ] Run tests
- [ ] Build for production
- [ ] Create git tag
- [ ] Push to main branch
- [ ] Create GitHub release
- [ ] Deploy to production

---

## 📞 Questions?

- Open an issue
- Join discussions
- Ask in comments
- Email maintainers

---

## 🎯 Common Contributions

### For Beginners
- Fix typos in docs
- Add tests
- Improve error messages
- Report bugs

### Intermediate
- Fix bugs
- Add features
- Refactor code
- Optimize performance

### Advanced
- Architecture decisions
- Complex features
- Performance optimization
- Security improvements

---

## ⭐ Recognition

Contributors are recognized in:
- `CONTRIBUTORS.md` file
- GitHub insights
- Release notes
- Project website

---

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to QRPiPay! 🙏**
