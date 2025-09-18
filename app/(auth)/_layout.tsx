import React from 'react';
import { Stack } from 'expo-router';

// This is the layout for the authentication stack.
// It defines a stack navigator for the login and signup screens.
export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ headerShown: false }} />
    </Stack>
  );
}