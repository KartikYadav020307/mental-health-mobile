import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';

const HomeScreen = () => {
  const [isMoodLogged, setIsMoodLogged] = useState(false);
  const insets = useSafeAreaInsets();

  const handleMoodSelection = async (moodValue: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from('mood_logs').insert({
        user_id: user.id,
        mood_value: moodValue,
      });

      if (error) throw error;
      
      setIsMoodLogged(true);
    } catch (error) {
      console.error('Error logging mood:', error);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top }]}>
      {/* Header - Stats Bar */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.statPill} activeOpacity={0.8}>
          <FontAwesome5 name="fire" size={24} color="#FFC800" solid />
          <Text style={styles.statText}>12</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.statPill} activeOpacity={0.8}>
          <FontAwesome5 name="star" size={24} color="#FFC800" solid />
          <Text style={styles.statText}>450</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.statPill} activeOpacity={0.8}>
          <Ionicons name="notifications" size={28} color="#1CB0F6" />
        </TouchableOpacity>
      </View>

      {/* Course Path Layout */}
      <ScrollView contentContainerStyle={styles.pathContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Unit 1</Text>
          <Text style={styles.sectionSubtitle}>Mindfulness Basics</Text>
        </View>
        
        {/* Path Nodes */}
        <View style={styles.nodeWrapperLeft}>
          <TouchableOpacity style={[styles.node, styles.nodeCompleted]} activeOpacity={0.8}>
            <FontAwesome5 name="check" size={32} color="#fff" solid />
          </TouchableOpacity>
        </View>

        <View style={styles.nodeWrapperCenter}>
          <TouchableOpacity style={[styles.node, styles.nodeCompleted]} activeOpacity={0.8}>
            <FontAwesome5 name="check" size={32} color="#fff" solid />
          </TouchableOpacity>
        </View>

        <View style={styles.nodeWrapperRight}>
          <TouchableOpacity style={[styles.node, styles.nodeActive]} activeOpacity={0.8}>
            <FontAwesome5 name="brain" size={40} color="#fff" solid />
          </TouchableOpacity>
          {/* Tooltip for Active Node */}
          <View style={styles.tooltipContainer}>
            <View style={styles.tooltip}>
              <Text style={styles.tooltipText}>Start</Text>
            </View>
            <View style={styles.tooltipTriangle} />
          </View>
        </View>

        <View style={styles.nodeWrapperCenter}>
          <TouchableOpacity style={[styles.node, styles.nodeLocked]} activeOpacity={1}>
            <FontAwesome5 name="lock" size={32} color="#AFAFAF" solid />
          </TouchableOpacity>
        </View>

        <View style={styles.nodeWrapperLeft}>
          <TouchableOpacity style={[styles.node, styles.nodeLocked]} activeOpacity={1}>
            <FontAwesome5 name="lock" size={32} color="#AFAFAF" solid />
          </TouchableOpacity>
        </View>

        <View style={styles.chestWrapper}>
          <TouchableOpacity style={styles.chestButton} activeOpacity={0.8}>
            <MaterialCommunityIcons name="treasure-chest" size={36} color="#FFC800" />
          </TouchableOpacity>
        </View>
        
        {/* Mood Tracker / Daily Challenge */}
        {isMoodLogged ? (
          <View style={[styles.card, styles.successCard]}>
            <View style={styles.cardIconContainer}>
              <FontAwesome5 name="check-circle" size={40} color="#FFFFFF" solid />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={styles.successCardTitle}>Mood Logged! +10 XP</Text>
            </View>
          </View>
        ) : (
          <View style={[styles.card, { flexDirection: 'column', alignItems: 'flex-start' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              <View style={styles.cardIconContainer}>
                <MaterialCommunityIcons name="target" size={40} color="#FFC800" />
              </View>
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>Daily Challenge</Text>
                <Text style={styles.cardSubtitle}>Log your mood today</Text>
              </View>
            </View>
            <View style={styles.moodEmojisRow}>
              {[{v: 1, e: '😢'}, {v: 2, e: '😕'}, {v: 3, e: '😐'}, {v: 4, e: '🙂'}, {v: 5, e: '😄'}].map(mood => (
                <TouchableOpacity 
                  key={mood.v} 
                  style={styles.moodEmojiButton} 
                  activeOpacity={0.8}
                  onPress={() => handleMoodSelection(mood.v)}
                >
                  <Text style={styles.moodEmojiText}>{mood.e}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#E5E5E5',
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statText: {
    color: '#FFC800',
    fontSize: 20,
    fontWeight: '900',
  },
  pathContainer: {
    paddingTop: 24,
    paddingBottom: 130,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  sectionHeader: {
    backgroundColor: '#58CC02',
    borderRadius: 16,
    padding: 16,
    width: '100%',
    marginBottom: 32,
    borderBottomWidth: 5,
    borderBottomColor: '#58A700',
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '900',
  },
  sectionSubtitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    opacity: 0.9,
    marginTop: 4,
  },
  nodeWrapperCenter: {
    alignItems: 'center',
    width: '100%',
    marginVertical: 16,
  },
  nodeWrapperLeft: {
    alignItems: 'flex-start',
    width: '65%',
    marginVertical: 16,
  },
  nodeWrapperRight: {
    alignItems: 'flex-end',
    width: '65%',
    marginVertical: 16,
    position: 'relative',
  },
  node: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
    borderBottomWidth: 8,
  },
  nodeCompleted: {
    backgroundColor: '#FFC800',
    borderBottomColor: '#E5B400',
  },
  nodeActive: {
    backgroundColor: '#58CC02',
    borderBottomColor: '#58A700',
    width: 90,
    height: 90,
    borderRadius: 45,
    borderBottomWidth: 10,
  },
  nodeLocked: {
    backgroundColor: '#f5f5f5',
    borderBottomColor: '#E5E5E5',
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderBottomWidth: 6,
  },
  tooltipContainer: {
    position: 'absolute',
    top: -50,
    right: 10,
    alignItems: 'center',
    zIndex: 10,
  },
  tooltip: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderBottomWidth: 4,
  },
  tooltipText: {
    color: '#58CC02',
    fontWeight: '900',
    fontSize: 16,
    textTransform: 'uppercase',
  },
  tooltipTriangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#E5E5E5',
    marginTop: -2,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderBottomWidth: 5,
    padding: 20,
    width: '100%',
    marginTop: 32,
    backgroundColor: '#ffffff',
  },
  cardIconContainer: {
    marginRight: 16,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#4B4B4B',
  },
  cardSubtitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#AFAFAF',
    marginTop: 4,
  },
  chestWrapper: {
    marginVertical: 24,
  },
  chestButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1CB0F6',
    borderBottomColor: '#1899D6',
    borderBottomWidth: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successCard: {
    backgroundColor: '#58CC02',
    borderColor: '#58CC02',
    borderBottomColor: '#58A700',
  },
  successCardTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  moodEmojisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  moodEmojiButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F7F7F7',
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderBottomWidth: 4,
    borderBottomColor: '#D1D1D1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moodEmojiText: {
    fontSize: 24,
  }
});

export default HomeScreen;
