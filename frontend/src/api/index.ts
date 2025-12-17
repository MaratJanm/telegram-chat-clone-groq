import { Message } from '../types';

const API_URL = import.meta.env.VITE_API_URL || '';

export async function getMessages(): Promise<Message[]> {
  const response = await fetch(`${API_URL}/api/messages`);
  if (!response.ok) {
    throw new Error('Failed to fetch messages');
  }
  const data = await response.json();
  return data.messages;
}

export async function sendMessage(text: string, isOutgoing: boolean = true): Promise<Message> {
  const response = await fetch(`${API_URL}/api/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text, is_outgoing: isOutgoing }),
  });
  if (!response.ok) {
    throw new Error('Failed to send message');
  }
  return response.json();
}