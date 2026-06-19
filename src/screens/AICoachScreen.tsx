import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '../lib/supabase';

const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ 
  model: 'gemini-1.5-flash',
  systemInstruction: 'You are Serenova, an empathetic, CBT-trained mental health AI coach. Keep your responses extremely concise (1-3 sentences maximum) so they fit nicely in mobile chat bubbles. Be warm, validating, and offer gentle, actionable advice. Do not use markdown bolding or bullet points.'
});

type Message = {
  id: string;
  text: string;
  isUser: boolean;
};

export default function AICoachScreen() {
  const navigation = useNavigation();
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
        await supabase.from('chat_messages').insert({ user_id: user.id, role: 'user', content: userText }).catch(console.error);
      }

      const result = await model.generateContent(userText);
      const aiText = result.response.text();
      
      const aiResponse: Message = { 
        id: (Date.now() + 1).toString(), 
        text: aiText, 
        isUser: false 
      };
      setMessages((prev) => [...prev, aiResponse]);

      if (user) {
        await supabase.from('chat_messages').insert({ user_id: user.id, role: 'model', content: aiText }).catch(console.error);
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
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} activeOpacity={0.7}>
             <FontAwesome5 name="times" size={24} color="#AFAFAF" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <FontAwesome5 name="robot" size={24} color="#1CB0F6" style={{ marginRight: 8 }} />
            <Text style={styles.headerTitle}>Serenova AI Coach</Text>
          </View>
          <View style={{ width: 40 }} /> {/* Spacer to center the title */}
        </View>

        {/* Chat Area */}
        <ScrollView contentContainerStyle={styles.chatContent}>
          {messages.map((msg) => (
            <View key={msg.id} style={[styles.bubbleWrapper, msg.isUser ? styles.bubbleWrapperUser : styles.bubbleWrapperAI]}>
              <View style={[styles.bubble, msg.isUser ? styles.bubbleUser : styles.bubbleAI]}>
                <Text style={[styles.bubbleText, msg.isUser ? styles.bubbleTextUser : styles.bubbleTextAI]}>
                  {msg.text}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Input Area */}
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
            style={[styles.sendButton, isLoading && { opacity: 0.6 }]} 
            onPress={handleSend} 
            activeOpacity={0.8}
            disabled={isLoading}
          >
            <FontAwesome5 name="paper-plane" size={20} color="#FFFFFF" solid />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
    paddingVertical: 16,
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
