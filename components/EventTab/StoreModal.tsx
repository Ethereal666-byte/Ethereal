
import React, { useState } from 'react';
import { ArrowLeft, Package, ShoppingCart, Gem, Cat, Coins } from 'lucide-react';
import { StoreItem, InventoryItem } from '../../types';

interface StoreModalProps {
  points: number;
  level: number;
  onBack: () => void;
  onBuy: (item: StoreItem) => void;
  inventory: InventoryItem[];
}

const CEO_GIFT_ITEMS: StoreItem[] = [
  // Nguyên liệu (giữ lại)
  { id: 'raw_choc', name: 'Bột Chocolate', price: 50, icon: '🍫', category: 'ceo_gift', description: 'Nguyên liệu làm đồ ngọt thượng hạng.' },
  { id: 'raw_wool', name: 'Len Cừu', price: 40, icon: '🧶', category: 'ceo_gift', description: 'Mềm mại và ấm áp.' },
  { id: 'raw_paper', name: 'Giấy Mỹ Thuật', price: 20, icon: '📜', category: 'ceo_gift', description: 'Để viết thư hoặc làm hộp quà.' },
  { id: 'raw_silk', name: 'Vải Lụa', price: 100, icon: '🧣', category: 'ceo_gift', description: 'Sang trọng cho người đẳng cấp.' },
  { id: 'raw_coffee', name: 'Hạt Cà Phê', price: 30, icon: '☕', category: 'ceo_gift', description: 'Tỉnh táo cho những đêm làm việc.' },
  
  // Hàng xa xỉ mới bổ sung
  { id: 'patek_watch', name: 'Đồng hồ Patek', price: 2500, icon: '⌚', category: 'ceo_gift', description: 'Kiệt tác thời gian dành cho quý ông.', minLevel: 5 },
  { id: 'diamond_cuff', name: 'Khuy kim cương', price: 1200, icon: '💎', category: 'ceo_gift', description: 'Điểm nhấn quyền lực trên cổ tay áo.' },
  { id: 'vintage_wine', name: 'Vang Đỏ 1982', price: 1800, icon: '🍷', category: 'ceo_gift', description: 'Hương vị nồng nàn từ hầm rượu Pháp.' },
  { id: 'gold_pen', name: 'Bút máy nạm vàng', price: 850, icon: '🖋️', category: 'ceo_gift', description: 'Dành cho những bản hợp đồng triệu đô.' },
  { id: 'ceo_perfume', name: 'Nước hoa Trác Thị', price: 600, icon: '🧪', category: 'ceo_gift', description: 'Mùi hương hổ phách lạnh lùng quyến rũ.' },
  { id: 'luxury_tie', name: 'Cà vạt lụa Hermes', price: 450, icon: '👔', category: 'ceo_gift', description: 'Sự chỉn chu tuyệt đối của một CEO.' },
  { id: 'leather_wallet', name: 'Ví da cá sấu', price: 900, icon: '👛', category: 'ceo_gift', description: 'Da thật thủ công, bền bỉ theo năm tháng.' },
  { id: 'cigar_box', name: 'Hộp Cigar Cuba', price: 1500, icon: '🚬', category: 'ceo_gift', description: 'Thú vui sành điệu trong đêm tĩnh lặng.' },
];

const MIU_MIU_ITEMS: StoreItem[] = [
  // Đồ cơ bản (giữ lại)
  { id: 'pate', name: 'Pate Cá Ngừ', price: 30, icon: '🐟', category: 'miu_miu', description: 'Dinh dưỡng cho bé Miu.' },
  { id: 'catnip', name: 'Cỏ Mèo', icon: '🌿', price: 15, category: 'miu_miu', description: 'Niềm vui bất tận cho mèo.' },
  { id: 'toy_mouse', name: 'Chuột bông', price: 50, icon: '🐭', category: 'miu_miu', description: 'Sát thủ đồ chơi.' },
  { id: 'brush', name: 'Lược chải lông', price: 40, icon: '🧹', category: 'miu_miu', description: 'Massage thư giãn cho pet.' },

  // Hàng cao cấp cho pet mới bổ sung
  { id: 'salmon_snack', name: 'Bánh Cá Hồi', price: 80, icon: '🍣', category: 'miu_miu', description: 'Quà vặt thượng hạng từ đại dương.' },
  { id: 'golden_bell', name: 'Chuông vàng', price: 200, icon: '🔔', category: 'miu_miu', description: 'Âm thanh may mắn mỗi khi Miu đi lại.' },
  { id: 'royal_bed', name: 'Nệm hoàng gia', price: 650, icon: '🛌', category: 'miu_miu', description: 'Êm ái như nằm trên mây xanh.' },
  { id: 'cat_tower', name: 'Tháp mèo Trác Thị', price: 1200, icon: '🏰', category: 'miu_miu', description: 'Lâu đài riêng cho đại boss Miu Miu.' },
  { id: 'crystal_bowl', name: 'Bát ăn pha lê', price: 350, icon: '🥣', category: 'miu_miu', description: 'Sang chảnh hóa từng bữa ăn.' },
  { id: 'smart_collar', name: 'Vòng cổ GPS', price: 500, icon: '🛰️', category: 'miu_miu', description: 'Không bao giờ lo Miu Miu đi lạc.' },
  { id: 'premium_shampoo', name: 'Sữa tắm hoa hồng', price: 120, icon: '🧴', category: 'miu_miu', description: 'Cho bộ lông mượt mà và thơm ngát.' },
];

const StoreModal: React.FC<StoreModalProps> = ({ points, level, onBack, onBuy, inventory }) => {
  const [activeTab, setActiveTab] = useState<'ceo_gift' | 'miu_miu'>('ceo_gift');

  const currentItems = activeTab === 'ceo_gift' ? CEO_GIFT_ITEMS : MIU_MIU_ITEMS;

  return (
    <div className="fixed inset-0 z-[110] bg-[#F9FAFB] flex flex-col animate-in slide-in-from-right duration-300">
      <div className="p-6 pt-12 flex items-center justify-between border-b bg-white sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><ArrowLeft size={24} /></button>
          <h3 className="font-black text-lg uppercase tracking-tight">Boutique Trác Thị</h3>
        </div>
        <div className="bg-yellow-100 px-3 py-1 rounded-full flex items-center gap-1.5 border border-yellow-200">
          <Coins size={12} className="text-yellow-600" />
          <span className="text-[11px] font-black text-yellow-700">{points} PTS</span>
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto no-scrollbar pb-32">
        {/* Inventory Overview */}
        <div className="bg-indigo-900 text-white p-6 rounded-[32px] mb-8 shadow-xl relative overflow-hidden">
          <Package className="absolute -right-4 -bottom-4 text-white/10" size={100} />
          <div className="relative z-10">
            <h4 className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Kho đồ hiện tại</h4>
            <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
              {inventory.filter(i => i.count > 0).length === 0 ? (
                <p className="text-xs font-medium opacity-40">Trống trơn...</p>
              ) : (
                inventory.filter(i => i.count > 0).map(item => (
                  <div key={item.id} className="flex flex-col items-center shrink-0">
                    <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-xl mb-1 border border-white/10">
                      {item.icon}
                    </div>
                    <span className="text-[8px] font-black uppercase">x{item.count}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Store Tabs */}
        <div className="flex p-1 bg-gray-100 rounded-2xl mb-8">
          <button 
            onClick={() => setActiveTab('ceo_gift')}
            className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 text-[11px] font-black uppercase transition-all ${activeTab === 'ceo_gift' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400'}`}
          >
            <Gem size={14} /> Tiệm Quà CEO
          </button>
          <button 
            onClick={() => setActiveTab('miu_miu')}
            className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 text-[11px] font-black uppercase transition-all ${activeTab === 'miu_miu' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400'}`}
          >
            <Cat size={14} /> Tiệm Miu Miu
          </button>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-2 gap-4">
          {currentItems.map(item => {
            const isLocked = item.minLevel && level < item.minLevel;
            return (
              <div key={item.id} className={`bg-white p-5 rounded-[40px] border border-gray-50 flex flex-col items-center shadow-sm relative group hover:shadow-md transition-all active:scale-95 ${isLocked ? 'opacity-60 grayscale' : ''}`}>
                <div className="text-5xl mb-4 p-5 bg-gray-50 rounded-[28px] group-hover:bg-indigo-50 transition-colors">{item.icon}</div>
                <h5 className="font-black text-[11px] mb-1 text-gray-900 text-center uppercase tracking-tight">{item.name}</h5>
                <p className="text-[9px] text-gray-400 mb-4 text-center leading-tight font-bold h-6 line-clamp-2">{item.description}</p>
                <div className="w-full flex items-center justify-between gap-2 mt-auto pt-2 border-t border-gray-50">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-black text-indigo-600">{item.price} PTS</span>
                    {item.minLevel && <span className="text-[7px] font-bold text-gray-400">Lv.{item.minLevel}</span>}
                  </div>
                  <button 
                    onClick={() => !isLocked && onBuy(item)} 
                    disabled={isLocked}
                    className={`p-2.5 rounded-2xl transition-all shadow-lg active:scale-90 ${isLocked ? 'bg-gray-200 text-gray-400' : 'bg-indigo-900 text-white hover:bg-indigo-950'}`}
                  >
                    <ShoppingCart size={16} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StoreModal;
