import { useState, KeyboardEvent, useRef, useEffect } from 'react';

interface MessageInputProps {
  onSend: (text: string) => void;
}

function MessageInput({ onSend }: MessageInputProps) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (text.trim()) {
      onSend(text.trim());
      setText('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    }
  }, [text]);

  return (
    <div className="px-2 py-[6px] bg-white border-t border-[#e0e0e0]">
      <div className="flex items-end gap-2">
        <div className="flex-1 flex items-end bg-white border border-[#d9d9d9] rounded-[21px] px-3 py-[6px]">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message"
            rows={1}
            className="flex-1 bg-transparent text-[#000000] text-[15px] placeholder-[#999999] resize-none outline-none min-h-[24px] max-h-[150px] leading-6"
          />
        </div>
        
        {/* Send button (or mic if empty) */}
        <button
          onClick={handleSend}
          disabled={!text.trim()}
          className={`
            w-[44px] h-[44px] rounded-full flex items-center justify-center transition-all
            ${text.trim() 
              ? 'bg-[#52a4dc] hover:bg-[#4593c7] text-white' 
              : 'bg-transparent text-[#999999]'
            }
          `}
        >
          {text.trim() ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M4 12L20 12M20 12L14 6M20 12L14 18" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M4 12L20 12M20 12L14 6M20 12L14 18" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

export default MessageInput;