
import React, { useState, useEffect, useRef } from 'react';
import { Settings, UserPen, Heart, LogOut, ChevronRight, Star, Camera, X, Gift } from 'lucide-react';
import { GiftHistoryEntry } from '../../types';

const STORAGE_KEYS = {
  HISTORY: 'together_chat_history',
  MEMES: 'together_user_memes',
  USER_AVATAR: 'together_user_avatar',
  GIFT_HISTORY: 'together_gift_history',
  AFFINITY: 'together_affinity'
};

const ProfileTab: React.FC = () => {
  const [chatCount, setChatCount] = useState(0);
  const [memeCount, setMemeCount] = useState(0);
  const [affinity, setAffinity] = useState(520);
  const [giftHistory, setGiftHistory] = useState<GiftHistoryEntry[]>([]);
  const [showGallery, setShowGallery] = useState(false);
  const [userAvatar, setUserAvatar] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.USER_AVATAR) || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aria&backgroundColor=ffdfbf';
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const history = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (history) setChatCount(JSON.parse(history).length);

    const memes = localStorage.getItem(STORAGE_KEYS.MEMES);
    if (memes) setMemeCount(JSON.parse(memes).length);

    const giftSaved = localStorage.getItem(STORAGE_KEYS.GIFT_HISTORY);
    if (giftSaved) setGiftHistory(JSON.parse(giftSaved));

    const affSaved = localStorage.getItem(STORAGE_KEYS.AFFINITY);
    if (affSaved) setAffinity(parseInt(affSaved));
  }, []);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setUserAvatar(dataUrl);
      localStorage.setItem(STORAGE_KEYS.USER_AVATAR, dataUrl);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-y-auto pb-32 no-scrollbar">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />

      <div className="relative pt-16 pb-8 px-6 bg-gradient-to-b from-purple-100 to-white">
        <div className="flex flex-col items-center">
          <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
            <div className="w-28 h-28 rounded-full border-4 border-white shadow-xl overflow-hidden bg-purple-200 flex items-center justify-center transition-transform active:scale-95">
              <img src={userAvatar} className="w-full h-full object-cover" alt="User Avatar" />
            </div>
            <div className="absolute bottom-1 right-1 bg-indigo-600 w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110">
              <Camera size={14} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-indigo-900 mt-4">Ethereal</h2>
          <div className="flex items-center gap-1.5 mt-2 bg-pink-100 px-3 py-1 rounded-full border border-pink-200">
             <Heart size={10} fill="#ff4d6d" className="text-[#ff4d6d]" />
             <span className="text-[10px] font-black text-pink-600 uppercase tracking-widest">{affinity} Affinity</span>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-6">
        <div className="bg-white p-5 rounded-[28px] flex items-center justify-around shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-gray-50">
          <div className="text-center">
            <p className="text-xl font-extrabold text-indigo-600">120</p>
            <p className="text-[9px] text-gray-400 uppercase font-bold tracking-tighter">Ngày yêu</p>
          </div>
          <div className="w-px h-8 bg-gray-100"></div>
          <div className="text-center">
            <p className="text-xl font-extrabold text-indigo-600">{chatCount}</p>
            <p className="text-[9px] text-gray-400 uppercase font-bold tracking-tighter">Lần Chat</p>
          </div>
          <div className="w-px h-8 bg-gray-100"></div>
          <div className="text-center">
            <p className="text-xl font-extrabold text-indigo-600">{giftHistory.length}</p>
            <p className="text-[9px] text-gray-400 uppercase font-bold tracking-tighter">Kỷ niệm</p>
          </div>
        </div>

        <div className="space-y-3">
          <ProfileButton icon={<UserPen size={20} />} label="Đổi cách xưng hô" />
          <ProfileButton icon={<Heart size={20} />} label="Tùy chỉnh Trác Lẫm" />
          <ProfileButton 
            icon={<Star size={20} />} 
            label="Phòng trưng bày kỷ niệm" 
            onClick={() => setShowGallery(true)}
          />
          <ProfileButton icon={<Settings size={20} />} label="Cài đặt hệ thống" />
        </div>
      </div>

      {showGallery && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col animate-in slide-in-from-bottom duration-500">
           <div className="p-6 pt-12 flex items-center justify-between border-b">
              <div className="flex items-center gap-3">
                 <Star size={24} className="text-yellow-500" />
                 <h3 className="font-black text-lg uppercase tracking-tight">Kỷ Niệm Của Hai Ta</h3>
              </div>
              <button onClick={() => setShowGallery(false)} className="p-2 bg-gray-100 rounded-full"><X size={20} /></button>
           </div>
           <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar pb-32">
              {giftHistory.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                   <Gift size={64} className="mb-4" />
                   <p className="font-bold">Chưa có kỷ niệm nào được lưu giữ...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {giftHistory.map(gift => (
                    <div key={gift.id} className="bg-white p-5 rounded-[32px] border border-gray-50 shadow-sm flex items-center gap-6">
                       <div className="text-4xl p-5 bg-indigo-50 rounded-[24px]">{gift.icon}</div>
                       <div className="flex-1">
                          <h4 className="font-black text-gray-900 uppercase text-sm mb-1">{gift.name}</h4>
                          <p className="text-[10px] text-gray-400 font-bold mb-1">Tặng vào {new Date(gift.timestamp).toLocaleDateString()}</p>
                          <div className="flex items-center gap-1.5 text-pink-500">
                             <Heart size={10} fill="currentColor" />
                             <span className="text-[10px] font-black">+{gift.affinityGained} Độ thân thiết</span>
                          </div>
                       </div>
                    </div>
                  ))}
                </div>
              )}
           </div>
        </div>
      )}

      <div className="mt-auto px-6 pb-24 pt-10">
        <button className="w-full flex items-center justify-center gap-2 p-4 text-red-500 font-bold text-sm bg-red-50 rounded-2xl hover:bg-red-100 transition-colors active:scale-[0.98]">
          <LogOut size={18} /> Đăng xuất không gian
        </button>
      </div>
    </div>
  );
};

const ProfileButton = ({ icon, label, onClick }: any) => (
  <button onClick={onClick} className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-[22px] hover:bg-gray-100 transition-all group active:scale-[0.98]">
    <div className="flex items-center gap-3">
      <div className="bg-white p-2.5 rounded-xl text-indigo-400 shadow-sm">{icon}</div>
      <span className="text-sm font-bold text-gray-700">{label}</span>
    </div>
    <ChevronRight size={18} className="text-gray-300 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
  </button>
);

export default ProfileTab;
