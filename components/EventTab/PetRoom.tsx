
import React, { useEffect, useRef } from 'react';
import { X, Heart, Cookie, Bath, RefreshCw, ShieldCheck, User, Utensils, Gamepad2, Sparkle, Scissors, MessageSquare, Sun, Moon, Award, Eye } from 'lucide-react';
import MiuMiuAvatar from './MiuMiuAvatar';

const StatBar = ({ label, value, icon: Icon, color }: any) => (
  <div className="flex flex-col gap-1 flex-1">
    <div className="flex justify-between items-center px-1">
      <div className="flex items-center gap-1 text-[8px] font-black text-gray-400 uppercase"><Icon size={9} className={color} /> {label}</div>
      <span className="text-[8px] font-black text-gray-500">{Math.round(value)}%</span>
    </div>
    <div className="h-1 bg-gray-100 rounded-full overflow-hidden shadow-inner">
      <div className={`h-full transition-all duration-1000 ${color.replace('text-', 'bg-')}`} style={{ width: `${value}%` }}></div>
    </div>
  </div>
);

const PetActionButton = ({ icon, label, onClick, color, disabled, count }: any) => {
  const isOutOfStock = count === 0;
  
  return (
    <button 
      onClick={onClick} 
      disabled={disabled || isOutOfStock} 
      className={`flex-1 flex flex-col items-center gap-2 p-1 transition-all relative ${disabled || isOutOfStock ? 'opacity-40 grayscale-[0.5]' : 'hover:scale-105 active:scale-95'}`}
    >
      <div className={`p-4 ${isOutOfStock ? 'bg-gray-400' : color} text-white rounded-2xl shadow-md relative`}>
        {icon}
        {count !== undefined && (
          <div className={`absolute -top-1.5 -right-1.5 text-[8px] font-black px-1.5 py-0.5 rounded-full border shadow-sm min-w-[16px] text-center ${isOutOfStock ? 'bg-red-500 text-white border-red-400' : 'bg-white text-gray-900 border-gray-100'}`}>
            {count}
          </div>
        )}
      </div>
      <span className={`text-[9px] font-black uppercase tracking-tighter ${isOutOfStock ? 'text-red-400' : 'text-gray-400'}`}>
        {isOutOfStock ? "Hết đồ" : label}
      </span>
    </button>
  );
};

interface PetRoomProps {
  petStats: any;
  history: any[];
  aiComment: string;
  isAiCommenting: boolean;
  onBack: () => void;
  onAction: (action: any, actor: 'Ethereal' | 'Trác Lẫm') => void;
  stockCounts: { food: number; toy: number; treat: number };
  pettingEffect: any[];
  onPetClick: (e: React.MouseEvent) => void;
}

const PetRoom: React.FC<PetRoomProps> = ({ petStats, history, aiComment, isAiCommenting, onBack, onAction, stockCounts, pettingEffect, onPetClick }) => {
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (petStats.isSleeping) {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      return;
    }

    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);

    idleTimerRef.current = setTimeout(() => {
      if (!petStats.isSleeping) {
        onAction('feed', 'Trác Lẫm');
      }
    }, 15000);

    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [petStats.lastActionTime, petStats.isSleeping]);

  const getRelativeTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    if (diff < 60000) return "vừa xong";
    return `${Math.floor(diff / 60000)}p trước`;
  };

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col animate-in slide-in-from-bottom duration-500 ${petStats.isSleeping ? 'bg-[#0f172a]' : 'bg-[#FFF9F5]'}`}>
      <div className="p-6 pt-12 flex items-center justify-between sticky top-0 z-20">
        <button onClick={onBack} className="p-3 bg-white/20 backdrop-blur-md rounded-full">
          <X size={24} className={petStats.isSleeping ? 'text-white' : 'text-gray-700'} />
        </button>
        <div className="text-center">
          <h3 className={`font-black text-lg ${petStats.isSleeping ? 'text-white' : 'text-gray-900'}`}>Căn hộ Miu Miu</h3>
          <div className="flex items-center justify-center gap-1.5">
            <Eye size={10} className={petStats.isSleeping ? 'text-white/40' : 'text-indigo-400 animate-pulse'} />
            <p className={`text-[8px] font-bold uppercase ${petStats.isSleeping ? 'text-white/40' : 'text-gray-400'}`}>
              Trác Lẫm đang quan sát...
            </p>
          </div>
        </div>
        <div className="w-12 h-12 opacity-0 pointer-events-none" />
      </div>
      
      <div className="flex-1 overflow-y-auto px-6 py-4 pb-32 no-scrollbar">
        <div className="mb-6 bg-white/50 backdrop-blur-sm p-4 rounded-[32px] border border-white/20">
          <div className="flex justify-between items-center mb-2 px-1">
             <div className="flex items-center gap-2">
                <Award size={16} className="text-indigo-600" />
                <span className="text-[11px] font-black text-indigo-900 uppercase tracking-wider">Miu Miu Lv.{petStats.level}</span>
             </div>
             <span className="text-[9px] font-bold text-gray-500 uppercase">{petStats.experience} / {petStats.level * 100} EXP</span>
          </div>
          <div className="h-2 bg-gray-200/50 rounded-full overflow-hidden">
             <div className="h-full bg-indigo-600 transition-all duration-700" style={{ width: `${(petStats.experience/(petStats.level * 100))*100}%` }}></div>
          </div>
        </div>
        
        <div className="relative w-full aspect-[4/5] rounded-[60px] flex flex-col items-center justify-center transition-all duration-1000 shadow-2xl mb-6 bg-white" 
             onClick={onPetClick}>
           <MiuMiuAvatar stats={petStats} />
           {pettingEffect.map(eff => <div key={eff.id} className="absolute pointer-events-none animate-ping text-red-500" style={{ left: eff.x - 16, top: eff.y - 16 }}><Heart size={32} fill="currentColor" /></div>)}
           <div className="absolute top-10 left-8 right-8 flex gap-3">
              <StatBar label="No" value={petStats.hunger} icon={Cookie} color="text-orange-500" />
              <StatBar label="Vui" value={petStats.happiness} icon={Heart} color="text-pink-500" />
              <StatBar label="Sạch" value={petStats.cleanliness} icon={Bath} color="text-blue-500" />
           </div>
        </div>

        <div className="p-5 rounded-[28px] shadow-lg mb-6 bg-white border border-orange-50 min-h-[70px] flex items-center transition-all">
           <p className="text-sm italic font-medium leading-relaxed text-gray-700">
             {isAiCommenting ? <span className="animate-pulse">Trác Lẫm đang nói...</span> : `"${aiComment}"`}
           </p>
        </div>

        <div className="mb-6 space-y-2">
           <div className="flex items-center gap-2 px-2 mb-2">
              <RefreshCw size={12} className="text-indigo-400 animate-spin-slow" />
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Hoạt động gần đây</span>
           </div>
           {history.slice(0, 3).map((log) => (
              <div key={log.id} className="bg-white/60 backdrop-blur-sm p-3 rounded-2xl flex items-center gap-3 border border-white shadow-sm animate-in fade-in slide-in-from-left-2">
                 <div className={`p-1.5 rounded-lg ${log.user === 'Trác Lẫm' ? 'bg-indigo-900 text-white' : 'bg-pink-100 text-pink-500'}`}>
                    {log.user === 'Trác Lẫm' ? <ShieldCheck size={14} /> : <User size={14} />}
                 </div>
                 <div className="flex-1">
                    <p className="text-[11px] font-bold text-gray-700">
                       <span className={log.user === 'Trác Lẫm' ? 'text-indigo-900 font-black' : 'text-pink-500'}>{log.user}</span> {log.action}
                    </p>
                 </div>
                 <span className="text-[9px] font-bold text-gray-400 uppercase">{getRelativeTime(log.time)}</span>
              </div>
           ))}
           {history.length === 0 && <p className="text-[10px] text-center text-gray-400 italic">Chưa có hoạt động...</p>}
        </div>
        
        <div className="grid grid-cols-4 gap-3 mb-8">
           <PetActionButton icon={<Utensils size={18} />} label="Ăn" onClick={() => onAction('feed', 'Ethereal')} color="bg-orange-500" disabled={petStats.isSleeping} count={stockCounts.food} />
           <PetActionButton icon={<Gamepad2 size={18} />} label="Chơi" onClick={() => onAction('play', 'Ethereal')} color="bg-pink-500" disabled={petStats.isSleeping} count={stockCounts.toy} />
           <PetActionButton icon={<Bath size={18} />} label="Tắm" onClick={() => onAction('clean', 'Ethereal')} color="bg-blue-500" disabled={petStats.isSleeping} />
           <PetActionButton icon={<Sparkle size={18} />} label="Xoa" onClick={() => onAction('massage', 'Ethereal')} color="bg-teal-500" disabled={petStats.isSleeping} />
           <PetActionButton icon={<Scissors size={18} />} label="Tỉa" onClick={() => onAction('groom', 'Ethereal')} color="bg-indigo-400" disabled={petStats.isSleeping} />
           <PetActionButton icon={<MessageSquare size={18} />} label="Hỏi" onClick={() => onAction('talk', 'Ethereal')} color="bg-purple-500" disabled={petStats.isSleeping} />
           <PetActionButton icon={<Cookie size={18} />} label="Bánh" onClick={() => onAction('treat', 'Ethereal')} color="bg-rose-500" disabled={petStats.isSleeping} count={stockCounts.treat} />
           <PetActionButton icon={petStats.isSleeping ? <Sun size={18} /> : <Moon size={18} />} label={petStats.isSleeping ? "Dậy" : "Ngủ"} onClick={() => onAction('sleep', 'Ethereal')} color="bg-indigo-900" />
        </div>
      </div>
    </div>
  );
};

export default PetRoom;
