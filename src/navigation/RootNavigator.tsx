import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as ExpoSplashScreen from 'expo-splash-screen';
import SplashScreen from '../screens/SplashScreen';
import AuthScreen from '../screens/AuthScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import BottomTabNavigator from './BottomTabNavigator';
import AICoachScreen from '../screens/AICoachScreen';
import AudioPlayerScreen from '../screens/AudioPlayerScreen';
import JournalScreen from '../screens/JournalScreen';
import { RootStackParamList } from './types';
import { useUserStore } from '../store/useUserStore';

const Stack = createNativeStackNavigator<RootStackParamList>();

ExpoSplashScreen.preventAutoHideAsync();

export default function RootNavigator() {
  const [isHydrated, setIsHydrated] = useState(false);
  const hasCompletedOnboarding = useUserStore((s) => s.hasCompletedOnboarding);

  useEffect(() => {
    // Zustand persist rehydrates asynchronously from AsyncStorage.
    // We check if the store is already hydrated, and if not, subscribe
    // to the onFinishHydration event.
    const unsub = useUserStore.persist.onFinishHydration(() => {
      setIsHydrated(true);
    });

    // If the store hydrated before this effect ran (e.g. synchronous storage),
    // mark it immediately.
    if (useUserStore.persist.hasHydrated()) {
      setIsHydrated(true);
    }

    return unsub;
  }, []);

  useEffect(() => {
    if (isHydrated) {
      ExpoSplashScreen.hideAsync();
    }
  }, [isHydrated]);

  if (!isHydrated) {
    return <SplashScreen />;
  }

  const initialRoute: keyof RootStackParamList = hasCompletedOnboarding
    ? 'MainTabs'
    : 'Auth';

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRoute}>
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
      <Stack.Screen name="AICoach" component={AICoachScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="AudioPlayer" component={AudioPlayerScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="Journal" component={JournalScreen} />
    </Stack.Navigator>
  );
}

