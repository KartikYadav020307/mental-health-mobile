import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as ExpoSplashScreen from 'expo-splash-screen';
import SplashScreen from '../screens/SplashScreen';
import AuthScreen from '../screens/AuthScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import BottomTabNavigator from './BottomTabNavigator';
import AICoachScreen from '../screens/AICoachScreen';
import AudioPlayerScreen from '../screens/AudioPlayerScreen';
import { RootStackParamList } from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator<RootStackParamList>();

ExpoSplashScreen.preventAutoHideAsync();

export default function RootNavigator() {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList>('Auth');

  useEffect(() => {
    const checkState = async () => {
      try {
        const hasCompleted = await AsyncStorage.getItem('hasCompletedOnboarding');
        if (hasCompleted === 'true') {
          setInitialRoute('MainTabs');
        } else {
          setInitialRoute('Auth');
        }
      } catch (e) {
        console.error('Failed to read AsyncStorage', e);
        setInitialRoute('Auth');
      } finally {
        setIsLoading(false);
      }
    };
    checkState();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      ExpoSplashScreen.hideAsync();
    }
  }, [isLoading]);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRoute}>
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
      <Stack.Screen name="AICoach" component={AICoachScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="AudioPlayer" component={AudioPlayerScreen} options={{ presentation: 'modal' }} />
    </Stack.Navigator>
  );
}
