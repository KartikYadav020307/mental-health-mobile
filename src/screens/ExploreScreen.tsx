import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';

const categories = [
  { id: '1', label: 'Anxiety', emoji: '😌', color: '#1CB0F6', shadow: '#1899D6' },
  { id: '2', label: 'Beginners', emoji: '🌱', color: '#58CC02', shadow: '#58A700' },
  { id: '3', label: 'Focus', emoji: '🎯', color: '#FFC800', shadow: '#E5B400' },
  { id: '4', label: 'Self-Care', emoji: '💖', color: '#FF4B4B', shadow: '#E54343' },
  { id: '5', label: 'Work', emoji: '💼', color: '#CE82FF', shadow: '#B874E5' },
  { id: '6', label: 'Kids', emoji: '🧸', color: '#FF9600', shadow: '#E58700' },
];

export default function ExploreScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.grid}>
          {categories.map((cat) => (
            <TouchableOpacity 
              key={cat.id} 
              style={[styles.card, { borderColor: cat.color, borderBottomColor: cat.shadow }]}
              activeOpacity={0.8}
            >
              <Text style={styles.emoji}>{cat.emoji}</Text>
              <Text style={[styles.label, { color: cat.color }]}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { padding: 24, paddingTop: 16, paddingBottom: 16, borderBottomWidth: 2, borderBottomColor: '#E5E5E5' },
  headerTitle: { fontSize: 28, fontWeight: '900', color: '#4B4B4B' },
  content: { padding: 24 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between' },
  card: { 
    width: '47%', 
    backgroundColor: '#FFFFFF', 
    borderRadius: 16, 
    padding: 20, 
    borderWidth: 2, 
    borderBottomWidth: 6, 
    alignItems: 'center',
    marginBottom: 8
  },
  emoji: { fontSize: 40, marginBottom: 12 },
  label: { fontSize: 16, fontWeight: '900' }
});
