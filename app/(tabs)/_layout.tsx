import React from 'react';
import { Tabs } from 'expo-router'; // We only need the Tabs component here
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/hooks/useTheme';

export default function TabsLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        // --- Tab Bar Icon Logic ---
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'index') {
            iconName = focused ? 'checkmark-done-circle' : 'checkmark-done-circle-outline';
          } else if (route.name === 'settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        // --- Color and Style Settings ---
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.lightGray,
        },
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.text,
      })}
    >
      {/* --- First Tab: The To-Do List --- */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'To-Do',
          // FIX: This hides the ugly "index" header, since you already have a title in the screen.
          headerShown: false,
        }}
      />

      {/* --- Second Tab: Settings --- */}
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          // By setting headerShown to false, the top bar will be removed.
          headerShown: false,
        }}
      />

      {/* --- Hidden Screen: Task Details --- */}
      <Tabs.Screen
        name="task/[id]"
        options={{
          // This line hides the screen from the tab bar at the bottom.
          href: null,
          // This allows the task/[id].tsx file to show its own header,
          // which is where the "Edit" button lives.
          headerShown: true,
        }}
      />
    </Tabs>
  );
}