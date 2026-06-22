import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, ActivityIndicator, Platform, StatusBar } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../lib/supabase';

export default function ProgressScreen() {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const [activeDays, setActiveDays] = useState([false, false, false, false, false, false, false]);
  const [totalXP, setTotalXP] = useState(0);
  const [streakValue, setStreakValue] = useState(0);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchProgress = async () => {
        try {
          setLoading(true);
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const { data, error } = await supabase
            .from('mood_logs')
            .select('created_at')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (error) throw error;
          if (!isActive) return;

          const logs = data || [];
          
          // 1. Calculate Total XP
          setTotalXP(logs.length * 10);

          // 2. Setup date math bounds
          const now = new Date();
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

          // Weekly Calendar bounds (0 = Mon, 6 = Sun)
          const currentDayOfWeek = (today.getDay() + 6) % 7; 
          const startOfWeek = new Date(today);
          startOfWeek.setDate(today.getDate() - currentDayOfWeek);
          
          const newActiveDays = [false, false, false, false, false, false, false];
          
          const logDates = logs.map(log => {
             const d = new Date(log.created_at);
             return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
          });
          
          // Normalize to midnight UTC equivalent epoch arrays
          const uniqueLogDates = Array.from(new Set(logDates));

          // 3. Populate Weekly Calendar array
          for (let i = 0; i < 7; i++) {
            const dayToCheck = new Date(startOfWeek);
            dayToCheck.setDate(startOfWeek.getDate() + i);
            if (uniqueLogDates.includes(dayToCheck.getTime())) {
              newActiveDays[i] = true;
            }
          }
          setActiveDays(newActiveDays);

          // 4. Calculate Streak
          let streak = 0;
          let dateToCheck = new Date(today);

          if (uniqueLogDates.includes(today.getTime())) {
             streak++;
             dateToCheck.setDate(dateToCheck.getDate() - 1);
          } else {
             // If user hasn't logged today, check if streak is alive from yesterday
             dateToCheck.setDate(dateToCheck.getDate() - 1);
             if (uniqueLogDates.includes(dateToCheck.getTime())) {
               streak++;
               dateToCheck.setDate(dateToCheck.getDate() - 1);
             }
          }

          // Count consecutively backwards
          while (uniqueLogDates.includes(dateToCheck.getTime())) {
             streak++;
             dateToCheck.setDate(dateToCheck.getDate() - 1);
          }

          setStreakValue(streak);

        } catch (error) {
          console.error('Error fetching progress:', error);
        } finally {
          if (isActive) setLoading(false);
        }
      };

      fetchProgress();

      return () => { isActive = false; };
    }, [])
  );

  const badges = [
    { id: 1, title: 'Early Bird', icon: 'sun', color: '#1CB0F6', shadow: '#1899D6' },
    { id: 2, title: '3 Day Streak', icon: 'fire', color: '#FFC800', shadow: '#E5B400' },
    { id: 3, title: 'Zen Master', icon: 'leaf', color: '#58CC02', shadow: '#58A700' },
    { id: 4, title: 'Night Owl', icon: 'moon', color: '#9356D6', shadow: '#7743CE' },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}>
      <ScrollView contentContainerStyle={[styles.container, { paddingBottom: 120 }]}>
        
        {/* Header */}
        <View style={styles.headerCard}>
          <View style={styles.headerItem}>
            <FontAwesome5 name="fire" size={56} color="#FFC800" />
            <Text style={styles.streakValue}>{loading ? '-' : streakValue}</Text>
            <Text style={styles.headerLabel}>Day Streak</Text>
          </View>
          <View style={styles.headerDivider} />
          <View style={styles.headerItem}>
            <FontAwesome5 name="bolt" size={56} color="#1CB0F6" />
            <Text style={styles.xpValue}>{loading ? '-' : totalXP}</Text>
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
    justifyContent: 'space-evenly',
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
