# Jonda 2.0 Health App

A comprehensive health data management application built with React Native and Expo, featuring file upload capabilities, AI-powered chatbot, and voice recognition functionality.

## Features

- **📱 Multi-platform Support**: iOS and Android compatibility
- **📄 File Upload**: Support for images and PDF documents
- **🤖 AI Chatbot**: Interactive chat interface with voice recognition
- **🎙️ Speech Recognition**: Voice-to-text functionality for hands-free interaction
- **📊 Data Display**: Dynamic rendering of processed health data
- **🎨 Modern UI**: Gradient backgrounds and smooth animations

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development)
- Android Studio/Emulator (for Android development)

## Installation

1. Navigate to project folder
```
cd jonda-app
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

## Running the App

### Important: Development Build Required

**The speech recognition functionality requires a development build and will not work with Expo Go.** You must use one of the following commands:

### Start Development Server
```bash
npx expo start
```

### Run on iOS
```bash
npx expo run ios
```

### Run on Android
```bash
npx expo run android
```

### Device Selection

To select a specific device or simulator, append the `--device` flag to any run command:

```bash
npx expo run ios --device
npx expo run android --device
```

This will present you with a list of available simulators and physical devices to choose from.

## Simulator Setup

### iOS Simulator Setup

1. **Install Xcode** (macOS only)
   - Download from the Mac App Store
   - Open Xcode and agree to the license terms

2. **Install iOS Simulator**
   - Open Xcode
   - Go to `Xcode > Preferences > Components`
   - Download your desired iOS simulator versions

3. **Alternative: Command Line Installation**
   ```bash
   xcode-select --install
   ```

**📖 Detailed Setup Guide**: [iOS Simulator Setup - Apple Developer](https://developer.apple.com/documentation/xcode/running-your-app-in-the-simulator)

### Android Emulator Setup

1. **Install Android Studio**
   - Download from [developer.android.com](https://developer.android.com/studio)
   - Follow the installation wizard

2. **Set up Android Emulator**
   - Open Android Studio
   - Go to `Tools > AVD Manager`
   - Click `Create Virtual Device`
   - Choose a device definition and system image
   - Click `Finish` and start the emulator

3. **Configure Environment Variables**
   Add to your shell profile (`.bashrc`, `.zshrc`, etc.):
   ```bash
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/tools
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

**📖 Detailed Setup Guide**: [Android Emulator Setup - Android Developers](https://developer.android.com/studio/run/emulator)

## App Structure

```
├── app/
│   ├── _layout.tsx          # Root navigation layout
│   ├── index.tsx            # Home screen with upload options
│   ├── record.tsx           # Data display screen
│   ├── chatbot.tsx          # AI chat interface
│   └── rest/
│       └── requester.ts     # API communication
├── assets/
│   └── images/
│       └── jondaxicon.png   # App logo
└── README.md
```

## Screen Navigation Flow

1. **Home Screen (`index.tsx`)**: 
   - Upload from gallery
   - Capture & upload photo
   - Upload PDF documents
   - Navigate to chatbot

2. **Record Screen (`record.tsx`)**: 
   - Display processed data after upload
   - Scrollable key-value pairs

3. **Chatbot Screen (`chatbot.tsx`)**: 
   - Text messaging
   - Voice recognition (long-press microphone)
   - AI responses

## Key Dependencies

- **Expo Router**: File-based navigation
- **expo-speech-recognition**: Voice-to-text functionality
- **expo-image-picker**: Camera and gallery access
- **expo-document-picker**: File selection
- **expo-linear-gradient**: UI gradients
- **@expo/vector-icons**: Icon library

## Development Notes

### Speech Recognition
- **Requires development build** - does not work with Expo Go
- Uses `expo-speech-recognition` module
- Supports real-time transcription with interim results
- Long-press microphone button to activate

### File Upload
- Supports images (JPEG, PNG) and PDF documents
- Automatic permission handling for camera and gallery
- Upload progress and error handling included

### Platform Differences
- Android-specific layout adjustments for safe areas
- iOS uses padding behavior for keyboard avoidance
- Platform-specific button spacing and sizing

## Troubleshooting

### Speech Recognition Not Working
- Ensure you're using a development build (`npx expo run ios` or `npx expo run android`)
- Check device permissions for microphone access
- Verify the app is running on a physical device or proper simulator

### Build Errors
- Clear Expo cache: `npx expo r -c`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check platform-specific requirements are met

### Simulator Issues
- Restart the simulator/emulator
- Check simulator settings for microphone access
- Ensure latest simulator/emulator version is installed

## Support

For issues and questions:
- Check the troubleshooting section above
- Review Expo documentation: [docs.expo.dev](https://docs.expo.dev)
- Create an issue in the repository