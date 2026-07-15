# 🔐 GitHub Actions Secrets Setup

This file documents the secrets required for CI/CD automation.

---

## 📋 Required Secrets

### Render Deployment

1. **RENDER_API_KEY**
   - Get from: https://dashboard.render.com/account/api-tokens
   - Usage: Trigger deployments
   - Value: Your Render API token

2. **RENDER_BACKEND_SERVICE_ID**
   - Get from: Render Dashboard → Backend service → URL
   - Format: `srv-xxxxxxxxxxxxx`
   - Usage: Deploy backend service

3. **RENDER_FRONTEND_SERVICE_ID**
   - Get from: Render Dashboard → Frontend service → URL
   - Format: `srv-xxxxxxxxxxxxx`
   - Usage: Deploy frontend service

### Database

4. **DATABASE_URL_TEST**
   - Format: `postgresql://user:pass@host:port/dbname`
   - Usage: GitHub Actions tests
   - Note: GitHub provides postgres service automatically

### Docker Registry (Optional)

5. **REGISTRY_USERNAME**
   - Username for Docker registry
   - Usage: Push Docker images

6. **REGISTRY_PASSWORD**
   - Password/token for Docker registry
   - Usage: Authenticate with registry

---

## 🔧 Setup Instructions

### Step 1: Go to Repository Settings
```
GitHub → Your Repo → Settings → Secrets and variables → Actions
```

### Step 2: Add Each Secret
1. Click "New repository secret"
2. Enter Name (e.g., `RENDER_API_KEY`)
3. Enter Value (e.g., your API key)
4. Click "Add secret"

### Step 3: Verify Secrets
```
✅ RENDER_API_KEY
✅ RENDER_BACKEND_SERVICE_ID
✅ RENDER_FRONTEND_SERVICE_ID
✅ DATABASE_URL_TEST (optional - auto-provided)
```

---

## 🚀 Using Secrets in Workflows

### Access Secret in Workflow
```yaml
- name: Deploy
  env:
    API_KEY: ${{ secrets.RENDER_API_KEY }}
  run: echo $API_KEY
```

### Use in Commands
```bash
curl -X POST https://api.render.com/deploy \
  -H "Authorization: Bearer ${{ secrets.RENDER_API_KEY }}"
```

---

## 🔒 Security Best Practices

✅ **DO:**
- Rotate secrets regularly
- Use GitHub-provided postgres for tests
- Limit secret scope to necessary workflows
- Review secrets access logs
- Use environment-specific tokens

❌ **DON'T:**
- Commit secrets to code
- Share tokens with others
- Use production tokens in tests
- Log secrets in workflow output
- Reuse tokens across services

---

## 🧪 Test Secrets Without Real Access

### For Local Testing
```bash
# Create .env.test for GitHub Actions testing
export DATABASE_URL_TEST="postgresql://testuser:testpass@localhost:5432/qrpipay_test"
export RENDER_API_KEY="test-key-only"
```

---

## 📝 Workflow Execution

### On Each Push to Master
1. Backend tests run
2. Frontend tests run
3. Code quality checks
4. Docker images build
5. E2E tests run
6. Deploy to Render
7. Notification sent

### Expected Duration
- Total: ~15-20 minutes
- Tests: ~10 minutes
- Build: ~5 minutes
- Deploy: ~2 minutes

---

## 🐛 Troubleshooting

### "Secret not found"
```
✓ Check secret name matches workflow (case-sensitive)
✓ Secret added to correct repository
✓ Workflow can access it: ${{ secrets.NAME }}
```

### Deploy fails
```
✓ Verify RENDER_API_KEY is valid
✓ Check service IDs are correct
✓ Ensure Render services exist
```

### Tests timeout
```
✓ Increase timeout in workflow
✓ Check database service is running
✓ Verify network connectivity
```

---

## 📊 Workflow Status

Monitor at: `GitHub → Your Repo → Actions`

### Status Indicators
- 🟢 Success: All jobs passed
- 🔴 Failed: One or more jobs failed
- 🟡 In Progress: Workflow running
- ⚪ Skipped: Condition not met

---

## 🔄 Manual Workflow Trigger

### Trigger Deployment Manually
```bash
# Via GitHub CLI
gh workflow run ci-cd.yml

# Via GitHub UI
Actions tab → Select workflow → Run workflow
```

---

## 📈 Monitoring & Alerts

### Setup Email Alerts (Optional)
1. GitHub → Settings → Notifications
2. Enable workflow notifications
3. Receive emails on failure

### Setup Slack Integration (Optional)
1. Add Slack app to GitHub
2. Configure channel
3. Get notifications in Slack

---

## 📚 References

- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions)
- [Render API](https://render.com/docs/api)
- [Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)

---

**Last Updated:** $(date)

**Next:** Add secrets to GitHub and test workflow
