
import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, Coins, Star, Trophy, Target, Heart, ShoppingBag, MessageCircle, CalendarCheck } from 'lucide-react';
import { Mission } from '../../types';

interface MissionBoardProps {
  points: number;
  missions: Mission[];
  onBack: () => void;
  onClaim: (id: string) => void;
  onAddPoints: (amount: number) => void;
}

const MissionBoard: React.FC<MissionBoardProps> = ({ points, missions, onBack, onClaim, onAddPoints }) => {
  const [lastCheckIn, setLastCheckIn] = useState<number>(() => {
    return parseInt(localStorage.getItem('together_last_checkin') || '0');
  });

  const canCheckIn = () => {
    const now = new Date();
    const last = new Date(lastCheckIn);
    return now.toDateString() !== last.toDateString();
  };

  const handleCheckIn = () => {
    if (!canCheckIn()) return;
    const now = Date.now();
    setLastCheckIn(now);
    localStorage.setItem('together_last_checkin', now.toString());
    onAddPoints(100);
    alert("Điểm danh thành công! +100 PTS từ quỹ lương của Trác Lẫm.");
  };

  const completedMissions = missions.filter(m => m.current >= m.target && !m.claimed).length;

  const renderMissionIcon = (iconName: string) => {
    switch (iconName) {
      case 'heart': return <Heart size={18} />;
      case 'shopping-bag': return <ShoppingBag size={18} />;
      case 'message-circle': return <MessageCircle size={18} />;
      default: return <Target size={18} />;
    }
  };

  return (
    <div className="fixed inset-0 z-[110] bg-[#F9FAFB] flex flex-col animate-in slide-in-from-right duration-300">
      <div className="p-6 pt-12 flex items-center justify-between border-b bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2.5 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={24} className="text-gray-900" />
          </button>
          <div>
            <h3 className="font-black text-lg uppercase tracking-tight text-gray-900">Bảng Nhiệm Vụ</h3>
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Hôm nay của cô thế nào?</p>
          </div>
        </div>
        <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
          <Trophy size={20} />
        </div>
      </div>

      <div className="p-6 space-y-6 flex-1 overflow-y-auto pb-32 no-scrollbar">
        {/* Daily Check-in Section */}
        <button 
          onClick={handleCheckIn}
          disabled={!canCheckIn()}
          className={`w-full p-6 rounded-[32px] border-2 border-dashed flex items-center justify-between transition-all ${
            canCheckIn() 
              ? 'bg-white border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50/30' 
              : 'bg-gray-50 border-gray-100 opacity-70'
          }`}
        >
          <div className="flex items-center gap-4">
             <div className={`p-4 rounded-2xl ${canCheckIn() ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-400'}`}>
                <CalendarCheck size={24} />
             </div>
             <div className="text-left">
                <h4 className="font-black text-gray-900 text-sm uppercase">Điểm danh ngày mới</h4>
                <p className="text-[10px] font-bold text-gray-400 uppercase">{canCheckIn() ? 'Nhấn để nhận 100 PTS' : 'Đã nhận quà hôm nay'}</p>
             </div>
          </div>
          {canCheckIn() && <div className="bg-yellow-400 text-indigo-900 text-[10px] font-black px-3 py-1 rounded-full animate-bounce shadow-lg">+100 PTS</div>}
        </button>

        {/* Wallet Section */}
        <div className="bg-indigo-900 text-white p-8 rounded-[40px] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform duration-700">
            <Coins size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2 opacity-60">
              <Star size={12} fill="currentColor" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em]">Tài sản tích lũy</p>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-5xl font-black tracking-tighter">{points}</p>
              <p className="text-sm font-bold opacity-60 uppercase">Xu</p>
            </div>
          </div>
        </div>

        {/* Missions List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h4 className="text-[13px] font-black text-gray-400 uppercase tracking-widest">Hoạt động ngày</h4>
            <span className="text-[10px] font-bold text-gray-300">Tự động làm mới</span>
          </div>

          {missions.map(m => {
            const isFinished = m.current >= m.target;
            const progress = (m.current / m.target) * 100;

            return (
              <div 
                key={m.id} 
                className={`p-5 rounded-[32px] border transition-all duration-500 relative overflow-hidden ${
                  m.claimed 
                    ? 'bg-gray-50 border-gray-100 opacity-60' 
                    : isFinished 
                      ? 'bg-white border-indigo-200 shadow-md ring-1 ring-indigo-50' 
                      : 'bg-white border-gray-50 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between relative z-10">
                  <div className="flex items-center gap-4">
                    <div className={`p-4 rounded-2xl transition-colors duration-500 ${
                      m.claimed 
                        ? 'bg-gray-200 text-gray-400' 
                        : isFinished 
                          ? 'bg-indigo-900 text-white shadow-lg' 
                          : 'bg-indigo-50 text-indigo-600'
                    }`}>
                      {renderMissionIcon(m.icon)}
                    </div>
                    <div>
                      <h4 className={`font-black text-[15px] ${m.claimed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                        {m.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="h-1.5 w-32 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                          <div 
                            className={`h-full transition-all duration-1000 ${m.claimed ? 'bg-gray-300' : 'bg-indigo-600'}`} 
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <span className="text-[10px] font-black text-gray-400">{m.current}/{m.target}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    {m.claimed ? (
                      <div className="p-2 bg-green-50 text-green-500 rounded-full">
                        <CheckCircle2 size={28} strokeWidth={2.5} />
                      </div>
                    ) : (
                      <button 
                        onClick={() => onClaim(m.id)} 
                        disabled={!isFinished} 
                        className={`px-6 py-3 rounded-2xl text-[11px] font-black uppercase transition-all ${
                          isFinished 
                            ? 'bg-indigo-900 text-white shadow-xl hover:scale-105 active:scale-95 animate-in fade-in zoom-in' 
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {isFinished ? 'Nhận' : '...'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MissionBoard;
