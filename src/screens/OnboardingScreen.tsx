import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useUserStore } from '../store/useUserStore';

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
  stress: { name: 'Stress Soother', emoji: '🌿', desc: "You're seeking peace amid life's demands. We'll start with calming breathwork and gentle stress-release practices tailored just for you.", colors: ['#58CC02', '#58A700'] },
  sleep: { name: 'Dream Seeker', emoji: '🌙', desc: "Rest is your superpower, and we'll help you reclaim it. Your journey begins with sleep-focused sessions and a personalized wind-down routine.", colors: ['#1CB0F6', '#1899D6'] },
  focus: { name: 'Focus Finder', emoji: '🎯', desc: "Clarity and concentration are within reach. We'll build your focus muscle one session at a time with targeted mindfulness practices.", colors: ['#FFC800', '#E5B400'] },
  resilience: { name: 'Resilience Builder', emoji: '💪', desc: "You're here to grow stronger from the inside out. Your path includes emotional regulation tools, CBT exercises, and compassion practices.", colors: ['#FF4B4B', '#E54343'] },
  emotions: { name: 'Emotional Explorer', emoji: '💙', desc: "You're brave enough to face your inner world. We'll guide you with compassionate practices to process, understand, and befriend your emotions.", colors: ['#1CB0F6', '#1899D6'] },
  explore: { name: 'Mindful Explorer', emoji: '✨', desc: "Curiosity is the perfect place to start. We'll take you on a personalized tour of mindfulness — from basics to sleep to self-compassion — at your own pace.", colors: ['#CE82FF', '#B874E5'] },
};

const TOTAL_STEPS = 6;

export default function OnboardingScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const completeOnboarding = useUserStore((s) => s.completeOnboarding);
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [experience, setExperience] = useState('');
  const [mood, setMood] = useState<number>(0);
  const [time, setTime] = useState('');
  const [reminder, setReminder] = useState('');

  const persona = selectedGoals.length > 0 ? personas[selectedGoals[0]] : personas['explore'];

  const isSelectionEmpty = () => {
    switch (step) {
      case 0: return selectedGoals.length === 0;
      case 1: return experience === '';
      case 2: return mood === 0;
      case 3: return time === '';
      case 4: return reminder === '';
      default: return false;
    }
  };

  const goNext = () => {
    if (step < TOTAL_STEPS - 1) {
      setStep(s => s + 1);
    } else {
      completeOnboarding();
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
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1, paddingTop: insets.top + 10 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={goPrev} style={styles.backButton}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <View style={styles.progressContainer}>
            <View style={[styles.progressFill, { width: `${((step + 1) / TOTAL_STEPS) * 100}%` }]} />
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content} bounces={false}>
          {step === 0 && (
            <View style={styles.stepContainer}>
              <View style={styles.stepHeader}>
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
                      activeOpacity={0.9}
                    >
                      <Text style={styles.cardEmoji}>{goal.emoji}</Text>
                      <Text style={[styles.cardLabel, isSelected && styles.cardLabelActive]}>{goal.label}</Text>
                      {isSelected && <View style={styles.checkIconContainer}><Text style={styles.checkIcon}>✓</Text></View>}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {step === 1 && (
            <View style={styles.stepContainer}>
              <View style={styles.stepHeader}>
                <Text style={styles.title}>Your experience level?</Text>
                <Text style={styles.subtitle}>No right or wrong answer</Text>
              </View>

              <View style={styles.listContainer}>
                {experienceLevels.map(level => {
                  const isSelected = experience === level.id;
                  return (
                    <TouchableOpacity
                      key={level.id}
                      style={[styles.listCard, isSelected && styles.listCardActive]}
                      onPress={() => setExperience(level.id)}
                      activeOpacity={0.9}
                    >
                      <Text style={styles.listCardEmoji}>{level.emoji}</Text>
                      <Text style={[styles.listCardLabel, isSelected && styles.cardLabelActive]}>{level.label}</Text>
                      {isSelected && <View style={styles.listCheckIconContainer}><Text style={styles.checkIcon}>✓</Text></View>}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {step === 2 && (
            <View style={styles.stepContainer}>
              <View style={styles.stepHeader}>
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
                      onPress={() => setMood(m.score)}
                      activeOpacity={0.9}
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
                <Text style={styles.title}>Time to commit?</Text>
                <Text style={styles.subtitle}>Even 5 minutes makes a real difference</Text>
              </View>

              <View style={styles.gridContainer}>
                {timeOptions.map(opt => {
                  const isSelected = time === opt.id;
                  return (
                    <TouchableOpacity
                      key={opt.id}
                      style={[styles.timeCard, isSelected && styles.timeCardActive]}
                      onPress={() => setTime(opt.id)}
                      activeOpacity={0.9}
                    >
                      {opt.recommended && (
                        <View style={styles.recommendedBadge}>
                          <Text style={styles.recommendedBadgeText}>RECOMMENDED</Text>
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
                <Text style={styles.title}>Best time for your reminder?</Text>
                <Text style={styles.subtitle}>We'll send a gentle nudge at your chosen time</Text>
              </View>

              <View style={styles.listContainer}>
                {reminderTimes.map(rt => {
                  const isSelected = reminder === rt.id;
                  return (
                    <TouchableOpacity
                      key={rt.id}
                      style={[styles.listCard, isSelected && styles.listCardActive]}
                      onPress={() => setReminder(rt.id)}
                      activeOpacity={0.9}
                    >
                      <Text style={styles.listCardEmoji}>{rt.emoji}</Text>
                      <Text style={[styles.listCardLabel, isSelected && styles.cardLabelActive]}>{rt.label}</Text>
                      <Text style={[styles.reminderTimeText, isSelected && styles.timeCardDescActive]}>{rt.time}</Text>
                      {isSelected && <View style={styles.listCheckIconContainer}><Text style={styles.checkIcon}>✓</Text></View>}
                    </TouchableOpacity>
                  );
                })}
              </View>
              <TouchableOpacity onPress={goNext} style={styles.skipButton}>
                <Text style={styles.skipButtonText}>SKIP</Text>
              </TouchableOpacity>
            </View>
          )}

          {step === 5 && (
            <View style={[styles.stepContainer, { alignItems: 'center' }]}>
              <LinearGradient colors={persona.colors} style={styles.personaAvatar}>
                <Text style={{ fontSize: 64 }}>{persona.emoji}</Text>
              </LinearGradient>

              <Text style={styles.personaPretitle}>YOUR PROFILE</Text>
              <Text style={styles.personaTitle}>{persona.name}</Text>
              <Text style={styles.personaDesc}>{persona.desc}</Text>

              <View style={styles.summaryBox}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryIcon}>🎯</Text>
                  <Text style={styles.summaryText}>Goals: <Text style={styles.summaryTextBold}>{selectedGoals.length} selected</Text></Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryIcon}>⏱️</Text>
                  <Text style={styles.summaryText}>Commitment: <Text style={styles.summaryTextBold}>{time || '10'} min / day</Text></Text>
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
            style={[styles.continueButton, isSelectionEmpty() && styles.continueButtonDisabled]}
            disabled={isSelectionEmpty()}
            onPress={goNext}
            activeOpacity={0.8}
          >
            <Text style={[styles.continueText, isSelectionEmpty() && styles.continueTextDisabled]}>{step === TOTAL_STEPS - 1 ? 'CONTINUE' : 'CONTINUE'}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8 },
  backButton: { marginRight: 16, padding: 8 },
  backText: { color: '#AFAFAF', fontSize: 24, fontWeight: '900' },
  progressContainer: { flex: 1, height: 16, backgroundColor: '#E5E5E5', borderRadius: 8, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#58CC02', borderRadius: 8 },
  
  content: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 40 },
  stepContainer: { flex: 1 },
  stepHeader: { marginBottom: 32 },
  title: { fontSize: 28, fontWeight: '800', color: '#4B4B4B', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#AFAFAF', textAlign: 'center', fontWeight: '600' },
  
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between', width: '100%' },
  card: { width: '48%', backgroundColor: '#FFFFFF', borderRadius: 16, marginBottom: 15, padding: 16, alignItems: 'center', justifyContent: 'center', flexDirection: 'column', borderTopWidth: 2, borderLeftWidth: 2, borderRightWidth: 2, borderBottomWidth: 6, borderTopColor: '#E5E5E5', borderLeftColor: '#E5E5E5', borderRightColor: '#E5E5E5', borderBottomColor: '#CCCCCC' },
  cardActive: { backgroundColor: '#E5F6D3', borderTopColor: '#58CC02', borderLeftColor: '#58CC02', borderRightColor: '#58CC02', borderBottomColor: '#4BA100' },
  cardEmoji: { fontSize: 32, marginBottom: 12 },
  cardLabel: { fontSize: 15, fontWeight: '800', color: '#4B4B4B', textAlign: 'center' },
  cardLabelActive: { color: '#58CC02' },
  checkIconContainer: { position: 'absolute', top: 8, right: 8, backgroundColor: '#58CC02', width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  checkIcon: { color: '#FFFFFF', fontSize: 14, fontWeight: '900' },

  listContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between', width: '100%' },
  listCard: { width: '48%', backgroundColor: '#FFFFFF', borderRadius: 16, marginBottom: 15, padding: 16, alignItems: 'center', justifyContent: 'center', flexDirection: 'column', borderTopWidth: 2, borderLeftWidth: 2, borderRightWidth: 2, borderBottomWidth: 6, borderTopColor: '#E5E5E5', borderLeftColor: '#E5E5E5', borderRightColor: '#E5E5E5', borderBottomColor: '#CCCCCC' },
  listCardActive: { backgroundColor: '#E5F6D3', borderTopColor: '#58CC02', borderLeftColor: '#58CC02', borderRightColor: '#58CC02', borderBottomColor: '#4BA100' },
  listCardEmoji: { fontSize: 28, marginBottom: 8 },
  listCardLabel: { fontSize: 16, fontWeight: '800', color: '#4B4B4B', textAlign: 'center' },
  listCheckIconContainer: { position: 'absolute', top: 8, right: 8, backgroundColor: '#58CC02', width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  reminderTimeText: { fontSize: 14, color: '#AFAFAF', marginTop: 4, fontWeight: '700', textAlign: 'center' },

  moodContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 24, width: '100%' },
  moodItem: { width: '47%', backgroundColor: '#FFFFFF', borderRadius: 16, marginBottom: 15, padding: 16, alignItems: 'center', justifyContent: 'center', flexDirection: 'column', borderTopWidth: 2, borderLeftWidth: 2, borderRightWidth: 2, borderBottomWidth: 6, borderTopColor: '#E5E5E5', borderLeftColor: '#E5E5E5', borderRightColor: '#E5E5E5', borderBottomColor: '#CCCCCC' },
  moodItemActive: { backgroundColor: '#E5F6D3', borderTopColor: '#58CC02', borderLeftColor: '#58CC02', borderRightColor: '#58CC02', borderBottomColor: '#4BA100' },
  moodEmoji: { fontSize: 28, marginBottom: 8 },
  moodEmojiActive: { fontSize: 32 },
  moodLabel: { fontSize: 12, fontWeight: '800', color: '#AFAFAF', textAlign: 'center' },
  moodLabelActive: { color: '#58CC02' },

  timeCard: { width: '48%', backgroundColor: '#FFFFFF', borderRadius: 16, marginBottom: 15, padding: 16, alignItems: 'center', justifyContent: 'center', flexDirection: 'column', borderTopWidth: 2, borderLeftWidth: 2, borderRightWidth: 2, borderBottomWidth: 6, borderTopColor: '#E5E5E5', borderLeftColor: '#E5E5E5', borderRightColor: '#E5E5E5', borderBottomColor: '#CCCCCC' },
  timeCardActive: { backgroundColor: '#E5F6D3', borderTopColor: '#58CC02', borderLeftColor: '#58CC02', borderRightColor: '#58CC02', borderBottomColor: '#4BA100' },
  timeCardEmoji: { fontSize: 32, marginBottom: 12 },
  timeCardLabel: { fontSize: 16, fontWeight: '800', color: '#4B4B4B', marginBottom: 4, textAlign: 'center' },
  timeCardDesc: { fontSize: 13, color: '#AFAFAF', textAlign: 'center', fontWeight: '600' },
  timeCardDescActive: { color: '#58CC02' },
  recommendedBadge: { position: 'absolute', top: -12, backgroundColor: '#FFC800', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, borderWidth: 2, borderColor: '#FFFFFF', zIndex: 10, borderBottomWidth: 5, borderBottomColor: '#D7A800' },
  recommendedBadgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '900' },

  skipButton: { marginTop: 24, alignItems: 'center', padding: 12 },
  skipButtonText: { color: '#AFAFAF', fontSize: 15, fontWeight: '800' },

  personaAvatar: { width: 120, height: 120, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: 24, borderWidth: 2, borderColor: '#E5E5E5', borderBottomWidth: 8 },
  personaPretitle: { fontSize: 14, fontWeight: '900', color: '#AFAFAF', letterSpacing: 1, marginBottom: 8 },
  personaTitle: { fontSize: 32, fontWeight: '900', color: '#4B4B4B', marginBottom: 16, textAlign: 'center' },
  personaDesc: { fontSize: 16, color: '#AFAFAF', textAlign: 'center', lineHeight: 24, marginBottom: 32, paddingHorizontal: 16, fontWeight: '600' },
  
  summaryBox: { backgroundColor: '#FFFFFF', width: '100%', borderRadius: 20, padding: 24, borderWidth: 2, borderColor: '#E5E5E5', borderBottomWidth: 5, borderBottomColor: '#E5E5E5' },
  summaryRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  summaryIcon: { fontSize: 24, marginRight: 16 },
  summaryText: { fontSize: 16, color: '#AFAFAF', fontWeight: '700' },
  summaryTextBold: { fontWeight: '900', color: '#4B4B4B' },

  footer: { padding: 24, paddingTop: 16, backgroundColor: '#FFFFFF', borderTopWidth: 2, borderTopColor: '#E5E5E5' },
  continueButton: { backgroundColor: '#58CC02', paddingVertical: 18, borderRadius: 16, alignItems: 'center', borderBottomWidth: 5, borderBottomColor: '#58A700' },
  continueButtonDisabled: { backgroundColor: '#E5E5E5', borderBottomColor: '#D3D3D3' },
  continueText: { color: '#FFFFFF', fontSize: 18, fontWeight: '900' },
  continueTextDisabled: { color: '#AFAFAF' },
});
