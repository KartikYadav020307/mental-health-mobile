import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

const sleepTracks = [
  { id: '1', title: 'Deep Sleep', subtitle: '45 min • Sleep Story', icon: 'moon' },
  { id: '2', title: 'Rain Sounds', subtitle: '8 hours • Soundscape', icon: 'cloud-rain' },
  { id: '3', title: 'Wind Down', subtitle: '15 min • Meditation', icon: 'leaf' },
  { id: '4', title: 'Ocean Waves', subtitle: '2 hours • Soundscape', icon: 'water' },
];

export default function SleepScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView style={[styles.container, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}>
      <ScrollView contentContainerStyle={styles.content}>
        
        <View style={styles.header}>
          <Text style={styles.headerGreeting}>Ready to wind down?</Text>
          <Text style={styles.headerSubtitle}>Choose a soundscape to drift off to.</Text>
        </View>

        <View style={styles.listContainer}>
          {sleepTracks.map(track => (
            <TouchableOpacity 
              key={track.id} 
              style={styles.trackCard} 
              activeOpacity={0.8}
              onPress={() => navigation.navigate('AudioPlayer', { title: track.title })}
            >
              <View style={styles.iconContainer}>
                <FontAwesome5 name={track.icon} size={24} color="#AFAFAF" solid />
              </View>
              <View style={styles.trackInfo}>
                <Text style={styles.trackTitle}>{track.title}</Text>
                <Text style={styles.trackSubtitle}>{track.subtitle}</Text>
              </View>
              <View style={styles.playButton}>
                <FontAwesome5 name="play" size={16} color="#FFFFFF" solid style={styles.playIconOffset} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFFFFF' 
  },
  content: { 
    padding: 24, 
    gap: 32,
    paddingBottom: 120
  },
  header: { 
    marginTop: 20,
    marginBottom: 8,
  },
  headerGreeting: { 
    fontSize: 32, 
    fontWeight: '900', 
    color: '#4B4B4B',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#AFAFAF',
  },
  listContainer: {
    gap: 16,
  },
  trackCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderBottomWidth: 6,
    borderBottomColor: '#CCCCCC'
  },
  iconContainer: { 
    width: 60, 
    height: 60, 
    borderRadius: 20, 
    backgroundColor: '#F7F7F7', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderBottomWidth: 4,
    borderBottomColor: '#CCCCCC'
  },
  trackInfo: { 
    flex: 1 
  },
  trackTitle: { 
    fontSize: 20, 
    fontWeight: '900', 
    color: '#4B4B4B', 
    marginBottom: 6 
  },
  trackSubtitle: { 
    fontSize: 15, 
    fontWeight: '800', 
    color: '#AFAFAF' 
  },
  playButton: { 
    width: 48, 
    height: 48, 
    borderRadius: 24, 
    backgroundColor: '#58CC02', 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderBottomWidth: 4, 
    borderBottomColor: '#58A700' 
  },
  playIconOffset: {
    marginLeft: 4,
  }
});
