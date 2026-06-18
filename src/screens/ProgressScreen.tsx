import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';

export default function ProgressScreen() {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const activeDays = [true, true, true, false, false, false, false];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Progress</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.streakCard}>
          <View style={styles.streakHeader}>
            <Text style={styles.streakEmoji}>🔥</Text>
            <Text style={styles.streakCount}>3</Text>
            <Text style={styles.streakLabel}>Day Streak!</Text>
          </View>
          <View style={styles.calendar}>
            {days.map((day, idx) => (
              <View key={idx} style={[styles.dayCircle, activeDays[idx] && styles.dayCircleActive]}>
                {activeDays[idx] ? <Text style={styles.check}>✓</Text> : <Text style={styles.dayText}>{day}</Text>}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.xpCard}>
          <Text style={styles.xpTitle}>Weekly XP</Text>
          <View style={styles.xpBarContainer}>
            <View style={styles.xpFill} />
          </View>
          <Text style={styles.xpText}>450 / 1000 XP</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { padding: 24, paddingTop: 16, paddingBottom: 16, borderBottomWidth: 2, borderBottomColor: '#E5E5E5' },
  headerTitle: { fontSize: 28, fontWeight: '900', color: '#4B4B4B' },
  content: { padding: 24, gap: 24 },
  streakCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderBottomWidth: 6,
    borderBottomColor: '#E5E5E5'
  },
  streakHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  streakEmoji: { fontSize: 48, marginRight: 12 },
  streakCount: { fontSize: 48, fontWeight: '900', color: '#FFC800', marginRight: 8 },
  streakLabel: { fontSize: 20, fontWeight: '800', color: '#AFAFAF', flex: 1, marginTop: 12 },
  calendar: { flexDirection: 'row', justifyContent: 'space-between' },
  dayCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F7F7F7', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#E5E5E5' },
  dayCircleActive: { backgroundColor: '#FFC800', borderColor: '#E5B400' },
  check: { color: '#FFFFFF', fontWeight: '900', fontSize: 16 },
  dayText: { color: '#AFAFAF', fontWeight: '800', fontSize: 14 },
  
  xpCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    borderWidth: 2,
    borderColor: '#1CB0F6',
    borderBottomWidth: 6,
    borderBottomColor: '#1899D6'
  },
  xpTitle: { fontSize: 20, fontWeight: '900', color: '#1CB0F6', marginBottom: 16 },
  xpBarContainer: { height: 24, backgroundColor: '#E5E5E5', borderRadius: 12, overflow: 'hidden', marginBottom: 12 },
  xpFill: { width: '45%', height: '100%', backgroundColor: '#FFC800', borderRadius: 12 },
  xpText: { fontSize: 16, fontWeight: '800', color: '#4B4B4B', textAlign: 'center' }
});
