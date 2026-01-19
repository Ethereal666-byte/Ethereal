
import React, { useState } from 'react';
// Added Camera to the lucide-react imports
import { X, Loader2, RefreshCw, Hammer, Box, Sparkles, Wand2, ArrowRight, Camera } from 'lucide-react';
import { InventoryItem } from '../../types';

interface LevelFeaturesProps {
  view: 'diary' | 'studio' | 'craft';
  onBack: () => void;
  diaryNote?: { note: string; mood: string };
  studioImage?: string | null;
  isCapturing?: boolean;
  onRefreshStudio?: () => void;
  inventory: InventoryItem[];
  onCraftSuccess: (craftedItem: InventoryItem, usedIngredients: string[]) => void;
}

const RECIPES = [
  { 
    id: 'happy_choc', name: 'Chocolate Hạnh Phúc', icon: '💝',
    ingredients: [{ id: 'raw_choc', count: 1 }, { id: 'raw_coffee', count: 1 }],
    desc: 'Ngọt ngào kèm chút đắng, Trác Lẫm sẽ thích.'
  },
  { 
    id: 'premium_scarf', name: 'Khăn Len Cao Cấp', icon: '🧣',
    ingredients: [{ id: 'raw_wool', count: 1 }, { id: 'raw_paper', count: 1 }],
    desc: 'Hộp quà gói ghém tình cảm chân thành.'
  },
  { 
    id: 'handmade_tie', name: 'Cavat Thủ Công', icon: '👔',
    ingredients: [{ id: 'raw_silk', count: 1 }, { id: 'raw_paper', count: 1 }],
    desc: 'Lụa là thượng hạng cho vị CEO lạnh lùng.'
  },
  { 
    id: 'miu_pillow', name: 'Gối Ngủ Miu Miu', icon: '🛌',
    ingredients: [{ id: 'raw_silk', count: 1 }, { id: 'toy_mouse', count: 1 }],
    desc: 'Bé Mèo sẽ có giấc ngủ hoàng gia.'
  }
];

const LevelFeatures: React.FC<LevelFeaturesProps> = ({ 
  view, onBack, diaryNote, studioImage, isCapturing, onRefreshStudio, inventory, onCraftSuccess 
}) => {
  const [isCrafting, setIsCrafting] = useState(false);
  const [craftProgress, setCraftProgress] = useState(0);
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);

  const startCraft = async (recipe: any) => {
    // Kiểm tra nguyên liệu
    const hasEnough = recipe.ingredients.every((ing: any) => {
      const inv = inventory.find(i => i.id === ing.id);
      return inv && inv.count >= ing.count;
    });

    if (!hasEnough) return alert("Cô còn thiếu nguyên liệu rồi, quay lại Boutique nhé!");

    setSelectedRecipe(recipe);
    setIsCrafting(true);
    setCraftProgress(0);

    const duration = 3000;
    const interval = 30;
    const step = (interval / duration) * 100;

    const timer = setInterval(() => {
      setCraftProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + step;
      });
    }, interval);

    setTimeout(() => {
      setIsCrafting(false);
      onCraftSuccess({ 
        id: recipe.id, 
        name: recipe.name, 
        icon: recipe.icon, 
        count: 1 
      }, recipe.ingredients.map((i: any) => i.id));
      alert(`Chế tác thành công: ${recipe.name}!`);
    }, duration + 200);
  };

  if (view === 'diary') {
    return (
      <div className="fixed inset-0 z-[120] bg-white flex flex-col animate-in slide-in-from-bottom duration-500">
        <div className="p-6 pt-12 flex items-center justify-between border-b">
          <h3 className="font-black text-lg uppercase tracking-tight text-gray-900">Nhật ký quan sát</h3>
          <button onClick={onBack} className="p-2 bg-gray-100 rounded-full"><X size={20} /></button>
        </div>
        <div className="p-8 space-y-8 overflow-y-auto">
          <div className="bg-indigo-50 p-6 rounded-[32px] border-l-4 border-indigo-500 shadow-sm">
            <p className="text-[10px] font-black uppercase text-indigo-400 mb-2 tracking-widest">Ghi chú về cô ấy</p>
            <p className="text-base font-medium italic text-indigo-900 leading-relaxed">"{diaryNote?.note}"</p>
          </div>
          <div className="bg-[#FFC3A7]/10 p-6 rounded-[32px] border-l-4 border-[#FFC3A7] shadow-sm">
            <p className="text-[10px] font-black uppercase text-[#FFC3A7] mb-2 tracking-widest">Tâm trạng Trác Lẫm</p>
            <p className="text-base font-medium italic text-gray-700 leading-relaxed">"{diaryNote?.mood}"</p>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'studio') {
    return (
      <div className="fixed inset-0 z-[120] bg-black flex flex-col animate-in slide-in-from-bottom duration-500">
        <div className="p-6 pt-12 flex items-center justify-between text-white border-b border-white/10">
          <h3 className="font-black text-lg uppercase tracking-widest">CEO Studio</h3>
          <button onClick={onBack} className="p-2 bg-white/10 rounded-full"><X size={20} /></button>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6">
          <div className="w-full aspect-[9/16] bg-white/5 rounded-[40px] overflow-hidden shadow-2xl relative flex items-center justify-center border border-white/10">
            {isCapturing ? (
              <div className="flex flex-col items-center gap-4">
                <Loader2 size={48} className="text-indigo-400 animate-spin" />
                <p className="text-white text-xs font-bold animate-pulse">Trác Lẫm đang tạo dáng...</p>
              </div>
            ) : studioImage ? (
              <img src={studioImage} className="w-full h-full object-cover" alt="Captured" />
            ) : (
              <Camera size={48} className="text-white/20" />
            )}
          </div>
          <button 
            onClick={onRefreshStudio}
            disabled={isCapturing}
            className="w-full bg-indigo-600 text-white font-black py-4 rounded-3xl flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-all"
          >
            <RefreshCw size={20} className={isCapturing ? 'animate-spin' : ''} />
            <span>CHỤP ẢNH MỚI</span>
          </button>
        </div>
      </div>
    );
  }

  if (view === 'craft') {
    return (
      <div className="fixed inset-0 z-[120] bg-[#F9FAFB] flex flex-col animate-in slide-in-from-bottom duration-500">
        <div className="p-6 pt-12 flex items-center justify-between border-b bg-white">
          <div className="flex items-center gap-3">
             <Hammer size={24} className="text-indigo-900" />
             <h3 className="font-black text-lg uppercase tracking-tight">Xưởng Chế Tác</h3>
          </div>
          <button onClick={onBack} className="p-2 bg-gray-100 rounded-full"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar pb-32">
          {isCrafting ? (
            <div className="h-full flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-500">
              <div className="relative w-48 h-48 bg-white rounded-full flex items-center justify-center shadow-2xl">
                 <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
                 <div 
                   className="absolute inset-0 border-4 border-indigo-600 rounded-full transition-all duration-100" 
                   style={{ clipPath: `inset(0 0 ${100 - craftProgress}% 0)` }}
                 ></div>
                 <div className="flex gap-4 items-center">
                    {selectedRecipe?.ingredients.map((ing: any) => (
                      <div key={ing.id} className="text-4xl animate-bounce">
                        {inventory.find(i => i.id === ing.id)?.icon}
                      </div>
                    ))}
                    <ArrowRight size={24} className="text-gray-300 mx-1" />
                    <div className="text-5xl animate-pulse scale-110">{selectedRecipe?.icon}</div>
                 </div>
              </div>
              <div className="text-center">
                <h4 className="text-xl font-black text-indigo-900 mb-2">Đang kết tinh quà tặng...</h4>
                <div className="w-64 h-3 bg-gray-200 rounded-full overflow-hidden mx-auto shadow-inner">
                   <div className="h-full bg-indigo-600 transition-all duration-100" style={{ width: `${craftProgress}%` }}></div>
                </div>
                <p className="text-[11px] font-bold text-gray-400 mt-4 uppercase tracking-[0.2em]">{Math.round(craftProgress)}% - Hoàn thiện</p>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 flex items-center gap-4">
                 <div className="bg-indigo-50 p-4 rounded-2xl text-indigo-600"><Wand2 size={24} /></div>
                 <div>
                    <h4 className="font-black text-gray-900 uppercase text-xs">Phòng quà tặng CEO</h4>
                    <p className="text-[10px] text-gray-400 font-bold">Kết hợp nguyên liệu để tạo ra món quà ý nghĩa.</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {RECIPES.map(recipe => {
                  const hasIngredients = recipe.ingredients.every(ing => {
                    const inv = inventory.find(i => i.id === ing.id);
                    return inv && inv.count >= ing.count;
                  });

                  return (
                    <div key={recipe.id} className="bg-white p-6 rounded-[40px] border border-gray-50 shadow-sm flex items-center gap-6 group hover:shadow-md transition-all">
                      <div className="text-5xl p-6 bg-gray-50 rounded-[32px] group-hover:bg-indigo-50 transition-colors">
                        {recipe.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-black text-gray-900 uppercase text-sm mb-1">{recipe.name}</h4>
                        <p className="text-[10px] text-gray-400 font-bold mb-3">{recipe.desc}</p>
                        <div className="flex items-center gap-3">
                           {recipe.ingredients.map(ing => (
                             <div key={ing.id} className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                                <span className="text-xs">{inventory.find(i => i.id === ing.id)?.icon}</span>
                                <span className={`text-[10px] font-black ${inventory.find(i => i.id === ing.id)?.count || 0 >= ing.count ? 'text-green-600' : 'text-red-400'}`}>
                                  {inventory.find(i => i.id === ing.id)?.count || 0}/{ing.count}
                                </span>
                             </div>
                           ))}
                        </div>
                      </div>
                      <button 
                        onClick={() => startCraft(recipe)}
                        disabled={!hasIngredients}
                        className={`p-4 rounded-2xl shadow-lg transition-all active:scale-95 ${hasIngredients ? 'bg-indigo-900 text-white' : 'bg-gray-100 text-gray-300'}`}
                      >
                        <Hammer size={20} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default LevelFeatures;