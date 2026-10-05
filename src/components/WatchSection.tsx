import React, { useState, useEffect, useRef } from 'react';
import { Play, Clock, Award, ShieldAlert, Sparkles, CheckCircle, RefreshCw, Lock, ArrowRight, Smartphone, Eye, Video as VideoIcon, UserCheck } from 'lucide-react';

export const SOCIAL_LOGOS = {
  facebook: "https://upload.wikimedia.org/wikipedia/commons/b/b9/2023_Facebook_icon.svg",
  instagram: "https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg",
  youtube: "https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg",
  tiktok: "https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg"
};

interface Video {
  id: string;
  title: string;
  category: string;
  duration: number;
  reward: number;
  url: string;
  thumbnail: string;
  description: string;
  available: boolean;
  share_count?: number;
  isPaidOnly?: boolean;
  hideFromHome?: boolean;
}

interface WatchSectionProps {
  user: any;
  videos: Video[];
  onOpenLogin: () => void;
  onRefreshUser: () => void;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export function getYouTubeThumbnail(url: string, fallbackThumb?: string): string {
  if (fallbackThumb && fallbackThumb.startsWith('http')) {
    return fallbackThumb;
  }
  if (!url) return 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&auto=format&fit=crop&q=80';
  const cleanUrl = url.trim();
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = cleanUrl.match(regExp);
  if (match && match[2] && match[2].length === 11) {
    return `https://img.youtube.com/vi/${match[2]}/hqdefault.jpg`;
  }
  return 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&auto=format&fit=crop&q=80';
}

export function formatYouTubeEmbedUrl(url: string): string {
  if (!url) return 'https://www.youtube.com/embed/ciBnbRssHno?autoplay=1&enablejsapi=1&rel=0';
  const cleanUrl = url.trim();
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = cleanUrl.match(regExp);
  if (match && match[2] && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}?autoplay=1&enablejsapi=1&rel=0&modestbranding=1`;
  }
  if (cleanUrl.includes('youtube.com/embed/')) {
    return cleanUrl.includes('?') ? `${cleanUrl}&autoplay=1` : `${cleanUrl}?autoplay=1`;
  }
  return cleanUrl;
}

export default function WatchSection({ user, videos, onOpenLogin, onRefreshUser, activeTab, setActiveTab }: WatchSectionProps) {
  const [inlinePlayingVideoId, setInlinePlayingVideoId] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [activeSession, setActiveSession] = useState<any>(null);
  const [isWatching, setIsWatching] = useState(false);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [percent, setPercent] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState<any>(null);
  const [claimError, setClaimError] = useState<string | null>(null);

  const autoClaimedRef = useRef<boolean>(false);

  const hasPaidPackage = user && user.currentPackage && user.currentPackage !== 'Free';

  // 1. Separate public videos from paid exclusive videos
  const publicVideos = videos.filter(v => !v.hideFromHome && !v.isPaidOnly);
  const paidVideos = videos.filter(v => v.isPaidOnly || v.hideFromHome);

  // Tab mode for video gallery: 'public' or 'paid'
  const [galleryTab, setGalleryTab] = useState<'public' | 'paid'>(hasPaidPackage ? 'paid' : 'public');

  // If user is on the Homepage (activeTab === 'home'), the 13 paid videos are strictly hidden!
  const isHomePage = activeTab === 'home';
  const effectiveTab = isHomePage ? 'public' : galleryTab;

  const currentVideos = effectiveTab === 'paid' ? paidVideos : publicVideos;

  const selectedIndex = selectedVideo ? currentVideos.findIndex(v => v.id === selectedVideo.id) : -1;
  const isSelectedLockedForGuest = !user && selectedIndex >= 10 && effectiveTab === 'public';
  const isPaidLocked = effectiveTab === 'paid' && !hasPaidPackage;

  // Set default selected video when effectiveTab or videos change
  useEffect(() => {
    if (currentVideos && currentVideos.length > 0) {
      if (!selectedVideo || !currentVideos.some(v => v.id === selectedVideo.id)) {
        setSelectedVideo(currentVideos[0]);
        setIsPreviewPlaying(false);
      }
    } else {
      setSelectedVideo(null);
    }
  }, [effectiveTab, videos]);

  // Handle Start Watch Session
  const handleStartWatching = async (vid: Video, vidIndex?: number) => {
    if (vid.isPaidOnly) {
      if (!user) {
        onOpenLogin();
        setClaimError('🔒 পেইড ভিডিও বিজ্ঞাপনগুলো দেখতে ও আয় করতে প্রথমে অ্যাকাউন্টে লগইন করুন।');
        return;
      }
      if (!hasPaidPackage) {
        setClaimError('🔒 এই ভিডিও টাস্কটি শুধুমাত্র পেইড প্ল্যান গ্রাহকদের জন্য সংরক্ষিত। দেখার পূর্বে যেকোনো একটি প্যাকেজ সক্রিয় করুন।');
        const el = document.getElementById('packages');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    const idx = vidIndex !== undefined ? vidIndex : currentVideos.findIndex(v => v.id === vid.id);
    const isLockedForGuest = !user && idx >= 10 && !vid.isPaidOnly;

    if (isLockedForGuest) {
      onOpenLogin();
      setClaimError('ফ্রি ট্রায়ালে প্রথম ১০টি ভিডিও দেখার সুযোগ রয়েছে। বাকি সকল ভিডিও বিজ্ঞাপন দেখতে এবং আয় করতে অনুগ্রহ করে লগইন করুন।');
      return;
    }

    if (!user) {
      // Guest user watching one of the first 10 trial videos
      setSelectedVideo(vid);
      setIsPreviewPlaying(true);
      setClaimError(null);
      return;
    }

    setClaimError(null);
    setClaimSuccess(null);
    setSelectedVideo(vid);
    setIsPreviewPlaying(true);
    autoClaimedRef.current = false;

    if (!hasPaidPackage) {
      setClaimError('ভিডিও দেখে আয় করতে প্রথমে যেকোনো একটি মেম্বারশিপ প্যাকেজ ডিপোজিট করে সক্রিয় করতে হবে।');
      const el = document.getElementById('packages');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    try {
      const res = await fetch('/api/videos/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          videoId: vid.id
        })
      });
      const data = await res.json();

      if (data.success) {
        const sessionObj = data.session || {
          id: data.sessionId,
          startTime: data.startTime || Date.now(),
          requiredDuration: data.requiredDuration || vid.duration || 30
        };

        setActiveSession(sessionObj);
        setIsWatching(true);
        setTimeLeft(sessionObj.requiredDuration || vid.duration || 30);
        setPercent(0);
      } else {
        if (data.requirePackage) {
          setClaimError(data.message || 'ভিডিও দেখে আয় করতে প্রথমে ডিপোজিট করে প্যাকেজ সক্রিয় করুন।');
          const el = document.getElementById('packages');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        } else {
          setClaimError(data.message || 'ওয়াচ সেশন তৈরি করা সম্ভব হয়নি।');
        }
      }
    } catch (err) {
      setClaimError('সার্ভারে সংযোগ বিচ্ছিন্ন হয়েছে। আবার চেষ্টা করুন।');
    }
  };

  // Timer Effect
  useEffect(() => {
    let timer: any = null;
    if (isWatching && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          const next = prev - 1;
          const total = activeSession?.requiredDuration || selectedVideo?.duration || 30;
          const elapsed = total - next;
          setPercent(Math.min(100, Math.floor((elapsed / total) * 100)));

          if (next <= 0) {
            setIsWatching(false);
            clearInterval(timer);
            return 0;
          }
          return next;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isWatching, timeLeft, activeSession, selectedVideo]);

  // Handle Claim Reward
  const handleClaimReward = async (sessionToClaim?: any) => {
    const targetSession = sessionToClaim || activeSession;
    if (!targetSession || !user) return;

    setIsVerifying(true);
    setClaimError(null);
    setClaimSuccess(null);

    try {
      const res = await fetch('/api/videos/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          sessionId: targetSession.id
        })
      });
      const data = await res.json();

      if (data.success) {
        setClaimSuccess({
          ...data,
          message: `🎉 অভিনন্দন! ৩০ সেকেন্ড ভিডিও ওয়াচ সম্পন্ন হয়েছে। ৳${data.rewardAmount || targetSession.reward || 100} বোনাস টাকা আপনার ওয়ালেটে সরাসরি যুক্ত হয়েছে!`
        });
        setActiveSession(null);
        setIsWatching(false);
        onRefreshUser(); // Instantly sync balance across header and wallet
      } else {
        setClaimError(data.message || 'রিওয়ার্ড ক্লেইম করা সম্ভব হয়নি।');
      }
    } catch (err) {
      setClaimError('সার্ভার রেসপন্স করতে ব্যর্থ হয়েছে।');
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle Social Media Share & Counter Increment
  const handleSharePlatform = async (platform: string, targetVideo: Video) => {
    // 1. Optimistic local update for selected video
    if (selectedVideo && selectedVideo.id === targetVideo.id) {
      setSelectedVideo(prev => prev ? { ...prev, share_count: (prev.share_count || 0) + 1 } : null);
    }

    // 2. Call backend API to increment share_count in database
    try {
      fetch(`/api/videos/${targetVideo.id}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform,
          userId: user?.id,
          videoId: targetVideo.id
        })
      }).catch(err => console.error('Share count increment error:', err));
    } catch (err) {
      console.error('Share network call failed:', err);
    }
  };

  // AUTOMATIC CLAIM TRIGGER EFFECT: Trigger when 30s timer hits 0
  useEffect(() => {
    if (activeSession && timeLeft === 0 && !isWatching && !isVerifying && !autoClaimedRef.current && !claimSuccess) {
      autoClaimedRef.current = true;
      handleClaimReward(activeSession);
    }
  }, [timeLeft, isWatching, activeSession, isVerifying, claimSuccess]);

  return (
    <section id="watch" className="py-12 sm:py-16 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Commercial Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-black uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            বাণিজ্যিক টিভি ও ডিজিটাল বিজ্ঞাপন গ্যালারি (Commercial Ads Network)
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mt-1 sm:mt-1.5 text-wrap">
            স্পন্সরড বাণিজ্যিক বিজ্ঞাপন দেখুন ও রিওয়ার্ড নিন
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            অনুমোদিত কর্পোরেট ব্র্যান্ডের ৩০ সেকেন্ড ইন-স্ট্রিম ভিডিও বিজ্ঞাপন দেখুন, নিজস্ব সোশ্যাল অ্যাকাউন্টে শেয়ার করুন এবং প্রতি ভিউয়ে নিশ্চিত <strong className="text-emerald-700 font-mono font-black">৳১০০</strong> ওয়ালেট ব্যালেন্স অর্জন করুন।
          </p>
        </div>

        {/* VIDEO CATEGORY / TIER TABS */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-slate-50 p-2 sm:p-2.5 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setGalleryTab('public')}
              className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                effectiveTab === 'public'
                  ? 'bg-blue-700 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <VideoIcon className="w-3.5 h-3.5" />
              হোম পাবলিক প্রিভিউ ({publicVideos.length})
            </button>
            <button
              onClick={() => {
                if (isHomePage && setActiveTab) {
                  setActiveTab('watch-earn');
                }
                setGalleryTab('paid');
              }}
              className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                effectiveTab === 'paid'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md font-bold'
                  : 'bg-white text-amber-900 hover:bg-amber-50 border border-amber-300'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
              ★ পেইড প্ল্যান এক্সক্লুসিভ টাস্ক ({paidVideos.length}টি ভিডিও)
              {!hasPaidPackage && <Lock className="w-3 h-3 text-amber-800" />}
            </button>
          </div>

          <div className="text-right text-[11px] font-bold text-slate-500 hidden md:block">
            {effectiveTab === 'paid' ? (
              <span className="text-amber-800 bg-amber-100/70 px-3 py-1 rounded-full border border-amber-300">
                🔒 পেইড মেম্বারশিপ টাস্ক (হোম পেজে অপ্রদর্শিত)
              </span>
            ) : (
              <span className="text-blue-700 bg-blue-100/70 px-3 py-1 rounded-full border border-blue-200">
                🌐 সাধারণ প্রিভিউ ভিডিও গ্যালারি
              </span>
            )}
          </div>
        </div>

        {/* MANDATORY PACKAGE WARNING BANNER FOR NON-SUBSCRIBERS */}
        {!hasPaidPackage && effectiveTab === 'public' && (
          <div className="mb-8 p-4 sm:p-5 bg-amber-50 border-2 border-amber-300 rounded-2xl sm:rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 text-amber-950 shadow-xs animate-pulse">
            <div className="flex items-center gap-3 text-left w-full sm:w-auto">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-200/80 flex items-center justify-center shrink-0 text-amber-700 font-extrabold text-lg sm:text-xl shadow-xs">
                <Lock className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <p className="text-sm sm:text-base font-black">ভিডিও দেখতে প্রথমে প্যাকেজ কিনতে হবে!</p>
                <p className="text-xs text-amber-800 mt-0.5 font-medium leading-relaxed">
                  প্যাকেজ না কিনলে কেউ ভিডিও দেখে আয় করতে পারবে না। প্রথমে বিকাশ, নগদ বা রকেটে ডিপোজিট করে প্যাকেজ সক্রিয় করুন।
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                const el = document.getElementById('packages');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-5 py-2.5 sm:px-6 sm:py-3 text-xs font-black text-white bg-amber-600 hover:bg-amber-700 rounded-xl sm:rounded-2xl shadow-md transition-all shrink-0 cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap"
            >
              প্যাকেজ কিনুন (Deposit Now)
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* VIP LOCKED SCREEN FOR PAID VIDEOS IF USER DOES NOT HAVE A PAID PACKAGE */}
        {isPaidLocked && (
          <div className="mb-12 p-8 sm:p-12 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl border border-amber-500/40 text-center max-w-3xl mx-auto shadow-2xl">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto mb-4 shadow-xl">
              <Lock className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-amber-400 bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/20 font-mono">
              ★ পেইড প্ল্যান মেম্বারশিপ এক্সক্লুসিভ টাস্ক
            </span>
            <h3 className="text-xl sm:text-3xl font-black mt-3">
              ১৩টি পেইড প্ল্যান স্পেশাল ভিডিও বিজ্ঞাপন
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-2.5 max-w-xl mx-auto leading-relaxed">
              এই ভিডিওগুলো সাধারণ ভিজিটর বা হোম পেজে প্রদর্শন করা হয় না। শুধুমাত্র পেইড মেম্বারশিপ প্ল্যান সক্রিয়কারী ব্যবহারকারীরা এই ১৩টি বিজ্ঞাপন দেখে প্রতিদিন নিশ্চিত ৳১০০ করে আয় করতে পারবেন।
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  const el = document.getElementById('packages');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  if (setActiveTab) setActiveTab('packages');
                }}
                className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs sm:text-sm font-black rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 fill-slate-950" />
                প্যাকেজ ডিপোজিট করে ১৩টি ভিডিও আনলক করুন
              </button>
              <button
                onClick={() => setGalleryTab('public')}
                className="w-full sm:w-auto px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                পাবলিক ডেমো ভিডিও দেখুন
              </button>
            </div>
          </div>
        )}

        {/* FEATURED VIDEO PLAYER WORKSPACE */}
        {!isPaidLocked && selectedVideo && (
          <div className="mb-12 sm:mb-16 bg-slate-50/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-slate-200/80 shadow-xs">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                
                {/* Left Column: Video Player Frame */}
                <div className="lg:col-span-7 w-full">
                  <div className="relative rounded-2xl overflow-hidden aspect-video bg-black shadow-2xl border border-slate-900 w-full">
                    
                    {isSelectedLockedForGuest ? (
                      <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center p-6 text-center text-white relative">
                        <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mb-3 text-amber-400 shadow-lg">
                          <Lock className="w-7 h-7" />
                        </div>
                        <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 mb-2">
                          ফ্রি ট্রায়াল সীমা সমাপ্ত (Free Trial Reached)
                        </span>
                        <h3 className="text-base sm:text-lg font-bold max-w-md line-clamp-1">{selectedVideo.title}</h3>
                        <p className="text-xs text-slate-400 max-w-md mt-1.5 leading-relaxed">
                          অতিথি (Guest) হিসেবে আপনি কেবল প্রথম ১০টি ভিডিও দেখতে পারবেন। বাকি সকল ভিডিও বিজ্ঞাপন দেখতে এবং টাকা আয় করতে অনুগ্রহ করে লগইন বা সাইন-আপ করুন।
                        </p>
                        <button
                          onClick={onOpenLogin}
                          className="mt-4 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95"
                        >
                          <UserCheck className="w-4 h-4" />
                          লগইন / রেজিস্টার করে আনলক করুন
                        </button>
                      </div>
                    ) : isWatching || (activeSession && timeLeft === 0) || isPreviewPlaying ? (
                      <div className="w-full h-full relative">
                        <iframe
                          src={formatYouTubeEmbedUrl(selectedVideo.url)}
                          title={selectedVideo.title}
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full relative group">
                        <img 
                          src={getYouTubeThumbnail(selectedVideo.url, selectedVideo.thumbnail)} 
                          alt={selectedVideo.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-slate-950/45 backdrop-blur-[1px] flex flex-col items-center justify-center p-4">
                          <button
                            onClick={() => {
                              setIsPreviewPlaying(true);
                              if (user && hasPaidPackage) {
                                handleStartWatching(selectedVideo, selectedIndex);
                              }
                            }}
                            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-[var(--brand-primary-start)] to-[var(--brand-primary-end)] text-white flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                          >
                            <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-white ml-0.5" />
                          </button>
                          <span className="mt-2.5 sm:mt-3 text-[11px] sm:text-xs font-black text-white bg-slate-900/85 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full backdrop-blur-md border border-white/20">
                            {!user 
                              ? `ফ্রি ট্রায়াল প্রিভিউ (${selectedIndex + 1}/10) - প্লে করুন` 
                              : hasPaidPackage 
                              ? `ওয়াচ টাইম: ${selectedVideo.duration} সেকেন্ড (অটো ক্লেইম ৳১০০)` 
                              : 'প্যাকেজ ডিপোজিট আবশ্যক (Locked)'}
                          </span>
                        </div>
                      </div>
                    )}

                  </div>

                {/* Mobile Friendly Active Watch Session Control Bar */}
                {activeSession && (isWatching || timeLeft === 0 || isVerifying) && (
                  <div className="mt-3 bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 shadow-xl space-y-3">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl shrink-0 ${timeLeft > 0 ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                          <Clock className={`w-5 h-5 ${timeLeft > 0 ? 'animate-pulse' : ''}`} />
                        </div>
                        <div>
                          <p className="text-[10px] sm:text-[11px] text-slate-400 font-bold uppercase tracking-wider">অটোমেটিক ভেরিফিকেশন টাইমার</p>
                          <p className="text-sm sm:text-base font-extrabold font-mono text-white">
                            {timeLeft > 0 ? `${timeLeft} সেকেন্ড বাকি` : '৩০ সেকেন্ড সম্পন্ন! ক্লেইম করা হচ্ছে...'}
                          </p>
                        </div>
                      </div>

                      {timeLeft > 0 ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-extrabold bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl shrink-0">
                          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                          ভিডিও প্লে হচ্ছে...
                        </span>
                      ) : (
                        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl font-bold text-xs animate-bounce shrink-0">
                          <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                          অটোমেটিক ৳১০০ জমা হচ্ছে...
                        </div>
                      )}
                    </div>

                    {/* Progress slider bar */}
                    <div>
                      <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700/50">
                        <div 
                          className="bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-500 h-2.5 rounded-full transition-all duration-1000"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400 font-mono font-bold mt-1.5">
                        <span>০ সেকেন্ড</span>
                        <span>{percent}% ওয়াচ সম্পন্ন</span>
                        <span>{selectedVideo.duration} সেকেন্ড (অটো বোনাস ৳১০০)</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Video Details & Start Watch CTA */}
              <div className="lg:col-span-5 text-left space-y-4 sm:space-y-5 w-full">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-[var(--brand-primary-start)] text-xs font-bold rounded-lg font-mono">
                      {selectedVideo.category}
                    </span>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-extrabold rounded-lg font-mono">
                      অটোমেটিক রিওয়ার্ড: ৳{selectedVideo.reward}
                    </span>
                    <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 text-xs font-black rounded-lg font-mono flex items-center gap-1">
                      🔥 {selectedVideo.share_count || 0} Shares
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2.5 leading-snug">
                    {selectedVideo.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
                    {selectedVideo.description}
                  </p>
                </div>

                {/* Requirements check list */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-2 text-xs text-slate-700 shadow-2xs">
                  <p className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-blue-600" />
                    অটোমেটিক ক্লেইম নিয়মাবলী:
                  </p>
                  <p className="text-slate-500 leading-relaxed">
                    ১. ভিডিওটি সম্পূর্ণ ৩০ সেকেন্ড প্লে হতে দিন।<br />
                    ২. ৩০ সেকেন্ড পূর্ণ হওয়া মাত্রই সরাসরি ৳১০০ ব্যালেন্স আপনার ওয়ালেটে অটোমেটিক জমা হয়ে যাবে।
                  </p>
                </div>

                {/* Feedback notifications */}
                {claimSuccess && (
                  <div className="p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-3 shadow-sm animate-fade-in">
                    <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
                    <div>
                      <p className="text-sm font-black text-emerald-800">{claimSuccess.message}</p>
                      <p className="text-[10px] text-emerald-600 font-mono mt-0.5">ট্রানজেকশন ID: {claimSuccess.transactionId}</p>
                    </div>
                  </div>
                )}

                {claimError && (
                  <div className="p-3.5 bg-red-50 rounded-2xl border border-red-200 text-red-800 text-xs font-bold flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
                      <span>{claimError}</span>
                    </div>
                    {!hasPaidPackage && (
                      <button
                        onClick={() => {
                          const el = document.getElementById('packages');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer self-start"
                      >
                        প্যাকেজ কিনুন ও ডিপোজিট করুন →
                      </button>
                    )}
                  </div>
                )}

                {/* Start Watching button */}
                {!activeSession && (
                  <button
                    onClick={() => handleStartWatching(selectedVideo)}
                    className={`w-full py-3.5 sm:py-4 text-center text-xs sm:text-sm font-extrabold text-white rounded-2xl shadow-md cursor-pointer flex items-center justify-center gap-2 transition-all active:scale-98 ${
                      hasPaidPackage
                        ? 'bg-gradient-to-r from-[var(--brand-primary-start)] to-[var(--brand-primary-end)] hover:opacity-95'
                        : 'bg-amber-600 hover:bg-amber-700'
                    }`}
                  >
                    {hasPaidPackage ? (
                      <>
                        <Play className="w-4 h-4 fill-white" />
                        ভিডিও টাস্ক চালু করুন (অটো বোনাস ৳১০০)
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 text-white" />
                        ডিপোজিট করে ভিডিও আনলক করুন
                      </>
                    )}
                  </button>
                )}

                {/* Social Share Badges (Facebook, Instagram, YouTube, TikTok) */}
                <div className="pt-2.5 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
                      সোশ্যাল মিডিয়ায় ভিডিও শেয়ার করুন:
                    </p>
                    <span className="text-[10px] font-bold text-slate-400 font-mono">
                      কাউন্টার: {selectedVideo.share_count || 0} বার
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(selectedVideo.url)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleSharePlatform('facebook', selectedVideo)}
                      className="px-3 py-2 bg-blue-50/80 hover:bg-blue-100 text-blue-900 border border-blue-200/50 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-transform hover:scale-102 cursor-pointer shadow-2xs"
                    >
                      <img src={SOCIAL_LOGOS.facebook} alt="Facebook" className="w-4 h-4 object-contain shrink-0" />
                      <span>Facebook</span>
                    </a>
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleSharePlatform('instagram', selectedVideo)}
                      className="px-3 py-2 bg-pink-50/80 hover:bg-pink-100 text-pink-900 border border-pink-200/50 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-transform hover:scale-102 cursor-pointer shadow-2xs"
                    >
                      <img src={SOCIAL_LOGOS.instagram} alt="Instagram" className="w-4 h-4 object-contain shrink-0" />
                      <span>Instagram</span>
                    </a>
                    <a
                      href={selectedVideo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleSharePlatform('youtube', selectedVideo)}
                      className="px-3 py-2 bg-red-50/80 hover:bg-red-100 text-red-900 border border-red-200/50 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-transform hover:scale-102 cursor-pointer shadow-2xs"
                    >
                      <img src={SOCIAL_LOGOS.youtube} alt="YouTube" className="w-4 h-4 object-contain shrink-0" />
                      <span>YouTube</span>
                    </a>
                    <a
                      href={`https://www.tiktok.com/share?url=${encodeURIComponent(selectedVideo.url)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleSharePlatform('tiktok', selectedVideo)}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300/50 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-transform hover:scale-102 cursor-pointer shadow-2xs"
                    >
                      <img src={SOCIAL_LOGOS.tiktok} alt="TikTok" className="w-4 h-4 object-contain shrink-0" />
                      <span>TikTok</span>
                    </a>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* FREE TRIAL GUEST BANNER */}
        {!user && videos.length > 0 && (
          <div className="mb-6 p-4 sm:p-5 bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border border-blue-200/80 rounded-2xl sm:rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 text-blue-950 shadow-xs">
            <div className="flex items-center gap-3.5 text-left w-full sm:w-auto">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs sm:text-sm font-black text-slate-900">ফ্রি ট্রায়াল সিস্টেম (Free Trial System)</span>
                  <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md">১০টি ভিডিও উন্মুক্ত</span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 font-medium leading-relaxed">
                  অতিথি হিসেবে আপনি প্রথম ১০টি ভিডিও দেখার সুযোগ পাচ্ছেন। বাকি সকল ভিডিও দেখতে ও টাকা আয় করতে লগইন করুন।
                </p>
              </div>
            </div>
            <button
              onClick={onOpenLogin}
              className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl sm:rounded-2xl shadow-md transition-all shrink-0 cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap hover:scale-105 active:scale-95"
            >
              <UserCheck className="w-4 h-4" />
              লগইন / রেজিস্টার করুন
            </button>
          </div>
        )}

        {/* VIDEOS LIST GRID */}
        <div>
          <div className="flex items-center justify-between mb-4 sm:mb-6 flex-wrap gap-2">
            <h3 className="text-base sm:text-lg font-bold text-slate-800 text-left flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-600" />
              {effectiveTab === 'paid' ? 'পেইড প্ল্যান স্পেশাল টাস্ক ভিডিওসমূহ' : 'হোম পাবলিক প্রিভিউ ভিডিওসমূহ'} ({currentVideos.length})
            </h3>
            {effectiveTab === 'public' && !user && currentVideos.length > 10 && (
              <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full flex items-center gap-1">
                <Lock className="w-3 h-3 text-amber-600" />
                ফ্রি ট্রায়ালে প্রথম ১০টি উন্মুক্ত (বাকিগুলো লকড)
              </span>
            )}
            {effectiveTab === 'paid' && (
              <span className="text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-300 px-3 py-1 rounded-full flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                {hasPaidPackage ? 'সক্রিয় মেম্বারশিপ টাস্ক (৳১০০/ভিডিও)' : 'শুধুমাত্র পেইড প্ল্যান মেম্বারদের জন্য সংরক্ষিত'}
              </span>
            )}
          </div>

          {currentVideos.length === 0 ? (
            <div className="bg-slate-50 border border-dashed border-slate-300 rounded-3xl p-8 sm:p-12 text-center my-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 border border-blue-100 shadow-xs">
                <VideoIcon className="w-7 h-7" />
              </div>
              <h4 className="text-base sm:text-lg font-bold text-slate-800">বর্তমানে কোনো সক্রিয় ভিডিও নেই</h4>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-2 leading-relaxed">
                নতুন ভিডিও বিজ্ঞাপন যোগ করার পর এখানে টাস্কগুলো দেখা যাবে।
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {currentVideos.map((vid, index) => {
              const isLockedForGuest = !user && index >= 10 && !vid.isPaidOnly;
              const isLockedPaid = vid.isPaidOnly && !hasPaidPackage;
              const isCardLocked = isLockedForGuest || isLockedPaid;
              const isCardPlaying = !isCardLocked && (inlinePlayingVideoId === vid.id || (selectedVideo?.id === vid.id && isPreviewPlaying));

              return (
                <div 
                  key={vid.id}
                  onClick={() => {
                    if (isLockedPaid) {
                      setClaimError('🔒 এই ভিডিও টাস্কটি দেখতে ও আয় করতে প্রথমে যেকোনো একটি মেম্বারশিপ প্যাকেজ সক্রিয় করুন।');
                      const el = document.getElementById('packages');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                      return;
                    }
                    if (isLockedForGuest) {
                      onOpenLogin();
                      setClaimError('ফ্রি ট্রায়ালে প্রথম ১০টি ভিডিও দেখার সুবিধা রয়েছে। বাকি ভিডিওগুলো দেখতে লগইন বা অ্যাকাউন্ট তৈরি করুন।');
                      return;
                    }
                    setInlinePlayingVideoId(vid.id);
                    setSelectedVideo(vid);
                    setIsPreviewPlaying(true);
                    if (!activeSession || activeSession.videoId !== vid.id) {
                      handleStartWatching(vid, index);
                    }
                  }}
                  className={`bg-white rounded-2xl border transition-all overflow-hidden flex flex-col justify-between cursor-pointer group relative ${
                    isCardLocked 
                      ? 'border-amber-200/80 bg-slate-50/40 hover:border-amber-300 hover:shadow-xs'
                      : selectedVideo?.id === vid.id
                      ? 'border-[var(--brand-primary-start)] shadow-md ring-2 ring-blue-100'
                      : 'border-slate-200/80 hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  <div>
                    {isCardLocked ? (
                      <div className="relative aspect-video bg-slate-900 overflow-hidden">
                        <img 
                          src={getYouTubeThumbnail(vid.url, vid.thumbnail)} 
                          alt={vid.title}
                          className="w-full h-full object-cover opacity-30 filter blur-[1px] group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] flex flex-col items-center justify-center p-3 text-center">
                          <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform mb-1.5">
                            <Lock className="w-5 h-5" />
                          </div>
                          <span className="text-[11px] font-black text-white">
                            {isLockedPaid ? 'প্যাকেজ সক্রিয় করুন' : 'লগইন করে আনলক করুন'}
                          </span>
                          <span className="text-[9px] text-amber-300 mt-0.5 font-medium">
                            {isLockedPaid ? 'পেইড মেম্বার আবশ্যক' : 'ফ্রি ট্রায়াল সীমা সমাপ্ত'}
                          </span>
                        </div>
                        <span className="absolute top-2 left-2 bg-amber-500/90 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-md backdrop-blur-xs flex items-center gap-1 shadow-xs">
                          <Lock className="w-2.5 h-2.5" />
                          {isLockedPaid ? 'পেইড প্ল্যান' : `লকড #${index + 1}`}
                        </span>
                      </div>
                    ) : isCardPlaying ? (
                      <div className="relative aspect-video bg-black overflow-hidden">
                        <iframe
                          src={formatYouTubeEmbedUrl(vid.url)}
                          title={vid.title}
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <div className="relative aspect-video bg-slate-100 overflow-hidden">
                        <img 
                          src={getYouTubeThumbnail(vid.url, vid.thumbnail)} 
                          alt={vid.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-slate-900/30 flex items-center justify-center transition-opacity">
                          <div className="w-12 h-12 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                            <Play className="w-6 h-6 fill-slate-900 ml-0.5" />
                          </div>
                        </div>
                        <span className="absolute bottom-2 right-2 bg-slate-900/85 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
                          {vid.duration}s
                        </span>
                        {vid.isPaidOnly ? (
                          <span className="absolute top-2 left-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-md backdrop-blur-xs flex items-center gap-1 shadow-xs">
                            <Sparkles className="w-2.5 h-2.5 fill-slate-950" />
                            পেইড টাস্ক
                          </span>
                        ) : !user && index < 10 ? (
                          <span className="absolute top-2 left-2 bg-emerald-600/95 text-white font-black text-[9px] px-2 py-0.5 rounded-md backdrop-blur-xs flex items-center gap-1 shadow-xs">
                            <Sparkles className="w-2.5 h-2.5" />
                            ফ্রি ট্রায়াল {index + 1}/10
                          </span>
                        ) : null}
                      </div>
                    )}

                    <div className="p-3.5 sm:p-4 text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[var(--brand-primary-start)] uppercase tracking-wider font-mono">
                          {vid.category}
                        </span>
                        {isCardLocked && (
                          <span className="text-[10px] font-extrabold text-amber-600 flex items-center gap-0.5">
                            <Lock className="w-3 h-3" />
                            {isLockedPaid ? 'পেইড প্ল্যান' : 'Locked'}
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 mt-1 group-hover:text-blue-600 transition-colors">
                        {vid.title}
                      </h4>
                    </div>
                  </div>

                  {selectedVideo?.id === vid.id && isWatching && (
                    <div className="px-3.5 py-2 bg-slate-900 text-white text-[11px] font-black font-mono flex items-center justify-between border-t border-slate-800">
                      <span className="text-amber-400 flex items-center gap-1 animate-pulse">
                        ⏱ বাকি {timeLeft}s
                      </span>
                      <span className="text-emerald-400">৳১০০ ক্লেইম হচ্ছে...</span>
                    </div>
                  )}

                  <div className="px-3.5 pb-2.5 sm:px-4 sm:pb-3 pt-0 flex items-center justify-between border-t border-slate-100 mt-2">
                    <span className="text-xs sm:text-sm font-extrabold text-emerald-600 font-mono">
                      ৳{vid.reward} {isCardLocked ? '(লকড)' : '(অটো ক্লেইম)'}
                    </span>
                    <button 
                      type="button"
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                        isLockedPaid
                          ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-black'
                          : isLockedForGuest
                          ? 'bg-amber-100 text-amber-800 hover:bg-amber-600 hover:text-white'
                          : isCardPlaying
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-700 group-hover:bg-blue-600 group-hover:text-white'
                      }`}
                    >
                      {isLockedPaid ? (
                        <>
                          <Lock className="w-3 h-3" />
                          প্যাকেজ কিনুন
                        </>
                      ) : isLockedForGuest ? (
                        <>
                          <Lock className="w-3 h-3" />
                          লগইন করুন
                        </>
                      ) : isCardPlaying ? (
                        '▶ চলছে'
                      ) : (
                        'সরাসরি প্লে করুন →'
                      )}
                    </button>
                  </div>

                  {/* Card Level Social Share Row (Facebook, Instagram, YouTube, TikTok) */}
                  <div className="px-2.5 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-1 text-[11px]">
                    <span className="text-[10px] font-bold text-slate-400 pl-1 font-mono">
                      🔥 {vid.share_count || 0} Shares
                    </span>
                    <div className="flex items-center gap-1">
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(vid.url)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Facebook এ ভিডিওটি শেয়ার করুন"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSharePlatform('facebook', vid);
                        }}
                        className="p-1.5 hover:bg-blue-50 text-slate-700 hover:text-blue-600 rounded-lg transition-all hover:scale-110 flex items-center gap-1 font-semibold cursor-pointer border border-transparent hover:border-blue-200 shadow-2xs"
                      >
                        <img src={SOCIAL_LOGOS.facebook} alt="Facebook" className="w-3.5 h-3.5 object-contain" />
                        <span className="text-[10px] hidden sm:inline">FB</span>
                      </a>

                      <a
                        href={`https://www.instagram.com/?url=${encodeURIComponent(vid.url)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Instagram এ ভিডিওটি শেয়ার করুন"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSharePlatform('instagram', vid);
                        }}
                        className="p-1.5 hover:bg-pink-50 text-slate-700 hover:text-pink-600 rounded-lg transition-all hover:scale-110 flex items-center gap-1 font-semibold cursor-pointer border border-transparent hover:border-pink-200 shadow-2xs"
                      >
                        <img src={SOCIAL_LOGOS.instagram} alt="Instagram" className="w-3.5 h-3.5 object-contain" />
                        <span className="text-[10px] hidden sm:inline">Insta</span>
                      </a>

                      <a
                        href={vid.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="YouTube এ ভিডিওটি সরাসরি দেখুন"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSharePlatform('youtube', vid);
                        }}
                        className="p-1.5 hover:bg-red-50 text-slate-700 hover:text-red-600 rounded-lg transition-all hover:scale-110 flex items-center gap-1 font-semibold cursor-pointer border border-transparent hover:border-red-200 shadow-2xs"
                      >
                        <img src={SOCIAL_LOGOS.youtube} alt="YouTube" className="w-3.5 h-3.5 object-contain" />
                        <span className="text-[10px] hidden sm:inline">YouTube</span>
                      </a>

                      <a
                        href={`https://www.tiktok.com/share?url=${encodeURIComponent(vid.url)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="TikTok এ ভিডিওটি শেয়ার করুন"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSharePlatform('tiktok', vid);
                        }}
                        className="p-1.5 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded-lg transition-all hover:scale-110 flex items-center gap-1 font-semibold cursor-pointer border border-transparent hover:border-slate-300 shadow-2xs"
                      >
                        <img src={SOCIAL_LOGOS.tiktok} alt="TikTok" className="w-3.5 h-3.5 object-contain" />
                        <span className="text-[10px] hidden sm:inline">TikTok</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          )}

          {/* NOTICE BANNER ON HOMEPAGE: 13 PAID VIDEOS ARE RESERVED FOR PAID MEMBERS */}
          {isHomePage && (
            <div className="mt-8 p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-left shadow-lg">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <Sparkles className="w-6 h-6 fill-amber-400" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-black">
                    পেইড মেম্বারদের জন্য রয়েছে আরও ১৩টি স্পেশাল ইনকাম ভিডিও টাস্ক!
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    এই ১৩টি এক্সক্লুসিভ বিজ্ঞাপন ভিডিও হোম পেজে প্রদর্শিত হয় না। শুধুমাত্র পেইড প্ল্যান মেম্বারশিপ সক্রিয় করলেই এই ভিডিওগুলো দেখা যাবে।
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  const el = document.getElementById('packages');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  if (setActiveTab) setActiveTab('packages');
                }}
                className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all shrink-0 cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap hover:scale-105 active:scale-95"
              >
                প্যাকেজ দেখে সক্রিয় করুন
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
