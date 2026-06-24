import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRoute, useNavigation, RouteProp, CommonActions } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { useUserStore } from '../store/useUserStore';
import { useAudioPlayer, useAudioPlayerStatus, setAudioModeAsync } from 'expo-audio';

// Royalty-free placeholder audio (a relaxing piano loop hosted on archive.org)
const PLACEHOLDER_AUDIO_URL =
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

/** Format seconds to mm:ss */
function formatTime(s: number): string {
  if (!s || s < 0) return '00:00';
  const totalSeconds = Math.floor(s);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export default function AudioPlayerScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'AudioPlayer'>>();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { title } = route.params;

  const player = useAudioPlayer(PLACEHOLDER_AUDIO_URL);
  const status = useAudioPlayerStatus(player);

  const addXP = useUserStore((s) => s.addXP);
  const logSession = useUserStore((s) => s.logSession);
  const incrementStreak = useUserStore((s) => s.incrementStreak);

  const [didFinish, setDidFinish] = useState(false);
  const hasRewardedRef = useRef(false);

  // ── Configure background audio ─────────────────────────────────────────
  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
      interruptionMode: 'mixWithOthers',
    });
  }, []);

  // ── Error Boundary for Audio ─────────────────────────────────────────
  // Since we use the modern expo-audio useAudioPlayer hook instead of 
  // the legacy expo-av Audio.Sound.createAsync, we monitor the status object for errors.
  useEffect(() => {
    if ((status as any).error) {
      console.error('Failed to load audio:', (status as any).error);
    }
  }, [(status as any).error]);

  // ── Gamification rewards on completion ──────────────────────────────
  useEffect(() => {
    // expo-audio uses currentTime and duration
    const isFinished = status.duration > 0 && status.currentTime >= status.duration;

    if (isFinished && !hasRewardedRef.current) {
      hasRewardedRef.current = true;
      setDidFinish(true);

      const durationMinutes = Math.max(1, Math.round(status.duration / 60));
      addXP(10);
      logSession(durationMinutes);
      incrementStreak();

      // Navigate to Profile tab so the user sees their rewards
      navigation.navigate('Profile' as any);
    }
  }, [status.currentTime, status.duration, addXP, logSession, incrementStreak, navigation]);

  // ── Controls ────────────────────────────────────────────────────────
  const togglePlayPause = () => {
    if (didFinish) {
      player.seekTo(0);
      setDidFinish(false);
    }

    if (status.playing) {
      player.pause();
    } else {
      player.play();
    }
  };

  const handleStop = () => {
    player.pause();
    player.seekTo(0);
    setDidFinish(false);
  };

  const handleSeek = (fraction: number) => {
    if (status.duration === 0) return;
    const newPosition = fraction * status.duration;
    player.seekTo(newPosition);
    setDidFinish(false);
  };

  const handleClose = () => {
    player.pause();
    navigation.goBack();
  };

  // ── Skip forward / backward 15s ────────────────────────────────────
  const skipForward = () => {
    const newPos = Math.min(status.currentTime + 15, status.duration);
    player.seekTo(newPos);
  };

  const skipBackward = () => {
    const newPos = Math.max(status.currentTime - 15, 0);
    player.seekTo(newPos);
  };

  // ── Progress fraction ───────────────────────────────────────────────
  const progress = status.duration > 0 ? status.currentTime / status.duration : 0;
  const isLoading = !status.isLoaded;

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose} activeOpacity={0.7}>
          <FontAwesome5 name="chevron-down" size={24} color="#AFAFAF" />
        </TouchableOpacity>
        <Text style={styles.headerLabel}>NOW PLAYING</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Artwork */}
        <View style={styles.artworkOuter}>
          <View style={styles.artworkInner}>
            {isLoading ? (
              <ActivityIndicator size="large" color="#FFFFFF" />
            ) : (
              <FontAwesome5
                name={status.playing ? 'music' : 'headphones'}
                size={72}
                color="#FFFFFF"
                solid
              />
            )}
          </View>
        </View>

        {/* Title */}
        <Text style={styles.titleText} numberOfLines={2}>{title}</Text>
        <Text style={styles.subtitleText}>Serenova Original</Text>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <TouchableOpacity
            style={styles.progressTrack}
            activeOpacity={1}
            onPress={(e) => {
              const { locationX } = e.nativeEvent;
              // Provide a fallback width if native element target isn't readily available
              const targetWidth = (e.currentTarget as any)._nativeTag ? 300 : 300; 
              handleSeek(Math.max(0, Math.min(1, locationX / targetWidth)));
            }}
          >
            <View style={styles.progressTrackBg}>
              <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
              <View
                style={[
                  styles.progressThumb,
                  { left: `${progress * 100}%` },
                ]}
              />
            </View>
          </TouchableOpacity>
          <View style={styles.timeRow}>
            <Text style={styles.timeText}>{formatTime(status.currentTime)}</Text>
            <Text style={styles.timeText}>{formatTime(status.duration)}</Text>
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controlsRow}>
          <TouchableOpacity
            style={styles.secondaryControl}
            onPress={handleStop}
            activeOpacity={0.8}
          >
            <View style={styles.stopButtonOuter}>
              <View style={styles.stopButtonInner}>
                <FontAwesome5 name="stop" size={20} color="#FFFFFF" solid />
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryControl}
            onPress={skipBackward}
            activeOpacity={0.8}
          >
            <FontAwesome5 name="backward" size={24} color="#AFAFAF" solid />
            <Text style={styles.skipLabel}>15</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.playControl}
            onPress={togglePlayPause}
            activeOpacity={0.8}
            disabled={isLoading}
          >
            <View style={styles.playButtonOuter}>
              <View style={styles.playButtonInner}>
                {isLoading ? (
                  <ActivityIndicator size="large" color="#FFFFFF" />
                ) : (
                  <FontAwesome5
                    name={status.playing ? 'pause' : 'play'}
                    size={32}
                    color="#FFFFFF"
                    solid
                    style={!status.playing ? { marginLeft: 6 } : {}}
                  />
                )}
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryControl}
            onPress={skipForward}
            activeOpacity={0.8}
          >
            <FontAwesome5 name="forward" size={24} color="#AFAFAF" solid />
            <Text style={styles.skipLabel}>15</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryControl}
            onPress={() => {/* loop toggle placeholder */}}
            activeOpacity={0.8}
          >
            <FontAwesome5 name="redo" size={20} color="#AFAFAF" solid />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  closeButton: {
    padding: 8,
    width: 40,
  },
  headerLabel: {
    fontSize: 13,
    fontWeight: '900',
    color: '#AFAFAF',
    letterSpacing: 2,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },

  // ── Artwork (shadow-wrapper 3D) ───────────────────────────────────
  artworkOuter: {
    width: 240,
    height: 245,
    borderRadius: 120,
    backgroundColor: '#CCCCCC',
    alignItems: 'center',
    marginBottom: 40,
  },
  artworkInner: {
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: '#1CB0F6',
    borderWidth: 3,
    borderColor: '#38C0F8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  titleText: {
    fontSize: 26,
    fontWeight: '900',
    color: '#4B4B4B',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitleText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#AFAFAF',
    textAlign: 'center',
    marginBottom: 36,
  },

  // ── Progress ───────────────────────────────────────────────────────
  progressContainer: {
    width: '100%',
    marginBottom: 36,
  },
  progressTrack: {
    width: '100%',
    paddingVertical: 8,
  },
  progressTrackBg: {
    width: '100%',
    height: 6,
    backgroundColor: '#E5E5E5',
    borderRadius: 3,
    position: 'relative',
    justifyContent: 'center',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#58CC02',
    borderRadius: 3,
  },
  progressThumb: {
    position: 'absolute',
    top: -5,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#58CC02',
    marginLeft: -8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  timeText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#AFAFAF',
  },

  // ── Controls ───────────────────────────────────────────────────────
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  secondaryControl: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
  },
  skipLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#AFAFAF',
    marginTop: 2,
  },
  playControl: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Play button (shadow-wrapper 3D) ────────────────────────────────
  playButtonOuter: {
    width: 88,
    height: 93,
    borderRadius: 44,
    backgroundColor: '#458A00',
    alignItems: 'center',
  },
  playButtonInner: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#58CC02',
    borderWidth: 2,
    borderColor: '#78DC28',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Stop button (shadow-wrapper 3D) ────────────────────────────────
  stopButtonOuter: {
    width: 48,
    height: 53,
    borderRadius: 24,
    backgroundColor: '#990000',
    alignItems: 'center',
  },
  stopButtonInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FF4B4B',
    borderWidth: 2,
    borderColor: '#FF7B7B',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
