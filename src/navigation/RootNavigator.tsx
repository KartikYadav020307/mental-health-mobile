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
import { supabase } from '../lib/supabase';

const Stack = createNativeStackNavigator<RootStackParamList>();

ExpoSplashScreen.preventAutoHideAsync();

export default function RootNavigator() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const isAuthenticated = useUserStore((s) => s.isAuthenticated);
  const hasCompletedOnboarding = useUserStore((s) => s.hasCompletedOnboarding);

  useEffect(() => {
    // Zustand persist rehydrates asynchronously from AsyncStorage.
    const unsubHydration = useUserStore.persist.onFinishHydration(() => {
      setIsHydrated(true);
    });

    if (useUserStore.persist.hasHydrated()) {
      setIsHydrated(true);
    }

    return () => {
      unsubHydration();
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    let isMounted = true;

    // Retrieve initial session on mount (after hydration)
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!isMounted) return;

      if (session) {
        useUserStore.getState().setSession(
          session.user.id,
          session.user.email || null,
          session.user.is_anonymous || false
        );

        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('experience_level')
            .eq('user_id', session.user.id)
            .maybeSingle();

          if (isMounted && profile && profile.experience_level) {
            useUserStore.getState().completeOnboarding();
          }
        } catch (error) {
          console.error('Error fetching initial profile:', error);
        }
      } else {
        useUserStore.getState().clearSession();
      }
      setIsAuthLoading(false);
    });

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        useUserStore.getState().setSession(
          session.user.id,
          session.user.email || null,
          session.user.is_anonymous || false
        );

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('experience_level')
              .eq('user_id', session.user.id)
              .maybeSingle();

            if (isMounted && profile && profile.experience_level) {
              useUserStore.getState().completeOnboarding();
            }
          } catch (error) {
            console.error('Error fetching profile on auth change:', error);
          }
        }
      } else if (event === 'SIGNED_OUT') {
        useUserStore.getState().clearSession();
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [isHydrated]);

  useEffect(() => {
    if (isHydrated && !isAuthLoading) {
      ExpoSplashScreen.hideAsync();
    }
  }, [isHydrated, isAuthLoading]);

  if (!isHydrated || isAuthLoading) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthScreen} />
      ) : !hasCompletedOnboarding ? (
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
          <Stack.Screen name="AICoach" component={AICoachScreen} options={{ presentation: 'modal' }} />
          <Stack.Screen name="AudioPlayer" component={AudioPlayerScreen} options={{ presentation: 'modal' }} />
          <Stack.Screen name="Journal" component={JournalScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

