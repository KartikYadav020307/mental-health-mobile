import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

const categories = ['Anxiety', 'Focus', 'Growth', 'SOS', 'Tools'];

const courses = [
  { id: '1', title: 'Overcoming Panic', xp: '+150 XP', icon: 'lungs', category: 'Anxiety' },
  { id: '2', title: 'Deep Work Session', xp: '+200 XP', icon: 'brain', category: 'Focus' },
  { id: '3', title: 'Finding Purpose', xp: '+300 XP', icon: 'seedling', category: 'Growth' },
  { id: '4', title: 'Immediate Relief', xp: '+50 XP', icon: 'life-ring', category: 'SOS' },
  { id: '5', title: 'Social Anxiety', xp: '+150 XP', icon: 'users', category: 'Anxiety' },
  { id: '6', title: 'Flow State', xp: '+250 XP', icon: 'water', category: 'Focus' },
  { id: '7', title: 'Secure Journal', xp: 'Private', icon: 'book', category: 'Tools', route: 'Journal' },
];

export default function ExploreScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [activeCategory, setActiveCategory] = useState('Anxiety');

  // Simple filter for the prototype
  const filteredCourses = courses.filter(c => c.category === activeCategory);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Search Bar */}
        <View style={styles.searchBarContainer}>
          <FontAwesome5 name="search" size={20} color="#AFAFAF" />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search courses..."
            placeholderTextColor="#AFAFAF"
          />
        </View>

        {/* Category Tabs */}
        <View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}
          >
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <TouchableOpacity 
                  key={cat}
                  activeOpacity={0.8}
                  onPress={() => setActiveCategory(cat)}
                  style={[
                    styles.categoryPill,
                    isActive ? styles.categoryPillActive : styles.categoryPillInactive
                  ]}
                >
                  <Text style={[
                    styles.categoryText,
                    isActive ? styles.categoryTextActive : styles.categoryTextInactive
                  ]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Course Grid */}
        <View style={styles.grid}>
          {filteredCourses.map(course => (
            <TouchableOpacity 
              key={course.id} 
              style={styles.courseCard} 
              activeOpacity={0.8}
              onPress={() => course.route ? navigation.navigate(course.route as never) : navigation.navigate('AudioPlayer', { title: course.title })}
            >
              <View style={styles.iconWrapper}>
                <FontAwesome5 name={course.icon} size={32} color="#1CB0F6" solid />
              </View>
              <Text style={styles.courseTitle}>{course.title}</Text>
              <View style={styles.xpBadge}>
                <Text style={styles.xpText}>{course.xp}</Text>
              </View>
            </TouchableOpacity>
          ))}
          {filteredCourses.length === 0 && (
            <Text style={styles.emptyText}>No courses found in this category.</Text>
          )}
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
    padding: 24,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#4B4B4B',
  },
  content: {
    padding: 24,
    gap: 24,
    paddingBottom: 40,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderRadius: 24,
    paddingHorizontal: 20,
    height: 56,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 18,
    fontWeight: '700',
    color: '#4B4B4B',
  },
  categoryScroll: {
    gap: 12,
    paddingRight: 24, 
  },
  categoryPill: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 2,
    borderBottomWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryPillActive: {
    backgroundColor: '#58CC02',
    borderColor: '#58CC02',
    borderBottomColor: '#58A700',
  },
  categoryPillInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E5E5',
    borderBottomColor: '#E5E5E5',
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '800',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  categoryTextInactive: {
    color: '#AFAFAF',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  courseCard: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderBottomWidth: 5,
    borderBottomColor: '#E5E5E5',
    padding: 20,
    alignItems: 'center',
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F7F7F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#4B4B4B',
    textAlign: 'center',
    marginBottom: 12,
  },
  xpBadge: {
    backgroundColor: '#FFC800',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  xpText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  emptyText: {
    width: '100%',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    fontWeight: '700',
    color: '#AFAFAF',
  }
});
