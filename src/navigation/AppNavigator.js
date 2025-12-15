import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  SplashScreen,
  LoginScreen,
  RegisterScreen,
  EmailVerificationScreen,
  ForgotPasswordScreen,
  ResetPasswordScreen,
  ProfileScreen,
  WelcomeScreen,
  SelectAvatarScreen,
  CreateCustomAvatarScreen,
  TextToSpeechScreen,
  AvatarToVideoScreen,
  TravelAssistantScreen,
  VideoViewingScreen,
  PastAudioListScreen,
  PastVideosListScreen,
  SualingoScreen,
  PastRecordingsListScreen,
} from '../screens';
import CoursesScreen from '../screens/CoursesScreen';
import CourseSetupScreen from '../screens/CourseSetupScreen';
import CourseDetailScreen from '../screens/CourseDetailScreen';
import CoursePracticeScreen from '../screens/CoursePracticeScreen';

import DashboardScreen from '../screens/DashboardScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: '#101922' },
          animationDuration: 300,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      >
        {/* Splash & Auth Screens */}
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="EmailVerification" component={EmailVerificationScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />

        {/* Main App Screens */}
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="SelectAvatar" component={SelectAvatarScreen} />
        <Stack.Screen name="CreateCustomAvatar" component={CreateCustomAvatarScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="TextToSpeech" component={TextToSpeechScreen} />
        <Stack.Screen name="AvatarToVideo" component={AvatarToVideoScreen} />
        <Stack.Screen name="TravelAssistant" component={TravelAssistantScreen} />
        <Stack.Screen name="Sualingo" component={SualingoScreen} />
        <Stack.Screen name="VideoViewing" component={VideoViewingScreen} />
        <Stack.Screen name="PastAudioList" component={PastAudioListScreen} />
        <Stack.Screen name="PastVideosList" component={PastVideosListScreen} />
        <Stack.Screen name="PastRecordingsList" component={PastRecordingsListScreen} />
        <Stack.Screen name="Courses" component={CoursesScreen} />
        <Stack.Screen name="CourseSetup" component={CourseSetupScreen} />
        <Stack.Screen name="CourseDetail" component={CourseDetailScreen} />
        <Stack.Screen name="CoursePractice" component={CoursePracticeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

