
import React from 'react';
import { Flame, Feather, Trash2, Camera } from 'lucide-react';
import { StoryCard } from '../../types';

interface MemoryCardProps {
  story: StoryCard;
  onClick: () => void;
  onDelete?: (e: React.MouseEvent) => void;
  onEditImage?: (e: React.MouseEvent) => void;
}

const MemoryCard: React.FC<MemoryCardProps> = ({ story, onClick, onDelete, onEditImage }) => {
  return (
    <div 
      onClick={onClick}
      className="group relative bg-[#F5F5DC] p-2.5 pb-8 shadow-xl border border-gray-200 cursor-pointer animate-in zoom-in-95 duration-300 transform transition-transform hover:-rotate-1 hover:scale-[1.02]"
    >
      <div className="aspect-[4/5] w-full overflow-hidden bg-gray-100 relative">
        <img 
          src={story.imageUrl} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
          alt={story.title} 
        />
        
        {/* Grain overlay for vintage look */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/parchment.png')]"></div>
        
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {story.isHot && (
            <div className="bg-[#800020]/90 text-[7px] font-black px-2 py-1 rounded-sm text-white tracking-widest flex items-center gap-1 shadow-md uppercase">
              <Flame size={8} fill="currentColor" /> Intense
            </div>
          )}
          {story.id.startsWith('extra') && (
            <div className="bg-[#2D5A27]/90 text-[7px] font-black px-2 py-1 rounded-sm text-white tracking-widest flex items-center gap-1 shadow-md uppercase">
              <Feather size={8} /> Extra
            </div>
          )}
        </div>

        <div className="absolute top-2 right-2 flex flex-col gap-2">
          {onDelete && story.id.startsWith('extra') && (
            <button 
              onClick={onDelete}
              className="p-1.5 bg-black/20 hover:bg-[#800020] text-white rounded-full backdrop-blur-md transition-colors z-10"
            >
              <Trash2 size={10} />
            </button>
          )}
          
          {onEditImage && (
            <button 
              onClick={onEditImage}
              className="p-1.5 bg-white/40 hover:bg-white/80 text-[#800020] rounded-full backdrop-blur-md transition-all shadow-sm z-10 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"
            >
              <Camera size={12} />
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 px-2">
        <h4 className="font-serif text-[#343434] text-[13px] font-bold line-clamp-2 leading-tight tracking-tight">
          {story.title}
        </h4>
        <p className="text-[8px] text-gray-400 font-bold uppercase mt-2 tracking-widest italic">
          {new Date(story.createdAt).toLocaleDateString('vi-VN')}
        </p>
      </div>

      {/* Shadow under the card to make it look floating */}
      <div className="absolute -bottom-1 left-2 right-2 h-2 bg-black/10 blur-md -z-10"></div>
    </div>
  );
};

export default MemoryCard;
