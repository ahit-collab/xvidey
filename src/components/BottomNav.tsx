import React from 'react';
import { Home, Star, LayoutGrid, AlignLeft, Flame, Bookmark } from 'lucide-react';
import { NavTab } from '../types';

interface BottomNavProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  isLightMode: boolean;
  myListCount: number;
  onAdTrigger?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
  isLightMode,
  myListCount,
  onAdTrigger,
}) => {
  const items: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'featured', label: 'China', icon: <Star className="w-5 h-5" /> },
    { id: 'drama', label: 'Drama', icon: <LayoutGrid className="w-5 h-5" /> },
    { id: 'genre', label: 'Erotics', icon: <AlignLeft className="w-5 h-5" /> },
    { id: 'hot', label: 'Hot', icon: <Flame className="w-5 h-5 text-orange-500 fill-orange-500" /> },
  ];

  return (
    <nav
      id="mobile-bottom-navigation"
      className={`fixed bottom-0 inset-x-0 z-40 md:hidden border-t backdrop-blur-xl transition-colors duration-300 ${
        isLightMode 
          ? 'bg-white/95 border-slate-200 text-slate-700 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]' 
          : 'bg-[#0b0b0e]/95 border-slate-800/90 text-slate-300 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]'
      }`}
    >
      <div className="grid grid-cols-5 h-16 max-w-lg mx-auto px-1">
        {items.map((item) => {
          const isActive = currentTab === item.id || (item.id === 'hot' && currentTab === 'terbaru');
          return (
            <button
              key={item.id}
              id={`bottom-nav-${item.id}`}
              onClick={() => {
                onTabChange(item.id);
                if (onAdTrigger) {
                  onAdTrigger();
                }
              }}
              className="flex flex-col items-center justify-center gap-1 transition-all py-1 focus:outline-none"
            >
              <div
                className={`p-1 rounded-xl transition-transform ${
                  isActive
                    ? 'text-red-500 scale-110'
                    : isLightMode
                    ? 'text-slate-400 hover:text-slate-700'
                    : 'text-slate-500 hover:text-slate-200'
                }`}
              >
                {item.icon}
              </div>
              <span
                className={`text-[10px] font-medium tracking-tight ${
                  isActive
                    ? 'text-red-500 font-bold'
                    : isLightMode
                    ? 'text-slate-500'
                    : 'text-slate-400'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
