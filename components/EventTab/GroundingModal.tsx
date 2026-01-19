
import React from 'react';
import { X, ExternalLink } from 'lucide-react';

interface GroundingModalProps {
  result: { text: string; urls?: string[] } | null;
  onClose: () => void;
}

const GroundingModal: React.FC<GroundingModalProps> = ({ result, onClose }) => {
  if (!result) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-indigo-950/80 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative w-full max-w-sm bg-white rounded-[40px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b flex justify-between items-center">
          <h4 className="font-black text-sm uppercase tracking-tight text-indigo-900">Kết quả từ Trác Lẫm</h4>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
          <div className="bg-gray-50 p-5 rounded-3xl border border-gray-100">
            <p className="text-sm leading-relaxed text-gray-800 italic">"{result.text}"</p>
          </div>
          {result.urls && result.urls.length > 0 && (
            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Nguồn tham khảo</p>
              {result.urls.map((url, i) => (
                <a key={i} href={url} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 bg-indigo-50 rounded-2xl text-indigo-900 hover:bg-indigo-100 transition-colors">
                  <span className="text-xs font-bold truncate max-w-[200px]">{url}</span>
                  <ExternalLink size={14} />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroundingModal;
