import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, 
  Share2, Plus, Check, Flame, Film, Server, ExternalLink
} from 'lucide-react';
import { Drama } from '../types';
import { AdBanner } from './AdBanner';
import { AD_CONFIG } from '../data/dramas';

interface VideoModalProps {
  drama: Drama | null;
  onClose: () => void;
  isInMyList: boolean;
  onToggleMyList: (drama: Drama) => void;
  onAdTrigger?: () => void;
  isLightMode?: boolean;
}

export const VideoModal: React.FC<VideoModalProps> = ({
  drama,
  onClose,
  isInMyList,
  onToggleMyList,
  onAdTrigger,
  isLightMode = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentEpisode, setCurrentEpisode] = useState(1);
  const [activeServer, setActiveServer] = useState('Server VIP 1');
  const [videoQuality, setVideoQuality] = useState('1080p FHD');
  const [copied, setCopied] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!drama) return;
    setIsPlaying(true);
    setCurrentEpisode(1);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [drama]);

  if (!drama) return null;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handlePlayerClick = () => {
    if (onAdTrigger) {
      onAdTrigger();
    }
    togglePlay();
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const episodes = Array.from({ length: Math.min(drama.episodeCount, 24) }, (_, i) => i + 1);

  return (
    <div 
      id="video-player-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className={`relative w-full max-w-5xl rounded-2xl shadow-2xl border overflow-hidden transition-all duration-300 my-auto ${
          isLightMode 
            ? 'bg-slate-50 border-slate-300 text-slate-900' 
            : 'bg-[#0e0e13] border-slate-800 text-slate-100'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className={`flex items-center justify-between px-4 py-3 border-b ${
          isLightMode ? 'bg-white border-slate-200' : 'bg-[#15151c] border-slate-800'
        }`}>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
            <span className="text-xs font-bold uppercase tracking-wider text-red-500">
              Now Playing: Episode {currentEpisode}
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">· {drama.title}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Open Watch in New Tab Button */}
            <a
              id="modal-header-new-tab-btn"
              href={AD_CONFIG.DIRECT_LINK || drama.embedUrl || drama.videoUrl || `?watch=${drama.id}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                if (onAdTrigger) onAdTrigger();
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs font-bold transition border shadow-sm ${
                isLightMode 
                  ? 'bg-red-50 hover:bg-red-100 border-red-200 text-red-600' 
                  : 'bg-red-600/20 hover:bg-red-600/30 border-red-500/30 text-red-400'
              }`}
              title="Buka di Tab Baru (Open in New Tab)"
            >
              <ExternalLink className="w-3.5 h-3.5 text-red-500" />
              <span className="hidden sm:inline">Buka di Tab Baru</span>
            </a>

            {/* Close Button */}
            <button
              id="modal-close-button"
              onClick={onClose}
              className={`p-1.5 rounded-full transition ${
                isLightMode ? 'hover:bg-slate-200 text-slate-700' : 'hover:bg-slate-800 text-slate-300'
              }`}
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Player Box */}
        <div className="relative aspect-video bg-black flex items-center justify-center group overflow-hidden">
          {drama.embedUrl ? (
            <iframe
              src={drama.embedUrl}
              title={drama.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <>
              <video
                ref={videoRef}
                src={drama.videoUrl}
                autoPlay
                playsInline
                loop
                className="w-full h-full object-contain cursor-pointer"
                onClick={handlePlayerClick}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />

              {/* Watermark Logo in video */}
              <div className="absolute top-4 left-4 pointer-events-none opacity-70">
                <div className="text-xs font-black tracking-widest text-white/80 bg-black/40 px-2 py-1 rounded backdrop-blur-sm">
                  X-<span className="text-red-600">VIDEY</span>
                </div>
              </div>

              {/* Center Play/Pause big button when paused */}
              {!isPlaying && (
                <button
                  onClick={handlePlayerClick}
                  className="absolute w-16 h-16 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition duration-300"
                >
                  <Play className="w-8 h-8 fill-white ml-1" />
                </button>
              )}

              {/* Custom Player Controls Bar */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePlayerClick}
                    className="text-white hover:text-red-500 transition p-1"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
                  </button>
                  <button
                    onClick={toggleMute}
                    className="text-white hover:text-red-500 transition p-1"
                  >
                    {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  <span className="text-xs text-white/90 font-mono">
                    Ep. {currentEpisode} / {drama.episodeCount}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Quality Selector */}
                  <select
                    value={videoQuality}
                    onChange={(e) => setVideoQuality(e.target.value)}
                    className="bg-black/60 text-white text-xs rounded px-2 py-1 border border-white/20 focus:outline-none"
                  >
                    <option value="1080p FHD">1080p FHD</option>
                    <option value="720p HD">720p HD</option>
                    <option value="480p SD">480p SD</option>
                  </select>

                  {/* Fullscreen Button */}
                  <button
                    onClick={handleFullscreen}
                    className="text-white hover:text-red-500 transition p-1"
                    title="Fullscreen"
                  >
                    <Maximize className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Watch Page CTA Bar: Opens in New Tab */}
        <div className={`px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 border-b ${
          isLightMode ? 'bg-red-50 border-slate-200 text-slate-800' : 'bg-[#15151e] border-slate-800 text-slate-200'
        }`}>
          <div className="flex items-center gap-2 text-xs">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="font-bold text-red-500">Pemutar Streaming HD:</span>
            <span className="text-slate-400 text-[11px] sm:text-xs">Klik untuk menonton film di tab baru secara lancar</span>
          </div>
          <a
            id="watch-page-direct-banner-btn"
            href={AD_CONFIG.DIRECT_LINK || drama.embedUrl || drama.videoUrl || `?watch=${drama.id}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              if (onAdTrigger) onAdTrigger();
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs shadow-md shadow-red-600/30 transition transform hover:scale-105 active:scale-95"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Nonton di Tab Baru</span>
          </a>
        </div>

        {/* Server Selection & Episodes */}
        <div className={`p-4 border-b ${
          isLightMode ? 'bg-slate-100/70 border-slate-200' : 'bg-[#121218] border-slate-800/80'
        }`}>
          {/* Server Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-red-500" />
              <span className="text-xs font-semibold">Select Server:</span>
              <div className="flex gap-1.5">
                {['Server VIP 1', 'Server Fast 2', 'Server Backup'].map((server) => (
                  <button
                    key={server}
                    onClick={() => setActiveServer(server)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                      activeServer === server
                        ? 'bg-red-600 text-white shadow-sm'
                        : isLightMode
                        ? 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-200'
                        : 'bg-slate-800/70 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {server}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Episode List Pills */}
          <div>
            <div className="text-xs font-semibold mb-2 flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5 text-red-500" />
              <span>Episode List:</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {episodes.map((ep) => (
                <button
                  key={ep}
                  onClick={() => setCurrentEpisode(ep)}
                  className={`shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    currentEpisode === ep
                      ? 'bg-red-600 text-white shadow-md scale-105'
                      : isLightMode
                      ? 'bg-white border border-slate-300 text-slate-700 hover:border-red-400'
                      : 'bg-slate-800/80 border border-slate-700/60 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  EP {ep}
                </button>
              ))}
              {drama.episodeCount > 24 && (
                <span className="shrink-0 px-3 py-1.5 text-xs text-slate-400 self-center">
                  + {drama.episodeCount - 24} more episodes
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Drama Info and Details */}
        <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-red-600/20 text-red-500 border border-red-500/30">
                  {drama.type === 'Film Layar Lebar' ? 'Feature Film' : drama.type === 'Drama Seri' ? 'Drama Series' : drama.type}
                </span>
                <span 
                  className="flex items-center justify-center p-1 rounded-md bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-sm border border-white/20"
                  title="Popular (Hot)"
                >
                  <Flame className="w-3.5 h-3.5 fill-white text-white shrink-0" />
                </span>
                <span className="text-xs text-slate-400">· {drama.year}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                {drama.title}
              </h2>
            </div>

            {/* Banner Iklan In-Modal */}
            <div className="py-1">
              <AdBanner 
                type="horizontal" 
                slotLabel="In-Modal Player Ad Banner" 
                onAdClick={onAdTrigger} 
                className="my-1 max-w-none" 
              />
            </div>


            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                id="watch-modal-primary-cta"
                href={AD_CONFIG.DIRECT_LINK || drama.embedUrl || drama.videoUrl || `?watch=${drama.id}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  if (onAdTrigger) onAdTrigger();
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-lg shadow-red-600/30 transition transform hover:scale-105 active:scale-95"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Nonton di Tab Baru</span>
              </a>

              <button
                onClick={() => onToggleMyList(drama)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition shadow ${
                  isInMyList
                    ? 'bg-red-600 text-white'
                    : isLightMode
                    ? 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                    : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                }`}
              >
                {isInMyList ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                <span>{isInMyList ? 'Saved in My List' : 'Add to My List'}</span>
              </button>

              <button
                onClick={handleShare}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                  isLightMode
                    ? 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                    : 'bg-slate-800/80 border border-slate-700 text-slate-200 hover:bg-slate-700'
                }`}
              >
                <Share2 className="w-4 h-4" />
                <span>{copied ? 'Link Copied!' : 'Share'}</span>
              </button>
            </div>
          </div>

          {/* Sidebar with BANNER_KOTAK */}
          <div className="flex flex-col items-center justify-center border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6 border-slate-800/60">
            <AdBanner type="kotak" onAdClick={onAdTrigger} />
          </div>
        </div>
      </div>
    </div>
  );
};
