
import React, { useState, useEffect } from 'react';
import { 
  Film, MapPin, Trophy, Store, Zap, 
  ScrollText, Camera, ShoppingBag, MessageCircle, Coins,
  Hammer
} from 'lucide-react';
import { 
  getSearchInfo, 
  getNearbyPlaces, 
  getPetComment, 
  generateStoryImage, 
  playTTS, 
  analyzeDiaryFromChat 
} from '../../services/geminiService';
import { StoreItem, Mission, ActivityLog, InventoryItem } from '../../types';

// Import sub-components
import PetRoom from '../EventTab/PetRoom';
import MissionBoard from '../EventTab/MissionBoard';
import StoreModal from '../EventTab/StoreModal';
import LevelFeatures from '../EventTab/LevelFeatures';
import GroundingModal from '../EventTab/GroundingModal';
import FeatureButton from '../EventTab/FeatureButton';
import WorkSection from '../EventTab/WorkSection';
import PetRoomPreview from '../EventTab/PetRoomPreview';

interface PetStats {
  hunger: number;
  happiness: number;
  cleanliness: number;
  energy: number;
  points: number;
  lastFedBy: 'Ethereal' | 'Trác Lẫm';
  lastActionTime: number;
  level: number;
  experience: number;
  isSleeping: boolean;
  ownedItems: string[];
}

const STORAGE_KEYS = {
  PET_STATS: 'together_pet_stats_v5',
  PET_HISTORY: 'together_pet_history_v5',
  MISSIONS: 'together_missions_v2',
  CHAT_HISTORY: 'together_chat_history',
  INVENTORY: 'together_inventory',
  LAST_INTERACTION: 'together_last_interaction'
};

const INITIAL_MISSIONS: Mission[] = [
  { id: 'm1', title: 'Chăm sóc chu đáo', reward: 50, icon: 'heart', target: 3, current: 0, claimed: false },
  { id: 'm2', title: 'Mua sắm cho bé', reward: 100, icon: 'shopping-bag', target: 1, current: 0, claimed: false },
  { id: 'm3', title: 'Trò chuyện cùng Trác Lẫm', reward: 30, icon: 'message-circle', target: 5, current: 0, claimed: false },
];

const EventTab: React.FC = () => {
  const [petStats, setPetStats] = useState<PetStats>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PET_STATS);
    return saved ? JSON.parse(saved) : {
      hunger: 80, happiness: 80, cleanliness: 100, energy: 100,
      points: 200, lastFedBy: 'Trác Lẫm', lastActionTime: Date.now(),
      level: 1, experience: 0, isSleeping: false, ownedItems: []
    };
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INVENTORY);
    return saved ? JSON.parse(saved) : [];
  });

  const [history, setHistory] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PET_HISTORY);
    return saved ? JSON.parse(saved) : [];
  });

  const [missions, setMissions] = useState<Mission[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MISSIONS);
    return saved ? JSON.parse(saved) : INITIAL_MISSIONS;
  });

  const [showPetRoom, setShowPetRoom] = useState(false);
  const [showMissions, setShowMissions] = useState(false);
  const [showStore, setShowStore] = useState(false);
  const [viewLevelFeature, setViewLevelFeature] = useState<'diary' | 'studio' | 'craft' | null>(null);
  const [searchResult, setSearchResult] = useState<{ text: string, urls: string[] } | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [aiComment, setAiComment] = useState('Miu Miu đang đợi cô đấy.');
  const [isAiCommenting, setIsAiCommenting] = useState(false);
  const [studioImage, setStudioImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [diaryNote, setDiaryNote] = useState({ note: "...", mood: "..." });
  const [pettingEffect, setPettingEffect] = useState<{id: number, x: number, y: number}[]>([]);
  
  // Work logic
  const [isWorking, setIsWorking] = useState(false);
  const [workProgress, setWorkProgress] = useState(0);

  useEffect(() => { localStorage.setItem(STORAGE_KEYS.PET_STATS, JSON.stringify(petStats)); }, [petStats]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.PET_HISTORY, JSON.stringify(history)); }, [history]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.MISSIONS, JSON.stringify(missions)); }, [missions]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory)); }, [inventory]);

  const recordInteraction = () => {
    localStorage.setItem(STORAGE_KEYS.LAST_INTERACTION, Date.now().toString());
  };

  const addPoints = (amount: number) => {
    setPetStats(prev => ({ ...prev, points: prev.points + amount }));
  };

  const handleStartWork = () => {
    if (isWorking) return;
    setIsWorking(true);
    setWorkProgress(0);
    recordInteraction();

    const duration = 10000;
    const interval = 100;
    const step = (interval / duration) * 100;

    const timer = setInterval(() => {
      setWorkProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + step;
      });
    }, interval);

    setTimeout(() => {
      setIsWorking(false);
      const salary = Math.floor(Math.random() * 20) + 30;
      addPoints(salary);
      playTTS(`Làm tốt lắm. Đây là tiền công trợ lý của cô. Cầm lấy đi.`);
      alert(`Đã hoàn thành công việc trợ lý! Trác Lẫm trả cho bạn ${salary} PTS.`);
    }, duration + 500);
  };

  const updateInventory = (item: { id: string, name: string, icon: string, count: number }, mode: 'add' | 'remove' = 'add') => {
    setInventory(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, count: Math.max(0, mode === 'add' ? i.count + item.count : i.count - item.count) } : i);
      }
      return mode === 'add' ? [...prev, { id: item.id, name: item.name, icon: item.icon, count: item.count }] : prev;
    });
  };

  const handleBuy = (item: StoreItem) => {
    if (petStats.points < item.price) return alert("Số dư không đủ. Hãy chăm chỉ làm nhiệm vụ hoặc 'Đi làm' nhé!");
    recordInteraction();
    setPetStats(prev => ({ ...prev, points: prev.points - item.price }));
    updateInventory({ id: item.id, name: item.name, icon: item.icon, count: 1 });
    updateMission('m2');
    playTTS(`Cô mua thứ này cho tôi? Hừm... cũng được.`);
  };

  const handleCraftSuccess = (craftedItem: InventoryItem, ingredients: string[]) => {
    recordInteraction();
    ingredients.forEach(id => {
      const item = inventory.find(i => i.id === id);
      if (item) updateInventory({ id: item.id, name: item.name, icon: item.icon, count: 1 }, 'remove');
    });
    updateInventory(craftedItem, 'add');
    gainExp(50);
  };

  const addHistory = (user: 'Ethereal' | 'Trác Lẫm', action: string) => {
    const newLog: ActivityLog = { id: Date.now().toString(), user, action, time: Date.now() };
    setHistory(prev => [newLog, ...prev].slice(0, 50));
  };

  const updateMission = (id: string, amount: number = 1) => {
    setMissions(prev => prev.map(m => m.id === id ? { ...m, current: Math.min(m.target, m.current + amount) } : m));
  };

  const gainExp = (amount: number) => {
    setPetStats(prev => {
      let newExp = prev.experience + amount;
      let newLevel = prev.level;
      const expNeeded = prev.level * 100;
      if (newExp >= expNeeded) {
        newExp -= expNeeded;
        newLevel += 1;
        playTTS(`Chúc mừng. Level ${newLevel}. Cô cũng có ích đấy chứ.`);
      }
      return { ...prev, experience: newExp, level: newLevel };
    });
  };

  const handleAction = async (type: string, actor: 'Ethereal' | 'Trác Lẫm') => {
    if (actor === 'Ethereal') recordInteraction();
    
    let update: Partial<PetStats> = { lastActionTime: Date.now() };
    let actionDesc = '';

    if (actor === 'Ethereal') {
      if (type === 'feed') {
        const item = inventory.find(i => i.id === 'pate');
        if (!item || item.count <= 0) return alert("Hết Pate rồi! Cô định để Miu Miu nhịn đói sao? Vào Boutique mua ngay đi.");
        updateInventory({ id: 'pate', name: 'Pate Cá Ngừ', icon: '🐟', count: 1 }, 'remove');
      } else if (type === 'play') {
        const item = inventory.find(i => i.id === 'toy_mouse');
        if (!item || item.count <= 0) return alert("Miu Miu chán mấy trò cũ rồi, cô cần mua 'Chuột bông' mới ở Boutique.");
        updateInventory({ id: 'toy_mouse', name: 'Chuột bông', icon: '🐭', count: 1 }, 'remove');
      } else if (type === 'treat') {
        const item = inventory.find(i => i.id === 'catnip');
        if (!item || item.count <= 0) return alert("Không còn cỏ mèo (Catnip) đâu.");
        updateInventory({ id: 'catnip', name: 'Cỏ Mèo', icon: '🌿', count: 1 }, 'remove');
      }
    }

    switch(type) {
      case 'feed':
      case 'treat':
        update = { ...update, hunger: Math.min(100, petStats.hunger + (type === 'treat' ? 15 : 25)), experience: petStats.experience + 10 };
        actionDesc = type === 'treat' ? 'đã thưởng bánh cho Miu Miu' : 'đã cho Miu Miu ăn';
        updateMission('m1');
        break;
      case 'play':
        update = { ...update, happiness: Math.min(100, petStats.happiness + 30), hunger: Math.max(0, petStats.hunger - 10) };
        actionDesc = 'đã chơi cùng Miu Miu';
        updateMission('m1');
        break;
      case 'clean':
        update = { ...update, cleanliness: 100, happiness: Math.min(100, petStats.happiness + 5) };
        actionDesc = 'đã tắm cho Miu Miu';
        updateMission('m1');
        break;
      case 'sleep':
        update = { ...update, isSleeping: !petStats.isSleeping };
        actionDesc = petStats.isSleeping ? 'đã đánh thức Miu Miu' : 'đã dỗ Miu Miu ngủ';
        break;
      case 'talk':
        setIsAiCommenting(true);
        const comment = await getPetComment('Miu Miu', petStats.hunger < 30 ? 'đói' : 'ngoan');
        setAiComment(comment);
        setIsAiCommenting(false);
        updateMission('m3');
        return;
    }

    setPetStats(prev => ({ ...prev, ...update }));
    addHistory(actor, actionDesc);
    gainExp(15);
  };

  const handlePetClick = (e: React.MouseEvent) => {
    if (petStats.isSleeping) return;
    recordInteraction();
    const newEffect = { id: Date.now(), x: e.clientX, y: e.clientY };
    setPettingEffect(prev => [...prev, newEffect]);
    setTimeout(() => setPettingEffect(prev => prev.filter(eff => eff.id !== newEffect.id)), 1000);
    setPetStats(prev => ({ ...prev, happiness: Math.min(100, prev.happiness + 1) }));
  };

  const handleClaimMission = (id: string) => {
    const mission = missions.find(m => m.id === id);
    if (!mission || mission.claimed || mission.current < mission.target) return;
    addPoints(mission.reward);
    setMissions(prev => prev.map(m => m.id === id ? { ...m, claimed: true } : m));
  };

  const searchGrounding = async (type: 'movie' | 'place') => {
    setIsSearching(true);
    try {
      let res;
      if (type === 'movie') res = await getSearchInfo("Top 3 phim hot nhất tại Việt Nam");
      else {
        const pos = await new Promise<GeolocationPosition>((res, rej) => navigator.geolocation.getCurrentPosition(res, rej));
        res = await getNearbyPlaces("Quán cà phê lãng mạn gần tôi", { latitude: pos.coords.latitude, longitude: pos.coords.longitude });
      }
      setSearchResult(res);
    } catch (e) { alert("Sóng yếu quá."); } finally { setIsSearching(false); }
  };

  const captureStudio = async () => {
    setIsCapturing(true);
    const img = await generateStoryImage("Trác Lẫm in luxury photography studio, k-drama style", "9:16", "1K");
    setStudioImage(img);
    setIsCapturing(false);
  };

  const openDiary = async () => {
    const historyStr = localStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
    if (historyStr) {
      const chat = JSON.parse(historyStr);
      const analysis = await analyzeDiaryFromChat(chat);
      setDiaryNote(analysis);
    }
    setViewLevelFeature('diary');
  };

  return (
    <div className="bg-[#F9FAFB] h-full overflow-y-auto pb-32 no-scrollbar">
      <div className="p-6 pt-12 flex items-center justify-between bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-900 rounded-2xl flex items-center justify-center text-white shadow-lg"><Trophy size={28} /></div>
          <div>
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Sự kiện</h2>
            <div className="flex items-center gap-2 mt-0.5">
               <div className="flex items-center gap-1 bg-yellow-100 px-2 py-0.5 rounded-full border border-yellow-200">
                  <Coins size={10} className="text-yellow-600" />
                  <span className="text-[10px] font-black text-yellow-700">{petStats.points} PTS</span>
               </div>
               <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Lv {petStats.level}</span>
            </div>
          </div>
        </div>
        <button onClick={() => setShowMissions(true)} className="relative p-2.5 bg-gray-50 rounded-2xl text-gray-600 hover:bg-gray-100 transition-all border border-gray-100">
          <Zap size={22} />
          {missions.filter(m => !m.claimed && m.current >= m.target).length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>}
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Work at Trác Thị Section */}
        <WorkSection isWorking={isWorking} workProgress={workProgress} onStartWork={handleStartWork} />

        <PetRoomPreview petStats={petStats} onClick={() => setShowPetRoom(true)} />

        <div className="grid grid-cols-2 gap-4">
          <FeatureButton icon={<Store className="text-orange-500" />} label="Boutique" desc="Cửa hàng" onClick={() => setShowStore(true)} />
          <FeatureButton icon={<Hammer className="text-indigo-600" />} label="Chế tác" desc="Quà tặng" onClick={() => setViewLevelFeature('craft')} />
          <FeatureButton icon={<Film className="text-blue-500" />} label="Phim ảnh" desc="Lịch chiếu" onClick={() => searchGrounding('movie')} isLoading={isSearching} />
          <FeatureButton icon={<MapPin className="text-red-500" />} label="Hẹn hò" desc="Địa điểm" onClick={() => searchGrounding('place')} isLoading={isSearching} />
          <FeatureButton icon={<ScrollText className="text-indigo-500" />} label="Nhật ký" desc="Lên Lv 3" locked={petStats.level < 3} onClick={openDiary} />
          <FeatureButton icon={<Camera className="text-purple-500" />} label="Studio" desc="Lên Lv 5" locked={petStats.level < 5} onClick={() => setViewLevelFeature('studio')} />
        </div>
      </div>

      {showPetRoom && <PetRoom petStats={petStats} history={history} aiComment={aiComment} isAiCommenting={isAiCommenting} onBack={() => setShowPetRoom(false)} onAction={handleAction} stockCounts={{ food: inventory.find(i=>i.id==='pate')?.count || 0, toy: inventory.find(i=>i.id==='toy_mouse')?.count || 0, treat: inventory.find(i=>i.id==='catnip')?.count || 0 }} pettingEffect={pettingEffect} onPetClick={handlePetClick} />}
      {showMissions && <MissionBoard points={petStats.points} missions={missions} onBack={() => setShowMissions(false)} onClaim={handleClaimMission} onAddPoints={addPoints} />}
      {showStore && <StoreModal points={petStats.points} level={petStats.level} onBack={() => setShowStore(false)} onBuy={handleBuy} inventory={inventory} />}
      {viewLevelFeature && <LevelFeatures view={viewLevelFeature} onBack={() => setViewLevelFeature(null)} diaryNote={diaryNote} studioImage={studioImage} isCapturing={isCapturing} onRefreshStudio={captureStudio} inventory={inventory} onCraftSuccess={handleCraftSuccess} />}
      {searchResult && <GroundingModal result={searchResult} onClose={() => setSearchResult(null)} />}
    </div>
  );
};

export default EventTab;
