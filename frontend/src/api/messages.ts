import { Message, MessageCreate } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export async function getMessages(): Promise<Message[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/messages`);
    if (!response.ok) {
      throw new Error(`Failed to fetch messages: ${response.status} ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
}

export async function sendMessage(message: MessageCreate): Promise<Message> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
    if (!response.ok) {
      throw new Error(`Failed to send message: ${response.status} ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}