import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useUserStore } from '../store/useUserStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';

const XP_PER_LEVEL = 100;

export default function ProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();

  const totalXP = useUserStore((s) => s.totalXP);
  const currentStreak = useUserStore((s) => s.currentStreak);
  const totalSessions = useUserStore((s) => s.totalSessions);
  const minutesMeditated = useUserStore((s) => s.minutesMeditated);

  const level = Math.floor(totalXP / XP_PER_LEVEL) + 1;
  const xpInCurrentLevel = totalXP % XP_PER_LEVEL;
  const levelProgress = xpInCurrentLevel / XP_PER_LEVEL;

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      await AsyncStorage.clear();
      navigation.reset({ index: 0, routes: [{ name: 'Auth' }] });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const statCards = [
    { label: 'Day Streak', value: `${currentStreak}`, emoji: '🔥', color: '#FFC800', shadowColor: '#CC9F00' },
    { label: 'Total XP', value: `${totalXP}`, emoji: '⭐', color: '#58CC02', shadowColor: '#458A00' },
    { label: 'Sessions', value: `${totalSessions}`, emoji: '🧘', color: '#1CB0F6', shadowColor: '#1489BF' },
    { label: 'Minutes', value: `${minutesMeditated}`, emoji: '⏱️', color: '#CE82FF', shadowColor: '#9E5FCC' },
  ];

  const menuItems = [
    { id: 'goals', label: 'My Goals', icon: 'bullseye', color: '#58CC02' },
    { id: 'preferences', label: 'Preferences', icon: 'cog', color: '#1CB0F6' },
    { id: 'subscription', label: 'Subscription', icon: 'star', color: '#FFC800' },
  ];

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top + 10 }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarOuter}>
            <View style={styles.avatarInner}>
              <Text style={styles.avatarEmoji}>🧑‍🚀</Text>
            </View>
          </View>
          <Text style={styles.displayName}>Your Stats</Text>
          <View style={styles.levelBadgeOuter}>
            <View style={styles.levelBadgeInner}>
              <Text style={styles.levelBadgeText}>LEVEL {level}</Text>
            </View>
          </View>
        </View>

        {/* Level Progress Bar */}
        <View style={styles.levelBarSection}>
          <View style={styles.levelBarHeader}>
            <Text style={styles.levelBarLabel}>Level {level}</Text>
            <Text style={styles.levelBarXP}>{xpInCurrentLevel} / {XP_PER_LEVEL} XP</Text>
          </View>
          <View style={styles.levelBarOuter}>
            <View style={styles.levelBarTrack}>
              <View style={[styles.levelBarFill, { width: `${Math.max(levelProgress * 100, 2)}%` }]} />
            </View>
          </View>
          <Text style={styles.levelBarHint}>
            {XP_PER_LEVEL - xpInCurrentLevel} XP to Level {level + 1}
          </Text>
        </View>

        {/* Stats Grid 2x2 */}
        <View style={styles.statsGrid}>
          {statCards.map((stat) => (
            <View key={stat.label} style={[styles.statCardOuter, { backgroundColor: stat.shadowColor }]}>
              <View style={[styles.statCardInner, { backgroundColor: stat.color }]}>
                <Text style={styles.statEmoji}>{stat.emoji}</Text>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Settings Menu */}
        <View style={styles.settingsContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity key={item.id} style={styles.menuOuter} activeOpacity={0.8}>
              <View style={styles.menuInner}>
                <View style={[styles.menuIconContainer, { backgroundColor: `${item.color}20` }]}>
                  <FontAwesome5 name={item.icon} size={18} color={item.color} solid />
                </View>
                <Text style={styles.menuButtonText}>{item.label}</Text>
                <FontAwesome5 name="chevron-right" size={14} color="#AFAFAF" />
              </View>
            </TouchableOpacity>
          ))}

          {/* Log Out */}
          <TouchableOpacity style={styles.logOutOuter} activeOpacity={0.8} onPress={handleLogout}>
            <View style={styles.logOutInner}>
              <View style={styles.logOutIconContainer}>
                <FontAwesome5 name="sign-out-alt" size={18} color="#FF4B4B" />
              </View>
              <Text style={[styles.menuButtonText, styles.logOutText]}>Log Out</Text>
              <FontAwesome5 name="chevron-right" size={14} color="#FF9F9F" />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#4B4B4B',
  },
  container: {
    padding: 24,
    paddingBottom: 130,
  },

  // ── Avatar ──────────────────────────────────────────────────────────
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarOuter: {
    width: 110,
    height: 115,
    borderRadius: 55,
    backgroundColor: '#458A00',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarInner: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#58CC02',
    borderWidth: 3,
    borderColor: '#78DC28',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 52,
  },
  displayName: {
    fontSize: 26,
    fontWeight: '900',
    color: '#4B4B4B',
    marginBottom: 10,
  },
  levelBadgeOuter: {
    backgroundColor: '#CC9F00',
    borderRadius: 14,
    paddingBottom: 4,
  },
  levelBadgeInner: {
    backgroundColor: '#FFC800',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderWidth: 2,
    borderColor: '#FFD84D',
  },
  levelBadgeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1,
  },

  // ── Level Progress Bar ──────────────────────────────────────────────
  levelBarSection: {
    marginBottom: 28,
  },
  levelBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  levelBarLabel: {
    fontSize: 16,
    fontWeight: '900',
    color: '#4B4B4B',
  },
  levelBarXP: {
    fontSize: 14,
    fontWeight: '800',
    color: '#AFAFAF',
  },
  levelBarOuter: {
    backgroundColor: '#458A00',
    borderRadius: 10,
    paddingBottom: 4,
  },
  levelBarTrack: {
    height: 20,
    backgroundColor: '#E5E5E5',
    borderRadius: 10,
    overflow: 'hidden',
  },
  levelBarFill: {
    height: '100%',
    backgroundColor: '#58CC02',
    borderRadius: 10,
  },
  levelBarHint: {
    fontSize: 13,
    fontWeight: '700',
    color: '#AFAFAF',
    textAlign: 'center',
    marginTop: 8,
  },

  // ── Stats Grid ──────────────────────────────────────────────────────
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  statCardOuter: {
    width: '47%',
    borderRadius: 16,
    paddingBottom: 5,
    marginBottom: 14,
  },
  statCardInner: {
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  statEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.85)',
  },

  // ── Settings Menu ───────────────────────────────────────────────────
  settingsContainer: {
    width: '100%',
  },
  menuOuter: {
    backgroundColor: '#D1D1D1',
    borderRadius: 16,
    paddingBottom: 4,
    marginBottom: 12,
  },
  menuInner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: '#E5E5E5',
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuButtonText: {
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    color: '#4B4B4B',
  },
  logOutOuter: {
    backgroundColor: '#CC3333',
    borderRadius: 16,
    paddingBottom: 4,
    marginBottom: 12,
  },
  logOutInner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFECEC',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: '#FFC5C5',
  },
  logOutIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FFD8D8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  logOutText: {
    color: '#FF4B4B',
  },
});
