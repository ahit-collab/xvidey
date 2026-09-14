import React, { useEffect, useRef } from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';
import { AD_CONFIG } from '../data/dramas';

interface AdBannerProps {
  type: 'horizontal' | 'kotak';
  className?: string;
  onAdClick?: () => void;
  id?: string;
  slotLabel?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ type, className = '', onAdClick, id, slotLabel }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rawCode = type === 'horizontal' ? AD_CONFIG.BANNER_HORIZONTAL : AD_CONFIG.BANNER_KOTAK;
  const isDefaultPlaceholder = !rawCode || rawCode.includes('Paste script iklan');

  // Safely execute ad network scripts inside an isolated sandboxed-friendly iframe to prevent cross-origin script errors
  useEffect(() => {
    if (isDefaultPlaceholder || !containerRef.current) return;

    const container = containerRef.current;
    container.innerHTML = '';

    // Create an iframe to safely isolate third-party ad scripts (e.g. atOptions, adsterra, landslidegraphsystems)
    const iframe = document.createElement('iframe');
    iframe.title = slotLabel || 'Advertisement';
    iframe.scrolling = 'no';
    iframe.style.border = 'none';
    iframe.style.overflow = 'hidden';
    iframe.style.width = type === 'horizontal' ? '728px' : '320px';
    iframe.style.maxWidth = '100%';
    iframe.style.minHeight = type === 'horizontal' ? '90px' : '250px';

    container.appendChild(iframe);

    try {
      const doc = iframe.contentWindow?.document || iframe.contentDocument;
      if (doc) {
        doc.open();
        doc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <script>
                window.onerror = function() { return true; };
                window.addEventListener('error', function(e) { e.preventDefault(); e.stopImmediatePropagation(); return true; }, true);
                window.addEventListener('unhandledrejection', function(e) { e.preventDefault(); e.stopImmediatePropagation(); }, true);
              </script>
              <style>
                body { margin: 0; padding: 0; overflow: hidden; display: flex; align-items: center; justify-content: center; background: transparent; }
              </style>
            </head>
            <body>
              ${rawCode}
            </body>
          </html>
        `);
        doc.close();
      }
    } catch {
      // Fallback: direct insertion in case iframe write is restricted
      const temp = document.createElement('div');
      temp.innerHTML = rawCode;
      const scriptElements = temp.querySelectorAll('script');
      const nonScripts = Array.from(temp.childNodes).filter((node) => node.nodeName !== 'SCRIPT');
      nonScripts.forEach((node) => container.appendChild(node.cloneNode(true)));
      scriptElements.forEach((oldScript) => {
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach((attr) => newScript.setAttribute(attr.name, attr.value));
        newScript.textContent = oldScript.textContent;
        container.appendChild(newScript);
      });
    }
  }, [rawCode, isDefaultPlaceholder, type, slotLabel]);

  const slotId = id || (type === 'horizontal' ? 'ad-banner-horizontal-slot' : 'ad-banner-kotak-slot');

  if (!isDefaultPlaceholder) {
    return (
      <div className={`w-full flex justify-center my-3 sm:my-4 ${className}`}>
        <div 
          id={slotId}
          ref={containerRef}
          onClick={onAdClick}
          className="overflow-hidden flex items-center justify-center min-h-[50px] sm:min-h-[90px] max-w-full"
        />
      </div>
    );
  }

  if (type === 'horizontal') {
    return (
      <div className={`w-full max-w-5xl mx-auto my-4 sm:my-5 ${className}`}>
        <div 
          id={slotId}
          onClick={onAdClick}
          className="relative group cursor-pointer overflow-hidden rounded-xl border border-slate-700/50 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-3 shadow-lg hover:border-red-500/50 transition-all duration-300 flex items-center justify-between"
          style={{ minHeight: '85px' }}
        >
          {/* Subtle glow accent */}
          <div className="absolute -inset-1 bg-gradient-to-r from-red-600/20 via-pink-600/10 to-amber-600/20 rounded-xl blur-sm opacity-50 group-hover:opacity-100 transition duration-500 pointer-events-none" />

          <div className="relative z-10 flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-red-600/20 border border-red-500/30 flex items-center justify-center shrink-0 text-red-500">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  SPONSORED
                </span>
                <span className="text-[10px] sm:text-[11px] text-slate-400">
                  {slotLabel || '728x90 Banner Slot'}
                </span>
              </div>
              <p className="text-xs sm:text-sm md:text-base font-semibold text-slate-100 group-hover:text-red-400 transition-colors line-clamp-1 sm:line-clamp-none">
                Enjoy Unlimited High-Speed HD Streaming with VIP Servers & Instant Access
              </p>
              <p className="text-[10px] sm:text-xs text-slate-400 hidden sm:block">
                BANNER_HORIZONTAL slot active. Click to open sponsored offer.
              </p>
            </div>
          </div>

          <div className="relative z-10 shrink-0 flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-red-600 text-white text-[11px] sm:text-xs font-semibold hover:bg-red-700 transition shadow-md">
            <span className="hidden xs:inline sm:inline">Visit</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full flex justify-center my-4 ${className}`}>
      <div 
        id={slotId}
        onClick={onAdClick}
        className="w-[300px] h-[250px] cursor-pointer rounded-xl border border-slate-700/60 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-4 shadow-xl flex flex-col justify-between hover:border-red-500/60 transition group relative overflow-hidden"
      >
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
            SPONSORED AD
          </span>
          <span className="text-[10px] text-slate-400 font-mono">300x250</span>
        </div>

        <div className="text-center py-2">
          <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
            <Sparkles className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-100 group-hover:text-red-400 transition">
            Access Thousands of Exclusive Dramas
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            BANNER_KOTAK slot ready to receive monetization ad script.
          </p>
        </div>

        <button className="w-full py-2 bg-red-600/90 hover:bg-red-600 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow">
          <span>Learn More</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
