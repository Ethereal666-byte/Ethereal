
import React from 'react';
import { Briefcase } from 'lucide-react';

interface WorkSectionProps {
  isWorking: boolean;
  workProgress: number;
  onStartWork: () => void;
}

const WorkSection: React.FC<WorkSectionProps> = ({ isWorking, workProgress, onStartWork }) => {
  return (
    <div className="bg-indigo-900 rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
        <Briefcase size={120} />
      </div>
      <div className="relative z-10">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-300 mb-2">Trợ lý tập sự</p>
        <h3 className="text-2xl font-black mb-1">Làm việc tại Trác Thị</h3>
        <p className="text-[11px] text-indigo-100/60 font-medium italic mb-6">"Hợp đồng này cần ký tên cô. Đừng làm tôi thất vọng."</p>
        
        {isWorking ? (
          <div className="space-y-3">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
              <span>Đang xử lý hồ sơ...</span>
              <span>{Math.round(workProgress)}%</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white transition-all duration-100" style={{ width: `${workProgress}%` }}></div>
            </div>
          </div>
        ) : (
          <button 
            onClick={onStartWork}
            className="bg-white text-indigo-900 font-black px-8 py-3 rounded-2xl text-xs uppercase tracking-widest shadow-xl hover:bg-indigo-50 active:scale-95 transition-all flex items-center gap-2"
          >
            <Briefcase size={14} /> Bắt đầu công việc
          </button>
        )}
      </div>
    </div>
  );
};

export default WorkSection;
