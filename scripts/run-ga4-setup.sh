#!/bin/bash

# GA4 Setup Script Runner
# This script helps you run the GA4 automation with the virtual environment

echo "🚀 GA4 Automated Setup Runner"
echo "============================"
echo ""

# Check if we're in the scripts directory
if [[ ! -f "setup-ga4-automated.py" ]]; then
    echo "❌ Error: Please run this script from the scripts directory"
    echo "   cd scripts && ./run-ga4-setup.sh"
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

# Check for credentials file
if [[ ! -f "credentials.json" ]]; then
    echo ""
    echo "⚠️  OAuth credentials file not found!"
    echo ""
    echo "To create credentials:"
    echo "1. Go to https://console.cloud.google.com"
    echo "2. APIs & Services → Credentials"
    echo "3. Create Credentials → OAuth client ID"
    echo "4. Download and save as scripts/credentials.json"
    echo ""
    echo "Press Enter when you've added credentials.json, or Ctrl+C to exit"
    read
fi

# Get property ID
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

# Run the setup
echo ""
echo "🔧 Running GA4 setup for property: $PROPERTY_ID"
echo ""

python setup-ga4-automated.py --property-id="$PROPERTY_ID" --auth

echo ""
echo "✅ Setup complete! Check the output above for any manual steps needed."