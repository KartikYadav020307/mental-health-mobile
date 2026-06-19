import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const menuItems = [
    { id: 'goals', label: 'My Goals', icon: 'bullseye', color: '#58CC02' },
    { id: 'preferences', label: 'Preferences', icon: 'cog', color: '#1CB0F6' },
    { id: 'subscription', label: 'Subscription', icon: 'star', color: '#FFC800' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header Title Bar */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* User Header Profile Card */}
        <View style={styles.userHeaderContainer}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarInner}>
              <FontAwesome5 name="user-alt" size={42} color="#AFAFAF" solid />
            </View>
          </View>
          <Text style={styles.displayName}>Alex</Text>
          <View style={styles.freePlanTag}>
            <Text style={styles.freePlanText}>Free Plan</Text>
          </View>
        </View>

        {/* Quick Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: '#E8F6FE' }]}>
              <FontAwesome5 name="spa" size={20} color="#1CB0F6" solid />
            </View>
            <Text style={styles.statValue}>18</Text>
            <Text style={styles.statLabel}>Total Sessions</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: '#FFF5D6' }]}>
              <FontAwesome5 name="fire" size={20} color="#FFC800" solid />
            </View>
            <Text style={styles.statValue}>7 Days</Text>
            <Text style={styles.statLabel}>Longest Streak</Text>
          </View>
        </View>

        {/* Settings List Vertical Stack */}
        <View style={styles.settingsContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity key={item.id} style={styles.menuButton} activeOpacity={0.8}>
              <View style={[styles.menuIconContainer, { backgroundColor: `${item.color}20` }]}>
                <FontAwesome5 name={item.icon} size={18} color={item.color} solid />
              </View>
              <Text style={styles.menuButtonText}>{item.label}</Text>
              <FontAwesome5 name="chevron-right" size={14} color="#AFAFAF" />
            </TouchableOpacity>
          ))}

          {/* Log Out Button - Soft Red Theme */}
          <TouchableOpacity style={[styles.menuButton, styles.logOutButton]} activeOpacity={0.8}>
            <View style={styles.logOutIconContainer}>
              <FontAwesome5 name="sign-out-alt" size={18} color="#FF4B4B" />
            </View>
            <Text style={[styles.menuButtonText, styles.logOutText]}>Log Out</Text>
            <FontAwesome5 name="chevron-right" size={14} color="#FF9F9F" />
          </TouchableOpacity>
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
    paddingBottom: 40,
  },
  userHeaderContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    width: 106,
    height: 106,
    borderRadius: 53,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderBottomWidth: 5,
    borderBottomColor: '#D1D1D1',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarInner: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  displayName: {
    fontSize: 24,
    fontWeight: '900',
    color: '#4B4B4B',
    marginBottom: 8,
  },
  freePlanTag: {
    backgroundColor: '#1CB0F6',
    borderColor: '#1CB0F6',
    borderBottomColor: '#1899D6',
    borderWidth: 2,
    borderBottomWidth: 3,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  freePlanText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderBottomWidth: 5,
    borderBottomColor: '#D1D1D1',
    padding: 16,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#4B4B4B',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#AFAFAF',
    textAlign: 'center',
  },
  settingsContainer: {
    width: '100%',
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderBottomWidth: 5,
    borderBottomColor: '#D1D1D1',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 16,
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
  logOutButton: {
    backgroundColor: '#FFECEC',
    borderColor: '#FFC5C5',
    borderBottomColor: '#FF9F9F',
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
