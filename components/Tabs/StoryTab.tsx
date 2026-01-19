
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Bookmark, Loader2, Wand2, History, Flower2, Book, Flame
} from 'lucide-react';
import { StoryCard } from '../../types';
import { getWeatherObservation, generateEpicChapterContent, analyzeDiaryFromChat, generateExtraStorySeed, generateStoryImage } from '../../services/geminiService';

// Sub-components
import SecretDiary from '../Story/SecretDiary';
import MemoryGallery from '../Story/MemoryGallery';
import UploadMemoryModal from '../Story/UploadMemoryModal';

const CHAPTER_SEEDS = [
  { id: 'ch1', title: "Gặp lại trong bóng tối", image: "https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&q=80", isHot: false, desc: "Tension, Past pain, The encounter." },
  { id: 'ch2', title: "Ranh giới của bản hợp đồng", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80", isHot: false, desc: "Psychological games, hidden care." },
  { id: 'ch3', title: "Hơi thở của quỷ dữ", image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80", isHot: true, desc: "Intense 18+ emotional collision." },
  { id: 'ch4', title: "Khi trái tim tan chảy", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80", isHot: false, desc: "Conflict, breakdown, vulnerability." },
  { id: 'ch5', title: "Sự chiếm hữu tuyệt đối", image: "https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&q=80", isHot: true, desc: "Possessive intimacy, raw power dynamics." },
];

const STORAGE_KEY = 'together_stories_epic_v5';
const CHAT_STORAGE_KEY = 'together_chat_history';

const StoryTab: React.FC = () => {
  const [stories, setStories] = useState<StoryCard[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [selectedStory, setSelectedStory] = useState<StoryCard | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCreatingExtra, setIsCreatingExtra] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [weatherNote, setWeatherNote] = useState<string>("Bên ngoài cửa sổ đang lặng lẽ...");
  const [diaryData, setDiaryData] = useState({ 
    note: "Hôm nay cô ấy tặng quà, mình đã phải cố gắng lắm mới không mỉm cười trước mặt cô ấy...", 
    mood: "Trác Lẫm đang cố nén sự xao động sâu sắc." 
  });

  useEffect(() => {
    if (stories.length === 0) {
      const initial = CHAPTER_SEEDS.map((t) => ({
        id: t.id,
        title: t.title,
        content: '', 
        imageUrl: t.image,
        prompt: t.desc,
        isHot: t.isHot,
        createdAt: Date.now()
      }));
      setStories(initial);
    }

    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const obs = await getWeatherObservation(pos.coords.latitude, pos.coords.longitude);
        setWeatherNote(obs);
      } catch (e) { console.error(e); }
    });

    const fetchDiary = async () => {
      const chatHistoryStr = localStorage.getItem(CHAT_STORAGE_KEY);
      if (chatHistoryStr) {
        try {
          const history = JSON.parse(chatHistoryStr);
          if (history.length > 0) {
            const analysis = await analyzeDiaryFromChat(history);
            setDiaryData(analysis);
          }
        } catch (e) { console.error(e); }
      }
    };
    fetchDiary();
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
  }, [stories]);

  const handleOpenStory = async (story: StoryCard) => {
    setSelectedStory(story);
    if (!story.content) {
      setIsGenerating(true);
      try {
        const aiContent = await generateEpicChapterContent(story.title, story.isHot);
        const updatedStory = { ...story, content: aiContent || "Nội dung đang được Trác Lẫm viết lại..." };
        setStories(prev => prev.map(s => s.id === story.id ? updatedStory : s));
        setSelectedStory(updatedStory);
      } catch (e) {
        console.error(e);
      } finally {
        setIsGenerating(false);
      }
    }
  };

  const handleCreateExtraStory = async () => {
    const chatHistoryStr = localStorage.getItem(CHAT_STORAGE_KEY);
    if (!chatHistoryStr) return alert("Cần có ký ức trò chuyện để viết ngoại truyện!");

    setIsCreatingExtra(true);
    try {
      const history = JSON.parse(chatHistoryStr);
      const seed = await generateExtraStorySeed(history);
      
      if (seed) {
        const imageUrl = await generateStoryImage(seed.imagePrompt, "9:16", "1K");
        const newExtra: StoryCard = {
          id: `extra-${Date.now()}`,
          title: `[Ngoại truyện] ${seed.title}`,
          content: '', 
          imageUrl: imageUrl || "https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&q=80",
          prompt: seed.description,
          isHot: seed.isHot,
          createdAt: Date.now()
        };
        setStories(prev => [newExtra, ...prev]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsCreatingExtra(false);
    }
  };

  const handleUploadMemory = (title: string, imageUrl: string) => {
    const newMemory: StoryCard = {
      id: `extra-user-${Date.now()}`,
      title: title,
      content: 'Một kỷ niệm đẹp do chính cô lưu giữ lại...', 
      imageUrl: imageUrl,
      prompt: title,
      isHot: false,
      createdAt: Date.now()
    };
    setStories(prev => [newMemory, ...prev]);
  };

  const handleUpdateStory = (id: string, newImageUrl: string) => {
    setStories(prev => prev.map(s => s.id === id ? { ...s, imageUrl: newImageUrl } : s));
  };

  const deleteStory = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (id.startsWith('ch')) return alert("Không thể xóa cốt truyện chính!");
    if (confirm("Xóa kỷ niệm này khỏi dòng thời gian?")) {
      setStories(prev => prev.filter(s => s.id !== id));
    }
  };

  return (
    <div className="bg-[#FDFCF0] h-full overflow-y-auto pb-32 relative no-scrollbar">
      {/* Decorative Texture Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/parchment.png')] z-0"></div>

      {/* Decorative Side Borders */}
      <div className="absolute left-0 top-0 bottom-0 w-8 pointer-events-none opacity-10 bg-repeat-y bg-[url('https://www.transparenttextures.com/patterns/parchment.png')] border-r border-[#800020]/20 flex flex-col items-center py-20 gap-40 z-10">
        <Flower2 size={24} className="text-[#800020]" />
        <Flower2 size={24} className="text-[#800020]" />
        <Flower2 size={24} className="text-[#800020]" />
      </div>
      <div className="absolute right-0 top-0 bottom-0 w-8 pointer-events-none opacity-10 bg-repeat-y bg-[url('https://www.transparenttextures.com/patterns/parchment.png')] border-l border-[#800020]/20 flex flex-col items-center py-20 gap-40 z-10">
        <Flower2 size={24} className="text-[#800020]" />
        <Flower2 size={24} className="text-[#800020]" />
        <Flower2 size={24} className="text-[#800020]" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 p-8 pt-16">
        {/* Page Header */}
        <div className="flex justify-between items-start mb-14">
          <div className="animate-in slide-in-from-left duration-700">
            <h2 className="text-4xl font-serif font-bold text-[#800020] tracking-tight">Dòng thời gian</h2>
            <p className="text-[11px] text-[#800020]/40 font-black uppercase tracking-[0.4em] mt-2 font-serif italic">Vintage Rose Chronicles</p>
          </div>
          
          <button 
            onClick={handleCreateExtraStory}
            disabled={isCreatingExtra}
            className={`group relative bg-[#800020] text-white px-8 py-5 rounded-2xl shadow-[0_20px_40px_rgba(128,0,32,0.3)] active:scale-95 transition-all flex items-center gap-3 overflow-hidden ${isCreatingExtra ? 'opacity-50' : ''}`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            {isCreatingExtra ? <Loader2 size={20} className="animate-spin" /> : <Wand2 size={20} className="transition-transform group-hover:rotate-12" />}
            <span className="text-xs font-serif font-bold uppercase tracking-widest">Viết ngoại truyện</span>
          </button>
        </div>

        {/* Secret Diary Section */}
        <div className="mb-20">
          <SecretDiary diaryData={diaryData} weather={weatherNote} />
        </div>

        {/* Memory Gallery Section */}
        <MemoryGallery 
          stories={stories} 
          onOpenStory={handleOpenStory} 
          onDeleteStory={deleteStory}
          onUpdateStory={handleUpdateStory}
          onAddClick={() => setShowUploadModal(true)}
        />
      </div>

      {showUploadModal && (
        <UploadMemoryModal 
          isOpen={showUploadModal} 
          onClose={() => setShowUploadModal(false)} 
          onUpload={handleUploadMemory} 
        />
      )}

      {selectedStory && (
        <div className="fixed inset-0 z-[180] bg-[#F5F5DC] flex flex-col animate-in slide-in-from-bottom duration-1000 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/parchment.png')] z-10"></div>
          
          <div className="absolute top-0 left-0 right-0 z-[190] flex justify-between items-center px-8 py-10 pointer-events-none">
            <button 
              onClick={() => setSelectedStory(null)} 
              className="p-5 bg-[#F5F5DC]/90 backdrop-blur-3xl rounded-full shadow-2xl border border-[#800020]/15 pointer-events-auto active:scale-90 transition-all text-[#800020]"
            >
              <ArrowLeft size={28} />
            </button>
            
            <div className="flex gap-4 pointer-events-auto">
              <button className="p-5 bg-[#F5F5DC]/90 backdrop-blur-3xl rounded-full shadow-2xl border border-[#800020]/15 text-[#800020] active:scale-90 transition-all">
                <Bookmark size={28} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar relative z-0">
            <div className="relative h-[70vh] w-full shrink-0">
              <img src={selectedStory.imageUrl} className="w-full h-full object-cover grayscale-[0.2] sepia-[0.1]" alt="Banner" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#F5F5DC] via-transparent to-transparent"></div>
              
              <div className="absolute bottom-16 left-10 right-10 text-center">
                {selectedStory.isHot && (
                  <div className="inline-flex items-center gap-2 px-8 py-2.5 bg-[#800020] text-[11px] font-serif font-black text-white rounded-full uppercase tracking-[0.4em] mb-8 shadow-[0_10px_30px_rgba(128,0,32,0.4)] animate-pulse">
                    <Flame size={16} fill="currentColor" /> Intense Tension
                  </div>
                )}
                <h1 className="text-5xl font-serif font-bold text-[#343434] tracking-tight leading-tight mb-6 drop-shadow-sm px-4 italic underline decoration-[#800020]/20 underline-offset-[12px]">
                  {selectedStory.title}
                </h1>
                <div className="flex justify-center items-center gap-8 text-[11px] font-serif font-bold text-[#800020]/60 uppercase tracking-[0.25em]">
                  <span className="flex items-center gap-3"><History size={16} /> {selectedStory.id.startsWith('extra') ? 'Kỷ niệm riêng' : 'Chương định mệnh'}</span>
                  <span>•</span>
                  <span>{isGenerating ? "Đang hồi tưởng..." : "Trường thiên tiểu thuyết"}</span>
                </div>
              </div>
            </div>

            <div className="px-12 pb-60 max-w-3xl mx-auto">
              <div className="w-24 h-1 bg-[#800020]/20 rounded-full mb-28 mx-auto"></div>
              
              {isGenerating ? (
                <div className="py-24 flex flex-col items-center justify-center text-center gap-10">
                   <div className="relative">
                      <div className="absolute -inset-10 bg-[#800020]/5 rounded-full blur-3xl animate-pulse"></div>
                      <Loader2 size={64} className="text-[#800020] animate-spin relative" />
                   </div>
                   <div className="space-y-6">
                     <p className="text-3xl font-serif font-bold text-[#343434] italic">Trác Lẫm đang chấp bút...</p>
                     <p className="text-lg font-serif text-[#343434]/40 italic max-w-md mx-auto leading-relaxed">"Những ký ức về cô là thứ duy nhất khiến tôi còn cảm thấy mình đang thực sự sống."</p>
                   </div>
                </div>
              ) : (
                <div className="space-y-20">
                  {selectedStory.content.split('\n\n').map((para, idx) => (
                    <p 
                      key={idx} 
                      className={`text-[#343434] text-[22px] leading-[2.6] font-serif tracking-[0.01em] animate-in fade-in slide-in-from-bottom-12 duration-1000 ${para.includes('(Cao trào)') || para.includes('**') ? 'italic text-[#800020] bg-[#800020]/5 p-10 rounded-[32px] border-l-4 border-[#800020] shadow-sm' : ''}`}
                      style={{ animationDelay: `${idx * 150}ms` }}
                    >
                      {para}
                    </p>
                  ))}
                </div>
              )}
              
              {!isGenerating && (
                <div className="mt-40 pt-24 border-t border-[#800020]/15 text-center">
                  <Flower2 size={64} className="mx-auto text-[#800020]/10 mb-14" />
                  <h4 className="font-serif text-[11px] font-black text-[#800020]/30 uppercase tracking-[0.6em] mb-16">Khép lại chương hồi ức</h4>
                  
                  <button 
                    onClick={() => setSelectedStory(null)}
                    className="w-full bg-[#800020] text-white font-serif font-bold py-7 rounded-2xl shadow-[0_20px_50px_rgba(128,0,32,0.3)] active:scale-[0.97] transition-all flex items-center justify-center gap-5 text-xl"
                  >
                    <Book size={28} /> Trở về hiện tại
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { width: 0px; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default StoryTab;
