# GA4 Automated Setup Guide

## Prerequisites

1. **Get your GA4 Property ID**:
   - Go to [Google Analytics](https://analytics.google.com)
   - Click Admin (gear icon)
   - Under "Property", you'll see your property name
   - Click "Property Settings" 
   - Copy the "Property ID" (just the numbers, e.g., "123456789")

2. **Enable Google Analytics Admin API**:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Select or create a project
   - Go to "APIs & Services" → "Enable APIs and Services"
   - Search for "Google Analytics Admin API"
   - Click Enable

3. **Create OAuth2 Credentials**:
   - In Google Cloud Console, go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Application type: "Desktop app"
   - Name: "GA4 Setup Script"
   - Download the JSON file
   - Save it as `scripts/credentials.json`

## Running the Setup

1. **Activate the virtual environment**:
   ```bash
   source scripts/ga4-venv/bin/activate
   ```

2. **Run the setup script**:
   ```bash
   python scripts/setup-ga4-automated.py --property-id=YOUR_PROPERTY_ID --auth
   ```

3. **Authenticate**:
   - A browser window will open
   - Log in with the Google account that has access to your GA4 property
   - Grant the requested permissions
   - The script will save the authentication token for future use

## What the Script Will Do

✅ Create 10 custom dimensions
✅ Mark 2 events as conversions
✅ Create 2 audiences (High-value Leads, SavvyCal Clickers)
✅ Set up the basic configuration

## Manual Steps Still Required

After running the script, you'll need to manually:

1. **Enable Enhanced Measurement**:
   - Admin → Data Streams → Web stream → Enhanced measurement
   - Turn ON all options

2. **Create Custom Reports**:
   - Reports → Library → Create new report
   - Set up funnels for your conversion paths

3. **Configure Data Retention**:
   - Admin → Data Settings → Data Retention
   - Set to 14 months

## Troubleshooting

- **"API not enabled"**: Make sure you enabled the Google Analytics Admin API
- **"Permission denied"**: Ensure your Google account has Edit access to the GA4 property
- **"Invalid property ID"**: Use only the numbers, not the full "GA-" measurement ID