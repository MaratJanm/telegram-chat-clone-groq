import { Message as MessageType } from '../types';

interface MessageProps {
  message: MessageType;
}

function Message({ message }: MessageProps) {
  const { text, timestamp, is_outgoing } = message;

  return (
    <div className={`flex ${is_outgoing ? 'justify-end' : 'justify-start'} mb-[2px]`}>
      <div
        className={`
          relative max-w-[75%] px-[9px] py-[6px] shadow-sm
          ${is_outgoing 
            ? 'bg-[#eeffde] rounded-lg rounded-br-[4px]' 
            : 'bg-white rounded-lg rounded-bl-[4px]'
          }
        `}
        style={{
          boxShadow: '0 1px 0.5px rgba(0,0,0,0.13)',
        }}
      >
        <p className="text-[15px] text-[#000000] leading-[21px] break-words whitespace-pre-wrap">
          {text}
          {/* Invisible spacer for time */}
          <span className="inline-block w-14"></span>
        </p>
        
        {/* Time and read status */}
        <span className="absolute bottom-[4px] right-[7px] flex items-center gap-[2px]">
          <span className="text-[11px] text-[#5fb452]">
            {timestamp}
          </span>
          {is_outgoing && (
            <svg 
              width="16" 
              height="11" 
              viewBox="0 0 16 11" 
              fill="none" 
              className="text-[#5fb452] ml-[1px]"
            >
              <path 
                d="M1 5.5L4.5 9L11 2" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <path 
                d="M5 5.5L8.5 9L15 2" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
      </div>
    </div>
  );
}

export default Message;