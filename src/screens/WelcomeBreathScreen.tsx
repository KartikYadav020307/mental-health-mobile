import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

export default function WelcomeBreathScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const breathAnim = useRef(new Animated.Value(1)).current;
  const [phase, setPhase] = useState('Breathe In...');

  useEffect(() => {
    Animated.sequence([
      Animated.timing(breathAnim, {
        toValue: 2.5,
        duration: 4000,
        useNativeDriver: true,
      }),
      Animated.timing(breathAnim, {
        toValue: 2.5,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.timing(breathAnim, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
      })
    ]).start(() => {
      navigation.replace('MainTabs');
    });

    const timers = [
      setTimeout(() => setPhase('Hold...'), 4000),
      setTimeout(() => setPhase('Breathe Out...'), 6000),
      setTimeout(() => setPhase('Welcome to Serenova'), 10000),
    ];

    return () => timers.forEach(clearTimeout);
  }, [breathAnim, navigation]);

  return (
    <LinearGradient colors={['#7c3aed', '#9333ea', '#4338ca']} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Let's take a deep breath.</Text>
        <Text style={styles.phase}>{phase}</Text>
        
        <View style={styles.circleContainer}>
          <Animated.View style={[styles.circle, { transform: [{ scale: breathAnim }] }]} />
          <Text style={styles.circleEmoji}>🧘</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 16 },
  phase: { fontSize: 20, color: '#e9d5ff', marginBottom: 120, height: 30, fontWeight: '500' },
  circleContainer: { alignItems: 'center', justifyContent: 'center' },
  circle: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255, 255, 255, 0.2)', position: 'absolute' },
  circleEmoji: { fontSize: 40 }
});
