import React, { useState } from 'react';
import { Play, CheckCircle, Wallet, Users, Video, Gift, Award } from 'lucide-react';

interface HeroProps {
  onStartWatchingClick: () => void;
  onHowItWorksClick: () => void;
  stats: {
    registeredUsers: number;
    videosWatched: number;
    rewardsDistributed: number;
    activeTasks: number;
  };
}

export default function Hero({ onStartWatchingClick, onHowItWorksClick, stats }: HeroProps) {
  const [isPlayingDashboardVideo, setIsPlayingDashboardVideo] = useState(false);
  return (
    <section id="home" className="relative pt-8 pb-16 lg:pt-16 lg:pb-24 overflow-hidden bg-slate-50/50">
      {/* Visual Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Content */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-900 text-white text-xs font-extrabold border border-blue-700 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>COMMERCIAL AD EXCHANGE & TVC MONETIZATION PLATFORM</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.25] text-wrap">
              বাংলাদেশের ১০০০+ শীর্ষ <br />
              <span className="bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 bg-clip-text text-transparent">
                কর্পোরেট কমার্শিয়াল ভিডিও অ্যাড দেখুন,
              </span> <br />
              বিজ্ঞাপন দেখুন ও নিজস্ব <br />
              <span className="text-blue-800 font-extrabold">Facebook, Instagram, YouTube, TikTok</span> এ Share করুন। <br />
              <span className="text-emerald-700 font-black">সহজেই Reward Income করুন।</span>
            </h1>



            {/* Commercial Ad Format Pills */}
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold">
              <span className="px-3 py-1 bg-white border border-slate-200 text-slate-800 rounded-lg shadow-2xs">
                📺 30s In-Stream TVC Ads
              </span>
              <span className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg shadow-2xs">
                ৳ 100% Guaranteed Viewer Payout
              </span>
              <span className="px-3 py-1 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg shadow-2xs">
                🚀 Multi-Channel Social Boost
              </span>
            </div>

            <div className="flex flex-wrap gap-4 w-full sm:w-auto">
              <button
                onClick={onStartWatchingClick}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 hover:opacity-95 text-white font-extrabold rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer group"
              >
                <Play className="w-5 h-5 fill-white group-hover:scale-110 transition-transform" />
                বাণিজ্যিক বিজ্ঞাপন দেখা শুরু করুন
              </button>
              <button
                onClick={onHowItWorksClick}
                className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-300 text-slate-800 hover:bg-slate-50 font-extrabold rounded-2xl shadow-xs transition-all flex items-center justify-center cursor-pointer"
              >
                বিজ্ঞাপন ও আয়ের নিয়মাবলী
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-xs font-bold text-slate-600">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>অনুমোদিত বাণিজ্যিক ক্যাম্পেইন</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>বিকাশ/নগদ ইনস্ট্যান্ট উইথড্র</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>১০০% নিরাপদ ও সুরক্ষিত</span>
              </div>
            </div>
          </div>

          {/* Right Visual Dashboard Simulation */}
          <div className="lg:col-span-5 relative w-full flex justify-center">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 relative overflow-hidden">
              {/* Decorative Blur and Graphics */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-full filter blur-xl" />
              
              {/* Widget Header */}
              <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-50">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <span className="text-xs font-bold text-slate-400 font-mono">LIVE REAL DASHBOARD</span>
              </div>

              {/* Video Player Preview / Live YouTube Video */}
              <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-900 group mb-5 shadow-inner">
                {isPlayingDashboardVideo ? (
                  <iframe
                    src="https://www.youtube.com/embed/L00Mjjf48jI?autoplay=1&rel=0&modestbranding=1"
                    title="টাকা হাতে থাকলেই কি খরচ হয়ে যায়? FDR খুলে ফেলুন বিকাশ অ্যাপে!"
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <div 
                    onClick={() => setIsPlayingDashboardVideo(true)}
                    className="w-full h-full relative cursor-pointer group"
                  >
                    <img 
                      src="https://img.youtube.com/vi/L00Mjjf48jI/hqdefault.jpg" 
                      alt="টাকা হাতে থাকলেই কি খরচ হয়ে যায়? FDR খুলে ফেলুন বিকাশ অ্যাপে!" 
                      className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/50 flex flex-col justify-between p-3.5 sm:p-4">
                      <div className="flex justify-between items-start">
                        <span className="px-2.5 py-1 text-[10px] font-black bg-pink-600 text-white rounded-full shadow-md flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          বিকাশ অফিসিয়াল বিজ্ঞাপন (৳১০০)
                        </span>
                        <span className="text-[10px] font-bold text-white/95 bg-black/60 px-2 py-0.5 rounded-md font-mono backdrop-blur-xs">
                          00:30
                        </span>
                      </div>
                      <div className="flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white/25 backdrop-blur-md flex items-center justify-center border border-white/50 group-hover:scale-110 group-hover:bg-pink-600 transition-all shadow-xl">
                          <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                        </div>
                      </div>
                      <div>
                        <div className="w-full bg-white/30 rounded-full h-1.5 mb-1.5 overflow-hidden">
                          <div className="bg-pink-500 h-1.5 rounded-full" style={{ width: '70%' }} />
                        </div>
                        <div className="flex justify-between items-center text-[9px] text-white/95 font-bold">
                          <span className="line-clamp-1 max-w-[200px]">bKash FDR স্পন্সরড ভিডিও</span>
                          <span className="text-pink-300">প্লে করতে ক্লিক করুন ▶</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Statistics / Interactive widgets inside mock */}
              <div className="grid grid-cols-2 gap-4">
                {/* Stats Widget 1 */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold text-slate-500">চলতি ব্যালেন্স</span>
                    <Wallet className="w-4 h-4 text-[var(--brand-primary-start)]" />
                  </div>
                  <span className="text-xl font-extrabold text-slate-900 font-mono tracking-tight">৳১,২৫০.০০</span>
                  <span className="text-[10px] text-emerald-600 font-bold mt-1">✓ উইথড্র করার যোগ্য</span>
                </div>

                {/* Stats Widget 2 */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold text-slate-500">আজকের আয়</span>
                    <Gift className="w-4 h-4 text-emerald-500" />
                  </div>
                  <span className="text-xl font-extrabold text-slate-900 font-mono tracking-tight">৳৮৫.০০</span>
                  <span className="text-[10px] text-blue-600 font-bold mt-1">৮/১০টি সম্পন্ন</span>
                </div>
              </div>

              {/* Verified Badge */}
              <div className="mt-4 flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <p className="text-xs font-black text-emerald-800">ডেইলি ওয়াচ বোনাস</p>
                    <p className="text-[10px] text-emerald-600 font-semibold">আর মাত্র ২টি ভিডিও টাস্ক বাকি</p>
                  </div>
                </div>
                <span className="text-xs font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-md">৳২০</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* STATISTICS STRIP */}
      <div className="mt-16 bg-white border-y border-slate-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4 divide-slate-100 divide-y-0 md:divide-x">
            
            {/* Stat Card 1 */}
            <div className="flex flex-col items-center text-center px-4">
              <span className="text-3xl md:text-4xl font-extrabold text-slate-900 font-mono tracking-tight">
                {(stats.registeredUsers || 25000).toLocaleString('bn-BD')}+
              </span>
              <span className="text-xs md:text-sm font-semibold text-slate-500 mt-1.5 flex items-center gap-1">
                <Users className="w-4 h-4 text-blue-500 shrink-0" />
                নিবন্ধিত ব্যবহারকারী
              </span>
            </div>

            {/* Stat Card 2 */}
            <div className="flex flex-col items-center text-center px-4">
              <span className="text-3xl md:text-4xl font-extrabold text-slate-900 font-mono tracking-tight">
                {(stats.videosWatched / 1000000).toFixed(1)}M+
              </span>
              <span className="text-xs md:text-sm font-semibold text-slate-500 mt-1.5 flex items-center gap-1">
                <Video className="w-4 h-4 text-purple-500 shrink-0" />
                মোট দেখা ভিডিও
              </span>
            </div>

            {/* Stat Card 3 */}
            <div className="flex flex-col items-center text-center px-4">
              <span className="text-3xl md:text-4xl font-extrabold text-slate-900 font-mono tracking-tight">
                ৳{(stats.rewardsDistributed / 100000).toFixed(0)}L+
              </span>
              <span className="text-xs md:text-sm font-semibold text-slate-500 mt-1.5 flex items-center gap-1">
                <Wallet className="w-4 h-4 text-emerald-500 shrink-0" />
                প্রদত্ত পুরস্কার (Taka)
              </span>
            </div>

            {/* Stat Card 4 */}
            <div className="flex flex-col items-center text-center px-4">
              <span className="text-3xl md:text-4xl font-extrabold text-slate-900 font-mono tracking-tight">
                {(stats.activeTasks || 500).toLocaleString('bn-BD')}+
              </span>
              <span className="text-xs md:text-sm font-semibold text-slate-500 mt-1.5 flex items-center gap-1">
                <Award className="w-4 h-4 text-amber-500 shrink-0" />
                সক্রিয় ভিডিও টাস্ক
              </span>
            </div>

          </div>
        </div>
      </div>



    </section>
  );
}
