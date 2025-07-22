# Jonda Mobile App

A comprehensive health management application built with Expo React Native, featuring AI-powered chat assistance, document processing, medical record management, and integrated payment solutions.

## Features

- **Authentication System** - Secure login with gradient UI
- **Document Upload** - Image capture and PDF document processing
- **AI Chatbot** - Voice and text-based health assistance
- **Payment Integration** - Stripe payment processing for subscriptions
- **Medical Records** - Digital health record management
- **Voice Recognition** - Speech-to-text functionality for accessibility

---

## Setup for First-Time Cloners

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd jonda-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Expo CLI globally** (if not already installed)
   ```bash
   npm install -g @expo/cli
   ```

4. **Set up development build**
   ```bash
   # Create development build for iOS
   npx expo run:ios

   # Create development build for Android  
   npx expo run:android
   ```

5. **Stripe Account Setup**
   - Create a new Stripe account: [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register)
   - Get your publishable and secret keys from the Stripe Dashboard
   - Update your backend API with the Stripe secret key
   - Configure webhook endpoints for payment processing

6. **Environment Configuration**
   - Update API endpoints in your code to match your backend URLs
   - Configure Stripe keys for payment processing
   - Set up speech recognition permissions for voice features

7. **Backend Server Setup**
   ```bash
   # Navigate to backend directory
   cd backend-server
   
   # Install backend dependencies
   npm install
   
   # Start the backend server
   node server.js
   ```

---

## Running the App

### Local Development

**⚠️ Important: Always use Development Build, NOT Expo Go**

The app uses native packages (Stripe, Speech Recognition, Document Picker) that require a development build to function properly.

1. **Start the development server with tunnel** (for local development):
   ```bash
   npx expo start --tunnel
   ```

2. **In a separate terminal**, run the app:
   ```bash
   # For iOS (with device selection)
   npx expo run:ios --device

   # For Android (with device selection)  
   npx expo run:android --device

   # Or without --device for default emulator
   npx expo run:ios
   npx expo run:android
   ```

3. **Switch to Development Build**:
   - After running `npx expo start`, press `s` to switch to development build
   - This ensures all native packages work correctly

### Server-Hosted Development

For apps already deployed on a server, tunneling is not required:

1. **Start the development server**:
   ```bash
   npx expo start
   ```

2. **Run on device/emulator**:
   ```bash
   # Same commands as local development
   npx expo run:ios --device
   npx expo run:android --device
   ```

### Device vs Emulator
- **With `--device`**: Shows list of available physical devices and emulators
- **Without `--device`**: Uses default emulator/simulator

---

## EAS Build (Cloud Building)

For building production-ready apps using Expo's cloud service:

### Setup EAS CLI

1. **Install EAS CLI**
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo account**
   ```bash
   eas login
   ```
   If you don't have an Expo account, create one at [https://expo.dev/signup](https://expo.dev/signup)

3. **Configure EAS Build**
   ```bash
   eas build:configure
   ```
   This creates an `eas.json` file with build configurations

### Building Your App

1. **Build for Android (APK)**
   ```bash
   # Development build
   eas build --platform android --profile development

   # Production build
   eas build --platform android --profile production
   ```

2. **Build for iOS**
   ```bash
   # Development build  
   eas build --platform ios --profile development

   # Production build (requires Apple Developer account)
   eas build --platform ios --profile production
   ```

3. **Build for both platforms**
   ```bash
   eas build --platform all
   ```

### Managing Builds

- **Check build status**: Visit [https://expo.dev/builds](https://expo.dev/builds)
- **Download builds**: Links provided after successful build completion
- **Build history**: View all previous builds in your Expo dashboard

### Requirements for Production Builds

- **Android**: Google Play Console account for app signing
- **iOS**: Apple Developer Program membership ($99/year)
- **App Store/Play Store**: Configured app listings and metadata

---

## Package Dependencies

### Core Framework
- **[@expo/vector-icons](https://docs.expo.dev/guides/icons/)** - Icon library for Expo apps
- **[expo](https://expo.dev/)** - Expo platform and CLI tools
- **[expo-router](https://docs.expo.dev/router/introduction/)** - File-based navigation system
- **[react](https://reactjs.org/)** - React framework
- **[react-native](https://reactjs.org/)** - React Native framework

### UI & Styling
- **[expo-linear-gradient](https://docs.expo.dev/versions/latest/sdk/linear-gradient/)** - Linear gradient components
- **[react-native-linear-gradient](https://github.com/react-native-linear-gradient/react-native-linear-gradient)** - Native linear gradients

### Payment Processing
- **[@stripe/stripe-react-native](https://stripe.com/docs/payments/accept-a-payment)** - Stripe payment integration

### Media & File Handling
- **[expo-document-picker](https://docs.expo.dev/versions/latest/sdk/document-picker/)** - Document selection from device
- **[expo-image-picker](https://docs.expo.dev/versions/latest/sdk/imagepicker/)** - Image capture and selection

### Voice & Speech
- **[expo-speech-recognition](https://docs.expo.dev/versions/latest/sdk/speech/)** - Speech-to-text functionality

### Development Tools
- **[@expo/cli](https://docs.expo.dev/more/expo-cli/)** - Expo command line interface
- **[typescript](https://www.typescriptlang.org/)** - TypeScript support

### Backend Integration
- Custom REST API client for:
  - Image upload processing
  - Document upload processing  
  - AI chatbot responses (dad joke API integration)
  - Payment intent creation

---

## Project Structure

```
app/
├── _layout.tsx          # Root navigation layout
├── index.tsx           # Login/authentication screen
├── home.tsx            # Main app with upload options
├── chatbot.tsx         # AI chat interface
├── record.tsx          # Medical record processing
└── rest/
    └── requester.ts    # API client functions

backend-server/
└── server.js           # Backend API server
```

---

## Development Notes

### Navigation Flow
- **index** → **home** → **record** (after successful upload)
- **home** → **chatbot** (AI assistance)

### Key Features Implementation
- **Stripe Payments**: Dynamic key fetching from backend
- **File Uploads**: Support for images (camera/gallery) and PDF documents  
- **Voice Recognition**: Real-time speech-to-text with visual feedback
- **Loading States**: Full-screen overlays during upload operations
- **Form Validation**: Dynamic button states and user feedback

### API Endpoints
- Payment Intent: `POST /create-payment-intent`
- Stripe Config: `GET /config`
- File Upload: Custom endpoints in `rest/requester.ts`
- Backend Server: Located in `backend-server/server.js`

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## Testing

- **Physical Devices**: Recommended for full feature testing
- **Emulators**: Good for UI testing, limited native feature support
- **Development Build**: Required for all native packages to function

---

## Troubleshooting

### Common Issues
- **"Unmatched Route" error**: Ensure all screen files exist and match navigation names
- **Stripe not working**: Verify development build is being used (not Expo Go)
- **Voice recognition fails**: Check device permissions and microphone access
- **Upload failures**: Confirm backend API endpoints are accessible

### Debug Commands
```bash
# Clear Metro cache
npx expo start --clear

# Reset project (if needed)
npm run reset-project
```

---
