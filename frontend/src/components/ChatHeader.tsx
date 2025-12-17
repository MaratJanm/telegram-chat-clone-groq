function ChatHeader() {
  return (
    <header className="flex items-center px-3 py-2 bg-[#517da2] min-h-[56px]">
      {/* Back button */}
      <button className="p-2 mr-2 text-white/90 hover:text-white transition-colors">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-[#7b5443] flex items-center justify-center text-white font-medium text-lg mr-3 overflow-hidden">
        <span className="font-['Brush_Script_MT',cursive] text-base italic">Hustlers</span>
      </div>
      
      {/* Chat info */}
      <div className="flex-1 min-w-0">
        <h1 className="text-[17px] font-medium text-white truncate leading-tight">
          Hustlers Tech Agency
        </h1>
        <p className="text-[13px] text-white/70 truncate leading-tight">
          1 member
        </p>
      </div>
      
      {/* Menu button */}
      <button className="p-2 text-white/90 hover:text-white transition-colors">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="6" r="1.5" fill="currentColor"/>
          <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
          <circle cx="12" cy="18" r="1.5" fill="currentColor"/>
        </svg>
      </button>
    </header>
  );
}

export default ChatHeader;