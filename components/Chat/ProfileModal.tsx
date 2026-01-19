
import React from 'react';
import { X } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileItem = ({ title, content }: { title: string, content: string }) => (
  <div className="py-2.5">
    <p className="text-purple-600 font-bold text-[13px] mb-1">{title}</p>
    <p className="text-[#333] text-[16px] leading-relaxed">{content}</p>
  </div>
);

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
      <div className="w-full max-w-md bg-white rounded-t-[30px] z-50 p-6 animate-in slide-in-from-bottom duration-500 max-h-[75vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-center mb-6"><div className="w-12 h-1.5 bg-gray-200 rounded-full"></div></div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-[22px] font-bold text-indigo-900 tracking-tight">Hồ sơ nhân vật</h3>
          <button onClick={onClose} className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <div className="space-y-4">
          <ProfileItem title="Danh tính" content="Trác Lẫm (25 tuổi - 185cm)" />
          <ProfileItem title="Ngoại hình" content="Mắt xám, khí chất lạnh lẽo, thường ngậm thuốc lá u sầu." />
          <ProfileItem title="Mối quan hệ" content="Tình đầu (4 năm) -> Vợ chồng hợp đồng (Hiện tại)" />
          <ProfileItem title="Tiểu sử" content="CEO Trác Thị. Đang dùng danh nghĩa ly hôn để ép cô ở lại bên cạnh." />
          <div className="pt-4 border-t border-gray-100">
            <p className="font-bold text-gray-800 text-sm mb-1">Ghi chú quá khứ:</p>
            <p className="text-gray-400 italic text-[14px] leading-relaxed">"Một tin nhắn chia tay vội. Một cú chặn máy không lời giải thích. Anh vẫn đang chờ một câu trả lời thật sự từ cô."</p>
          </div>
        </div>
        <button onClick={onClose} className="w-full bg-indigo-900 text-white font-bold py-4 rounded-2xl mt-8 shadow-lg active:scale-[0.98] transition-all">Đóng hồ sơ</button>
      </div>
    </div>
  );
};

export default ProfileModal;
