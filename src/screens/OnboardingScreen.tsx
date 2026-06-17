import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

const goals = [
  { id: 'stress', label: 'Reduce stress & anxiety', emoji: '😌' },
  { id: 'sleep', label: 'Sleep better', emoji: '😴' },
  { id: 'focus', label: 'Improve focus', emoji: '🎯' },
  { id: 'resilience', label: 'Build resilience', emoji: '💪' },
  { id: 'emotions', label: 'Process emotions', emoji: '💙' },
  { id: 'explore', label: 'Just exploring', emoji: '✨' },
];

const experienceLevels = [
  { id: 'never', label: "I've never meditated", emoji: '🌱' },
  { id: 'few', label: "I've tried a few times", emoji: '🌿' },
  { id: 'occasional', label: 'I meditate occasionally', emoji: '🌳' },
  { id: 'regular', label: 'I meditate regularly', emoji: '🧘' },
];

const TOTAL_STEPS = 3;

export default function OnboardingScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [step, setStep] = useState(0);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [experience, setExperience] = useState('');

  const goNext = () => {
    if (step < TOTAL_STEPS - 1) {
      setStep(s => s + 1);
    } else {
      navigation.replace('MainTabs');
    }
  };

  const goPrev = () => {
    if (step > 0) {
      setStep(s => s - 1);
    } else {
      navigation.replace('Auth');
    }
  };

  const toggleGoal = (id: string) => {
    setSelectedGoals(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  return (
    <LinearGradient colors={['#f5f3ff', '#faf5ff', '#eef2ff']} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={goPrev} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <View style={styles.progressContainer}>
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <View key={i} style={[styles.progressDot, i <= step && styles.progressDotActive]} />
            ))}
          </View>
          <Text style={styles.stepText}>{step + 1}/{TOTAL_STEPS}</Text>
        </View>

        <ScrollView contentContainerStyle={styles.content} bounces={false}>
          {step === 0 && (
            <View style={styles.stepContainer}>
              <View style={styles.stepHeader}>
                <Text style={styles.emojiIcon}>🌟</Text>
                <Text style={styles.title}>What brings you here?</Text>
                <Text style={styles.subtitle}>Select all that apply</Text>
              </View>

              <View style={styles.gridContainer}>
                {goals.map(goal => {
                  const isSelected = selectedGoals.includes(goal.id);
                  return (
                    <TouchableOpacity
                      key={goal.id}
                      style={[styles.card, isSelected && styles.cardActive]}
                      onPress={() => toggleGoal(goal.id)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.cardEmoji}>{goal.emoji}</Text>
                      <Text style={[styles.cardLabel, isSelected && styles.cardLabelActive]}>{goal.label}</Text>
                      {isSelected && <Text style={styles.checkIcon}>✓</Text>}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {step === 1 && (
            <View style={styles.stepContainer}>
              <View style={styles.stepHeader}>
                <Text style={styles.emojiIcon}>🧘</Text>
                <Text style={styles.title}>Your experience level?</Text>
                <Text style={styles.subtitle}>No right or wrong answer</Text>
              </View>

              <View style={styles.listContainer}>
                {experienceLevels.map(level => {
                  const isSelected = experience === level.id;
                  return (
                    <TouchableOpacity
                      key={level.id}
                      style={[styles.listCard, isSelected && styles.cardActive]}
                      onPress={() => {
                        setExperience(level.id);
                        setTimeout(goNext, 300);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.listCardEmoji}>{level.emoji}</Text>
                      <Text style={[styles.listCardLabel, isSelected && styles.cardLabelActive]}>{level.label}</Text>
                      {isSelected && <Text style={styles.listCheckIcon}>✓</Text>}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {step === 2 && (
            <View style={styles.stepContainer}>
              <View style={styles.stepHeader}>
                <Text style={styles.emojiIcon}>✨</Text>
                <Text style={styles.title}>You're all set!</Text>
                <Text style={styles.subtitle}>Let's begin your mindfulness journey.</Text>
              </View>
              
              <View style={styles.summaryBox}>
                <View style={styles.summaryAvatar}>
                  <Text style={{ fontSize: 48 }}>🌿</Text>
                </View>
                <Text style={styles.summaryTitle}>Mindful Explorer</Text>
                <Text style={styles.summaryDesc}>We'll take you on a personalized tour of mindfulness — from basics to sleep to self-compassion — at your own pace.</Text>
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.continueButton, (step === 0 && selectedGoals.length === 0) && styles.continueButtonDisabled]}
            disabled={step === 0 && selectedGoals.length === 0}
            onPress={goNext}
          >
            <Text style={styles.continueText}>{step === TOTAL_STEPS - 1 ? 'Begin My Journey ✨' : 'Continue →'}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8 },
  backButton: { marginRight: 16 },
  backText: { color: '#a78bfa', fontSize: 14, fontWeight: '600' },
  progressContainer: { flex: 1, flexDirection: 'row', gap: 6, marginRight: 16 },
  progressDot: { flex: 1, height: 6, backgroundColor: '#ddd6fe', borderRadius: 3 },
  progressDotActive: { backgroundColor: '#8b5cf6' },
  stepText: { color: '#a78bfa', fontSize: 14, fontWeight: '600' },
  
  content: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 40 },
  stepContainer: { flex: 1 },
  stepHeader: { marginBottom: 32 },
  emojiIcon: { fontSize: 40, marginBottom: 12 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#111827', marginBottom: 4 },
  subtitle: { fontSize: 16, color: '#6b7280' },
  
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: { width: '48%', backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 2, borderColor: '#f3f4f6', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2, position: 'relative' },
  cardActive: { backgroundColor: '#8b5cf6', borderColor: '#8b5cf6', shadowColor: '#8b5cf6', shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  cardEmoji: { fontSize: 24, marginBottom: 8 },
  cardLabel: { fontSize: 14, fontWeight: '600', color: '#374151' },
  cardLabelActive: { color: '#fff' },
  checkIcon: { position: 'absolute', top: 12, right: 12, color: '#fff', fontSize: 12, fontWeight: 'bold' },

  listContainer: { gap: 12 },
  listCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 2, borderColor: '#f3f4f6', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  listCardEmoji: { fontSize: 28, marginRight: 16 },
  listCardLabel: { fontSize: 16, fontWeight: '600', color: '#374151', flex: 1 },
  listCheckIcon: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  summaryBox: { backgroundColor: '#fff', borderRadius: 24, padding: 24, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  summaryAvatar: { width: 96, height: 96, borderRadius: 32, backgroundColor: '#fdf4ff', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  summaryTitle: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 12 },
  summaryDesc: { fontSize: 16, color: '#4b5563', textAlign: 'center', lineHeight: 24 },

  footer: { padding: 24, paddingTop: 8 },
  continueButton: { backgroundColor: '#7c3aed', paddingVertical: 16, borderRadius: 16, alignItems: 'center', shadowColor: '#7c3aed', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  continueButtonDisabled: { opacity: 0.4, shadowOpacity: 0 },
  continueText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
