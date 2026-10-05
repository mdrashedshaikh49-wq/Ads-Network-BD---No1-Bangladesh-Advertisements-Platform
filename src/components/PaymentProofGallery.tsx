import React, { useState } from 'react';
import { CheckCircle2, Star, ShieldCheck, ArrowUpRight, MessageSquare, Award, Clock } from 'lucide-react';

import PaymentLogoBadge, { BKashLogo, NagadLogo } from './PaymentLogos';

interface PaymentProofGalleryProps {
  onStartWatching?: () => void;
}

export default function PaymentProofGallery({ onStartWatching }: PaymentProofGalleryProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'bkash' | 'nagad'>('all');

  // Realistic verified payment receipts sample data
  const paymentReceipts = [
    {
      id: 'p-101',
      name: 'সামিয়া সুলতানা',
      location: 'ঢাকা উত্তর',
      amount: 1500,
      method: 'bKash (বিকাশ)',
      trxId: 'BK9X2810M4',
      time: '১০ মিনিট আগে',
      userType: 'গোল্ড মেম্বার',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      badgeColor: 'bg-pink-50 text-pink-700 border-pink-200'
    },
    {
      id: 'p-102',
      name: 'মোঃ রফিকুল ইসলাম',
      location: 'রাজশাহী সদর',
      amount: 2200,
      method: 'Nagad (নগদ)',
      trxId: 'NG771902K1',
      time: '২৫ মিনিট আগে',
      userType: 'প্লাটিনাম মেম্বার',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      badgeColor: 'bg-orange-50 text-orange-700 border-orange-200'
    },
    {
      id: 'p-103',
      name: 'ফারহানা ইয়াসমিন',
      location: 'চট্টগ্রাম',
      amount: 3500,
      method: 'bKash (বিকাশ)',
      trxId: 'BK882109P2',
      time: '১ ঘণ্টা আগে',
      userType: 'ডায়মন্ড মেম্বার',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      badgeColor: 'bg-pink-50 text-pink-700 border-pink-200'
    },
    {
      id: 'p-104',
      name: 'তানভীর আহমেদ',
      location: 'সিলেট',
      amount: 1200,
      method: 'Nagad (নগদ)',
      trxId: 'NG910248L9',
      time: '২ ঘণ্টা আগে',
      userType: 'সিলভার মেম্বার',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      badgeColor: 'bg-orange-50 text-orange-700 border-orange-200'
    },
    {
      id: 'p-105',
      name: 'আরিফ হোসেন',
      location: 'খুলনা',
      amount: 4800,
      method: 'bKash (বিকাশ)',
      trxId: 'BK339102V8',
      time: '৩ ঘণ্টা আগে',
      userType: 'ভিআইপি মেম্বার',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
      badgeColor: 'bg-pink-50 text-pink-700 border-pink-200'
    },
    {
      id: 'p-106',
      name: 'নুসরাত জাহান',
      location: 'ময়মনসিংহ',
      amount: 1800,
      method: 'Nagad (নগদ)',
      trxId: 'NG881290W3',
      time: '৪ ঘণ্টা আগে',
      userType: 'স্ট্যান্ডার্ড মেম্বার',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
      badgeColor: 'bg-orange-50 text-orange-700 border-orange-200'
    }
  ];

  // User Reviews & Testimonials
  const userTestimonials = [
    {
      id: 'rev-1',
      name: 'শাহরিয়ার কবির',
      role: 'বিশ্ববিদ্যালয় শিক্ষার্থী, ঢাকা',
      rating: 5,
      comment: 'আমি গত ৩ মাস ধরে Watch2Earn ব্যবহার করছি। প্রতিদিনের ফ্রি ও প্যাকেজ টাস্ক দেখে এখন পর্যন্ত ৳১২,০০০+ টাকা সরাসরি বিকাশে পেয়েছি। এটি সত্যিই অসাধারণ ও নির্ভরযোগ্য একটি প্ল্যাটফর্ম!',
      earnings: '৳১২,৫০০+',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'rev-2',
      name: 'রোকেয়া বেগম',
      role: 'গৃহিণী, বগুড়া',
      rating: 5,
      comment: 'অবসর সময়ে শাড়ির বিজ্ঞাপন ভিডিও দেখে প্রতিদিন ঘরে বসেই ভালো পরিমাণের রিওয়ার্ড পাচ্ছি। সবচেয়ে বড় বিষয় হল উইথড্র করার ১০ মিনিটের মধ্যেই নগদে টাকা চলে আসে!',
      earnings: '৳১৮,২০০+',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'rev-3',
      name: 'জাহিদুল ইসলাম',
      role: 'ফ্রিল্যান্সার, কুমিল্লা',
      rating: 5,
      comment: 'প্ল্যাটফর্মের সাপোর্ট টিম খুবই ভালো। কোনো পেমেন্ট ইস্যু হলে হোয়াটসঅ্যাপে বললেই দ্রুত সমাধান পাওয়া যায়। সব ফ্রেন্ডদের রিকমেন্ড করেছি।',
      earnings: '৳৯,৮০০+',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80'
    }
  ];

  const filteredReceipts = paymentReceipts.filter(r => {
    if (activeTab === 'bkash') return r.method.includes('bKash');
    if (activeTab === 'nagad') return r.method.includes('Nagad');
    return true;
  });

  return (
    <section id="payment-proofs" className="py-16 bg-white border-t border-slate-100 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 text-[var(--brand-primary-start)] text-xs font-bold border border-blue-100 mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>১০০% প্রমানিত পেমেন্ট হিস্ট্রি</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-1">
            লাইভ পেমেন্ট প্রুফ ও মেম্বার রিভিউ
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            আমাদের ব্যবহারকারীরা প্রতিদিন সরাসরি বিকাশ এবং নগদে যে পেমেন্ট পাচ্ছেন তার সাম্প্রতিক বাস্তব বিবরণ।
          </p>
        </div>

        {/* Rating Summary Banner */}
        <div className="bg-slate-900 text-white p-6 rounded-3xl mb-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg">
              4.9
            </div>
            <div>
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm font-extrabold text-white mt-0.5">গড় রেটিং (১২,৪৫০+ রিয়েল ইউজার)</p>
              <p className="text-xs text-slate-400">সকল পেমেন্ট বিকাশ/নগদে ১০০% পরিশোধ করা হয়েছে</p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex bg-slate-800 p-1.5 rounded-2xl border border-slate-700">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'all' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              সকল পেমেন্ট
            </button>
            <button
              onClick={() => setActiveTab('bkash')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'bkash' ? 'bg-pink-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <BKashLogo className="w-4 h-4" />
              bKash
            </button>
            <button
              onClick={() => setActiveTab('nagad')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'nagad' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <NagadLogo className="w-4 h-4" />
              Nagad
            </button>
          </div>
        </div>

        {/* 1. Verified Payment Receipts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredReceipts.map((item) => (
            <div 
              key={item.id}
              className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 hover:border-slate-300 transition-all shadow-xs relative overflow-hidden group"
            >
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/60">
                <div className="flex items-center gap-3">
                  <img 
                    src={item.avatar} 
                    alt={item.name} 
                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-xs"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-1">
                      {item.name}
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 fill-emerald-100" />
                    </h4>
                    <span className="text-[10px] text-slate-500 font-bold">{item.location} · {item.userType}</span>
                  </div>
                </div>

                <PaymentLogoBadge method={item.method} className="w-5 h-5" showText={false} />
              </div>

              {/* Receipt Body */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-100 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-slate-500 font-bold">পরিশোধিত টাকা:</span>
                  <span className="text-base font-black text-emerald-600 font-mono">৳{item.amount.toLocaleString()}.০০</span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                  <span>TrxID: <span className="font-bold text-slate-700">{item.trxId}</span></span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {item.time}</span>
                </div>
              </div>

              <div className="mt-2.5 flex items-center justify-between text-[10px] text-emerald-700 font-extrabold px-1">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  সফলভাবে অ্যাকাউন্টে জমা হয়েছে
                </span>
                <span className="text-slate-400 font-normal">Verified</span>
              </div>
            </div>
          ))}
        </div>

        {/* 2. Real Member Testimonials Cards */}
        <div className="pt-8 border-t border-slate-100">
          <div className="text-center mb-10">
            <h3 className="text-xl font-black text-slate-900">সফল মেম্বারদের সরাসরি অনুভূতি</h3>
            <p className="text-xs text-slate-500 mt-1">আমাদের হাজার হাজার সন্তুষ্ট ব্যবহারকারীদের কিছু মন্তব্য</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {userTestimonials.map((t) => (
              <div key={t.id} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="px-2.5 py-1 text-[10px] font-black bg-emerald-100 text-emerald-800 rounded-full font-mono">
                    মোট আয়: {t.earnings}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed italic">
                  "{t.comment}"
                </p>

                <div className="flex items-center gap-3 pt-2 border-t border-slate-200/50">
                  <img 
                    src={t.avatar} 
                    alt={t.name} 
                    className="w-9 h-9 rounded-full object-cover border border-white"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h5 className="text-xs font-black text-slate-900">{t.name}</h5>
                    <p className="text-[10px] text-slate-400 font-bold">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => {
                if (onStartWatching) {
                  onStartWatching();
                } else {
                  const el = document.getElementById('watch-earn');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="px-8 py-3.5 bg-gradient-to-r from-[var(--brand-primary-start)] to-[var(--brand-primary-end)] hover:opacity-95 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <Award className="w-4 h-4" />
              এখনই বিজ্ঞাপন দেখে আয় শুরু করুন →
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
