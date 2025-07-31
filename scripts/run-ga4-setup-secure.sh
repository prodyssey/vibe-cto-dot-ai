#!/bin/bash

# Secure GA4 Setup Script Runner
# This script helps you run the GA4 automation with environment variables

echo "🚀 Secure GA4 Automated Setup Runner"
echo "===================================="
echo ""

# Check if we're in the scripts directory
if [[ ! -f "setup-ga4-secure.py" ]]; then
    echo "❌ Error: Please run this script from the scripts directory"
    echo "   cd scripts && ./run-ga4-setup-secure.sh"
    exit 1
fi

# Check if virtual environment exists
if [[ ! -d "ga4-venv" ]]; then
    echo "❌ Error: Virtual environment not found"
    echo "   Run: python3 -m venv ga4-venv"
    exit 1
fi

# Activate virtual environment
echo "📦 Activating virtual environment..."
source ga4-venv/bin/activate

# Check if dependencies are installed
if ! python -c "import google.analytics.admin" 2>/dev/null; then
    echo "📥 Installing dependencies..."
    pip install -r requirements-ga4.txt
fi

# Check for credentials in environment
if [[ -z "$GA4_CLIENT_ID" ]] || [[ -z "$GA4_CLIENT_SECRET" ]]; then
    echo ""
    echo "⚠️  GA4 credentials not found in environment!"
    echo ""
    echo "Please set the following environment variables:"
    echo ""
    echo "export GA4_CLIENT_ID='your-client-id'"
    echo "export GA4_CLIENT_SECRET='your-client-secret'"
    echo ""
    echo "To get these credentials:"
    echo "1. Go to https://console.cloud.google.com"
    echo "2. APIs & Services → Credentials"
    echo "3. Create or select an OAuth 2.0 Client ID"
    echo "4. Copy the Client ID and Client Secret"
    echo ""
    echo "Alternatively, you can:"
    echo "- Set GA4_CREDENTIALS_JSON to point to a credentials file"
    echo "- Use GOOGLE_APPLICATION_CREDENTIALS for service account auth"
    echo ""
    read -p "Press Enter to continue anyway or Ctrl+C to exit: "
fi

# Get property ID from environment or prompt
if [[ -z "$GA4_PROPERTY_ID" ]]; then
    echo ""
    echo "📊 To find your GA4 Property ID:"
    echo "1. Go to https://analytics.google.com"
    echo "2. Click Admin (⚙️ gear icon)"
    echo "3. Under 'Property', click 'Property Settings'"
    echo "4. Copy the Property ID (numbers only, e.g., 123456789)"
    echo ""
    read -p "Enter your GA4 Property ID: " PROPERTY_ID
    
    if [[ -z "$PROPERTY_ID" ]]; then
        echo "❌ Property ID is required"
        exit 1
    fi
else
    PROPERTY_ID="$GA4_PROPERTY_ID"
    echo "📊 Using GA4 Property ID from environment: $PROPERTY_ID"
fi

# Offer to create example env file
if [[ ! -f ".env.ga4.example" ]]; then
    echo ""
    read -p "Would you like to create an example .env file? (y/n): " CREATE_ENV
    if [[ "$CREATE_ENV" == "y" ]] || [[ "$CREATE_ENV" == "Y" ]]; then
        python setup-ga4-secure.py --create-env-example
        echo ""
    fi
fi

# Run the setup
echo ""
echo "🔧 Running secure GA4 setup for property: $PROPERTY_ID"
echo ""

python setup-ga4-secure.py --property-id="$PROPERTY_ID" --auth

echo ""
echo "✅ Setup complete! Check the output above for any manual steps needed."
echo ""
echo "🔒 Security reminder:"
echo "   - Never commit credentials to git"
echo "   - Use environment variables for production"
echo "   - OAuth token is stored in: ${GA4_TOKEN_PATH:-~/.ga4/token.json}"