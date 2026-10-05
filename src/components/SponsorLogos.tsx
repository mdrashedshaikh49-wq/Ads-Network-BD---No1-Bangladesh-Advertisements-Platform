import React, { useState } from 'react';
import { Shield, CheckCircle, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface Sponsor {
  id: string;
  name: string;
  bnName: string;
  logoUrl: string;
}

export default function SponsorLogos() {
  const [logoErrors, setLogoErrors] = useState<Record<string, boolean>>({});
  const { isBn } = useLanguage();

  const sponsors: Sponsor[] = [
    {
      id: 'pran-rfl',
      name: 'PRAN-RFL Group',
      bnName: 'প্রাণ-আরএফএল গ্রুপ',
      logoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJfC2p7GySdCQjjR_JrjnZvTpuVTyLHogN1Lfu2u0Ayw&s=10'
    },
    {
      id: 'unilever',
      name: 'Unilever Bangladesh',
      bnName: 'ইউনিলিভার বাংলাদেশ',
      logoUrl: 'https://images.seeklogo.com/logo-png/14/1/unilever-logo-png_seeklogo-145123.png'
    },
    {
      id: 'bashundhara',
      name: 'Bashundhara Group',
      bnName: 'বসুন্ধরা গ্রুপ',
      logoUrl: 'https://images.seeklogo.com/logo-png/43/1/bashundhara-group-logo-png_seeklogo-433144.png'
    },
    {
      id: 'aci',
      name: 'ACI Group',
      bnName: 'এসিআই লিমিটেড',
      logoUrl: 'https://vectorseek.com/wp-content/uploads/2023/07/Aci-Group-Logo-Vector.svg-.png'
    },
    {
      id: 'square',
      name: 'Square Group',
      bnName: 'স্কয়ার গ্রুপ',
      logoUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c1/Seal_of_Square_Group.svg/1280px-Seal_of_Square_Group.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail'
    },
    {
      id: 'walton',
      name: 'Walton BD',
      bnName: 'ওয়ালটন বিডি',
      logoUrl: 'https://images.seeklogo.com/logo-png/25/2/walton-logo-png_seeklogo-251022.png'
    },
    {
      id: 'akij',
      name: 'Akij Group',
      bnName: 'আকিজ গ্রুপ',
      logoUrl: 'https://thumb.wikimedia.org/wikipedia/en/thumb/a/a7/Akij_Group_logo.svg/960px-Akij_Group_logo.svg.png?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=thumbnail'
    },
    {
      id: 'meghna',
      name: 'Meghna Group of Industries',
      bnName: 'মেঘনা গ্রুপ অফ ইন্ডাস্ট্রিজ',
      logoUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/05/Logo_of_Meghna_Group_Of_Industries.svg/1280px-Logo_of_Meghna_Group_Of_Industries.svg.png?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=thumbnail'
    },
    {
      id: 'grameenphone',
      name: 'Grameenphone',
      bnName: 'গ্রামীণফোন',
      logoUrl: 'https://images.seeklogo.com/logo-png/24/1/grameenphone-logo-png_seeklogo-249793.png'
    },
    {
      id: 'bkash',
      name: 'bKash Limited',
      bnName: 'বিকাশ লিমিটেড',
      logoUrl: 'https://images.seeklogo.com/logo-png/27/1/bkash-logo-png_seeklogo-273684.png'
    }
  ];

  const handleLogoError = (id: string) => {
    setLogoErrors((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section className="py-16 bg-white border-t border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-800 rounded-full border border-blue-100 text-xs font-black uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5 text-blue-700" />
            {isBn ? 'Corporate Partners' : 'Our Media Partners'}
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
            {isBn ? 'অফিসিয়াল বাণিজ্যিক স্পন্সর ও মিডিয়া পার্টনার' : 'Official Commercial Sponsors & Media Partners'}
          </h2>
          
          <p className="text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
            {isBn 
              ? 'Ads Network BD-এর সাথে বিজ্ঞাপন প্রচারে সরাসরি চুক্তিবদ্ধ দেশের শীর্ষস্থানীয় কর্পোরেট ব্র্যান্ড ও জাতীয় প্রচার সংস্থাসমূহ।' 
              : 'Leading corporate brands and national broadcasters directly contracted for ad campaigns with Ads Network BD.'}
          </p>
        </div>

        {/* Brand Logos Grid with high quality hover styling and fallbacks */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-10 gap-4 items-stretch justify-center">
          {sponsors.map((sponsor) => {
            const hasError = logoErrors[sponsor.id];
            const displayName = isBn ? sponsor.bnName : sponsor.name;
            return (
              <div
                key={sponsor.id}
                className="bg-slate-50 hover:bg-white p-4 rounded-2xl border border-slate-100/80 hover:border-slate-300 hover:shadow-xl hover:scale-[1.04] transition-all duration-300 flex flex-col items-center justify-center min-h-[90px] text-center cursor-pointer group relative"
                title={`${sponsor.name} - ${sponsor.bnName}`}
              >
                {hasError ? (
                  /* High Fidelity CSS Text Fallback if Image Fails or is Blocked */
                  <div className="flex flex-col items-center justify-center space-y-1">
                    <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight group-hover:text-blue-700 transition-colors">
                      {sponsor.name.split(' ')[0]}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400">
                      {displayName}
                    </span>
                  </div>
                ) : (
                  <img
                    src={sponsor.logoUrl}
                    alt={sponsor.name}
                    referrerPolicy="no-referrer"
                    onError={() => handleLogoError(sponsor.id)}
                    className="max-h-11 max-w-[100px] object-contain group-hover:brightness-110 filter brightness-95 contrast-100 transition-all duration-300"
                  />
                )}
                
                {/* Micro Verified Check Badge on Hover */}
                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <CheckCircle className="w-3 h-3 text-blue-600 fill-blue-50" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Partnership Notice */}
        <div className="mt-8 flex justify-center">
          <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-2xl inline-flex items-center gap-2 text-[11px] sm:text-xs text-emerald-950 font-bold leading-normal">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>
              {isBn 
                ? '১০০% অনুমোদিত অংশীদারিত্ব: আমাদের সকল বিজ্ঞাপনদাতাদের পেমেন্ট এবং কর্পোরেট ট্যাক্স সরাসরি সরকারি প্রোটোকল মেনে লেনদেন করা হয়।' 
                : '100% Verified Partnership: All client payments and corporate taxes are directly processed in adherence with government legal protocols.'}
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
