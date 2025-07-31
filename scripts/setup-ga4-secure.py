#!/usr/bin/env python3
"""
Secure Google Analytics 4 Setup Script with Environment Variable Support

This script uses environment variables for credentials instead of hardcoded files.

Prerequisites:
1. Install required packages:
   pip install google-analytics-admin google-auth google-auth-oauthlib google-auth-httplib2

2. Set up credentials using one of these methods:
   - Environment variables: GA4_CLIENT_ID and GA4_CLIENT_SECRET
   - Credentials file path: GA4_CREDENTIALS_JSON=/path/to/creds.json
   - Service account: GOOGLE_APPLICATION_CREDENTIALS=/path/to/service.json

Usage:
   python setup-ga4-secure.py --property-id=YOUR_PROPERTY_ID [--auth]
"""

import argparse
import json
import sys
import os
from typing import List, Dict
from pathlib import Path

# Import our secure config module
from ga4_config import get_oauth_credentials, get_token_path

def check_imports():
    """Check if required packages are installed"""
    try:
        from google.analytics.admin import AnalyticsAdminServiceClient
        from google.analytics.admin_v1beta import (
            CustomDimension,
            ConversionEvent,
            Audience,
            AudienceFilterClause,
            AudienceSimpleFilter,
            AudienceFilterExpression,
            AudienceDimensionOrMetricFilter,
            StringFilter,
        )
        from google.oauth2 import service_account
        from google.auth.transport.requests import Request
        from google.oauth2.credentials import Credentials
        from google_auth_oauthlib.flow import InstalledAppFlow
        return True
    except ImportError as e:
        print(f"❌ Import error: {e}")
        print("\n📦 To fix this, make sure you're in the virtual environment:")
        print("   cd scripts")
        print("   source ga4-venv/bin/activate")
        print("   pip install -r requirements-ga4.txt")
        return False

# Configuration
SCOPES = ['https://www.googleapis.com/auth/analytics.edit']

# Custom dimensions to create
CUSTOM_DIMENSIONS = [
    {
        'parameter_name': 'source',
        'display_name': 'Event Source',
        'description': 'Where the event originated from',
        'scope': 'EVENT'
    },
    {
        'parameter_name': 'destination',
        'display_name': 'Destination',
        'description': 'Where the user is being directed',
        'scope': 'EVENT'
    },
    {
        'parameter_name': 'budget',
        'display_name': 'Budget Level',
        'description': 'User budget tier from qualification forms',
        'scope': 'EVENT'
    },
    {
        'parameter_name': 'scene',
        'display_name': 'Adventure Scene',
        'description': 'Current scene in adventure game',
        'scope': 'EVENT'
    },
    {
        'parameter_name': 'choice',
        'display_name': 'Adventure Choice',
        'description': 'Choice made in adventure game',
        'scope': 'EVENT'
    },
    {
        'parameter_name': 'player_name',
        'display_name': 'Player Name',
        'description': 'Name used in adventure game',
        'scope': 'USER'
    }
]

# Events to mark as conversions
CONVERSION_EVENTS = [
    'conversion_savvycal_booking_click',
    'form_submit',
]


class GA4SetupAutomation:
    def __init__(self, property_id: str, credentials=None):
        from google.analytics.admin import AnalyticsAdminServiceClient
        
        self.property_id = property_id
        self.property_path = f"properties/{property_id}"
        
        if credentials:
            self.client = AnalyticsAdminServiceClient(credentials=credentials)
        else:
            self.client = AnalyticsAdminServiceClient()
    
    def create_custom_dimensions(self):
        """Create custom dimensions"""
        from google.analytics.admin_v1beta import CustomDimension
        
        print("\n📊 Creating Custom Dimensions...")
        
        # List existing dimensions
        existing = self.client.list_custom_dimensions(parent=self.property_path)
        existing_params = {dim.parameter_name for dim in existing}
        
        created = 0
        for dim_config in CUSTOM_DIMENSIONS:
            if dim_config['parameter_name'] in existing_params:
                print(f"  ⏭️  {dim_config['display_name']} already exists")
                continue
            
            try:
                # Map string scope to enum
                scope_map = {
                    'EVENT': CustomDimension.DimensionScope.EVENT,
                    'USER': CustomDimension.DimensionScope.USER
                }
                
                dimension = CustomDimension(
                    parameter_name=dim_config['parameter_name'],
                    display_name=dim_config['display_name'],
                    description=dim_config['description'],
                    scope=scope_map[dim_config['scope']]
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
    
    def mark_conversions(self):
        """Mark events as conversions"""
        from google.analytics.admin_v1beta import ConversionEvent
        
        print("\n🎯 Marking Conversion Events...")
        
        marked = 0
        for event_name in CONVERSION_EVENTS:
            try:
                conversion_event = ConversionEvent(
                    name=f"{self.property_path}/conversionEvents/{event_name}",
                    event_name=event_name
                )
                
                self.client.create_conversion_event(
                    parent=self.property_path,
                    conversion_event=conversion_event
                )
                
                print(f"  ✅ Marked as conversion: {event_name}")
                marked += 1
                
            except Exception as e:
                if "already exists" in str(e):
                    print(f"  ⏭️  {event_name} already marked as conversion")
                else:
                    print(f"  ❌ Failed to mark {event_name}: {e}")
        
        print(f"\n  Marked {marked} new conversion events")
    
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
            
            print("\n✨ Setup completed successfully!")
            print("\n📝 Manual steps still required:")
            print("1. Go to Admin → Data Streams → Enhanced measurement")
            print("2. Enable all enhanced measurement options")
            print("3. Create custom reports in Reports → Library")
            print("4. Set up custom funnels for your conversion paths")
            
        except Exception as e:
            print(f"\n❌ Setup failed: {e}")
            return False
        
        return True


def authenticate_oauth():
    """Authenticate using OAuth2 flow with secure credential management"""
    from google.auth.transport.requests import Request
    from google.oauth2.credentials import Credentials
    from google_auth_oauthlib.flow import InstalledAppFlow
    
    creds = None
    token_path = get_token_path()
    
    # Load existing token
    if token_path.exists():
        try:
            creds = Credentials.from_authorized_user_file(str(token_path), SCOPES)
        except:
            pass
    
    # If there are no (valid) credentials, let the user log in
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            # Get credentials configuration
            creds_config = get_oauth_credentials()
            
            # Create flow from config dict instead of file
            flow = InstalledAppFlow.from_client_config(
                creds_config, SCOPES)
            creds = flow.run_local_server(port=0)
        
        # Save the credentials for the next run
        token_path.parent.mkdir(parents=True, exist_ok=True)
        with open(token_path, 'w') as token:
            token.write(creds.to_json())
        
        print(f"✅ Token saved to: {token_path}")
    
    return creds


def main():
    parser = argparse.ArgumentParser(description='Secure GA4 setup for VibeCTO.ai')
    parser.add_argument('--property-id', help='GA4 Property ID (can also use GA4_PROPERTY_ID env var)')
    parser.add_argument('--auth', action='store_true', help='Use OAuth2 authentication')
    parser.add_argument('--service-account', help='Path to service account JSON file')
    parser.add_argument('--create-env-example', action='store_true', help='Create .env.ga4.example file')
    
    args = parser.parse_args()
    
    # Handle env example creation
    if args.create_env-example:
        from ga4_config import save_credentials_to_env_example
        save_credentials_to_env_example()
        return
    
    # Get property ID from args or environment
    property_id = args.property_id or os.getenv('GA4_PROPERTY_ID')
    if not property_id:
        print("❌ Property ID required! Use --property-id or set GA4_PROPERTY_ID environment variable")
        sys.exit(1)
    
    # Check imports first
    if not check_imports():
        sys.exit(1)
    
    # Import after checking
    from google.oauth2 import service_account
    
    # Set up authentication
    credentials = None
    if args.auth:
        print("🔐 Authenticating with OAuth2...")
        credentials = authenticate_oauth()
    elif args.service_account:
        print(f"🔐 Using service account: {args.service_account}")
        credentials = service_account.Credentials.from_service_account_file(
            args.service_account,
            scopes=SCOPES
        )
    elif os.getenv('GOOGLE_APPLICATION_CREDENTIALS'):
        print("🔐 Using service account from GOOGLE_APPLICATION_CREDENTIALS")
        # Client will auto-detect from env var
    
    # Run setup
    automation = GA4SetupAutomation(property_id, credentials)
    success = automation.run_setup()
    
    sys.exit(0 if success else 1)


if __name__ == '__main__':
    main()