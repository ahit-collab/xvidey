import React from 'react';
import { Play, Info, Plus, Check, Star } from 'lucide-react';
import { Drama } from '../types';

interface HeroSliderProps {
  drama: Drama;
  onPlay: (drama: Drama) => void;
  isInMyList: boolean;
  onToggleMyList: (drama: Drama) => void;
  isLightMode: boolean;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({
  drama,
  onPlay,
  isInMyList,
  onToggleMyList,
  isLightMode,
}) => {
  return (
    <section 
      id="hero-featured-banner"
      className="relative w-full overflow-hidden rounded-3xl mb-8 shadow-2xl border border-slate-800/40"
      style={{ minHeight: '380px' }}
    >
      {/* Backdrop Image */}
      <img
        src={drama.bannerUrl || drama.posterUrl}
        alt={drama.title}
        className="absolute inset-0 w-full h-full object-cover object-center transform scale-105 transition-transform duration-1000"
      />

      {/* Modern Gradient Mask */}
      <div className={`absolute inset-0 transition-opacity duration-300 ${
        isLightMode
          ? 'bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent'
          : 'bg-gradient-to-r from-[#0b0b0e] via-[#0b0b0e]/80 to-transparent'
      }`} />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0e] via-transparent to-transparent opacity-90" />

      {/* Content */}
      <div className="relative z-10 max-w-2xl p-6 sm:p-10 flex flex-col justify-end min-h-[380px] text-white">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-red-600 text-white shadow-sm">
            TRENDING NO. 1
          </span>
          <span className="flex items-center gap-1 text-xs font-semibold text-amber-400 bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-sm">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            {drama.rating} / 10
          </span>
          <span className="text-xs text-slate-300 font-medium">{drama.year}</span>
          <span className="text-xs text-slate-300 font-medium">· {drama.episodeCount} EP</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white drop-shadow-md mb-2 sm:mb-3">
          {drama.title}
        </h1>

        <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 sm:line-clamp-3 mb-6 max-w-xl drop-shadow">
          {drama.synopsis}
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Watch / Play Button */}
          <button
            id="hero-watch-button"
            onClick={() => onPlay(drama)}
            title={`Nonton ${drama.title} (Buka di Tab Baru)`}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold shadow-lg transition duration-200 hover:scale-105 active:scale-95"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Nonton Sekarang</span>
          </button>

          {/* Add to list */}
          <button
            id="hero-add-list-button"
            onClick={() => onToggleMyList(drama)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-sm font-semibold transition duration-200 border border-white/20"
          >
            {isInMyList ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{isInMyList ? 'Daftar Tersimpan' : 'Tambah ke Daftar'}</span>
          </button>

          {/* Quick info */}
          <button
            onClick={() => onPlay(drama)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-black/40 hover:bg-black/60 backdrop-blur-md text-slate-200 text-sm font-medium transition border border-white/10"
          >
            <Info className="w-4 h-4" />
            <span className="hidden sm:inline">Info Detail</span>
          </button>
        </div>
      </div>
    </section>
  );
};
