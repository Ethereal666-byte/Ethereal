
import React, { useMemo } from 'react';
import { useChatLogic, INITIAL_MESSAGE } from '../../hooks/useChatLogic';

// Sub-components
import ChatHeader from '../Chat/ChatHeader';
import MessageList from '../Chat/MessageList';
import ChatInput from '../Chat/ChatInput';
import ProfileModal from '../Chat/ProfileModal';
import PhoneModal from '../Chat/PhoneModal';

const ChatTab: React.FC = () => {
  const {
    messages, setMessages, input, setInput, isThinking, useThinkingMode, setUseThinkingMode,
    showMenu, setShowMenu, showProfile, setShowProfile, charAvatar, userAvatar, bgImage,
    scrollRef, fileInputRef, imageInputRef, affinity,
    handleSend, exportChat, importChat, handleImageUploadInitiate, handleImageFileChange, handleGiveGift,
    isPhoneModalOpen, setIsPhoneModalOpen, isPhoneLocked, setIsPhoneLocked, phonePasscode, setPhonePasscode,
    phoneContent, openPhoneRequest, verifyPasscode
  } = useChatLogic();

  const affinityConfig = useMemo(() => {
    if (affinity < 0) {
      return { 
        label: 'Xa cách', 
        emoji: '❄️', 
        bgColor: 'bg-[#343434]/20', 
        progressColor: 'bg-[#343434]', 
        textColor: 'text-slate-600',
        min: -100,
        max: 0
      };
    }
    if (affinity <= 20) {
      return { 
        label: 'Đã biết', 
        emoji: '🙂❤️', 
        bgColor: 'bg-pink-100', 
        progressColor: 'bg-pink-400', 
        textColor: 'text-pink-600',
        min: 0,
        max: 20
      };
    }
    if (affinity <= 100) {
      return { 
        label: 'Thân thiết', 
        emoji: '😊💖', 
        bgColor: 'bg-orange-50', 
        progressColor: 'bg-[#FFC3A7]', 
        textColor: 'text-orange-600',
        min: 21,
        max: 100
      };
    }
    return { 
      label: 'Gắn kết', 
      emoji: '🥰🔥', 
      bgColor: 'bg-rose-100', 
      progressColor: 'bg-rose-600', 
      textColor: 'text-rose-600',
      min: 101,
      max: 1000,
      glow: true
    };
  }, [affinity]);

  const progressPercentage = useMemo(() => {
    const { min, max } = affinityConfig;
    if (affinity < 0) return Math.min(100, (Math.abs(affinity) / 100) * 100);
    const range = max - min;
    const current = Math.max(0, affinity - min);
    return Math.min(100, (current / range) * 100);
  }, [affinity, affinityConfig]);

  return (
    <div className="flex flex-col h-full relative overflow-hidden bg-white">
      {/* Fixed Top Container */}
      <div className="flex flex-col z-30 shadow-sm">
        <ChatHeader 
          charAvatar={charAvatar}
          showMenu={showMenu}
          setShowMenu={setShowMenu}
          onProfileClick={() => setShowProfile(true)}
          onNewChat={() => setMessages([INITIAL_MESSAGE])}
          onResetChat={() => setMessages([])}
          onUploadInitiate={handleImageUploadInitiate}
          onExport={exportChat}
          onPhoneClick={openPhoneRequest}
          fileInputRef={fileInputRef}
        />

        {/* Affinity Bar UI - Blurred and Fixed */}
        <div className="bg-white/95 backdrop-blur-xl border-b border-gray-100 px-6 py-3 animate-in fade-in slide-in-from-top-2 duration-500">
          <div className="flex items-center justify-between mb-2">
             <div className="flex items-center gap-2">
                <span className="text-sm">{affinityConfig.emoji}</span>
                <span className={`text-[11px] font-black uppercase tracking-widest ${affinityConfig.textColor}`}>
                  {affinityConfig.label}
                </span>
             </div>
             <div className="flex items-center gap-1">
                <span className={`text-[10px] font-black ${affinityConfig.textColor}`}>{affinity}</span>
                <span className="text-[10px] text-gray-300">/</span>
                <span className="text-[10px] text-gray-300 font-bold">{affinityConfig.max}</span>
             </div>
          </div>
          <div className={`h-2.5 w-full ${affinityConfig.bgColor} rounded-full overflow-hidden relative ${affinityConfig.glow ? 'shadow-[0_0_15px_rgba(225,29,72,0.3)]' : ''}`}>
             <div 
               className={`h-full transition-all duration-1000 ease-out relative ${affinityConfig.progressColor}`} 
               style={{ width: `${progressPercentage}%` }}
             >
               {affinityConfig.glow && (
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite]"></div>
               )}
             </div>
          </div>
        </div>
      </div>

      {/* Hidden system inputs */}
      <input type="file" ref={fileInputRef} onChange={importChat} className="hidden" accept=".json" />
      <input type="file" ref={imageInputRef} onChange={handleImageFileChange} className="hidden" accept="image/*" />

      {/* MessageList handles the flexible scroll area */}
      <MessageList 
        messages={messages}
        bgImage={bgImage}
        charAvatar={charAvatar}
        userAvatar={userAvatar}
        isThinking={isThinking}
        scrollRef={scrollRef}
      />

      <ChatInput 
        input={input}
        setInput={setInput}
        onSend={handleSend}
        isThinking={isThinking}
        useThinkingMode={useThinkingMode}
        setUseThinkingMode={setUseThinkingMode}
        onGiveGift={handleGiveGift}
      />

      <ProfileModal 
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
      />

      <PhoneModal 
        isOpen={isPhoneModalOpen}
        isLocked={isPhoneLocked}
        passcode={phonePasscode}
        setPasscode={setPhonePasscode}
        onVerify={verifyPasscode}
        onClose={() => setIsPhoneModalOpen(false)}
        charAvatar={charAvatar}
        phoneContent={phoneContent}
        affinityPoints={affinity}
      />

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default ChatTab;
