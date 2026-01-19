
import React, { useState, useEffect } from 'react';
import { X, Lock, Search, MessageCircle, MapPin, FileText, Coins, Battery, Signal, Wifi } from 'lucide-react';

interface PhoneModalProps {
  isOpen: boolean;
  isLocked: boolean;
  passcode: string;
  setPasscode: (code: string) => void;
  onVerify: (code: string) => boolean;
  onClose: () => void;
  charAvatar: string;
  phoneContent: any;
  affinityPoints: number;
}

const PhoneModal: React.FC<PhoneModalProps> = ({
  isOpen, isLocked, passcode, setPasscode, onVerify, onClose, charAvatar, phoneContent, affinityPoints
}) => {
  const [isShaking, setIsShaking] = useState(false);
  const [activeApp, setActiveApp] = useState<string | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!isLocked) setIsUnlocked(true);
    else setIsUnlocked(false);
  }, [isLocked]);

  const handleNumberClick = (num: string) => {
    if (passcode.length < 4) {
      const newPasscode = passcode + num;
      setPasscode(newPasscode);
      if (newPasscode.length === 4) {
        const success = onVerify(newPasscode);
        if (!success) {
          setIsShaking(true);
          setTimeout(() => {
            setIsShaking(false);
            setPasscode('');
          }, 500);
        }
      }
    }
  };

  // Fix: use the passcode prop directly instead of a functional update as the prop type is (code: string) => void
  const handleDel = () => {
    setPasscode(passcode.slice(0, -1));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-end bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className="absolute inset-0" onClick={onClose}></div>
      
      {/* Phone Frame */}
      <div className="relative w-full h-[92vh] bg-gradient-to-b from-indigo-950 to-black rounded-t-[48px] shadow-[0_-20px_60px_rgba(0,0,0,0.8)] border-[6px] border-[#1a1a1a] flex overflow-hidden text-white animate-in slide-in-from-bottom duration-500">
        
        {/* Dynamic Notch/Status Bar Area */}
        <div className="absolute top-0 left-0 right-0 h-10 flex items-center justify-between px-8 z-[60] pointer-events-none">
           <span className="text-[12px] font-bold tracking-tight">
             {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
           </span>
           <div className="flex items-center gap-1.5 opacity-80">
              <Signal size={12} />
              <Wifi size={12} />
              <Battery size={14} className="rotate-0" />
           </div>
        </div>

        {/* Lock Screen UI */}
        <div className={`absolute inset-0 z-50 flex flex-col bg-black/40 backdrop-blur-[25px] transition-all duration-700 ease-in-out ${isUnlocked ? 'opacity-0 scale-110 pointer-events-none' : 'opacity-100 scale-100'}`}>
          <div className="mt-20 flex flex-col items-center">
            <h1 className="text-7xl font-extralight tracking-tighter text-white/90 mb-2">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </h1>
            <p className="text-sm font-light text-white/40 tracking-widest uppercase">
              {currentTime.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>

          <div className={`flex-1 flex flex-col items-center justify-center p-6 space-y-10 ${isShaking ? 'animate-shake' : ''}`}>
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full border-2 border-[#FFC3A7]/30 p-1 bg-white/5 shadow-[0_0_20px_rgba(255,195,167,0.2)]">
                <img src={charAvatar} className="w-full h-full rounded-full object-cover" alt="Trác Lẫm" />
              </div>
              <p className="text-[10px] text-white/40 font-black tracking-[0.3em] uppercase">Mở khóa để gặp Tổng tài</p>
            </div>

            {/* Passcode Dots */}
            <div className="flex gap-6 shrink-0 h-4">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className={`w-3 h-3 rounded-full border border-white/30 transition-all duration-300 ${passcode.length > i ? 'bg-[#FFC3A7] border-[#FFC3A7] scale-125 shadow-[0_0_15px_rgba(255,195,167,0.8)]' : ''}`}></div>
              ))}
            </div>

            {/* Glassmorphism Keypad */}
            <div className="grid grid-cols-3 gap-y-5 gap-x-8 w-full max-w-[280px] pb-8">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'DEL'].map((num, i) => (
                <button 
                  key={i} 
                  onClick={() => num === 'DEL' ? handleDel() : num !== '' ? handleNumberClick(num.toString()) : null}
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl font-light transition-all active:scale-90 ${num === '' ? 'invisible' : 'bg-white/10 backdrop-blur-md border border-white/5 hover:bg-[#FFC3A7] hover:text-[#343434] shadow-lg'}`}
                >
                  {num === 'DEL' ? <X size={24} className="opacity-60" /> : num}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-10 text-center">
            <X size={20} className="mx-auto text-white/30 cursor-pointer hover:text-white transition-colors" onClick={onClose} />
          </div>
        </div>

        {/* Home Screen UI - Animated Icons */}
        <div className={`flex-1 flex flex-col p-8 overflow-hidden transition-all duration-700 ${isUnlocked ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="flex-1 flex flex-col pt-12">
            {activeApp === null ? (
              <div className="space-y-10">
                {/* Balance & Status Widget (iOS Style) */}
                <div className="grid grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom duration-700 delay-150">
                   <div className="col-span-4 bg-[#FFC3A7] p-5 rounded-[32px] text-[#343434] shadow-xl flex items-center justify-between group overflow-hidden relative">
                      <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
                        <Coins size={100} />
                      </div>
                      <div className="relative z-10">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Tài khoản Trác Thị</p>
                        <h2 className="text-3xl font-black tracking-tighter">99,999,999 Xu</h2>
                      </div>
                      <div className="w-12 h-12 bg-black/10 rounded-2xl flex items-center justify-center">
                        <Coins size={24} />
                      </div>
                   </div>

                   {/* Notes Preview Widget */}
                   <div className="col-span-4 bg-white/10 backdrop-blur-md p-5 rounded-[32px] border border-white/5 shadow-xl animate-in fade-in slide-in-from-bottom duration-700 delay-300">
                      <div className="flex items-center gap-2 mb-3">
                         <div className="w-8 h-8 rounded-xl bg-yellow-400/20 flex items-center justify-center text-yellow-400">
                           <FileText size={16} />
                         </div>
                         <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Ghi chú gần nhất</span>
                      </div>
                      <p className="text-sm font-light italic text-white/80 line-clamp-2">
                        "{phoneContent?.notes || "Ngày... nhớ Ethereal..."}"
                      </p>
                   </div>
                </div>

                {/* App Grid with Staggered Entrance */}
                <div className="grid grid-cols-4 gap-y-10 gap-x-6">
                  <PhoneApp 
                    icon={<Search size={26} className="text-white" />} 
                    label="Safari" 
                    gradient="bg-gradient-to-br from-sky-400/30 to-blue-600/30 border border-white/10" 
                    onClick={() => setActiveApp('safari')} 
                    delay="delay-[400ms]"
                  />
                  <PhoneApp 
                    icon={<MessageCircle size={26} className="text-white" />} 
                    label="Zalo" 
                    gradient="bg-gradient-to-br from-emerald-400/30 to-teal-600/30 border border-white/10" 
                    onClick={() => setActiveApp('zalo')} 
                    delay="delay-[500ms]"
                  />
                  <PhoneApp 
                    icon={<MapPin size={26} className="text-white" />} 
                    label="Maps" 
                    gradient="bg-gradient-to-br from-rose-400/30 to-pink-600/30 border border-white/10" 
                    onClick={() => setActiveApp('maps')} 
                    delay="delay-[600ms]"
                  />
                  <PhoneApp 
                    icon={<FileText size={26} className="text-white" />} 
                    label="Notes" 
                    gradient="bg-gradient-to-br from-amber-400/30 to-orange-600/30 border border-white/10" 
                    onClick={() => setActiveApp('notes')} 
                    delay="delay-[700ms]"
                  />
                </div>
              </div>
            ) : (
              /* App Detailed Content View */
              <div className="flex-1 flex flex-col bg-black/60 rounded-[40px] p-6 animate-in zoom-in-95 duration-500 border border-white/10 backdrop-blur-3xl overflow-hidden shadow-2xl">
                <div className="flex justify-between items-center mb-8 shrink-0">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center">
                         {activeApp === 'safari' && <Search size={16} className="text-blue-400" />}
                         {activeApp === 'zalo' && <MessageCircle size={16} className="text-emerald-400" />}
                         {activeApp === 'balance' && <Coins size={16} className="text-yellow-400" />}
                         {activeApp === 'notes' && <FileText size={16} className="text-amber-400" />}
                         {activeApp === 'maps' && <MapPin size={16} className="text-rose-400" />}
                      </div>
                      <h4 className="font-bold text-[11px] uppercase tracking-[0.25em] text-white/50">{activeApp}</h4>
                   </div>
                   <button onClick={() => setActiveApp(null)} className="px-4 py-1.5 bg-white/5 hover:bg-white/10 rounded-full text-[10px] font-black text-indigo-400 uppercase tracking-widest transition-colors">Đóng</button>
                </div>
                
                <div className="flex-1 overflow-y-auto no-scrollbar space-y-6">
                  {activeApp === 'safari' && (
                    <div className="space-y-5">
                       <div className="bg-white/5 p-4 rounded-2xl flex items-center gap-3 border border-white/5">
                         <Search size={14} className="text-white/40" />
                         <span className="text-xs text-white/60 font-light">Tìm kiếm hoặc nhập URL...</span>
                       </div>
                       <p className="text-[10px] font-black text-white/20 uppercase tracking-widest px-1">Các Tab đang mở</p>
                       {phoneContent?.safari.map((s: string, i: number) => (
                         <div key={i} className="bg-white/5 p-5 rounded-[24px] border border-white/5 flex items-center justify-between hover:bg-white/10 transition-colors cursor-pointer group">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                                <Search size={18} />
                              </div>
                              <span className="text-sm font-light text-white/90">{s}</span>
                           </div>
                           <X size={14} className="opacity-20 group-hover:opacity-100" />
                         </div>
                       ))}
                    </div>
                  )}

                  {activeApp === 'notes' && (
                    <div className="space-y-6">
                       <div className="p-2 border-b border-white/10 pb-4">
                         <p className="text-[10px] text-white/30 font-bold mb-2 tracking-widest uppercase">Thứ Hai, 12 Tháng 1</p>
                         <p className="text-lg font-light leading-relaxed italic text-white/95">
                            "{phoneContent?.notes}"
                         </p>
                       </div>
                       <div className="p-2 space-y-4 opacity-50">
                         <p className="text-[10px] text-white/30 font-bold tracking-widest uppercase">Ghi chú trước đó</p>
                         <div className="h-20 bg-white/5 rounded-2xl border border-white/5"></div>
                       </div>
                    </div>
                  )}

                  {activeApp === 'zalo' && (
                    <div className="space-y-4">
                       {phoneContent?.zalo.map((z: any, i: number) => (
                         <div key={i} className="bg-white/5 p-5 rounded-[28px] border border-white/5 space-y-2 hover:bg-white/10 transition-all cursor-pointer">
                            <div className="flex justify-between items-center">
                              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{z.sender}</p>
                              <span className="text-[9px] text-white/20 font-medium">10:30 AM</span>
                            </div>
                            <p className="text-sm font-light text-white/80 leading-snug">{z.msg}</p>
                         </div>
                       ))}
                    </div>
                  )}

                  {activeApp === 'maps' && (
                    <div className="h-full flex flex-col items-center justify-center space-y-8 py-10 text-center">
                       <div className="relative">
                          <div className="absolute inset-0 bg-rose-500/20 rounded-full blur-3xl animate-pulse"></div>
                          <MapPin size={64} className="text-rose-500 relative" />
                       </div>
                       <div>
                          <p className="text-2xl font-light tracking-tight mb-1 text-white/90">Dinh thự Trác Thị</p>
                          <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em]">Vĩnh Yên • Việt Nam</p>
                       </div>
                       <div className="px-10">
                         <p className="text-xs text-white/60 font-medium italic leading-relaxed">
                           "Nơi đây luôn rộng mở đón cô về, <br/> cho dù cô có chạy trốn bao xa."
                         </p>
                       </div>
                       <button className="px-8 py-3 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all">Chỉ đường</button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Home Indicator Bar */}
          <div 
            className="mt-8 h-1.5 w-32 bg-white/20 rounded-full mx-auto cursor-pointer hover:bg-white/40 transition-all shrink-0 mb-4"
            onClick={() => setActiveApp(null)}
          ></div>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-12px); }
          75% { transform: translateX(12px); }
        }
        .animate-shake {
          animation: shake 0.15s ease-in-out 0s 2;
        }
        .no-scrollbar::-webkit-scrollbar {
          width: 0px;
        }
        .no-scrollbar {
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

const PhoneApp = ({ icon, label, onClick, gradient, delay }: any) => (
  <button 
    onClick={onClick} 
    className={`flex flex-col items-center gap-3 group animate-in slide-in-from-bottom duration-700 ${delay}`}
  >
    <div className={`w-16 h-16 ${gradient} rounded-[24px] flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.3)] group-hover:scale-110 group-active:scale-90 transition-all text-3xl`}>
      {icon}
    </div>
    <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 group-hover:text-white transition-colors text-center">{label}</span>
  </button>
);

export default PhoneModal;
