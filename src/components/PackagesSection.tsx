import React, { useState, useEffect } from 'react';
import { ShieldCheck, Smartphone, Check, Sparkles, X, Gift, Zap, Wallet, Lock, ArrowRight, Copy, Clock } from 'lucide-react';
import PaymentLogoBadge from './PaymentLogos';
import { useLanguage } from '../context/LanguageContext';

interface PackagesSectionProps {
  user: any;
  onRefreshUser: () => void;
  onOpenLogin: () => void;
}

export interface PackageItem {
  key: string;
  name: string;
  price: number;
  dailyVideos: number;
  rewardPerVideo: number;
  dailyIncome: number;
  popular: boolean;
  estimatedReturn: number;
  validity: string;
  withdrawNote?: string;
}

export const AVAILABLE_PACKAGES: PackageItem[] = [
  { 
    key: 'starter', 
    name: 'Starter', 
    price: 500, 
    dailyVideos: 1, 
    rewardPerVideo: 50, 
    dailyIncome: 50, 
    popular: false, 
    estimatedReturn: 1000,
    validity: '২০ দিন'
  },
  { 
    key: 'basic', 
    name: 'Basic', 
    price: 1000, 
    dailyVideos: 2, 
    rewardPerVideo: 50, 
    dailyIncome: 100, 
    popular: false, 
    estimatedReturn: 3000,
    validity: '৩০ দিন'
  },
  { 
    key: 'standard', 
    name: 'Standard', 
    price: 2000, 
    dailyVideos: 5, 
    rewardPerVideo: 50, 
    dailyIncome: 250, 
    popular: false, 
    estimatedReturn: 7500,
    validity: '৩০ দিন'
  },
  { 
    key: 'silver', 
    name: 'Silver', 
    price: 3000, 
    dailyVideos: 8, 
    rewardPerVideo: 50, 
    dailyIncome: 400, 
    popular: false, 
    estimatedReturn: 12000,
    validity: '৩০ দিন'
  },
  { 
    key: 'gold', 
    name: 'Gold', 
    price: 4000, 
    dailyVideos: 12, 
    rewardPerVideo: 50, 
    dailyIncome: 600, 
    popular: true, 
    estimatedReturn: 18000,
    validity: '৩০ দিন'
  },
  { 
    key: 'platinum', 
    name: 'Platinum', 
    price: 5000, 
    dailyVideos: 20, 
    rewardPerVideo: 50, 
    dailyIncome: 1000, 
    popular: true, 
    estimatedReturn: 40000,
    validity: '৪০ দিন'
  },
  { 
    key: 'diamond', 
    name: 'Diamond', 
    price: 8000, 
    dailyVideos: 40, 
    rewardPerVideo: 50, 
    dailyIncome: 2000, 
    popular: true, 
    estimatedReturn: 100000,
    validity: '৫০ দিন'
  },
  { 
    key: 'elite', 
    name: 'Elite', 
    price: 10000, 
    dailyVideos: 50, 
    rewardPerVideo: 50, 
    dailyIncome: 2500, 
    popular: true, 
    estimatedReturn: 150000,
    validity: '৬০ দিন'
  }
];

export default function PackagesSection({ user, onRefreshUser, onOpenLogin }: PackagesSectionProps) {
  const [selectedPkg, setSelectedPkg] = useState<any | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('bKash (বিকাশ)');
  const [phone, setPhone] = useState('');
  const [trxId, setTrxId] = useState('');
  const [isBuying, setIsBuying] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { isBn } = useLanguage();

  const [paymentNumbers, setPaymentNumbers] = useState({
    bkash: '01601499628',
    nagad: '01601499628',
    rocket: '01601499628'
  });

  const [copied, setCopied] = useState(false);

  const handleCopyNumber = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    fetch('/api/payment-numbers')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.paymentNumbers) {
          setPaymentNumbers(data.paymentNumbers);
        }
      })
      .catch(() => {});
  }, []);

  const getActiveNumber = () => {
    if (paymentMethod.includes('bKash') || paymentMethod.includes('বিকাশ')) return paymentNumbers.bkash;
    if (paymentMethod.includes('Nagad') || paymentMethod.includes('নগদ')) return paymentNumbers.nagad;
    if (paymentMethod.includes('Rocket') || paymentMethod.includes('রকেট')) return paymentNumbers.rocket;
    return paymentNumbers.bkash;
  };

  const handleOpenBuy = (pkg: any) => {
    if (!user) {
      onOpenLogin();
      return;
    }
    setSelectedPkg(pkg);
    setSuccessMsg(null);
    setErrorMsg(null);
    setPhone(user.phone || '');
    setTrxId('');
  };

  const handlePurchaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPkg || !user) return;

    if (!phone) {
      setErrorMsg(isBn ? 'অনুগ্রহ করে আপনার পেমেন্ট সেন্ডার নম্বরটি প্রদান করুন।' : 'Please provide your payment sender phone number.');
      return;
    }

    setIsBuying(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/packages/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          packageKey: selectedPkg.key,
          paymentMethod,
          accountPhone: phone,
          trxId
        })
      });
      const data = await res.json();

      if (data.success) {
        setSuccessMsg(data.message);
        onRefreshUser(); // Immediately syncs layout with newly subscribed package details
        setTimeout(() => {
          setSelectedPkg(null);
        }, 3000);
      } else {
        setErrorMsg(data.message || (isBn ? 'প্যাকেজ সক্রিয়করণ ব্যর্থ হয়েছে।' : 'Package activation failed.'));
      }
    } catch (err) {
      setErrorMsg(isBn ? 'সার্ভার সাথে সংযোগ ত্রুটি। আবার চেষ্টা করুন।' : 'Server connection error. Please try again.');
    } finally {
      setIsBuying(false);
    }
  };

  return (
    <section id="packages" className="py-16 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-sm font-bold text-[var(--brand-primary-start)] uppercase tracking-wider">
            {isBn ? 'মেম্বারশিপ প্যাকেজ' : 'Membership Packages'}
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-2">
            {isBn ? 'আমাদের ইনকাম প্যাকেজসমূহ' : 'Our Premium Membership Packages'}
          </h2>
          <p className="text-sm text-slate-500 mt-3">
            {isBn 
              ? 'ভিডিও দেখে ইনকাম শুরু করার আগে আপনার লক্ষ্য অনুযায়ী যেকোনো একটি প্যাকেজ ডিপোজিট করে সক্রিয় করুন।' 
              : 'Activate a premium tier matching your goals before watching ads to enjoy massive instant wallet rewards.'}
          </p>
        </div>

        {/* CORE MANDATORY NOTICE BANNER */}
        <div className="mb-10 p-5 bg-blue-50 border-2 border-blue-200 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4 text-blue-950 shadow-xs">
          <div className="flex items-center gap-3.5 text-left">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shrink-0 text-white font-extrabold text-xl shadow-md">
              <Zap className="w-6 h-6 fill-white" />
            </div>
            <div>
              <p className="text-sm sm:text-base font-black">
                {isBn ? '১ম ধাপ: ফার্স্ট টাকা ডিপোজিট করে প্যাকেজ সক্রিয় করা বাধ্যতামূলক!' : 'Step 1: First Deposit and Package Activation is Mandatory!'}
              </p>
              <p className="text-xs text-blue-800 mt-0.5 font-medium leading-relaxed">
                {isBn 
                  ? 'প্যাকেজ না কিনলে কেউ ভিডিও দেখে আয় করতে পারবে না। প্রতিটি ভিডিও দেখা সম্পন্ন করলেই পাবেন নিশ্চিত ৳১০০ ইনকাম!' 
                  : 'You must activate a paid package to watch ads and earn. Earn a guaranteed ৳100 for each commercial viewed successfully!'}
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 bg-white px-3.5 py-1.5 rounded-2xl border border-blue-200 text-xs font-bold text-blue-900 font-mono shrink-0 shadow-xs">
            <Wallet className="w-4 h-4 text-blue-600" />
            <span>{isBn ? 'অফিসিয়াল পেমেন্ট নম্বর:' : 'Official Payment No:'} {paymentNumbers.bkash}</span>
            <button
              onClick={() => handleCopyNumber(paymentNumbers.bkash)}
              className="ml-1 p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-800 transition-all cursor-pointer flex items-center gap-1 active:scale-95"
              title="Copy Number"
            >
              <Copy className="w-3.5 h-3.5" />
              <span className="text-[10px] font-sans font-bold">{copied ? (isBn ? 'কপি হয়েছে!' : 'Copied!') : (isBn ? 'কপি' : 'Copy')}</span>
            </button>
          </div>
        </div>

        {/* Dynamic packages GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {AVAILABLE_PACKAGES.map((pkg) => {
            const isCurrentPackage = user && user.currentPackage === pkg.key;
            const monthlyEst = pkg.dailyIncome * 30;
            const validityText = isBn ? pkg.validity : pkg.validity.replace('দিন', ' Days');

            return (
              <div 
                key={pkg.key}
                className={`bg-white rounded-3xl border p-6 flex flex-col justify-between transition-all duration-300 relative group shadow-sm hover:shadow-xl ${
                  pkg.popular 
                    ? 'border-blue-600 ring-2 ring-blue-100' 
                    : isCurrentPackage
                    ? 'border-emerald-500 ring-2 ring-emerald-100 bg-emerald-50/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {pkg.popular && (
                  <span className="absolute -top-3 right-6 bg-blue-700 text-white font-black text-[10px] uppercase px-3 py-1 rounded-full shadow-md font-mono tracking-wider">
                    {isBn ? '★ সেরা বাণিজ্যিক চয়েস' : '★ BEST CHOICE'}
                  </span>
                )}

                {isCurrentPackage && (
                  <span className="absolute -top-3 left-6 bg-emerald-600 text-white font-black text-[10px] uppercase px-3 py-1 rounded-full shadow-md font-mono tracking-wider">
                    {isBn ? '✓ সক্রিয় সাবস্ক্রিপশন' : '✓ ACTIVE PLAN'}
                  </span>
                )}

                <div>
                  <div className="text-left border-b border-slate-100 pb-4 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{pkg.name} Tier</span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-sm">
                        {isBn ? 'ইনস্ট্যান্ট অ্যাক্টিভেশন' : 'Instant Active'}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1 mt-1.5">
                      <span className="text-3xl font-black text-slate-900 font-mono">৳{pkg.price.toLocaleString(isBn ? 'bn-BD' : 'en-US')}</span>
                      <span className="text-xs text-slate-400 font-bold">/ {isBn ? 'এককালীন' : 'One-time'}</span>
                    </div>
                  </div>

                  {/* Feature bullet list */}
                  <ul className="space-y-3 text-xs text-left mb-6">
                    <li className="flex items-center gap-2 text-slate-700 font-semibold">
                      <Check className="w-4 h-4 text-blue-600 shrink-0 font-bold" />
                      <span>{isBn ? 'দৈনিক ভিডিও লিমিট:' : 'Daily Ad Limit:'} <strong className="text-slate-900 font-mono font-bold">{pkg.dailyVideos} {isBn ? 'টি' : 'Ads'}</strong></span>
                    </li>
                    <li className="flex items-center gap-2 text-slate-700 font-semibold">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 font-bold" />
                      <span>{isBn ? 'প্রতি ভিডিও ইনকাম:' : 'Reward Per Ad:'} <strong className="text-emerald-700 font-mono font-bold">৳{pkg.rewardPerVideo.toLocaleString(isBn ? 'bn-BD' : 'en-US')}</strong></span>
                    </li>
                    <li className="flex items-center justify-between text-slate-900 font-bold bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="flex items-center gap-1.5 text-xs">
                        <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                        {isBn ? 'দৈনিক মোট আয়:' : 'Daily Revenue:'}
                      </span>
                      <strong className="text-emerald-700 font-mono font-black text-sm">৳{pkg.dailyIncome.toLocaleString(isBn ? 'bn-BD' : 'en-US')}</strong>
                    </li>
                    <li className="flex items-center justify-between text-slate-700 font-bold bg-blue-50/50 p-2 rounded-xl text-[11px] border border-blue-100/60">
                      <span>{isBn ? 'মাসিক সম্ভাব্য রিটার্ন:' : 'Estimated Monthly Return:'}</span>
                      <strong className="text-blue-800 font-mono font-bold">৳{(pkg.estimatedReturn || monthlyEst).toLocaleString(isBn ? 'bn-BD' : 'en-US')}</strong>
                    </li>
                    {pkg.validity && (
                      <li className="flex items-center justify-between text-purple-900 font-bold bg-purple-50/60 p-2 rounded-xl text-[11px] border border-purple-100/70">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-purple-600" />
                          {isBn ? 'মেয়াদ:' : 'Validity:'}
                        </span>
                        <strong className="text-purple-800 font-bold">{validityText}</strong>
                      </li>
                    )}
                  </ul>
                </div>

                <button
                  onClick={() => handleOpenBuy(pkg)}
                  disabled={isCurrentPackage}
                  className={`w-full py-3.5 text-xs font-black uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    isCurrentPackage
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
                      : pkg.popular
                      ? 'bg-blue-700 hover:bg-blue-800 text-white shadow-blue-500/25'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  {isCurrentPackage ? (
                    isBn ? '✓ বর্তমান সক্রিয় প্যাকেজ' : '✓ Active Member Plan'
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      {isBn ? 'ডিপোজিট ও সক্রিয় করুন' : 'Deposit & Activate'}
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

      </div>

      {/* DEPOSIT & PACKAGE PURCHASE MODAL */}
      {selectedPkg && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-slate-100 text-left relative overflow-hidden animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setSelectedPkg(null)} 
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer p-1 hover:bg-slate-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <span className="text-xs font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
                {isBn ? 'ডিপোজিট ও প্যাকেজ অ্যাক্টিভেশন' : 'Deposit & Plan Activation'}
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-2">
                {isBn ? `${selectedPkg.name} প্যাকেজ ক্রয়` : `Purchase ${selectedPkg.name}`}
              </h3>
              <p className="text-sm font-extrabold text-emerald-600 font-mono mt-1">
                {isBn ? 'প্যাকেজ মূল্য:' : 'Plan Price:'} ৳{selectedPkg.price.toLocaleString(isBn ? 'bn-BD' : 'en-US')}
              </p>
            </div>

            <form onSubmit={handlePurchaseSubmit} className="space-y-4">
              
              {/* Payment Methods */}
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">
                  {isBn ? 'পেমেন্ট গেটওয়ে নির্বাচন করুন' : 'Select Payment Gateway'}
                </label>
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

              {/* Deposit Instructions Row */}
              <div className="p-4 bg-blue-50/80 text-xs text-blue-950 font-bold rounded-2xl border border-blue-200 space-y-1.5 leading-relaxed">
                <p className="text-blue-900 font-black">
                  📌 {isBn ? 'ডিপোজিট নির্দেশিকা' : 'Deposit Instructions'} ({paymentMethod.split(' ')[0]}):
                </p>
                <p>
                  {isBn 
                    ? `১. আপনার নির্বাচিত পেমেন্ট অ্যাপে যান (${paymentMethod.split(' ')[0]})।` 
                    : `1. Open your selected mobile banking app (${paymentMethod.split(' ')[0]}).`}
                </p>
                <div className="flex items-center justify-between gap-2 bg-white p-2.5 rounded-xl border border-blue-200 shadow-xs">
                  <span className="text-blue-900 font-mono font-black text-xs pl-1">
                    {isBn ? 'সেন্ডমানি নাম্বার:' : 'Send Money Number:'} {getActiveNumber()}
                  </span>
                  <button
                    onClick={() => handleCopyNumber(getActiveNumber())}
                    type="button"
                    className="p-1.5 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-700 transition-colors cursor-pointer"
                    title="Copy Number"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p>
                  {isBn 
                    ? `২. উপরের নাম্বারে সেন্ডমানি বা ক্যাশ-ইন করুন ঠিক ৳${selectedPkg.price.toLocaleString()} টাকা।` 
                    : `2. Send exactly ৳${selectedPkg.price.toLocaleString()} BDT to the number above.`}
                </p>
                <p>
                  {isBn 
                    ? '৩. সফল পেমেন্ট সম্পন্ন করার পর নিচের বক্সে আপনার সেন্ডার মোবাইল নম্বর এবং ট্রানজেকশন আইডি (TrxID) দিয়ে সাবমিট করুন।' 
                    : '3. After successful payment, provide your sender phone number and Transaction ID (TrxID) below to submit.'}
                </p>
              </div>

              {/* Sender Phone Input */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-500">
                  {isBn ? 'পেমেন্ট সেন্ডার নাম্বার (বিকাশ/নগদ/রকেট)' : 'Payment Sender Mobile Number'}
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={isBn ? "১১ ডিজিটের সেন্ডার মোবাইল নাম্বার লিখুন" : "e.g., 017XXXXXXXX"}
                  className="w-full px-3.5 py-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-blue-600 focus:bg-white font-medium"
                />
              </div>

              {/* Transaction ID Input */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold text-slate-500">
                    {isBn ? 'পেমেন্ট ট্রানজেকশন আইডি (TrxID)' : 'Payment Transaction ID (TrxID)'}
                  </label>
                  <span className="text-[10px] text-slate-400 font-bold">({isBn ? 'ঐচ্ছিক' : 'Optional'})</span>
                </div>
                <input
                  type="text"
                  value={trxId}
                  onChange={(e) => setTrxId(e.target.value)}
                  placeholder={isBn ? "যেমন: K9S7FL98G0" : "e.g., TRX98472851"}
                  className="w-full px-3.5 py-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-blue-600 focus:bg-white font-mono"
                />
              </div>

              {/* Feedback messages */}
              {successMsg && (
                <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold leading-normal">
                  ✓ {successMsg}
                </div>
              )}
              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-800 border border-red-200 rounded-xl text-xs font-bold leading-normal">
                  ⚠ {errorMsg}
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedPkg(null)}
                  className="flex-1 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer text-center"
                >
                  {isBn ? 'বাতিল করুন' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isBuying}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-700 to-indigo-800 hover:opacity-95 text-white font-extrabold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isBuying ? (
                    isBn ? 'প্রসেসিং হচ্ছে...' : 'Processing...'
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      {isBn ? 'ডিপোজিট সাবমিট করুন' : 'Submit Deposit'}
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </section>
  );
}
