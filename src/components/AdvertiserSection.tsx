import React, { useState } from 'react';
import { Sparkles, Smartphone, Check, HelpCircle, X, CheckCircle, RefreshCw, Send, Volume2, Wallet, Copy, ShieldCheck } from 'lucide-react';
import PaymentLogoBadge from './PaymentLogos';
import { useLanguage } from '../context/LanguageContext';

interface AdvertiserSectionProps {
  onRefreshData: () => void;
}

export default function AdvertiserSection({ onRefreshData }: AdvertiserSectionProps) {
  const [companyName, setCompanyName] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Fashion & Boutique');
  const [duration, setDuration] = useState('30');
  const [targetViews, setTargetViews] = useState('100');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  
  // Checkout Modal
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('bKash (বিকাশ)');
  const [paymentPhone, setPaymentPhone] = useState('');
  const [trxId, setTrxId] = useState('');
  
  // Loading & Success status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { isBn } = useLanguage();

  // Dynamic budget calculation: ৳1.20 per view (৳1.00 earner + ৳0.20 platform fee)
  const viewsCount = parseInt(targetViews) || 0;
  const totalBudget = viewsCount * 1.20; 

  const handleOpenCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !title || !url) {
      setErrorMsg(isBn ? 'সবগুলো আবশ্যকীয় তথ্য (কোম্পানির নাম, শিরোনাম ও লিংক) পূরণ করুন।' : 'Please fill in all required fields (Company name, Title, and Video URL).');
      return;
    }
    setErrorMsg(null);
    setShowCheckout(true);
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentPhone) {
      setErrorMsg(isBn ? 'পেমেন্ট নম্বর প্রদান করা আবশ্যক।' : 'Payment sender phone number is required.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/advertiser/campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName,
          title,
          category,
          duration,
          targetViews,
          url,
          description,
          paymentPhone,
          paymentMethod
        })
      });
      const data = await res.json();

      if (data.success) {
        setSuccessMsg(data.message);
        
        // Clear forms
        setCompanyName('');
        setTitle('');
        setUrl('');
        setDescription('');
        setTargetViews('100');
        
        onRefreshData(); // Immediately updates public stats ticker

        setTimeout(() => {
          setShowCheckout(false);
          setSuccessMsg(null);
        }, 5000);
      } else {
        setErrorMsg(data.message || (isBn ? 'বিজ্ঞাপন সাবমিট করতে ব্যর্থ হয়েছে।' : 'Ad campaign submission failed.'));
      }
    } catch (err) {
      setErrorMsg(isBn ? 'সার্ভার সংযোগ ব্যাহত হয়েছে। পুনরায় চেষ্টা করুন।' : 'Server connection disrupted. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="advertise" className="py-16 bg-slate-50 border-t border-slate-100 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-sm font-bold text-[var(--brand-primary-start)] uppercase tracking-wider">
            {isBn ? 'বিজ্ঞাপনদাতা হাব (Advertiser Studio)' : 'Advertiser Hub'}
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-2 text-wrap">
            {isBn ? 'আপনার ব্র্যান্ডের প্রচার বাড়ান' : 'Boost Your Brand Engagement'}
          </h2>
          <p className="text-sm text-slate-500 mt-3">
            {isBn 
              ? 'Watch2Earn-এ আপনার ভিডিও বিজ্ঞাপন প্রচার করে ১০০০+ ভেরিফাইড বাংলাদেশী ব্যবহারকারীদের সরাসরি এনগেজমেন্ট নিশ্চিত করুন।' 
              : 'Launch video campaigns on Ads Network BD to get 100% active, guaranteed attention from verified viewers.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Advantages and Pricing Guideline */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
              <span className="px-2.5 py-1 text-[9px] font-bold bg-blue-500 text-white rounded-full uppercase tracking-wider">
                ADVANTAGES
              </span>
              <h3 className="text-xl font-black">{isBn ? 'কেন আমাদের মাধ্যমে বিজ্ঞাপন দিবেন?' : 'Why Advertise With Us?'}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isBn 
                  ? 'আমাদের প্ল্যাটফর্মের ব্যবহারকারীরা আপনার পুরো ভিডিও মনোযোগ দিয়ে দেখতে বাধ্য থাকে, যার ফলে বিজ্ঞপ্তির মূল বার্তা গ্রাহকদের নিকট ১০০% পৌঁছায়।' 
                  : 'Our server-enforced countdown timer ensures viewers watch your entire commercial, delivering 100% video retention.'}
              </p>

              <div className="space-y-3 pt-2 text-xs font-bold text-slate-300 text-left">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
                  <span>{isBn ? 'শতভাগ রিয়েল ও ভেরিফাইড বাংলাদেশী ভিউয়ার্স' : '100% Real & Verified Bangladeshi Viewers'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
                  <span>{isBn ? 'সার্ভার-সাইড ট্র্যাকিং টাইমার (Bypassing প্রতিরোধক)' : 'Server-side Watch Validation (Anti-cheat)'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
                  <span>{isBn ? 'সর্বনিম্ন খরচে হাই-কনভার্টিং ভিডিও মার্কেটিং' : 'Most Cost-Effective Video Marketing'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
                  <span>{isBn ? 'অনলাইন ব্র্যান্ডিং ও রিওয়ার্ড পেমেন্ট অটোমেশন' : 'Automated Viewer Payouts and Analytics'}</span>
                </div>
              </div>
            </div>

            {/* Tariff calculation breakdown table */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-4">
              <h4 className="text-sm font-extrabold text-slate-900">{isBn ? 'বিজ্ঞাপন খরচ ক্যালকুলেটর' : 'Ad Budget Calculator'}</h4>
              
              <div className="space-y-3.5 text-xs text-slate-600 text-left">
                <div className="flex justify-between items-center">
                  <span>{isBn ? 'প্রতিটি বিজ্ঞাপন ভিউ খরচ' : 'Cost Per Single Ad View'}</span>
                  <span className="font-bold text-slate-900">৳১.২০</span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-slate-400 pl-4 border-l-2 border-slate-100">
                  <span>{isBn ? '- Earner রিওয়ার্ড (ব্যবহারকারী পাবেন)' : '- Earner Reward (Goes to viewer)'}</span>
                  <span>৳১.০০</span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-slate-400 pl-4 border-l-2 border-slate-100">
                  <span>{isBn ? '- প্ল্যাটফর্ম সার্ভিস ফি' : '- Platform Service Fee'}</span>
                  <span>৳০.২০</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t font-black text-slate-900">
                  <span>{isBn ? 'প্রাক্কলিত মোট বাজেট (৳)' : 'Estimated Total Budget (BDT)'}</span>
                  <span className="text-lg text-emerald-600 font-mono">৳{totalBudget.toLocaleString(isBn ? 'bn-BD' : 'en-US')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Campaign Registration Form */}
          <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
            <div className="flex items-center gap-2 pb-4 mb-4 border-b">
              <Volume2 className="w-5 h-5 text-[var(--brand-primary-start)]" />
              <h3 className="text-base font-extrabold text-slate-900">
                {isBn ? 'ক্যাম্পেইন রেজিষ্ট্রেশন ফর্ম' : 'Create Campaign Registration'}
              </h3>
            </div>

            <form onSubmit={handleOpenCheckout} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">{isBn ? 'কোম্পানি বা ব্র্যান্ডের নাম (অবশ্যক)' : 'Company / Brand Name (Required)'}</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder={isBn ? "যেমন: আড়ং (Aarong)" : "e.g., Aarong Foods"}
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-100 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[var(--brand-primary-start)] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">{isBn ? 'ক্যাম্পেইন ভিডিও ক্যাটাগরি' : 'Campaign Industry Category'}</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-100 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[var(--brand-primary-start)] focus:bg-white font-bold"
                  >
                    <option value="Fashion & Boutique">{isBn ? 'ফ্যাশন ও বুটিকস (Fashion)' : 'Fashion & Boutique'}</option>
                    <option value="FMCG & Groceries">{isBn ? 'নিত্যপ্রয়োজনীয় পণ্য (FMCG)' : 'FMCG & Groceries'}</option>
                    <option value="Fintech & Banking">{isBn ? 'ব্যাংকিং ও ফাইন্যান্স (Fintech)' : 'Fintech & Banking'}</option>
                    <option value="Electronics & Tech">{isBn ? 'প্রযুক্তি ও ইলেক্ট্রনিক্স (Electronics)' : 'Electronics & Tech'}</option>
                    <option value="Real Estate">{isBn ? 'রিয়েল এস্টেট ও আবাসন (Real Estate)' : 'Real Estate'}</option>
                    <option value="Other Industry">{isBn ? 'অন্যান্য ক্যাটাগরি (Other)' : 'Other Industry'}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">{isBn ? 'বিজ্ঞাপন দৈর্ঘ্য (সেকেন্ড)' : 'Ad Duration (Seconds)'}</label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-100 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[var(--brand-primary-start)] focus:bg-white font-bold"
                  >
                    <option value="30">{isBn ? '৩০ সেকেন্ড (মানদণ্ড)' : '30 Seconds (Standard)'}</option>
                    <option value="45">{isBn ? '৪৫ সেকেন্ড' : '45 Seconds'}</option>
                    <option value="60">{isBn ? '৬০ সেকেন্ড (লং ফরমেট)' : '60 Seconds (Long-form)'}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">{isBn ? 'টার্গেট ইউনিক ভিউ সংখ্যা' : 'Target Unique Views'}</label>
                  <select
                    value={targetViews}
                    onChange={(e) => setTargetViews(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-100 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[var(--brand-primary-start)] focus:bg-white font-bold"
                  >
                    <option value="100">১০০ {isBn ? 'টি ভিউ' : 'Views'} (৳১২০)</option>
                    <option value="500">৫০০ {isBn ? 'টি ভিউ' : 'Views'} (৳৬০০)</option>
                    <option value="1000">১,০০০ {isBn ? 'টি ভিউ' : 'Views'} (৳১,২০০)</option>
                    <option value="5000">৫,০০০ {isBn ? 'টি ভিউ' : 'Views'} (৳৬,০০০)</option>
                    <option value="10000">১০,০০০ {isBn ? 'টি ভিউ' : 'Views'} (৳১২,০০০)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">
                  {isBn ? 'ভিডিও ক্যাম্পেইন টাইটেল / বিজ্ঞাপন শিরোনাম (অবশ্যক)' : 'Ad Campaign Video Title (Required)'}
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={isBn ? "যেমন: আড়ং জ্যাকার্ড জামদানি শাড়ি ক্যাম্পেইন" : "e.g., Aarong Premium Silk Festive TVC"}
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-100 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[var(--brand-primary-start)] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">
                  {isBn ? 'ইউটিউব ভিডিও লিংক / YouTube URL (অবশ্যক)' : 'YouTube Video Ad Link (Required)'}
                </label>
                <input
                  type="url"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-100 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[var(--brand-primary-start)] focus:bg-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">
                  {isBn ? 'সংক্ষিপ্ত ডেসক্রিপশন / বিজ্ঞাপনের বিবরণ (ঐচ্ছিক)' : 'Short Ad Campaign Description (Optional)'}
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={isBn ? "আপনার বিজ্ঞাপনের আকর্ষণীয় সংক্ষিপ্ত বিবরণ দিন..." : "Describe the ad campaign goals or offers..."}
                  rows={3}
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-100 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[var(--brand-primary-start)] focus:bg-white resize-none"
                />
              </div>

              {errorMsg && !showCheckout && (
                <div className="p-3 bg-red-50 text-red-800 border border-red-200 rounded-xl text-xs font-bold">
                  ⚠ {errorMsg}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-[var(--brand-primary-start)] to-[var(--brand-primary-end)] text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-lg hover:shadow-xl hover:opacity-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Send className="w-4 h-4" />
                {isBn ? 'ক্যাম্পেইন পেমেন্ট পেজে যান' : 'Proceed to Campaign Payment'}
              </button>

            </form>
          </div>

        </div>

      </div>

      {/* CHECKOUT MODAL */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-slate-100 text-left relative overflow-hidden animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setShowCheckout(false)} 
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer p-1 hover:bg-slate-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <span className="text-xs font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
                {isBn ? 'ক্যাম্পেইন পেমেন্ট ভেরিফিকেশন' : 'Campaign Payment Verification'}
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-2">{isBn ? 'বিজ্ঞাপন ক্যাম্পেইন পেমেন্ট' : 'Ad Campaign Checkout'}</h3>
              <p className="text-sm font-extrabold text-emerald-600 font-mono mt-1">
                {isBn ? 'মোট বাজেট মূল্য:' : 'Total Ad Budget:'} ৳{totalBudget.toLocaleString(isBn ? 'bn-BD' : 'en-US')}
              </p>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
              
              {/* Payment Methods */}
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">{isBn ? 'পেমেন্ট গেটওয়ে নির্বাচন করুন' : 'Select Payment Gateway'}</label>
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
              <div className="p-4 bg-blue-50/80 text-xs text-blue-950 font-bold rounded-2xl border border-blue-200 space-y-1.5 leading-relaxed text-left">
                <p className="text-blue-900 font-black">
                  📌 {isBn ? 'ক্যাম্পেইন মার্চেন্ট ডিপোজিট' : 'Campaign Merchant Deposit'} ({paymentMethod.split(' ')[0]}):
                </p>
                <p>
                  {isBn 
                    ? `১. আপনার পেমেন্ট অ্যাপে সেন্ডমানি করুন ঠিক ৳${totalBudget.toLocaleString()} টাকা।` 
                    : `1. Open your payment app and Send Money exactly ৳${totalBudget.toLocaleString()} BDT.`}
                </p>
                <div className="flex items-center justify-between gap-2 bg-white p-2.5 rounded-xl border border-blue-200 shadow-xs">
                  <span className="text-blue-900 font-mono font-black text-xs pl-1">
                    {isBn ? 'মার্চেন্ট নাম্বার:' : 'Merchant Number:'} 01601499628
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('01601499628');
                    }}
                    type="button"
                    className="p-1.5 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-700 transition-colors cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p>
                  {isBn 
                    ? '২. সেন্ডমানি সম্পন্ন করার পর নিচে আপনার সেন্ডার মোবাইল নম্বর এবং ট্রানজেকশন আইডি (TrxID) প্রদান করুন।' 
                    : '2. After payment, provide your sender phone number and Transaction ID (TrxID) below to verify.'}
                </p>
              </div>

              {/* Sender Phone Input */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-500">
                  {isBn ? 'আপনার পেমেন্ট সেন্ডার নাম্বার' : 'Your Payment Sender Mobile Number'}
                </label>
                <input
                  type="text"
                  required
                  value={paymentPhone}
                  onChange={(e) => setPaymentPhone(e.target.value)}
                  placeholder={isBn ? "১১ ডিজিটের পেমেন্ট মোবাইল নাম্বার লিখুন" : "e.g., 01XXXXXXXXX"}
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
                <div className="p-3 bg-red-50 text-red-800 border border-red-200 rounded-xl text-xs font-bold leading-normal font-sans">
                  ⚠ {errorMsg}
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCheckout(false)}
                  className="flex-1 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer text-center"
                >
                  {isBn ? 'বাতিল করুন' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-700 to-indigo-800 hover:opacity-95 text-white font-extrabold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    isBn ? 'ক্যাম্পেইন প্রসেসিং হচ্ছে...' : 'Processing Campaign...'
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      {isBn ? 'পেমেন্ট নিশ্চিত করুন' : 'Confirm Payment'}
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
