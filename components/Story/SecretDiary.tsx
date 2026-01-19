
import React, { useState } from 'react';
import { Flower2, Quote } from 'lucide-react';
import SecretDiaryModal from './SecretDiaryModal';

interface SecretDiaryProps {
  diaryData: { note: string; mood: string };
  weather: string;
}

const SecretDiary: React.FC<SecretDiaryProps> = ({ diaryData, weather }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div 
        onClick={() => setIsOpen(true)}
        className="bg-[#F5F5DC] p-6 rounded-[32px] shadow-2xl border border-[#800020]/15 cursor-pointer group hover:scale-[1.02] active:scale-[0.98] transition-all relative overflow-hidden"
      >
        {/* Decorative corner flowers */}
        <Flower2 size={50} className="absolute -top-6 -left-6 text-[#800020]/10 rotate-12 transition-transform group-hover:scale-125" />
        <Flower2 size={50} className="absolute -bottom-6 -right-6 text-[#800020]/10 -rotate-12 transition-transform group-hover:scale-125" />

        <div className="flex items-center gap-2 mb-4 border-b border-[#800020]/10 pb-4">
          <Quote size={16} className="text-[#800020]" />
          <span className="text-[11px] font-black text-[#800020]/50 uppercase tracking-[0.3em] font-serif italic">Secret Diary of Trác Lẫm</span>
        </div>
        
        <div className="space-y-3">
           <p className="text-[15px] text-[#343434]/90 font-serif italic line-clamp-2 leading-relaxed">
             "{diaryData.note || "Hôm nay cô ấy tặng quà, mình đã phải cố gắng lắm mới không mỉm cười..."}"
           </p>
           <div className="flex items-center gap-3 mt-4">
              <div className="w-2 h-2 rounded-full bg-[#800020] animate-pulse"></div>
              <span className="text-[10px] text-[#800020]/40 font-bold uppercase tracking-widest">Nhấn để xem lời tự sự bí ẩn</span>
           </div>
        </div>

        {/* Velvet Texture Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/parchment.png')]"></div>
      </div>

      <SecretDiaryModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        diaryData={diaryData} 
        weather={weather} 
      />
    </>
  );
};

export default SecretDiary;
