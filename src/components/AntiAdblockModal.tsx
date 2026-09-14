import React from 'react';
import { ShieldAlert, RefreshCw, CheckCircle2, HelpCircle } from 'lucide-react';

interface AntiAdblockModalProps {
  isOpen: boolean;
  onRefresh: () => void;
  isLightMode?: boolean;
}

export const AntiAdblockModal: React.FC<AntiAdblockModalProps> = ({
  isOpen,
  onRefresh,
  isLightMode = false,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="anti-adblock-overlay"
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300"
    >
      <div
        id="anti-adblock-dialog"
        className={`w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border text-center relative ${
          isLightMode
            ? 'bg-white border-slate-200 text-slate-900 shadow-slate-900/20'
            : 'bg-[#121218] border-red-900/40 text-slate-100 shadow-red-950/40'
        }`}
      >
        {/* Warning Icon Badge */}
        <div className="w-20 h-20 mx-auto mb-5 rounded-3xl flex items-center justify-center bg-red-600/15 border border-red-500/30 text-red-500 shadow-inner">
          <ShieldAlert className="w-10 h-10 animate-bounce" />
        </div>

        {/* Header */}
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-3">
          Ad Blocker Detected!
        </h2>
        <p
          className={`text-sm leading-relaxed mb-6 ${
            isLightMode ? 'text-slate-600' : 'text-slate-300'
          }`}
        >
          We noticed that you are using an <span className="font-bold text-red-500">AdBlocker</span> or tracking protection extension. 
          To keep our streaming service <span className="font-semibold text-emerald-500">100% free and high-speed</span> for everyone, please disable your ad blocker for 
          <span className="font-bold ml-1 text-slate-900 dark:text-white">X-VIDEY</span>.
        </p>

        {/* Step by step guide */}
        <div
          className={`rounded-2xl p-4 text-left mb-6 text-xs sm:text-sm space-y-2.5 border ${
            isLightMode
              ? 'bg-slate-50 border-slate-200 text-slate-700'
              : 'bg-black/40 border-white/10 text-slate-300'
          }`}
        >
          <div className="font-bold flex items-center gap-1.5 text-xs uppercase tracking-wider text-red-500 mb-2">
            <HelpCircle className="w-4 h-4" />
            How to disable AdBlock:
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>Click on your AdBlock extension icon in the browser toolbar (e.g. AdBlock, uBlock Origin, Brave Shields, AdGuard).</span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>Select <strong>"Pause on this site"</strong> or toggle the power button to OFF.</span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>Click the refresh button below to continue watching.</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="space-y-2">
          <button
            id="adblock-refresh-button"
            onClick={onRefresh}
            className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-lg shadow-red-600/30 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 animate-spin-slow" />
            <span>I Have Disabled AdBlock / Refresh Page</span>
          </button>
          
          <p className="text-[11px] text-slate-500 pt-1">
            Free streaming without subscriptions is made possible through non-intrusive sponsor ads. Thank you for your support!
          </p>
        </div>
      </div>
    </div>
  );
};
