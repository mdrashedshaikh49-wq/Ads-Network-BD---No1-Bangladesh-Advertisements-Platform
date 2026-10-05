import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { BKashLogo, NagadLogo, RocketLogo } from './PaymentLogos';
import { useLanguage } from '../context/LanguageContext';

export interface EarningsTickerItem {
  id: string;
  type: 'video' | 'withdrawal' | 'bonus' | 'deposit';
  user: string;
  amount: number;
  brand: string;
  adTitle: string;
  timeAgo: string;
  status: string;
  mfs: string;
}

interface RealTimeEarningsTickerProps {
  className?: string;
}

export default function RealTimeEarningsTicker({ className = '' }: RealTimeEarningsTickerProps) {
  const [items, setItems] = useState<EarningsTickerItem[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const { isBn } = useLanguage();

  const fetchTickerData = async () => {
    try {
      const res = await fetch('/api/ticker/earnings');
      const data = await res.json();
      if (data.success && Array.isArray(data.items) && data.items.length > 0) {
        setItems(data.items);
      }
    } catch (err) {
      // Fallback silently if offline
    }
  };

  useEffect(() => {
    fetchTickerData();
    // Poll for new live payouts and earnings every 12 seconds
    const interval = setInterval(fetchTickerData, 12000);
    return () => clearInterval(interval);
  }, []);

  if (items.length === 0) return null;

  // Duplicate the array for a seamless loop
  const displayItems = [...items, ...items];

  const getBrandBadge = (brand: string) => {
    switch (brand) {
      case 'Grameenphone':
        return <span className="bg-blue-600/90 text-white px-2 py-0.5 rounded-md font-bold text-[10px]">Grameenphone</span>;
      case 'Banglalink':
        return <span className="bg-orange-600/90 text-white px-2 py-0.5 rounded-md font-bold text-[10px]">Banglalink</span>;
      case 'Coca-Cola':
        return <span className="bg-red-600/90 text-white px-2 py-0.5 rounded-md font-bold text-[10px]">Coca-Cola</span>;
      case 'Surf Excel':
        return <span className="bg-indigo-600/90 text-white px-2 py-0.5 rounded-md font-bold text-[10px]">Surf Excel</span>;
      case 'RFL Group':
        return <span className="bg-rose-600/90 text-white px-2 py-0.5 rounded-md font-bold text-[10px]">RFL Winner</span>;
      case 'bKash':
        return <span className="bg-pink-600/90 text-white px-2 py-0.5 rounded-md font-bold text-[10px]">bKash MFS</span>;
      default:
        return <span className="bg-slate-700 text-white px-2 py-0.5 rounded-md font-bold text-[10px]">{brand}</span>;
    }
  };

  const getMfsIcon = (mfs: string) => {
    const lower = (mfs || '').toLowerCase();
    if (lower.includes('bkash') || lower.includes('বিকাশ')) return <BKashLogo className="w-3.5 h-3.5 inline-block" />;
    if (lower.includes('nagad') || lower.includes('নগদ')) return <NagadLogo className="w-3.5 h-3.5 inline-block" />;
    if (lower.includes('rocket') || lower.includes('রকেট')) return <RocketLogo className="w-3.5 h-3.5 inline-block" />;
    return <BKashLogo className="w-3.5 h-3.5 inline-block" />;
  };

  return (
    <div className={`w-full bg-slate-950 text-slate-200 border-y border-slate-800/90 relative overflow-hidden py-2 shadow-inner select-none ${className}`}>
      <div className="max-w-7xl mx-auto px-2 sm:px-4 flex items-center">
        
        {/* Left Sticky Label */}
        <div className="z-20 shrink-0 pr-3 sm:pr-4 flex items-center gap-2 bg-gradient-to-r from-slate-950 via-slate-950 to-transparent py-1">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <div className="flex items-center gap-1.5 font-sans">
            <span className="text-[11px] sm:text-xs font-black tracking-tight text-white uppercase hidden xs:inline">
              {isBn ? 'লাইভ আর্নিংস' : 'LIVE EARNINGS'}
            </span>
            <span className="text-[10px] font-bold text-emerald-400 font-mono bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-700/50">
              LIVE
            </span>
          </div>
        </div>

        {/* Scrolling Items Container */}
        <div 
          className="relative flex-1 overflow-hidden mask-gradient"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div 
            className={`flex items-center gap-6 sm:gap-8 whitespace-nowrap transition-transform ${isPaused ? '' : 'animate-marquee'}`}
            style={{
              animationDuration: `${Math.max(items.length * 3.5, 25)}s`,
              animationTimingFunction: 'linear',
              animationIterationCount: 'infinite'
            }}
          >
            {displayItems.map((item, index) => {
              const isWithdrawal = item.type === 'withdrawal';
              return (
                <div 
                  key={`${item.id}-${index}`}
                  className="inline-flex items-center gap-2 text-xs bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-full transition-all shadow-2xs group cursor-pointer"
                >
                  {/* User Icon / Badge */}
                  <span className="font-mono font-bold text-slate-300 group-hover:text-white transition-colors">
                    {item.user}
                  </span>

                  {/* Action label */}
                  {isWithdrawal ? (
                    <span className="inline-flex items-center gap-1 text-amber-400 font-bold">
                      <TrendingUp className="w-3 h-3 text-amber-400" />
                      {isBn ? 'উইথড্র করেছেন' : 'Withdrew'}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      {isBn ? 'ইনকাম করেছেন' : 'Earned'}
                    </span>
                  )}

                  {/* Amount Badge */}
                  <span className="font-mono font-black text-white bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700 text-[11px]">
                    ৳{item.amount.toLocaleString(isBn ? 'bn-BD' : 'en-US')}
                  </span>

                  {/* Context Brand Tag */}
                  {!isWithdrawal && (
                    <span className="text-[11px] text-slate-400">
                      from {getBrandBadge(item.brand)}
                    </span>
                  )}

                  {/* Payment Method Badge */}
                  <span className="inline-flex items-center gap-1 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 text-[10px] text-slate-300 font-mono">
                    {getMfsIcon(item.mfs)}
                    <span>{item.mfs}</span>
                  </span>

                  {/* Timestamp */}
                  <span className="text-[10px] text-slate-500 font-mono">
                    • {(() => {
                      const timeStr = item.timeAgo || '';
                      if (isBn) return timeStr;
                      return timeStr
                        .replace('মিনিট আগে', 'm ago')
                        .replace('ঘণ্টা আগে', 'h ago')
                        .replace('দিন আগে', 'd ago')
                        .replace('এইমাত্র', 'just now')
                        .replace('১', '1')
                        .replace('২', '2')
                        .replace('৩', '3')
                        .replace('৪', '4')
                        .replace('৫', '5')
                        .replace('৬', '6')
                        .replace('৭', '7')
                        .replace('৮', '8')
                        .replace('৯', '9')
                        .replace('০', '0');
                    })()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Trust Mini Pill */}
        <div className="z-20 shrink-0 pl-3 sm:pl-4 hidden md:flex items-center gap-1.5 text-[11px] text-slate-400 bg-gradient-to-l from-slate-950 via-slate-950 to-transparent py-1 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>{isBn ? '১০০% ভেরিফাইড' : '100% Verified'}</span>
        </div>

      </div>
    </div>
  );
}
