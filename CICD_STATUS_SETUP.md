# CI/CD Status Badges and Test Alerts Setup

This document explains the implementation of status badges and automated test alerts for the repository.

## Status Badges

The following status badges have been added to the README.md:

- **Main Branch Tests**: Shows the status of tests running on the main branch after merges
- **PR Tests**: Shows the status of tests running on pull requests
- **License**: Displays the project license
- **Node.js Version**: Shows the required Node.js version

## GitHub Actions Workflows

### Existing Workflows

1. **PR Tests** (`pr-tests.yml`)
   - Triggers: Pull requests to main/develop branches
   - Actions: Runs tests, linting, builds, and coverage reports
   - Status: ✅ Already configured

2. **Claude Code** (`claude.yml`)
   - Triggers: Issue comments, PR reviews with @claude mentions
   - Actions: Runs Claude Code assistance
   - Status: ✅ Already configured

3. **Claude Code Review** (`claude-code-review.yml`)
   - Triggers: PR opens or /claude review commands
   - Actions: Automated code reviews
   - Status: ✅ Already configured

### New Workflow Required

**Main Branch Tests** (`main-branch-tests.yml`)
- **Triggers**: Pushes to main branch, manual dispatch
- **Actions**:
  - Install dependencies
  - Run linting (`npm run lint`)
  - Run all tests (`npm run test:run`)
  - Run tests with coverage (`npm run test:coverage`)
  - Build project (`npm run build`)
  - Upload coverage artifacts
  - Generate test summary

**Failure Notifications**:
- **Slack Integration**: Sends alerts to Slack webhook (if configured)
- **GitHub Issues**: Automatically creates issues for test failures with:
  - Commit information
  - Author details
  - Link to failed workflow
  - Labels: `bug`, `tests`, `urgent`

## Setup Instructions

### 1. Add Main Branch Test Workflow

**Important**: Due to GitHub App permissions, the workflow file cannot be automatically added to `.github/workflows/`. You need to manually add it:

1. Copy the content from `main-branch-tests.yml` (created in the repository root)
2. Create `.github/workflows/main-branch-tests.yml`
3. Paste the content and commit

### 2. Configure Slack Notifications (Optional)

To enable Slack notifications for test failures:

1. Create a Slack webhook URL in your Slack workspace:
   - Go to your Slack App settings
   - Create a new Incoming Webhook
   - Copy the webhook URL

2. Add the webhook URL as a repository secret:
   - Go to repository Settings → Secrets and variables → Actions
   - Add new secret: `SLACK_WEBHOOK_URL`
   - Paste your webhook URL as the value

### 3. Configure GitHub Issues for Test Failures

GitHub issue creation is automatically configured and will work without additional setup. Failed tests on main branch will automatically create issues with:

- Clear title indicating the failure
- Commit hash and author information
- Direct link to the failed workflow run
- Appropriate labels for prioritization

## Environment Variables

The workflows use these environment variables for testing:

```bash
VITE_SUPABASE_URL=https://test.supabase.co
VITE_SUPABASE_ANON_KEY=test-anon-key
```

These are mock values used during testing to avoid hitting production services.

## Test Commands

The workflow runs these npm commands:
- `npm run lint` - ESLint checks
- `npm run test:run` - Run all tests once
- `npm run test:coverage` - Generate coverage reports
- `npm run build` - Build the project

## Coverage Reports

- Coverage reports are generated for both PR tests and main branch tests
- Reports are uploaded as GitHub Actions artifacts
- Coverage summaries are displayed in workflow summaries

## Badge URLs

The status badges use these URLs:

```markdown
![Main Branch Tests](https://github.com/prodyssey/vibe-cto-dot-ai/workflows/Main%20Branch%20Tests/badge.svg)
![PR Tests](https://github.com/prodyssey/vibe-cto-dot-ai/workflows/PR%20Tests/badge.svg)
```

## Monitoring and Alerts

### Success Indicators
- ✅ Green badges in README
- ✅ Successful workflow runs
- ✅ Coverage reports generated

### Failure Indicators
- ❌ Red badges in README
- 🚨 Slack notifications (if configured)
- 📋 Automatic GitHub issues created
- 📊 Workflow summary shows failures

## Best Practices

1. **Always fix failing tests immediately** when they appear on main branch
2. **Monitor the badges** in the README for quick status checks  
3. **Review coverage reports** to maintain code quality
4. **Use the automatic issues** created for test failures to track resolution
5. **Configure Slack notifications** for immediate team awareness

## Troubleshooting

### Badge Not Updating
- Check workflow file exists in `.github/workflows/`
- Verify workflow name matches badge URL
- Ensure workflow has run at least once

### Tests Failing
- Check workflow logs in Actions tab
- Verify all dependencies are installed
- Check environment variables are set correctly
- Ensure test files are not corrupted

### Notifications Not Working
- Verify `SLACK_WEBHOOK_URL` secret is set correctly
- Check Slack webhook is still active
- Review workflow permissions for issue creation

## Implementation Status

- ✅ Status badges added to README
- ✅ Main branch test workflow created
- ✅ Failure notification system implemented
- ✅ Documentation completed
- ⚠️ **Manual step required**: Move `main-branch-tests.yml` to `.github/workflows/`
- ⚠️ **Optional**: Configure Slack webhook for notifications