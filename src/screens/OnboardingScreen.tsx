import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

const { width } = Dimensions.get('window');

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

const moods = [
  { score: 1, emoji: '😔', label: 'Struggling' },
  { score: 2, emoji: '😕', label: 'Low' },
  { score: 3, emoji: '😐', label: 'Neutral' },
  { score: 4, emoji: '🙂', label: 'Good' },
  { score: 5, emoji: '😄', label: 'Great' },
];

const timeOptions = [
  { id: '5', label: '5 min/day', desc: 'Quick & achievable', emoji: '⚡' },
  { id: '10', label: '10 min/day', desc: 'Perfect balance', emoji: '✨', recommended: true },
  { id: '15', label: '15–20 min/day', desc: 'Deep practice', emoji: '🧘' },
  { id: 'flexible', label: 'Flexible', desc: 'Varies each day', emoji: '🌊' },
];

const reminderTimes = [
  { id: 'morning', label: 'Morning', emoji: '🌅', time: '7:00 AM' },
  { id: 'afternoon', label: 'Afternoon', emoji: '☀️', time: '1:00 PM' },
  { id: 'evening', label: 'Evening', emoji: '🌆', time: '6:00 PM' },
  { id: 'night', label: 'Night', emoji: '🌙', time: '9:00 PM' },
];

const personas: Record<string, { name: string; emoji: string; desc: string; colors: readonly [string, string] }> = {
  stress: { name: 'Stress Soother', emoji: '🌿', desc: "You're seeking peace amid life's demands. We'll start with calming breathwork and gentle stress-release practices tailored just for you.", colors: ['#34d399', '#14b8a6'] },
  sleep: { name: 'Dream Seeker', emoji: '🌙', desc: "Rest is your superpower, and we'll help you reclaim it. Your journey begins with sleep-focused sessions and a personalized wind-down routine.", colors: ['#6366f1', '#9333ea'] },
  focus: { name: 'Focus Finder', emoji: '🎯', desc: "Clarity and concentration are within reach. We'll build your focus muscle one session at a time with targeted mindfulness practices.", colors: ['#facc15', '#f97316'] },
  resilience: { name: 'Resilience Builder', emoji: '💪', desc: "You're here to grow stronger from the inside out. Your path includes emotional regulation tools, CBT exercises, and compassion practices.", colors: ['#fb7185', '#ec4899'] },
  emotions: { name: 'Emotional Explorer', emoji: '💙', desc: "You're brave enough to face your inner world. We'll guide you with compassionate practices to process, understand, and befriend your emotions.", colors: ['#60a5fa', '#6366f1'] },
  explore: { name: 'Mindful Explorer', emoji: '✨', desc: "Curiosity is the perfect place to start. We'll take you on a personalized tour of mindfulness — from basics to sleep to self-compassion — at your own pace.", colors: ['#a78bfa', '#a855f7'] },
};

const TOTAL_STEPS = 6;

export default function OnboardingScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [step, setStep] = useState(0);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [experience, setExperience] = useState('');
  const [mood, setMood] = useState<number>(0);
  const [time, setTime] = useState('');
  const [reminder, setReminder] = useState('');

  const persona = selectedGoals.length > 0 ? personas[selectedGoals[0]] : personas['explore'];

  const goNext = () => {
    if (step < TOTAL_STEPS - 1) {
      setStep(s => s + 1);
    } else {
      navigation.replace('WelcomeBreath');
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
                <Text style={styles.emojiIcon}>💭</Text>
                <Text style={styles.title}>How are you feeling lately?</Text>
                <Text style={styles.subtitle}>Be honest — this helps us personalize your experience</Text>
              </View>

              <View style={styles.moodContainer}>
                {moods.map((m) => {
                  const isSelected = mood === m.score;
                  return (
                    <TouchableOpacity
                      key={m.score}
                      style={[styles.moodItem, isSelected && styles.moodItemActive]}
                      onPress={() => {
                        setMood(m.score);
                        setTimeout(goNext, 300);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.moodEmoji, isSelected && styles.moodEmojiActive]}>
                        {m.emoji}
                      </Text>
                      <Text style={[styles.moodLabel, isSelected && styles.moodLabelActive]}>
                        {m.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {step === 3 && (
            <View style={styles.stepContainer}>
              <View style={styles.stepHeader}>
                <Text style={styles.emojiIcon}>⏱️</Text>
                <Text style={styles.title}>Time to commit?</Text>
                <Text style={styles.subtitle}>Even 5 minutes makes a real difference</Text>
              </View>

              <View style={styles.gridContainer}>
                {timeOptions.map(opt => {
                  const isSelected = time === opt.id;
                  return (
                    <TouchableOpacity
                      key={opt.id}
                      style={[styles.timeCard, isSelected && styles.cardActive]}
                      onPress={() => {
                        setTime(opt.id);
                        setTimeout(goNext, 300);
                      }}
                      activeOpacity={0.7}
                    >
                      {opt.recommended && (
                        <View style={styles.recommendedBadge}>
                          <Text style={styles.recommendedBadgeText}>Most popular</Text>
                        </View>
                      )}
                      <Text style={styles.timeCardEmoji}>{opt.emoji}</Text>
                      <Text style={[styles.timeCardLabel, isSelected && styles.cardLabelActive]}>{opt.label}</Text>
                      <Text style={[styles.timeCardDesc, isSelected && styles.timeCardDescActive]}>{opt.desc}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {step === 4 && (
            <View style={styles.stepContainer}>
              <View style={styles.stepHeader}>
                <Text style={styles.emojiIcon}>🔔</Text>
                <Text style={styles.title}>Best time for your reminder?</Text>
                <Text style={styles.subtitle}>We'll send a gentle nudge at your chosen time</Text>
              </View>

              <View style={styles.listContainer}>
                {reminderTimes.map(rt => {
                  const isSelected = reminder === rt.id;
                  return (
                    <TouchableOpacity
                      key={rt.id}
                      style={[styles.listCard, isSelected && styles.cardActive]}
                      onPress={() => {
                        setReminder(rt.id);
                        setTimeout(goNext, 300);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.listCardEmoji}>{rt.emoji}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.listCardLabel, isSelected && styles.cardLabelActive]}>{rt.label}</Text>
                        <Text style={[styles.reminderTimeText, isSelected && styles.timeCardDescActive]}>{rt.time}</Text>
                      </View>
                      {isSelected && <Text style={styles.listCheckIcon}>✓</Text>}
                    </TouchableOpacity>
                  );
                })}
              </View>
              <TouchableOpacity onPress={goNext} style={styles.skipButton}>
                <Text style={styles.skipButtonText}>Skip for now →</Text>
              </TouchableOpacity>
            </View>
          )}

          {step === 5 && (
            <View style={[styles.stepContainer, { alignItems: 'center' }]}>
              <LinearGradient colors={persona.colors} style={styles.personaAvatar}>
                <Text style={{ fontSize: 64 }}>{persona.emoji}</Text>
              </LinearGradient>

              <Text style={styles.personaPretitle}>YOU ARE A</Text>
              <Text style={styles.personaTitle}>{persona.name} {persona.emoji}</Text>
              <Text style={styles.personaDesc}>{persona.desc}</Text>

              <View style={styles.summaryBox}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryIcon}>🎯</Text>
                  <Text style={styles.summaryText}>Goals: <Text style={styles.summaryTextBold}>{selectedGoals.length} selected</Text></Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryIcon}>⏱️</Text>
                  <Text style={styles.summaryText}>Daily commitment: <Text style={styles.summaryTextBold}>{time || '10'} min</Text></Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryIcon}>🔔</Text>
                  <Text style={styles.summaryText}>Reminder: <Text style={styles.summaryTextBold}>{reminder || 'Morning'}</Text></Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.continueButton, (step === 0 && selectedGoals.length === 0) && styles.continueButtonDisabled, step === 5 && { backgroundColor: persona.colors[1] }]}
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
  listCardLabel: { fontSize: 16, fontWeight: '600', color: '#374151' },
  listCheckIcon: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  reminderTimeText: { fontSize: 14, color: '#9ca3af', marginTop: 4 },

  moodContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 24, paddingHorizontal: 10 },
  moodItem: { alignItems: 'center', flex: 1 },
  moodItemActive: { transform: [{ scale: 1.1 }] },
  moodEmoji: { fontSize: 36, marginBottom: 8, opacity: 0.8 },
  moodEmojiActive: { fontSize: 52, opacity: 1 },
  moodLabel: { fontSize: 12, fontWeight: '600', color: '#9ca3af' },
  moodLabelActive: { color: '#7c3aed' },

  timeCard: { width: '48%', backgroundColor: '#fff', borderRadius: 16, padding: 20, alignItems: 'center', borderWidth: 2, borderColor: '#f3f4f6', position: 'relative' },
  timeCardEmoji: { fontSize: 32, marginBottom: 12 },
  timeCardLabel: { fontSize: 16, fontWeight: 'bold', color: '#374151', marginBottom: 4 },
  timeCardDesc: { fontSize: 12, color: '#9ca3af', textAlign: 'center' },
  timeCardDescActive: { color: '#e9d5ff' },
  recommendedBadge: { position: 'absolute', top: -10, backgroundColor: '#f97316', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, zIndex: 10 },
  recommendedBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },

  skipButton: { marginTop: 24, alignItems: 'center', padding: 12 },
  skipButtonText: { color: '#9ca3af', fontSize: 15, fontWeight: '600' },

  personaAvatar: { width: 128, height: 128, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 15, elevation: 8 },
  personaPretitle: { fontSize: 12, fontWeight: 'bold', color: '#8b5cf6', letterSpacing: 1, marginBottom: 4 },
  personaTitle: { fontSize: 32, fontWeight: 'bold', color: '#111827', marginBottom: 16, textAlign: 'center' },
  personaDesc: { fontSize: 16, color: '#6b7280', textAlign: 'center', lineHeight: 24, marginBottom: 32, paddingHorizontal: 16 },
  
  summaryBox: { backgroundColor: '#fff', width: '100%', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#f3f4f6' },
  summaryRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  summaryIcon: { fontSize: 18, marginRight: 12 },
  summaryText: { fontSize: 15, color: '#4b5563' },
  summaryTextBold: { fontWeight: 'bold', color: '#111827' },

  footer: { padding: 24, paddingTop: 8 },
  continueButton: { backgroundColor: '#7c3aed', paddingVertical: 16, borderRadius: 16, alignItems: 'center', shadowColor: '#7c3aed', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  continueButtonDisabled: { opacity: 0.4, shadowOpacity: 0 },
  continueText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
