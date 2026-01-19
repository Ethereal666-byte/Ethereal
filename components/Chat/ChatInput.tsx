
import React, { useState, useEffect } from 'react';
import { PlusCircle, Send, BrainCircuit, Gift, X, Heart } from 'lucide-react';
import { InventoryItem } from '../../types';

interface ChatInputProps {
  input: string;
  setInput: (val: string) => void;
  onSend: () => void;
  isThinking: boolean;
  useThinkingMode: boolean;
  setUseThinkingMode: (val: boolean) => void;
  onGiveGift: (item: InventoryItem) => void;
}

interface GiftEffect {
  id: number;
  icon: string;
}

const ChatInput: React.FC<ChatInputProps> = ({
  input, setInput, onSend, isThinking, useThinkingMode, setUseThinkingMode, onGiveGift
}) => {
  const [showGifts, setShowGifts] = useState(false);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [activeEffects, setActiveEffects] = useState<GiftEffect[]>([]);

  useEffect(() => {
    if (showGifts) {
      const saved = localStorage.getItem('together_inventory');
      if (saved) setInventory(JSON.parse(saved));
    }
  }, [showGifts]);

  const handleGiftClick = (item: InventoryItem) => {
    const effectId = Date.now();
    setActiveEffects(prev => [...prev, { id: effectId, icon: item.icon }]);
    
    setTimeout(() => {
      setActiveEffects(prev => prev.filter(e => e.id !== effectId));
    }, 1500);

    onGiveGift(item);
    setShowGifts(false);
    
    const newInv = inventory.map(i => i.id === item.id ? { ...i, count: i.count - 1 } : i).filter(i => i.count > 0);
    localStorage.setItem('together_inventory', JSON.stringify(newInv));
  };

  return (
    <div className="p-4 bg-white border-t border-gray-50 pb-4 z-[100] relative shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
      {/* Flying Gift Animation Effects */}
      <div className="absolute inset-x-0 bottom-full pointer-events-none overflow-visible">
        {activeEffects.map(effect => (
          <div 
            key={effect.id} 
            className="absolute left-6 bottom-4 flex flex-col items-center animate-gift-fly z-[110]"
          >
            <div className="text-3xl mb-1">{effect.icon}</div>
            <Heart size={16} fill="#ec4899" className="text-pink-500 animate-ping" />
          </div>
        ))}
      </div>

      {showGifts && (
        <div className="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-[32px] shadow-2xl border border-gray-100 p-6 animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex justify-between items-center mb-4 px-1">
             <div className="flex items-center gap-2">
                <Gift size={16} className="text-indigo-600" />
                <h4 className="font-black text-[11px] uppercase tracking-widest text-gray-900">Quà tặng của cô</h4>
             </div>
             <button onClick={() => setShowGifts(false)} className="p-1 hover:bg-gray-100 rounded-full"><X size={16} /></button>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {inventory.filter(i => i.count > 0).length === 0 ? (
              <p className="text-[11px] font-bold text-gray-400 italic py-4">Cô chưa có quà nào để tặng Trác Lẫm cả...</p>
            ) : (
              inventory.filter(i => i.count > 0).map(item => (
                <button 
                  key={item.id} 
                  onClick={() => handleGiftClick(item)}
                  className="flex flex-col items-center shrink-0 group"
                >
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-indigo-50 group-hover:scale-105 transition-all mb-2 border border-transparent group-hover:border-indigo-100">
                    {item.icon}
                  </div>
                  <span className="text-[9px] font-black uppercase text-gray-900 max-w-[60px] truncate text-center">{item.name}</span>
                  <span className="text-[8px] font-bold text-gray-400">x{item.count}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <button 
          onClick={() => setShowGifts(!showGifts)}
          className={`p-2 rounded-full transition-colors relative ${showGifts ? 'bg-indigo-100 text-indigo-600' : 'text-gray-400 hover:text-indigo-600'}`}
        >
          <Gift size={24} />
          {activeEffects.length > 0 && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-pink-500 rounded-full animate-ping"></span>
          )}
        </button>
        <div className="flex-1 bg-[#F3E5F5] rounded-full px-4 py-2.5 flex items-center border border-transparent focus-within:border-purple-200 transition-all shadow-inner">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onSend()}
            placeholder="Nói gì đó với anh ấy..."
            className="flex-1 bg-transparent border-none focus:outline-none text-sm text-gray-800 placeholder:text-gray-400 font-medium"
          />
        </div>
        <button onClick={onSend} disabled={!input.trim() || isThinking} className="bg-[#9370DB] text-white p-2.5 rounded-full disabled:opacity-50 active:scale-90 transition-transform shadow-lg"><Send size={18} /></button>
      </div>
      <div className="flex justify-center mt-3">
        <button onClick={() => setUseThinkingMode(!useThinkingMode)} className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider transition-all ${useThinkingMode ? 'bg-indigo-600 text-white shadow-sm' : 'bg-gray-100 text-gray-400'}`}>
          <BrainCircuit size={10} />Chế độ sâu sắc {useThinkingMode ? 'BẬT' : 'TẮT'}
        </button>
      </div>

      <style>{`
        @keyframes gift-fly {
          0% {
            transform: translateY(0) scale(0.5);
            opacity: 0;
          }
          20% {
            opacity: 1;
            transform: translateY(-20px) scale(1.2);
          }
          100% {
            transform: translateY(-120px) scale(0.8);
            opacity: 0;
          }
        }
        .animate-gift-fly {
          animation: gift-fly 1.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ChatInput;
