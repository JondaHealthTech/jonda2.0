/**
 * Root Layout Component
 * 
 * @description This component defines the main navigation structure and screen transitions
 * for the application using Expo Router's Stack navigator.
 */

import { StripeProvider } from '@stripe/stripe-react-native';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';

/**
 * Root Layout Component
 * 
 * @description This component defines the main navigation structure and screen transitions
 * for the application using Expo Router's Stack navigator.
 * 
 * @component
 * @example
 * // This component is automatically used by Expo Router as the root layout
 * // No manual instantiation required
 */
export default function RootLayout() {
  const [publishableKey, setPublishableKey] = useState('');

  /**
   * @description Fetches Stripe publishable key from backend API (server with Stripe keys) to initialize payment provider
   */
  const fetchPublishableKey = async (): Promise<void> => {
    try {
      const response = await fetch('https://registration-harassment-sh-wave.trycloudflare.com/config', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch publishable key');
      }

      const data = await response.json();
      console.log('Publishable key fetched:', data.publishableKey);
      setPublishableKey(data.publishableKey);
    } catch (error) {
      console.error('Error fetching publishable key:', error);
    }
  };

  /**
   * @description Initialize Stripe configuration on component mount
   */
  useEffect(() => {
    fetchPublishableKey();
  }, []);

  return (
    <StripeProvider
      publishableKey={publishableKey}
      urlScheme="jondaapp"
      >
      <Stack initialRouteName="index"
        screenOptions={{
            gestureEnabled: true,
            gestureDirection: 'horizontal',
            animation: 'slide_from_right',
        }}
        >
        <Stack.Screen name="index" options={{title: 'Index', headerShown: false}} />
        <Stack.Screen name="chatbot" options={{title: 'Chatbot', headerShown: false}} />
        <Stack.Screen name="home" options={{title: 'Home', headerShown: false}} />
        <Stack.Screen name="record" options={{title: 'Record', headerShown: false}} />
      </Stack>
    </StripeProvider>
  )
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