import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

export default function ProgressScreen() {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const activeDays = [true, true, true, false, false, false, false];

  const badges = [
    { id: 1, title: 'Early Bird', icon: 'sun', color: '#1CB0F6', shadow: '#1899D6' },
    { id: 2, title: '3 Day Streak', icon: 'fire', color: '#FFC800', shadow: '#E5B400' },
    { id: 3, title: 'Zen Master', icon: 'leaf', color: '#58CC02', shadow: '#58A700' },
    { id: 4, title: 'Night Owl', icon: 'moon', color: '#9356D6', shadow: '#7743CE' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* Header */}
        <View style={styles.headerCard}>
          <View style={styles.headerItem}>
            <FontAwesome5 name="fire" size={56} color="#FFC800" />
            <Text style={styles.streakValue}>3</Text>
            <Text style={styles.headerLabel}>Day Streak</Text>
          </View>
          <View style={styles.headerDivider} />
          <View style={styles.headerItem}>
            <FontAwesome5 name="bolt" size={56} color="#1CB0F6" />
            <Text style={styles.xpValue}>450</Text>
            <Text style={styles.headerLabel}>Total XP</Text>
          </View>
        </View>

        {/* Weekly Calendar */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Progress</Text>
          <View style={styles.calendarContainer}>
            {days.map((day, idx) => {
              const isActive = activeDays[idx];
              return (
                <View 
                  key={idx} 
                  style={[
                    styles.dayNode, 
                    isActive ? styles.dayNodeActive : styles.dayNodeInactive
                  ]}
                >
                  {isActive ? (
                    <FontAwesome5 name="check" size={20} color="#FFFFFF" />
                  ) : (
                    <Text style={styles.dayTextInactive}>{day}</Text>
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* Achievements Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Badges</Text>
          <View style={styles.badgesGrid}>
            {badges.map(badge => (
              <View key={badge.id} style={styles.badgeCard}>
                <View style={[
                  styles.badgeIconWrapper, 
                  { backgroundColor: badge.color, borderColor: badge.shadow }
                ]}>
                  <FontAwesome5 name={badge.icon} size={36} color="#FFFFFF" solid />
                </View>
                <Text style={styles.badgeTitle}>{badge.title}</Text>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    padding: 20,
    paddingBottom: 40,
    gap: 32,
  },
  headerCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderBottomWidth: 8,
    borderBottomColor: '#E5E5E5',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  headerItem: {
    alignItems: 'center',
    flex: 1,
  },
  headerDivider: {
    width: 2,
    height: '80%',
    backgroundColor: '#E5E5E5',
    borderRadius: 1,
  },
  streakValue: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFC800',
    marginTop: 12,
  },
  xpValue: {
    fontSize: 36,
    fontWeight: '900',
    color: '#1CB0F6',
    marginTop: 12,
  },
  headerLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: '#AFAFAF',
    marginTop: 4,
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#4B4B4B',
    marginLeft: 4,
  },
  calendarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderBottomWidth: 6,
    borderBottomColor: '#E5E5E5',
    padding: 16,
  },
  dayNode: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  dayNodeActive: {
    backgroundColor: '#58CC02',
    borderColor: '#58CC02',
    borderBottomWidth: 4,
    borderBottomColor: '#58A700',
  },
  dayNodeInactive: {
    backgroundColor: '#E5E5E5',
    borderColor: '#E5E5E5',
    borderBottomWidth: 4,
    borderBottomColor: '#D1D1D1',
  },
  dayTextInactive: {
    fontSize: 16,
    fontWeight: '800',
    color: '#AFAFAF',
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  badgeCard: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderBottomWidth: 5,
    borderBottomColor: '#E5E5E5',
    padding: 20,
    alignItems: 'center',
  },
  badgeIconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderBottomWidth: 5,
    marginBottom: 16,
  },
  badgeTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#4B4B4B',
    textAlign: 'center',
  },
});
