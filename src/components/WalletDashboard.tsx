import React, { useState, useEffect } from 'react';
import { Wallet, Smartphone, Gift, ArrowRight, ShieldCheck, HelpCircle, CheckCircle, Clock, Share2, Copy, Check, Users, Landmark } from 'lucide-react';
import PaymentLogoBadge, { BKashLogo, NagadLogo, RocketLogo } from './PaymentLogos';
import { useLanguage } from '../context/LanguageContext';

interface Transaction {
  id: string;
  userId: string;
  username: string;
  videoId?: string;
  videoTitle?: string;
  amount: number;
  type: 'video' | 'withdrawal' | 'bonus' | 'deposit';
  paymentMethod?: string;
  phone?: string;
  packageName?: string;
  packageKey?: string;
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
  const { isBn } = useLanguage();

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
      setErrorMsg(isBn ? 'সবগুলো তথ্য সঠিকভাবে পূরণ করুন।' : 'Please fill out all fields correctly.');
      return;
    }

    if (isNaN(numAmount) || numAmount < 100) {
      setErrorMsg(isBn ? 'উইথড্র করার জন্য সর্বনিম্ন পরিমাণ ১০০ টাকা।' : 'Minimum withdrawal amount is ৳100 BDT.');
      return;
    }

    if (user.balance < numAmount) {
      setErrorMsg(isBn ? 'দুঃখিত, আপনার ওয়ালেটে পর্যাপ্ত ব্যালেন্স নেই।' : 'Sorry, you do not have sufficient balance in your wallet.');
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
        setErrorMsg(data.message || (isBn ? 'উইথড্র রিকোয়েস্ট ব্যর্থ হয়েছে।' : 'Withdrawal request failed.'));
      }
    } catch (err) {
      setErrorMsg(isBn ? 'সার্ভারের সাথে সংযোগ ত্রুটি। পরে চেষ্টা করুন।' : 'Server connection error. Please try again.');
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
        setBonusError(data.message || (isBn ? 'ডেইলি বোনাস পেতে টাস্ক সম্পন্ন করুন।' : 'Complete tasks to get daily bonus.'));
      }
    } catch (err) {
      setBonusError(isBn ? 'সার্ভার সংযোগ বিচ্ছিন্ন। আবার চেষ্টা করুন।' : 'Server connection lost. Please try again.');
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
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider font-mono">
                {isBn ? 'লাইভ উইথড্রয়ালস' : 'LIVE PAYOUT TICKER'}
              </span>
            </div>

            {/* Dynamic Active Payout Item with Smooth Keyed Animation */}
            <div key={payoutIndex} className="flex items-center gap-3 animate-fade-in font-sans text-xs overflow-hidden">
              <img 
                src={currentPayout.avatar} 
                alt={currentPayout.name} 
                className="w-7 h-7 rounded-full object-cover border border-slate-700 shrink-0" 
                referrerPolicy="no-referrer"
              />
              <div className="truncate text-left">
                <span className="font-extrabold text-white">{isBn ? currentPayout.name : 'Verified Member'}</span>
                <span className="text-slate-400 text-[11px] ml-1">({isBn ? currentPayout.district : 'BD'})</span>
                <span className="mx-1 text-slate-600">·</span>
                <span className="px-2 py-0.5 bg-slate-800 rounded-md border border-slate-700/80 inline-flex items-center">
                  <PaymentLogoBadge method={currentPayout.method} className="w-4 h-4" />
                </span>
                <span className="ml-1.5 font-black text-emerald-400 font-mono text-sm">৳{currentPayout.amount.toLocaleString(isBn ? 'bn-BD' : 'en-US')}</span>
                <span className="text-[10px] text-slate-400 ml-1.5 font-mono">
                  ({isBn ? currentPayout.time : currentPayout.time.replace('সেকেন্ড আগে', 's ago').replace('মিনিট আগে', 'm ago')})
                </span>
              </div>
            </div>

            {/* Cumulative Platform Total Stat */}
            <div className="shrink-0 text-[10px] font-bold text-slate-400 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700/50 hidden lg:block font-mono">
              {isBn ? 'আজকের ক্যাশআউট:' : 'Today Disbursed:'} <span className="text-emerald-400 font-black">৳৩,৪৮,৫০০+</span>
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
              {isBn ? 'লগইন করে আপনার রিয়েল ব্যালেন্স ও ড্যাশবোর্ড দেখুন' : 'Log in to View Real Wallet Balance & Dashboard'}
            </h2>
            
            <p className="text-slate-500 mt-4 text-sm max-w-lg mx-auto leading-relaxed">
              {isBn 
                ? 'রেজিস্ট্রেশন করে সচল ওয়ালেট ড্যাশবোর্ড চালু করুন, আপনার দৈনন্দিন ও মোট উপার্জন ট্র্যাক করুন এবং নিরাপদে পেমেন্ট উইথড্র রিকোয়েস্ট করুন।' 
                : 'Instantly tracking cumulative rewards, verifying transaction histories, and safely requesting secure payouts requires logging in.'}
            </p>

            <div className="flex flex-wrap gap-4 justify-center mt-8">
              <button
                onClick={onOpenLogin}
                className="px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-[var(--brand-primary-start)] to-[var(--brand-primary-end)] rounded-xl shadow-md hover:opacity-95 transition-all cursor-pointer"
              >
                {isBn ? 'লগইন করুন' : 'Log In'}
              </button>
              <button
                onClick={onOpenRegister}
                className="px-6 py-3 text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
              >
                {isBn ? 'নতুন অ্যাকাউন্ট খুলুন' : 'Create Free Account'}
              </button>
            </div>
          </div>
        ) : (
          
          /* Logged In Dashboard Layout */
          <div className="space-y-12">
            
            {/* Header / Info Area */}
            <div className="text-left">
              <span className="text-sm font-bold text-[var(--brand-primary-start)] uppercase tracking-wider">{isBn ? 'ড্যাশবোর্ড' : 'Member Studio'}</span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">
                {isBn ? 'আপনার ওয়ালেট ও উপার্জন ড্যাশবোর্ড' : 'Your Personal Rewards Dashboard'}
              </h2>
            </div>

            {/* STATS COUNTING widgets */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              
              {/* Box 1 */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between text-left">
                <div>
                  <p className="text-xs font-bold text-slate-400">{isBn ? 'উত্তোলনযোগ্য ব্যালেন্স' : 'Withdrawable Balance'}</p>
                  <p className="text-2xl md:text-3xl font-extrabold text-slate-900 font-mono tracking-tight mt-1">
                    ৳{Number(user.balance).toLocaleString(isBn ? 'bn-BD' : 'en-US', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <span className="text-[10px] text-emerald-600 font-bold mt-4 block">
                  ✓ {isBn ? 'সবসময় উইথড্র করা সম্ভব' : 'Available for cashout'}
                </span>
              </div>

              {/* Box 2 */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between text-left">
                <div>
                  <p className="text-xs font-bold text-slate-400">{isBn ? 'আজকের মোট উপার্জন' : "Today's Revenue"}</p>
                  <p className="text-2xl md:text-3xl font-extrabold text-slate-900 font-mono tracking-tight mt-1">
                    ৳{Number(user.todayEarnings).toLocaleString(isBn ? 'bn-BD' : 'en-US', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <span className="text-[10px] text-blue-600 font-bold mt-4 block">
                  {isBn ? `আজকের কাজ: ${todayVideosCompleted}টি সম্পন্ন` : `Completed: ${todayVideosCompleted} Ads`}
                </span>
              </div>

              {/* Box 3 */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between text-left">
                <div>
                  <p className="text-xs font-bold text-slate-400">{isBn ? 'সর্বমোট উপার্জিত টাকা' : 'Lifetime Earnings'}</p>
                  <p className="text-2xl md:text-3xl font-extrabold text-slate-900 font-mono tracking-tight mt-1">
                    ৳{Number(user.totalEarnings).toLocaleString(isBn ? 'bn-BD' : 'en-US', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <span className="text-[10px] text-purple-600 font-bold mt-4 block">
                  {isBn ? 'জীবনকালীন মোট রিওয়ার্ড' : 'Lifetime platform payout'}
                </span>
              </div>

              {/* Box 4 */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between text-left">
                <div>
                  <p className="text-xs font-bold text-slate-400">{isBn ? 'প্রক্রিয়াধীন উইথড্র (Pending)' : 'Pending Payouts'}</p>
                  <p className="text-2xl md:text-3xl font-extrabold text-slate-900 font-mono tracking-tight mt-1">
                    ৳{Number(user.pendingRewards).toLocaleString(isBn ? 'bn-BD' : 'en-US', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <span className="text-[10px] text-amber-600 font-bold mt-4 block">
                  {isBn ? 'যাচাইকরণ প্রক্রিয়া সক্রিয়' : 'Under verification'}
                </span>
              </div>

              {/* Box 5: Active Package Indicator */}
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-md text-white flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rounded-full filter blur-lg" />
                <div className="relative z-10 text-left">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{isBn ? 'সক্রিয় মেম্বারশিপ' : 'Active Plan'}</p>
                  <p className="text-xl font-black text-amber-400 uppercase tracking-wider mt-1.5 font-sans">
                    {user.currentPackage ? user.currentPackage.toUpperCase().replace('_', ' ') : 'FREE'}
                  </p>
                </div>
                <span className="text-[10px] text-slate-300 font-semibold mt-4 block relative z-10 text-left">
                  {isBn ? 'সীমা:' : 'Limit:'} {todayVideosCompleted} / {
                    (() => {
                      const limits: Record<string, number> = {
                        starter: 1, basic: 2, standard: 5, silver: 8, gold: 12,
                        platinum: 20, diamond: 40, elite: 50, Free: 10
                      };
                      return limits[user.currentPackage || 'Free'] || 10;
                    })()
                  } {isBn ? 'টি ভিডিও' : 'Ads'}
                </span>
              </div>

            </div>

            {/* DAILY WATCH BONUS BANNER */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-950 rounded-3xl p-6 lg:p-8 text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full filter blur-xl" />
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                
                {/* Left Progress Text */}
                <div className="space-y-2 text-left">
                  <span className="px-2.5 py-1 text-[10px] font-bold bg-amber-500 text-slate-900 rounded-full inline-flex items-center gap-1">
                    <Gift className="w-3.5 h-3.5" />
                    {isBn ? 'দৈনিক বোনাস রিওয়ার্ড' : 'Daily Watch Bonus'}
                  </span>
                  <h3 className="text-xl md:text-2xl font-black">
                    {isBn ? 'ডেইলি ওয়াচ বোনাস (Daily Watch Bonus)' : 'Unlock Daily Watch Bonus'}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-md">
                    {isBn 
                      ? `দৈনিক ১০টি ভিডিও টাস্ক সম্পন্ন করলেই সরাসরি বোনাস ব্যালেন্স ৳${dailyBonusAmount} ক্লেইম করার সুযোগ সক্রিয় হবে।` 
                      : `Complete at least 10 video tasks today to instantly unlock a bonus cash reward of ৳${dailyBonusAmount} BDT.`}
                  </p>
                </div>

                {/* Progress bar and counter */}
                <div className="bg-white/10 p-4 rounded-2xl border border-white/10 min-w-[280px] text-left">
                  <div className="flex justify-between items-center text-xs font-bold mb-2">
                    <span>{isBn ? 'আজকের অগ্রগতি (Progress)' : 'Today Progress'}</span>
                    <span className="font-mono">{todayVideosCompleted} / {requiredCount}</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-emerald-400 h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-2.5 text-[10px] text-slate-300 font-semibold">
                    <span>{isBn ? 'অগ্রগতি:' : 'Progress:'} {progressPercent}%</span>
                    <span>{isBn ? 'বোনাস মূল্য:' : 'Bonus Reward:'} ৳{dailyBonusAmount}</span>
                  </div>
                </div>

                {/* Claim Action Button */}
                <div className="flex flex-col gap-2 justify-center shrink-0">
                  <button
                    onClick={handleClaimDailyBonus}
                    disabled={bonusLoading}
                    className="px-6 py-3.5 text-sm font-extrabold text-slate-900 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {bonusLoading ? (isBn ? 'দাবি প্রসেস হচ্ছে...' : 'Processing Claim...') : (isBn ? 'বোনাস দাবি করুন (Claim)' : 'Claim Daily Bonus')}
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
                  <h3 className="text-xl md:text-2xl font-black">
                    {isBn ? '🎁 বন্ধুদের ইনভাইট করে আনলিমিটেড আয় করুন!' : '🎁 Invite Friends & Earn Unlimited Bonuses!'}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {isBn 
                      ? 'আপনার পার্সোনাল রেফারেল লিঙ্ক শেয়ার করুন। আপনার লিঙ্ক ব্যবহার করে কেউ রেজিস্ট্রেশন করলেই আপনার ওয়ালেটে সরাসরি ৳৫০ বোনাস যোগ হবে! কোনো দৈনিক লিমিট নেই, যত খুশি রেফার করুন।' 
                      : 'Share your personal referral link with friends. For every registration under your link, get an instant ৳50 BDT commission in your wallet! No daily limits.'}
                  </p>
                </div>

                {/* Right Side Link Copy Container & Stats */}
                <div className="flex-1 max-w-lg w-full space-y-4">
                  {/* Share Link Box */}
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2">
                    <label className="block text-[11px] text-slate-300 font-extrabold text-left uppercase tracking-wider">
                      {isBn ? 'আপনার রেফারেল লিঙ্ক' : 'Your Personal Referral Link'}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={`https://adsnetworkbd.com/?ref=${user.username}`}
                        className="flex-1 bg-black/30 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-indigo-200 focus:outline-hidden"
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`https://adsnetworkbd.com/?ref=${user.username}`);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        type="button"
                        className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-sm animate-pulse"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-300" />
                            {isBn ? 'কপি হয়েছে!' : 'Copied!'}
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            {isBn ? 'লিঙ্ক কপি' : 'Copy'}
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
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{isBn ? 'মোট রেফারেল' : 'Total Referrals'}</p>
                        <p className="text-lg font-black text-white font-mono mt-0.5">{user.referralCount || 0} {isBn ? 'জন' : 'Users'}</p>
                      </div>
                    </div>

                    <div className="bg-white/5 px-4 py-3 rounded-2xl border border-white/5 flex items-center gap-3 text-left">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                        <Gift className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{isBn ? 'রেফারেল আয়' : 'Referral Commission'}</p>
                        <p className="text-lg font-black text-white font-mono mt-0.5">৳{(user.referralEarnings || 0).toLocaleString(isBn ? 'bn-BD' : 'en-US')}</p>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </div>

            {/* WITHDRAW CONTAINER & RECENT TRANSACTION HISTORY */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Withdrawal Form */}
              <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
                <div className="flex items-center gap-2 pb-4 mb-4 border-b">
                  <Smartphone className="w-5 h-5 text-[var(--brand-primary-start)]" />
                  <h3 className="text-base font-extrabold text-slate-900">
                    {isBn ? 'পেমেন্ট উইথড্র ফর্ম (Cashout)' : 'Secure Wallet Payout Request'}
                  </h3>
                </div>

                <form onSubmit={handleWithdraw} className="space-y-4 text-left">
                  
                  {/* Select MFS Operator */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">{isBn ? 'উইথড্র মাধ্যম নির্বাচন করুন' : 'Select Mobile Wallet operator'}</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['bKash (বিকাশ)', 'Nagad (নগদ)', 'Rocket (রকেট)'].map((method) => {
                        const cleanMethod = isBn ? method : method.split(' ')[0];
                        return (
                          <button
                            key={method}
                            type="button"
                            onClick={() => setPaymentMethod(method)}
                            className={`py-2.5 px-2 text-[10px] font-bold rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                              paymentMethod === method
                                ? 'border-[var(--brand-primary-start)] bg-blue-50 text-[var(--brand-primary-start)] font-black ring-2 ring-blue-100'
                                : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                            }`}
                          >
                            <PaymentLogoBadge method={method} className="w-4 h-4" />
                            <span>{cleanMethod}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Account Receiver No */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-500">
                      {isBn ? `আপনার বিকাশ/নগদ/রকেট মোবাইল নম্বর (${paymentMethod.split(' ')[0]})` : `Your ${paymentMethod.split(' ')[0]} Recipient Number`}
                    </label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={isBn ? "১১ ডিজিটের পেমেন্ট নম্বরটি দিন" : "e.g., 017XXXXXXXX"}
                      className="w-full px-3.5 py-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-blue-600 focus:bg-white font-medium"
                    />
                  </div>

                  {/* Cashout Amount */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-500">{isBn ? 'উইথড্র পরিমাণ (সর্বনিম্ন ৳১০০)' : 'Cashout Amount (Min ৳100 BDT)'}</label>
                    <input
                      type="number"
                      required
                      min="100"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder={isBn ? "টাকার পরিমাণ লিখুন" : "e.g., 500"}
                      className="w-full px-3.5 py-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-blue-600 focus:bg-white font-mono font-bold"
                    />
                  </div>

                  {/* Info notice about instant payout limits */}
                  <div className="p-3 bg-blue-50 text-blue-900 rounded-2xl text-[11px] font-bold leading-normal flex items-start gap-2 border border-blue-100">
                    <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>
                      {isBn 
                        ? 'উইথড্রাল নিয়ম: প্রতিদিন সকাল ৯:০০ টা থেকে রাত ৯:০০ টার মধ্যে যেকোনো উইথড্র রিকোয়েস্ট মাত্র ১০ থেকে ৩০ মিনিটের মধ্যে স্বয়ংক্রিয়ভাবে বিকাশ/নগদ নাম্বারে ট্রান্সফার করা হয়।' 
                        : 'Payout schedule: Cashouts are automatically sent via bKash, Nagad or Rocket within 10 to 30 mins between 9:00 AM and 9:00 PM.'}
                    </span>
                  </div>

                  {/* Success/Error Alerts */}
                  {successMsg && (
                    <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold">
                      ✓ {successMsg}
                    </div>
                  )}
                  {errorMsg && (
                    <div className="p-3 bg-red-50 text-red-800 border border-red-200 rounded-xl text-xs font-bold">
                      ⚠ {errorMsg}
                    </div>
                  )}

                  {/* Submit withdrawal */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-gradient-to-r from-blue-700 to-indigo-800 hover:opacity-95 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (isBn ? 'রিকোয়েস্ট পাঠানো হচ্ছে...' : 'Processing Payout...') : (isBn ? 'উইথড্র রিকোয়েস্ট সাবমিট করুন' : 'Request Secure Withdrawal')}
                  </button>

                </form>
              </div>

              {/* Right Column: User Payout History Log */}
              <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex flex-col justify-between min-h-full">
                <div>
                  <div className="flex items-center justify-between pb-4 mb-4 border-b">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-[var(--brand-primary-start)]" />
                      <h3 className="text-base font-extrabold text-slate-900">
                        {isBn ? 'আপনার সাম্প্রতিক লেনদেন সমূহ' : 'Your Recent Transactions'}
                      </h3>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 font-mono">
                      {isBn ? `মোট লেনদেন: ${userTx.length}টি` : `Total: ${userTx.length} Records`}
                    </span>
                  </div>

                  {/* Transactions list */}
                  {userTx.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 space-y-3">
                      <Clock className="w-12 h-12 text-slate-300 mx-auto" />
                      <p className="text-xs font-bold">
                        {isBn ? 'এখনো কোনো লেনদেন রেকর্ড পাওয়া যায়নি।' : 'No transaction records found yet.'}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {isBn ? 'ভিডিও দেখা শুরু করুন বা ডিপোজিট করে মেম্বারশিপ কিনুন।' : 'Start watching commercial ads or deposit to activate paid tiers.'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                      {userTx.map((tx) => {
                        const isReward = tx.type === 'video';
                        const isBonus = tx.type === 'bonus';
                        const isDeposit = tx.type === 'deposit';
                        const isWithdraw = tx.type === 'withdrawal';

                        let typeBadge = '';
                        let colorBadge = '';
                        if (isReward) {
                          typeBadge = isBn ? 'ভিডিও রিওয়ার্ড' : 'Video Reward';
                          colorBadge = 'bg-blue-50 text-blue-800 border-blue-100';
                        } else if (isBonus) {
                          typeBadge = isBn ? 'ডেইলি বোনাস' : 'Daily Bonus';
                          colorBadge = 'bg-indigo-50 text-indigo-800 border-indigo-100';
                        } else if (isDeposit) {
                          typeBadge = isBn ? 'প্যাকেজ ডিপোজিট' : 'Plan Deposit';
                          colorBadge = 'bg-purple-50 text-purple-800 border-purple-100';
                        } else if (isWithdraw) {
                          typeBadge = isBn ? 'ক্যাশআউট উইথড্র' : 'Wallet Withdrawal';
                          colorBadge = 'bg-amber-50 text-amber-800 border-amber-100';
                        }

                        let statusLabel = '';
                        let statusColor = '';
                        
                        if (tx.status === 'Credited') {
                          statusLabel = isBn ? 'সম্পন্ন' : 'Completed';
                          statusColor = 'bg-emerald-500 text-white border-emerald-600';
                        } else if (tx.status === 'Verified') {
                          if (isDeposit) {
                            statusLabel = isBn ? 'অনুমোদিত' : 'Approved';
                          } else if (isWithdraw) {
                            statusLabel = isBn ? 'পেইড' : 'Paid';
                          } else {
                            statusLabel = isBn ? 'যাচাইকৃত' : 'Verified';
                          }
                          statusColor = 'bg-emerald-600 text-white border-emerald-700';
                        } else if (tx.status === 'Pending') {
                          statusLabel = isBn ? 'অপেক্ষমান (Pending)' : 'Pending Admin Approval';
                          statusColor = 'bg-amber-500 text-white border-amber-600 animate-pulse';
                        } else if (tx.status === 'Rejected') {
                          statusLabel = isBn ? 'বাতিল' : 'Rejected';
                          statusColor = 'bg-rose-600 text-white border-rose-700';
                        } else {
                          statusLabel = tx.status || (isBn ? 'প্রসেসিং' : 'Processing');
                          statusColor = 'bg-slate-400 text-white border-slate-500';
                        }

                        return (
                          <div 
                            key={tx.id}
                            className="p-3 bg-slate-50 hover:bg-slate-100/50 rounded-xl border border-slate-100 flex items-center justify-between gap-3 text-left transition-colors"
                          >
                            <div className="space-y-1 truncate">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase border shadow-sm ${colorBadge}`}>
                                  {typeBadge}
                                </span>
                                <span className={`px-2 py-0.5 rounded-md text-[8.5px] font-black border shadow-sm ${statusColor}`}>
                                  {statusLabel}
                                </span>
                              </div>
                              <p className="text-[11px] font-bold text-slate-800 truncate">
                                {isReward ? (tx.videoTitle || (isBn ? 'বাণিজ্যিক অ্যাড ভিডিও' : 'Commercial Ads View')) : isDeposit ? (isBn ? `প্যাকেজ অ্যাক্টিভেশন: ${tx.packageName || 'Paid'}` : `Membership: ${tx.packageName || 'Premium'}`) : (isBn ? `${tx.paymentMethod?.split(' ')[0]} উইথড্র পেমেন্ট (${tx.phone})` : `${tx.paymentMethod?.split(' ')[0]} Payout to ${tx.phone}`)}
                              </p>
                              <div className="flex items-center gap-1.5 text-[9.5px] text-slate-400 font-mono">
                                <span>{tx.id}</span>
                                <span>·</span>
                                <span>{tx.completionTime}</span>
                              </div>
                            </div>
                            
                            <div className="text-right shrink-0">
                              <span className={`text-sm font-black font-mono ${isWithdraw ? 'text-amber-600' : 'text-emerald-600'}`}>
                                {isWithdraw ? '-' : '+'}৳{tx.amount.toLocaleString(isBn ? 'bn-BD' : 'en-US')}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center gap-1.5 text-[10px] text-slate-400 font-bold justify-end font-sans">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>{isBn ? 'সবগুলো আর্থিক লেনদেন বাংলাদেশ সরকারি প্রটোকলে ট্যাক্স-পেইড।' : 'All financial transactions strictly processed with paid taxes.'}</span>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </section>
  );
}
