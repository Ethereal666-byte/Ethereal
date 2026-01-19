
import React from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';

interface FeatureButtonProps {
  icon: React.ReactNode;
  label: string;
  desc: string;
  onClick: () => void;
  isLoading?: boolean;
  locked?: boolean;
}

const FeatureButton: React.FC<FeatureButtonProps> = ({ icon, label, desc, onClick, isLoading, locked }) => (
  <button 
    onClick={onClick} 
    disabled={locked || isLoading} 
    className={`p-5 rounded-[32px] bg-white border border-gray-50 shadow-sm flex flex-col gap-3 text-left transition-all relative overflow-hidden ${locked ? 'opacity-50 grayscale' : 'hover:shadow-md active:scale-95'}`}
  >
    <div className="bg-gray-50 w-10 h-10 rounded-2xl flex items-center justify-center">
      {isLoading ? <Loader2 size={18} className="animate-spin text-gray-400" /> : icon}
    </div>
    <div>
      <p className="font-black text-gray-900 text-xs uppercase tracking-tight">{label}</p>
      <p className="text-[10px] text-gray-400 font-bold leading-tight">{desc}</p>
    </div>
    {locked && (
      <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center">
        <CheckCircle2 size={16} className="text-gray-300" />
      </div>
    )}
  </button>
);

export default FeatureButton;
