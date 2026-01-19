
import React from 'react';
import { X, Heart, Flower2 } from 'lucide-react';

interface SecretDiaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  diaryData: { note: string; mood: string };
  weather: string;
}

const SecretDiaryModal: React.FC<SecretDiaryModalProps> = ({ isOpen, onClose, diaryData, weather }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
      {/* Background Overlay with heavy blur to prevent UI overlap */}
      <div 
        className="absolute inset-0 bg-black/85 backdrop-blur-xl animate-in fade-in duration-500" 
        onClick={onClose}
      ></div>
      
      <div className="relative w-full max-w-lg h-[85vh] bg-[#F5F5DC] rounded-sm shadow-[0_0_80px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col transform rotate-1 animate-in zoom-in-95 duration-500 border border-[#800020]/10">
        {/* Grain/Texture Effect */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04] bg-[url('https://www.transparenttextures.com/patterns/parchment.png')] z-20"></div>
        
        {/* Header Section */}
        <div className="p-8 flex justify-between items-start relative z-30">
          <div className="flex flex-col">
            <h3 className="font-serif text-3xl font-bold text-[#800020] italic">Trang nhật ký cũ</h3>
            <p className="text-[10px] font-bold text-[#800020]/50 uppercase tracking-[0.2em] mt-1">Dinh thự Trác Thị • {new Date().toLocaleDateString('vi-VN')}</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2.5 bg-[#800020]/10 hover:bg-[#800020]/20 rounded-full text-[#800020] transition-all active:scale-90"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content Section */}
        <div className="flex-1 overflow-y-auto px-10 pb-20 relative z-30 no-scrollbar">
          <div className="space-y-12">
            <div className="relative pt-6">
               <Flower2 size={64} className="absolute -top-6 -right-4 text-[#800020]/5 rotate-12" />
               <p className="font-serif text-[20px] leading-[2.2] text-[#343434] first-letter:text-6xl first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:text-[#800020] first-letter:font-serif">
                 {diaryData.note || "Hôm nay, khi nhìn thấy bóng dáng ấy, lồng ngực tôi lại thắt lại một nhịp đau đớn. Bốn năm ròng rã, tôi cứ tưởng mình đã đủ lạnh lùng để quên đi, nhưng chỉ một ánh mắt của cô ấy thôi cũng đủ phá nát bức tường thành tôi dày công xây dựng."}
               </p>
            </div>

            <div className="pt-10 border-t border-[#800020]/10">
               <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 rounded-full bg-[#800020]/5 flex items-center justify-center">
                    <Heart size={20} className="text-[#800020]" fill="currentColor" />
                 </div>
                 <h4 className="font-serif font-bold text-[#800020] text-xl italic underline decoration-[#800020]/20 underline-offset-8">Tâm trạng thầm kín</h4>
               </div>
               <p className="font-serif text-[19px] text-[#343434]/80 leading-relaxed italic border-l-2 border-[#800020]/20 pl-6">
                 "{diaryData.mood || "Cố gắng tỏ ra xa cách, nhưng tay tôi run lên khi cô ấy lại gần. Tôi sợ nếu mình không đẩy cô ấy ra, tôi sẽ không kiềm lòng được mà giữ chặt cô ấy mãi mãi."}"
               </p>
            </div>

            <div className="pt-12 flex flex-col gap-2 opacity-50 italic">
               <p className="text-[11px] font-bold text-[#343434] uppercase tracking-widest">Thời tiết:</p>
               <p className="font-serif text-sm text-[#343434]">{weather}</p>
            </div>
          </div>

          <div className="mt-24 flex justify-center opacity-10">
            <Flower2 size={120} className="text-[#800020]" />
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#800020]/5 to-transparent pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#800020]/5 to-transparent pointer-events-none"></div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default SecretDiaryModal;
