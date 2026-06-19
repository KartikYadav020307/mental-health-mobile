import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';

export default function AudioPlayerScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'AudioPlayer'>>();
  const navigation = useNavigation();
  const { title } = route.params;

  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleClose = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose} activeOpacity={0.7}>
          <FontAwesome5 name="chevron-down" size={28} color="#AFAFAF" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.artworkContainer}>
          <View style={styles.artworkInner}>
            <FontAwesome5 name={isPlaying ? "music" : "headphones"} size={80} color="#FFFFFF" solid />
          </View>
        </View>

        <Text style={styles.titleText}>{title}</Text>
        <Text style={styles.subtitleText}>Serenova Original</Text>

        <View style={styles.controlsRow}>
          <TouchableOpacity style={[styles.controlButton, styles.stopButton]} onPress={handleClose} activeOpacity={0.8}>
            <FontAwesome5 name="stop" size={24} color="#FFFFFF" solid />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.controlButton, styles.playButton]} onPress={togglePlay} activeOpacity={0.8}>
            <FontAwesome5 name={isPlaying ? "pause" : "play"} size={32} color="#FFFFFF" solid style={!isPlaying ? { marginLeft: 6 } : {}} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1A1F2B',
  },
  header: {
    padding: 24,
    alignItems: 'flex-start',
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 60,
  },
  artworkContainer: {
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: '#2A3040',
    borderWidth: 2,
    borderColor: '#3A4050',
    borderBottomWidth: 12,
    borderBottomColor: '#10141C',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  artworkInner: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#1CB0F6',
    borderWidth: 2,
    borderColor: '#38C0F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#8A93A6',
    textAlign: 'center',
    marginBottom: 48,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
  },
  controlButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderBottomWidth: 6,
  },
  stopButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FF4B4B',
    borderColor: '#FF7B7B',
    borderBottomColor: '#CC0000',
  },
  playButton: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#58CC02',
    borderColor: '#78DC28',
    borderBottomColor: '#58A700',
  },
});
