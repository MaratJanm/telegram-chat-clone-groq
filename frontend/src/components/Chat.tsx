import { useState, useEffect, useCallback } from 'react';
import { Message } from '../types';
import { getMessages, sendMessage } from '../api';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

// Groq API Configuration
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

interface GroqMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

async function getGroqResponse(userMessage: string, conversationHistory: Message[]): Promise<string> {
  if (!GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not configured');
  }

  // Format conversation history for Groq API
  const messages: GroqMessage[] = [
    {
      role: 'system',
      content: 'You are a helpful assistant. Respond concisely and helpfully.'
    },
    ...conversationHistory.map(msg => ({
      role: msg.is_outgoing ? 'user' as const : 'assistant' as const,
      content: msg.text
    })),
    {
      role: 'user',
      content: userMessage
    }
  ];

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        max_tokens: 1000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: `HTTP error ${response.status}` }));
      throw new Error(`Groq API error: ${response.status} ${response.statusText}. ${errorData.message || ''}`);
    }

    const data = await response.json();

    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response from Groq API');
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling Groq API:', error);
    throw error;
  }
}

function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

function getCurrentTimestamp(): string {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
}

function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    try {
      const data = await getMessages();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleSendMessage = async (text: string) => {
    try {
      // Add user message immediately
      const userMessage: Message = {
        id: generateId(),
        text,
        timestamp: getCurrentTimestamp(),
        is_outgoing: true,
      };

      setMessages(prev => [...prev, userMessage]);

      // Send user message to backend
      await sendMessage(text, true);

      // Get AI response using the updated message list
      const updatedMessages = [...messages, userMessage];
      const aiResponse = await getGroqResponse(text, updatedMessages);

      // Add AI response to messages
      const aiMessage: Message = {
        id: generateId(),
        text: aiResponse,
        timestamp: getCurrentTimestamp(),
        is_outgoing: false,
      };

      setMessages(prev => [...prev, aiMessage]);

      // Send AI response to backend as well
      await sendMessage(aiResponse, false);
    } catch (error) {
      console.error('Error in message flow:', error);

      // Show error message to user
      const errorMessage: Message = {
        id: generateId(),
        text: 'Sorry, I encountered an error. Please try again.',
        timestamp: getCurrentTimestamp(),
        is_outgoing: false,
      };

      setMessages(prev => [...prev, errorMessage]);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ChatHeader />
      <MessageList messages={messages} loading={loading} />
      <MessageInput onSend={handleSendMessage} />
    </div>
  );
}

export default Chat;