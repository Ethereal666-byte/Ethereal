
import React from 'react';
import { Home, Heart, BookOpen, PartyPopper, User } from 'lucide-react';
import { TabType } from '../types';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const navItems = [
    { type: TabType.HOME, icon: Home, label: 'Home' },
    { type: TabType.CHAT, icon: Heart, label: 'Chat' },
    { type: TabType.STORY, icon: BookOpen, label: 'Story' },
    { type: TabType.EVENT, icon: PartyPopper, label: 'Event' },
    { type: TabType.PROFILE, icon: User, label: 'Me' },
  ];

  return (
    <nav className="relative w-full bg-white/80 backdrop-blur-lg border-t border-purple-100 flex justify-around py-3 px-2 z-50 pb-[env(safe-area-inset-bottom,12px)]">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.type;
        return (
          <button
            key={item.type}
            onClick={() => onTabChange(item.type)}
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${isActive ? 'text-purple-600 scale-110' : 'text-purple-300 hover:text-purple-400'}`}
          >
            <div className={`p-2 rounded-2xl ${isActive ? 'bg-purple-100' : ''}`}>
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default Navigation;
