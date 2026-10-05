import React, { useState } from 'react';
import { ChevronDown, MessageSquare, AlertCircle, PhoneCall, HelpCircle, ShieldCheck, Mail, Heart, Send, Youtube, Facebook, Instagram } from 'lucide-react';
import BrandLogo from './BrandLogo';
import { useLanguage } from '../context/LanguageContext';

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

interface Activity {
  id: string;
  maskedName: string;
  type: string;
  amount: number;
  videoTitle: string;
  status: string;
  time: string;
}

interface FaqsAndFooterProps {
  faqs: FAQ[];
  recentActivities: Activity[];
  tickerActive: boolean;
  onOpenRegister: () => void;
  onStartWatching: () => void;
}

export default function FaqsAndFooter({
  faqs,
  recentActivities,
  tickerActive,
  onOpenRegister,
  onStartWatching
}: FaqsAndFooterProps) {
  // FAQ accordion open states
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const { isBn } = useLanguage();

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  // Helper dictionary for standard FAQ translation fallbacks
  const getFaqTrans = (faq: FAQ) => {
    const isFirst = faq.id === 'faq-1' || faq.question.includes('কিভাবে ভিডিও');
    const isSecond = faq.id === 'faq-2' || faq.question.includes('সিকিউর ট্র্যাকিং');
    
    if (!isBn) {
      if (isFirst) {
        return {
          question: 'How do I start earning money watching videos?',
          answer: 'Register a free account, log in, browse the video gallery, click "Start Watching", let the 30-second timer count down, then click "Claim Reward". The funds will instantly credit to your wallet.'
        };
      }
      if (isSecond) {
        return {
          question: 'How does server-side secure verification protect my earnings?',
          answer: 'When you start watching an ad, the server initiates a secure encrypted session. Early browser closures, tab switches, or automated script claims fail verification, protecting authentic advertisers and earners.'
        };
      }
      return { question: faq.question, answer: faq.answer };
    }
    return { question: faq.question, answer: faq.answer };
  };

  return (
    <div className="space-y-0">
      
      {/* WHY CHOOSE US TRUST SECTION */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-sm font-bold text-[var(--brand-primary-start)] uppercase tracking-wider">
              {isBn ? 'কেন আমরা সেরা' : 'WHY CHOOSE US'}
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
              {isBn ? 'আমাদের প্ল্যাটফর্মের অনন্য সুবিধাসমূহ' : 'Unmatched Platform Advantages'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
            {[
              {
                title: isBn ? 'সহজ ও নিখুঁত প্রক্রিয়া' : 'Seamless Mobile Experience',
                desc: isBn 
                  ? 'যেকোনো ডিভাইস থেকে মোবাইল ফ্রিল্যান্সিং এর মাধ্যমে খুব সহজেই ভিডিও দেখে আয়ের সুবিধা।' 
                  : 'Start watching commercial video advertisements easily on any smartphone or tablet device.'
              },
              {
                title: isBn ? '১০০% স্বচ্ছ রিওয়ার্ড' : '100% Transparent Rewards',
                desc: isBn 
                  ? 'প্রতিটি টাস্কের রিওয়ার্ড মূল্য ও সময়সীমা সর্বদা স্পষ্টভাবে প্রদর্শিত এবং সার্ভার দ্বারা ভেরিফাইড।' 
                  : 'All video reward rates, durations, and payment breakdowns are transparently verified on-chain.'
              },
              {
                title: isBn ? 'নিরাপদ অ্যাকাউন্ট ও লেনদেন' : 'Secure Account Ledger',
                desc: isBn 
                  ? 'উন্নত নিরাপত্তা প্রোটোকলের সাহায্যে আপনার ডেটা এবং পেমেন্ট ট্রানজেকশন সর্বদা সুরক্ষিত রাখা হয়।' 
                  : 'Highest security protocols protecting member details, deposit transactions, and cash withdrawals.'
              },
              {
                title: isBn ? '২৪/৭ গ্রাহক সেবা' : '24/7 Dedicated Support',
                desc: isBn 
                  ? 'যেকোনো প্রকার জিজ্ঞাসা বা পেমেন্ট সংক্রান্ত সহায়তায় আমাদের এক্সপার্ট টিম সবসময় প্রস্তুত।' 
                  : 'Access helpful custom support agents via direct live chat, WhatsApp, or Telegram 24/7.'
              }
            ].map((item, idx) => (
              <div key={idx} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-between">
                <h4 className="text-sm font-extrabold text-slate-900">{item.title}</h4>
                <p className="text-xs text-slate-500 mt-2.5 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* RECENT REWARD ACTIVITIES (SCROLLING TICKER) */}
      {tickerActive && recentActivities && recentActivities.length > 0 && (
        <section className="bg-slate-900 text-white py-8 border-y border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <h3 className="text-xs font-black tracking-wider uppercase text-slate-400">
                {isBn ? 'লাইভ পেমেন্ট ও রিওয়ার্ড কার্যক্রম (Live Feed)' : 'LIVE PAYOUT & REWARD ACTIVITY FEED'}
              </h3>
            </div>
            
            {/* Horizontal Scroll ticker */}
            <div className="relative overflow-hidden w-full py-1">
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none whitespace-nowrap justify-start lg:justify-center">
                {recentActivities.map((act) => (
                  <div 
                    key={act.id}
                    className="inline-flex items-center gap-2.5 bg-slate-800 px-3.5 py-2 rounded-xl border border-slate-700/50 text-[10px]"
                  >
                    <span className="font-mono text-slate-300 font-bold">{act.maskedName}</span>
                    <span className="px-1.5 py-0.5 rounded-[4px] text-[8px] bg-slate-900 text-slate-400 uppercase tracking-wider">
                      {act.type === 'video' ? (isBn ? '🎬 ভিডিও ওয়াচ' : '🎬 Ads Watched') : (isBn ? '🏦 মোবাইল উইথড্র' : '🏦 Withdrawal')}
                    </span>
                    <span className="text-slate-500">·</span>
                    <span className={`font-mono font-black ${act.type === 'withdrawal' ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {act.type === 'withdrawal' ? '-' : '+'}৳{act.amount}
                    </span>
                    <span className="text-[9px] text-slate-500 font-mono">
                      ({isBn ? (act.time.split(' ')[1] || 'সদ্য') : 'just now'})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FAQ SECTION */}
      <section id="faq" className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          
          <div className="text-center mb-12">
            <span className="text-sm font-bold text-[var(--brand-primary-start)] uppercase tracking-wider">
              {isBn ? 'সহায়তা কেন্দ্র' : 'HELP CENTER'}
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
              {isBn ? 'সাধারণ জিজ্ঞাসা (FAQ)' : 'Frequently Asked Questions (FAQ)'}
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              {isBn 
                ? 'Ads Network BD প্ল্যাটফর্ম সম্পর্কে আপনাদের সচরাচর জানতে চাওয়া প্রশ্নের উত্তরসমূহ নিচে দেওয়া হল।' 
                : 'Find quick, verified answers to common questions about Ads Network BD here.'}
            </p>
          </div>

          <div className="space-y-3 text-left">
            {faqs.map((faq) => {
              const isOpen = openFaq === faq.id;
              const trans = getFaqTrans(faq);
              return (
                <div 
                  key={faq.id}
                  className="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/50"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full flex justify-between items-center p-5 text-sm font-bold text-slate-800 hover:text-slate-950 transition-colors text-left cursor-pointer"
                  >
                    <span>{trans.question}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-50 bg-white">
                      {trans.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* CALL TO ACTION (CTA) */}
      <section className="py-16 bg-gradient-to-tr from-[var(--brand-primary-start)] to-[var(--brand-primary-end)] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-black/10 rounded-full filter blur-3xl" />

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10 space-y-6">
          <h2 className="text-3xl md:text-4xl font-black leading-tight text-wrap">
            {isBn ? 'তাহলে আর দেরি কেন? আজই আপনার ভিডিও দেখে আয় শুরু করুন!' : 'Why wait? Start Watching Ads & Earning BDT Today!'}
          </h2>
          <p className="text-sm md:text-base text-white/90 max-w-xl mx-auto leading-relaxed">
            {isBn 
              ? 'মাত্র এক মিনিটে একটি অ্যাকাউন্ট তৈরি করুন, আপনার পছন্দের ভিডিও ওয়াচ করা শুরু করুন এবং সরাসরি বিকাশ ও নগদ ওয়ালেটে পেমেন্ট বুঝে নিন।' 
              : 'Create a free account in under 60 seconds, start watching corporate TVCs, and request instant payouts to your bKash or Nagad wallet.'}
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center pt-2">
            <button
              onClick={onOpenRegister}
              className="px-8 py-3.5 text-sm font-black text-[var(--brand-primary-start)] bg-white hover:bg-slate-100 rounded-xl shadow-lg transition-all cursor-pointer"
            >
              {isBn ? 'ফ্রি অ্যাকাউন্ট খুলুন' : 'Create Free Account'}
            </button>
            <button
              onClick={onStartWatching}
              className="px-8 py-3.5 text-sm font-black text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-lg transition-all cursor-pointer"
            >
              {isBn ? 'ভিডিও দেখা শুরু করুন' : 'Start Watching Ads'}
            </button>
          </div>
        </div>
      </section>

      {/* COMPREHENSIVE local MULTI-COLUMN BENGALI FOOTER */}
      <footer className="bg-slate-950 text-slate-400 pt-16 pb-8 border-t border-slate-900 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-5 gap-8 mb-12 text-left">
          
          {/* Brand Col */}
          <div className="col-span-2 space-y-4">
            <a 
              href="https://web.facebook.com/share/p/1DfoawZRJ1/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white px-3.5 py-2.5 rounded-2xl inline-flex items-center justify-center max-w-[220px] shadow-sm border border-slate-200 transition-transform hover:scale-[1.02]"
              title="Ads Network Bangladesh Facebook Page"
            >
              <img 
                src="/header-logo.png" 
                alt="Ads Network Bangladesh Logo" 
                className="h-8 w-auto object-contain rounded-md"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "https://lh3.googleusercontent.com/u/0/d/1_UJ83cD4vtuWjYNL38wI86xPylR6ZTgp";
                }}
              />
            </a>
            <p className="text-[11px] leading-relaxed text-slate-400 max-w-xs">
              {isBn 
                ? 'Ads Network Bangladesh হলো দেশের ১০০০+ শীর্ষ কর্পোরেট ব্র্যান্ডের অনুমোদিত বাণিজ্যিক ভিডিও বিজ্ঞাপন ও রিওয়ার্ড ইনকাম প্ল্যাটফর্ম।' 
                : 'Ads Network Bangladesh is the leading corporate commercial ad monetization exchange platform with over 1000+ active sponsors.'}
            </p>
            <div className="flex items-center gap-2">
              <a 
                href="https://web.facebook.com/share/p/1DfoawZRJ1/"
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 flex items-center justify-center transition-transform hover:scale-110 border border-slate-800"
                title="Facebook Page"
              >
                <img 
                  src="https://thumb.wikimedia.org/wikipedia/en/thumb/0/04/Facebook_f_logo_%282021%29.svg/960px-Facebook_f_logo_%282021%29.svg.png?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=thumbnail&_=20210818083032" 
                  alt="Facebook" 
                  className="w-4 h-4 object-contain" 
                />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 flex items-center justify-center transition-transform hover:scale-110 border border-slate-800"
                title="Instagram Profile"
              >
                <img 
                  src="https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/250px-Instagram_logo_2016.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail&_=20210403190622" 
                  alt="Instagram" 
                  className="w-4 h-4 object-contain" 
                />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 flex items-center justify-center transition-transform hover:scale-110 border border-slate-800"
                title="YouTube Channel"
              >
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/e/ef/Youtube_logo.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original" 
                  alt="YouTube" 
                  className="w-4 h-4 object-contain" 
                />
              </a>
              <a 
                href="https://tiktok.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 flex items-center justify-center transition-transform hover:scale-110 border border-slate-800"
                title="TikTok Account"
              >
                <img 
                  src="https://static.freepnglogo.com/images/all_img/1691751088logo-tiktok-png.png" 
                  alt="TikTok" 
                  className="w-4 h-4 object-contain" 
                />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-white tracking-wider uppercase">
              {isBn ? 'দ্রুত লিঙ্ক' : 'QUICK LINKS'}
            </h4>
            <ul className="space-y-2 text-[11px] text-slate-400">
              <li><a href="#home" className="hover:text-white transition-colors">{isBn ? 'হোমপেজ' : 'Homepage'}</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">{isBn ? 'কিভাবে কাজ করে' : 'How It Works'}</a></li>
              <li><a href="#watch-earn" className="hover:text-white transition-colors">{isBn ? 'বিজ্ঞাপন গ্যালারি' : 'Watch & Earn'}</a></li>
              <li><a href="#packages" className="hover:text-white transition-colors">{isBn ? 'মেম্বারশিপ প্যাকেজ' : 'Membership Packages'}</a></li>
              <li><a href="#advertise" className="hover:text-white transition-colors">{isBn ? 'বিজ্ঞাপনদাতা হাব' : 'Advertiser Studio'}</a></li>
              <li><a href="#payment-proofs" className="hover:text-white transition-colors">{isBn ? 'পেমেন্ট প্রুফ গ্যালারি' : 'Payment Proofs'}</a></li>
              <li><a href="#trust-legal" className="hover:text-white transition-colors">{isBn ? 'সরকারি আইনি রেজিস্ট্রেশন' : 'Government Registration'}</a></li>
              <li><a href="#rewards" className="hover:text-white transition-colors">{isBn ? 'ওয়ালেট রিওয়ার্ড' : 'Wallet Rewards'}</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">{isBn ? 'জিজ্ঞাসাবাদ (FAQ)' : 'FAQ Assist'}</a></li>
            </ul>
          </div>

          {/* Column 3: Legal & safety */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-white tracking-wider uppercase">
              {isBn ? 'আইনি নীতিমালা' : 'LEGAL REGULATION'}
            </h4>
            <ul className="space-y-2 text-[11px] text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">{isBn ? 'ব্যবহারের শর্তাবলী' : 'Terms of Service'}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{isBn ? 'গোপনীয়তা নীতি' : 'Privacy Policy'}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{isBn ? 'রিওয়ার্ড পলিসি' : 'Viewer Reward Policy'}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{isBn ? 'ঝুঁকি ও সচেতনতা' : 'Safety and Risk warning'}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{isBn ? 'দায়মুক্তি (Disclaimer)' : 'Legal Disclaimer'}</a></li>
            </ul>
          </div>

          {/* Column 4: Customer Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-white tracking-wider uppercase">
              {isBn ? 'গ্রাহক সহায়তা' : 'SUPPORT HUB'}
            </h4>
            <div className="space-y-2 text-[11px] text-slate-400">
              <p className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                support@adwatchearn.com.bd
              </p>
              <p className="flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                +৮৮০ ১৭১২ ৩৪৫৬৭৮
              </p>
              <a 
                href="https://t.me/Ads_NetworkBangladesh"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-white transition-colors text-sky-400 font-bold"
              >
                <Send className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                {isBn ? 'টেলিগ্রাম অফিসিয়াল গ্রুপ' : 'Telegram Support Chat'}
              </a>
              <p className="text-[10px] text-slate-500 pt-1 leading-relaxed">
                {isBn ? 'অফিস আওয়ার: সকাল ৯:০০ - রাত ৮:০০' : 'Office hours: 9:00 AM - 8:00 PM BDT'}
              </p>
            </div>
          </div>

        </div>

        {/* Footer bottom */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500 text-[10px] text-center">
          <p>© {new Date().getFullYear()} Ads Network BD. {isBn ? 'সর্বস্বত্ব সংরক্ষিত।' : 'All rights reserved.'}</p>
          <p className="flex items-center gap-1">
            {isBn ? 'মেইড ইন বাংলাদেশ উইথ' : 'Made in Bangladesh with'} <Heart className="w-3 h-3 text-red-500 fill-red-500" /> {isBn ? 'নির্ভরযোগ্য অনলাইন আর্নিং' : 'Trusted online earnings'}
          </p>
        </div>
      </footer>

    </div>
  );
}
