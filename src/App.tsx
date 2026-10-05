import React, { useState, useEffect } from 'react';
import { Home, Play, Wallet, User, ShieldCheck, Lock, Smartphone, RefreshCw, X, Clock, Sparkles, CheckCircle, TrendingUp, AlertCircle, ArrowRight, Gift, Zap, Check } from 'lucide-react';
import Header from './components/Header';
import Hero from './components/Hero';
import WatchSection from './components/WatchSection';
import PackagesSection from './components/PackagesSection';
import WalletDashboard from './components/WalletDashboard';
import AdvertiserSection from './components/AdvertiserSection';
import PaymentProofGallery from './components/PaymentProofGallery';
import FaqsAndFooter from './components/FaqsAndFooter';
import AdminPanel from './components/AdminPanel';
import RealTimeEarningsTicker from './components/RealTimeEarningsTicker';
import BrandLogo from './components/BrandLogo';
import TelegramFloatingChat from './components/TelegramFloatingChat';
import SponsorLogos from './components/SponsorLogos';
import { signInWithGoogle, logoutGoogle, checkRedirectResult } from './utils/firebaseAuth';

export const PACKAGE_DAILY_LIMITS: Record<string, { name: string; limit: number; rewardPerVideo: number }> = {
  starter: { name: 'Starter', limit: 1, rewardPerVideo: 50 },
  basic: { name: 'Basic', limit: 2, rewardPerVideo: 50 },
  standard: { name: 'Standard', limit: 5, rewardPerVideo: 50 },
  silver: { name: 'Silver', limit: 8, rewardPerVideo: 50 },
  gold: { name: 'Gold', limit: 12, rewardPerVideo: 50 },
  platinum: { name: 'Platinum', limit: 20, rewardPerVideo: 50 },
  diamond: { name: 'Diamond', limit: 40, rewardPerVideo: 50 },
  elite: { name: 'Elite', limit: 50, rewardPerVideo: 50 },
  Free: { name: 'Free Trial', limit: 10, rewardPerVideo: 10 }
};

export const INITIAL_VIDEOS = [
  {
    id: "vid-1",
    title: "Wi-Fi ১টাই, সারাদেশে gpfi | গ্রামীণফোন Wireless Broadband",
    category: "Telecom",
    duration: 30,
    reward: 100,
    url: "https://youtu.be/0B2MieWr4rE?si=UgtbkInRGWwvEZkN",
    thumbnail: "https://img.youtube.com/vi/0B2MieWr4rE/hqdefault.jpg",
    description: "Grameenphone-এর অফিসিয়াল gpfi ওয়্যারলেস ব্রডব্যান্ড কমার্শিয়াল বিজ্ঞাপনটি ৩০ সেকেন্ড মনোযোগ সহকারে দেখুন এবং নিশ্চিত ৳১০০ রিওয়ার্ড ওয়ালেটে গ্রহণ করুন।",
    available: true,
    share_count: 142
  },
  {
    id: "vid-2",
    title: "বাংলাদেশের Fastest মোবাইল নেটওয়ার্ক | Grameenphone 4G TVC",
    category: "Telecom",
    duration: 30,
    reward: 100,
    url: "https://youtu.be/aMf_QUMzW7M?si=w7XFWOxjXHh8-59g",
    thumbnail: "https://img.youtube.com/vi/aMf_QUMzW7M/hqdefault.jpg",
    description: "গ্রামীণফোন বাংলাদেশের দ্রুততম মোবাইল নেটওয়ার্ক অফিসিয়াল ক্যাম্পেইন বিজ্ঞাপনটি দেখুন এবং রিওয়ার্ড ক্লেইম করুন।",
    available: true,
    share_count: 98
  },
  {
    id: "vid-3",
    title: "বাংলালিংক FASTEST 4G তে থাকুন সবচেয়ে এগিয়ে! | Banglalink 4G",
    category: "Telecom",
    duration: 30,
    reward: 100,
    url: "https://youtu.be/ckSLkQaZ1F8?si=LDgheEfHIW7uNh4H",
    thumbnail: "https://img.youtube.com/vi/ckSLkQaZ1F8/hqdefault.jpg",
    description: "বাংলালিংক ডিজিটাল ৪জি নেটওয়ার্ক স্পন্সরড ভিডিও বিজ্ঞাপনটি ৩০ সেকেন্ড দেখুন ও ৳১০০ ইনকাম করুন।",
    available: true,
    share_count: 230
  },
  {
    id: "vid-4",
    title: "টানা ৩ বার বাংলালিংক দেশের FASTEST মোবাইল নেটওয়ার্ক! | Banglalink",
    category: "Telecom",
    duration: 30,
    reward: 100,
    url: "https://youtu.be/i9yG05uhrbw?si=SUOurZkSFLsXrEDu",
    thumbnail: "https://img.youtube.com/vi/i9yG05uhrbw/hqdefault.jpg",
    description: "টানা তিনবার দেশের দ্রুততম নেটওয়ার্ক বাংলালিংকের আকর্ষণীয় অফার সম্পর্কিত বিজ্ঞাপনটি দেখুন।",
    available: true,
    share_count: 85
  },
  {
    id: "vid-5",
    title: "RFL Winner Hotpot BD Commercial | আরএফএল উইনার হটপট",
    category: "Home & Appliances",
    duration: 30,
    reward: 100,
    url: "https://youtu.be/geN2cLjGqkk?si=p4rmgGhV5HyoPZbeHyoPZbe",
    thumbnail: "https://img.youtube.com/vi/geN2cLjGqkk/hqdefault.jpg",
    description: "জনপ্রিয় আরএফএল উইনার হটপট কিচেনওয়্যার কমার্শিয়াল বিজ্ঞাপনটি ৩০ সেকেন্ড দেখুন এবং ইনস্ট্যান্ট ব্যালেন্স যোগ করুন।",
    available: true,
    share_count: 119
  },
  {
    id: "vid-6",
    title: "Surf Excel Tez | সার্ফ এক্সেল বিরিয়ানি দাগ দূর করার বিশেষ বিজ্ঞাপন",
    category: "FMCG",
    duration: 30,
    reward: 100,
    url: "https://youtu.be/JbKVuQoe8BM?si=4J6wy9lSJSyIvUb2",
    thumbnail: "https://img.youtube.com/vi/JbKVuQoe8BM/hqdefault.jpg",
    description: "সার্ফ এক্সেল তেজ ডিটারজেন্ট পাউডার কমার্শিয়াল টিভিসি বিজ্ঞাপনটি দেখুন এবং রিওয়ার্ড পয়েন্ট নিন।",
    available: true,
    share_count: 174
  },
  {
    id: "vid-7",
    title: "Coca-Cola Bangladesh | কোকাকোলা ব্যাচেলর পয়েন্ট এক্সক্লুসিভ অ্যাড",
    category: "Beverages",
    duration: 30,
    reward: 100,
    url: "https://youtu.be/ygzk3GmiPKI?si=c26VgqwZaJ134Eq3",
    thumbnail: "https://img.youtube.com/vi/ygzk3GmiPKI/hqdefault.jpg",
    description: "কোকাকোলা বাংলাদেশ এবং ব্যাচেলর পয়েন্ট টিমের চমৎকার রিফ্রেশিং ভিডিও বিজ্ঞাপনটি সম্পূর্ণ উপভোগ করুন।",
    available: true,
    share_count: 210
  },
  {
    id: "vid-8",
    title: "Alpenliebe Juzt Jelly - Jelly Bottles TV Ad | আল্পেনলিবে জেলি",
    category: "Confectionery",
    duration: 30,
    reward: 100,
    url: "https://youtu.be/Ww9lnZwQG2Y?si=L4Ct-IUCNh1iqv6F",
    thumbnail: "https://img.youtube.com/vi/Ww9lnZwQG2Y/hqdefault.jpg",
    description: "আল্পেনলিবে জাস্ট জেলি বোটলসের মজাদার অ্যানিমেটেড ও লাইভ বিজ্ঞাপনটি দেখে ক্যাশ রিওয়ার্ড ক্লেইম করুন।",
    available: true,
    share_count: 88
  },
  {
    id: "vid-9",
    title: "Taaza Bangladesh Airport TVC | তাজা চা সতেজতার বিশেষ বিজ্ঞাপন",
    category: "Beverages",
    duration: 30,
    reward: 100,
    url: "https://youtu.be/4vMrbbrF6V0?si=X5bAZVv_v3QEwXdd",
    thumbnail: "https://img.youtube.com/vi/4vMrbbrF6V0/hqdefault.jpg",
    description: "ব্রুক বন্ড তাজা চা-এর জনপ্রিয় এয়ারপোর্ট থিম কমার্শিয়াল বিজ্ঞাপনটি ৩০ সেকেন্ড দেখে ইনকাম করুন।",
    available: true,
    share_count: 156
  },
  {
    id: "vid-10",
    title: "Bashundhara Toiletries X Rangpur Riders | BPL T20 স্পন্সরড টিভিসি",
    category: "Personal Care",
    duration: 30,
    reward: 100,
    url: "https://youtu.be/DT7HItmDujU?si=FV-H2kz1Wl2iGTPQ",
    thumbnail: "https://img.youtube.com/vi/DT7HItmDujU/hqdefault.jpg",
    description: "বসুন্ধরা টয়লেট্রিজ ও রংপুর রাইডার্স বিপিএল স্পেশাল আকর্ষণীয় ভিডিও বিজ্ঞাপনটি দেখুন এবং নিশ্চিত বোনাস উপভোগ করুন।",
    available: true,
    share_count: 134,
    isPaidOnly: false,
    hideFromHome: false
  },
  // 13 EXCLUSIVE PAID PLAN VIDEOS (Hidden from homepage, strictly for paid subscribers)
  {
    id: "paid-vid-1",
    title: "Bashundhara Toiletries X Rangpur Riders | ফুরফুরে মনে জয়ের লড়াইয়ে | BPL t20",
    category: "Personal Care",
    duration: 30,
    reward: 100,
    url: "https://youtu.be/DT7HItmDujU?si=0V7CANlmHh9yQhXx",
    thumbnail: "https://img.youtube.com/vi/DT7HItmDujU/hqdefault.jpg",
    description: "বসুন্ধরা টয়লেট্রিজ ও রংপুর রাইডার্স বিপিএল স্পেশাল আকর্ষণীয় ভিডিও বিজ্ঞাপনটি দেখুন এবং নিশ্চিত বোনাস উপভোগ করুন।",
    available: true,
    share_count: 185,
    isPaidOnly: true,
    hideFromHome: true
  },
  {
    id: "paid-vid-2",
    title: "বসুন্ধরা টিস্যু \"অশুদ্ধতার বিরুদ্ধে এক বিন্দুও ছাড় নয়!\"",
    category: "FMCG",
    duration: 30,
    reward: 100,
    url: "https://youtu.be/ciSNE4oQPag?si=y_jWwgg4ft6FEj1x",
    thumbnail: "https://img.youtube.com/vi/ciSNE4oQPag/hqdefault.jpg",
    description: "বসুন্ধরা টিস্যুর প্রিমিয়াম অফিশিয়াল বিজ্ঞাপনটি মনোযোগ দিয়ে দেখুন এবং রিওয়ার্ড পয়েন্ট গ্রহণ করুন।",
    available: true,
    share_count: 140,
    isPaidOnly: true,
    hideFromHome: true
  },
  {
    id: "paid-vid-3",
    title: "Bashundhara Fortified Soybean Oil | রান্না হোক শুদ্ধতম তেলে",
    category: "Food & Cooking",
    duration: 30,
    reward: 100,
    url: "https://youtu.be/7mebjxIl-tE?si=eKl4NEROUNL94Tcq",
    thumbnail: "https://img.youtube.com/vi/7mebjxIl-tE/hqdefault.jpg",
    description: "বসুন্ধরা ফর্টিফাইড সয়াবিন তেলের অফিশিয়াল স্পনসরড কমার্শিয়াল টিভিসি বিজ্ঞাপনটি দেখুন।",
    available: true,
    share_count: 162,
    isPaidOnly: true,
    hideFromHome: true
  },
  {
    id: "paid-vid-4",
    title: "SEYLON Gold Tea Commercial TVC | সিলন গোল্ড চা",
    category: "Beverages",
    duration: 30,
    reward: 100,
    url: "https://youtu.be/Y4BwkW6jPLU?si=-H24M9MP9VDy6JJh",
    thumbnail: "https://img.youtube.com/vi/Y4BwkW6jPLU/hqdefault.jpg",
    description: "সিলন গোল্ড টি-এর মনমুগ্ধকর অরিজিনাল কমার্শিয়াল ভিডিওটি উপভোগ করুন এবং রিওয়ার্ড পান।",
    available: true,
    share_count: 120,
    isPaidOnly: true,
    hideFromHome: true
  },
  {
    id: "paid-vid-5",
    title: "Vikram Kadak Dust Tea Commercial | বিক্রম কড়ক ডাস্ট চা",
    category: "Beverages",
    duration: 30,
    reward: 100,
    url: "https://youtu.be/PiqEuAf0tN0?si=uh4GFhSZMmXlASty",
    thumbnail: "https://img.youtube.com/vi/PiqEuAf0tN0/hqdefault.jpg",
    description: "বিক্রম কড়ক ডাস্ট টি-এর জনপ্রিয় টিভি বিজ্ঞাপনটি দেখুন এবং আপনার ওয়ালেট ব্যালেন্স বাড়ান।",
    available: true,
    share_count: 195,
    isPaidOnly: true,
    hideFromHome: true
  },
  {
    id: "paid-vid-6",
    title: "Tata Tea Gold – Khutkhutey Bengalis’ Favorite Tea | টাটা টি গোল্ড",
    category: "Beverages",
    duration: 30,
    reward: 100,
    url: "https://youtu.be/41chqJCV8dY?si=xK7JZjJtmVU2vV4N",
    thumbnail: "https://img.youtube.com/vi/41chqJCV8dY/hqdefault.jpg",
    description: "টাটা টি গোল্ড স্পন্সরড অফিশিয়াল বিজ্ঞাপনটি ৩০ সেকেন্ড সম্পূর্ণ উপভোগ করুন।",
    available: true,
    share_count: 154,
    isPaidOnly: true,
    hideFromHome: true
  },
  {
    id: "paid-vid-7",
    title: "Tata Tea Premium Care - Natural Ingredients | টাটা টি প্রিমিয়াম কেয়ার",
    category: "Beverages",
    duration: 30,
    reward: 100,
    url: "https://youtu.be/asdWQ5wrqV0?si=eknLIEy9KlRWbUfl",
    thumbnail: "https://img.youtube.com/vi/asdWQ5wrqV0/hqdefault.jpg",
    description: "টাটা টি প্রিমিয়াম কেয়ার-এর বিশেষ বিজ্ঞাপনটি দেখুন এবং নিশ্চিত বোনাস গ্রহণ করুন।",
    available: true,
    share_count: 168,
    isPaidOnly: true,
    hideFromHome: true
  },
  {
    id: "paid-vid-8",
    title: "Order in & Zing Up the Mood! | foodpanda Bangladesh",
    category: "Food Delivery",
    duration: 30,
    reward: 100,
    url: "https://youtu.be/L46Rs7TPvm4?si=qAxHL-D9wbmbEL9i",
    thumbnail: "https://img.youtube.com/vi/L46Rs7TPvm4/hqdefault.jpg",
    description: "ফুডপান্ডা বাংলাদেশ-এর আকর্ষণীয় অফার বিষয়ক ক্যাম্পেইন বিজ্ঞাপনটি দেখুন।",
    available: true,
    share_count: 215,
    isPaidOnly: true,
    hideFromHome: true
  },
  {
    id: "paid-vid-9",
    title: "foodpanda | Do You Live Like a Panda? #LiveLikePanda",
    category: "Food Delivery",
    duration: 30,
    reward: 100,
    url: "https://youtu.be/PQzJTC6EimA?si=TDqoAhCmS-pQHhs1",
    thumbnail: "https://img.youtube.com/vi/PQzJTC6EimA/hqdefault.jpg",
    description: "ফুডপান্ডা লাইভ লাইক এ পান্ডা বিজ্ঞাপনটি দেখে নিশ্চিত ইনকাম ক্লেইম করুন।",
    available: true,
    share_count: 178,
    isPaidOnly: true,
    hideFromHome: true
  },
  {
    id: "paid-vid-10",
    title: "পেমেন্ট হোক বিকাশ-এ 🎶 | bKash Payment Campaign",
    category: "Fintech",
    duration: 30,
    reward: 100,
    url: "https://youtu.be/N2Abi1OHw6U?si=bt1aAf-zueImOaK_",
    thumbnail: "https://img.youtube.com/vi/N2Abi1OHw6U/hqdefault.jpg",
    description: "বিকাশ পেমেন্ট মিউজিক্যাল ক্যাম্পেইন বিজ্ঞাপনটি দেখুন এবং ৳১০০ ইনকাম যোগ করুন।",
    available: true,
    share_count: 260,
    isPaidOnly: true,
    hideFromHome: true
  },
  {
    id: "paid-vid-11",
    title: "হার না মানা হার নগদে | Nagad Commercial TVC",
    category: "Fintech",
    duration: 30,
    reward: 100,
    url: "https://youtu.be/XAVu9KRdVP0?si=k7yDgdqPf_8FdLN2",
    thumbnail: "https://img.youtube.com/vi/XAVu9KRdVP0/hqdefault.jpg",
    description: "ডাক বিভাগের ডিজিটাল লেনদেন সেবা নগদ-এর অনুপ্রেরণামূলক টিভি বিজ্ঞাপনটি দেখুন।",
    available: true,
    share_count: 245,
    isPaidOnly: true,
    hideFromHome: true
  },
  {
    id: "paid-vid-12",
    title: "City Bank | Bhoroshar Golpo (Full TVC) | সিটি ব্যাংক ভরসার গল্প",
    category: "Banking",
    duration: 30,
    reward: 100,
    url: "https://youtu.be/3oBxUg9S2y0?si=vFp8bCht5ESAQCQP",
    thumbnail: "https://img.youtube.com/vi/3oBxUg9S2y0/hqdefault.jpg",
    description: "সিটি ব্যাংক বাংলাদেশের অন্যতম নির্ভরযোগ্য বাণিজ্যিক ব্যাংকের অফিশিয়াল বিজ্ঞাপনটি দেখুন।",
    available: true,
    share_count: 132,
    isPaidOnly: true,
    hideFromHome: true
  },
  {
    id: "paid-vid-13",
    title: "উপায় - কম খরচে নিরাপদ লেনদেন | upay Bangladesh MFS",
    category: "Fintech",
    duration: 30,
    reward: 100,
    url: "https://youtu.be/DnuCGZTOLRA?si=9uitU4Vf3aQgU7Sx",
    thumbnail: "https://img.youtube.com/vi/DnuCGZTOLRA/hqdefault.jpg",
    description: "ইউসিবি ব্যাংকের ডিজিটাল লেনদেন 'উপায়'-এর স্পন্সরড ভিডিও বিজ্ঞাপনটি দেখুন।",
    available: true,
    share_count: 188,
    isPaidOnly: true,
    hideFromHome: true
  }
];

export default function App() {
  // Current user state
  const [user, setUser] = useState<any>(null);

  // Database loaded state
  const [stats, setStats] = useState<any>({ registeredUsers: 25000, videosWatched: 1200000, rewardsDistributed: 5000000, activeTasks: 10 });
  const [videos, setVideos] = useState<any[]>(INITIAL_VIDEOS);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [tickerActive, setTickerActive] = useState(true);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [dailyBonusAmount, setDailyBonusAmount] = useState(20);

  // Authentication modals
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [authPhone, setAuthPhone] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Admin panel visibility
  const [showAdmin, setShowAdmin] = useState(false);

  // Active view tracking for desktop navigation and mobile bottom tabs
  const [activeTab, setActiveTab] = useState('home');

  // Load and refresh core site data from Express backend
  const loadData = async () => {
    // 1. Fetch live public statistics and recent activity ticker
    try {
      const resStats = await fetch('/api/stats');
      const dataStats = await resStats.json();
      if (dataStats.success) {
        setStats(dataStats.stats);
        setTickerActive(dataStats.tickerActive);
        setRecentActivities(dataStats.recentActivities);
      }
    } catch (err) {
      console.error('Failed to load stats data:', err);
    }

    // 2. Fetch available videos
    try {
      const resVids = await fetch('/api/videos');
      const dataVids = await resVids.json();
      if (dataVids.success) {
        setVideos(dataVids.videos);
      }
    } catch (err) {
      console.error('Failed to load videos data:', err);
    }

    // 3. Fetch FAQs
    try {
      const resFaqs = await fetch('/api/faqs');
      const dataFaqs = await resFaqs.json();
      if (dataFaqs.success) {
        setFaqs(dataFaqs.faqs);
      }
    } catch (err) {
      console.error('Failed to load faqs data:', err);
    }

    // 4. Fetch all transactions (to sync with user's private wallet ledger)
    try {
      const resAdmin = await fetch('/api/admin/data');
      const dataAdmin = await resAdmin.json();
      if (dataAdmin.success) {
        setTransactions(dataAdmin.transactions);
        setDailyBonusAmount(dataAdmin.settings.dailyBonusAmount);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    }
  };

  // Sync user profile state (e.g. balance, withdrawals) after successful reward claim or withdraw
  const refreshUserProfile = async () => {
    if (!user) return;
    try {
      const res = await fetch('/api/admin/data');
      const data = await res.json();
      if (data.success) {
        const freshUser = data.users.find((u: any) => u.id === user.id);
        if (freshUser) {
          setUser(freshUser);
          localStorage.setItem('watch2earn-user', JSON.stringify(freshUser));
        }
        setTransactions(data.transactions);
      }
    } catch (err) {
      console.error('Failed to refresh user profile:', err);
    }
  };

  // Initial load
  useEffect(() => {
    loadData();

    // Capture referral code from URL query parameters
    const searchParams = new URLSearchParams(window.location.search);
    const refCode = searchParams.get('ref');
    if (refCode) {
      localStorage.setItem('watch2earn-referrer', refCode.trim());
    }

    // Load active session from localStorage
    const saved = localStorage.getItem('watch2earn-user');
    if (saved) {
      setUser(JSON.parse(saved));
    }

    // Check Google Redirect Result after returning from Google
    checkRedirectResult().then(async (gUser) => {
      if (gUser && gUser.email) {
        const referredBy = localStorage.getItem('watch2earn-referrer') || '';
        try {
          const res = await fetch('/api/auth/google', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: gUser.email,
              displayName: gUser.displayName,
              googleId: gUser.uid,
              referredBy
            })
          });
          const data = await res.json().catch(() => null);
          if (data && data.success) {
            setUser(data.user);
            localStorage.setItem('watch2earn-user', JSON.stringify(data.user));
            localStorage.removeItem('watch2earn-referrer');
            loadData();
          }
        } catch (err) {
          console.error('Error processing Google redirect login:', err);
        }
      }
    }).catch((err) => {
      console.error('Redirect result error:', err);
    });
  }, []);

  const [phoneToLink, setPhoneToLink] = useState('');
  const [linkPhoneError, setLinkPhoneError] = useState<string | null>(null);
  const [linkPhoneSuccess, setLinkPhoneSuccess] = useState<string | null>(null);

  const handleLinkPhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLinkPhoneError(null);
    setLinkPhoneSuccess(null);

    if (!phoneToLink || phoneToLink.trim().length < 11) {
      setLinkPhoneError('দয়া করে একটি সঠিক ১১ ডিজিটের মোবাইল নম্বর প্রদান করুন।');
      return;
    }

    try {
      const res = await fetch('/api/user/link-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id, phone: phoneToLink })
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('watch2earn-user', JSON.stringify(data.user));
        setLinkPhoneSuccess('আপনার মোবাইল নম্বরটি সফলভাবে যুক্ত হয়েছে!');
        setPhoneToLink('');
        setTimeout(() => setLinkPhoneSuccess(null), 3000);
      } else {
        setLinkPhoneError(data.message || 'মোবাইল নম্বর যুক্ত করতে ব্যর্থ হয়েছে।');
      }
    } catch (err) {
      setLinkPhoneError('সার্ভারে যোগাযোগ করতে সমস্যা হয়েছে।');
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.error('Google Sign In Error:', err);
      const errorCode = err?.code || '';
      const errorMsg = err?.message || '';
      setAuthError(`গুগল সাইন ইন ত্রুটি (${errorCode || 'Error'}): ${errorMsg || 'আবার চেষ্টা করুন।'}`);
    }
  };

  // Handle Login submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!authPhone || !authPassword) {
      setAuthError('দয়া করে ইউজারনেম/মোবাইল নম্বর এবং পাসওয়ার্ড প্রদান করুন।');
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: authPhone, password: authPassword })
      });
      
      const data = await res.json().catch(() => null);

      if (data && data.success) {
        setUser(data.user);
        localStorage.setItem('watch2earn-user', JSON.stringify(data.user));
        setShowLogin(false);
        setAuthPhone('');
        setAuthPassword('');
        loadData(); // refreshes transactions list
      } else {
        setAuthError((data && data.message) ? data.message : 'লগইন তথ্য সঠিক নয় বা নেটওয়ার্ক সংযোগ বিঘ্নিত হয়েছে।');
      }
    } catch (err: any) {
      setAuthError('সার্ভারে সংযোগ ব্যর্থ হয়েছে। আবার চেষ্টা করুন।');
    }
  };

  // Handle Register submission
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!authName || !authPhone || !authPassword) {
      setAuthError('সবগুলো তথ্য (ইউজারনেম, ফোন নম্বর ও পাসওয়ার্ড) সঠিকভাবে পূরণ করুন।');
      return;
    }

    const referredBy = localStorage.getItem('watch2earn-referrer') || '';

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: authName, phone: authPhone, password: authPassword, referredBy })
      });
      
      const data = await res.json().catch(() => null);

      if (data && data.success) {
        setUser(data.user);
        localStorage.setItem('watch2earn-user', JSON.stringify(data.user));
        localStorage.removeItem('watch2earn-referrer'); // clear after successful signup
        setShowRegister(false);
        setAuthName('');
        setAuthPhone('');
        setAuthPassword('');
        loadData(); // Refreshes stats
      } else {
        setAuthError((data && data.message) ? data.message : 'রেজিস্ট্রেশন ব্যর্থ হয়েছে। অন্য তথ্য চেষ্টা করুন।');
      }
    } catch (err: any) {
      setAuthError('সার্ভারে কানেকশন প্রবলেম হয়েছে। আবার চেষ্টা করুন।');
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    setUser(null);
    localStorage.removeItem('watch2earn-user');
    await logoutGoogle();
    setActiveTab('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 24-HOUR ROLLING PERIOD VIDEO WATCH & EARNING CAPACITY TRACKER
  const [showLimitModal, setShowLimitModal] = useState(false);

  // Compute 24-hour watched count from transactions and storage
  const getWatchedCount24h = () => {
    if (!user) return 0;
    const now = Date.now();
    const twentyFourHoursAgo = now - (24 * 60 * 60 * 1000);

    // 1. Filter server transactions in 24h
    const rewardTxs = (transactions || []).filter((tx: any) => {
      const isUser = (tx.userId === user.id) || (tx.phone && tx.phone === user.phone);
      const isReward = tx.type === 'reward' || tx.type === 'watch' || tx.title?.includes('ভিডিও') || tx.title?.includes('Video');
      const txTime = tx.timestamp ? new Date(tx.timestamp).getTime() : 0;
      return isUser && isReward && txTime > twentyFourHoursAgo;
    });

    // 2. Check localStorage watch history for instant reactivity
    let localCount = 0;
    try {
      const localHistoryKey = `watch_history_${user.id}`;
      const localHistory = JSON.parse(localStorage.getItem(localHistoryKey) || '[]');
      const recentLocal = localHistory.filter((item: any) => {
        const itemTime = item.timestamp || 0;
        return itemTime > twentyFourHoursAgo;
      });
      localCount = recentLocal.length;
    } catch {
      localCount = 0;
    }

    return Math.max(rewardTxs.length, localCount);
  };

  const userPkgKey = user?.currentPackage || 'Free';
  const currentPkgConfig = PACKAGE_DAILY_LIMITS[userPkgKey] || PACKAGE_DAILY_LIMITS['Free'];
  const dailyLimit = currentPkgConfig.limit;
  const watchedCount24h = getWatchedCount24h();
  const remainingCapacity = Math.max(0, dailyLimit - watchedCount24h);
  const isDailyLimitReached = user && watchedCount24h >= dailyLimit;
  const progressPercent = Math.min(100, Math.round((watchedCount24h / dailyLimit) * 100));
  const totalEarned24h = watchedCount24h * currentPkgConfig.rewardPerVideo;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between pb-16 lg:pb-0">
      
      {/* Sticky Header Top */}
      <Header
        user={user}
        onLogout={handleLogout}
        onOpenLogin={() => { setAuthError(null); setShowLogin(true); }}
        onOpenRegister={() => { setAuthError(null); setShowRegister(true); }}
        onOpenAdmin={() => setShowAdmin(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* REAL-TIME LIVE EARNINGS & PAYOUTS TICKER MARQUEE */}
      <RealTimeEarningsTicker />

      {/* Main Page Core Content */}
      <main className="flex-1">
        
        {/* HERO BLOCK */}
        <Hero
          onStartWatchingClick={() => {
            const el = document.getElementById('watch-earn');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
            setActiveTab('watch-earn');
          }}
          onHowItWorksClick={() => {
            const el = document.getElementById('how-it-works');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
            setActiveTab('how-it-works');
          }}
          stats={stats}
        />

        {/* OFFICIAL COMMERCIAL SPONSORS & MEDIA PARTNERS */}
        <SponsorLogos />

        {/* GOOGLE SIGN IN - LINK MOBILE PHONE BANNER */}
        {user && !user.phone && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 mb-6 relative z-20">
            <div className="p-5 sm:p-6 rounded-3xl border border-amber-300 bg-amber-50/90 shadow-lg text-slate-900">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-amber-950 flex items-center gap-1.5">
                    <Smartphone className="w-5 h-5 text-amber-600 animate-pulse" />
                    মোবাইল নম্বর সংযুক্ত করুন (Link Mobile Number)
                  </h4>
                  <p className="text-xs text-amber-800">
                    টাকা উত্তোলন (Withdraw) করতে এবং মেম্বারশিপ প্ল্যান সক্রিয় করতে আপনার সচল বিকাশ/নগদ/রকেট মোবাইল নম্বরটি সংযুক্ত করা আবশ্যক।
                  </p>
                </div>
                <form onSubmit={handleLinkPhoneSubmit} className="flex items-center gap-2 max-w-sm w-full">
                  <div className="relative flex-1">
                    <input
                      type="tel"
                      value={phoneToLink}
                      onChange={(e) => setPhoneToLink(e.target.value)}
                      placeholder="যেমন: 017xxxxxxxx"
                      maxLength={11}
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-hidden text-slate-900 placeholder:text-slate-400 font-mono"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black rounded-xl shadow-md transition-all whitespace-nowrap cursor-pointer"
                  >
                    লিঙ্ক করুন
                  </button>
                </form>
              </div>
              {linkPhoneError && (
                <p className="text-xs text-red-600 font-bold mt-2">⚠ {linkPhoneError}</p>
              )}
              {linkPhoneSuccess && (
                <p className="text-xs text-emerald-600 font-bold mt-2">✓ {linkPhoneSuccess}</p>
              )}
            </div>
          </div>
        )}

        {/* 24-HOUR ROLLING DAILY LIMIT & EARNING CAPACITY TRACKER (COMMERCIAL HUD) */}
        {user && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-8 relative z-20">
            <div className={`p-5 sm:p-6 rounded-3xl border shadow-xl transition-all ${
              isDailyLimitReached 
                ? 'bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border-amber-500/50' 
                : 'bg-white text-slate-900 border-slate-200'
            }`}>
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                
                {/* Left: Capacity status */}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 ${
                      isDailyLimitReached 
                        ? 'bg-amber-500 text-slate-950 shadow-md animate-pulse' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      <Clock className="w-3.5 h-3.5" />
                      ২৪ ঘণ্টার লিমিট ট্র্যাকার (24h Watch Limit)
                    </span>
                    <span className="text-xs font-bold text-slate-400 font-mono">
                      প্যাকেজ: {currentPkgConfig.name.toUpperCase()} (দৈনিক সীমা: {dailyLimit}টি ভিডিও)
                    </span>
                  </div>

                  <h3 className={`text-lg sm:text-xl font-black ${isDailyLimitReached ? 'text-white' : 'text-slate-900'}`}>
                    {isDailyLimitReached ? (
                      <span className="flex items-center gap-2 text-amber-400">
                        <CheckCircle className="w-5 h-5 text-amber-400 shrink-0" />
                        আজকের ২৪ ঘণ্টার দৈনিক ইনকাম সীমা পূর্ণ হয়েছে! (100% Reached)
                      </span>
                    ) : (
                      <span>
                        দৈনিক ইনকাম ক্যাপাসিটি: <span className="text-blue-600 font-mono font-black">{watchedCount24h}/{dailyLimit}</span> ভিডিও দেখা সম্পন্ন
                      </span>
                    )}
                  </h3>

                  <p className={`text-xs ${isDailyLimitReached ? 'text-slate-300' : 'text-slate-500'}`}>
                    {isDailyLimitReached 
                      ? `আপনি ২৪ ঘণ্টায় মোট ৳${totalEarned24h.toLocaleString()} রিওয়ার্ড আয় করেছেন। আরও আয় করতে প্যাকেজ আপগ্রেড করুন অথবা ২৪ ঘণ্টা পর চেষ্টা করুন।`
                      : `আপনার প্যাকেজ অনুযায়ী আজ আর ${remainingCapacity}টি ভিডিও দেখে নিশ্চিত ৳${(remainingCapacity * currentPkgConfig.rewardPerVideo).toLocaleString()} ইনকাম করতে পারবেন।`
                    }
                  </p>
                </div>

                {/* Right: Progress bar & Action CTA */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-3.5 shrink-0 min-w-[260px]">
                  <div className="w-full text-left sm:text-right">
                    <div className="flex justify-between sm:justify-end gap-3 text-xs font-bold mb-1.5 font-mono">
                      <span className={isDailyLimitReached ? 'text-amber-400' : 'text-slate-700'}>
                        অগ্রগতি: {progressPercent}%
                      </span>
                      <span className={isDailyLimitReached ? 'text-emerald-400' : 'text-emerald-600'}>
                        অর্জিত: ৳{totalEarned24h}
                      </span>
                    </div>
                    <div className={`w-full h-2.5 rounded-full overflow-hidden ${isDailyLimitReached ? 'bg-slate-800' : 'bg-slate-100'}`}>
                      <div 
                        className={`h-full transition-all duration-700 rounded-full ${
                          isDailyLimitReached ? 'bg-gradient-to-r from-amber-400 to-emerald-400' : 'bg-gradient-to-r from-blue-600 to-indigo-600'
                        }`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {isDailyLimitReached ? (
                      <>
                        <button
                          onClick={() => setShowLimitModal(true)}
                          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          বিস্তারিত তথ্য দেখুন
                        </button>
                        <button
                          onClick={() => {
                            const el = document.getElementById('packages');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                            setActiveTab('packages');
                          }}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          লিমিট বাড়ান
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          const el = document.getElementById('watch-earn');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                          setActiveTab('watch-earn');
                        }}
                        className="w-full sm:w-auto px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-black rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        বাকি {remainingCapacity}টি ভিডিও দেখুন
                      </button>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* WATCH & EARN VIDEO PLAYER BLOCK */}
        <WatchSection
          user={user}
          videos={videos}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenLogin={() => { setAuthError(null); setShowLogin(true); }}
          onRefreshUser={refreshUserProfile}
        />

        {/* MEMBERSHIP PACKAGES BLOCK */}
        <PackagesSection
          user={user}
          onRefreshUser={refreshUserProfile}
          onOpenLogin={() => { setAuthError(null); setShowLogin(true); }}
        />

        {/* WALLET & EARNINGS PREVIEW BLOCK */}
        <WalletDashboard
          user={user}
          transactions={transactions}
          onOpenLogin={() => { setAuthError(null); setShowLogin(true); }}
          onOpenRegister={() => { setAuthError(null); setShowRegister(true); }}
          onRefreshUser={refreshUserProfile}
          dailyBonusAmount={dailyBonusAmount}
        />

        {/* ADVERTISER HUB SUBMISSION BLOCK */}
        <AdvertiserSection
          onRefreshData={loadData}
        />

        {/* VERIFIED PAYMENT PROOF GALLERY & REVIEWS BLOCK */}
        <PaymentProofGallery
          onStartWatching={() => {
            const el = document.getElementById('watch-earn');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
            setActiveTab('watch-earn');
          }}
        />

        {/* FAQS, WHY CHOOSE US, Live ACTIVITIES & BENGALI FOOTER BLOCK */}
        <FaqsAndFooter
          faqs={faqs}
          recentActivities={recentActivities}
          tickerActive={tickerActive}
          onOpenRegister={() => { setAuthError(null); setShowRegister(true); }}
          onStartWatching={() => {
            const el = document.getElementById('watch-earn');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
            setActiveTab('watch-earn');
          }}
        />

      </main>

      {/* ----------------------------------------
          AUTHENTICATION MODALS
          ---------------------------------------- */}
      
      {/* 1. Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 border border-slate-100 text-left relative overflow-hidden">
            <button 
              onClick={() => setShowLogin(false)} 
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center mb-6">
              <div className="flex justify-center mb-3">
                <img 
                  src="/header-logo.png" 
                  alt="Ads Network Bangladesh Logo" 
                  className="h-10 w-auto object-contain rounded-md"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "https://lh3.googleusercontent.com/u/0/d/1_UJ83cD4vtuWjYNL38wI86xPylR6ZTgp";
                  }}
                />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 mt-1">অ্যাকাউন্টে লগইন করুন</h3>
              <p className="text-xs text-slate-400 mt-0.5">আপনার ফোন নম্বর ও পাসওয়ার্ড প্রদান করুন।</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5" />
                  ইউজারনেম / মোবাইল নম্বর
                </label>
                <input
                  type="text"
                  value={authPhone}
                  onChange={(e) => setAuthPhone(e.target.value)}
                  placeholder="যেমন: Jakirhosen150 অথবা 01987654321"
                  className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[var(--brand-primary-start)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" />
                  পাসওয়ার্ড
                </label>
                <input
                  type="password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="কমপক্ষে ৪টি সংখ্যা বা ক্যারেক্টার"
                  className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[var(--brand-primary-start)]"
                />
              </div>

              {authError && (
                <div className="p-2.5 bg-red-50 text-red-800 border border-red-100 rounded-xl text-xs font-bold">
                  ⚠ {authError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-[var(--brand-primary-start)] to-[var(--brand-primary-end)] text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
              >
                লগইন সম্পন্ন করুন
              </button>
            </form>

            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-slate-100 w-full"></div>
              <span className="bg-white px-3 text-slate-400 text-[10px] font-bold absolute uppercase tracking-wider">অথবা (OR)</span>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48" style={{ display: 'block' }}>
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                <path fill="none" d="M0 0h48v48H0z"></path>
              </svg>
              Google অ্যাকাউন্ট দিয়ে লগইন
            </button>

            <div className="mt-5 pt-4 border-t border-slate-50 text-center text-xs">
              <span className="text-slate-400">নতুন ব্যবহারকারী? </span>
              <button 
                onClick={() => { setShowLogin(false); setShowRegister(true); }}
                className="text-[var(--brand-primary-start)] font-bold hover:underline cursor-pointer"
              >
                নতুন অ্যাকাউন্ট খুলুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Register Modal */}
      {showRegister && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 border border-slate-100 text-left relative overflow-hidden">
            <button 
              onClick={() => setShowRegister(false)} 
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center mb-6">
              <div className="flex justify-center mb-3">
                <img 
                  src="/header-logo.png" 
                  alt="Ads Network Bangladesh Logo" 
                  className="h-10 w-auto object-contain rounded-md"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "https://lh3.googleusercontent.com/u/0/d/1_UJ83cD4vtuWjYNL38wI86xPylR6ZTgp";
                  }}
                />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 mt-1">ফ্রি অ্যাকাউন্ট তৈরি করুন</h3>
              <p className="text-xs text-slate-400 mt-0.5">সহজে রেজিস্ট্রেশন করে আজই আয় শুরু করুন।</p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">আপনার নাম (পূর্ণ নাম)</label>
                <input
                  type="text"
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  placeholder="যেমন: তাসনিম রহমান"
                  className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[var(--brand-primary-start)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5" />
                  মোবাইল নম্বর
                </label>
                <input
                  type="tel"
                  value={authPhone}
                  onChange={(e) => setAuthPhone(e.target.value)}
                  placeholder="যেমন: 017xxxxxxxx"
                  className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[var(--brand-primary-start)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" />
                  নিরাপদ পাসওয়ার্ড
                </label>
                <input
                  type="password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="কমপক্ষে ৪টি সংখ্যা বা ক্যারেক্টার"
                  className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[var(--brand-primary-start)]"
                />
              </div>

              {authError && (
                <div className="p-2.5 bg-red-50 text-red-800 border border-red-100 rounded-xl text-xs font-bold">
                  ⚠ {authError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-[var(--brand-primary-start)] to-[var(--brand-primary-end)] text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
              >
                রেজিস্ট্রেশন সম্পন্ন করুন
              </button>
            </form>

            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-slate-100 w-full"></div>
              <span className="bg-white px-3 text-slate-400 text-[10px] font-bold absolute uppercase tracking-wider">অথবা (OR)</span>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48" style={{ display: 'block' }}>
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                <path fill="none" d="M0 0h48v48H0z"></path>
              </svg>
              Google অ্যাকাউন্ট দিয়ে সাইন আপ
            </button>

            <div className="mt-5 pt-4 border-t border-slate-50 text-center text-xs">
              <span className="text-slate-400">ইতিমধ্যেই অ্যাকাউন্ট আছে? </span>
              <button 
                onClick={() => { setShowRegister(false); setShowLogin(true); }}
                className="text-[var(--brand-primary-start)] font-bold hover:underline cursor-pointer"
              >
                লগইন করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------
          ADMIN WORKSPACE MODAL
          ---------------------------------------- */}
      {showAdmin && (
        <AdminPanel
          onClose={() => setShowAdmin(false)}
          onRefreshData={loadData}
        />
      )}

      {/* 3. Helpful Daily Earning Capacity Reached Modal */}
      {showLimitModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-7 border border-slate-100 text-left relative overflow-hidden animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setShowLimitModal(false)} 
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer p-1 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
            
            {/* Header with celebratory icon */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 shadow-inner">
                <Gift className="w-6 h-6" />
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950 font-mono">
                  Daily Capacity 100%
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">
                  আজকের ২৪ ঘণ্টার সীমা সম্পন্ন!
                </h3>
              </div>
            </div>

            {/* Helpful Message & Breakdown */}
            <div className="space-y-4 text-xs text-slate-600">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2.5">
                <div className="flex justify-between items-center text-slate-700">
                  <span className="font-semibold">সক্রিয় মেম্বারশিপ প্যাকেজ:</span>
                  <strong className="font-mono text-slate-900 uppercase">{currentPkgConfig.name}</strong>
                </div>
                <div className="flex justify-between items-center text-slate-700">
                  <span className="font-semibold">দেখা ভিডিওর সংখ্যা (২৪ ঘণ্টায়):</span>
                  <strong className="font-mono text-blue-700 font-bold">{watchedCount24h} / {dailyLimit} টি</strong>
                </div>
                <div className="flex justify-between items-center text-slate-700 border-t border-slate-200/60 pt-2">
                  <span className="font-bold text-slate-900">মোট রিওয়ার্ড উপার্জন:</span>
                  <strong className="font-mono text-emerald-600 font-black text-sm">৳{totalEarned24h.toLocaleString()}</strong>
                </div>
              </div>

              {/* Reset Timing Note */}
              <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-2xl flex items-start gap-2.5 text-blue-900 text-[11px] leading-relaxed">
                <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-blue-950">পরবর্তী ২৪ ঘণ্টার সাইকেল রিসেট তথ্য:</p>
                  <p className="text-blue-800 mt-0.5">
                    আমাদের সিস্টেম রোলিং ২৪-আওয়ার সাইকেলে পরিচালিত হয়। আপনার দেখা ভিডিওগুলো ২৪ ঘণ্টা পর স্বয়ংক্রিয়ভাবে পুনরায় সক্রিয় হবে।
                  </p>
                </div>
              </div>

              {/* How to earn more tip */}
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-100 rounded-2xl flex items-start gap-2.5 text-emerald-900 text-[11px] leading-relaxed">
                <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-emerald-950">আজই আরও বেশি আয় করতে চান?</p>
                  <p className="text-emerald-800 mt-0.5">
                    উচ্চতর প্যাকেজে (যেমন Gold, Platinum, Diamond) আপগ্রেড করলে দৈনিক ভিডিও লিমিট ও আয় বহুগুণ বৃদ্ধি পাবে!
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => {
                  setShowLimitModal(false);
                  const el = document.getElementById('packages');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  setActiveTab('packages');
                }}
                className="w-full sm:flex-1 py-3 bg-blue-700 hover:bg-blue-800 text-white font-black rounded-xl text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Zap className="w-4 h-4" />
                প্যাকেজ আপগ্রেড করুন
              </button>
              <button
                onClick={() => {
                  setShowLimitModal(false);
                  const el = document.getElementById('rewards');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  setActiveTab('rewards');
                }}
                className="w-full sm:w-auto px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all cursor-pointer"
              >
                টাকা উত্তোলন করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------
          MOBILE DESIGN BOTTOM TOUCH BAR CONTRACT
          ---------------------------------------- */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 shadow-xl flex items-center justify-around h-16 px-2">
        <button
          onClick={() => {
            setActiveTab('home');
            const el = document.getElementById('home');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center py-1.5 w-12 cursor-pointer transition-colors ${
            activeTab === 'home' ? 'text-[var(--brand-primary-start)] font-bold' : 'text-slate-400'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[9px] mt-1">হোম</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('watch-earn');
            const el = document.getElementById('watch-earn');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center py-1.5 w-12 cursor-pointer transition-colors ${
            activeTab === 'watch-earn' ? 'text-[var(--brand-primary-start)] font-bold' : 'text-slate-400'
          }`}
        >
          <Play className="w-5 h-5" />
          <span className="text-[9px] mt-1">ওয়াচ</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('rewards');
            const el = document.getElementById('rewards');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center py-1.5 w-12 cursor-pointer transition-colors ${
            activeTab === 'rewards' ? 'text-[var(--brand-primary-start)] font-bold' : 'text-slate-400'
          }`}
        >
          <Wallet className="w-5 h-5" />
          <span className="text-[9px] mt-1">ওয়ালেট</span>
        </button>

        <button
          onClick={() => {
            if (user) {
              setActiveTab('rewards');
              const el = document.getElementById('rewards');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            } else {
              setAuthError(null);
              setShowLogin(true);
            }
          }}
          className={`flex flex-col items-center justify-center py-1.5 w-12 cursor-pointer transition-colors ${
            activeTab === 'profile' ? 'text-[var(--brand-primary-start)] font-bold' : 'text-slate-400'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[9px] mt-1">প্রোফাইল</span>
        </button>

        {user && user.isAdmin && (
          <button
            onClick={() => setShowAdmin(true)}
            className="flex flex-col items-center justify-center py-1.5 w-12 cursor-pointer text-amber-600 hover:text-amber-700"
          >
            <ShieldCheck className="w-5 h-5" />
            <span className="text-[9px] mt-1 font-bold">অ্যাডমিন</span>
          </button>
        )}
      </div>

      {/* ----------------------------------------
          TELEGRAM FLOATING SUPPORT & UPDATES CHAT
          ---------------------------------------- */}
      <TelegramFloatingChat />

    </div>
  );
}
