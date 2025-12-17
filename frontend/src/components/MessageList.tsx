import { useEffect, useRef } from 'react';
import { Message as MessageType } from '../types';
import Message from './Message';

interface MessageListProps {
  messages: MessageType[];
  loading: boolean;
}

function MessageList({ messages, loading }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-[#a4c9a8] via-[#c5d9a4] to-[#d4c9a8]">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div 
      className="flex-1 overflow-y-auto px-3 py-2"
      style={{
        background: 'linear-gradient(180deg, #a4c9a8 0%, #b8d4a8 25%, #c8d9a4 50%, #d4d4a0 75%, #d8cca0 100%)',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Background pattern overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Ccircle cx='20' cy='20' r='2'/%3E%3Ccircle cx='80' cy='40' r='1.5'/%3E%3Ccircle cx='40' cy='70' r='2'/%3E%3Cpath d='M60 10 Q65 15 60 20 Q55 15 60 10' stroke='%23ffffff' fill='none' stroke-width='0.5'/%3E%3Cpath d='M10 50 L15 55 L10 60' stroke='%23ffffff' fill='none' stroke-width='0.5'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '100px 100px',
        }}
      />
      
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="bg-[#4a7c59]/80 rounded-xl px-4 py-3 text-white/90 text-sm">
            No messages yet. Start a conversation!
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-1 relative z-10">
          {messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
}

export default MessageList;