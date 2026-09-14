import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, Filter, ChevronRight, Bookmark, Film, RefreshCw, 
  Tv, Heart, Flame, Layers, Eye
} from 'lucide-react';
import { Drama, NavTab, NotificationItem } from './types';
import { DRAMAS_DATA, GENRE_LIST, AD_CONFIG } from './data/dramas';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { DramaCard } from './components/DramaCard';
import { VideoModal } from './components/VideoModal';
import { AdBanner } from './components/AdBanner';
import { ToastContainer, ToastMessage } from './components/Toast';
import { Pagination } from './components/Pagination';

export default function App() {
  // Navigation & View State
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Semua');
  const [selectedDrama, setSelectedDrama] = useState<Drama | null>(null);

  // Night / Light Mode (#0b0b0e Dark vs #f8fafc Light)
  const [isLightMode, setIsLightMode] = useState<boolean>(() => {
    return localStorage.getItem('dramaku_theme') === 'light';
  });

  // User Saved List (Bookmarked Dramas)
  const [myList, setMyList] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('dramaku_mylist');
      return saved ? JSON.parse(saved) : ['d1', 'd5'];
    } catch {
      return ['d1', 'd5'];
    }
  });

  // Interactive Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'n1',
      title: 'New Episode Released!',
      message: 'Episode 65 of Suami untuk Tiga Tahun is now streaming.',
      time: '10 mins ago',
      read: false,
    },
    {
      id: 'n2',
      title: 'Trending Series 2025',
      message: 'Cinta Dalam Diam hit 9.1 rating this week.',
      time: '2 hours ago',
      read: false,
    },
    {
      id: 'n3',
      title: 'Special Recommendation',
      message: 'Discover the latest hit mystery series The Hidden Story.',
      time: '1 day ago',
      read: true,
    }
  ]);

  // 4 Baris: Mobile 2 kolom (8 judul/hal) & Desktop 5 kolom (20 judul/hal)
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const ITEMS_PER_PAGE = isMobile ? 8 : 20;
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Sync theme with body background
  useEffect(() => {
    if (isLightMode) {
      document.body.style.backgroundColor = '#f8fafc';
      document.body.classList.remove('dark');
      localStorage.setItem('dramaku_theme', 'light');
    } else {
      document.body.style.backgroundColor = '#0b0b0e';
      document.body.classList.add('dark');
      localStorage.setItem('dramaku_theme', 'dark');
    }
  }, [isLightMode]);

  // Sync MyList with localStorage
  useEffect(() => {
    localStorage.setItem('dramaku_mylist', JSON.stringify(myList));
  }, [myList]);

  // Helper to add toast
  const addToast = (message: string, type: 'success' | 'info' | 'ad' | 'warning' = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Anti-Copy & Content Protection System
  useEffect(() => {
    // 1. Block Context Menu (Right Click)
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }
      e.preventDefault();
      addToast('Konten dilindungi! Klik kanan dinonaktifkan.', 'warning');
    };

    // 2. Block Copy & Cut outside form inputs
    const handleCopy = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }
      e.preventDefault();
      addToast('Dilarang menyalin teks atau konten dari situs ini!', 'warning');
    };

    const handleCut = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }
      e.preventDefault();
    };

    // 3. Block Drag & Drop on images and links
    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG' || target.tagName === 'A') {
        e.preventDefault();
      }
    };

    // 4. Block Inspect Element & Source Shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

      // F12 (DevTools)
      if (e.key === 'F12') {
        e.preventDefault();
        addToast('Developer tools dinonaktifkan.', 'warning');
        return;
      }

      // Ctrl or Meta (Command on Mac) shortcuts
      if (e.ctrlKey || e.metaKey) {
        // Ctrl+U (View Source)
        if (e.key === 'u' || e.key === 'U') {
          e.preventDefault();
          addToast('Akses source code dinonaktifkan.', 'warning');
          return;
        }
        // Ctrl+S (Save Page)
        if (e.key === 's' || e.key === 'S') {
          e.preventDefault();
          addToast('Menyimpan halaman dinonaktifkan.', 'warning');
          return;
        }
        // Ctrl+Shift+I / J / C (Inspect/Devtools)
        if (e.shiftKey && ['I', 'i', 'J', 'j', 'C', 'c'].includes(e.key)) {
          e.preventDefault();
          addToast('Inspect element dinonaktifkan.', 'warning');
          return;
        }
        // Ctrl+C (Copy outside input)
        if (!isInput && (e.key === 'c' || e.key === 'C')) {
          e.preventDefault();
          addToast('Menyalin konten dinonaktifkan.', 'warning');
          return;
        }
        // Ctrl+P (Print Page)
        if (e.key === 'p' || e.key === 'P') {
          e.preventDefault();
          addToast('Pencetakan halaman dinonaktifkan.', 'warning');
          return;
        }
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('cut', handleCut);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('cut', handleCut);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Popunder monetization script injection
  useEffect(() => {
    const rawPopunder = AD_CONFIG.POPUNDER_LINK;
    if (!rawPopunder || rawPopunder.includes('Paste script iklan')) return;

    const srcMatch = rawPopunder.match(/src=["']([^"']+)["']/);
    const scriptSrc = srcMatch ? srcMatch[1] : null;

    if (scriptSrc) {
      const script = document.createElement('script');
      script.src = scriptSrc;
      script.async = true;
      script.id = 'popunder-ad-script';
      document.body.appendChild(script);

      return () => {
        const existing = document.getElementById('popunder-ad-script');
        if (existing) {
          existing.remove();
        }
      };
    }
  }, []);

  // Toggle Night / Light Mode
  const toggleTheme = () => {
    setIsLightMode((prev) => {
      const next = !prev;
      addToast(
        next ? 'Light Mode enabled' : 'Night Mode enabled',
        'info'
      );
      return next;
    });
  };

  // Toggle My List Bookmark
  const toggleMyList = (drama: Drama) => {
    setMyList((prev) => {
      const exists = prev.includes(drama.id);
      if (exists) {
        addToast(`Removed from My List: "${drama.title}"`, 'info');
        return prev.filter((id) => id !== drama.id);
      } else {
        addToast(`Added to My List: "${drama.title}"`, 'success');
        return [...prev, drama.id];
      }
    });
  };

  // Dual Action: Open Video Player Modal AND trigger DIRECT_LINK
  const handleWatchClick = (drama: Drama) => {
    // 1. Open Video Modal
    setSelectedDrama(drama);

    // 2. Dual Action: Trigger Direct Link
    handleAdTrigger();
  };

  // Handle Monetization DIRECT_LINK
  const handleAdTrigger = () => {
    // Check if DIRECT_LINK has real URL or trigger direct link simulation
    const rawDirectLink = AD_CONFIG.DIRECT_LINK;
    const urlMatch = rawDirectLink.match(/https?:\/\/[^\s"']+/);

    if (urlMatch) {
      window.open(urlMatch[0], '_blank');
    } else {
      // In development/zero-config, trigger sponsor toast feedback
      addToast('[Monetization Ad]: Opening sponsor Direct Link in a new tab', 'ad');
    }
  };

  // Handle Mark Notification as Read
  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    addToast('Notification marked as read', 'info');
  };

  // Handle Page Navigation for 4-row (20 items) pagination
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    addToast(`Navigating to Page ${newPage}`, 'info');
    const target = document.getElementById('main-content-start');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 380, behavior: 'smooth' });
    }
  };

  // Filtered Dramas based on Search Query
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return DRAMAS_DATA.filter((d) => 
      d.title.toLowerCase().includes(q) ||
      d.genres.some((g) => g.toLowerCase().includes(q)) ||
      d.cast.some((c) => c.toLowerCase().includes(q)) ||
      (d.director && d.director.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  // Category & Genre-specific full collections (paginated dynamically 4 rows x 5 columns = 20 items)
  // Home Page: Menampilkan SEMUA konten video sesuai urutan baris pertama dari database film (tanpa sorting ID)
  const homeDramas = useMemo(() => {
    return DRAMAS_DATA;
  }, []);

  const newReleaseDramas = useMemo(() => {
    return DRAMAS_DATA.filter((d) => d.isNewRelease);
  }, []);

  const featuredDramas = useMemo(() => {
    const featured = DRAMAS_DATA.filter((d) => d.isFeatured);
    const others = DRAMAS_DATA.filter((d) => !d.isFeatured).sort((a, b) => b.rating - a.rating);
    return [...featured, ...others];
  }, []);

  const mostWatchedDramas = useMemo(() => {
    return [...DRAMAS_DATA].sort((a, b) => (b.views || 0) - (a.views || 0));
  }, []);

  const genreFilteredDramas = useMemo(() => {
    if (selectedGenre === 'All' || selectedGenre === 'Semua') return DRAMAS_DATA;
    const matched = DRAMAS_DATA.filter((d) => d.genres.includes(selectedGenre));
    return matched;
  }, [selectedGenre]);

  const myListDramas = useMemo(() => {
    return DRAMAS_DATA.filter((d) => myList.includes(d.id));
  }, [myList]);

  return (
    <div className={`min-h-screen flex flex-col selection:bg-red-500 selection:text-white transition-colors duration-300 ${
      isLightMode ? 'bg-[#f8fafc] text-slate-900' : 'bg-[#0b0b0e] text-slate-100'
    }`}>
      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Top Main Navbar */}
      <Navbar
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          setSearchQuery('');
          setCurrentPage(1);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
        isLightMode={isLightMode}
        onToggleTheme={toggleTheme}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        onAdTrigger={handleAdTrigger}
        myListCount={myList.length}
      />

      {/* Main Content Area (Dynamic based on Tab and Search) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-2 sm:px-6 pt-5 pb-24 md:pb-12">
        <div id="main-content-start" className="scroll-mt-24" />

        {/* If Active Search Query -> Show Live Search Results */}
        {searchQuery.trim() !== '' ? (
          <section id="search-results-section" className="animate-in fade-in duration-300">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold">
                  Search Results for: <span className="text-red-500">"{searchQuery}"</span>
                </h2>
                <p className={`text-xs mt-1 ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  Found {searchResults.length} matching titles (4 Rows per Page)
                </p>
              </div>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-600/10 text-red-500 hover:bg-red-600/20 transition"
              >
                Clear Search
              </button>
            </div>

            {searchResults.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 sm:gap-3 md:gap-4">
                  {searchResults.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((drama) => (
                    <DramaCard
                      key={drama.id}
                      drama={drama}
                      onSelect={handleWatchClick}
                      isInMyList={myList.includes(drama.id)}
                      onToggleMyList={toggleMyList}
                      isLightMode={isLightMode}
                    />
                  ))}
                </div>

                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(searchResults.length / ITEMS_PER_PAGE)}
                  onPageChange={handlePageChange}
                  totalItems={searchResults.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                  isLightMode={isLightMode}
                  id="search-pagination"
                />
              </>
            ) : (
              <div className="text-center py-16">
                <Film className="w-12 h-12 text-slate-500 mx-auto mb-3 opacity-50" />
                <h3 className="text-base font-semibold">No Titles Found</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Try searching with keywords like "Romance", "Mystery", "Love", or "2025".
                </p>
              </div>
            )}
          </section>
        ) : (
          <>
            {/* TAB 1: HOME - MENAMPILKAN SEMUA KONTEN VIDEO DARI DATABASE SESUAI URUTAN BARIS */}
            {currentTab === 'home' && (
              <div className="space-y-8 animate-in fade-in duration-200">
                {/* SECTION: NEW RELEASE & SEMUA VIDEO (Mobile: 2 Kolom x 4 Baris = 8 Judul | Desktop: 5 Kolom x 4 Baris = 20 Judul) */}
                <section id="section-new-release">
                  {/* Header: Title */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-1.5 h-6 rounded-full bg-red-600" />
                      <div>
                        <h2 className={`text-xl sm:text-2xl font-black tracking-tight ${
                          isLightMode ? 'text-slate-900' : 'text-white'
                        }`}>
                          Semua Video
                        </h2>
                        <p className={`text-xs mt-0.5 ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>
                          Menampilkan seluruh koleksi ({homeDramas.length} video) berurutan dari baris pertama database film
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                      isLightMode ? 'bg-slate-100 text-slate-600' : 'bg-slate-800 text-slate-300'
                    }`}>
                      Halaman {currentPage} dari {Math.ceil(homeDramas.length / ITEMS_PER_PAGE)}
                    </span>
                  </div>

                  {/* Slot Banner Iklan di Atas Baris Poster */}
                  <AdBanner 
                    id="ad-banner-top-new-release"
                    type="horizontal" 
                    slotLabel="Top Placement · 728x90"
                    onAdClick={handleAdTrigger} 
                    className="mb-4 sm:mb-5 mt-1"
                  />

                  {/* 4 Rows Grid (Mobile: 2 Cols = 8 items, Desktop: 5 Cols = 20 items) */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 sm:gap-3 md:gap-4">
                    {homeDramas.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((drama) => (
                      <DramaCard
                        key={drama.id}
                        drama={drama}
                        onSelect={handleWatchClick}
                        isInMyList={myList.includes(drama.id)}
                        onToggleMyList={toggleMyList}
                        isLightMode={isLightMode}
                      />
                    ))}
                  </div>

                  {/* Pagination: 1, 2, 3, dan selanjutnya */}
                  <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(homeDramas.length / ITEMS_PER_PAGE)}
                    onPageChange={handlePageChange}
                    totalItems={homeDramas.length}
                    itemsPerPage={ITEMS_PER_PAGE}
                    isLightMode={isLightMode}
                    id="new-release-pagination"
                  />
                </section>

                {/* ============================================================== */}
                {/* [MONETIZATION RULE 2]: BANNER_HORIZONTAL DI BAWAH NEW RELEASE */}
                {/* ============================================================== */}
                <AdBanner type="horizontal" onAdClick={handleAdTrigger} />
              </div>
            )}

            {/* TAB 2: CHINA (FEATURED) */}
            {currentTab === 'featured' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className={`p-6 sm:p-8 rounded-3xl border transition ${
                  isLightMode 
                    ? 'bg-gradient-to-r from-red-50 to-amber-50 border-red-200' 
                    : 'bg-gradient-to-r from-red-950/30 via-slate-900 to-slate-900 border-red-900/30'
                }`}>
                  <div className="flex items-center gap-2 text-red-500 text-xs font-bold uppercase tracking-wider mb-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Popular & Featured Chinese Drama Collection</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">
                    Chinese Drama Series & Movies 2025
                  </h2>
                  <p className={`text-xs sm:text-sm max-w-xl ${isLightMode ? 'text-slate-600' : 'text-slate-300'}`}>
                    Curated selection of Chinese dramas with high-end cinematography, wuxia romance, modern stories, and top audience reviews.
                  </p>
                </div>

                {/* 4 Rows Grid (Mobile: 2 Cols = 8 items, Desktop: 5 Cols = 20 items) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 sm:gap-3 md:gap-4">
                  {featuredDramas.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((drama) => (
                    <DramaCard
                      key={drama.id}
                      drama={drama}
                      onSelect={handleWatchClick}
                      isInMyList={myList.includes(drama.id)}
                      onToggleMyList={toggleMyList}
                      isLightMode={isLightMode}
                    />
                  ))}
                </div>

                {/* Pagination: 1, 2, 3, dan selanjutnya */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(featuredDramas.length / ITEMS_PER_PAGE)}
                  onPageChange={handlePageChange}
                  totalItems={featuredDramas.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                  isLightMode={isLightMode}
                  id="featured-pagination"
                />

                <AdBanner type="horizontal" onAdClick={handleAdTrigger} />
              </div>
            )}

            {/* TAB 3: DRAMA */}
            {currentTab === 'drama' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 border-slate-700/40">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <Tv className="w-6 h-6 text-red-500" />
                      <span>Complete Drama Catalog</span>
                    </h2>
                    <p className={`text-xs mt-1 ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>
                      Explore all latest Asian & Indonesian drama series (4 Rows · {isMobile ? '8' : '20'} Titles per Page)
                    </p>
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-red-600/10 text-red-500 self-start sm:self-auto">
                    Total: {DRAMAS_DATA.length} Titles · Page {currentPage}/{Math.ceil(DRAMAS_DATA.length / ITEMS_PER_PAGE)}
                  </span>
                </div>

                {/* 4 Rows Grid (Mobile: 2 Cols = 8 items, Desktop: 5 Cols = 20 items) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 sm:gap-3 md:gap-4">
                  {DRAMAS_DATA.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((drama) => (
                    <DramaCard
                      key={drama.id}
                      drama={drama}
                      onSelect={handleWatchClick}
                      isInMyList={myList.includes(drama.id)}
                      onToggleMyList={toggleMyList}
                      isLightMode={isLightMode}
                    />
                  ))}
                </div>

                {/* Pagination: 1, 2, 3, dan selanjutnya */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(DRAMAS_DATA.length / ITEMS_PER_PAGE)}
                  onPageChange={handlePageChange}
                  totalItems={DRAMAS_DATA.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                  isLightMode={isLightMode}
                  id="katalog-pagination"
                />

                <AdBanner type="horizontal" onAdClick={handleAdTrigger} />
              </div>
            )}

            {/* TAB 4: GENRE / EROTICS */}
            {currentTab === 'genre' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2 mb-1">
                    <Filter className="w-6 h-6 text-red-500" />
                    <span>Browse By Genre</span>
                  </h2>
                  <p className={`text-xs ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    Filter your favorite shows by theme and storyline (4 Rows per Page)
                  </p>
                </div>

                {/* Genre Filter Chips */}
                <div className="flex flex-wrap gap-2">
                  {GENRE_LIST.map((genre) => (
                    <button
                      key={genre}
                      onClick={() => {
                        setSelectedGenre(genre);
                        setCurrentPage(1);
                        addToast(`Genre filter applied: ${genre}`, 'info');
                      }}
                      className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                        selectedGenre === genre
                          ? 'bg-red-600 text-white shadow-md scale-105'
                          : isLightMode
                          ? 'bg-white border border-slate-300 text-slate-700 hover:border-red-400'
                          : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>

                {/* Results Count for selected genre */}
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>
                    Genre: <strong className={isLightMode ? 'text-slate-900' : 'text-white'}>{selectedGenre}</strong>
                  </span>
                  <span>{genreFilteredDramas.length} titles found</span>
                </div>

                {/* 4 Rows Grid (Mobile: 2 Cols = 8 items, Desktop: 5 Cols = 20 items) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 sm:gap-3 md:gap-4">
                  {genreFilteredDramas.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((drama) => (
                    <DramaCard
                      key={drama.id}
                      drama={drama}
                      onSelect={handleWatchClick}
                      isInMyList={myList.includes(drama.id)}
                      onToggleMyList={toggleMyList}
                      isLightMode={isLightMode}
                    />
                  ))}
                </div>

                {/* Pagination: 1, 2, 3, dan selanjutnya */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(genreFilteredDramas.length / ITEMS_PER_PAGE)}
                  onPageChange={handlePageChange}
                  totalItems={genreFilteredDramas.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                  isLightMode={isLightMode}
                  id="genre-pagination"
                />

                <AdBanner type="horizontal" onAdClick={handleAdTrigger} />
              </div>
            )}

            {/* TAB 5: HOT (MOST WATCHED) */}
            {(currentTab === 'hot' || currentTab === 'terbaru') && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Hot Banner / Hero Spotlight */}
                <div className={`p-6 sm:p-8 rounded-3xl border relative overflow-hidden ${
                  isLightMode 
                    ? 'bg-gradient-to-r from-orange-500/10 via-red-500/10 to-transparent border-orange-200 text-slate-900' 
                    : 'bg-gradient-to-r from-orange-950/40 via-red-950/30 to-slate-900 border-orange-900/40 text-white'
                }`}>
                  <div className="flex items-center gap-2 text-orange-500 text-xs font-black uppercase tracking-wider mb-2">
                    <Flame className="w-4 h-4 fill-orange-500 text-orange-500 animate-pulse" />
                    <span>Trending & Most Popular 2025</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black mb-2 flex items-center gap-2">
                    <span>Most Watched Content</span>
                    <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-orange-500 text-white shadow-sm uppercase tracking-wide">
                      HOT
                    </span>
                  </h2>
                  <p className={`text-xs sm:text-sm max-w-2xl ${isLightMode ? 'text-slate-600' : 'text-slate-300'}`}>
                    Top-ranked drama series and movies most viewed and loved by millions of streaming audiences (4 Rows per Page).
                  </p>
                </div>

                <div className="flex items-center justify-between border-b pb-3 border-slate-700/40">
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
                    <h3 className="text-lg font-bold">Popular Drama Leaderboard</h3>
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-orange-500/10 text-orange-500 border border-orange-500/20">
                    Live Viewership Ranking
                  </span>
                </div>

                {/* 4 Rows Grid (Mobile: 2 Cols = 8 items, Desktop: 5 Cols = 20 items) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 sm:gap-3 md:gap-4">
                  {mostWatchedDramas.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((drama, index) => (
                    <DramaCard
                      key={drama.id}
                      drama={drama}
                      onSelect={handleWatchClick}
                      isInMyList={myList.includes(drama.id)}
                      onToggleMyList={toggleMyList}
                      isLightMode={isLightMode}
                      rank={(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                      showViews={true}
                    />
                  ))}
                </div>

                {/* Pagination: 1, 2, 3, dan selanjutnya */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(mostWatchedDramas.length / ITEMS_PER_PAGE)}
                  onPageChange={handlePageChange}
                  totalItems={mostWatchedDramas.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                  isLightMode={isLightMode}
                  id="hot-pagination"
                />

                <AdBanner type="horizontal" onAdClick={handleAdTrigger} />
              </div>
            )}

            {/* TAB 6: MY LIST */}
            {currentTab === 'mylist' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b pb-4 border-slate-700/40">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <Bookmark className="w-6 h-6 text-red-500" />
                      <span>My Watchlist</span>
                    </h2>
                    <p className={`text-xs mt-1 ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>
                      Collection of drama titles you saved to watch later
                    </p>
                  </div>
                  {myListDramas.length > 0 && (
                    <button
                      onClick={() => {
                        setMyList([]);
                        addToast('Watchlist successfully cleared', 'info');
                      }}
                      className="text-xs font-semibold text-red-500 hover:underline"
                    >
                      Clear Watchlist
                    </button>
                  )}
                </div>

                {myListDramas.length > 0 ? (
                  <>
                    {/* 4 Rows Grid (Mobile: 2 Cols = 8 items, Desktop: 5 Cols = 20 items) */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 sm:gap-3 md:gap-4">
                      {myListDramas.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((drama) => (
                        <DramaCard
                          key={drama.id}
                          drama={drama}
                          onSelect={handleWatchClick}
                          isInMyList={true}
                          onToggleMyList={toggleMyList}
                          isLightMode={isLightMode}
                        />
                      ))}
                    </div>

                    {myListDramas.length > ITEMS_PER_PAGE && (
                      <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(myListDramas.length / ITEMS_PER_PAGE)}
                        onPageChange={handlePageChange}
                        totalItems={myListDramas.length}
                        itemsPerPage={ITEMS_PER_PAGE}
                        isLightMode={isLightMode}
                        id="mylist-pagination"
                      />
                    )}
                  </>
                ) : (
                  <div className="text-center py-20">
                    <Bookmark className="w-14 h-14 text-slate-500 mx-auto mb-3 opacity-40" />
                    <h3 className="text-base font-semibold">Your Watchlist is Empty</h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto mb-6">
                      Click the '+' button on any drama poster to save your favorite titles here.
                    </p>
                    <button
                      onClick={() => {
                        setCurrentTab('home');
                        setCurrentPage(1);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition"
                    >
                      Explore Titles Now
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className={`border-t py-8 px-4 text-center transition-colors duration-300 ${
        isLightMode 
          ? 'bg-slate-100 border-slate-200 text-slate-500' 
          : 'bg-[#08080b] border-slate-800/80 text-slate-500'
      }`}>
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="flex items-center justify-center gap-1 text-lg font-black tracking-wider">
            <span className="text-red-600">X-</span>
            <span className={isLightMode ? 'text-slate-900' : 'text-white'}>VIDEY</span>
          </div>
          <p className="text-xs max-w-xl mx-auto leading-relaxed text-slate-400">
            Disclaimer: This site does not store any video files on its servers. All videos, media, and contents are hosted and embedded from third-party video sharing platforms freely available across the internet.
          </p>
          <div className="flex justify-center gap-4 text-xs font-medium pt-1">
            <button onClick={() => { setCurrentTab('home'); setCurrentPage(1); }} className="hover:text-red-500">Home</button>
            <button onClick={() => { setCurrentTab('drama'); setCurrentPage(1); }} className="hover:text-red-500">Catalog</button>
            <button onClick={() => { setCurrentTab('genre'); setCurrentPage(1); }} className="hover:text-red-500">Genre</button>
          </div>
          <p className="text-[11px] text-slate-600 pt-2">
            © 2025 X-VIDEY. All rights reserved.
          </p>

          {/* Histats.com Counter Widget */}
          <div className="flex flex-col items-center justify-center pt-2 pb-6 sm:pb-0">
            <div id="histats_counter" className="inline-block min-h-[20px]"></div>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar (Matching Screenshot) */}
      <BottomNav
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          setSearchQuery('');
          setCurrentPage(1);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isLightMode={isLightMode}
        myListCount={myList.length}
        onAdTrigger={handleAdTrigger}
      />

      {/* Popup Video Player Modal */}
      <VideoModal
        drama={selectedDrama}
        onClose={() => setSelectedDrama(null)}
        isInMyList={selectedDrama ? myList.includes(selectedDrama.id) : false}
        onToggleMyList={toggleMyList}
        onAdTrigger={handleAdTrigger}
        isLightMode={isLightMode}
      />
    </div>
  );
}
