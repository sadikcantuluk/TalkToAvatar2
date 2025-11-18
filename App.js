import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClientProvider } from '@tanstack/react-query';
import AppNavigator from './src/navigation/AppNavigator';
import { NotificationProvider } from './src/context/NotificationContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { ToastProvider } from './src/context/ToastContext';
import { queryClient } from './src/config/queryClient';

// Wrapper component to pass auth context to NotificationProvider
const AppContent = () => {
  const { token, user } = useAuth();
  
  return (
    <NotificationProvider authToken={token} authUser={user}>
      <AppNavigator />
      <StatusBar style="light" />
    </NotificationProvider>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </AuthProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
