
import React from 'react';
import { BrainCircuit, Volume2, Sparkles } from 'lucide-react';
import { Message } from '../../types';
import { playTTS } from '../../services/geminiService';

interface MessageListProps {
  messages: Message[];
  bgImage: string;
  charAvatar: string;
  userAvatar: string;
  isThinking: boolean;
  scrollRef: React.RefObject<HTMLDivElement | null>;
}

const MessageList: React.FC<MessageListProps> = ({
  messages, bgImage, charAvatar, userAvatar, isThinking, scrollRef
}) => {
  return (
    <div className="flex-1 overflow-hidden relative">
      <div className="absolute inset-0 bg-cover bg-center z-0 transition-all duration-500" style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="absolute inset-0 bg-black/15 backdrop-blur-[2px]"></div>
      </div>

      <div ref={scrollRef} className="relative z-10 h-full overflow-y-auto p-4 space-y-6 pt-12 no-scrollbar">
        {messages.length > 0 && (
          <div className="flex justify-center mb-8">
            <span className="text-[12px] text-white/80 bg-black/20 backdrop-blur-md px-4 py-1.5 rounded-full italic shadow-sm">Bắt đầu cuộc trò chuyện định mệnh...</span>
          </div>
        )}

        {messages.map((msg) => {
          if (msg.isSystem) {
            return (
              <div key={msg.id} className="flex justify-center my-4 animate-in fade-in zoom-in-95 duration-500">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2 rounded-2xl flex items-center gap-2 shadow-sm">
                  <Sparkles size={14} className="text-yellow-400" />
                  <span className="text-[11px] font-black text-white uppercase tracking-wider">{msg.text}</span>
                </div>
              </div>
            );
          }

          return (
            <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20 shadow-md flex-shrink-0 mb-1">
                <img src={msg.sender === 'user' ? userAvatar : charAvatar} alt="Avatar" className="w-full h-full object-cover" />
              </div>

              <div className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} max-w-[78%]`}>
                {msg.imageUrl && (
                  <div className="mb-2 max-w-[200px] rounded-2xl overflow-hidden shadow-lg border border-white/20 animate-in fade-in zoom-in-95 duration-300">
                    <img src={msg.imageUrl} alt="AI Attachment" className="w-full h-auto" />
                  </div>
                )}
                
                <div className={`p-4 rounded-[20px] shadow-[0_4px_15px_rgba(0,0,0,0.1)] text-[15px] leading-relaxed relative group transition-all whitespace-pre-wrap ${
                  msg.sender === 'user' 
                    ? 'bg-[#9370DB] text-white rounded-br-none' 
                    : msg.isHighlight 
                      ? 'bg-[#FFF0F3] text-gray-800 border border-[#FFC1CC] rounded-bl-none' 
                      : 'bg-white text-gray-800 rounded-bl-none'
                }`}>
                  {msg.isThinking && (
                    <div className="text-[8px] font-bold text-purple-400 mb-1 flex items-center gap-1 uppercase"><BrainCircuit size={10} /> Đã phân tích tâm lý</div>
                  )}
                  {msg.text}
                  {msg.sender === 'ai' && (
                    <button onClick={() => playTTS(msg.text)} className={`absolute -right-8 top-1 opacity-0 group-hover:opacity-100 transition-opacity p-2 text-white/50 hover:text-white drop-shadow-md`}><Volume2 size={14} /></button>
                  )}
                </div>
                <span className="text-[9px] text-white/70 mt-1 px-2 font-medium drop-shadow-sm">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          );
        })}
        {isThinking && (
          <div className="flex items-end gap-2 flex-row">
            <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm"></div>
            <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-bounce delay-75"></span>
              <span className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-bounce delay-150"></span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageList;
