import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';

const sleepTracks = [
  { id: '1', title: 'Deep Sleep', subtitle: '45 min • Story', emoji: '🌌' },
  { id: '2', title: 'Rain Sounds', subtitle: '8 hours • Sound', emoji: '🌧️' },
  { id: '3', title: 'Wind Down', subtitle: '15 min • Meditation', emoji: '🛏️' },
  { id: '4', title: 'Ocean Waves', subtitle: '2 hours • Sound', emoji: '🌊' },
  { id: '5', title: 'Body Scan', subtitle: '20 min • Exercise', emoji: '🧘' },
];

export default function SleepScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sleep</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {sleepTracks.map(track => (
          <TouchableOpacity key={track.id} style={styles.trackCard} activeOpacity={0.8}>
            <View style={styles.iconContainer}>
              <Text style={styles.emoji}>{track.emoji}</Text>
            </View>
            <View style={styles.trackInfo}>
              <Text style={styles.trackTitle}>{track.title}</Text>
              <Text style={styles.trackSubtitle}>{track.subtitle}</Text>
            </View>
            <View style={styles.playButton}>
              <Text style={styles.playIcon}>▶</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1F2B' },
  header: { padding: 24, paddingTop: 16, paddingBottom: 16, borderBottomWidth: 2, borderBottomColor: '#2A3040' },
  headerTitle: { fontSize: 28, fontWeight: '900', color: '#FFFFFF' },
  content: { padding: 24, gap: 16 },
  trackCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A3040',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#3A4255',
    borderBottomWidth: 5,
    borderBottomColor: '#10141C'
  },
  iconContainer: { width: 56, height: 56, borderRadius: 16, backgroundColor: '#1A1F2B', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  emoji: { fontSize: 28 },
  trackInfo: { flex: 1 },
  trackTitle: { fontSize: 18, fontWeight: '800', color: '#FFFFFF', marginBottom: 4 },
  trackSubtitle: { fontSize: 14, fontWeight: '600', color: '#AFAFAF' },
  playButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#58CC02', alignItems: 'center', justifyContent: 'center', borderBottomWidth: 3, borderBottomColor: '#58A700' },
  playIcon: { color: '#FFFFFF', fontSize: 16, fontWeight: '900', marginLeft: 4 }
});
