import React, { useState } from 'react';
import { Shield, CheckCircle, Sparkles } from 'lucide-react';

interface Sponsor {
  id: string;
  name: string;
  bnName: string;
  logoUrl: string;
}

export default function SponsorLogos() {
  const [logoErrors, setLogoErrors] = useState<Record<string, boolean>>({});

  const sponsors: Sponsor[] = [
    {
      id: 'pran-rfl',
      name: 'PRAN-RFL Group',
      bnName: 'প্রাণ-আরএফএল গ্রুপ',
      logoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzNg1Hyx9ZOmfkJzlfkm0xT3TUKWkVah_FdYDrq3Q8wg&s=10'
    },
    {
      id: 'unilever',
      name: 'Unilever Bangladesh',
      bnName: 'ইউনিলিভার বাংলাদেশ',
      logoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAoqqzQ_YZ6Xjj4nYet-F4FLTg_UTC9j8jv1jaIIXIpHpjCA9Vbxt-vbk&s'
    },
    {
      id: 'square',
      name: 'Square Pharmaceuticals',
      bnName: 'স্কয়ার ফার্মাসিউটিক্যালস',
      logoUrl: 'https://images.seeklogo.com/logo-png/37/1/square-pharma-logo-png_seeklogo-370216.png'
    },
    {
      id: 'brac-bank',
      name: 'BRAC Bank Limited',
      bnName: 'ব্র্যাক ব্যাংক লিমিটেড',
      logoUrl: 'https://images.seeklogo.com/logo-png/26/2/brac-bank-logo-png_seeklogo-260716.png'
    },
    {
      id: 'robi',
      name: 'Robi Axiata',
      bnName: 'রবি আজিয়াটা',
      logoUrl: 'https://images.seeklogo.com/logo-png/27/1/robi-logo-png_seeklogo-271552.png'
    },
    {
      id: 'renata',
      name: 'Renata Limited',
      bnName: 'রেনাটা লিমিটেড',
      logoUrl: 'https://renata-ltd.com/assets/logoicon-blue-BAKnJa16.png'
    },
    {
      id: 'beximco',
      name: 'Beximco Pharma',
      bnName: 'বেক্সিমকো ফার্মা',
      logoUrl: 'https://medex.com.bd/storage/images/company_logos/u9SEyBHO8Wo45VJaNBaTH2RC6izRy7.png'
    },
    {
      id: 'grameenphone',
      name: 'Grameenphone',
      bnName: 'গ্রামীণফোন',
      logoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8xpsNNPRf6qVogdAOr25rB10Q5zDH7yD6piyXPBglO5532tvzSnnR1aY&s=10'
    },
    {
      id: 'meghna',
      name: 'Meghna Group of Industries',
      bnName: 'মেঘনা গ্রুপ অফ ইন্ডাস্ট্রিজ',
      logoUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/05/Logo_of_Meghna_Group_Of_Industries.svg/1280px-Logo_of_Meghna_Group_Of_Industries.svg.png?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=thumbnail'
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
            Corporate Partners
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
            অফিসিয়াল বাণিজ্যিক স্পন্সর ও মিডিয়া পার্টনার
          </h2>
          
          <p className="text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
            Ads Network BD-এর সাথে বিজ্ঞাপন প্রচারে সরাসরি চুক্তিবদ্ধ দেশের শীর্ষস্থানীয় কর্পোরেট ব্র্যান্ড ও জাতীয় প্রচার সংস্থাসমূহ।
          </p>
        </div>

        {/* Brand Logos Grid with high quality hover styling and fallbacks */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-4 items-stretch justify-center">
          {sponsors.map((sponsor) => {
            const hasError = logoErrors[sponsor.id];
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
                      {sponsor.bnName}
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
            <span>১০০% অনুমোদিত অংশীদারিত্ব: আমাদের সকল বিজ্ঞাপনদাতাদের পেমেন্ট এবং কর্পোরেট ট্যাক্স সরাসরি সরকারি প্রোটোকল মেনে লেনদেন করা হয়।</span>
          </div>
        </div>

      </div>
    </section>
  );
}
