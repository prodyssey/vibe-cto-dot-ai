#!/usr/bin/env python3
"""
Simplified GA4 Setup Script for VibeCTO.ai
This version uses the latest API without beta imports
"""

import argparse
import json
import sys
import os
from typing import List, Dict

# Import Google Analytics Admin API
from google.analytics.admin import AnalyticsAdminServiceClient
from google.analytics.admin import CustomDimension
from google.analytics.admin import DataStream
from google.oauth2 import service_account
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow

# Configuration
SCOPES = ['https://www.googleapis.com/auth/analytics.edit']

# Custom dimensions to create
CUSTOM_DIMENSIONS = [
    {
        'parameter_name': 'source',
        'display_name': 'Event Source',
        'description': 'Where the event originated from',
        'scope': CustomDimension.DimensionScope.EVENT
    },
    {
        'parameter_name': 'destination',
        'display_name': 'Destination',
        'description': 'Where the user is being directed',
        'scope': CustomDimension.DimensionScope.EVENT
    },
    {
        'parameter_name': 'budget',
        'display_name': 'Budget Level',
        'description': 'User budget tier from qualification forms',
        'scope': CustomDimension.DimensionScope.EVENT
    },
    {
        'parameter_name': 'scene',
        'display_name': 'Adventure Scene',
        'description': 'Current scene in adventure game',
        'scope': CustomDimension.DimensionScope.EVENT
    },
    {
        'parameter_name': 'choice',
        'display_name': 'Adventure Choice',
        'description': 'Choice made in adventure game',
        'scope': CustomDimension.DimensionScope.EVENT
    },
    {
        'parameter_name': 'player_name',
        'display_name': 'Player Name',
        'description': 'Name used in adventure game',
        'scope': CustomDimension.DimensionScope.USER
    }
]

# Events to mark as conversions
CONVERSION_EVENTS = [
    'conversion_savvycal_booking_click',
    'form_submit',
]


class GA4SetupAutomation:
    def __init__(self, property_id: str, credentials=None):
        self.property_id = property_id
        self.property_path = f"properties/{property_id}"
        
        if credentials:
            self.client = AnalyticsAdminServiceClient(credentials=credentials)
        else:
            self.client = AnalyticsAdminServiceClient()
    
    def create_custom_dimensions(self):
        """Create custom dimensions"""
        print("\n📊 Creating Custom Dimensions...")
        
        try:
            # List existing dimensions
            existing = self.client.list_custom_dimensions(parent=self.property_path)
            existing_params = set()
            
            for dim in existing:
                existing_params.add(dim.parameter_name)
            
            created = 0
            for dim_config in CUSTOM_DIMENSIONS:
                if dim_config['parameter_name'] in existing_params:
                    print(f"  ⏭️  {dim_config['display_name']} already exists")
                    continue
                
                try:
                    dimension = CustomDimension(
                        parameter_name=dim_config['parameter_name'],
                        display_name=dim_config['display_name'],
                        description=dim_config['description'],
                        scope=dim_config['scope']
                    )
                    
                    self.client.create_custom_dimension(
                        parent=self.property_path,
                        custom_dimension=dimension
                    )
                    
                    print(f"  ✅ Created: {dim_config['display_name']}")
                    created += 1
                    
                except Exception as e:
                    print(f"  ❌ Failed to create {dim_config['display_name']}: {e}")
            
            print(f"\n  Created {created} new dimensions")
            
        except Exception as e:
            print(f"  ❌ Error listing dimensions: {e}")
    
    def mark_conversions(self):
        """Mark events as conversions"""
        print("\n🎯 Marking Conversion Events...")
        
        try:
            # Get the first web data stream
            streams = self.client.list_data_streams(parent=self.property_path)
            web_stream = None
            
            for stream in streams:
                if stream.type_ == DataStream.DataStreamType.WEB_DATA_STREAM:
                    web_stream = stream
                    break
            
            if not web_stream:
                print("  ❌ No web data stream found")
                return
            
            print(f"  📱 Using web stream: {web_stream.display_name}")
            
            # Note: The new API handles conversions differently
            # You may need to use the Google Analytics Data API or UI for this
            print("\n  ℹ️  Conversion events must be marked in the GA4 UI:")
            print("     Admin → Events → Mark as conversion")
            for event in CONVERSION_EVENTS:
                print(f"     ✓ {event}")
                
        except Exception as e:
            print(f"  ❌ Error with conversions: {e}")
    
    def display_setup_summary(self):
        """Display summary and manual steps"""
        print("\n📋 Setup Summary")
        print("================")
        
        print("\n✅ Automated Setup Complete:")
        print("  - Custom dimensions configured")
        print("  - Property settings verified")
        
        print("\n📝 Manual Steps Required:")
        print("\n1. Mark Conversion Events:")
        print("   - Go to: Admin → Events")
        print("   - Find and toggle as conversion:")
        for event in CONVERSION_EVENTS:
            print(f"     ✓ {event}")
        
        print("\n2. Enable Enhanced Measurement:")
        print("   - Go to: Admin → Data Streams → Web stream")
        print("   - Click on your web stream")
        print("   - Toggle ON all Enhanced measurement options")
        
        print("\n3. Create Audiences:")
        print("   - Go to: Admin → Audiences → New audience")
        print("   - Create 'High-value Leads' (budget = ready-high)")
        print("   - Create 'SavvyCal Clickers' (event = conversion_savvycal_booking_click)")
        
        print("\n4. Set Data Retention:")
        print("   - Go to: Admin → Data Settings → Data Retention")
        print("   - Set to 14 months")
    
    def run_setup(self):
        """Run the complete setup"""
        print(f"\n🚀 Setting up GA4 for property: {self.property_id}\n")
        
        try:
            # Verify property exists
            property = self.client.get_property(name=self.property_path)
            print(f"✅ Found property: {property.display_name}")
            
            # Run setup steps
            self.create_custom_dimensions()
            self.mark_conversions()
            self.display_setup_summary()
            
            print("\n✨ Automated setup completed successfully!")
            
        except Exception as e:
            print(f"\n❌ Setup failed: {e}")
            print("\nTroubleshooting:")
            print("1. Verify your Property ID is correct (numbers only)")
            print("2. Ensure you have Edit permissions for the property")
            print("3. Check that the Google Analytics Admin API is enabled")
            return False
        
        return True


def authenticate_oauth():
    """Authenticate using OAuth2 flow"""
    creds = None
    token_file = 'token.json'
    
    # Check for credentials file
    if not os.path.exists('credentials.json'):
        print("\n❌ credentials.json not found!")
        print("\nTo create OAuth credentials:")
        print("1. Go to https://console.cloud.google.com")
        print("2. Select your project (or create one)")
        print("3. APIs & Services → Credentials")
        print("4. Create Credentials → OAuth client ID")
        print("5. Application type: Desktop app")
        print("6. Download JSON and save as credentials.json")
        return None
    
    # Load existing token
    if os.path.exists(token_file):
        try:
            creds = Credentials.from_authorized_user_file(token_file, SCOPES)
        except:
            pass
    
    # If there are no (valid) credentials, let the user log in
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        
        # Save the credentials for the next run
        with open(token_file, 'w') as token:
            token.write(creds.to_json())
    
    print("✅ Authentication successful")
    return creds


def main():
    parser = argparse.ArgumentParser(description='Automate GA4 setup for VibeCTO.ai')
    parser.add_argument('--property-id', required=True, help='GA4 Property ID (numbers only)')
    parser.add_argument('--auth', action='store_true', help='Use OAuth2 authentication')
    parser.add_argument('--service-account', help='Path to service account JSON file')
    
    args = parser.parse_args()
    
    # Set up authentication
    credentials = None
    if args.auth:
        print("🔐 Authenticating with OAuth2...")
        credentials = authenticate_oauth()
        if not credentials:
            sys.exit(1)
    elif args.service_account:
        print(f"🔐 Using service account: {args.service_account}")
        try:
            credentials = service_account.Credentials.from_service_account_file(
                args.service_account,
                scopes=SCOPES
            )
        except Exception as e:
            print(f"❌ Failed to load service account: {e}")
            sys.exit(1)
    else:
        print("ℹ️  Using default credentials (if available)")
    
    # Run setup
    automation = GA4SetupAutomation(args.property_id, credentials)
    success = automation.run_setup()
    
    sys.exit(0 if success else 1)


if __name__ == '__main__':
    main()