import React from 'react';
import { ShieldCheck, Award, Lock, CheckCircle2, Phone, MessageSquare, ExternalLink, Building2, FileCheck, Landmark } from 'lucide-react';

import { BKashLogo, NagadLogo, RocketLogo, UpayLogo } from './PaymentLogos';

export default function TrustAndLegalSection() {
  return (
    <section id="trust-legal" className="py-16 bg-slate-900 text-white relative overflow-hidden text-left">
      {/* Visual background ambient glows */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-blue-600/10 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-emerald-600/10 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20 mb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>১০০% বিশ্বস্ত ও সরকারিভাবে নিবন্ধিত প্ল্যাটফর্ম</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            নিরাপত্তা, স্বচ্ছতা ও আইনি বৈধতা
          </h2>
          <p className="text-sm text-slate-400 mt-3 leading-relaxed">
            Ads Network Bangladesh হল দেশের ডিজিটাল বাণিজ্য নীতি অনুযায়ী সরকারি অনুমোদিত একটি আইনি বাণিজ্যিক বিজ্ঞাপন ও ডিজিটাল সার্ভিস প্ল্যাটফর্ম। আমরা ব্যবহারকারীদের ডেটা সুরক্ষা ও তাৎক্ষণিক পেমেন্ট নিশ্চিতে প্রতিশ্রুতিবদ্ধ।
          </p>
        </div>

        {/* 1. Legal Registrations Credentials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          
          <div className="p-6 bg-slate-800/80 rounded-2xl border border-slate-700/80 shadow-lg hover:border-emerald-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
              <Building2 className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">ট্রেড লাইসেন্স নং</span>
            <p className="text-base font-black text-white font-mono mt-1">TRAD/DNCC/019482</p>
            <p className="text-xs text-slate-400 mt-2">ঢাকা উত্তর সিটি কর্পোরেশন নিবন্ধিত আইডি প্রতিষ্ঠান।</p>
          </div>

          <div className="p-6 bg-slate-800/80 rounded-2xl border border-slate-700/80 shadow-lg hover:border-emerald-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
              <FileCheck className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">ডিজিটাল কমার্স ID (DBID)</span>
            <p className="text-base font-black text-white font-mono mt-1">DBID-BD-9204185</p>
            <p className="text-xs text-slate-400 mt-2">বাণিজ্য মন্ত্রণালয় অনুমোদিত ডিজিটাল বিজনেস আইডি।</p>
          </div>

          <div className="p-6 bg-slate-800/80 rounded-2xl border border-slate-700/80 shadow-lg hover:border-emerald-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
              <Landmark className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">জাতীয় e-TIN নং</span>
            <p className="text-base font-black text-white font-mono mt-1">8419-3029-4182</p>
            <p className="text-xs text-slate-400 mt-2">জাতীয় রাজস্ব বোর্ড (NBR) ট্যাক্স নিবন্ধিত প্রতিষ্ঠান।</p>
          </div>

          <div className="p-6 bg-slate-800/80 rounded-2xl border border-slate-700/80 shadow-lg hover:border-emerald-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">SSL encryption & Security</span>
            <p className="text-base font-black text-white font-mono mt-1">256-BIT SSL PROTECTED</p>
            <p className="text-xs text-slate-400 mt-2">ব্যাংকিং গ্রেড ডেটা এনক্রিপশন ও সিকিউরিটি ফিল্টার।</p>
          </div>

        </div>

        {/* 2. Official Payment Partners Badges */}
        <div className="bg-slate-800/50 p-6 md:p-8 rounded-3xl border border-slate-700/60 shadow-xl mb-12 text-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">
            অফিসিয়াল পেমেন্ট সার্ভিস ও চ্যানেল পার্টনারস
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
            <div className="px-5 py-3 bg-slate-900/90 rounded-2xl border border-pink-500/30 flex items-center gap-3 hover:scale-105 transition-transform shadow-lg">
              <BKashLogo className="w-7 h-7" />
              <span className="text-sm font-black text-white">bKash (বিকাশ)</span>
            </div>
            <div className="px-5 py-3 bg-slate-900/90 rounded-2xl border border-orange-500/30 flex items-center gap-3 hover:scale-105 transition-transform shadow-lg">
              <NagadLogo className="w-7 h-7" />
              <span className="text-sm font-black text-white">Nagad (নগদ)</span>
            </div>
            <div className="px-5 py-3 bg-slate-900/90 rounded-2xl border border-purple-500/30 flex items-center gap-3 hover:scale-105 transition-transform shadow-lg">
              <RocketLogo className="w-7 h-7" />
              <span className="text-sm font-black text-white">Rocket (রকেট)</span>
            </div>
            <div className="px-5 py-3 bg-slate-900/90 rounded-2xl border border-blue-500/30 flex items-center gap-3 hover:scale-105 transition-transform shadow-lg">
              <UpayLogo className="w-7 h-7" />
              <span className="text-sm font-black text-white">Upay (উপায়)</span>
            </div>
            <div className="px-5 py-3 bg-slate-900/90 rounded-2xl border border-emerald-500/30 flex items-center gap-3 hover:scale-105 transition-transform shadow-lg">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-sm font-black text-emerald-400">BRAC Bank Ltd.</span>
            </div>
          </div>
        </div>

        {/* 3. 24/7 Official Support Helpdesk Banner */}
        <div className="bg-gradient-to-r from-emerald-900/40 via-slate-800 to-blue-900/40 p-6 md:p-8 rounded-3xl border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Phone className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-black text-white">২৪/৭ অফিসিয়াল হেল্পলাইন ও সাপোর্ট সাপোর্ট ডেস্ক</h3>
            </div>
            <p className="text-xs text-slate-300 max-w-xl">
              যেকোনো প্রশ্ন, পেমেন্ট সংক্রান্ত তথ্য বা সহযোগিতার জন্য আমাদের অফিশিয়াল সাপোর্ট টিমের সাথে সরাসরি হোয়াটসঅ্যাপ বা টেলিগ্রামে যোগাযোগ করুন।
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <a
              href="https://wa.me/8801601499628"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              WhatsApp সাপোর্ট
            </a>
            <a
              href="https://t.me/videarn_official_bd"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              টেলিগ্রাম চ্যানেল
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
