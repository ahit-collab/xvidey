import React from 'react';
import { Play, Plus, Check, Flame } from 'lucide-react';
import { Drama } from '../types';

interface DramaCardProps {
  drama: Drama;
  onSelect: (drama: Drama) => void;
  isInMyList?: boolean;
  onToggleMyList?: (drama: Drama) => void;
  isLightMode?: boolean;
  rank?: number;
  showViews?: boolean;
}

export const DramaCard: React.FC<DramaCardProps> = ({
  drama,
  onSelect,
  isInMyList = false,
  onToggleMyList,
  isLightMode = false,
  rank,
  showViews = false,
}) => {
  return (
    <div
      id={`drama-card-${drama.id}`}
      className="group flex flex-col cursor-pointer transition-all duration-300"
      onClick={() => onSelect(drama)}
      title={`Nonton ${drama.title} (Buka di Tab Baru)`}
    >
      {/* Poster Container */}
      <div className={`relative w-full aspect-[2/3] rounded-xl sm:rounded-2xl overflow-hidden shadow-md sm:shadow-lg border transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-1 ${
        isLightMode 
          ? 'bg-slate-200 border-slate-300 group-hover:border-red-500/50' 
          : 'bg-slate-900 border-slate-800/80 group-hover:border-red-500/50'
      }`}>
        {/* Poster Image */}
        <img
          src={drama.posterUrl}
          alt={drama.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Top-Left Rank Badge if provided */}
        {rank !== undefined && (
          <div className="absolute top-1 left-1 sm:top-2 sm:left-2 z-10">
            <span className={`flex items-center gap-0.5 sm:gap-1 px-1 sm:px-2 py-0.5 rounded-md sm:rounded-lg text-[8px] sm:text-[11px] font-black tracking-wide text-white shadow-md border border-white/20 ${
              rank === 1 
                ? 'bg-gradient-to-r from-amber-500 to-red-600 ring-1 sm:ring-2 ring-amber-400/50' 
                : rank === 2 
                ? 'bg-gradient-to-r from-slate-400 to-slate-600' 
                : rank === 3 
                ? 'bg-gradient-to-r from-amber-700 to-amber-900' 
                : 'bg-gradient-to-r from-red-600 to-orange-500'
            }`}>
              <Flame className="w-2 h-2 sm:w-3 sm:h-3 fill-white shrink-0" />
              #{rank}
            </span>
          </div>
        )}

        {/* Hot Icon Badge on Top-Right */}
        <div className="absolute top-1 right-1 sm:top-2 sm:right-2 z-10">
          <span 
            className="flex items-center justify-center p-1 sm:p-1.5 rounded-md sm:rounded-lg bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-md border border-white/20"
            title="Hot"
          >
            <Flame className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 fill-white text-white shrink-0" />
          </span>
        </div>

        {/* Hover / Active Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-1.5 sm:p-3">
          {/* Quick Play Button in center */}
          <div className="w-7 h-7 sm:w-11 sm:h-11 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
            <Play className="w-3.5 h-3.5 sm:w-5 sm:h-5 fill-white ml-0.5" />
          </div>

          {/* Add to list button at bottom-right of poster */}
          {onToggleMyList && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleMyList(drama);
              }}
              title={isInMyList ? 'Remove from My List' : 'Add to My List'}
              className={`absolute bottom-1 right-1 sm:bottom-2.5 sm:right-2.5 w-5 h-5 sm:w-7 sm:h-7 rounded-full flex items-center justify-center backdrop-blur-md transition ${
                isInMyList
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-black/60 text-white hover:bg-white hover:text-black'
              }`}
            >
              {isInMyList ? <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
            </button>
          )}
        </div>
      </div>

      {/* Meta underneath poster */}
      <div className="mt-1.5 sm:mt-2 px-0.5">
        <h3
          title={drama.title}
          className={`text-xs sm:text-sm font-semibold truncate leading-snug transition-colors duration-200 group-hover:text-red-500 ${
            isLightMode ? 'text-slate-800' : 'text-slate-100'
          }`}
        >
          {drama.title}
        </h3>
        <p className={`text-[10px] sm:text-xs mt-0.5 truncate ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>
          {drama.year} · {drama.genres[0]}
        </p>
        {showViews && drama.viewCountFormatted && (
          <div className="flex items-center gap-1 text-[9px] sm:text-[11px] font-semibold text-orange-500 mt-0.5 truncate">
            <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-orange-500 text-orange-500 shrink-0" />
            <span className="truncate">{drama.viewCountFormatted} Views</span>
          </div>
        )}
      </div>
    </div>
  );
};
