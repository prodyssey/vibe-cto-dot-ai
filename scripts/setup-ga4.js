#!/usr/bin/env node

/**
 * Google Analytics 4 Setup Script
 * 
 * This script helps automate the GA4 configuration for VibeCTO.ai
 * 
 * Prerequisites:
 * 1. Google Analytics Admin API enabled in Google Cloud Console
 * 2. Service account with GA4 admin permissions OR OAuth2 credentials
 * 3. GA4 property already created (we have the measurement ID)
 * 
 * What this script does:
 * - Creates custom dimensions for our event parameters
 * - Marks key events as conversions
 * - Sets up custom events
 * - Creates audiences
 * 
 * Note: Some features (like custom reports) can't be fully automated
 * and will need manual setup in the GA4 interface.
 */

const MEASUREMENT_ID = 'G-SVTZMGDLMF';

// Custom dimensions we want to create
const CUSTOM_DIMENSIONS = [
  {
    parameterName: 'source',
    displayName: 'Event Source',
    description: 'Where the event originated from',
    scope: 'EVENT'
  },
  {
    parameterName: 'destination', 
    displayName: 'Destination',
    description: 'Where the user is being directed',
    scope: 'EVENT'
  },
  {
    parameterName: 'budget',
    displayName: 'Budget Level',
    description: 'User budget tier from qualification forms',
    scope: 'EVENT'
  },
  {
    parameterName: 'scene',
    displayName: 'Adventure Scene',
    description: 'Current scene in adventure game',
    scope: 'EVENT'
  },
  {
    parameterName: 'choice',
    displayName: 'Adventure Choice',
    description: 'Choice made in adventure game',
    scope: 'EVENT'
  },
  {
    parameterName: 'player_name',
    displayName: 'Player Name',
    description: 'Name used in adventure game',
    scope: 'USER'
  },
  {
    parameterName: 'next_scene',
    displayName: 'Next Scene',
    description: 'Next scene in adventure flow',
    scope: 'EVENT'
  },
  {
    parameterName: 'has_company',
    displayName: 'Has Company',
    description: 'Whether user provided company name',
    scope: 'EVENT'
  },
  {
    parameterName: 'contact_method',
    displayName: 'Contact Method',
    description: 'Preferred contact method',
    scope: 'EVENT'
  }
];

// Events to mark as conversions
const CONVERSION_EVENTS = [
  'conversion_savvycal_booking_click',
  'form_submit',
  'adventure_choice' // when they complete key scenes
];

// Configuration for Google Tag Manager (if you want to use it)
const GTM_CONFIG = {
  triggers: [
    {
      name: 'SavvyCal Click',
      type: 'CLICK',
      filter: [{
        type: 'CONTAINS',
        parameter: 'CLICK_URL',
        value: 'savvycal.com'
      }]
    },
    {
      name: 'Adventure Game Start',
      type: 'PAGE_VIEW',
      filter: [{
        type: 'CONTAINS',
        parameter: 'PAGE_PATH',
        value: '/adventure'
      }]
    }
  ]
};

// Generate gtag config snippet for your site
function generateGtagConfig() {
  return `
<!-- Google Analytics Enhanced Configuration -->
<script>
  // Enhanced Google Analytics Configuration
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  
  // Configure enhanced ecommerce and conversions
  gtag('config', '${MEASUREMENT_ID}', {
    'custom_map.dimension1': 'source',
    'custom_map.dimension2': 'destination', 
    'custom_map.dimension3': 'budget',
    'custom_map.dimension4': 'scene',
    'custom_map.dimension5': 'choice',
    'custom_map.dimension6': 'player_name',
    'custom_map.dimension7': 'next_scene',
    'custom_map.dimension8': 'has_company',
    'custom_map.dimension9': 'contact_method',
    'send_page_view': true,
    'enhanced_measurement': {
      'scroll': true,
      'outbound_click': true,
      'site_search': true,
      'page_changes': true,
      'form_interactions': true
    }
  });

  // Mark conversions
  ${CONVERSION_EVENTS.map(event => `
  gtag('event', 'conversion_config', {
    'send_to': '${MEASUREMENT_ID}/${event}'
  });`).join('')}
</script>
`;
}

// Manual setup instructions
function printManualInstructions() {
  console.log('\n📊 GOOGLE ANALYTICS 4 SETUP INSTRUCTIONS\n');
  console.log('========================================\n');
  
  console.log('1. CONFIGURE CONVERSIONS:');
  console.log('   Go to: Admin → Events → Mark as conversion');
  console.log('   Toggle ON for these events:');
  CONVERSION_EVENTS.forEach(event => {
    console.log(`   ✓ ${event}`);
  });
  
  console.log('\n2. CREATE CUSTOM DIMENSIONS:');
  console.log('   Go to: Admin → Custom definitions → Custom dimensions');
  console.log('   Create these dimensions:');
  CUSTOM_DIMENSIONS.forEach(dim => {
    console.log(`   ✓ ${dim.displayName} (${dim.parameterName}) - ${dim.scope} scope`);
  });
  
  console.log('\n3. CREATE AUDIENCES:');
  console.log('   Go to: Admin → Audiences → New audience');
  console.log('   Create these audiences:');
  console.log('   ✓ High-value Leads (budget = ready-high)');
  console.log('   ✓ SavvyCal Clickers (event = conversion_savvycal_booking_click)');
  console.log('   ✓ Adventure Game Completers');
  console.log('   ✓ Form Submitters');
  
  console.log('\n4. ENABLE ENHANCED MEASUREMENT:');
  console.log('   Go to: Admin → Data Streams → Web stream → Enhanced measurement');
  console.log('   Enable ALL options');
  
  console.log('\n5. CREATE CUSTOM REPORTS:');
  console.log('   Go to: Reports → Library → Create new report');
  console.log('   Suggested reports:');
  console.log('   ✓ Adventure Game Funnel');
  console.log('   ✓ SavvyCal Conversion Path');
  console.log('   ✓ Form Performance by Source');
  
  console.log('\n6. OPTIONAL: Import Configuration');
  console.log('   You can use Google Analytics Admin API to automate this.');
  console.log('   See: https://developers.google.com/analytics/devguides/config/admin/v1');
  
  console.log('\n7. UPDATE YOUR HTML:');
  console.log('   Add this enhanced configuration after your GA4 script:');
  console.log(generateGtagConfig());
}

// Generate a configuration file for GA4 Admin API
function generateAPIConfig() {
  const config = {
    customDimensions: CUSTOM_DIMENSIONS,
    conversionEvents: CONVERSION_EVENTS,
    audiences: [
      {
        displayName: 'High-value Leads',
        description: 'Users with high budget who are ready to proceed',
        membershipDurationDays: 540,
        filterClauses: [{
          clauseType: 'INCLUDE',
          simpleFilter: {
            scope: 'EVENT',
            filterExpression: {
              filter: {
                fieldName: 'budget',
                stringFilter: {
                  matchType: 'EXACT',
                  value: 'ready-high'
                }
              }
            }
          }
        }]
      },
      {
        displayName: 'SavvyCal Clickers',
        description: 'Users who clicked to book a call',
        membershipDurationDays: 540,
        filterClauses: [{
          clauseType: 'INCLUDE',
          simpleFilter: {
            scope: 'EVENT',
            filterExpression: {
              filter: {
                fieldName: 'eventName',
                stringFilter: {
                  matchType: 'EXACT',
                  value: 'conversion_savvycal_booking_click'
                }
              }
            }
          }
        }]
      }
    ]
  };
  
  return config;
}

// Main execution
function main() {
  console.log('🚀 VibeCTO.ai Google Analytics Setup\n');
  
  // Print manual instructions
  printManualInstructions();
  
  // Save API configuration
  const fs = require('fs');
  const configPath = './ga4-config.json';
  
  fs.writeFileSync(
    configPath, 
    JSON.stringify(generateAPIConfig(), null, 2)
  );
  
  console.log(`\n✅ Configuration saved to: ${configPath}`);
  console.log('   Use this with GA4 Admin API for automated setup\n');
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  CUSTOM_DIMENSIONS,
  CONVERSION_EVENTS,
  generateGtagConfig,
  generateAPIConfig
};