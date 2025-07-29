#!/usr/bin/env python3
"""
Automated Google Analytics 4 Setup Script

Prerequisites:
1. Install required packages:
   pip install google-analytics-admin google-auth google-auth-oauthlib google-auth-httplib2

2. Enable Google Analytics Admin API:
   https://console.cloud.google.com/apis/library/analyticsadmin.googleapis.com

3. Create OAuth2 credentials or service account:
   https://console.cloud.google.com/apis/credentials

4. Set up authentication (one of these):
   - Set GOOGLE_APPLICATION_CREDENTIALS env var to service account JSON
   - Run with --auth flag to use OAuth2 flow

Usage:
   python setup-ga4-automated.py --property-id=YOUR_PROPERTY_ID [--auth]
"""

import argparse
import json
import sys
from typing import List, Dict

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
        print("\nOr install directly:")
        print("   pip install google-analytics-admin google-auth google-auth-oauthlib")
        return False

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
        
        # List existing dimensions
        existing = self.client.list_custom_dimensions(parent=self.property_path)
        existing_params = {dim.parameter_name for dim in existing}
        
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
    
    def mark_conversions(self):
        """Mark events as conversions"""
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
    
    def create_audiences(self):
        """Create audiences"""
        print("\n👥 Creating Audiences...")
        
        audiences = [
            {
                'display_name': 'High-value Leads',
                'description': 'Users with high budget ready to proceed',
                'filter_clauses': [{
                    'clause_type': AudienceFilterClause.AudienceClauseType.INCLUDE,
                    'simple_filter': AudienceSimpleFilter(
                        scope=AudienceFilterScope.AUDIENCE_FILTER_SCOPE_ACROSS_ALL_SESSIONS,
                        filter_expression=AudienceFilterExpression(
                            dimension_or_metric_filter=AudienceDimensionOrMetricFilter(
                                field_name='customEvent:budget',
                                string_filter=StringFilter(
                                    match_type=StringFilter.MatchType.EXACT,
                                    value='ready-high'
                                )
                            )
                        )
                    )
                }]
            },
            {
                'display_name': 'SavvyCal Clickers',
                'description': 'Users who clicked to book a call',
                'filter_clauses': [{
                    'clause_type': AudienceFilterClause.AudienceClauseType.INCLUDE,
                    'simple_filter': AudienceSimpleFilter(
                        scope=AudienceFilterScope.AUDIENCE_FILTER_SCOPE_ACROSS_ALL_SESSIONS,
                        filter_expression=AudienceFilterExpression(
                            dimension_or_metric_filter=AudienceDimensionOrMetricFilter(
                                field_name='eventName',
                                string_filter=StringFilter(
                                    match_type=StringFilter.MatchType.EXACT,
                                    value='conversion_savvycal_booking_click'
                                )
                            )
                        )
                    )
                }]
            }
        ]
        
        created = 0
        for audience_config in audiences:
            try:
                audience = Audience(
                    display_name=audience_config['display_name'],
                    description=audience_config['description'],
                    membership_duration_days=540,
                    filter_clauses=audience_config['filter_clauses']
                )
                
                self.client.create_audience(
                    parent=self.property_path,
                    audience=audience
                )
                
                print(f"  ✅ Created: {audience_config['display_name']}")
                created += 1
                
            except Exception as e:
                print(f"  ❌ Failed to create {audience_config['display_name']}: {e}")
        
        print(f"\n  Created {created} new audiences")
    
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
            self.create_audiences()
            
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
    """Authenticate using OAuth2 flow"""
    creds = None
    token_file = 'token.json'
    
    # Load existing token
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
    
    return creds


def main():
    parser = argparse.ArgumentParser(description='Automate GA4 setup for VibeCTO.ai')
    parser.add_argument('--property-id', required=True, help='GA4 Property ID (numbers only)')
    parser.add_argument('--auth', action='store_true', help='Use OAuth2 authentication')
    parser.add_argument('--service-account', help='Path to service account JSON file')
    
    args = parser.parse_args()
    
    # Check imports first
    if not check_imports():
        sys.exit(1)
    
    # Import after checking
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
    
    # Make classes available globally
    globals()['AnalyticsAdminServiceClient'] = AnalyticsAdminServiceClient
    globals()['CustomDimension'] = CustomDimension
    globals()['ConversionEvent'] = ConversionEvent
    globals()['Audience'] = Audience
    globals()['AudienceFilterClause'] = AudienceFilterClause
    globals()['AudienceSimpleFilter'] = AudienceSimpleFilter
    globals()['AudienceFilterExpression'] = AudienceFilterExpression
    globals()['AudienceDimensionOrMetricFilter'] = AudienceDimensionOrMetricFilter
    globals()['StringFilter'] = StringFilter
    globals()['service_account'] = service_account
    globals()['Request'] = Request
    globals()['Credentials'] = Credentials
    globals()['InstalledAppFlow'] = InstalledAppFlow
    
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
    
    # Run setup
    automation = GA4SetupAutomation(args.property_id, credentials)
    success = automation.run_setup()
    
    sys.exit(0 if success else 1)


if __name__ == '__main__':
    main()