
import React, { useState, useEffect, useRef } from 'react';
import { 
  Coffee, UserRoundCog, Clock, Sparkles, Image as ImageIcon, 
  Plus, X, Trash2, Tag, CloudRain, RefreshCw, 
  Download, Upload, Edit2, Check
} from 'lucide-react';
import { IconMeme } from '../../types';
import { getWeatherObservation, generateDailyGreeting } from '../../services/geminiService';

const STORAGE_KEYS = {
  HERO_IMAGE: 'trac_lam_hero_bg',
  MEMES: 'together_user_memes',
  CHAT_HISTORY: 'together_chat_history',
  GREETING_CACHE: 'together_home_greeting_cache',
  CHAR_AVATAR: 'together_char_avatar',
  USER_AVATAR: 'together_user_avatar'
};

const CACHE_DURATION = 3 * 60 * 1000; // 3 phút

const HomeTab: React.FC = () => {
  // --- States ---
  const [heroImage, setHeroImage] = useState<string>(() => 
    localStorage.getItem(STORAGE_KEYS.HERO_IMAGE) || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80'
  );
  
  const [memes, setMemes] = useState<IconMeme[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MEMES);
    return saved ? JSON.parse(saved) : [];
  });

  const [userAvatar, setUserAvatar] = useState<string>(() => 
    localStorage.getItem(STORAGE_KEYS.USER_AVATAR) || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aria&backgroundColor=ffdfbf'
  );

  const [tracLamAvatar, setTracLamAvatar] = useState<string>(() => 
    localStorage.getItem(STORAGE_KEYS.CHAR_AVATAR) || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4'
  );

  const [currentMessage, setCurrentMessage] = useState('Đang chờ Trác Lẫm nhắn nhủ...');
  const [isEditingMessage, setIsEditingMessage] = useState(false);
  const [isMessageLoading, setIsMessageLoading] = useState(false);
  const [weatherNote, setWeatherNote] = useState<string | null>(null);
  const [showMemeManager, setShowMemeManager] = useState(false);
  const [isAddingMeme, setIsAddingMeme] = useState(false);
  const [newMemeTags, setNewMemeTags] = useState('');
  const [newMemeNote, setNewMemeNote] = useState('');
  
  // --- Refs ---
  const memeUploadRef = useRef<HTMLInputElement>(null);
  const jsonImportRef = useRef<HTMLInputElement>(null);
  const userAvatarRef = useRef<HTMLInputElement>(null);
  const tracLamAvatarRef = useRef<HTMLInputElement>(null);

  // --- Effects ---
  useEffect(() => {
    fetchAiGreeting(false);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const obs = await getWeatherObservation(pos.coords.latitude, pos.coords.longitude);
        setWeatherNote(obs);
      } catch (e) { console.error(e); }
    });
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEMES, JSON.stringify(memes));
  }, [memes]);

  // --- Logic Functions ---
  const fetchAiGreeting = async (forceRefresh = false) => {
    if (!forceRefresh) {
      const cachedData = localStorage.getItem(STORAGE_KEYS.GREETING_CACHE);
      if (cachedData) {
        const { message, timestamp } = JSON.parse(cachedData);
        if (Date.now() - timestamp < CACHE_DURATION) {
          setCurrentMessage(message);
          return;
        }
      }
    }

    setIsMessageLoading(true);
    try {
      const historyStr = localStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
      const history = historyStr ? JSON.parse(historyStr) : [];
      const greeting = await generateDailyGreeting(history);
      setCurrentMessage(greeting);
      updateGreetingCache(greeting);
    } catch (e) {
      setCurrentMessage("Đừng làm việc quá sức, tôi không muốn vợ mình trông nhợt nhạt.");
    } finally {
      setIsMessageLoading(false);
    }
  };

  const updateGreetingCache = (msg: string) => {
    localStorage.setItem(STORAGE_KEYS.GREETING_CACHE, JSON.stringify({
      message: msg,
      timestamp: Date.now()
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, target: 'hero' | 'user' | 'traclam') => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (target === 'hero') {
        setHeroImage(dataUrl);
        localStorage.setItem(STORAGE_KEYS.HERO_IMAGE, dataUrl);
      } else if (target === 'user') {
        setUserAvatar(dataUrl);
        localStorage.setItem(STORAGE_KEYS.USER_AVATAR, dataUrl);
      } else if (target === 'traclam') {
        setTracLamAvatar(dataUrl);
        localStorage.setItem(STORAGE_KEYS.CHAR_AVATAR, dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddMeme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const newMeme: IconMeme = {
        id: Date.now().toString(),
        dataUrl,
        tags: newMemeTags.split(',').map(t => t.trim().toLowerCase()).filter(t => t),
        note: newMemeNote
      };
      setMemes(prev => [newMeme, ...prev]);
      setIsAddingMeme(false);
      setNewMemeTags('');
      setNewMemeNote('');
    };
    reader.readAsDataURL(file);
    if (memeUploadRef.current) memeUploadRef.current.value = '';
  };

  const deleteMeme = (id: string) => {
    if (confirm("Xóa icon này khỏi bộ sưu tập?")) {
      setMemes(prev => prev.filter(m => m.id !== id));
    }
  };

  const exportHomeLayout = () => {
    const fullConfig = {
      heroImage,
      userAvatar,
      tracLamAvatar,
      memeGallery: memes,
      statusNote: currentMessage,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(fullConfig, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Home_Layout_${new Date().getTime()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importHomeLayout = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.heroImage) { setHeroImage(data.heroImage); localStorage.setItem(STORAGE_KEYS.HERO_IMAGE, data.heroImage); }
        if (data.userAvatar) { setUserAvatar(data.userAvatar); localStorage.setItem(STORAGE_KEYS.USER_AVATAR, data.userAvatar); }
        if (data.tracLamAvatar) { setTracLamAvatar(data.tracLamAvatar); localStorage.setItem(STORAGE_KEYS.CHAR_AVATAR, data.tracLamAvatar); }
        if (data.memeGallery) { setMemes(data.memeGallery); localStorage.setItem(STORAGE_KEYS.MEMES, JSON.stringify(data.memeGallery)); }
        if (data.statusNote) {
          setCurrentMessage(data.statusNote);
          localStorage.setItem(STORAGE_KEYS.GREETING_CACHE, JSON.stringify({ message: data.statusNote, timestamp: Date.now() }));
        }
        alert("Phục hồi giao diện thành công!");
      } catch (err) { alert("Lỗi định dạng JSON."); }
    };
    reader.readAsText(file);
  };

  const StatCard = ({ label, value, icon: Icon }: { label: string, value: string, icon: any }) => (
    <div className="flex-1 bg-white/90 backdrop-blur-md p-4 rounded-[24px] flex flex-col items-center gap-2 shadow-sm border border-purple-100">
      <Icon className="text-[#343434]" size={20} />
      <div className="text-center">
        <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">{label}</p>
        <p className="font-bold text-[#343434] text-[15px]">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="bg-[#343434] h-full overflow-y-auto pb-32 no-scrollbar">
      {/* Hidden Inputs */}
      <input type="file" id="hero-image-input" onChange={(e) => handleFileChange(e, 'hero')} className="hidden" accept="image/*" />
      <input type="file" ref={userAvatarRef} onChange={(e) => handleFileChange(e, 'user')} className="hidden" accept="image/*" />
      <input type="file" ref={tracLamAvatarRef} onChange={(e) => handleFileChange(e, 'traclam')} className="hidden" accept="image/*" />
      <input type="file" ref={jsonImportRef} onChange={importHomeLayout} className="hidden" accept=".json" />

      {/* 1. Header & Hero Area */}
      <div 
        className="relative h-[440px] w-full cursor-pointer group overflow-hidden bg-[#CFC0F5]"
        onClick={() => document.getElementById('hero-image-input')?.click()}
      >
        <img 
          src={heroImage} 
          alt="Trác Lẫm Hero Avatar" 
          className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110 opacity-90" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#CFC0F5] via-[#CFC0F5]/20 to-transparent"></div>
        
        {/* Avatars on Cover */}
        <div className="absolute bottom-8 left-6 right-6 flex items-end justify-between z-10">
          <div className="flex -space-x-3">
            <div 
              onClick={(e) => { e.stopPropagation(); tracLamAvatarRef.current?.click(); }}
              className="w-16 h-16 rounded-full border-2 border-white shadow-xl overflow-hidden bg-[#343434] relative group/avatar transition-transform hover:scale-105"
            >
              <img src={tracLamAvatar} className="w-full h-full object-cover" alt="Trác Lẫm Avatar" />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition-opacity">
                <ImageIcon size={14} className="text-white" />
              </div>
            </div>
            <div 
              onClick={(e) => { e.stopPropagation(); userAvatarRef.current?.click(); }}
              className="w-16 h-16 rounded-full border-2 border-white shadow-xl overflow-hidden bg-[#CFC0F5] relative group/avatar transition-transform hover:scale-105"
            >
              <img src={userAvatar} className="w-full h-full object-cover" alt="User Avatar" />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition-opacity">
                <ImageIcon size={14} className="text-white" />
              </div>
            </div>
          </div>
          <div className="text-right pb-1 pointer-events-none">
            <h2 className="text-[#343434] text-[24px] font-black tracking-tight leading-none">Trác Lẫm</h2>
            <p className="text-[10px] font-bold text-[#343434]/70 uppercase tracking-widest mt-1">Dinh thự Trác Thị</p>
          </div>
        </div>
      </div>

      {/* 2. Main Content Area */}
      <div className="px-6 py-8 bg-[#CFC0F5] rounded-t-[40px] -mt-10 relative z-20 min-h-[60vh]">
        
        {/* Greeting Section */}
        <div className="mb-8">
          <p className="text-[#343434]/60 text-[13px] font-bold uppercase tracking-wider mb-1">Chào ngày mới, Ethereal ✨</p>
          <h1 className="text-[32px] font-black text-[#343434] leading-tight">Mừng cô trở về</h1>
        </div>

        {/* Status Note Area */}
        <div className="bg-[#FFC3A7] rounded-[15px] p-6 border border-[#343434]/10 shadow-lg mb-8 relative group transition-all hover:shadow-xl">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-[#343434] p-2 rounded-xl">
                <Coffee className="text-[#FFC3A7]" size={18} />
              </div>
              <h3 className="font-black text-[#343434] text-xs uppercase tracking-widest">Status Note</h3>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setIsEditingMessage(!isEditingMessage)}
                className="p-2 bg-[#343434]/10 hover:bg-[#343434]/20 rounded-full text-[#343434] transition-colors"
              >
                {isEditingMessage ? <Check size={16} /> : <Edit2 size={16} />}
              </button>
              <button 
                onClick={() => fetchAiGreeting(true)}
                disabled={isMessageLoading}
                className="p-2 bg-[#343434]/10 hover:bg-[#343434]/20 rounded-full text-[#343434] transition-colors"
              >
                <RefreshCw size={16} className={isMessageLoading ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>
          
          {isEditingMessage ? (
            <textarea 
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onBlur={() => { setIsEditingMessage(false); updateGreetingCache(currentMessage); }}
              className="w-full bg-white/20 border-none focus:ring-2 ring-[#343434]/20 rounded-xl p-3 text-[14px] text-[#343434] font-bold leading-relaxed resize-none h-24 placeholder-[#343434]/40"
              autoFocus
            />
          ) : (
            <p className={`text-[15px] text-[#343434] leading-relaxed font-bold italic ${isMessageLoading ? 'opacity-40' : 'opacity-100'}`}>
              "{currentMessage}"
            </p>
          )}
        </div>

        {/* Weather Widget */}
        {weatherNote && (
          <div className="mb-8 bg-white/60 backdrop-blur-sm p-4 rounded-[20px] flex items-center gap-4 border border-white/40">
             <div className="bg-[#343434] p-2.5 rounded-xl text-white">
                <CloudRain size={20} />
             </div>
             <p className="text-[12px] text-[#343434] font-bold italic leading-snug">
               {weatherNote}
             </p>
          </div>
        )}

        <div className="flex gap-4 mb-8">
          <StatCard label="QUAN HỆ" value="Hợp đồng" icon={UserRoundCog} />
          <StatCard label="GẶP LẠI" value="120 ngày" icon={Clock} />
        </div>

        {/* Feature Tiles */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-2 mb-2">
            <h2 className="text-[18px] font-black text-[#343434] uppercase tracking-tighter">Bộ công cụ</h2>
            <Sparkles size={16} className="text-[#343434]" />
          </div>

          <button 
            onClick={() => setShowMemeManager(true)}
            className="w-full bg-white p-5 rounded-[24px] flex justify-between items-center shadow-md border border-white hover:bg-gray-50 transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-4">
               <div className="bg-[#CFC0F5] p-3 rounded-2xl text-[#343434]"><ImageIcon size={22} /></div>
               <div className="text-left">
                  <p className="font-black text-[#343434] text-sm uppercase tracking-tight">Kho Meme & Icons</p>
                  <p className="text-[10px] text-gray-400 font-bold">{memes.length} tệp đã lưu trữ</p>
               </div>
            </div>
            <Plus size={20} className="text-gray-300" />
          </button>

          <button 
            onClick={exportHomeLayout}
            className="w-full bg-white p-5 rounded-[24px] flex justify-between items-center shadow-md border border-white hover:bg-gray-50 transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-4">
               <div className="bg-[#FFC3A7] p-3 rounded-2xl text-[#343434]"><Download size={22} /></div>
               <div className="text-left">
                  <p className="font-black text-[#343434] text-sm uppercase tracking-tight">Xuất bản sao JSON</p>
                  <p className="text-[10px] text-gray-400 font-bold">Đóng gói dữ liệu</p>
               </div>
            </div>
            <Plus size={20} className="text-gray-300" />
          </button>

          <button 
            onClick={() => jsonImportRef.current?.click()}
            className="w-full bg-[#343434] p-5 rounded-[24px] flex justify-between items-center shadow-xl border border-gray-700 hover:bg-[#404040] transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-4">
               <div className="bg-[#CFC0F5] p-3 rounded-2xl text-[#343434]"><Upload size={22} /></div>
               <div className="text-left">
                  <p className="font-black text-white text-sm uppercase tracking-tight">Nhập cấu hình JSON</p>
                  <p className="text-[10px] text-gray-400 font-bold">Phục hồi nhanh</p>
               </div>
            </div>
            <Plus size={20} className="text-gray-500" />
          </button>
        </div>
      </div>

      {/* Meme Manager Modal */}
      {showMemeManager && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#343434]/80 backdrop-blur-md" onClick={() => setShowMemeManager(false)}></div>
          <div className="relative w-full max-w-lg bg-white rounded-[40px] overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <h3 className="text-2xl font-black text-[#343434] uppercase tracking-tighter">Kho Icon</h3>
              <button onClick={() => setShowMemeManager(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"><X size={24} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
              {isAddingMeme ? (
                <div className="bg-white p-6 rounded-[32px] shadow-sm border border-indigo-50 space-y-4 animate-in zoom-in-95 duration-200">
                  <div className="flex items-center gap-2 text-[#343434] font-black mb-2 uppercase text-sm">
                    <ImageIcon size={20} /> <span>Thêm Icon mới</span>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase mb-2 block px-1">Tags (cách nhau bởi dấu phẩy)</label>
                      <input 
                        type="text" 
                        placeholder="vui, ghen, dỗi..." 
                        value={newMemeTags}
                        onChange={(e) => setNewMemeTags(e.target.value)}
                        className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 ring-[#CFC0F5] outline-none font-bold" 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase mb-2 block px-1">Ghi chú (Note)</label>
                      <input 
                        type="text" 
                        placeholder="Trác Lẫm khi dỗi..." 
                        value={newMemeNote}
                        onChange={(e) => setNewMemeNote(e.target.value)}
                        className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 ring-[#CFC0F5] outline-none font-bold" 
                      />
                    </div>
                    <div className="flex gap-4 pt-4">
                      <button onClick={() => setIsAddingMeme(false)} className="flex-1 py-4 text-gray-400 font-black uppercase text-xs">Hủy</button>
                      <button onClick={() => memeUploadRef.current?.click()} className="flex-1 bg-[#343434] text-white py-4 rounded-2xl font-black uppercase text-xs shadow-lg active:scale-95 transition-all">Chọn ảnh</button>
                      <input type="file" ref={memeUploadRef} onChange={handleAddMeme} className="hidden" accept="image/*" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  <button 
                    onClick={() => setIsAddingMeme(true)}
                    className="aspect-square border-4 border-dashed border-[#CFC0F5] rounded-[30px] flex flex-col items-center justify-center text-[#CFC0F5] hover:bg-[#CFC0F5]/10 transition-all gap-2"
                  >
                    <Plus size={36} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Thêm</span>
                  </button>
                  {memes.map(meme => (
                    <div key={meme.id} className="relative aspect-square rounded-[30px] overflow-hidden group shadow-md bg-white border border-gray-100">
                      <img src={meme.dataUrl} className="w-full h-full object-cover" alt="Meme" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button onClick={() => deleteMeme(meme.id)} className="p-3 bg-red-500 text-white rounded-full shadow-lg transform scale-0 group-hover:scale-100 transition-transform"><Trash2 size={18} /></button>
                      </div>
                      {meme.tags.length > 0 && (
                        <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-1 pointer-events-none">
                          <div className="bg-[#343434]/80 backdrop-blur-sm px-2 py-0.5 rounded-full text-[8px] font-black text-white border border-white/20 uppercase tracking-tighter">
                            {meme.tags[0]}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-8 bg-white border-t border-gray-100 flex justify-center">
              <p className="text-[11px] text-gray-400 text-center font-bold italic leading-relaxed">
                Các icon này sẽ xuất hiện ngẫu nhiên trong Chat <br/> dựa trên từ khóa tâm trạng của Trác Lẫm.
              </p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        body {
          background-color: #343434;
        }
        ::-webkit-scrollbar {
          width: 0px;
        }
      `}</style>
    </div>
  );
};

export default HomeTab;
