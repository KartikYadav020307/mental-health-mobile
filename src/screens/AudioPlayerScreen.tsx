import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { Audio, AVPlaybackStatus } from 'expo-av';

// Royalty-free placeholder audio (a relaxing piano loop hosted on archive.org)
const PLACEHOLDER_AUDIO_URL =
  'https://upload.wikimedia.org/wikipedia/commons/c/c8/Example.ogg';

/** Format milliseconds to mm:ss */
function formatTime(ms: number): string {
  if (!ms || ms < 0) return '00:00';
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export default function AudioPlayerScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'AudioPlayer'>>();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { title } = route.params;

  const soundRef = useRef<Audio.Sound | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [positionMs, setPositionMs] = useState(0);
  const [durationMs, setDurationMs] = useState(0);
  const [didFinish, setDidFinish] = useState(false);

  // ── Playback status callback ────────────────────────────────────────
  const onPlaybackStatusUpdate = useCallback((status: AVPlaybackStatus) => {
    if (!status.isLoaded) return;

    setPositionMs(status.positionMillis);
    setDurationMs(status.durationMillis ?? 0);
    setIsPlaying(status.isPlaying);

    if (status.didJustFinish) {
      setDidFinish(true);
      setIsPlaying(false);
    }
  }, []);

  // ── Load audio on mount, unload on unmount ──────────────────────────
  useEffect(() => {
    let isMounted = true;

    const loadAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
        });

        const { sound } = await Audio.Sound.createAsync(
          { uri: PLACEHOLDER_AUDIO_URL },
          { shouldPlay: false, progressUpdateIntervalMillis: 250 },
          onPlaybackStatusUpdate
        );

        if (isMounted) {
          soundRef.current = sound;
          setIsLoading(false);
        } else {
          // Component unmounted before load finished
          await sound.unloadAsync();
        }
      } catch (error) {
        console.error('Failed to load audio:', error);
        if (isMounted) setIsLoading(false);
      }
    };

    loadAudio();

    return () => {
      isMounted = false;
      if (soundRef.current) {
        soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    };
  }, [onPlaybackStatusUpdate]);

  // ── Controls ────────────────────────────────────────────────────────
  const togglePlayPause = async () => {
    if (!soundRef.current) return;

    if (didFinish) {
      // If track finished, replay from start
      await soundRef.current.setPositionAsync(0);
      setDidFinish(false);
    }

    if (isPlaying) {
      await soundRef.current.pauseAsync();
    } else {
      await soundRef.current.playAsync();
    }
  };

  const handleStop = async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.setPositionAsync(0);
      setDidFinish(false);
    }
  };

  const handleSeek = async (fraction: number) => {
    if (!soundRef.current || durationMs === 0) return;
    const newPosition = Math.floor(fraction * durationMs);
    await soundRef.current.setPositionAsync(newPosition);
    setDidFinish(false);
  };

  const handleClose = async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
    }
    navigation.goBack();
  };

  // ── Skip forward / backward 15s ────────────────────────────────────
  const skipForward = async () => {
    if (!soundRef.current) return;
    const newPos = Math.min(positionMs + 15000, durationMs);
    await soundRef.current.setPositionAsync(newPos);
  };

  const skipBackward = async () => {
    if (!soundRef.current) return;
    const newPos = Math.max(positionMs - 15000, 0);
    await soundRef.current.setPositionAsync(newPos);
  };

  // ── Progress fraction ───────────────────────────────────────────────
  const progress = durationMs > 0 ? positionMs / durationMs : 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose} activeOpacity={0.7}>
          <FontAwesome5 name="chevron-down" size={24} color="#8A93A6" />
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
                name={isPlaying ? 'music' : 'headphones'}
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
              // Track is full width minus padding (48*2)
              const trackWidth = e.nativeEvent.target ? 0 : 0; // fallback
              handleSeek(Math.max(0, Math.min(1, locationX / (e.currentTarget as any)._nativeTag)));
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
            <Text style={styles.timeText}>{formatTime(positionMs)}</Text>
            <Text style={styles.timeText}>{formatTime(durationMs)}</Text>
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
            <FontAwesome5 name="backward" size={24} color="#8A93A6" solid />
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
                    name={isPlaying ? 'pause' : 'play'}
                    size={32}
                    color="#FFFFFF"
                    solid
                    style={!isPlaying ? { marginLeft: 6 } : {}}
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
            <FontAwesome5 name="forward" size={24} color="#8A93A6" solid />
            <Text style={styles.skipLabel}>15</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryControl}
            onPress={() => {/* loop toggle placeholder */}}
            activeOpacity={0.8}
          >
            <FontAwesome5 name="redo" size={20} color="#8A93A6" solid />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1F2B',
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
    color: '#8A93A6',
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
    backgroundColor: '#10141C',
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
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitleText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#8A93A6',
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
    backgroundColor: '#2A3040',
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
    borderColor: '#1A1F2B',
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  timeText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#8A93A6',
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
    color: '#8A93A6',
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
