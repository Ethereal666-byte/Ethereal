
import React, { useState, useEffect } from 'react';
import { TabType } from './types';
import Navigation from './components/Navigation';
import HomeTab from './components/Tabs/HomeTab';
import ChatTab from './components/Tabs/ChatTab';
import StoryTab from './components/Tabs/StoryTab';
import EventTab from './components/Tabs/EventTab';
import ProfileTab from './components/Tabs/ProfileTab';
import { Heart } from 'lucide-react';

const App: React.FC = () => {
  // Start on Chat tab as indicated by the Flutter code (_selectedIndex = 1)
  const [activeTab, setActiveTab] = useState<TabType>(TabType.CHAT);
  const [isReady, setIsReady] = useState(false);
  const [hasKey, setHasKey] = useState<boolean | null>(null);

  useEffect(() => {
    const checkKey = async () => {
      if (typeof window.aistudio !== 'undefined') {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasKey(selected);
        if (selected) setIsReady(true);
      } else if (process.env.API_KEY) {
        setHasKey(true);
        setIsReady(true);
      } else {
        setHasKey(false);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    if (typeof window.aistudio !== 'undefined') {
      await window.aistudio.openSelectKey();
      setHasKey(true);
      setIsReady(true);
    }
  };

  const renderTab = () => {
    switch (activeTab) {
      case TabType.HOME: return <HomeTab />;
      case TabType.CHAT: return <ChatTab />;
      case TabType.STORY: return <StoryTab />;
      case TabType.EVENT: return <EventTab />;
      case TabType.PROFILE: return <ProfileTab />;
      default: return <HomeTab />;
    }
  };

  if (hasKey === false) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#F8F4FF] px-6 text-center">
        <div className="bg-white p-8 rounded-[40px] shadow-2xl flex flex-col items-center max-w-sm border border-purple-50">
          <div className="bg-pink-100 p-6 rounded-3xl mb-6">
            <Heart className="text-pink-600 fill-pink-600" size={48} />
          </div>
          <h1 className="text-2xl font-bold text-indigo-900 mb-4">Kết nối với Trác Lẫm</h1>
          <p className="text-sm text-gray-500 mb-8 leading-relaxed">
            Để bước vào không gian của tổng tài, vui lòng chọn API Key từ dự án Google Cloud đã bật thanh toán.
          </p>
          <button 
            onClick={handleSelectKey}
            className="w-full bg-indigo-900 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-indigo-950 transition-all active:scale-95 mb-4"
          >
            Mở khóa trái tim
          </button>
          <a 
            href="https://ai.google.dev/gemini-api/docs/billing" 
            target="_blank" 
            rel="noreferrer"
            className="text-[10px] text-indigo-400 underline font-medium opacity-70"
          >
            Billing & API Key Documentation
          </a>
        </div>
      </div>
    );
  }

  if (!isReady) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#F8F4FF] px-6 text-center">
        <div className="w-12 h-12 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin mb-4"></div>
        <h1 className="text-lg font-bold text-indigo-900">Đang chuẩn bị không gian...</h1>
        <p className="text-xs text-indigo-400 mt-2 font-medium italic">"Cô đừng tưởng tôi vội vàng gặp cô." - Trác Lẫm</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white h-screen relative shadow-2xl flex flex-col border-x border-gray-100 overflow-hidden">
      <div className="flex-1 relative overflow-hidden">
        {renderTab()}
      </div>
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default App;
