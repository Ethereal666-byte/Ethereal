
import React, { useState, useRef } from 'react';
import { Flower2, Plus, Camera, X, Link, Upload, Loader2 } from 'lucide-react';
import { StoryCard } from '../../types';
import MemoryCard from './MemoryCard';

interface MemoryGalleryProps {
  stories: StoryCard[];
  onOpenStory: (story: StoryCard) => void;
  onDeleteStory: (e: React.MouseEvent, id: string) => void;
  onUpdateStory: (id: string, newImageUrl: string) => void;
  onAddClick: () => void;
}

const MemoryGallery: React.FC<MemoryGalleryProps> = ({ stories, onOpenStory, onDeleteStory, onUpdateStory, onAddClick }) => {
  const [editingStory, setEditingStory] = useState<StoryCard | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEditImageClick = (e: React.MouseEvent, story: StoryCard) => {
    e.stopPropagation();
    setEditingStory(story);
    setUrlInput(story.imageUrl);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingStory) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      onUpdateStory(editingStory.id, base64);
      setIsUploading(false);
      setEditingStory(null);
    };
    reader.readAsDataURL(file);
  };

  const handleUrlSubmit = () => {
    if (editingStory && urlInput) {
      onUpdateStory(editingStory.id, urlInput);
      setEditingStory(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Title & Add Button */}
      <div className="flex items-center justify-between px-2">
        <div className="flex flex-col">
          <h2 className="text-[22px] font-serif font-bold text-[#800020] flex items-center gap-2">
            Hồi ức & Kỷ niệm
          </h2>
          <div className="w-16 h-0.5 bg-[#800020]/20 mt-1"></div>
        </div>
        
        <button 
          onClick={onAddClick}
          className="group flex items-center gap-2 px-5 py-2.5 bg-[#F5F5DC] border border-[#800020]/20 rounded-full shadow-md hover:bg-[#800020] hover:text-white transition-all duration-500 active:scale-95"
        >
          <div className="bg-[#800020]/10 p-1.5 rounded-full group-hover:bg-white/20 transition-colors">
            <Plus size={14} className="text-[#800020] group-hover:text-white" />
          </div>
          <span className="text-[11px] font-serif font-bold uppercase tracking-widest">Thêm kỷ niệm</span>
          <Flower2 size={16} className="text-[#800020]/40 group-hover:text-white/40" />
        </button>
      </div>

      {/* Grid of Polaroid Cards */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-10">
        {stories.length === 0 ? (
          <div className="col-span-2 py-20 flex flex-col items-center justify-center text-center opacity-30 grayscale">
            <Flower2 size={48} className="text-[#800020] mb-4" />
            <p className="font-serif italic text-lg">Hành trình của chúng ta chưa có kỷ niệm nào được lưu lại...</p>
          </div>
        ) : (
          stories.map(story => (
            <MemoryCard 
              key={story.id} 
              story={story} 
              onClick={() => onOpenStory(story)}
              onDelete={(e) => onDeleteStory(e, story.id)}
              onEditImage={(e) => handleEditImageClick(e, story)}
            />
          ))
        )}
      </div>

      {/* Update Image Modal */}
      {editingStory && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setEditingStory(null)}></div>
          
          <div className="relative w-full max-w-sm bg-[#F5F5DC] rounded-[32px] overflow-hidden shadow-2xl flex flex-col p-8 border border-[#800020]/20">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-serif text-xl font-bold text-[#800020]">Đổi ảnh kỷ niệm</h3>
              <button onClick={() => setEditingStory(null)} className="text-[#800020]/40 hover:text-[#800020]"><X size={24} /></button>
            </div>

            <div className="space-y-6">
              <div className="aspect-[4/5] w-32 mx-auto bg-white rounded-lg overflow-hidden shadow-lg border border-[#800020]/10 rotate-2">
                <img src={editingStory.imageUrl} className="w-full h-full object-cover grayscale-[0.3]" alt="Current" />
              </div>

              <div className="space-y-4">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="w-full py-4 bg-[#800020]/5 hover:bg-[#800020]/10 border border-[#800020]/20 rounded-2xl flex items-center justify-center gap-3 text-[#800020] font-serif font-bold transition-all active:scale-95"
                >
                  {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
                  TẢI ẢNH LÊN
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />

                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Link size={14} className="text-[#800020]/40" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Dán link ảnh tại đây..." 
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="w-full bg-white/50 border border-[#800020]/10 rounded-2xl py-4 pl-12 pr-4 text-xs font-serif italic text-[#343434] outline-none focus:ring-1 ring-[#800020]/30"
                  />
                </div>

                <button 
                  onClick={handleUrlSubmit}
                  className="w-full py-4 bg-[#800020] text-white rounded-2xl font-serif font-bold shadow-lg hover:shadow-[#800020]/20 transition-all active:scale-95"
                >
                  XÁC NHẬN URL
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Decorative center flower */}
      <div className="flex justify-center py-10 opacity-5">
        <Flower2 size={80} className="text-[#800020]" />
      </div>
    </div>
  );
};

export default MemoryGallery;
