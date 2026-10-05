import React, { useState } from 'react';
import { Menu, X, Wallet, User, ShieldCheck, LogOut } from 'lucide-react';
import BrandLogo from './BrandLogo';
import { useLanguage } from '../context/LanguageContext';

interface HeaderProps {
  user: any;
  onLogout: () => void;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onOpenAdmin: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Header({
  user,
  onLogout,
  onOpenLogin,
  onOpenRegister,
  onOpenAdmin,
  activeTab,
  setActiveTab
}: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { language, toggleLanguage, isBn } = useLanguage();

  const navItems = [
    { id: 'home', label: isBn ? 'হোম' : 'Home' },
    { id: 'how-it-works', label: isBn ? 'কিভাবে কাজ করে' : 'How It Works' },
    { id: 'watch-earn', label: isBn ? 'বিজ্ঞাপন দেখুন' : 'Watch Ads' },
    { id: 'packages', label: isBn ? 'প্যাকেজসমূহ' : 'Packages' },
    { id: 'advertise', label: isBn ? 'বিজ্ঞাপন দিন' : 'Advertise' },
    { id: 'payment-proofs', label: isBn ? 'পেমেন্ট প্রুফ' : 'Payment Proofs' },
    { id: 'trust-legal', label: isBn ? 'আইনি তথ্য' : 'Legal Info' },
    { id: 'rewards', label: isBn ? 'পুরস্কারসমূহ' : 'Rewards' },
    { id: 'faq', label: isBn ? 'জিজ্ঞাসাবাদ' : 'FAQ' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center min-h-[72px] sm:min-h-[80px] py-2 sm:py-2.5">
          {/* Full Brand Logo Presentation */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <a 
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('home');
                const el = document.getElementById('home');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="block cursor-pointer transition-transform hover:scale-[1.02]"
              title="Ads Network Bangladesh"
            >
              <img 
                src="/header-logo.png" 
                alt="Ads Network Bangladesh Logo" 
                className="h-11 sm:h-13 lg:h-15 w-auto max-w-[220px] sm:max-w-[280px] object-contain rounded-md"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "https://lh3.googleusercontent.com/u/0/d/1_UJ83cD4vtuWjYNL38wI86xPylR6ZTgp";
                }}
              />
            </a>
            <span className="hidden xl:inline-block text-[9px] font-black uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-sm font-mono shrink-0">
              {isBn ? 'অফিসিয়াল' : 'OFFICIAL'}
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  const el = document.getElementById(item.id);
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`text-sm font-medium transition-colors whitespace-nowrap cursor-pointer relative py-2 ${
                  activeTab === item.id 
                    ? 'text-[var(--brand-primary-start)] font-bold' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.label}
                {activeTab === item.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--brand-primary-start)] rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Right side Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Desktop Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-black text-slate-700 hover:text-blue-700 hover:border-blue-300 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 rounded-xl transition-all cursor-pointer"
              title={isBn ? "Switch to English" : "বাংলায় পরিবর্তন করুন"}
            >
              <span className="text-sm">{isBn ? "🇺🇸" : "🇧🇩"}</span>
              <span>{isBn ? "EN" : "বাংলা"}</span>
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                {/* Admin Switch */}
                {user.isAdmin && (
                  <button
                    onClick={onOpenAdmin}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition-colors"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {isBn ? 'অ্যাডমিন প্যানেল' : 'Admin Panel'}
                  </button>
                )}

                {/* Balance Widget */}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-lg border border-emerald-100 text-emerald-800">
                  <Wallet className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-bold font-mono">৳{Number(user.balance).toLocaleString()}</span>
                </div>

                {/* User Info & Logout */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold uppercase border border-blue-200 text-xs">
                    {user.username.substring(0, 2)}
                  </div>
                  <button
                    onClick={onLogout}
                    className="p-2 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                    title={isBn ? "লগআউট করুন" : "Logout"}
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={onOpenLogin}
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  {isBn ? 'লগইন' : 'Login'}
                </button>
                <button
                  onClick={onOpenRegister}
                  className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[var(--brand-primary-start)] to-[var(--brand-primary-end)] rounded-xl hover:opacity-95 shadow-md transition-all cursor-pointer whitespace-nowrap"
                >
                  {isBn ? 'শুরু করুন' : 'Get Started'}
                </button>
              </div>
            )}
          </div>

          {/* Mobile actions and hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Mobile Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-black text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg cursor-pointer"
              title={isBn ? "Switch to English" : "বাংলায় পরিবর্তন করুন"}
            >
              <span className="text-xs">{isBn ? "🇺🇸" : "🇧🇩"}</span>
              <span>{isBn ? "EN" : "বাংলা"}</span>
            </button>

            {user && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 rounded-lg text-emerald-800 border border-emerald-100">
                <span className="text-xs font-bold font-mono">৳{Number(user.balance).toLocaleString()}</span>
              </div>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-white border-b border-slate-100 px-4 pt-3 pb-5 space-y-2">
          <div className="pb-3 mb-2 border-b border-slate-100 flex items-center justify-between">
            <a 
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('home');
                setIsOpen(false);
                const el = document.getElementById('home');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="block"
            >
              <img 
                src="/header-logo.png" 
                alt="Ads Network Bangladesh Logo" 
                className="h-10 w-auto max-w-[200px] object-contain rounded-md"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "https://lh3.googleusercontent.com/u/0/d/1_UJ83cD4vtuWjYNL38wI86xPylR6ZTgp";
                }}
              />
            </a>
            <span className="text-[9px] font-black uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-sm font-mono">
              {isBn ? 'অফিসিয়াল' : 'OFFICIAL'}
            </span>
          </div>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsOpen(false);
                const el = document.getElementById(item.id);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`block w-full text-left px-3 py-2 rounded-lg text-base font-semibold ${
                activeTab === item.id 
                  ? 'bg-blue-50 text-[var(--brand-primary-start)]' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <>
                {user.isAdmin && (
                  <button
                    onClick={() => {
                      onOpenAdmin();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-amber-600 rounded-lg hover:bg-amber-700"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    {isBn ? 'অ্যাডমিন প্যানেল' : 'Admin Panel'}
                  </button>
                )}
                <div className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-lg">
                  <span className="text-sm font-semibold text-slate-500">
                    {isBn ? 'লগইন অ্যাকাউন্ট:' : 'Active Account:'}
                  </span>
                  <span className="text-sm font-bold text-slate-800">{user.username}</span>
                </div>
                <button
                  onClick={() => {
                    onLogout();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
                >
                  <LogOut className="w-4 h-4" />
                  {isBn ? 'লগআউট করুন' : 'Logout'}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    onOpenLogin();
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-2.5 text-center text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-lg"
                >
                  {isBn ? 'লগইন' : 'Login'}
                </button>
                <button
                  onClick={() => {
                    onOpenRegister();
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-2.5 text-center text-sm font-bold text-white bg-gradient-to-r from-[var(--brand-primary-start)] to-[var(--brand-primary-end)] rounded-lg shadow-md"
                >
                  {isBn ? 'শুরু করুন' : 'Get Started'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
