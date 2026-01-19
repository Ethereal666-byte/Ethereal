
import React, { useState, useRef } from 'react';
import { X, Upload, Camera, Flower2, Loader2 } from 'lucide-react';

interface UploadMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (title: string, imageUrl: string) => void;
}

const UploadMemoryModal: React.FC<UploadMemoryModalProps> = ({ isOpen, onClose, onUpload }) => {
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      setImageUrl(event.target?.result as string);
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!title || !imageUrl) return alert("Vui lòng nhập tên và chọn ảnh kỷ niệm!");
    onUpload(title, imageUrl);
    setTitle('');
    setImageUrl('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative w-full max-w-sm bg-[#F5F5DC] rounded-[24px] overflow-hidden shadow-2xl flex flex-col p-8 border border-[#800020]/20">
        <div className="flex justify-between items-center mb-8">
           <div className="flex flex-col">
              <h3 className="font-serif text-2xl font-bold text-[#800020]">Thêm kỷ niệm mới</h3>
              <p className="text-[10px] font-bold text-[#800020]/50 uppercase tracking-widest mt-1 italic">Ghi lại khoảnh khắc của hai ta</p>
           </div>
           <button onClick={onClose} className="p-2 text-[#800020]/40 hover:text-[#800020]"><X size={24} /></button>
        </div>

        <div className="space-y-6">
           <div>
              <label className="text-[10px] font-black text-[#800020]/60 uppercase tracking-widest mb-2 block px-1">Tên kỷ niệm</label>
              <input 
                type="text" 
                placeholder="Ví dụ: Đêm dạ tiệc, Lần đầu gặp..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white/40 border-none rounded-xl p-4 text-sm focus:ring-1 ring-[#800020] outline-none font-serif italic text-[#343434]"
              />
           </div>

           <div>
              <label className="text-[10px] font-black text-[#800020]/60 uppercase tracking-widest mb-2 block px-1">Hình ảnh kỷ niệm</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square w-full rounded-[20px] bg-white/40 border-2 border-dashed border-[#800020]/20 flex flex-col items-center justify-center cursor-pointer hover:bg-[#800020]/5 transition-all overflow-hidden relative"
              >
                {isProcessing ? (
                  <Loader2 size={32} className="animate-spin text-[#800020]" />
                ) : imageUrl ? (
                  <img src={imageUrl} className="w-full h-full object-cover" alt="Preview" />
                ) : (
                  <>
                    <Camera size={32} className="text-[#800020]/30 mb-2" />
                    <span className="text-[10px] font-bold text-[#800020]/40 uppercase">Chọn ảnh từ thiết bị</span>
                  </>
                )}
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
           </div>

           <button 
             onClick={handleSubmit}
             className="w-full bg-[#800020] text-white font-serif font-bold py-4 rounded-xl shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2"
           >
             <Flower2 size={18} /> LƯU KỶ NIỆM
           </button>
        </div>
      </div>
    </div>
  );
};

export default UploadMemoryModal;
