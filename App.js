import React from 'react';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import { NotificationProvider } from './src/context/NotificationContext';

export default function App() {
  return (
    <NotificationProvider>
      <AppNavigator />
      <StatusBar style="light" />
    </NotificationProvider>
  );
}
