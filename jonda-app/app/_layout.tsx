import { Stack } from 'expo-router';

export default function RootLayout() {

  return (
      <Stack
        screenOptions={{
            gestureEnabled: true,
            gestureDirection: 'horizontal',
            animation: 'slide_from_right',
        }}
        >
        <Stack.Screen name="index" options={{title: 'Home', headerShown: false}} />
        <Stack.Screen name="record" options={{title: 'Record', headerShown: false}} />
        {/* <Stack.Screen name="chatbot" options={{title: 'Chatbot', headerShown: false}} /> */}
      </Stack>
  )
}