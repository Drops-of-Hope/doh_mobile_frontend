# Donation Flow Implementation - Complete Guide

## Overview
This document provides a comprehensive guide to the modular, atomic-architecture-based donation flow implemented for the React Native mobile app.

## Architecture

### Atomic Design Structure
The donation flow follows atomic design principles:

- **Atoms**: Basic UI components (Button, BooleanQuestion, CampaignCard, QRDisplay)
- **Molecules**: Simple component combinations (DonationQuestions, CampaignList)  
- **Organisms**: Complex UI components (DonationForm, BottomTabBar)
- **Screens**: Full page components (ExploreScreen, DonationScreen, ActivitiesScreen)

### File Structure
```
app/
├── screens/
│   ├── ExploreScreen.tsx      # Campaign discovery and joining
│   ├── DonationScreen.tsx     # QR code display and form filling
│   └── ActivitiesScreen.tsx   # Donation history and status
├── services/
│   ├── api.ts                 # Base API configuration
│   └── donationService.ts     # Donation-specific API calls
└── navigation/
    └── AppNavigator.tsx       # Screen navigation setup

components/
├── atoms/
│   ├── Button.tsx             # Enhanced with disabled/variant props
│   └── Donation/
│       ├── BooleanQuestion.tsx # Individual health question
│       ├── CampaignCard.tsx   # Single campaign display
│       └── QRDisplay.tsx      # QR code with user info
├── molecules/
│   └── Donation/
│       ├── DonationQuestions.tsx # All health questions
│       └── CampaignList.tsx   # List of campaigns
└── organisms/
    ├── DonationForm.tsx       # Complete form with validation
    └── BottomTabBar.tsx       # Navigation between screens
```

## User Flow

### 1. Explore Campaigns (ExploreScreen)
- **Purpose**: Users discover available blood donation campaigns
- **Features**:
  - List of active campaigns with location, date, and participant count
  - Join campaign functionality (register interest)
  - Mock data fallback when API unavailable
  - Pull-to-refresh functionality

#### Key Components:
- `CampaignList` molecule displays campaigns
- `CampaignCard` atom for individual campaign display
- API integration via `donationService.getCampaigns()`

### 2. Donation Process (DonationScreen)
- **Purpose**: Users show QR code at campaign and fill form
- **Features**:
  - QR code generation with user info (name, email, UID, timestamp)
  - Health questionnaire with all required boolean questions
  - Form validation and submission
  - Modal-based UI for better UX

#### Key Components:
- `QRDisplay` atom with real QR code (react-native-qrcode-svg)
- `DonationForm` organism with validation
- `DonationQuestions` molecule for health screening

### 3. Activities Tracking (ActivitiesScreen)
- **Purpose**: Users track donation history and status
- **Features**:
  - Donation history with acceptance/rejection status
  - Detailed information for each donation
  - Status-based color coding (green/red/yellow)
  - Pull-to-refresh functionality

#### Key Components:
- Custom activity cards with status badges
- Detailed view modals
- API integration via `donationService.getDonationHistory()`

## Backend Integration

### API Configuration (app/services/api.ts)
```typescript
const API_BASE_URL = 'http://localhost:3000'; // Update for production

const API_ENDPOINTS = {
  DONATION_FORM: '/api/donations/submit',
  JOIN_CAMPAIGN: '/api/campaigns/join',
  USER_PROFILE: '/api/users/profile',
  CAMPAIGNS: '/api/campaigns',
  DONATION_HISTORY: '/api/donations/history',
};
```

### Donation Service (app/services/donationService.ts)
Provides TypeScript interfaces and API methods:
- `submitDonationForm()` - Submit health questionnaire
- `joinCampaign()` - Register interest in campaign
- `getUserProfile()` - Get user data for QR code
- `getCampaigns()` - List available campaigns
- `getDonationHistory()` - Get user's donation history

### Required Backend Endpoints
```
POST /api/donations/submit     # Submit donation form
POST /api/campaigns/join       # Join campaign
GET  /api/users/profile        # Get user profile
GET  /api/campaigns            # List campaigns
GET  /api/donations/history    # User donation history
```

## Health Questionnaire

The donation form includes all essential health screening questions:

1. Age verification (18+ years)
2. Weight requirement (≥50kg)
3. Recent illness check
4. Medication usage
5. Recent travel history
6. Pregnancy status (if applicable)
7. Recent piercings/tattoos
8. Alcohol consumption
9. Drug usage
10. Previous blood donation timing

All questions are boolean (Yes/No) for simplicity and are validated before submission.

## Navigation

### Bottom Tab Bar Navigation
- **Explore**: Campaign discovery (`ExploreScreen`)
- **Donate**: QR code and form (`DonationScreen`)
- **Home**: Main dashboard (`HomeScreen`)
- **Activities**: Donation history (`ActivitiesScreen`)
- **Profile**: User account (`ProfileScreen`)

### Navigation Setup
All screens are registered in `AppNavigator.tsx` with proper TypeScript typing.

## Multi-language Support (i18n)

### Setup Instructions

1. **Install dependencies**:
```bash
npm install react-i18next i18next react-native-localize
```

2. **Create translation files**:
```
locales/
├── en.json
├── si.json  # Sinhala
└── ta.json  # Tamil
```

3. **Translation key structure**:
```json
{
  "donation": {
    "qr_title": "Your Donation QR Code",
    "form_title": "Health Questionnaire",
    "questions": {
      "age": "Are you 18 years or older?",
      "weight": "Do you weigh at least 50kg?",
      // ... other questions
    }
  },
  "explore": {
    "title": "Blood Donation Campaigns",
    "join_button": "Join Campaign"
  },
  "activities": {
    "title": "My Donation Activities",
    "status": {
      "pending": "Pending",
      "accepted": "Accepted", 
      "rejected": "Rejected"
    }
  }
}
```

4. **Usage in components**:
```typescript
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return (
    <Text>{t('donation.qr_title')}</Text>
  );
};
```

## Setup and Installation

### 1. Install Dependencies
```bash
npm install react-native-qrcode-svg react-native-svg
npm install react-i18next i18next react-native-localize  # For i18n
```

### 2. Configure Backend
Update `API_BASE_URL` in `app/services/api.ts` to point to your backend server.

### 3. Test API Endpoints
Ensure all backend endpoints are implemented and return the expected data structures.

### 4. Run the Application
```bash
npx expo start
```

## Testing

### Component Testing
- Test each atomic component in isolation
- Verify form validation logic
- Test navigation between screens

### Integration Testing
- Test complete donation flow
- Verify API integration with mock data
- Test offline functionality with fallback data

### User Acceptance Testing
- Verify UI/UX flows match requirements
- Test QR code generation and scanning
- Validate form submissions

## Error Handling

### API Errors
- Network connection issues
- Server unavailability  
- Authentication failures
- Data validation errors

### User Input Errors
- Form validation errors
- Required field validation
- Data format validation

### Fallback Strategies
- Mock data when API unavailable
- Offline mode capabilities
- User-friendly error messages

## Security Considerations

### QR Code Data
- Include timestamp for verification
- Encrypt sensitive user data if needed
- Validate QR code data on backend

### API Security
- Implement proper authentication
- Use HTTPS for all API calls
- Validate all user inputs on backend

## Performance Optimization

### Code Splitting
- Lazy load screens not immediately needed
- Split large components into smaller atoms

### Caching
- Cache campaign data locally
- Implement pull-to-refresh for data updates
- Store user preferences locally

### Bundle Size
- Optimize images and assets
- Use vector icons where possible
- Minimize third-party dependencies

## Deployment

### Environment Configuration
- Development: `http://localhost:3000`
- Staging: `https://staging-api.yourapp.com`
- Production: `https://api.yourapp.com`

### Build Process
1. Update API endpoints for target environment
2. Build and test thoroughly
3. Deploy backend API first
4. Deploy mobile app to app stores

## Maintenance

### Regular Updates
- Keep dependencies updated
- Monitor API performance
- Update translation files
- Add new health screening questions as needed

### Monitoring
- Track API response times
- Monitor crash reports
- Analyze user feedback
- Track donation completion rates

## Future Enhancements

### Potential Features
- Push notifications for campaign updates
- In-app appointment scheduling
- Photo capture for additional verification
- Offline form completion with sync
- Advanced analytics and reporting
- Social sharing of donation achievements

### Technical Improvements
- Add comprehensive unit tests
- Implement automated testing
- Add accessibility improvements
- Optimize for different screen sizes
- Add dark mode support
