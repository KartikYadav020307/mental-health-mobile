import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '../lib/supabase';
import { useUserStore } from '../store/useUserStore';

// ── Paste your Google AI Studio API key here ────────────────────────────────
const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
// Embedding model for vector recall from journal entries
const emModel = genAI.getGenerativeModel({ model: 'text-embedding-004' });

type Message = {
  id: string;
  text: string;
  isUser: boolean;
};

export default function AICoachScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  
  const currentStreak = useUserStore((s) => s.currentStreak);
  const totalXP = useUserStore((s) => s.totalXP);
  const minutesMeditated = useUserStore((s) => s.minutesMeditated);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: "Hi Alex! I'm Serenova, your AI Coach. How are you feeling today?", isUser: false },
  ]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          const loadedMessages: Message[] = data.map((msg: any) => ({
            id: msg.id.toString(),
            text: msg.content,
            isUser: msg.role === 'user',
          }));
          setMessages(loadedMessages);
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    };
    
    loadHistory();
  }, []);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userText = inputText.trim();
    const newUserMsg: Message = { id: Date.now().toString(), text: userText, isUser: true };
    setMessages((prev) => [...prev, newUserMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { error } = await supabase.from('chat_messages').insert({ user_id: user.id, role: 'user', content: userText });
        if (error) console.error(error);
      }

      let mappedContext = '';
      if (user) {
        try {
          const emResult = await emModel.embedContent(userText);
          const userEmbedding = emResult.embedding.values;

          const { data: matchedJournals, error: rpcError } = await supabase.rpc('match_journal_entries', {
            query_embedding: userEmbedding,
            match_threshold: 0.5,
            match_count: 2,
            p_user_id: user.id
          });

          if (rpcError) throw rpcError;
          if (matchedJournals && matchedJournals.length > 0) {
            mappedContext = matchedJournals.map((j: any) => j.content).join('\n---\n');
          }
        } catch (err) {
          console.error('Vector recall failed:', err);
        }
      }

      const promptPayload = mappedContext 
        ? `User context from past journal entries:\n${mappedContext}\n\nUser message: ${userText}`
        : userText;

      // ── Gemini SDK: dynamic system prompt with live user stats ───────
      const systemInstruction = `You are Serenova, a warm, empathetic mental health coach. Do not be overly enthusiastic or gamified. The user currently has a streak of ${currentStreak} days and has meditated for ${minutesMeditated} minutes. Keep your responses to 1-2 short sentences.`;

      const chatModel = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        systemInstruction,
      });

      // Build prior history in Gemini SDK format (exclude initial greeting)
      const priorHistory = messages
        .filter((m) => m.id !== '1') // skip the static greeting
        .map((m) => ({
          role: m.isUser ? ('user' as const) : ('model' as const),
          parts: [{ text: m.text }],
        }));

      const chat = chatModel.startChat({ history: priorHistory });
      const result = await chat.sendMessage(promptPayload);
      const aiText = result.response.text();
      
      const aiResponse: Message = { 
        id: (Date.now() + 1).toString(), 
        text: aiText, 
        isUser: false 
      };
      setMessages((prev) => [...prev, aiResponse]);

      if (user) {
        const { error } = await supabase.from('chat_messages').insert({ user_id: user.id, role: 'model', content: aiText });
        if (error) console.error(error);
      }
    } catch (error) {
      console.error('Gemini API Error:', error);
      const errorResponse: Message = { 
        id: (Date.now() + 1).toString(), 
        text: "I'm having a little trouble connecting right now, but I'm here for you. Let's try again in a moment.", 
        isUser: false 
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
      style={{ flex: 1, backgroundColor: '#FFFFFF' }}
    >
      <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} activeOpacity={0.7}>
            <FontAwesome5 name="times" size={24} color="#AFAFAF" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <FontAwesome5 name="robot" size={24} color="#1CB0F6" style={{ marginRight: 8 }} />
            <Text style={styles.headerTitle}>Serenova AI Coach</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.chatContent}>
          {messages.map((msg) => (
            <View key={msg.id} style={[styles.bubbleWrapper, msg.isUser ? styles.bubbleWrapperUser : styles.bubbleWrapperAI]}>
              <View style={[styles.bubble, msg.isUser ? styles.bubbleUser : styles.bubbleAI]}>
                <Text style={[styles.bubbleText, msg.isUser ? styles.bubbleTextUser : styles.bubbleTextAI]}>
                  {msg.text}
                </Text>
              </View>
            </View>
          ))}
          {isLoading && (
            <View style={[styles.bubbleWrapper, styles.bubbleWrapperAI]}>
              <View style={[styles.bubble, styles.bubbleAI, { paddingHorizontal: 20 }]}>
                <Text style={[styles.bubbleText, styles.bubbleTextAI]}>...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type your message..."
            placeholderTextColor="#AFAFAF"
            value={inputText}
            onChangeText={setInputText}
            multiline
            editable={!isLoading}
          />
          <TouchableOpacity 
            style={[styles.sendButton, isLoading ? { opacity: 0.6 } : undefined]} 
            onPress={handleSend} 
            activeOpacity={0.8}
            disabled={isLoading}
          >
            <FontAwesome5 name="paper-plane" size={20} color="#FFFFFF" solid />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 8,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#4B4B4B',
  },
  chatContent: {
    padding: 20,
    paddingBottom: 40,
  },
  bubbleWrapper: {
    width: '100%',
    marginBottom: 16,
    flexDirection: 'row',
  },
  bubbleWrapperUser: {
    justifyContent: 'flex-end',
  },
  bubbleWrapperAI: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 2,
    borderBottomWidth: 5,
  },
  bubbleUser: {
    backgroundColor: '#58CC02',
    borderColor: '#58CC02',
    borderBottomColor: '#58A700',
    borderBottomRightRadius: 4,
  },
  bubbleAI: {
    backgroundColor: '#E5E5E5',
    borderColor: '#E5E5E5',
    borderBottomColor: '#D1D1D1',
    borderBottomLeftRadius: 4,
  },
  bubbleText: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  bubbleTextUser: {
    color: '#FFFFFF',
  },
  bubbleTextAI: {
    color: '#4B4B4B',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderTopWidth: 2,
    borderTopColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    color: '#4B4B4B',
    fontSize: 16,
    fontWeight: '700',
    padding: 16,
    paddingTop: 16,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    maxHeight: 120,
    minHeight: 56,
  },
  sendButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1CB0F6',
    borderWidth: 2,
    borderColor: '#1CB0F6',
    borderBottomWidth: 5,
    borderBottomColor: '#1899D6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    marginBottom: 2,
  },
});
