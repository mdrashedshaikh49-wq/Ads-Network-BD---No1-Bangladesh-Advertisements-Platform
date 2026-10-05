import React, { useState, useEffect } from 'react';
import { Wallet, Smartphone, Gift, ArrowRight, ShieldCheck, HelpCircle, CheckCircle, Clock, Share2, Copy, Check, Users } from 'lucide-react';
import PaymentLogoBadge, { BKashLogo, NagadLogo, RocketLogo } from './PaymentLogos';

interface Transaction {
  id: string;
  userId: string;
  username: string;
  videoId?: string;
  videoTitle?: string;
  amount: number;
  type: 'video' | 'withdrawal' | 'bonus';
  paymentMethod?: string;
  phone?: string;
  completionTime: string;
  status: 'Pending' | 'Verified' | 'Credited' | 'Rejected';
  createdDate: string;
}

interface WalletDashboardProps {
  user: any;
  transactions: Transaction[];
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onRefreshUser: () => void;
  dailyBonusAmount: number;
}

export default function WalletDashboard({
  user,
  transactions,
  onOpenLogin,
  onOpenRegister,
  onRefreshUser,
  dailyBonusAmount
}: WalletDashboardProps) {
  const [paymentMethod, setPaymentMethod] = useState('bKash (বিকাশ)');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [bonusLoading, setBonusLoading] = useState(false);
  const [bonusSuccess, setBonusSuccess] = useState<string | null>(null);
  const [bonusError, setBonusError] = useState<string | null>(null);

  // Real-time Global Platform Payouts Ticker Data
  const globalPayouts = [
    { name: 'মোঃ সাব্বির রহমান', district: 'ঢাকা', amount: 1500, method: 'bKash', time: '১২ সেকেন্ড আগে', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
    { name: 'তানজিলা আক্তার', district: 'চট্টগ্রাম', amount: 2200, method: 'Nagad', time: '২৪ সেকেন্ড আগে', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
    { name: 'হাসিবুর রহমান', district: 'সিলেট', amount: 3000, method: 'Rocket', time: '৩৭ সেকেন্ড আগে', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80' },
    { name: 'সানজিদা ইসলাম', district: 'রাজশাহী', amount: 1000, method: 'bKash', time: '৪৫ সেকেন্ড আগে', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80' },
    { name: 'মোঃ পারভেজ আলম', district: 'খুলনা', amount: 4500, method: 'Nagad', time: '১ মিনিট আগে', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&auto=format&fit=crop&q=80' },
    { name: 'নুসরাত জাহান', district: 'বরিশাল', amount: 1200, method: 'bKash', time: '১ মিনিট আগে', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&auto=format&fit=crop&q=80' },
    { name: 'আরিফুল ইসলাম', district: 'রংপুর', amount: 2800, method: 'Nagad', time: '২ মিনিট আগে', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80' },
  ];

  const [payoutIndex, setPayoutIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPayoutIndex((prev) => (prev + 1) % globalPayouts.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [globalPayouts.length]);

  const currentPayout = globalPayouts[payoutIndex];

  // Filter transactions for this user
  const userTx = user 
    ? transactions.filter(tx => tx.userId === user.id).slice().reverse()
    : [];

  // Filter video tasks completed today
  const todayVideosCompleted = user
    ? transactions.filter(tx => 
        tx.userId === user.id && 
        tx.type === 'video' && 
        new Date(tx.createdDate).toDateString() === new Date().toDateString()
      ).length
    : 0;

  // Calculate daily bonus progress percentage
  const requiredCount = 10;
  const progressPercent = Math.min(100, Math.floor((todayVideosCompleted / requiredCount) * 100));

  // Handle Withdrawal Submission
  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setErrorMsg(null);
    setSuccessMsg(null);

    const numAmount = parseFloat(amount);
    if (!phone || !amount) {
      setErrorMsg('সবগুলো তথ্য সঠিকভাবে পূরণ করুন।');
      return;
    }

    if (isNaN(numAmount) || numAmount < 100) {
      setErrorMsg('উইথড্র করার জন্য সর্বনিম্ন পরিমাণ ১০০ টাকা।');
      return;
    }

    if (user.balance < numAmount) {
      setErrorMsg('দুঃখিত, আপনার ওয়ালেটে পর্যাপ্ত ব্যালেন্স নেই।');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/user/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          phone,
          paymentMethod,
          amount: numAmount
        })
      });
      const data = await res.json();

      if (data.success) {
        setSuccessMsg(data.message);
        setPhone('');
        setAmount('');
        onRefreshUser(); // Refreshes state and wallet balance instantly
      } else {
        setErrorMsg(data.message || 'উইথড্র রিকোয়েস্ট ব্যর্থ হয়েছে।');
      }
    } catch (err) {
      setErrorMsg('সার্ভারের সাথে সংযোগ ত্রুটি। পরে চেষ্টা করুন।');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Claiming Daily Bonus
  const handleClaimDailyBonus = async () => {
    if (!user) return;
    setBonusError(null);
    setBonusSuccess(null);
    setBonusLoading(true);

    try {
      const res = await fetch('/api/user/daily-bonus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });
      const data = await res.json();

      if (data.success) {
        setBonusSuccess(data.message);
        onRefreshUser(); // Update balance
      } else {
        setBonusError(data.message || 'ডেইলি বোনাস পেতে টাস্ক সম্পন্ন করুন।');
      }
    } catch (err) {
      setBonusError('সার্ভার সংযোগ বিচ্ছিন্ন। আবার চেষ্টা করুন।');
    } finally {
      setBonusLoading(false);
    }
  };

  return (
    <section id="rewards" className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Floating Real-time Platform Payouts Ticker */}
        <div className="mb-8 max-w-5xl mx-auto">
          <div className="bg-slate-900 text-white rounded-2xl md:rounded-full p-2.5 sm:p-3 shadow-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
            
            {/* Live Status Badge */}
            <div className="flex items-center gap-2 shrink-0 px-3 py-1 bg-slate-800 rounded-full border border-slate-700">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider font-mono">LIVE PAYOUT TICKER</span>
            </div>

            {/* Dynamic Active Payout Item with Smooth Keyed Animation */}
            <div key={payoutIndex} className="flex items-center gap-3 animate-fade-in font-sans text-xs overflow-hidden">
              <img 
                src={currentPayout.avatar} 
                alt={currentPayout.name} 
                className="w-7 h-7 rounded-full object-cover border border-slate-700 shrink-0" 
                referrerPolicy="no-referrer"
              />
              <div className="truncate">
                <span className="font-extrabold text-white">{currentPayout.name}</span>
                <span className="text-slate-400 text-[11px] ml-1">({currentPayout.district})</span>
                <span className="mx-1 text-slate-600">·</span>
                <span className="px-2 py-0.5 bg-slate-800 rounded-md border border-slate-700/80 inline-flex items-center">
                  <PaymentLogoBadge method={currentPayout.method} className="w-4 h-4" />
                </span>
                <span className="ml-1.5 font-black text-emerald-400 font-mono text-sm">৳{currentPayout.amount.toLocaleString()}</span>
                <span className="text-[10px] text-slate-400 ml-1.5 font-mono">({currentPayout.time})</span>
              </div>
            </div>

            {/* Cumulative Platform Total Stat */}
            <div className="shrink-0 text-[10px] font-bold text-slate-400 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700/50 hidden lg:block font-mono">
              আজকের ক্যাশআউট: <span className="text-emerald-400 font-black">৳৩,৪৮,৫০০+</span>
            </div>

          </div>
        </div>

        {/* If Visitor is Not Logged In */}
        {!user ? (
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-slate-100 text-center max-w-3xl mx-auto relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-blue-50 rounded-full filter blur-xl" />
            
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[var(--brand-primary-start)] flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Wallet className="w-8 h-8" />
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
              লগইন করে আপনার রিয়েল ব্যালেন্স ও ড্যাশবোর্ড দেখুন
            </h2>
            
            <p className="text-slate-500 mt-4 text-sm max-w-lg mx-auto leading-relaxed">
              রেজিস্ট্রেশন করে সচল ওয়ালেট ড্যাশবোর্ড চালু করুন, আপনার দৈনন্দিন ও মোট উপার্জন ট্র্যাক করুন এবং নিরাপদে পেমেন্ট উইথড্র রিকোয়েস্ট করুন।
            </p>

            <div className="flex flex-wrap gap-4 justify-center mt-8">
              <button
                onClick={onOpenLogin}
                className="px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-[var(--brand-primary-start)] to-[var(--brand-primary-end)] rounded-xl shadow-md hover:opacity-95 transition-all cursor-pointer"
              >
                লগইন করুন
              </button>
              <button
                onClick={onOpenRegister}
                className="px-6 py-3 text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
              >
                নতুন অ্যাকাউন্ট খুলুন
              </button>
            </div>
          </div>
        ) : (
          
          /* Logged In Dashboard Layout */
          <div className="space-y-12">
            
            {/* Header / Info Area */}
            <div>
              <span className="text-sm font-bold text-[var(--brand-primary-start)] uppercase tracking-wider">ড্যাশবোর্ড</span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">
                আপনার ওয়ালেট ও উপার্জন ড্যাশবোর্ড
              </h2>
            </div>

            {/* STATS COUNTING widgets */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              
              {/* Box 1 */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400">উত্তোলনযোগ্য ব্যালেন্স</p>
                  <p className="text-2xl md:text-3xl font-extrabold text-slate-900 font-mono tracking-tight mt-1">
                    ৳{Number(user.balance).toLocaleString('bn-BD', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <span className="text-[10px] text-emerald-600 font-bold mt-4 block">✓ সবসময় উইথড্র করা সম্ভব</span>
              </div>

              {/* Box 2 */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400">আজকের মোট উপার্জন</p>
                  <p className="text-2xl md:text-3xl font-extrabold text-slate-900 font-mono tracking-tight mt-1">
                    ৳{Number(user.todayEarnings).toLocaleString('bn-BD', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <span className="text-[10px] text-blue-600 font-bold mt-4 block">আজকের কাজ: {todayVideosCompleted}টি সম্পন্ন</span>
              </div>

              {/* Box 3 */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400">সর্বমোট উপার্জিত টাকা</p>
                  <p className="text-2xl md:text-3xl font-extrabold text-slate-900 font-mono tracking-tight mt-1">
                    ৳{Number(user.totalEarnings).toLocaleString('bn-BD', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <span className="text-[10px] text-purple-600 font-bold mt-4 block">জীবনকালীন মোট রিওয়ার্ড</span>
              </div>

              {/* Box 4 */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400">প্রক্রিয়াধীন উইথড্র (Pending)</p>
                  <p className="text-2xl md:text-3xl font-extrabold text-slate-900 font-mono tracking-tight mt-1">
                    ৳{Number(user.pendingRewards).toLocaleString('bn-BD', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <span className="text-[10px] text-amber-600 font-bold mt-4 block">যাচাইকরণ প্রক্রিয়া সক্রিয়</span>
              </div>

              {/* Box 5: Active Package Indicator */}
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-md text-white flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rounded-full filter blur-lg" />
                <div className="relative z-10 text-left">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">সক্রিয় মেম্বারশিপ</p>
                  <p className="text-xl font-black text-amber-400 uppercase tracking-wider mt-1.5 font-sans">
                    {user.currentPackage ? user.currentPackage.toUpperCase().replace('_', ' ') : 'FREE'}
                  </p>
                </div>
                <span className="text-[10px] text-slate-300 font-semibold mt-4 block relative z-10 text-left">
                  সীমা: {todayVideosCompleted} / {
                    (() => {
                      const limits: Record<string, number> = {
                        starter: 1, basic: 2, standard: 5, silver: 8, gold: 12,
                        platinum: 20, diamond: 40, elite: 50, Free: 10
                      };
                      return limits[user.currentPackage || 'Free'] || 10;
                    })()
                  }টি ভিডিও
                </span>
              </div>

            </div>

            {/* DAILY WATCH BONUS BANNER */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-950 rounded-3xl p-6 lg:p-8 text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full filter blur-xl" />
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                
                {/* Left Progress Text */}
                <div className="space-y-2">
                  <span className="px-2.5 py-1 text-[10px] font-bold bg-amber-500 text-slate-900 rounded-full inline-flex items-center gap-1">
                    <Gift className="w-3.5 h-3.5" />
                    দৈনিক বোনাস রিওয়ার্ড
                  </span>
                  <h3 className="text-xl md:text-2xl font-black">ডেইলি ওয়াচ বোনাস (Daily Watch Bonus)</h3>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-md">
                    দৈনিক ১০টি ভিডিও টাস্ক সম্পন্ন করলেই সরাসরি বোনাস ব্যালেন্স ৳{dailyBonusAmount} ক্লেইম করার সুযোগ সক্রিয় হবে।
                  </p>
                </div>

                {/* Progress bar and counter */}
                <div className="bg-white/10 p-4 rounded-2xl border border-white/10 min-w-[280px]">
                  <div className="flex justify-between items-center text-xs font-bold mb-2">
                    <span>আজকের অগ্রগতি (Progress)</span>
                    <span className="font-mono">{todayVideosCompleted} / {requiredCount}টি</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-emerald-400 h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-2.5 text-[10px] text-slate-300 font-semibold">
                    <span>অগ্রগতি: {progressPercent}%</span>
                    <span>বোনাস মূল্য: ৳{dailyBonusAmount}</span>
                  </div>
                </div>

                {/* Claim Action Button */}
                <div className="flex flex-col gap-2 justify-center shrink-0">
                  <button
                    onClick={handleClaimDailyBonus}
                    disabled={bonusLoading}
                    className="px-6 py-3.5 text-sm font-extrabold text-slate-900 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {bonusLoading ? 'দাবি প্রসেস হচ্ছে...' : 'বোনাস দাবি করুন (Claim)'}
                  </button>
                  {bonusSuccess && <span className="text-xs text-green-400 text-center font-bold">✓ {bonusSuccess}</span>}
                  {bonusError && <span className="text-xs text-amber-400 text-center font-bold">⚠ {bonusError}</span>}
                </div>

              </div>
            </div>

            {/* REFERRAL PROGRAM PROGRAM */}
            <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 rounded-3xl p-6 lg:p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-500/10 rounded-full filter blur-2xl" />
              <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-blue-500/10 rounded-full filter blur-2xl" />
              
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                
                {/* Left Side Info */}
                <div className="space-y-3 max-w-xl text-left">
                  <span className="px-2.5 py-1 text-[10px] font-black bg-emerald-500 text-slate-950 rounded-full inline-flex items-center gap-1.5 uppercase tracking-wider">
                    <Share2 className="w-3 h-3" />
                    Referral Link Program
                  </span>
                  <h3 className="text-xl md:text-2xl font-black">🎁 বন্ধুদের ইনভাইট করে আনলিমিটেড আয় করুন!</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    আপনার পার্সোনাল রেফারেল লিঙ্ক শেয়ার করুন। আপনার লিঙ্ক ব্যবহার করে কেউ রেজিস্ট্রেশন করলেই আপনার ওয়ালেটে সরাসরি **৳৫০ বোনাস** যোগ হবে! কোনো দৈনিক লিমিট নেই, যত খুশি রেফার করুন।
                  </p>
                </div>

                {/* Right Side Link Copy Container & Stats */}
                <div className="flex-1 max-w-lg w-full space-y-4">
                  {/* Share Link Box */}
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2">
                    <label className="block text-[11px] text-slate-300 font-extrabold text-left uppercase tracking-wider">আপনার রেফারেল লিঙ্ক</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={`${window.location.origin}/?ref=${user.username}`}
                        className="flex-1 bg-black/30 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-indigo-200 focus:outline-hidden"
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/?ref=${user.username}`);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        type="button"
                        className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-sm"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-300" />
                            কপি হয়েছে!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            লিঙ্ক কপি
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Referral Statistics Micro-row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 px-4 py-3 rounded-2xl border border-white/5 flex items-center gap-3 text-left">
                      <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">মোট রেফারেল</p>
                        <p className="text-lg font-black text-white font-mono mt-0.5">{user.referralCount || 0} জন</p>
                      </div>
                    </div>

                    <div className="bg-white/5 px-4 py-3 rounded-2xl border border-white/5 flex items-center gap-3 text-left">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                        <Gift className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">অর্জিত বোনাস</p>
                        <p className="text-lg font-black text-emerald-400 font-mono mt-0.5">৳{user.referralEarnings || 0}</p>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </div>

            {/* WITHDRAW & TRANSACTIONS SPLIT PANEL */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Side: withdrawal Terminal */}
              <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
                <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-50">
                  <Smartphone className="w-5 h-5 text-[var(--brand-primary-start)]" />
                  <h3 className="text-base font-extrabold text-slate-900">টাকা উত্তোলন টার্মিনাল</h3>
                </div>

                <form onSubmit={handleWithdraw} className="space-y-4">
                  {/* Select MFS Payment Method */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2">পেমেন্ট মাধ্যম সিলেক্ট করুন</label>
                    <div className="grid grid-cols-3 gap-2.5">
                      {[
                        { 
                          id: 'bKash (বিকাশ)', 
                          label: 'বিকাশ', 
                          Logo: BKashLogo, 
                          activeClass: 'border-[#E2136E] bg-pink-50/60 ring-2 ring-pink-200/80 text-[#E2136E]' 
                        },
                        { 
                          id: 'Nagad (নগদ)', 
                          label: 'নগদ', 
                          Logo: NagadLogo, 
                          activeClass: 'border-[#F7921E] bg-orange-50/60 ring-2 ring-orange-200/80 text-[#F7921E]' 
                        },
                        { 
                          id: 'Rocket (রকেট)', 
                          label: 'রকেট', 
                          Logo: RocketLogo, 
                          activeClass: 'border-[#8C3494] bg-purple-50/60 ring-2 ring-purple-200/80 text-[#8C3494]' 
                        }
                      ].map((item) => {
                        const isSelected = paymentMethod === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setPaymentMethod(item.id)}
                            className={`p-2.5 rounded-2xl border transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer relative ${
                              isSelected
                                ? item.activeClass
                                : 'border-slate-200/80 bg-slate-50/80 hover:bg-white hover:border-slate-300 text-slate-600'
                            }`}
                          >
                            <item.Logo className="w-9 h-9" showText={false} />
                            <span className="text-[11px] font-extrabold tracking-tight">
                              {item.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Input Mobile Account Phone */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">আপনার অ্যাকাউন্ট নম্বর (মোবাইল)</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="যেমন: 017xxxxxxxx"
                      className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-100 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[var(--brand-primary-start)] focus:bg-white"
                    />
                  </div>

                  {/* Input Amount to Withdraw */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">উত্তোলনের পরিমাণ (৳)</label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="উত্তোলনের পরিমাণ লিখুন (সর্বনিম্ন ৳১০০)"
                      className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-100 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[var(--brand-primary-start)] focus:bg-white font-mono"
                    />
                  </div>

                  {/* Limits and policy details */}
                  <div className="p-3 bg-blue-50/50 border border-blue-100/30 rounded-xl text-[10px] text-slate-600 font-semibold space-y-1 text-left">
                    <p>• সর্বনিম্ন উত্তোলনের সীমা ১০০ টাকা।</p>
                    <p>• রিকোয়েস্ট সাবমিটের পর দ্রুত আপনার বিকাশ/নগদ নম্বরে ক্রেডিট করা হবে।</p>
                  </div>

                  {/* Feedback warnings */}
                  {errorMsg && (
                    <div className="p-3.5 bg-red-50 text-red-900 border border-red-200 rounded-xl text-xs font-bold space-y-2 text-left">
                      <p>⚠ {errorMsg}</p>
                      {errorMsg.includes('আপডেট') && (
                        <button
                          type="button"
                          onClick={() => {
                            const el = document.getElementById('packages');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer inline-block"
                        >
                          প্যাকেজ আপগ্রেড করুন →
                        </button>
                      )}
                    </div>
                  )}

                  {successMsg && (
                    <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl text-xs font-bold text-left">
                      ✓ {successMsg}
                    </div>
                  )}

                  {/* Submit withdrawal Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 text-center text-sm font-bold text-white bg-gradient-to-r from-[var(--brand-primary-start)] to-[var(--brand-primary-end)] hover:opacity-95 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {isLoading ? 'প্রসেসিং হচ্ছে...' : 'উইথড্র রিকোয়েস্ট পাঠান'}
                    <ArrowRight className="w-4 h-4" />
                  </button>

                </form>
              </div>

              {/* Right Side: Ledger Transaction Logs */}
              <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-50">
                  <h3 className="text-base font-extrabold text-slate-900">সাম্প্রতিক ওয়ালেট বিবরণী</h3>
                  <span className="text-xs font-bold text-slate-400 font-mono">TXNS COUNT: {userTx.length}</span>
                </div>

                {userTx.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-sm font-semibold">
                    কোনো লেনদেনের বিবরণ খুঁজে পাওয়া যায়নি।
                  </div>
                ) : (
                  <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-1">
                    {userTx.map((tx) => (
                      <div 
                        key={tx.id}
                        className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs"
                      >
                        {/* Left Info: Type/Action */}
                        <div className="space-y-1">
                          <p className="font-bold text-slate-900">
                            {tx.type === 'video' && `🎬 ভিডিও রিওয়ার্ড: ${tx.videoTitle?.substring(0, 20)}...`}
                            {tx.type === 'withdrawal' && `🏦 মোবাইল উত্তোলন: ${tx.paymentMethod?.split(' ')[0]}`}
                            {tx.type === 'bonus' && '🎁 ডেইলি ওয়াচ বোনাস'}
                          </p>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold font-mono">
                            <span>ID: {tx.id}</span>
                            <span>·</span>
                            <span>{tx.completionTime}</span>
                          </div>
                        </div>

                        {/* Right Info: Amount & status tag */}
                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          <span className={`font-mono font-black text-sm ${tx.type === 'withdrawal' ? 'text-red-600' : 'text-emerald-600'}`}>
                            {tx.type === 'withdrawal' ? '-' : '+'}৳{tx.amount}
                          </span>
                          
                          {/* Colored dynamic status badge */}
                          <span className={`px-2 py-0.5 text-[9px] font-bold rounded-md ${
                            tx.status === 'Credited' && 'bg-emerald-100 text-emerald-800'
                          } ${
                            tx.status === 'Verified' && 'bg-blue-100 text-blue-800'
                          } ${
                            tx.status === 'Pending' && 'bg-amber-100 text-amber-800'
                          } ${
                            tx.status === 'Rejected' && 'bg-red-100 text-red-800'
                          }`}>
                            {tx.status === 'Credited' && 'অ্যাকাউন্টে যুক্ত'}
                            {tx.status === 'Verified' && 'অনুমোদিত'}
                            {tx.status === 'Pending' && 'পর্যবেক্ষণাধীন'}
                            {tx.status === 'Rejected' && 'বাতিল করা হয়েছে'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

      </div>
    </section>
  );
}
