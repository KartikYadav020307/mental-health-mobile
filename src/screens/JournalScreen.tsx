import React, { useState, useCallback } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, SafeAreaView, 
  TouchableOpacity, Modal, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { supabase } from '../lib/supabase';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY || '');
const emModel = genAI.getGenerativeModel({ model: 'text-embedding-004' });

type JournalEntry = {
  id: string;
  title: string;
  content: string;
  created_at: string;
};

export default function JournalScreen() {
  const navigation = useNavigation();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching journal:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchEntries();
    }, [])
  );

  const handleSave = async () => {
    if (!newTitle.trim() || !newContent.trim()) return;

    try {
      setIsSubmitting(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let embedding: number[] | null = null;
      try {
        const result = await emModel.embedContent(newContent.trim());
        embedding = result.embedding.values;
      } catch (err) {
        console.error('Embedding failed, saving without vector:', err);
      }

      const { error } = await supabase
        .from('journal_entries')
        .insert({
          user_id: user.id,
          title: newTitle.trim(),
          content: newContent.trim(),
          ...(embedding ? { embedding } : {})
        });

      if (error) throw error;

      setNewTitle('');
      setNewContent('');
      setIsModalVisible(false);
      await fetchEntries();

    } catch (error) {
      console.error('Error saving entry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
           <FontAwesome5 name="chevron-left" size={24} color="#AFAFAF" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <FontAwesome5 name="book" size={24} color="#1CB0F6" style={{ marginRight: 8 }} />
          <Text style={styles.headerTitle}>My Journal</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#1CB0F6" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.listContainer}>
          {entries.length === 0 ? (
            <View style={styles.emptyState}>
              <FontAwesome5 name="seedling" size={48} color="#E5E5E5" solid />
              <Text style={styles.emptyText}>Your journal is empty. Start writing to plant a seed of growth.</Text>
            </View>
          ) : (
            entries.map(entry => (
              <View key={entry.id} style={styles.entryCard}>
                <Text style={styles.entryTitle}>{entry.title}</Text>
                <Text style={styles.entryDate}>{new Date(entry.created_at).toLocaleDateString()}</Text>
                <Text style={styles.entryContent} numberOfLines={3}>{entry.content}</Text>
              </View>
            ))
          )}
        </ScrollView>
      )}

      <TouchableOpacity 
        style={styles.fab} 
        activeOpacity={0.8}
        onPress={() => setIsModalVisible(true)}
      >
        <FontAwesome5 name="plus" size={20} color="#FFFFFF" solid style={{ marginRight: 8 }} />
        <Text style={styles.fabText}>New Entry</Text>
      </TouchableOpacity>

      <Modal visible={isModalVisible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalSafeArea}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
            
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderTitle}>New Entry</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)} disabled={isSubmitting}>
                <FontAwesome5 name="times" size={28} color="#AFAFAF" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalContent}>
              <TextInput
                style={styles.inputTitle}
                placeholder="Title (e.g., Morning Thoughts)"
                placeholderTextColor="#AFAFAF"
                value={newTitle}
                onChangeText={setNewTitle}
                editable={!isSubmitting}
              />
              <TextInput
                style={styles.inputContent}
                placeholder="Write whatever is on your mind..."
                placeholderTextColor="#AFAFAF"
                value={newContent}
                onChangeText={setNewContent}
                multiline
                textAlignVertical="top"
                editable={!isSubmitting}
              />

              <TouchableOpacity 
                style={[styles.saveButton, isSubmitting && { opacity: 0.6 }]}
                activeOpacity={0.8}
                onPress={handleSave}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.saveButtonText}>Save Entry</Text>
                )}
              </TouchableOpacity>
            </ScrollView>

          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 2, borderBottomColor: '#E5E5E5', backgroundColor: '#FFFFFF' },
  backButton: { padding: 8 },
  headerTitleContainer: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#4B4B4B' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContainer: { padding: 24, gap: 16, paddingBottom: 100 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
  emptyText: { fontSize: 16, fontWeight: '800', color: '#AFAFAF', textAlign: 'center', marginTop: 16, paddingHorizontal: 20 },
  entryCard: { backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 2, borderColor: '#E5E5E5', borderBottomWidth: 5, borderBottomColor: '#E5E5E5', padding: 20 },
  entryTitle: { fontSize: 18, fontWeight: '900', color: '#4B4B4B', marginBottom: 4 },
  entryDate: { fontSize: 14, fontWeight: '800', color: '#1CB0F6', marginBottom: 12 },
  entryContent: { fontSize: 16, fontWeight: '600', color: '#8A93A6', lineHeight: 22 },
  fab: { position: 'absolute', bottom: 30, right: 24, flexDirection: 'row', backgroundColor: '#58CC02', paddingHorizontal: 24, paddingVertical: 16, borderRadius: 30, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#78DC28', borderBottomWidth: 6, borderBottomColor: '#58A700', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 },
  fabText: { fontSize: 16, fontWeight: '900', color: '#FFFFFF' },
  modalSafeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, borderBottomWidth: 2, borderBottomColor: '#E5E5E5' },
  modalHeaderTitle: { fontSize: 24, fontWeight: '900', color: '#4B4B4B' },
  modalContent: { padding: 24, gap: 16 },
  inputTitle: { backgroundColor: '#F7F7F7', borderWidth: 2, borderColor: '#E5E5E5', borderRadius: 16, padding: 16, fontSize: 18, fontWeight: '800', color: '#4B4B4B' },
  inputContent: { backgroundColor: '#F7F7F7', borderWidth: 2, borderColor: '#E5E5E5', borderRadius: 16, padding: 16, fontSize: 16, fontWeight: '600', color: '#4B4B4B', height: 300 },
  saveButton: { backgroundColor: '#1CB0F6', paddingVertical: 18, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#1CB0F6', borderBottomWidth: 5, borderBottomColor: '#1899D6', marginTop: 16 },
  saveButtonText: { fontSize: 18, fontWeight: '900', color: '#FFFFFF' }
});
