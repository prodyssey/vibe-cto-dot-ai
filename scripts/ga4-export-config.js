#!/usr/bin/env node

/**
 * GA4 Configuration Export Script
 * 
 * This generates configuration files that can be imported into GA4
 * or used with Google Tag Manager
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Your GA4 Configuration
const GA4_CONFIG = {
  measurementId: 'G-SVTZMGDLMF',
  
  // Enhanced measurement settings
  enhancedMeasurement: {
    pageViews: true,
    scrolls: true,
    outboundClicks: true,
    siteSearch: true,
    videoEngagement: true,
    fileDownloads: true,
    formInteractions: true
  },
  
  // Custom events to track
  customEvents: [
    {
      name: 'conversion_savvycal_booking_click',
      description: 'User clicked a SavvyCal booking link',
      parameters: ['source', 'destination', 'budget', 'email'],
      markAsConversion: true
    },
    {
      name: 'form_submit',
      description: 'User submitted a form',
      parameters: ['form_name', 'form_data'],
      markAsConversion: true
    },
    {
      name: 'adventure_choice',
      description: 'User made a choice in adventure game',
      parameters: ['scene', 'choice', 'next_scene'],
      markAsConversion: false
    },
    {
      name: 'adventure_navigation',
      description: 'User navigated in adventure game',
      parameters: ['navigation_type'],
      markAsConversion: false
    }
  ],
  
  // Custom parameters/dimensions
  customDimensions: [
    { name: 'source', scope: 'event', description: 'Event source location' },
    { name: 'destination', scope: 'event', description: 'Destination URL or type' },
    { name: 'budget', scope: 'event', description: 'Budget level selection' },
    { name: 'scene', scope: 'event', description: 'Adventure game scene' },
    { name: 'choice', scope: 'event', description: 'Adventure game choice' },
    { name: 'next_scene', scope: 'event', description: 'Next adventure scene' },
    { name: 'player_name', scope: 'user', description: 'Adventure player name' },
    { name: 'form_name', scope: 'event', description: 'Name of submitted form' },
    { name: 'contact_method', scope: 'event', description: 'Preferred contact method' },
    { name: 'has_company', scope: 'event', description: 'User has company' }
  ],
  
  // Audiences to create
  audiences: [
    {
      name: 'High Budget Leads',
      description: 'Users who selected high budget options',
      conditions: [
        { dimension: 'budget', operator: 'equals', value: 'ready-high' }
      ]
    },
    {
      name: 'SavvyCal Converters',
      description: 'Users who clicked to book a call',
      conditions: [
        { event: 'conversion_savvycal_booking_click', operator: 'exists' }
      ]
    },
    {
      name: 'Adventure Completers',
      description: 'Users who completed adventure games',
      conditions: [
        { event: 'adventure_choice', parameter: 'scene', operator: 'contains', value: 'Final' }
      ]
    },
    {
      name: 'Engaged Users',
      description: 'Users who spent significant time exploring',
      conditions: [
        { metric: 'session_duration', operator: 'greater_than', value: 300 }
      ]
    }
  ],
  
  // Conversion funnels
  funnels: [
    {
      name: 'Adventure to Booking',
      steps: [
        { name: 'Start Adventure', event: 'page_view', condition: { page_path: '/' } },
        { name: 'Enter Adventure', event: 'adventure_choice', condition: { scene: 'entry' } },
        { name: 'Qualify', event: 'adventure_choice', condition: { scene: 'qualification' } },
        { name: 'Book Call', event: 'conversion_savvycal_booking_click' }
      ]
    },
    {
      name: 'Direct Booking',
      steps: [
        { name: 'Visit Site', event: 'page_view' },
        { name: 'Click CTA', event: 'conversion_savvycal_booking_click' }
      ]
    }
  ]
};

// Generate Google Tag Manager container export
function generateGTMContainer() {
  return {
    exportFormatVersion: 2,
    exportTime: new Date().toISOString(),
    containerVersion: {
      container: {
        publicId: 'GTM-XXXXX',
        name: 'VibeCTO.ai Container'
      },
      tag: [
        {
          name: 'GA4 Configuration',
          type: 'gaawc',
          parameter: [
            { key: 'measurementId', value: GA4_CONFIG.measurementId },
            { key: 'sendPageView', value: 'true' },
            { key: 'enhancedMeasurement', value: JSON.stringify(GA4_CONFIG.enhancedMeasurement) }
          ]
        },
        {
          name: 'SavvyCal Click Tracking',
          type: 'html',
          parameter: [{
            key: 'html',
            value: `
<script>
  // Track all SavvyCal link clicks
  document.addEventListener('click', function(e) {
    const link = e.target.closest('a[href*="savvycal.com"]');
    if (link) {
      gtag('event', 'conversion_savvycal_booking_click', {
        source: document.location.pathname,
        destination: link.href
      });
    }
  });
</script>`
          }]
        }
      ],
      trigger: [
        {
          name: 'All SavvyCal Links',
          type: 'linkClick',
          filter: [{
            type: 'contains',
            parameter: [
              { key: 'arg0', value: '{{Click URL}}' },
              { key: 'arg1', value: 'savvycal.com' }
            ]
          }]
        }
      ],
      variable: GA4_CONFIG.customDimensions.map(dim => ({
        name: `GA4 - ${dim.name}`,
        type: 'jsVariable',
        parameter: [{ key: 'name', value: `dataLayer.${dim.name}` }]
      }))
    }
  };
}

// Generate setup checklist
function generateChecklist() {
  const checklist = `
# GA4 Setup Checklist for VibeCTO.ai

## 1. Initial Setup ✅
- [x] GA4 property created (${GA4_CONFIG.measurementId})
- [x] Tracking code installed on website
- [ ] Enhanced measurement configured
- [ ] Google Signals enabled

## 2. Custom Dimensions (${GA4_CONFIG.customDimensions.length} total)
Go to: Admin → Custom definitions → Custom dimensions

${GA4_CONFIG.customDimensions.map(dim => 
  `- [ ] **${dim.name}** (${dim.scope} scope) - ${dim.description}`
).join('\n')}

## 3. Mark Conversions
Go to: Admin → Events → Mark as conversion

${GA4_CONFIG.customEvents
  .filter(e => e.markAsConversion)
  .map(e => `- [ ] ${e.name}`)
  .join('\n')}

## 4. Create Audiences
Go to: Admin → Audiences

${GA4_CONFIG.audiences.map(aud => 
  `- [ ] **${aud.name}** - ${aud.description}`
).join('\n')}

## 5. Configure Reports
Go to: Reports → Library → Create new report

- [ ] Adventure Game Funnel Report
- [ ] SavvyCal Conversion Path Report  
- [ ] Form Performance Report
- [ ] User Journey Report

## 6. Set Up Funnels
Go to: Explore → Funnel exploration

${GA4_CONFIG.funnels.map(funnel => 
  `- [ ] **${funnel.name}** (${funnel.steps.length} steps)`
).join('\n')}

## 7. Configure Data Retention
Go to: Admin → Data Settings → Data Retention

- [ ] Set event data retention to 14 months
- [ ] Enable "Reset user data on new activity"

## 8. Link Other Google Products
Go to: Admin → Product Links

- [ ] Link Google Ads (if applicable)
- [ ] Link Search Console
- [ ] Link Google Optimize (for A/B testing)

## 9. Testing & Validation
- [ ] Use DebugView to verify events are firing
- [ ] Test all conversion events
- [ ] Verify custom dimensions are populated
- [ ] Check real-time reports

## 10. Documentation & Training
- [ ] Document custom event naming conventions
- [ ] Create tracking plan for team
- [ ] Set up alerts for anomalies
`;

  return checklist;
}

// Main execution
function main() {
  console.log('📊 Generating GA4 Configuration Files...\n');
  
  const outputDir = path.join(__dirname, 'ga4-setup');
  
  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Generate files
  const files = [
    {
      name: 'ga4-config.json',
      content: JSON.stringify(GA4_CONFIG, null, 2)
    },
    {
      name: 'gtm-container.json',
      content: JSON.stringify(generateGTMContainer(), null, 2)
    },
    {
      name: 'setup-checklist.md',
      content: generateChecklist()
    },
    {
      name: 'enhanced-tracking.html',
      content: `
<!-- Enhanced GA4 Configuration for VibeCTO.ai -->
<!-- Add this after your existing GA4 script -->
<script>
  // Configure custom dimensions
  gtag('config', '${GA4_CONFIG.measurementId}', {
    'custom_map': {
      ${GA4_CONFIG.customDimensions.map((dim, i) => 
        `'dimension${i + 1}': '${dim.name}'`
      ).join(',\n      ')}
    }
  });

  // Enhanced SavvyCal tracking
  document.addEventListener('DOMContentLoaded', function() {
    // Find all SavvyCal links
    const savvyCalLinks = document.querySelectorAll('a[href*="savvycal.com"]');
    
    savvyCalLinks.forEach(link => {
      link.addEventListener('click', function() {
        gtag('event', 'conversion_savvycal_booking_click', {
          'source': window.location.pathname,
          'destination': this.href,
          'link_text': this.textContent
        });
      });
    });
  });
</script>`
    }
  ];
  
  // Write files
  files.forEach(file => {
    const filePath = path.join(outputDir, file.name);
    fs.writeFileSync(filePath, file.content);
    console.log(`✅ Created: ${file.name}`);
  });
  
  console.log(`\n📁 Files saved to: ${outputDir}`);
  console.log('\n📋 Next steps:');
  console.log('1. Open setup-checklist.md and follow the manual steps');
  console.log('2. Import gtm-container.json to Google Tag Manager (optional)');
  console.log('3. Add enhanced-tracking.html snippet to your site');
  console.log('\n✨ Setup files generated successfully!');
}

// Run
main();

export { GA4_CONFIG, generateGTMContainer, generateChecklist };