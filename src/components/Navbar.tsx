import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, Sun, Moon, Bell, X, Film, Sparkles, CheckCheck, Menu, Flame
} from 'lucide-react';
import { NavTab, NotificationItem } from '../types';

interface NavbarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isLightMode: boolean;
  onToggleTheme: () => void;
  notifications: NotificationItem[];
  onMarkNotificationRead: (id: string) => void;
  onAdTrigger?: () => void;
  myListCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  isLightMode,
  onToggleTheme,
  notifications,
  onMarkNotificationRead,
  onAdTrigger,
  myListCount,
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems: { id: NavTab; label: string; icon?: React.ReactNode; elementId?: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'featured', label: 'China' },
    { id: 'drama', label: 'Drama' },
    { id: 'genre', label: 'Erotics' },
    { 
      id: 'hot', 
      label: 'Hot', 
      icon: <Flame className="w-4 h-4 text-orange-500 fill-orange-500 shrink-0" />,
      elementId: 'nav-tab-terbaru'
    },
  ];

  return (
    <header 
      id="main-navbar"
      className={`sticky top-0 z-40 w-full transition-colors duration-300 border-b backdrop-blur-md ${
        isLightMode 
          ? 'bg-white/90 border-slate-200 text-slate-900 shadow-sm' 
          : 'bg-[#0b0b0e]/90 border-slate-800/80 text-white shadow-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Logo & Desktop Navigation */}
        <div className="flex items-center gap-6 md:gap-8">
          {/* X-VIDEY Brand Logo */}
          <button
            id="brand-logo-btn"
            onClick={() => onTabChange('home')}
            className="flex items-center gap-1 text-xl sm:text-2xl font-black tracking-wider focus:outline-none"
          >
            <span className="text-red-600 drop-shadow-sm">X-</span>
            <span className={isLightMode ? 'text-slate-900' : 'text-white'}>VIDEY</span>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={item.elementId || `nav-tab-${item.id}`}
                onClick={() => {
                  onTabChange(item.id);
                  if (onAdTrigger) {
                    onAdTrigger();
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                  currentTab === item.id || (item.id === 'hot' && currentTab === 'terbaru')
                    ? 'text-red-600 bg-red-600/10 font-bold'
                    : isLightMode
                    ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}

            {/* My List Tab */}
            <button
              id="nav-tab-mylist"
              onClick={() => onTabChange('mylist')}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                currentTab === 'mylist'
                  ? 'text-red-600 bg-red-600/10'
                  : isLightMode
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span>My List</span>
              {myListCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[11px] bg-red-600 text-white font-bold">
                  {myListCount}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Center/Right: Live Search & Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live Search Input (Desktop & Expandable Mobile) */}
          <div className="relative flex items-center">
            <div className={`hidden sm:flex items-center rounded-xl px-3 py-1.5 border transition-all duration-200 w-48 lg:w-72 ${
              isLightMode 
                ? 'bg-slate-100 border-slate-300 focus-within:border-red-500 focus-within:bg-white' 
                : 'bg-slate-900/90 border-slate-700/70 focus-within:border-red-500 focus-within:bg-slate-950'
            }`}>
              <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
              <input
                id="desktop-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search drama, genre, cast..."
                className="w-full bg-transparent text-xs sm:text-sm focus:outline-none placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="text-slate-400 hover:text-white ml-1 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Mobile Search Toggle Button */}
            <button
              id="mobile-search-toggle"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`sm:hidden p-2 rounded-xl border transition ${
                isLightMode 
                  ? 'border-slate-200 text-slate-700 hover:bg-slate-100' 
                  : 'border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
              title="Search Drama"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* Night / Light Mode Toggle Button */}
          <button
            id="theme-toggle-btn"
            onClick={onToggleTheme}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition duration-200 ${
              isLightMode
                ? 'bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200'
                : 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800'
            }`}
            title={isLightMode ? 'Switch to Night Mode' : 'Switch to Light Mode'}
          >
            {isLightMode ? (
              <>
                <Moon className="w-4 h-4 text-indigo-600" />
                <span className="hidden sm:inline">Night</span>
              </>
            ) : (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Light</span>
              </>
            )}
          </button>

          {/* Interactive Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              id="notif-toggle-btn"
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className={`relative p-2 rounded-xl border transition ${
                isLightMode 
                  ? 'border-slate-200 text-slate-700 hover:bg-slate-100' 
                  : 'border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Panel */}
            {isNotifOpen && (
              <div className={`absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl shadow-2xl border p-4 z-50 animate-in fade-in duration-150 ${
                isLightMode 
                  ? 'bg-white border-slate-200 text-slate-900' 
                  : 'bg-[#121218] border-slate-800 text-slate-100'
              }`}>
                <div className="flex items-center justify-between pb-3 border-b border-slate-700/40">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-red-500" />
                    <h4 className="text-sm font-bold">Notifications Center</h4>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-red-600/20 text-red-500 font-semibold">
                    {unreadCount} New
                  </span>
                </div>

                <div className="divide-y divide-slate-800/40 max-h-72 overflow-y-auto mt-2">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => onMarkNotificationRead(n.id)}
                      className={`py-2.5 px-2 rounded-lg cursor-pointer transition flex items-start gap-3 ${
                        !n.read 
                          ? isLightMode ? 'bg-red-50/60' : 'bg-red-950/20' 
                          : isLightMode ? 'hover:bg-slate-50' : 'hover:bg-slate-900/40'
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.read ? 'bg-red-500' : 'bg-transparent'}`} />
                      <div className="flex-1">
                        <p className="text-xs font-semibold">{n.title}</p>
                        <p className={`text-xs mt-0.5 ${isLightMode ? 'text-slate-600' : 'text-slate-400'}`}>
                          {n.message}
                        </p>
                        <span className="text-[10px] text-slate-500 mt-1 block">{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            id="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-xl border transition ${
              isLightMode 
                ? 'border-slate-200 text-slate-700 hover:bg-slate-100' 
                : 'border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
            title="Menu"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expandable Mobile Search Bar */}
      {isSearchOpen && (
        <div className={`sm:hidden px-4 py-3 border-t ${
          isLightMode ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
        }`}>
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-slate-400" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search drama title, genre, cast..."
              className={`w-full pl-9 pr-8 py-2 rounded-xl text-sm border focus:outline-none ${
                isLightMode 
                  ? 'bg-white border-slate-300 text-slate-900' 
                  : 'bg-slate-900 border-slate-700 text-white'
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className={`md:hidden px-4 py-3 border-t space-y-1 ${
          isLightMode ? 'bg-white border-slate-200' : 'bg-[#0f0f14] border-slate-800'
        }`}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                setIsMobileMenuOpen(false);
                if (onAdTrigger) {
                  onAdTrigger();
                }
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2 ${
                currentTab === item.id || (item.id === 'hot' && currentTab === 'terbaru')
                  ? 'text-red-600 bg-red-600/10 font-bold'
                  : isLightMode
                  ? 'text-slate-700 hover:bg-slate-100'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
          <button
            onClick={() => {
              onTabChange('mylist');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition flex items-center justify-between ${
              currentTab === 'mylist'
                ? 'text-red-600 bg-red-600/10'
                : isLightMode
                ? 'text-slate-700 hover:bg-slate-100'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span>My List</span>
            {myListCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs bg-red-600 text-white font-bold">
                {myListCount}
              </span>
            )}
          </button>
        </div>
      )}
    </header>
  );
};
