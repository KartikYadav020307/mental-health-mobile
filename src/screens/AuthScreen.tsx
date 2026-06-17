import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

export default function AuthScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [mode, setMode] = useState<'landing' | 'login' | 'signup'>('landing');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleGuest = () => {
    navigation.replace('Onboarding');
  };

  return (
    <LinearGradient
      colors={['#7c3aed', '#9333ea', '#4338ca']}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
            {mode === 'landing' ? (
              <View style={styles.landingContainer}>
                <View style={styles.landingTop}>
                  <View style={styles.logoContainer}>
                    <Text style={styles.logoEmoji}>🧘</Text>
                  </View>
                  <Text style={styles.title}>Serenova</Text>
                  <Text style={styles.subtitle}>Mindfulness, sleep, and AI coaching{'\n'}in one calm place</Text>
                  
                  <View style={styles.pillsContainer}>
                    {['🧠 AI Coach', '🎧 200+ Sessions', '🌙 Sleep Stories', '📊 Tracking', '🎮 Daily'].map((feature) => (
                      <View key={feature} style={styles.pill}>
                        <Text style={styles.pillText}>{feature}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                      <Text style={styles.statNum}>50K+</Text>
                      <Text style={styles.statLabel}>Users</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statNum}>200+</Text>
                      <Text style={styles.statLabel}>Sessions</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statNum}>4.9★</Text>
                      <Text style={styles.statLabel}>Rating</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.landingBottom}>
                  <TouchableOpacity style={styles.primaryButton} onPress={() => setMode('signup')}>
                    <Text style={styles.primaryButtonText}>Get Started — It's Free</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.secondaryButton} onPress={() => setMode('login')}>
                    <Text style={styles.secondaryButtonText}>I Already Have an Account</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleGuest} style={styles.guestButton}>
                    <Text style={styles.guestButtonText}>Continue as Guest →</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.formContainer}>
                <TouchableOpacity onPress={() => setMode('landing')} style={styles.backButton}>
                  <Text style={styles.backButtonText}>← Back</Text>
                </TouchableOpacity>

                <View style={styles.formContent}>
                  <Text style={styles.formEmoji}>🧘</Text>
                  <Text style={styles.formTitle}>{mode === 'signup' ? 'Create Account' : 'Welcome Back'}</Text>
                  <Text style={styles.formSubtitle}>{mode === 'signup' ? 'Start your wellness journey today' : 'Continue your practice'}</Text>

                  <TouchableOpacity style={styles.socialButton} onPress={handleGuest}>
                    <Text style={styles.socialButtonText}>G Continue with Google</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#000' }]} onPress={handleGuest}>
                    <Text style={[styles.socialButtonText, { color: '#fff' }]}>🍎 Continue with Apple</Text>
                  </TouchableOpacity>

                  <View style={styles.divider}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>or</Text>
                    <View style={styles.dividerLine} />
                  </View>

                  {mode === 'signup' && (
                    <TextInput
                      style={styles.input}
                      placeholder="Your name"
                      placeholderTextColor="rgba(255,255,255,0.5)"
                      value={name}
                      onChangeText={setName}
                    />
                  )}
                  <TextInput
                    style={styles.input}
                    placeholder="Email address"
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />

                  <TouchableOpacity style={styles.submitButton} onPress={handleGuest}>
                    <Text style={styles.submitButtonText}>{mode === 'signup' ? 'Create Account' : 'Sign In'}</Text>
                  </TouchableOpacity>

                  <View style={styles.switchModeContainer}>
                    <Text style={styles.switchModeText}>
                      {mode === 'signup' ? 'Already have an account? ' : "Don't have an account? "}
                    </Text>
                    <TouchableOpacity onPress={() => setMode(mode === 'signup' ? 'login' : 'signup')}>
                      <Text style={styles.switchModeLink}>{mode === 'signup' ? 'Sign in' : 'Sign up'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  landingContainer: { flex: 1, padding: 24, justifyContent: 'space-between' },
  landingTop: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logoContainer: { width: 100, height: 100, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 28, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', marginBottom: 32 },
  logoEmoji: { fontSize: 48 },
  title: { fontSize: 36, fontWeight: 'bold', color: '#fff', marginBottom: 12 },
  subtitle: { fontSize: 16, color: '#e9d5ff', textAlign: 'center', lineHeight: 24, marginBottom: 32 },
  pillsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginBottom: 32 },
  pill: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  pillText: { color: '#fff', fontSize: 13 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', paddingHorizontal: 20 },
  statItem: { alignItems: 'center' },
  statNum: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  statLabel: { color: '#d8b4fe', fontSize: 12, marginTop: 4 },
  landingBottom: { paddingBottom: 20 },
  primaryButton: { backgroundColor: '#fff', paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  primaryButtonText: { color: '#7e22ce', fontSize: 16, fontWeight: 'bold' },
  secondaryButton: { backgroundColor: 'rgba(255,255,255,0.2)', paddingVertical: 16, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', marginBottom: 16 },
  secondaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  guestButton: { alignItems: 'center', paddingVertical: 8 },
  guestButtonText: { color: '#e9d5ff', fontSize: 14, fontWeight: '500' },

  formContainer: { flex: 1, padding: 24 },
  backButton: { paddingVertical: 12, marginBottom: 20 },
  backButtonText: { color: 'rgba(255,255,255,0.8)', fontSize: 16 },
  formContent: { flex: 1, justifyContent: 'center' },
  formEmoji: { fontSize: 40, textAlign: 'center', marginBottom: 16 },
  formTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 8 },
  formSubtitle: { fontSize: 15, color: '#e9d5ff', textAlign: 'center', marginBottom: 32 },
  socialButton: { backgroundColor: '#fff', paddingVertical: 14, borderRadius: 16, alignItems: 'center', marginBottom: 12 },
  socialButtonText: { color: '#374151', fontSize: 16, fontWeight: '600' },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 24 },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  dividerText: { color: 'rgba(255,255,255,0.5)', marginHorizontal: 16, fontSize: 14 },
  input: { backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: 16, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', marginBottom: 16 },
  submitButton: { backgroundColor: '#fff', paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginTop: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  submitButtonText: { color: '#7e22ce', fontSize: 16, fontWeight: 'bold' },
  switchModeContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  switchModeText: { color: '#e9d5ff', fontSize: 14 },
  switchModeLink: { color: '#fff', fontSize: 14, fontWeight: 'bold', textDecorationLine: 'underline' }
});
