import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';

export default function AuthScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [mode, setMode] = useState<'landing' | 'login' | 'signup'>('landing');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGuest = () => {
    navigation.replace('Onboarding');
  };

  const handleSignUp = async () => {
    console.log('Sign Up Button Pressed');
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          }
        }
      });
      
      if (error) throw error;
      
      navigation.replace('Onboarding');
    } catch (error: any) {
      Alert.alert('Sign Up Error', error.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing Fields', 'Please enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
      navigation.replace('MainTabs');
    } catch (error: any) {
      Alert.alert('Authentication Error', error.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
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
                </View>

                <View style={styles.landingBottom}>
                  <TouchableOpacity style={styles.primaryButton} onPress={() => setMode('signup')} activeOpacity={0.8}>
                    <Text style={styles.primaryButtonText}>GET STARTED</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.secondaryButton} onPress={() => setMode('login')} activeOpacity={0.8}>
                    <Text style={styles.secondaryButtonText}>I ALREADY HAVE AN ACCOUNT</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.guestButton} onPress={handleGuest}>
                    <Text style={styles.guestButtonText}>CONTINUE AS GUEST</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.formContainer}>
                <View style={styles.formHeader}>
                  <TouchableOpacity onPress={() => setMode('landing')} style={styles.backButton}>
                    <Text style={styles.backButtonText}>←</Text>
                  </TouchableOpacity>
                  <Text style={styles.formTitleHeader}>{mode === 'signup' ? 'Create Account' : 'Welcome Back'}</Text>
                  <View style={{ width: 40 }} />
                </View>

                <View style={styles.formContent}>
                  <Text style={styles.formSubtitle}>{mode === 'signup' ? 'Start your wellness journey today' : 'Continue your practice'}</Text>

                  <TouchableOpacity style={styles.socialButton} activeOpacity={0.8}>
                    <Text style={styles.socialButtonText}>CONTINUE WITH GOOGLE</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#1A1F2B', borderBottomColor: '#000000', borderColor: '#1A1F2B' }]} activeOpacity={0.8}>
                    <Text style={[styles.socialButtonText, { color: '#FFFFFF' }]}>CONTINUE WITH APPLE</Text>
                  </TouchableOpacity>

                  <View style={styles.divider}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>OR</Text>
                    <View style={styles.dividerLine} />
                  </View>

                  {mode === 'signup' && (
                    <TextInput
                      style={styles.input}
                      placeholder="Your name"
                      placeholderTextColor="#AFAFAF"
                      value={name}
                      onChangeText={setName}
                      editable={!loading}
                    />
                  )}
                  <TextInput
                    style={styles.input}
                    placeholder="Email address"
                    placeholderTextColor="#AFAFAF"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    editable={!loading}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#AFAFAF"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    editable={!loading}
                  />

                  {mode === 'signup' ? (
                    <TouchableOpacity 
                      style={[styles.submitButton, loading && { opacity: 0.6 }]} 
                      onPress={handleSignUp} 
                      activeOpacity={0.8}
                      disabled={loading}
                    >
                      <Text style={styles.submitButtonText}>
                        {loading ? 'PLEASE WAIT...' : 'CREATE ACCOUNT'}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity 
                      style={[styles.submitButton, loading && { opacity: 0.6 }]} 
                      onPress={handleLogin} 
                      activeOpacity={0.8}
                      disabled={loading}
                    >
                      <Text style={styles.submitButtonText}>
                        {loading ? 'PLEASE WAIT...' : 'SIGN IN'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  landingContainer: { flex: 1, padding: 24, justifyContent: 'space-between' },
  landingTop: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 40 },
  logoContainer: { width: 120, height: 120, backgroundColor: '#FFFFFF', borderRadius: 32, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#E5E5E5', borderBottomWidth: 8, borderBottomColor: '#E5E5E5', marginBottom: 32 },
  logoEmoji: { fontSize: 64 },
  title: { fontSize: 40, fontWeight: '900', color: '#58CC02', marginBottom: 12, textAlign: 'center' },
  subtitle: { fontSize: 18, color: '#AFAFAF', textAlign: 'center', lineHeight: 26, marginBottom: 32, fontWeight: '700' },
  pillsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginBottom: 32 },
  pill: { backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 2, borderColor: '#E5E5E5', borderBottomWidth: 4, borderBottomColor: '#E5E5E5' },
  pillText: { color: '#4B4B4B', fontSize: 14, fontWeight: '900' },
  
  landingBottom: { paddingBottom: 20 },
  primaryButton: { backgroundColor: '#58CC02', paddingVertical: 18, borderRadius: 16, alignItems: 'center', marginBottom: 16, borderWidth: 2, borderColor: '#58CC02', borderBottomWidth: 5, borderBottomColor: '#58A700' },
  primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '900' },
  secondaryButton: { backgroundColor: '#FFFFFF', paddingVertical: 18, borderRadius: 16, alignItems: 'center', borderWidth: 2, borderColor: '#E5E5E5', borderBottomWidth: 5, borderBottomColor: '#E5E5E5', marginBottom: 16 },
  secondaryButtonText: { color: '#1CB0F6', fontSize: 16, fontWeight: '900' },
  guestButton: { alignItems: 'center', paddingVertical: 8 },
  guestButtonText: { color: '#AFAFAF', fontSize: 14, fontWeight: '900' },

  formContainer: { flex: 1, padding: 24 },
  formHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  backButton: { padding: 8 },
  backButtonText: { color: '#AFAFAF', fontSize: 24, fontWeight: '900' },
  formTitleHeader: { fontSize: 24, fontWeight: '900', color: '#4B4B4B' },
  formContent: { flex: 1, justifyContent: 'center' },
  formSubtitle: { fontSize: 16, color: '#AFAFAF', textAlign: 'center', marginBottom: 32, fontWeight: '700' },
  
  socialButton: { backgroundColor: '#FFFFFF', paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginBottom: 16, borderWidth: 2, borderColor: '#E5E5E5', borderBottomWidth: 5, borderBottomColor: '#E5E5E5' },
  socialButtonText: { color: '#4B4B4B', fontSize: 15, fontWeight: '900' },
  
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 24 },
  dividerLine: { flex: 1, height: 2, backgroundColor: '#E5E5E5' },
  dividerText: { color: '#AFAFAF', marginHorizontal: 16, fontSize: 14, fontWeight: '900' },
  
  input: { backgroundColor: '#F7F7F7', color: '#4B4B4B', fontSize: 16, fontWeight: '700', padding: 18, borderRadius: 16, borderWidth: 2, borderColor: '#E5E5E5', marginBottom: 16 },
  
  submitButton: { backgroundColor: '#58CC02', paddingVertical: 18, borderRadius: 16, alignItems: 'center', marginTop: 8, borderWidth: 2, borderColor: '#58CC02', borderBottomWidth: 5, borderBottomColor: '#58A700' },
  submitButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '900' }
});
