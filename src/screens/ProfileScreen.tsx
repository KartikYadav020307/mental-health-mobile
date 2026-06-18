import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarEmoji}>😎</Text>
          </View>
          <Text style={styles.name}>Alex</Text>
          <Text style={styles.username}>@mindful_alex</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, { borderColor: '#FFC800', borderBottomColor: '#E5B400' }]}>
            <Text style={styles.statIcon}>🔥</Text>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={[styles.statCard, { borderColor: '#1CB0F6', borderBottomColor: '#1899D6' }]}>
            <Text style={styles.statIcon}>⚡</Text>
            <Text style={styles.statValue}>450</Text>
            <Text style={styles.statLabel}>Total XP</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
          <Text style={styles.actionButtonText}>EDIT PROFILE</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingsButton} activeOpacity={0.8}>
          <Text style={styles.settingsButtonText}>SETTINGS</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { padding: 24, paddingTop: 16, paddingBottom: 16, borderBottomWidth: 2, borderBottomColor: '#E5E5E5' },
  headerTitle: { fontSize: 28, fontWeight: '900', color: '#4B4B4B' },
  content: { padding: 24 },
  
  profileHeader: { alignItems: 'center', marginBottom: 32 },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#E5F6D3', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#58CC02', borderBottomWidth: 6, marginBottom: 16 },
  avatarEmoji: { fontSize: 48 },
  name: { fontSize: 24, fontWeight: '900', color: '#4B4B4B', marginBottom: 4 },
  username: { fontSize: 16, fontWeight: '700', color: '#AFAFAF' },

  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 },
  statCard: { width: '47%', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, borderWidth: 2, borderBottomWidth: 5, alignItems: 'center' },
  statIcon: { fontSize: 24, marginBottom: 8 },
  statValue: { fontSize: 20, fontWeight: '900', color: '#4B4B4B', marginBottom: 4 },
  statLabel: { fontSize: 14, fontWeight: '700', color: '#AFAFAF' },

  actionButton: { backgroundColor: '#58CC02', paddingVertical: 18, borderRadius: 16, alignItems: 'center', borderBottomWidth: 5, borderBottomColor: '#58A700', marginBottom: 16 },
  actionButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '900' },
  
  settingsButton: { backgroundColor: '#FFFFFF', paddingVertical: 18, borderRadius: 16, alignItems: 'center', borderWidth: 2, borderColor: '#E5E5E5', borderBottomWidth: 5, borderBottomColor: '#D1D1D1' },
  settingsButtonText: { color: '#4B4B4B', fontSize: 16, fontWeight: '900' },
});
