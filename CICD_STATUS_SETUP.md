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
- **Slack Integration**: Sends alerts via Slack Bot Token (if configured)
- **GitHub Issues**: Automatically creates issues for test failures with:
  - Commit information
  - Author details
  - Link to failed workflow
  - Labels: `bug`, `tests`, `urgent`

## Setup Instructions

### 1. Add Main Branch Test Workflow

✅ **Completed**: The workflow file has been moved to `.github/workflows/main-branch-tests.yml`

### 2. Configure Slack Bot Notifications (Optional)

To enable Slack notifications for test failures using a Slack Bot (recommended approach):

1. Create a Slack App and Bot in your Slack workspace:
   - Go to https://api.slack.com/apps
   - Click "Create New App" → "From scratch"
   - Name your app (e.g., "GitHub CI/CD Bot") and select your workspace
   - Go to "OAuth & Permissions" in the left sidebar
   - Add the following Bot Token Scopes:
     - `chat:write` - Send messages as the bot
     - `chat:write.public` - Send messages to channels the bot isn't in
   - Click "Install to Workspace" and authorize the app
   - Copy the "Bot User OAuth Token" (starts with `xoxb-`)

2. Add the bot token and channel configuration:
   - Go to repository Settings → Secrets and variables → Actions
   - Add new secret: `SLACK_BOT_TOKEN` with your bot token as the value
   - Add new variable: `SLACK_CHANNEL_ID` with your channel ID (or leave empty to use 'general')
   - To find channel ID: Right-click channel → "Copy link" → extract ID from URL

3. Invite the bot to your desired channel:
   - In Slack, go to the channel where you want notifications
   - Type `/invite @YourBotName` or add it via channel settings

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
- Verify `SLACK_BOT_TOKEN` secret is set correctly
- Check bot has proper permissions in Slack workspace
- Ensure bot is invited to the target channel
- Verify `SLACK_CHANNEL_ID` variable is set (or defaults to 'general')
- Review workflow permissions for issue creation

## Implementation Status

- ✅ Status badges added to README
- ✅ Main branch test workflow created and moved to `.github/workflows/`
- ✅ Failure notification system implemented with Slack Bot
- ✅ Documentation completed and updated for Slack Bot setup
- ⚠️ **Optional**: Configure Slack Bot token and channel for notifications