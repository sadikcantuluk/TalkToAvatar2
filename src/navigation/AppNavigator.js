import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  SplashScreen,
  WelcomeScreen,
  SelectAvatarScreen,
  CreateCustomAvatarScreen,
  TextToSpeechScreen,
  AvatarToVideoScreen,
  TravelAssistantScreen,
  VideoViewingScreen,
  PastAudioListScreen,
  PastVideosListScreen,
} from '../screens';

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
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="SelectAvatar" component={SelectAvatarScreen} />
        <Stack.Screen name="CreateCustomAvatar" component={CreateCustomAvatarScreen} />
        <Stack.Screen name="Dashboard" component={TextToSpeechScreen} />
        <Stack.Screen name="AvatarToVideo" component={AvatarToVideoScreen} />
        <Stack.Screen name="TravelAssistant" component={TravelAssistantScreen} />
        <Stack.Screen name="VideoViewing" component={VideoViewingScreen} />
        <Stack.Screen name="PastAudioList" component={PastAudioListScreen} />
        <Stack.Screen name="PastVideosList" component={PastVideosListScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

