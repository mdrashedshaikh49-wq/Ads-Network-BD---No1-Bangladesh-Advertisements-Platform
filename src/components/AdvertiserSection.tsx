import React, { useState } from 'react';
import { Sparkles, Smartphone, Check, HelpCircle, X, CheckCircle, RefreshCw, Send, Volume2 } from 'lucide-react';
import PaymentLogoBadge from './PaymentLogos';

interface AdvertiserSectionProps {
  onRefreshData: () => void;
}

export default function AdvertiserSection({ onRefreshData }: AdvertiserSectionProps) {
  const [companyName, setCompanyName] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('আড়ং বুটিকস (Aarong)');
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

  // Dynamic budget calculation: ৳1.20 per view (৳1.00 earner + ৳0.20 platform fee)
  const viewsCount = parseInt(targetViews) || 0;
  const totalBudget = viewsCount * 120; // ৳120 per view in standard cents or direct Taka format

  const handleOpenCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !title || !url) {
      setErrorMsg('সবগুলো আবশ্যকীয় তথ্য (কোম্পানির নাম, শিরোনাম ও লিংক) পূরণ করুন।');
      return;
    }
    setErrorMsg(null);
    setShowCheckout(true);
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentPhone) {
      setErrorMsg('পেমেন্ট নম্বর প্রদান করা আবশ্যক।');
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
        setErrorMsg(data.message || 'বিজ্ঞাপন সাবমিট করতে ব্যর্থ হয়েছে।');
      }
    } catch (err) {
      setErrorMsg('সার্ভার সংযোগ ব্যাহত হয়েছে। পুনরায় চেষ্টা করুন।');
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
            বিজ্ঞাপনদাতা হাব (Advertiser Studio)
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-2 text-wrap">
            আপনার ব্র্যান্ডের প্রচার বাড়ান
          </h2>
          <p className="text-sm text-slate-500 mt-3">
            Watch2Earn-এ আপনার ভিডিও বিজ্ঞাপন প্রচার করে ১০০০+ ভেরিফাইড বাংলাদেশী ব্যবহারকারীদের সরাসরি এনগেজমেন্ট নিশ্চিত করুন।
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Advantages and Pricing Guideline */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
              <span className="px-2.5 py-1 text-[9px] font-bold bg-blue-500 text-white rounded-full uppercase tracking-wider">
                ADVANTAGES
              </span>
              <h3 className="text-xl font-black">কেন আমাদের মাধ্যমে বিজ্ঞাপন দিবেন?</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                আমাদের প্ল্যাটফর্মের ব্যবহারকারীরা আপনার পুরো ভিডিও মনোযোগ দিয়ে দেখতে বাধ্য থাকে, যার ফলে বিজ্ঞপ্তির মূল বার্তা গ্রাহকদের নিকট ১০০% পৌঁছায়।
              </p>

              <div className="space-y-3 pt-2 text-xs font-bold text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
                  <span>শতভাগ রিয়েল ও ভেরিফাইড বাংলাদেশী ভিউয়ার্স</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
                  <span>সার্ভার-সাইড ট্র্যাকিং টাইমার (bypassing প্রতিরোধক)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
                  <span>সর্বনিম্ন খরচে হাই-কনভার্টিং ভিডিও মার্কেটিং</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
                  <span>অনলাইন ব্র্যান্ডিং ও রিওয়ার্ড পেমেন্ট অটোমেশন</span>
                </div>
              </div>
            </div>

            {/* Tariff calculation breakdown table */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-4">
              <h4 className="text-sm font-extrabold text-slate-900">বিজ্ঞাপন খরচ ক্যালকুলেটর</h4>
              
              <div className="space-y-3.5 text-xs text-slate-600">
                <div className="flex justify-between items-center">
                  <span>প্রতিটি বিজ্ঞাপন ভিউ খরচ</span>
                  <span className="font-bold text-slate-900">৳১.২০</span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-slate-400 pl-4 border-l-2 border-slate-100">
                  <span>- Earner রিওয়ার্ড (ব্যবহারকারী পাবেন)</span>
                  <span>৳১.০০</span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-slate-400 pl-4 border-l-2 border-slate-100">
                  <span>- প্ল্যাটফর্ম সার্ভিস ফি</span>
                  <span>৳০.২০</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t font-black text-slate-900">
                  <span>প্রাক্কলিত মোট বাজেট (৳)</span>
                  <span className="text-lg text-emerald-600 font-mono">৳{totalBudget.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Campaign Registration Form */}
          <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
            <div className="flex items-center gap-2 pb-4 mb-4 border-b">
              <Volume2 className="w-5 h-5 text-[var(--brand-primary-start)]" />
              <h3 className="text-base font-extrabold text-slate-900">ক্যাম্পেইন রেজিষ্ট্রেশন ফর্ম</h3>
            </div>

            <form onSubmit={handleOpenCheckout} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">কোম্পানি বা ব্র্যান্ডের নাম (অবশ্যক)</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="যেমন: আড়ং (Aarong)"
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-100 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[var(--brand-primary-start)] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">ক্যাম্পেইন ভিডিও ক্যাটাগরি</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-100 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[var(--brand-primary-start)] focus:bg-white font-bold"
                  >
                    <option value="আড়ং বুটিকস (Aarong)">আড়ং বুটিকস (Aarong)</option>
                    <option value="গ্রামীণফোন (Grameenphone)">গ্রামীণফোন (Grameenphone)</option>
                    <option value="প্রাণ গ্রুপ (PRAN)">প্রাণ গ্রুপ (PRAN)</option>
                    <option value="স্কয়ার গ্রুপ (Square)">স্কয়ার গ্রুপ (Square)</option>
                    <option value="অন্যান্য বুটিক ও ফ্যাশন">অন্যান্য বুটিক ও ফ্যাশন</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">বিজ্ঞাপন ভিডিওর আকর্ষণীয় শিরোনাম (অবশ্যক)</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="যেমন: এক্সক্লুসিভ জামদানি কালেকশন ২০২৬ রিভিউ"
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-100 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[var(--brand-primary-start)] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">প্রয়োজনীয় সময়সীমা (সেকেন্ড)</label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-100 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[var(--brand-primary-start)] focus:bg-white font-mono font-bold"
                  >
                    <option value="15">১৫ সেকেন্ড</option>
                    <option value="20">২০ সেকেন্ড</option>
                    <option value="25">২৫ সেকেন্ড</option>
                    <option value="30">৩০ সেকেন্ড</option>
                    <option value="45">৪৫ সেকেন্ড</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">টার্গেট ভিউর লক্ষ্যমাত্রা</label>
                  <select
                    value={targetViews}
                    onChange={(e) => setTargetViews(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-100 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[var(--brand-primary-start)] focus:bg-white font-mono font-bold"
                  >
                    <option value="100">১০০টি ভিউ</option>
                    <option value="500">৫০০টি ভিউ</option>
                    <option value="1000">১,০০০টি ভিউ</option>
                    <option value="5000">৫,০০০টি ভিউ</option>
                    <option value="10000">১০,০০০টি ভিউ</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">YouTube Video Embed Link (ইউটিউব লিংক - আবশ্যক)</label>
                <input
                  type="url"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="যেমন: https://www.youtube.com/embed/p8ZshSOfmvs"
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-100 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[var(--brand-primary-start)] focus:bg-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">ভিডিওর সংক্ষিপ্ত টাস্ক গাইড বা বিবরণ</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="যেমন: আড়ং-এর এক্সক্লুসিভ হাতে বোনা নতুন জামদানি ডিজাইন ভিডিওটি সম্পূর্ণ মনোযোগ দিয়ে দেখুন।"
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-100 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[var(--brand-primary-start)] focus:bg-white h-20"
                />
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-800 border border-red-100 rounded-xl text-xs font-bold">
                  ⚠ {errorMsg}
                </div>
              )}

              {/* Submit trigger */}
              <button
                type="submit"
                className="w-full py-4 text-center text-sm font-bold text-white bg-slate-900 hover:bg-slate-850 rounded-2xl shadow-lg cursor-pointer"
              >
                বিজ্ঞাপন ক্যাম্পেইন বুকিং করুন
              </button>

            </form>
          </div>

        </div>

      </div>

      {/* ----------------------------------------
          BILLING CHECKOUT POPUP OVERLAY
          ---------------------------------------- */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 border border-slate-100 text-left relative overflow-hidden">
            <button 
              onClick={() => setShowCheckout(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">বিজ্ঞাপন বিলিং গেটওয়ে</span>
              <h3 className="text-lg font-black text-slate-900 mt-1">{companyName} এডমিন বুকিং</h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">বাজেট চার্জ: ৳{totalBudget.toLocaleString()}</p>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
              
              {/* Payment Methods */}
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">পেমেন্ট মেথড সিলেক্ট করুন</label>
                <div className="grid grid-cols-3 gap-2">
                  {['bKash (বিকাশ)', 'Nagad (নগদ)', 'Rocket (রকেট)'].map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`py-2 px-1 text-[10px] font-bold rounded-xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        paymentMethod === method
                          ? 'border-[var(--brand-primary-start)] bg-blue-50 text-[var(--brand-primary-start)] font-black ring-2 ring-blue-500/20 shadow-xs'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <PaymentLogoBadge method={method} className="w-4 h-4" showText={true} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div className="p-3 bg-blue-50 text-[10px] text-blue-900 font-bold rounded-xl space-y-1">
                <p>১. আমাদের অফিসিয়াল মার্চেন্ট একাউন্টে পেমেন্ট করুন।</p>
                <p className="text-slate-800 font-mono">• মার্চেন্ট নাম্বার: ০১৮১২ ৩৪৫৬৭৮</p>
                <p>২. আপনার পেমেন্টকৃত নম্বরটি দিয়ে সাবমিট সম্পন্ন করুন।</p>
              </div>

              {/* Sender account phone */}
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">আপনার পেমেন্ট নম্বর</label>
                <input
                  type="tel"
                  required
                  value={paymentPhone}
                  onChange={(e) => setPaymentPhone(e.target.value)}
                  placeholder="যেমন: 017xxxxxxxx"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Sender TrxID */}
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">ট্রানজেকশন আইডি (TrxID) - ঐচ্ছিক</label>
                <input
                  type="text"
                  value={trxId}
                  onChange={(e) => setTrxId(e.target.value)}
                  placeholder="যেমন: ADV8XG9L"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500 font-mono"
                />
              </div>

              {/* Notifications */}
              {successMsg && (
                <div className="p-2.5 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-100 flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {errorMsg && (
                <div className="p-2.5 bg-red-50 text-red-800 text-xs font-bold rounded-xl border border-red-100">
                  ⚠ {errorMsg}
                </div>
              )}

              {/* Submit checkout CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-slate-900 hover:bg-slate-850 text-white font-bold rounded-xl text-xs shadow-md cursor-pointer flex items-center justify-center gap-1"
              >
                {isSubmitting ? 'ক্যাম্পেইন প্রসেস হচ্ছে...' : 'বাজেট পেমেন্ট সম্পন্ন করুন'}
              </button>

            </form>
          </div>
        </div>
      )}

    </section>
  );
}
