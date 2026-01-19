
import React from 'react';
import { ChevronLeft, Info, UserSearch, MessageSquare, RotateCcw, ImageIcon, UserRoundCog, UserRound, Download, Upload, Smartphone } from 'lucide-react';

interface ChatHeaderProps {
  charAvatar: string;
  showMenu: boolean;
  setShowMenu: (show: boolean) => void;
  onProfileClick: () => void;
  onNewChat: () => void;
  onResetChat: () => void;
  onUploadInitiate: (target: 'bg' | 'char' | 'user') => void;
  onExport: () => void;
  onPhoneClick: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  charAvatar, showMenu, setShowMenu, onProfileClick, onNewChat, onResetChat, onUploadInitiate, onExport, onPhoneClick, fileInputRef
}) => {
  return (
    <div className="h-[70px] bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-20 flex items-center px-2 shadow-[0_0.5px_0_rgba(0,0,0,0.05)]">
      <button className="p-2 text-gray-800 hover:bg-gray-100 rounded-full transition-colors ml-1">
        <ChevronLeft size={20} />
      </button>
      
      <div className="flex items-center gap-3 ml-2 flex-1">
        <div className="w-[44px] h-[44px] rounded-full border-2 border-purple-500/10 overflow-hidden bg-[#E6E6FA]">
          <img src={charAvatar} alt="Trác Lẫm" className="w-full h-full object-cover" />
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-[#1a1a1a] text-[17px] leading-tight tracking-[0.5px]">Trác Lẫm</h2>
            <button 
              onClick={onPhoneClick}
              className="p-1 text-indigo-400 hover:text-indigo-600 transition-colors"
            >
              <Smartphone size={16} />
            </button>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="w-[7px] h-[7px] bg-[#4CAF50] rounded-full animate-pulse"></div>
            <span className="text-[11px] text-[#43a047] font-semibold">Đang trực tuyến</span>
          </div>
        </div>
      </div>
      
      <div className="relative mr-2">
        <button onClick={() => setShowMenu(!showMenu)} className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
          <Info size={26} />
        </button>
        
        {showMenu && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setShowMenu(false)}></div>
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-purple-50 z-40 overflow-hidden animate-in fade-in zoom-in-95 duration-100 max-h-[80vh] overflow-y-auto">
              <button onClick={onProfileClick} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100"><UserSearch size={18} className="text-blue-500" />Xem nhân vật</button>
              <button onClick={onNewChat} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100"><MessageSquare size={18} className="text-green-500" />Bắt đầu trò chuyện mới</button>
              <button onClick={onResetChat} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100"><RotateCcw size={18} className="text-red-500" />Đặt lại trò chuyện</button>
              <div className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50">Tùy chỉnh</div>
              <button onClick={() => onUploadInitiate('bg')} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100"><ImageIcon size={18} className="text-orange-400" />Đổi hình nền</button>
              <button onClick={() => onUploadInitiate('char')} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100"><UserRoundCog size={18} className="text-indigo-400" />Đổi ảnh Trác Lẫm</button>
              <button onClick={() => onUploadInitiate('user')} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100"><UserRound size={18} className="text-pink-400" />Đổi ảnh của bạn</button>
              <div className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50">Hệ thống</div>
              <button onClick={onExport} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100"><Download size={18} className="text-purple-500" />Xuất JSON</button>
              <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"><Upload size={18} className="text-purple-500" />Nhập JSON</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
