
import React from 'react';
import { Cat, Heart, ChevronRight } from 'lucide-react';

interface PetRoomPreviewProps {
  petStats: {
    hunger: number;
    happiness: number;
  };
  onClick: () => void;
}

const PetRoomPreview: React.FC<PetRoomPreviewProps> = ({ petStats, onClick }) => {
  return (
    <div 
      onClick={onClick} 
      className="relative bg-white p-6 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-50 overflow-hidden cursor-pointer group active:scale-[0.98] transition-all"
    >
      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
        <Cat size={120} />
      </div>
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-pink-50 text-pink-500 rounded-2xl">
            <Heart size={20} fill="currentColor" />
          </div>
          <span className="text-[10px] font-black text-pink-400 uppercase tracking-[0.2em]">Căn hộ thú cưng</span>
        </div>
        <h3 className="text-2xl font-black text-gray-900 mb-2">Miu Miu & Trác Lẫm</h3>
        <div className="flex gap-4">
          <div className="flex-1 bg-gray-50 p-3 rounded-2xl border border-gray-100">
            <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Cơn đói</p>
            <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-orange-500" style={{ width: `${petStats.hunger}%` }}></div>
            </div>
          </div>
          <div className="flex-1 bg-gray-50 p-3 rounded-2xl border border-gray-100">
            <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Vui vẻ</p>
            <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-pink-500" style={{ width: `${petStats.happiness}%` }}></div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-between items-center text-indigo-600 font-bold text-xs uppercase tracking-widest">
        <span>Vào phòng chăm sóc</span>
        <ChevronRight size={16} />
      </div>
    </div>
  );
};

export default PetRoomPreview;
