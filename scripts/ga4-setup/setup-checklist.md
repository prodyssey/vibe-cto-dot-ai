
# GA4 Setup Checklist for VibeCTO.ai

## 1. Initial Setup ✅
- [x] GA4 property created (G-SVTZMGDLMF)
- [x] Tracking code installed on website
- [ ] Enhanced measurement configured
- [ ] Google Signals enabled

## 2. Custom Dimensions (10 total)
Go to: Admin → Custom definitions → Custom dimensions

- [ ] **source** (event scope) - Event source location
- [ ] **destination** (event scope) - Destination URL or type
- [ ] **budget** (event scope) - Budget level selection
- [ ] **scene** (event scope) - Adventure game scene
- [ ] **choice** (event scope) - Adventure game choice
- [ ] **next_scene** (event scope) - Next adventure scene
- [ ] **player_name** (user scope) - Adventure player name
- [ ] **form_name** (event scope) - Name of submitted form
- [ ] **contact_method** (event scope) - Preferred contact method
- [ ] **has_company** (event scope) - User has company

## 3. Mark Conversions
Go to: Admin → Events → Mark as conversion

- [ ] conversion_savvycal_booking_click
- [ ] form_submit

## 4. Create Audiences
Go to: Admin → Audiences

- [ ] **High Budget Leads** - Users who selected high budget options
- [ ] **SavvyCal Converters** - Users who clicked to book a call
- [ ] **Adventure Completers** - Users who completed adventure games
- [ ] **Engaged Users** - Users who spent significant time exploring

## 5. Configure Reports
Go to: Reports → Library → Create new report

- [ ] Adventure Game Funnel Report
- [ ] SavvyCal Conversion Path Report  
- [ ] Form Performance Report
- [ ] User Journey Report

## 6. Set Up Funnels
Go to: Explore → Funnel exploration

- [ ] **Adventure to Booking** (4 steps)
- [ ] **Direct Booking** (2 steps)

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
