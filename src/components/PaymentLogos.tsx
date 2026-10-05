import React, { useState } from 'react';

interface PaymentLogoProps {
  method: 'bKash' | 'Nagad' | 'Rocket' | 'Upay' | string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const PAYMENT_LOGOS = {
  bkash: 'https://static.freepnglogo.com/images/all_img/1701670291bKash-App-Logo-PNG.png',
  nagad: 'https://static.vecteezy.com/system/resources/thumbnails/068/764/276/small_2x/nagan-logo-mobile-banking-app-icon-transparent-background-free-png.png',
  rocket: 'https://static.vecteezy.com/system/resources/thumbnails/068/706/013/small_2x/rocket-color-logo-mobile-banking-icon-free-png.png',
  upay: 'https://images.seeklogo.com/logo-png/40/1/upay-logo-png_seeklogo-404483.png'
};

// bKash Image Logo Component
export function BKashLogo({ className = 'w-6 h-6', showText = false }: { className?: string; showText?: boolean }) {
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`inline-flex items-center gap-1.5 shrink-0 ${className}`}>
      {!hasError ? (
        <img 
          src={PAYMENT_LOGOS.bkash} 
          alt="bKash Logo" 
          className="w-full h-full object-contain rounded-lg"
          onError={() => setHasError(true)}
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="w-full h-full bg-[#E2136E] text-white rounded-lg flex items-center justify-center font-black text-[10px]">
          bK
        </div>
      )}
      {showText && <span className="font-extrabold tracking-tight text-[#E2136E] font-sans">bKash</span>}
    </div>
  );
}

// Nagad Image Logo Component
export function NagadLogo({ className = 'w-6 h-6', showText = false }: { className?: string; showText?: boolean }) {
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`inline-flex items-center gap-1.5 shrink-0 ${className}`}>
      {!hasError ? (
        <img 
          src={PAYMENT_LOGOS.nagad} 
          alt="Nagad Logo" 
          className="w-full h-full object-contain rounded-lg"
          onError={() => setHasError(true)}
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="w-full h-full bg-[#F7921E] text-white rounded-lg flex items-center justify-center font-black text-[10px]">
          নগদ
        </div>
      )}
      {showText && <span className="font-extrabold tracking-tight text-[#F7921E] font-sans">নগদ</span>}
    </div>
  );
}

// DBBL Rocket Image Logo Component
export function RocketLogo({ className = 'w-6 h-6', showText = false }: { className?: string; showText?: boolean }) {
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`inline-flex items-center gap-1.5 shrink-0 ${className}`}>
      {!hasError ? (
        <img 
          src={PAYMENT_LOGOS.rocket} 
          alt="Rocket Logo" 
          className="w-full h-full object-contain rounded-lg"
          onError={() => setHasError(true)}
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="w-full h-full bg-[#8C3494] text-white rounded-lg flex items-center justify-center font-black text-[10px]">
          রকেট
        </div>
      )}
      {showText && <span className="font-extrabold tracking-tight text-[#8C3494] font-sans">Rocket</span>}
    </div>
  );
}

// Upay Image Logo Component
export function UpayLogo({ className = 'w-6 h-6', showText = false }: { className?: string; showText?: boolean }) {
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`inline-flex items-center gap-1.5 shrink-0 ${className}`}>
      {!hasError ? (
        <img 
          src={PAYMENT_LOGOS.upay} 
          alt="Upay Logo" 
          className="w-full h-full object-contain rounded-lg"
          onError={() => setHasError(true)}
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="w-full h-full bg-[#003566] text-[#FFC300] rounded-lg flex items-center justify-center font-black text-[10px]">
          upay
        </div>
      )}
      {showText && <span className="font-extrabold tracking-tight text-[#003566] font-sans">upay</span>}
    </div>
  );
}

// Master Badge Renderer Component
export default function PaymentLogoBadge({ method, className = 'w-6 h-6', showText = true }: PaymentLogoProps) {
  const normalized = method.toLowerCase();

  if (normalized.includes('bkash') || normalized.includes('বিকাশ')) {
    return (
      <div className="inline-flex items-center gap-1.5 font-bold">
        <BKashLogo className={className} />
        {showText && <span className="text-[#E2136E] font-black">bKash</span>}
      </div>
    );
  }

  if (normalized.includes('nagad') || normalized.includes('নগদ')) {
    return (
      <div className="inline-flex items-center gap-1.5 font-bold">
        <NagadLogo className={className} />
        {showText && <span className="text-[#F7921E] font-black">Nagad</span>}
      </div>
    );
  }

  if (normalized.includes('rocket') || normalized.includes('রকেট')) {
    return (
      <div className="inline-flex items-center gap-1.5 font-bold">
        <RocketLogo className={className} />
        {showText && <span className="text-[#8C3494] font-black">Rocket</span>}
      </div>
    );
  }

  if (normalized.includes('upay') || normalized.includes('উপায়')) {
    return (
      <div className="inline-flex items-center gap-1.5 font-bold">
        <UpayLogo className={className} />
        {showText && <span className="text-[#003566] font-black">upay</span>}
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5 font-bold">
      <BKashLogo className={className} />
      {showText && <span className="text-slate-800 font-bold">{method}</span>}
    </div>
  );
}
