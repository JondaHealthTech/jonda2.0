import { Stack } from 'expo-router';

/**
 * Root Layout Component
 * 
 * This component defines the main navigation structure and screen transitions
 * for the application using Expo Router's Stack navigator.
 * 
 * @component
 * @example
 * // This component is automatically used by Expo Router as the root layout
 * // No manual instantiation required
 */
export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        // Enable swipe gestures for navigation
        gestureEnabled: true,
        // Set swipe direction to horizontal (left/right)
        gestureDirection: 'horizontal',
        // Use slide animation from right when navigating between screens
        animation: 'slide_from_right',
      }}
    >
      {/* Home Screen - Main landing page with upload options */}
      <Stack.Screen 
        name="index" 
        options={{
          title: 'Home',
          headerShown: false  // Hide header for custom gradient background
        }} 
      />
      
      {/* Record Screen - Displayed after successful file upload */}
      <Stack.Screen 
        name="record" 
        options={{
          title: 'Record',
          headerShown: false  // Hide header for consistent UI
        }} 
      />
      
      {/* Chatbot Screen - AI assistant interface */}
      <Stack.Screen 
        name="chatbot" 
        options={{
          title: 'Chatbot',
          headerShown: false  // Hide header for immersive chat experience
        }} 
      />
    </Stack>
  );
}

/**
 * Navigation Flow:
 * 1. index (Home) - User selects upload method or navigates to chatbot
 * 2. record - User lands here after successful image/document upload
 * 3. chatbot - User can access AI assistant directly from home
 * 
 * Screen Transitions:
 * - All screens use horizontal slide animation from right
 * - Gesture navigation enabled for intuitive user experience
 * - Headers hidden across all screens for custom UI implementation
 * 
 * Technical Notes:
 * - Uses Expo Router's file-based routing system
 * - Stack navigator provides standard push/pop navigation
 * - Screen options are configured globally but can be overridden per screen
 */