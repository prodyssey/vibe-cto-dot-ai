# Slack Integration Setup

This document provides instructions for setting up Slack notifications for form submissions.

## Overview

The site now sends notifications to a designated Slack channel for all form submissions:
- **Ignition Program waitlist/contact forms** 🚀
- **Launch Control waitlist/contact forms** 🎯  
- **Email subscription forms** ✉️

## Setup Instructions

### 1. Create a Slack App

1. Go to [api.slack.com/apps](https://api.slack.com/apps)
2. Click "Create New App" → "From scratch"
3. Give your app a name (e.g., "Vibe CTO Submissions")
4. Select your workspace

### 2. Configure Bot Token Scopes

1. In your app dashboard, go to **OAuth & Permissions**
2. Under "Scopes" → "Bot Token Scopes", add:
   - `chat:write` - Send messages to channels
   - `chat:write.public` - Send messages to channels the app isn't a member of

### 3. Install App to Workspace

1. In **OAuth & Permissions**, click "Install to Workspace"
2. Authorize the app
3. Copy the **Bot User OAuth Token** (starts with `xoxb-`)

### 4. Create/Configure Channel

1. Create a channel named `#vibe-cto-submissions` (or use existing channel)
2. Add the bot to the channel:
   - Type `/invite @YourAppName` in the channel
   - Or go to channel details → More → Add apps → Select your app

### 5. Get Channel ID

1. Right-click on the channel name
2. Select "View channel details"
3. Scroll down and copy the Channel ID (starts with `C`)

### 6. Set Environment Variables

Add these to your `.env.local` file:

```env
# Slack app configuration
SLACK_BOT_TOKEN=xoxb-your-bot-token-here
SLACK_CHANNEL_ID=C1234567890
```

## Testing

Once configured, test by:
1. Submitting any form on the site
2. Check the designated Slack channel for notifications

## Notification Format

Each notification includes:
- 📝 Form type and submission time
- 👤 Contact information (name, email, phone)
- 🎯 Form-specific details (contact method, program type, etc.)
- 🔗 Session ID for adventure game forms

## Troubleshooting

### No notifications appearing:
- Verify `SLACK_BOT_TOKEN` and `SLACK_CHANNEL_ID` are set correctly
- Check the bot has `chat:write` scope
- Ensure the bot is added to the target channel
- Check server logs for Slack API errors

### Permission errors:
- Verify bot token starts with `xoxb-`
- Ensure app is installed to the workspace
- Check bot has required scopes in OAuth & Permissions

### Wrong channel:
- Double-check the Channel ID matches your target channel
- Channel IDs are case-sensitive

## Security Notes

- Never commit `SLACK_BOT_TOKEN` to version control
- Keep the bot token secure - it provides access to send messages
- Regularly rotate tokens if needed
- The integration gracefully handles failures without breaking form submissions