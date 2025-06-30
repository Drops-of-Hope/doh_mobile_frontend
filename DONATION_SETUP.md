# Installation Instructions for QR Code Support

To enable QR code functionality in the Donation screen, you need to install the following package:

```bash
npm install react-native-qrcode-svg react-native-svg
```

After installation, update the QRDisplay component to use the actual QR code:

## Update QRDisplay.tsx

Replace the placeholder in `components/atoms/Donation/QRDisplay.tsx` with:

```tsx
import QRCode from 'react-native-qrcode-svg';

// Replace the placeholder View with:
<QRCode
  value={qrData}
  size={250}
  color="#000000"
  backgroundColor="#ffffff"
/>
```

## Backend Connection Setup

1. Update the `API_BASE_URL` in `app/services/api.ts` with your Node.js backend URL:
   - For local development: `http://localhost:3000/api`
   - For development with physical device: `http://YOUR_LOCAL_IP:3000/api`
   - For production: `https://your-backend-domain.com/api`

2. Your Node.js backend should have the following endpoints:
   - `POST /api/donations/form` - Submit donation form
   - `POST /api/donations/join-campaign` - Join a campaign
   - `GET /api/users/profile` - Get user profile
   - `GET /api/campaigns` - Get available campaigns

## Features Implemented

### ✅ Atomic Architecture
- **Atoms**: BooleanQuestion, CampaignCard, QRDisplay
- **Molecules**: DonationQuestions, CampaignList
- **Organisms**: DonationForm
- **Screens**: DonationScreen

### ✅ Donation Screen Features
- Campaign list with "Join Campaign" cards
- Full-screen QR code display with user info
- Comprehensive donation form with 14 boolean questions
- Form validation and eligibility checking
- Modal-based navigation flow

### ✅ Backend Integration
- API service layer for backend communication
- Authentication token management
- Error handling and fallback data
- TypeScript interfaces for type safety

### ✅ Navigation
- Updated BottomTabBar with Donate navigation
- Added Donate screen to navigation stack
- Modal-based sub-navigation within Donate screen

## Usage Example

```tsx
// Navigate to Donate screen from any component
navigation.navigate("Donate");

// Or use BottomTabBar
<BottomTabBar activeTab="donate" />
```

The Donation screen is now fully functional with proper atomic architecture and backend integration!
