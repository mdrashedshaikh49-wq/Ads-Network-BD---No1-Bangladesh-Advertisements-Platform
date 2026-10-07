import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Interface structures for Database
interface User {
  id: string;
  username: string;
  phone: string;
  balance: number;
  todayEarnings: number;
  totalEarnings: number;
  pendingRewards: number;
  completedTasksCount: number;
  createdAt: string;
  isAdmin: boolean;
  password?: string;
  currentPackage?: string; // Subscription level like 'starter', 'gold', 'Free'
  referredBy?: string;
  referralCount?: number;
  referralEarnings?: number;
  googleEmail?: string;
}

export const PACKAGES_MAP: Record<string, { name: string; price: number; dailyLimit: number; rewardPerVideo: number }> = {
  'starter': { name: 'Starter', price: 500, dailyLimit: 1, rewardPerVideo: 50 },
  'basic': { name: 'Basic', price: 1000, dailyLimit: 2, rewardPerVideo: 50 },
  'standard': { name: 'Standard', price: 2000, dailyLimit: 5, rewardPerVideo: 50 },
  'silver': { name: 'Silver', price: 3000, dailyLimit: 8, rewardPerVideo: 50 },
  'gold': { name: 'Gold', price: 4000, dailyLimit: 12, rewardPerVideo: 50 },
  'platinum': { name: 'Platinum', price: 5000, dailyLimit: 20, rewardPerVideo: 50 },
  'diamond': { name: 'Diamond', price: 8000, dailyLimit: 40, rewardPerVideo: 50 },
  'elite': { name: 'Elite', price: 10000, dailyLimit: 50, rewardPerVideo: 50 },
  'Free': { name: 'Free (ফ্রি)', price: 0, dailyLimit: 10, rewardPerVideo: 100 }
};

interface Video {
  id: string;
  title: string;
  category: string;
  duration: number; // in seconds
  reward: number; // in Taka (৳)
  url: string;
  thumbnail: string;
  description: string;
  available: boolean;
  share_count?: number;
  isPaidOnly?: boolean;
  hideFromHome?: boolean;
}

interface WatchSession {
  id: string;
  userId: string;
  videoId: string;
  startTime: number; // Timestamp
  requiredDuration: number; // in seconds
  claimed: boolean;
}

interface Transaction {
  id: string;
  userId: string;
  username: string;
  videoId?: string;
  videoTitle?: string;
  amount: number;
  type: 'video' | 'withdrawal' | 'bonus' | 'deposit';
  paymentMethod?: string;
  phone?: string;
  trxId?: string;
  packageName?: string;
  packageKey?: string;
  completionTime: string;
  status: 'Pending' | 'Verified' | 'Credited' | 'Rejected';
  createdDate: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

interface Stats {
  registeredUsers: number;
  videosWatched: number;
  rewardsDistributed: number; // in Taka (৳)
  activeTasks: number;
}

interface Database {
  users: User[];
  videos: Video[];
  sessions: WatchSession[];
  transactions: Transaction[];
  faqs: FAQ[];
  stats: Stats;
  dailyBonusAmount: number;
  activityTickerActive: boolean;
  paymentNumbers?: {
    bkash: string;
    nagad: string;
    rocket: string;
  };
}

// Path to db.json file
let DB_FILE = path.resolve(process.cwd(), 'db.json');
if (process.env.VERCEL) {
  DB_FILE = path.join('/tmp', 'db.json');
}

// 10 Requested YouTube Video Ads
export const INITIAL_VIDEOS: Video[] = [
  {
    id: "vid-1",
    title: "Wi-Fi ১টাই, সারাদেশে gpfi | গ্রামীণফোন Wireless Broadband",
    category: "Telecom",
    duration: 30,
    reward: 100,
    url: "https://youtu.be/0B2MieWr4rE?si=UgtbkInRGWwvEZkN",
    thumbnail: "https://img.youtube.com/vi/0B2MieWr4rE/hqdefault.jpg",
    description: "Grameenphone-এর অফিসিয়াল gpfi ওয়্যারলেস ব্রডব্যান্ড কমার্শিয়াল বিজ্ঞাপনটি ৩০ সেকেন্ড মনোযোগ সহকারে দেখুন এবং নিশ্চিত ৳১০০ রিওয়ার্ড ওয়ালেটে গ্রহণ করুন।",
    available: true
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
    available: true
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
    available: true
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
    available: true
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
    available: true
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
    available: true
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
    available: true
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
    available: true
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
    available: true
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

// Default initial database state with rich Bengali text
const defaultDatabaseState: Database = {
  users: [
    {
      id: 'demo-user-1',
      username: 'তাসনিম রহমান',
      phone: '01712345678',
      balance: 1250,
      todayEarnings: 85,
      totalEarnings: 5450,
      pendingRewards: 120,
      completedTasksCount: 8,
      createdAt: new Date().toISOString(),
      isAdmin: false,
      currentPackage: 'Free'
    },
    {
      id: 'admin-user',
      username: 'Jakirhosen150',
      phone: '01987654321',
      password: '112233@',
      balance: 0,
      todayEarnings: 0,
      totalEarnings: 0,
      pendingRewards: 0,
      completedTasksCount: 0,
      createdAt: new Date().toISOString(),
      isAdmin: true,
      currentPackage: 'Free'
    }
  ],
  videos: INITIAL_VIDEOS,
  faqs: [
    {
      id: 'faq-1',
      question: 'আমি কিভাবে ভিডিও দেখে টাকা আয় করব?',
      answer: 'প্রথমে VidEarn প্ল্যাটফর্মে আপনার সচল মোবাইল নম্বর দিয়ে রেজিস্ট্রেশন করুন। এরপর লগইন করে যেকোনো সক্রিয় ভিডিও সিলেক্ট করুন এবং "Start Watching" বাটনে ক্লিক করুন। সার্ভারে ভিডিওর নির্দিষ্ট সময়সীমা কাউন্টডাউন শেষ হওয়ার পর "Claim Reward" বাটনে ক্লিক করলে তাৎক্ষণিকভাবে টাকা আপনার মূল ব্যালেন্সে যোগ হবে।'
    },
    {
      id: 'faq-2',
      question: 'রিওয়ার্ড দাবির সময় সার্ভার ভেরিফিকেশন কিভাবে কাজ করে?',
      answer: 'আমাদের প্ল্যাটফর্ম শতভাগ স্বচ্ছতা নিশ্চিত করে। আপনি ভিডিও দেখা শুরু করার সাথে সাথে সার্ভার এন্ডে একটি ইউনিক সিকিউর ট্র্যাকিং সেশন আইডি তৈরি হয়। আপনি যদি প্রয়োজনীয় সময়সীমার আগেই পেজ বন্ধ করেন, উইন্ডো পরিবর্তন করেন বা অটোমেটিক উপায়ে স্ক্রিপ্ট দিয়ে দাবি করতে চান, তবে সার্ভার তা বাতিল করে দেবে। প্রয়োজনীয় সময়সীমা শেষ হলেই কেবল রিওয়ার্ড ক্লেইম সফল হয়।'
    },
    {
      id: 'faq-3',
      question: 'উইথড্র বা টাকা তোলার জন্য কী কী মাধ্যম আছে?',
      answer: 'আপনার অর্জিত টাকা আপনি খুব সহজেই বাংলাদেশের জনপ্রিয় মোবাইল ব্যাংকিং সেবা bKash (বিকাশ), Nagad (নগদ) এবং Rocket (রকেট) এর মাধ্যমে উইথড্র করতে পারবেন।'
    },
    {
      id: 'faq-4',
      question: 'সর্বনিম্ন উইথড্র সীমা কত টাকা?',
      answer: 'VidEarn প্ল্যাটফর্মে সর্বনিম্ন ৫০০ টাকা হলে আপনি উইথড্র রিকোয়েস্ট পাঠাতে পারবেন। উইথড্র করার পর ২৪ ঘণ্টার মধ্যে অ্যাডমিন প্যানেল থেকে যাচাইকরণ সম্পন্ন করে আপনার নম্বরে টাকা পাঠিয়ে দেওয়া হবে।'
    },
    {
      id: 'faq-5',
      question: 'ডেইলি বোনাস পেতে হলে কী করতে হবে?',
      answer: 'প্রতিদিন ১০টি ভিডিও টাস্ক সম্পন্ন করলেই আপনি ২০ টাকা অতিরিক্ত ডেইলি ওয়াচ বোনাস সরাসরি ক্লেইম করতে পারবেন। এটি আপনার ওয়ালেট ড্যাশবোর্ড থেকে পাওয়া যাবে।'
    }
  ],
  stats: {
    registeredUsers: 25482,
    videosWatched: 1248324,
    rewardsDistributed: 5045210,
    activeTasks: 0
  },
  sessions: [],
  transactions: [],
  dailyBonusAmount: 20,
  activityTickerActive: true
};

// Database helper functions (Synchronous JSON File Store)
function getDB(): Database {
  try {
    let db: Database;

    // Copy initial db.json to /tmp/db.json on Vercel
    if (process.env.VERCEL && !fs.existsSync(DB_FILE)) {
      const initialPath = path.resolve(process.cwd(), 'db.json');
      if (fs.existsSync(initialPath)) {
        try {
          fs.writeFileSync(DB_FILE, fs.readFileSync(initialPath, 'utf-8'));
        } catch (copyErr) {
          console.error('Failed to copy db.json to /tmp:', copyErr);
        }
      }
    }

    if (!fs.existsSync(DB_FILE)) {
      db = defaultDatabaseState;
    } else {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      db = JSON.parse(data) as Database;
    }

    // Ensure the Admin user record for 'Jakirhosen150' exists with password '112233@'
    let adminIdx = db.users.findIndex(u => u.username.toLowerCase() === 'jakirhosen150' || u.id === 'admin-user');
    if (adminIdx !== -1) {
      db.users[adminIdx].username = 'Jakirhosen150';
      db.users[adminIdx].password = '112233@';
      db.users[adminIdx].isAdmin = true;
    } else {
      db.users.push({
        id: 'admin-user',
        username: 'Jakirhosen150',
        phone: '01987654321',
        password: '112233@',
        balance: 0,
        todayEarnings: 0,
        totalEarnings: 0,
        pendingRewards: 0,
        completedTasksCount: 0,
        createdAt: new Date().toISOString(),
        isAdmin: true,
        currentPackage: 'Free'
      });
    }

    // Ensure the Admin user record for 'Samrat100' exists with password 'Samrat100@'
    let admin2Idx = db.users.findIndex(u => u.username.toLowerCase() === 'samrat100' || u.id === 'admin-samrat');
    if (admin2Idx !== -1) {
      db.users[admin2Idx].username = 'Samrat100';
      db.users[admin2Idx].password = 'Samrat100@';
      db.users[admin2Idx].isAdmin = true;
    } else {
      db.users.push({
        id: 'admin-samrat',
        username: 'Samrat100',
        phone: '01700000000',
        password: 'Samrat100@',
        balance: 0,
        todayEarnings: 0,
        totalEarnings: 0,
        pendingRewards: 0,
        completedTasksCount: 0,
        createdAt: new Date().toISOString(),
        isAdmin: true,
        currentPackage: 'Free'
      });
    }

    if (!db.paymentNumbers) {
      db.paymentNumbers = {
        bkash: '01601499628',
        nagad: '01601499628',
        rocket: '01601499628'
      };
    }

    if (!db.videos || db.videos.length === 0) {
      db.videos = INITIAL_VIDEOS;
      if (db.stats) db.stats.activeTasks = INITIAL_VIDEOS.length;
    } else {
      let modified = false;
      // Ensure all INITIAL_VIDEOS (including the 13 exclusive paid plan videos) exist in db.videos
      for (const initVid of INITIAL_VIDEOS) {
        const existingIdx = db.videos.findIndex(v => v.id === initVid.id);
        if (existingIdx === -1) {
          db.videos.push(initVid);
          modified = true;
        } else {
          db.videos[existingIdx].isPaidOnly = initVid.isPaidOnly;
          db.videos[existingIdx].hideFromHome = initVid.hideFromHome;
        }
      }

      // Ensure all videos have share_count defined
      db.videos = db.videos.map((v, i) => {
        if (typeof v.share_count !== 'number') {
          modified = true;
          return { ...v, share_count: 50 + (i * 15) };
        }
        return v;
      });
      if (modified) {
        fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
      }
    }

    // Save synced db
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
    return db;
  } catch (error) {
    console.error('Error reading database file, using fallback in-memory state:', error);
    return defaultDatabaseState;
  }
}

function saveDB(db: Database) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving database file:', error);
  }
}

export const app = express();

// Initialize DB synchronously
getDB();

// Pre-parsed body handler for Vercel serverless functions
app.use((req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    (req as any)._body = true;
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Global CORS headers for Vercel and custom domains
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Middleware to normalize /api prefix on Vercel and Proxies
app.use((req, res, next) => {
  const matched = (req.headers['x-matched-path'] || req.headers['x-vercel-matched-path']) as string;
  if (matched && !matched.includes('index.html')) {
    req.url = matched;
  }
  if (!req.url.startsWith('/api') && !req.url.startsWith('/assets') && !req.url.startsWith('/@') && !req.url.includes('.')) {
    req.url = '/api' + req.url;
  }
  next();
});

  // ----------------------------------------
  // USER API ROUTES
  // ----------------------------------------

  // Google AdSense Authorized Digital Sellers (ads.txt)
  app.get(['/ads.txt', '/api/ads.txt'], (req, res) => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.send('google.com, pub-7330951402978812, DIRECT, f08c47fec0942fa0\n');
  });

  // AI Chat Assistant (Customer Support)
  app.post('/api/chat/ai', async (req, res) => {
    try {
      const { message, agentId } = req.body;
      const cleanMessage = message ? String(message).trim() : '';
      const cleanAgentId = agentId ? String(agentId).trim() : 'sadia';

      if (!cleanMessage) {
        return res.status(400).json({ success: false, message: 'মেসেজ টেক্সট প্রয়োজন।' });
      }

      // Determine system prompt based on agent
      let name = "Sadia Sultana (সাদিয়া)";
      let role = "Senior Customer Support (সিনিয়র কাস্টমার সাপোর্ট)";
      let emoji = "🌸";
      let context = "general queries, getting started, registration, and general rules.";

      if (cleanAgentId === 'nusrat') {
        name = "Nusrat Jahan (নুসরাত)";
        role = "Payment Verification Officer (পেমেন্ট ভেরিফিকেশন অফিসার)";
        emoji = "💸";
        context = "payment verification, bKash/Nagad/Rocket withdrawal times, limits (minimum 100 Taka), and payment proof verification.";
      } else if (cleanAgentId === 'anika') {
        name = "Anika Rahman (আনিকা)";
        role = "Membership Guideline Manager (মেম্বারশিপ গাইডলাইন ম্যানেজার)";
        emoji = "🚀";
        context = "premium subscription packages (Starter, Gold, Elite, etc.), earnings capacity, and direct upgrade guidelines.";
      } else if (cleanAgentId === 'fariha') {
        name = "Fariha Islam (ফারিহা)";
        role = "Technical Support Expert (টেকনিক্যাল সাপোর্ট এক্সপার্ট)";
        emoji = "🛠";
        context = "technical support, account login errors, browser troubleshooting, registration troubleshooting, and password resets.";
      }

      const systemInstruction = `You are an expert customer assistant for Ads Network BD (বিজ্ঞাপন দেখে নিশ্চিত আয়ের অন্যতম নির্ভরযোগ্য প্ল্যাটফর্ম). You have absolute A to Z knowledge of this entire platform. No matter what question the customer asks, you must provide a 100% accurate, helpful, and polite answer.

Your Assigned Identity:
Name: ${name}
Role: ${role}

Conversational Tone Rules:
- Conversational Bengali (বাংলা): Speak like a warm, supportive Bangladeshi human sister or team member. Avoid direct machine translation or overly heavy academic words. Use common English loan-words written in Bengali (যেমন: 'ইনকাম', 'উইথড্র', 'মেম্বারশিপ', 'প্যাকেজ', 'ডিপোজিট', 'রেজিস্ট্রেশন', 'রেফার', 'অ্যাক্টিভেট', 'বিকাশ', 'নগদ').
- Concise & Friendly: Keep answers to 2-3 sentences max so they fit comfortably in chat bubbles. Always end with relevant emojis (${emoji}, 😊, 🌸, 🚀).

--- ABSOLUTE SYSTEM KNOWLEDGE BASE (A TO Z) ---

A. প্ল্যাটফর্ম পরিচিতি (About Ads Network BD):
- এটি একটি নির্ভরযোগ্য "Watch-to-Earn" (বিজ্ঞাপন দেখে আয়) প্ল্যাটফর্ম। এখানে বড় বড় বিজ্ঞাপনী ও টেলিকম ব্র্যান্ডের (গ্রামীণফোন, বাংলালিংক ইত্যাদি) ৩০ সেকেন্ডের স্পন্সরড ভিডিও দেখে ঘরে বসে সরাসরি টাকা আয় করা যায়।

B. অ্যাকাউন্ট তৈরি ও ফ্রী ট্রায়াল (Account Creation & Free Trial):
- রেজিস্ট্রেশন ১০০% ফ্রী! কোনো ইমেইল বা আইডি কার্ড লাগে না। শুধু একটি ইউনিক ইউজারনেম, সচল মোবাইল নম্বর এবং গোপন পাসওয়ার্ড দিয়ে ১ মিনিটে রেজিস্ট্রেশন করা যায়।
- নতুন রেজিস্ট্রেশন করলেই স্বয়ংক্রিয়ভাবে একটি "Free Trial (ফ্রি)" মেম্বারশিপ প্ল্যান সক্রিয় হয়।
- ফ্রী প্ল্যানে দৈনিক ১০টি বিজ্ঞাপন দেখে দৈনিক মোট ৳১০ আয় করা সম্ভব (ভিডিও প্রতি ৳১ রিওয়ার্ড)।

C. মেম্বারশিপ প্ল্যান ও প্রিমিয়াম প্যাকেজসমূহ (A to Z Packages List):
- আমাদের ৮টি লাভজনক বিশেষ ইনকাম প্যাকেজ রয়েছে। যেকোনো প্যাকেজে আপগ্রেড করলে আপনার দৈনিক বিজ্ঞাপনের লিমিট এবং প্রতি ভিডিওর রিওয়ার্ড রেট (৳৫০/ভিডিও) বহুগুণে বৃদ্ধি পাবে:
  ১. Starter (স্টার্টার): দাম ৳৫০০ | দৈনিক লিমিট ১টি ভিডিও | প্রতি ভিডিও রিওয়ার্ড ৳৫০ | দৈনিক আয় ৳৫০ | মাসিক আয় ৳১,৫০০।
  ২. Basic (বেসিক): দাম ৳১,০০০ | দৈনিক লিমিট ২টি ভিডিও | প্রতি ভিডিও রিওয়ার্ড ৳৫০ | দৈনিক আয় ৳১০০ | মাসিক আয় ৳৩,০০০।
  ৩. Standard (স্ট্যান্ডার্ড): দাম ৳২,০০০ | দৈনিক লিমিট ৫টি ভিডিও | প্রতি ভিডিও রিওয়ার্ড ৳৫০ | দৈনিক আয় ৳২৫০ | মাসিক আয় ৳৭,৫০০।
  ৪. Silver (সিলভার): দাম ৳৩,০০০ | দৈনিক লিমিট ৮টি ভিডিও | প্রতি ভিডিও রিওয়ার্ড ৳৫০ | দৈনিক আয় ৳৪০০ | মাসিক আয় ৳১২,০০০।
  ৫. Gold (গোল্ড): দাম ৳৪,০০০ | দৈনিক লিমিট ১২টি ভিডিও | প্রতি ভিডিও রিওয়ার্ড ৳৫০ | দৈনিক আয় ৳৬০০ | মাসিক আয় ৳১৮,০০০।
  ৬. Platinum (প্ল্যাটিনাম): দাম ৳৫,০০০ | দৈনিক লিমিট ২০টি ভিডিও | প্রতি ভিডিও রিওয়ার্ড ৳৫০ | দৈনিক আয় ৳১,০০০ | মাসিক আয় ৳৩০,০০০।
  ৭. Diamond (ডায়মন্ড): দাম ৳৮,০০০ | দৈনিক লিমিট ৪০টি ভিডিও | প্রতি ভিডিও রিওয়ার্ড ৳৫০ | দৈনিক আয় ৳২,০০০ | মাসিক আয় ৳৬০,০০০।
  ৮. Elite (এলিট): দাম ৳১০,০০০ | দৈনিক লিমিট ৫০টি ভিডিও | প্রতি ভিডিও রিওয়ার্ড ৳৫০ | দৈনিক আয় ৳২,❺০০ | মাসিক আয় ৳৭৫,০০০।

D. কিভাবে বিজ্ঞাপন দেখে আয় করবেন (Video Watching Process):
- "Watch (ভিডিও)" ট্যাবে গিয়ে যেকোনো বিজ্ঞাপন প্লে করুন। কমপক্ষে ৩০ সেকেন্ড পূর্ণ না হওয়া পর্যন্ত মনোযোগ দিয়ে ভিডিওটি দেখতে হবে। স্ক্রিনে টাইমার ০ (শূন্য) হলে টাকা স্বয়ংক্রিয়ভাবে মেইন ব্যালেন্সে জমা হবে।

E. ডিপোজিট ও প্যাকেজ অ্যাক্টিভেশন নিয়ম (Deposit & Upgrades):
- "Packages" পেজে গিয়ে আপনার পছন্দের প্যাকেজের নিচের "কিনুন" বাটনে ক্লিক করুন।
- স্ক্রিনে এডমিনের অফিসিয়াল বিকাশ, নগদ বা রকেট পার্সোনাল নম্বর দেখতে পাবেন। নম্বরটি কপি করে আপনার মোবাইল ওয়ালেট থেকে সেন্ড মানি (Send Money) করুন।
- সেন্ড মানি সফল হলে আপনার ট্রানজেকশন আইডি (TrxID) এবং যে নম্বর থেকে টাকা পাঠিয়েছেন তা ইনপুট বক্সে লিখে সাবমিট করুন।
- এডমিন টিম ৫ থেকে ১৫ মিনিটের মধ্যে আপনার ডিপোজিট স্লিপ ভেরিফাই করে প্যাকেজটি সক্রিয় করে দেবে।

F. টাকা উত্তোলন বা উইথড্রাল গাইড (A to Z Withdrawal Guide):
- পেমেন্ট মেথড: বিকাশ (bKash), নগদ (Nagad), রকেট (Rocket) এর মাধ্যমে উইথড্র করা যায়।
- সর্বনিম্ন উত্তোলন সীমা (Minimum Withdrawal Limit): মাত্র ১০০ টাকা (৳১০০)! (মেম্বারদের সুবিধার্থে পূর্বে থাকা ২০০ টাকা লিমিট কমিয়ে এখন মাত্র ১০০ টাকা করা হয়েছে)।
- প্রসেসিং টাইম: উইথড্র রিকোয়েস্ট পাঠানোর মাত্র ১০ থেকে ৩০ মিনিটের মধ্যে পেমেন্ট সফলভাবে সম্পন্ন করা হয়।

G. রেফারেল এবং আনলিমিটেড বোনাস (Referral System):
- আপনার ওয়ালেট পেজ থেকে নিজের ইউনিক ইনভাইট লিঙ্ক কপি করে বন্ধুদের সাথে শেয়ার করুন।
- আপনার লিঙ্ক ব্যবহার করে কেউ নতুন রেজিস্ট্রেশন করলেই কোনো শর্ত ছাড়াই আপনার ওয়ালেটে সাথে সাথে সরাসরি ৳৫০ বোনাস জমা হবে! যত বেশি রেফার করবেন, তত বেশি আয় হবে।

H. যেকোনো সাধারণ বা কারিগরি সমস্যার দ্রুত সমাধান (Troubleshooting):
- ভিডিও লোড না হলে: আপনার ইন্টারনেট কানেকশন চেক করুন, পেজটি রিফ্রেশ দিন বা ব্রাউজারের ক্যাশ ফাইল ক্লিয়ার করুন।
- ভিডিওর টাইমার শুরু না হলে: নিশ্চিত করুন যে আপনি ইউটিউব প্লে বাটনে ক্লিক করে ভিডিওটি সক্রিয়ভাবে চালু করেছেন।
- লগইন করতে না পারলে: নিশ্চিত হোন যে ইউজারনেম এবং পাসওয়ার্ডে কোনো স্পেলিং ভুল নেই।

I. অফিসিয়াল টেলিগ্রাম হেল্পলাইন (Telegram Hotline):
- আমাদের অফিসিয়াল টেলিগ্রাম চ্যানেল লিঙ্ক: https://t.me/adsnetworkbangladesh
- সরাসরি সাহায্য পেতে এবং দৈনিক হাজারো মেম্বারের পেমেন্ট প্রুফ দেখতে আজই আমাদের চ্যানেলে যুক্ত হোন! আমাদের প্রধান এডমিনরা চ্যাটে ২৪ ঘণ্টা সাহায্য করতে প্রস্তুত।

--- END OF KNOWLEDGE BASE ---

যদি কোনো কাস্টমার প্ল্যাটফর্মের বাইরে অন্য কোনো আজব বা অপ্রাসঙ্গিক প্রশ্ন করে, তবে তাকে নম্রভাবে এডস নেটওয়ার্ক বিডি-এর আয়ের চমৎকার সুযোগ এবং নিয়মগুলোর দিকে ফিরিয়ে আনুন। আপনি কাস্টমারের যেকোনো কঠিন প্রশ্নের একদম সঠিক উত্তর দেবেন।`;

      // Check if GEMINI_API_KEY is available and valid
      if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'dummy-key') {
        const { GoogleGenAI } = await import("@google/genai");
        const ai = new GoogleGenAI({
          apiKey: process.env.GEMINI_API_KEY,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            }
          }
        });

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: cleanMessage,
          config: {
            systemInstruction: systemInstruction,
            temperature: 0.7,
            maxOutputTokens: 250,
          }
        });

        const aiText = response.text ? response.text.trim() : '';
        if (aiText) {
          return res.json({ success: true, text: aiText });
        }
      }

      // Fallback response if Gemini API key is missing or failed
      let fallbackText = '';
      const textLower = cleanMessage.toLowerCase();
      if (cleanAgentId === 'sadia') {
        if (textLower.includes('কাজ') || textLower.includes('work') || textLower.includes('ad') || textLower.includes('ভিডিও')) {
          fallbackText = 'বিজ্ঞাপন দেখে আয়ের সহজ গাইড:\n১. প্রথমে আমাদের ওয়াচ (Watch) ট্যাবে যান।\n২. সেখানে যেকোনো ভিডিও কমপক্ষে ৩০ সেকেন্ড শেষ হওয়া পর্যন্ত দেখুন।\n৩. কাউন্টডাউন টাইমার শেষ হলে টাকা সাথে সাথে যোগ হয়ে যাবে।\n\nফ্রী মেম্বারদের পেমেন্ট প্রুফ ও আমাদের গাইডলাইন বিস্তারিত দেখতে নিচে ক্লিক করুন! 🌸';
        } else {
          fallbackText = 'ধন্যবাদ আপনার মেসেজের জন্য! 😊 আমি সাদিয়া। আপনি যদি বিজ্ঞাপন দেখে ইনকাম শুরুর একদম প্রাথমিক ধাপে থেকে থাকেন, তবে আমাদের ফ্রী টেলিগ্রাম চ্যানেলে যুক্ত হয়ে আমার তৈরি কাস্টমার আর্নিং ভিডিও টিউটোরিয়ালটি এক নজরে দেখে নিতে পারেন।';
        }
      } else if (cleanAgentId === 'nusrat') {
        if (textLower.includes('টাকা') || textLower.includes('পেমেন্ট') || textLower.includes('বিকাশ') || textLower.includes('নগদ') || textLower.includes('উইথড্র') || textLower.includes('payment') || textLower.includes('withdraw')) {
          fallbackText = 'আমি নুসরাত, পেমেন্ট ডিপার্টমেন্ট দেখছি। 💸 আমাদের মেম্বাররা বিকাশ, নগদ এবং রকেটে উইথড্র দেওয়ার পর সাধারণত ১০ থেকে ৩০ মিনিটে পেমেন্ট পান। সর্বনিম্ন উইথড্র ১০০ টাকা।';
        } else {
          fallbackText = 'হ্যালো, আমি নুসরাত। আপনার পেমেন্ট বা ওয়ালেট ব্যালেন্স উইথড্র নিয়ে কি কোনো সাহায্য লাগবে? আমাদের সকল পেমেন্ট ১০০% স্বয়ংক্রিয় ও নিরাপদ। লাইভ গ্রুপে পেমেন্ট প্রুফ দেখতে নিচে ক্লিক করুন। ✨';
        }
      } else if (cleanAgentId === 'anika') {
        fallbackText = 'আসসালামু আলাইকুম, আমি আনিকা রহমান। আমাদের প্রিমিয়াম মেম্বারশিপ প্ল্যানগুলো আপনার দৈনিক ইনকামকে বহুগুণে বাড়িয়ে তুলতে সাহায্য করবে। দৈনিক সেরা প্যাকেজ সম্পর্কে তথ্য জানতে আমার টেলিগ্রাম পোস্টে যুক্ত হতে পারেন। 🚀';
      } else {
        fallbackText = 'হাই, আমি ফারিহা। সার্ভার সংক্রান্ত জটিলতা, পাসওয়ার্ড সমস্যা বা ব্রাউজার এরর এর মুখোমুখি হচ্ছেন? আমাদের সাপোর্ট ফোরামে সরাসরি আপনার অভিযোগ জমা দিলে আমরা তা দ্রুত ফিক্স করে থাকি। 🛠';
      }

      return res.json({ success: true, text: fallbackText });
    } catch (err) {
      console.error('Error in /api/chat/ai:', err);
      return res.status(500).json({ success: false, message: 'এআই প্রসেসিংয়ে সমস্যা হয়েছে।' });
    }
  });

  // Helper to normalize Bangladesh phone numbers safely
  function normalizePhone(phone: any): string {
    if (!phone) return '';
    let cleaned = String(phone).replace(/\D/g, ''); // keep only digits
    if (cleaned.startsWith('880') && cleaned.length === 14) {
      cleaned = cleaned.substring(2);
    } else if (cleaned.startsWith('880') && cleaned.length === 13) {
      cleaned = cleaned.substring(3);
    } else if (cleaned.startsWith('0') && cleaned.length === 11) {
      // standard 11-digit phone number
    } else if (cleaned.length === 10 && !cleaned.startsWith('0')) {
      cleaned = '0' + cleaned;
    }
    return cleaned;
  }

  // Register
  app.post('/api/auth/register', (req, res) => {
    try {
      const { username, phone, password, referredBy } = req.body;
      const cleanPhone = phone ? String(phone).trim() : '';
      const cleanUsername = username ? String(username).trim() : '';
      const cleanPassword = password ? String(password).trim() : '';

      if (!cleanUsername || !cleanPhone || !cleanPassword) {
        return res.status(400).json({ success: false, message: 'সবগুলো তথ্য (ইউজারনেম, মোবাইল নম্বর ও পাসওয়ার্ড) পূরণ করুন।' });
      }

      const db = getDB();
      const cleanPhoneNormalized = normalizePhone(cleanPhone);
      
      const existing = db.users.find(u => 
        (u.phone && normalizePhone(u.phone) === cleanPhoneNormalized) ||
        (u.username && String(u.username).trim().toLowerCase() === cleanUsername.toLowerCase())
      );

      if (existing) {
        return res.status(400).json({ success: false, message: 'এই নম্বর বা ইউজারনেম দিয়ে ইতিমধ্যেই একটি অ্যাকাউন্ট তৈরি করা আছে।' });
      }

      const newUser: User = {
        id: 'user-' + Date.now(),
        username: cleanUsername,
        phone: cleanPhone,
        password: cleanPassword,
        balance: 0,
        todayEarnings: 0,
        totalEarnings: 0,
        pendingRewards: 0,
        completedTasksCount: 0,
        createdAt: new Date().toISOString(),
        isAdmin: false,
        currentPackage: 'Free',
        referredBy: '',
        referralCount: 0,
        referralEarnings: 0
      };

      // Process referral if exists
      if (referredBy) {
        const cleanRef = String(referredBy).trim().toLowerCase();
        const referrer = db.users.find(u => 
          (u.username && String(u.username).trim().toLowerCase() === cleanRef) || 
          (u.id && String(u.id).trim().toLowerCase() === cleanRef)
        );

        if (referrer) {
          referrer.balance = (referrer.balance || 0) + 50;
          referrer.totalEarnings = (referrer.totalEarnings || 0) + 50;
          referrer.referralCount = (referrer.referralCount || 0) + 1;
          referrer.referralEarnings = (referrer.referralEarnings || 0) + 50;
          newUser.referredBy = referrer.username;

          // Record bonus transaction for referrer
          const transactionId = 'REF' + Date.now().toString() + Math.floor(Math.random() * 100);
          const newTransaction: Transaction = {
            id: transactionId,
            userId: referrer.id,
            username: referrer.username,
            amount: 50,
            type: 'bonus',
            completionTime: new Date().toLocaleString('bn-BD'),
            status: 'Credited',
            createdDate: new Date().toISOString(),
            videoTitle: `🎁 রেফারেল বোনাস (${cleanUsername} রেজিস্ট্রেশন করেছেন)`
          };
          db.transactions.push(newTransaction);
        }
      }

      db.users.push(newUser);
      db.stats.registeredUsers += 1;
      saveDB(db);

      return res.status(201).json({ success: true, user: newUser, message: 'রেজিস্ট্রেশন সফল হয়েছে!' });
    } catch (err) {
      console.error('Error in /api/auth/register:', err);
      return res.status(500).json({ success: false, message: 'সার্ভার প্রক্রিয়াকরণে ত্রুটি হয়েছে। আবার চেষ্টা করুন।' });
    }
  });

  // Login
  app.post('/api/auth/login', (req, res) => {
    try {
      const { phone, password } = req.body;
      const loginIdentifier = phone ? String(phone).trim().toLowerCase() : '';
      const cleanPassword = password ? String(password).trim() : '';

      if (!loginIdentifier || !cleanPassword) {
        return res.status(400).json({ success: false, message: 'ইউজারনেম/মোবাইল নম্বর এবং পাসওয়ার্ড প্রদান করুন।' });
      }

      const db = getDB();
      const loginPhoneNormalized = normalizePhone(loginIdentifier);

      // Find user by phone OR username safely
      const user = db.users.find(u => 
        (u.phone && normalizePhone(u.phone) === loginPhoneNormalized) || 
        (u.username && String(u.username).trim().toLowerCase() === loginIdentifier)
      );

      if (!user) {
        console.warn(`[Login Failed] User not found for identifier: "${loginIdentifier}" (Normalized Phone: "${loginPhoneNormalized}")`);
        return res.status(400).json({ success: false, message: 'এই ইউজারনেম বা মোবাইল নম্বরে কোনো অ্যাকাউন্ট খুঁজে পাওয়া যায়নি। নতুন অ্যাকাউন্ট তৈরি করুন।' });
      }

      console.log(`[Login Success] User found: ${user.username} (ID: ${user.id})`);

      // Automatically migrate/set password for legacy users who do not have one set yet
      if (!user.password && cleanPassword) {
        user.password = cleanPassword;
        saveDB(db);
      } else if (user.password && user.password !== cleanPassword) {
        return res.status(400).json({ success: false, message: 'ভুল পাসওয়ার্ড দিয়েছেন। সঠিক পাসওয়ার্ড দিয়ে আবার চেষ্টা করুন।' });
      }

      return res.json({ success: true, user, message: 'লগইন সফল হয়েছে!' });
    } catch (err) {
      console.error('Error in /api/auth/login:', err);
      return res.status(500).json({ success: false, message: 'সার্ভার সার্ভিসে ত্রুটি হয়েছে। আবার চেষ্টা করুন।' });
    }
  });

  // Forgot Password Endpoint
  app.post('/api/auth/forgot-password', (req, res) => {
    try {
      const { identifier } = req.body;
      const cleanId = identifier ? String(identifier).trim().toLowerCase() : '';
      if (!cleanId) {
        return res.status(400).json({ success: false, message: 'দয়া করে আপনার ইউজারনেম অথবা মোবাইল নম্বর প্রদান করুন।' });
      }

      const db = getDB();
      const normPhone = normalizePhone(cleanId);
      const user = db.users.find(u => 
        (u.phone && normalizePhone(u.phone) === normPhone) ||
        (u.username && String(u.username).trim().toLowerCase() === cleanId)
      );

      if (!user) {
        return res.status(400).json({ success: false, message: 'এই ইউজারনেম বা মোবাইল নম্বরে কোনো অ্যাকাউন্ট নিবন্ধিত নেই।' });
      }

      // Generate a temporary reset code / password
      const tempPassword = 'Pass' + Math.floor(1000 + Math.random() * 9000);
      user.password = tempPassword;
      saveDB(db);

      return res.json({ 
        success: true, 
        message: `পাসওয়ার্ড রিকভারি সফল! আপনার অস্থায়ী নতুন পাসওয়ার্ড: ${tempPassword} (এটি দিয়ে লগইন করে পরবর্তীতে পরিবর্তন করতে পারবেন)।` 
      });
    } catch (err) {
      console.error('Error in /api/auth/forgot-password:', err);
      return res.status(500).json({ success: false, message: 'পাসওয়ার্ড রিকভারি প্রসেসিংয়ে ত্রুটি হয়েছে।' });
    }
  });

  // Google Sign-In & Sign-Up Endpoint
  app.post('/api/auth/google', (req, res) => {
    try {
      const { email, displayName, googleId, referredBy } = req.body;
      const cleanEmail = email ? String(email).trim().toLowerCase() : '';
      const cleanName = displayName ? String(displayName).trim() : '';

      if (!cleanEmail) {
        return res.status(400).json({ success: false, message: 'গুগল ইমেইল প্রয়োজন।' });
      }

      const db = getDB();

      // 1. Search for existing user by googleEmail
      let user = db.users.find(u => u.googleEmail && u.googleEmail.trim().toLowerCase() === cleanEmail);

      // 2. If not found by googleEmail, check if a user with the same phone or just create a new one
      if (!user) {
        // Find a unique username based on display name or email prefix
        let baseUsername = cleanName || cleanEmail.split('@')[0];
        // Strip non-alphanumeric characters from username for clean URLs
        baseUsername = baseUsername.replace(/[^a-zA-Z0-9\s]/g, '').trim();
        if (!baseUsername) baseUsername = 'User';

        let uniqueUsername = baseUsername;
        let counter = 1;
        while (db.users.some(u => u.username && u.username.trim().toLowerCase() === uniqueUsername.toLowerCase())) {
          uniqueUsername = `${baseUsername}${counter}`;
          counter++;
        }

        const newUser: User = {
          id: 'google-user-' + (googleId || Date.now()),
          username: uniqueUsername,
          phone: '', // Can be linked later
          googleEmail: cleanEmail,
          balance: 0,
          todayEarnings: 0,
          totalEarnings: 0,
          pendingRewards: 0,
          completedTasksCount: 0,
          createdAt: new Date().toISOString(),
          isAdmin: false,
          currentPackage: 'Free',
          referredBy: '',
          referralCount: 0,
          referralEarnings: 0
        };

        // Process referral if registered under invite link
        if (referredBy) {
          const cleanRef = String(referredBy).trim().toLowerCase();
          const referrer = db.users.find(u => 
            (u.username && String(u.username).trim().toLowerCase() === cleanRef) || 
            (u.id && String(u.id).trim().toLowerCase() === cleanRef)
          );

          if (referrer) {
            referrer.balance = (referrer.balance || 0) + 50;
            referrer.totalEarnings = (referrer.totalEarnings || 0) + 50;
            referrer.referralCount = (referrer.referralCount || 0) + 1;
            referrer.referralEarnings = (referrer.referralEarnings || 0) + 50;
            newUser.referredBy = referrer.username;

            // Record bonus transaction for referrer
            const transactionId = 'REF' + Date.now().toString() + Math.floor(Math.random() * 100);
            const newTransaction: Transaction = {
              id: transactionId,
              userId: referrer.id,
              username: referrer.username,
              amount: 50,
              type: 'bonus',
              completionTime: new Date().toLocaleString('bn-BD'),
              status: 'Credited',
              createdDate: new Date().toISOString(),
              videoTitle: `🎁 রেফারেল বোনাস (${uniqueUsername} রেজিস্ট্রেশন করেছেন)`
            };
            db.transactions.push(newTransaction);
          }
        }

        db.users.push(newUser);
        db.stats.registeredUsers += 1;
        saveDB(db);

        return res.status(201).json({ success: true, user: newUser, isNew: true, message: 'গুগল অ্যাকাউন্ট দিয়ে সফলভাবে রেজিস্ট্রেশন সম্পন্ন হয়েছে!' });
      }

      return res.json({ success: true, user, isNew: false, message: 'গুগল অ্যাকাউন্ট দিয়ে সফলভাবে লগইন সম্পন্ন হয়েছে!' });
    } catch (err) {
      console.error('Error in /api/auth/google:', err);
      return res.status(500).json({ success: false, message: 'সার্ভার সার্ভিসে গুগল অথেন্টিকেশনে ত্রুটি হয়েছে।' });
    }
  });

  // Link Phone Number (For Google Users)
  app.post('/api/user/link-phone', (req, res) => {
    try {
      const { userId, phone } = req.body;
      const cleanPhone = phone ? String(phone).trim() : '';

      if (!userId || !cleanPhone) {
        return res.status(400).json({ success: false, message: 'ইউজার আইডি এবং ফোন নম্বর আবশ্যক।' });
      }

      const db = getDB();
      const userIndex = db.users.findIndex(u => u.id === userId);
      if (userIndex === -1) {
        return res.status(404).json({ success: false, message: 'ব্যবহারকারী পাওয়া যায়নি।' });
      }

      const user = db.users[userIndex];
      const cleanPhoneNormalized = normalizePhone(cleanPhone);

      // Check if phone already registered by another user
      const existing = db.users.find(u => 
        u.id !== userId && u.phone && normalizePhone(u.phone) === cleanPhoneNormalized
      );

      if (existing) {
        return res.status(400).json({ success: false, message: 'এই নম্বরটি ইতিমধ্যেই অন্য একটি অ্যাকাউন্টে সংযুক্ত করা আছে।' });
      }

      user.phone = cleanPhone;
      saveDB(db);

      return res.json({ success: true, user, message: 'আপনার মোবাইল নম্বরটি সফলভাবে অ্যাকাউন্টে সংযুক্ত হয়েছে!' });
    } catch (err) {
      console.error('Error in /api/user/link-phone:', err);
      return res.status(500).json({ success: false, message: 'মোবাইল নম্বর সংযুক্ত করতে সমস্যা হয়েছে।' });
    }
  });

  // Let platform proxy serve user uploaded files
  app.get('/file_*', (req, res) => {
    return res.status(404).end();
  });

  // SEO Robots.txt
  app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    const host = `${req.protocol}://${req.get('host')}`;
    res.send(`User-agent: *
Allow: /
Disallow: /api/
Sitemap: ${host}/sitemap.xml`);
  });

  // SEO Dynamic Sitemap XML
  app.get('/sitemap.xml', (req, res) => {
    res.type('application/xml');
    const host = `${req.protocol}://${req.get('host')}`;
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${host}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${host}/#watch-earn</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${host}/#packages</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${host}/#advertise</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${host}/#payment-proofs</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${host}/#trust-legal</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>`;
    res.send(xml);
  });

  // Fetch Videos list
  app.get('/api/videos', (req, res) => {
    const db = getDB();
    return res.json({ success: true, videos: db.videos.filter(v => v.available) });
  });

  // Fetch FAQ list
  app.get('/api/faqs', (req, res) => {
    const db = getDB();
    return res.json({ success: true, faqs: db.faqs });
  });

  // Fetch Public Stats & Recent Actions
  app.get('/api/stats', (req, res) => {
    const db = getDB();
    const activities = db.transactions
      .filter(t => t.type === 'video' || t.status === 'Verified' || t.status === 'Credited')
      .slice(-10) // get last 10
      .reverse()
      .map(t => {
        // Mask username for security
        const name = t.username || 'ব্যবহারকারী';
        let masked = name;
        if (name.length > 3) {
          masked = name.substring(0, 3) + '****';
        } else {
          masked = name + '****';
        }
        return {
          id: t.id,
          maskedName: masked,
          type: t.type,
          amount: t.amount,
          videoTitle: t.videoTitle || 'ভিডিও টাস্ক',
          status: t.status,
          time: t.completionTime
        };
      });

    return res.json({
      success: true,
      stats: db.stats,
      tickerActive: db.activityTickerActive,
      recentActivities: activities
    });
  });

  // Dedicated Real-time Earnings & Payout Ticker Stream from DB
  app.get('/api/ticker/earnings', (req, res) => {
    try {
      const db = getDB();
      // Get all reward earnings and payouts from transactions
      const dbEarnings = db.transactions
        .filter(t => t.type === 'video' || t.type === 'withdrawal' || t.type === 'bonus')
        .slice(-25)
        .reverse()
        .map(t => {
          const rawName = t.username || (t.phone ? t.phone.slice(-4) + ' User' : 'ব্যবহারকারী');
          const maskedName = rawName.length > 3 ? rawName.slice(0, 3) + '***' : rawName + '***';
          
          let brand = 'Grameenphone';
          const title = t.videoTitle || '';
          if (title.includes('Banglalink') || title.includes('বাংলালিংক')) brand = 'Banglalink';
          else if (title.includes('gpfi') || title.includes('Grameenphone') || title.includes('গ্রামীণফোন')) brand = 'Grameenphone';
          else if (title.includes('Coca-Cola') || title.includes('কোকাকোলা')) brand = 'Coca-Cola';
          else if (title.includes('Surf Excel') || title.includes('সার্ফ এক্সেল')) brand = 'Surf Excel';
          else if (title.includes('RFL') || title.includes('আরএফএল')) brand = 'RFL Group';
          else if (title.includes('Taaza') || title.includes('তাজা')) brand = 'Brooke Bond Taaza';
          else if (title.includes('Alpenliebe') || title.includes('আলপেনলিবে')) brand = 'Alpenliebe';
          else if (title.includes('Bashundhara') || title.includes('বসুন্ধরা')) brand = 'Bashundhara';
          else if (title.includes('bKash') || title.includes('বিকাশ')) brand = 'bKash';

          return {
            id: t.id,
            type: t.type,
            user: maskedName,
            amount: t.amount || 100,
            brand: brand,
            adTitle: t.videoTitle || `${brand} Sponsored Commercial Ad`,
            timeAgo: t.completionTime || 'এইমাত্র',
            status: t.status,
            mfs: t.paymentMethod || 'bKash'
          };
        });

      // Default curated verified payout seeds
      const fallbackSeeds = [
        { id: 'seed-1', type: 'video', user: 'Tan***', amount: 100, brand: 'Grameenphone', adTitle: 'gpfi 4G Wireless Broadband Ad', timeAgo: '১ মিনিট আগে', status: 'Credited', mfs: 'bKash' },
        { id: 'seed-2', type: 'video', user: 'Sak***', amount: 100, brand: 'Banglalink', adTitle: 'Banglalink Fastest 4G TVC', timeAgo: '২ মিনিট আগে', status: 'Credited', mfs: 'Nagad' },
        { id: 'seed-3', type: 'withdrawal', user: 'Far***', amount: 1500, brand: 'bKash', adTitle: 'Instant MFS Payout Verified', timeAgo: '৪ মিনিট আগে', status: 'Verified', mfs: 'bKash' },
        { id: 'seed-4', type: 'video', user: 'Rah***', amount: 100, brand: 'Surf Excel', adTitle: 'Surf Excel Tez Commercial Ad', timeAgo: '৫ মিনিট আগে', status: 'Credited', mfs: 'Rocket' },
        { id: 'seed-5', type: 'video', user: 'Nus***', amount: 100, brand: 'RFL Group', adTitle: 'RFL Winner Hotpot Commercial', timeAgo: '৬ মিনিট আগে', status: 'Credited', mfs: 'bKash' },
        { id: 'seed-6', type: 'withdrawal', user: 'Ari***', amount: 2200, brand: 'Nagad', adTitle: 'Instant MFS Payout Verified', timeAgo: '৮ মিনিট আগে', status: 'Verified', mfs: 'Nagad' },
        { id: 'seed-7', type: 'video', user: 'Mah***', amount: 100, brand: 'Coca-Cola', adTitle: 'Coca-Cola Bangladesh TVC', timeAgo: '৯ মিনিট আগে', status: 'Credited', mfs: 'bKash' },
        { id: 'seed-8', type: 'video', user: 'Sho***', amount: 100, brand: 'Brooke Bond Taaza', adTitle: 'Taaza Black Tea Commercial', timeAgo: '১০ মিনিট আগে', status: 'Credited', mfs: 'Nagad' },
      ];

      const combined = [...dbEarnings, ...fallbackSeeds].slice(0, 20);

      return res.json({
        success: true,
        items: combined
      });
    } catch (err) {
      console.error('Error fetching ticker earnings:', err);
      return res.status(500).json({ success: false, items: [] });
    }
  });

  // 1. SECURE START WATCH SESSION (Supports /api/videos/start and /api/user/start-watch)
  const handleStartWatch = (req: any, res: any) => {
    const { userId, videoId } = req.body;
    if (!userId || !videoId) {
      return res.status(400).json({ success: false, message: 'প্রয়োজনীয় তথ্যের ঘাটতি রয়েছে।' });
    }

    const db = getDB();
    const user = db.users.find(u => u.id === userId);
    const video = db.videos.find(v => v.id === videoId);

    if (!user || !video) {
      return res.status(404).json({ success: false, message: 'ব্যবহারকারী বা ভিডিও পাওয়া যায়নি।' });
    }

    // STRICT CORE RULE: User MUST deposit and buy an active package to watch videos!
    if (!user.currentPackage || user.currentPackage === 'Free' || !PACKAGES_MAP[user.currentPackage]) {
      return res.status(403).json({
        success: false,
        requirePackage: true,
        message: '⚠️ ভিডিও দেখার জন্য প্রথমে ডিপোজিট করে যেকোনো একটি মেম্বারশিপ প্যাকেজ সক্রিয় করুন।'
      });
    }

    // Check daily watch limit according to package
    const userPackage = PACKAGES_MAP[user.currentPackage];
    const videosWatchedToday = db.transactions.filter(t => 
      t.userId === userId && 
      t.type === 'video' &&
      new Date(t.createdDate).toDateString() === new Date().toDateString()
    ).length;

    if (videosWatchedToday >= userPackage.dailyLimit) {
      return res.status(400).json({
        success: false,
        message: `আজকের দৈনিক সীমার (${userPackage.dailyLimit}টি ভিডিও) সবকটি কাজ আপনি শেষ করেছেন! পরবর্তী কাজ পাওয়ার জন্য প্যাকেজ আপগ্রেড করুন বা আগামীকাল চেষ্টা করুন।`
      });
    }

    // Create secure watch session inside database
    const sessionId = 'session-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
    const newSession: WatchSession = {
      id: sessionId,
      userId,
      videoId,
      startTime: Date.now(),
      requiredDuration: video.duration || 30,
      claimed: false
    };

    db.sessions.push(newSession);
    saveDB(db);

    return res.json({
      success: true,
      sessionId,
      startTime: newSession.startTime,
      requiredDuration: newSession.requiredDuration,
      session: newSession
    });
  };

  app.post('/api/videos/start', handleStartWatch);
  app.post('/api/user/start-watch', handleStartWatch);

  // INCREMENT SOCIAL SHARE COUNT FOR VIDEO
  const handleShareVideo = (req: any, res: any) => {
    const videoId = req.params.id || req.body.videoId || req.body.id;
    const { platform, userId } = req.body;

    if (!videoId) {
      return res.status(400).json({ success: false, message: 'ভিডিও আইডি প্রদান করুন।' });
    }

    const db = getDB();
    const video = db.videos.find(v => v.id === videoId);

    if (!video) {
      return res.status(404).json({ success: false, message: 'ভিডিও পাওয়া যায়নি।' });
    }

    video.share_count = (video.share_count || 0) + 1;
    saveDB(db);

    return res.json({
      success: true,
      videoId: video.id,
      share_count: video.share_count,
      platform: platform || 'general',
      message: 'ভিডিও সোশ্যাল শেয়ার কাউন্ট সফলভাবে যুক্ত করা হয়েছে।'
    });
  };

  app.post('/api/videos/:id/share', handleShareVideo);
  app.post('/api/videos/share', handleShareVideo);

  // 2. SECURE VERIFY AND CLAIM REWARD (Supports /api/videos/claim and /api/user/complete-watch)
  const handleClaimWatch = (req: any, res: any) => {
    const sessionId = req.body.sessionId || req.body.id;
    const userId = req.body.userId;

    if (!sessionId || !userId) {
      return res.status(400).json({ success: false, message: 'দাবি পূরণের জন্য সেশন এবং ইউজার আইডি প্রয়োজন।' });
    }

    const db = getDB();
    const sessionIndex = db.sessions.findIndex(s => s.id === sessionId);
    if (sessionIndex === -1) {
      return res.status(404).json({ success: false, message: 'অবৈধ বা মেয়াদোত্তীর্ণ সেশন আইডি।' });
    }

    const session = db.sessions[sessionIndex];

    // Security Checks:
    if (session.userId !== userId) {
      return res.status(403).json({ success: false, message: 'অননুমোদিত ক্লেইম রিকোয়েস্ট।' });
    }

    if (session.claimed) {
      return res.status(400).json({ success: false, message: 'এই ভিডিওটির পুরস্কার ইতিমধ্যে সংগ্রহ করা হয়েছে।' });
    }

    const video = db.videos.find(v => v.id === session.videoId);
    if (!video) {
      return res.status(404).json({ success: false, message: 'ভিডিও টাস্কটি খুঁজে পাওয়া যায়নি।' });
    }

    if (video.isPaidOnly) {
      const claimingUser = db.users.find(u => u.id === userId);
      if (!claimingUser || !claimingUser.currentPackage || claimingUser.currentPackage === 'Free') {
        return res.status(403).json({
          success: false,
          requirePackage: true,
          message: '🔒 এই ভিডিও টাস্কের রিওয়ার্ড ক্লেইম করতে একটি পেইড প্যাকেজ সক্রিয় থাকতে হবে।'
        });
      }
    }

    // Server-side Watch Duration Verification
    const elapsedSeconds = (Date.now() - session.startTime) / 1000;
    const requiredMargin = session.requiredDuration - 0.5; // Allow 500ms safety buffer

    if (elapsedSeconds < requiredMargin) {
      return res.status(400).json({
        success: false,
        message: `ভিডিওটি সম্পূর্ণ দেখা হয়নি! আপনার আরও ${Math.ceil(session.requiredDuration - elapsedSeconds)} সেকেন্ড দেখা প্রয়োজন ছিল।`
      });
    }

    // Double claim checking for the same user-video combo in recent minutes (Spam Protection)
    const alreadyCompletedToday = db.transactions.some(t => 
      t.userId === userId && 
      t.videoId === session.videoId && 
      t.type === 'video' &&
      new Date(t.createdDate).toDateString() === new Date().toDateString()
    );

    if (alreadyCompletedToday) {
      return res.status(400).json({ success: false, message: 'আপনি এই ভিডিওর পুরস্কার আজকে ইতিমধ্যেই সংগ্রহ করেছেন!' });
    }

    // Success - Credit rewards!
    const userIndex = db.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ success: false, message: 'ব্যবহারকারী পাওয়া যায়নি।' });
    }

    const user = db.users[userIndex];
    const userPkgKey = user.currentPackage || 'Free';
    const pkgConfig = PACKAGES_MAP[userPkgKey] || PACKAGES_MAP['Free'];

    // Retrieve today's completed video tasks
    const todayCompletedCount = db.transactions.filter(t => 
      t.userId === userId && 
      t.type === 'video' && 
      new Date(t.createdDate).toDateString() === new Date().toDateString()
    ).length;

    if (todayCompletedCount >= pkgConfig.dailyLimit) {
      return res.status(400).json({ 
        success: false, 
        message: `দুঃখিত, আপনার (${pkgConfig.name}) প্যাকেজের দৈনিক লিমিট (${pkgConfig.dailyLimit}টি ভিডিও) অতিক্রম হয়ে গেছে! পরবর্তী ভিডিওর জন্য আগামীকাল চেষ্টা করুন বা বড় প্যাকেজ অ্যাক্টিভেট করুন।` 
      });
    }

    // Assign appropriate reward: Subscribed package pays ৳100.00, Free trial pays ৳10
    const finalReward = pkgConfig.rewardPerVideo;

    user.balance += finalReward;
    user.todayEarnings += finalReward;
    user.totalEarnings += finalReward;
    user.completedTasksCount += 1;

    // Set session as claimed
    db.sessions[sessionIndex].claimed = true;

    // Create Unique transaction ID
    const transactionId = 'TXN' + Date.now().toString() + Math.floor(Math.random() * 1000);
    const newTransaction: Transaction = {
      id: transactionId,
      userId: user.id,
      username: user.username,
      videoId: video.id,
      videoTitle: video.title,
      amount: finalReward,
      type: 'video',
      completionTime: new Date().toLocaleString('bn-BD'),
      status: 'Credited',
      createdDate: new Date().toISOString()
    };

    db.transactions.push(newTransaction);

    // Update global counter stats
    db.stats.videosWatched += 1;
    db.stats.rewardsDistributed += finalReward;

    saveDB(db);

    return res.json({
      success: true,
      message: 'অভিনন্দন! আপনার রিওয়ার্ড সফলভাবে আপনার একাউন্টে যোগ হয়েছে।',
      rewardAmount: finalReward,
      newBalance: user.balance,
      transactionId
    });
  };

  app.post('/api/videos/claim', handleClaimWatch);
  app.post('/api/user/complete-watch', handleClaimWatch);

  // 3. WITHDRAW REQUEST SUBMISSION
  app.post('/api/user/withdraw', (req, res) => {
    const { userId, phone, paymentMethod, amount } = req.body;
    if (!userId || !phone || !paymentMethod || !amount) {
      return res.status(400).json({ success: false, message: 'অনুগ্রহ করে সবগুলো তথ্য সঠিকভাবে পূরণ করুন।' });
    }

    const withdrawAmount = parseFloat(amount);
    if (isNaN(withdrawAmount) || withdrawAmount < 100) {
      return res.status(400).json({ success: false, message: 'উইথড্র করার জন্য সর্বনিম্ন পরিমাণ ১০০ টাকা।' });
    }

    const db = getDB();
    const userIndex = db.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ success: false, message: 'ব্যবহারকারী পাওয়া যায়নি।' });
    }

    const user = db.users[userIndex];
    if (user.balance < withdrawAmount) {
      return res.status(400).json({ success: false, message: 'দুঃখিত, আপনার ওয়ালেটে পর্যাপ্ত ব্যালেন্স নেই।' });
    }

    // Check user's active package
    const userPkgKey = user.currentPackage || 'Free';
    const pkg = PACKAGES_MAP[userPkgKey] || PACKAGES_MAP['Free'];

    if (!user.currentPackage || user.currentPackage === 'Free') {
      return res.status(403).json({
        success: false,
        requirePackage: true,
        message: 'টাকা উইথড্র করার জন্য প্রথমে ৫০০ টাকার বা তার বেশি একটি মেম্বারশিপ প্যাকেজ সক্রিয় করুন।'
      });
    }

    // Count user's previous withdrawals
    const previousWithdrawalsCount = db.transactions.filter(t => 
      t.userId === userId && 
      t.type === 'withdrawal' && 
      (t.status === 'Verified' || t.status === 'Pending' || t.status === 'Credited')
    ).length;


    // Deduct user balance and add to pending
    user.balance -= withdrawAmount;
    user.pendingRewards += withdrawAmount;

    // Register transaction with 'Pending' status
    const transactionId = 'WID' + Date.now().toString() + Math.floor(Math.random() * 100);
    const newTransaction: Transaction = {
      id: transactionId,
      userId: user.id,
      username: user.username,
      amount: withdrawAmount,
      type: 'withdrawal',
      paymentMethod,
      phone,
      completionTime: new Date().toLocaleString('bn-BD'),
      status: 'Pending',
      createdDate: new Date().toISOString()
    };

    db.transactions.push(newTransaction);
    saveDB(db);

    return res.json({
      success: true,
      message: `আপনার ৳${withdrawAmount} টাকার উইথড্র রিকোয়েস্ট সফলভাবে সাবমিট হয়েছে। প্রসেসিং এর পর দ্রুত আপনার পেমেন্ট নম্বরে পাঠিয়ে দেওয়া হবে।`,
      newBalance: user.balance,
      pendingRewards: user.pendingRewards,
      transactionId
    });
  });

  // 3b. PURCHASE SUBSCRIPTION PACKAGE / DEPOSIT SUBMISSION
  const handlePackageBuy = (req: any, res: any) => {
    try {
      const { userId, packageKey, packageName, packagePrice, paymentMethod, accountPhone, trxId, username, phone } = req.body;
      const targetPhone = (accountPhone || phone || '').trim();

      // Flexible case-insensitive package resolution (by key, name, or price)
      let cleanKey = String(packageKey || '').trim().toLowerCase();
      let pkg = PACKAGES_MAP[cleanKey];

      if (!pkg && packageName) {
        const cleanName = String(packageName).trim().toLowerCase();
        const found = Object.entries(PACKAGES_MAP).find(([k, v]) => k.toLowerCase() === cleanName || v.name.toLowerCase() === cleanName);
        if (found) {
          cleanKey = found[0];
          pkg = found[1];
        }
      }

      if (!pkg && packagePrice) {
        const priceNum = Number(packagePrice);
        const found = Object.entries(PACKAGES_MAP).find(([_, v]) => v.price === priceNum);
        if (found) {
          cleanKey = found[0];
          pkg = found[1];
        }
      }

      // If still not matched, find closest match or fallback to starter
      if (!pkg) {
        cleanKey = 'starter';
        pkg = PACKAGES_MAP['starter'];
      }

      const db = getDB();

      // Robust user lookup: by ID, by phone, or by username
      let userIndex = -1;
      if (userId) {
        userIndex = db.users.findIndex(u => u.id === userId);
      }
      if (userIndex === -1 && targetPhone) {
        const normPhone = normalizePhone(targetPhone);
        userIndex = db.users.findIndex(u => u.phone && normalizePhone(u.phone) === normPhone);
      }
      if (userIndex === -1 && username) {
        const lowerUsername = String(username).trim().toLowerCase();
        userIndex = db.users.findIndex(u => u.username && u.username.toLowerCase() === lowerUsername);
      }

      // If user is not yet in this database instance (e.g. serverless cold start), restore/create them seamlessly
      let targetUser: User;
      if (userIndex !== -1) {
        targetUser = db.users[userIndex];
        targetUser.currentPackage = cleanKey;
      } else {
        targetUser = {
          id: userId || ('user-' + Date.now()),
          username: username || targetPhone || 'User',
          phone: targetPhone || '',
          balance: 0,
          todayEarnings: 0,
          totalEarnings: 0,
          pendingRewards: 0,
          completedTasksCount: 0,
          createdAt: new Date().toISOString(),
          isAdmin: false,
          currentPackage: cleanKey
        };
        db.users.push(targetUser);
      }

      // Record purchase deposit transaction
      const transactionId = 'DEP' + Date.now().toString() + Math.floor(Math.random() * 100);
      const cleanTrx = trxId && String(trxId).trim() ? String(trxId).trim() : ('TRX' + Math.floor(100000 + Math.random() * 900000));
      const newTransaction: Transaction = {
        id: transactionId,
        userId: targetUser.id,
        username: targetUser.username,
        amount: pkg.price,
        type: 'deposit',
        paymentMethod: paymentMethod || 'bKash (বিকাশ)',
        phone: targetPhone || targetUser.phone,
        trxId: cleanTrx,
        packageName: pkg.name,
        packageKey: cleanKey,
        completionTime: new Date().toLocaleString('bn-BD'),
        status: 'Pending', // Displayed in Admin Panel Deposits tab
        createdDate: new Date().toISOString()
      };

      db.transactions.push(newTransaction);
      saveDB(db);

      return res.json({
        success: true,
        message: `অভিনন্দন! আপনার (৳${pkg.price.toLocaleString()} - ${pkg.name}) প্যাকেজের ডিপোজিট ট্রানজেকশন (TrxID: ${cleanTrx}) সফলভাবে সাবমিট হয়েছে।`,
        user: targetUser,
        transactionId
      });
    } catch (err: any) {
      console.error('Error in /api/packages/buy:', err);
      return res.status(500).json({ success: false, message: 'সার্ভারে প্রক্রিয়াকরণে ত্রুটি হয়েছে। আবার চেষ্টা করুন।' });
    }
  };

  app.post('/api/packages/buy', handlePackageBuy);
  app.post('/packages/buy', handlePackageBuy);

function cleanYouTubeUrl(rawUrl: string): string {
  if (!rawUrl) return 'https://www.youtube.com/embed/p8ZshSOfmvs';
  const url = rawUrl.trim();
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  if (match && match[2] && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`;
  }
  return url;
}

  // 3c. SUBMIT ADVERTISER CAMPAIGN
  app.post('/api/advertiser/campaign', (req, res) => {
    const { companyName, title, category, duration, targetViews, url, description, paymentPhone, paymentMethod, trxId } = req.body;
    if (!companyName || !title || !url) {
      return res.status(400).json({ success: false, message: 'কোম্পানির নাম, বিজ্ঞাপন শিরোনাম এবং ভিডিও লিংক আবশ্যিক।' });
    }

    const db = getDB();
    
    // Choose appropriate thumbnail based on category keywords
    let thumb = '/src/assets/images/saree_jamdani_thumb_1790940620193.jpg';
    if (category?.includes('কেট') || category?.includes('প্রযুক্তি') || category?.includes('Gp')) {
      thumb = '/src/assets/images/tech_video_thumb_1790939122022.jpg';
    } else if (category?.includes('প্রাণ') || category?.includes('জুস') || category?.includes('ভ্রমণ')) {
      thumb = '/src/assets/images/travel_video_thumb_1790939135604.jpg';
    } else if (category?.includes('কাতান') || category?.includes('আড়ং')) {
      thumb = '/src/assets/images/saree_katan_thumb_1790940638191.jpg';
    } else if (category?.includes('সিল্ক') || category?.includes('স্কয়ার') || category?.includes('সরিষা')) {
      thumb = '/src/assets/images/saree_silk_thumb_1790940655443.jpg';
    }

    // Create new advertisement video task with cleaned embed URL
    const newVid: Video = {
      id: 'vid-' + Date.now(),
      title: `${companyName} - ${title}`,
      category: category || 'বিজ্ঞাপন (Advertising)',
      duration: parseInt(duration) || 15,
      reward: 100, // Every single video watched gets 100 Taka!
      url: cleanYouTubeUrl(url),
      thumbnail: thumb,
      description: description || 'স্পন্সরড কোম্পানি বিজ্ঞাপন দেখে ব্যালেন্সে ১০০ টাকা দাবি করুন।',
      available: false // Needs Admin Approval first!
    };

    // Calculate total cost: total views * ৳120
    const views = parseInt(targetViews) || 100;
    const totalCost = views * 120;

    // Create billing transaction record
    const transactionId = 'ADV' + Date.now().toString() + Math.floor(Math.random() * 100);
    const cleanTrx = trxId && String(trxId).trim() ? String(trxId).trim() : ('TRX' + Math.floor(100000 + Math.random() * 900000));
    const advTransaction: Transaction = {
      id: transactionId,
      userId: 'advertiser-user',
      username: `${companyName} (বিজ্ঞাপনদাতা)`,
      amount: totalCost,
      type: 'bonus', // Billing presentation
      paymentMethod: paymentMethod || 'bKash (বিকাশ)',
      phone: paymentPhone || 'N/A',
      trxId: cleanTrx,
      completionTime: new Date().toLocaleString('bn-BD'),
      status: 'Pending', // Pending approval
      createdDate: new Date().toISOString()
    };

    db.videos.push(newVid);
    db.transactions.push(advTransaction);
    saveDB(db);

    return res.json({
      success: true,
      message: `আপনার (${companyName}) বিজ্ঞাপন ক্যাম্পেইনটি সফলভাবে জমা দেওয়া হয়েছে! মোট বাজেট: ৳${totalCost.toLocaleString()} (বিকাশ/নগদ পেমেন্ট যাচাই করে ১২ ঘণ্টার মধ্যে বিজ্ঞাপনটি লাইভ করা হবে)।`,
      videoId: newVid.id,
      transactionId
    });
  });

  // 4. CLAIM DAILY WATCH BONUS
  app.post('/api/user/daily-bonus', (req, res) => {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ success: false, message: 'ইউজার আইডি প্রয়োজন।' });
    }

    const db = getDB();
    const userIndex = db.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ success: false, message: 'ব্যবহারকারী পাওয়া যায়নি।' });
    }

    const user = db.users[userIndex];

    // Custom check: Check if already claimed today
    const alreadyClaimedToday = db.transactions.some(t => 
      t.userId === userId && 
      t.type === 'bonus' &&
      new Date(t.createdDate).toDateString() === new Date().toDateString()
    );

    if (alreadyClaimedToday) {
      return res.status(400).json({ success: false, message: 'আপনি আজকের ডেইলি বোনাস ইতিমধ্যেই দাবি করেছেন!' });
    }

    // Check progress
    const videosWatchedToday = db.transactions.filter(t => 
      t.userId === userId && 
      t.type === 'video' &&
      new Date(t.createdDate).toDateString() === new Date().toDateString()
    ).length;

    const reqCount = db.dailyBonusAmount === 20 ? 10 : 5; // e.g., 10 or 5 videos
    if (videosWatchedToday < reqCount && user.completedTasksCount < reqCount) {
      return res.status(400).json({
        success: false,
        message: `ডেইলি বোনাস ক্লেইম করতে কমপক্ষে ${reqCount}টি ভিডিও দেখা প্রয়োজন। আপনার অগ্রগতি: ${videosWatchedToday}/${reqCount}টি।`
      });
    }

    // Success - award daily bonus!
    const bonusVal = db.dailyBonusAmount || 20;
    user.balance += bonusVal;
    user.todayEarnings += bonusVal;
    user.totalEarnings += bonusVal;

    const transactionId = 'BONUS' + Date.now().toString();
    const newTransaction: Transaction = {
      id: transactionId,
      userId: user.id,
      username: user.username,
      amount: bonusVal,
      type: 'bonus',
      completionTime: new Date().toLocaleString('bn-BD'),
      status: 'Credited',
      createdDate: new Date().toISOString()
    };

    db.transactions.push(newTransaction);
    db.stats.rewardsDistributed += bonusVal;
    saveDB(db);

    return res.json({
      success: true,
      message: `ডেইলি ওয়াচ বোনাস ৳${bonusVal} সফলভাবে যুক্ত হয়েছে!`,
      newBalance: user.balance,
      bonusAmount: bonusVal
    });
  });

  // ----------------------------------------
  // ADMIN API ROUTES
  // ----------------------------------------

  // Fetch complete admin workspace info
  app.get('/api/admin/data', (req, res) => {
    const db = getDB();
    return res.json({
      success: true,
      users: db.users,
      videos: db.videos,
      transactions: db.transactions,
      faqs: db.faqs,
      stats: db.stats,
      paymentNumbers: db.paymentNumbers || { bkash: '01601499628', nagad: '01601499628', rocket: '01601499628' },
      settings: {
        dailyBonusAmount: db.dailyBonusAmount,
        activityTickerActive: db.activityTickerActive
      }
    });
  });

  // Edit global stats
  app.post('/api/admin/stats', (req, res) => {
    const { registeredUsers, videosWatched, rewardsDistributed, activeTasks } = req.body;
    const db = getDB();
    
    if (registeredUsers !== undefined) db.stats.registeredUsers = parseInt(registeredUsers);
    if (videosWatched !== undefined) db.stats.videosWatched = parseInt(videosWatched);
    if (rewardsDistributed !== undefined) db.stats.rewardsDistributed = parseInt(rewardsDistributed);
    if (activeTasks !== undefined) db.stats.activeTasks = parseInt(activeTasks);

    saveDB(db);
    return res.json({ success: true, stats: db.stats, message: 'পরিসংখ্যান সফলভাবে আপডেট হয়েছে।' });
  });

  // Manage Video Tasks
  app.post('/api/admin/videos', (req, res) => {
    const { action, video } = req.body;
    const db = getDB();

    if (action === 'add') {
      const newVideo: Video = {
        id: 'vid-' + Date.now(),
        title: video.title || 'নতুন ভিডিও টাস্ক',
        category: video.category || 'অন্যান্য',
        duration: parseInt(video.duration) || 30,
        reward: parseFloat(video.reward) || 5,
        url: cleanYouTubeUrl(video.url || 'https://www.youtube.com/embed/dQw4w9WgXcQ'),
        thumbnail: video.thumbnail || '/src/assets/images/tech_video_thumb_1790939122022.jpg',
        description: video.description || 'সহজ টাস্ক পূরণ করে রিওয়ার্ড নিন।',
        available: true
      };
      db.videos.push(newVideo);
      db.stats.activeTasks += 1;
      saveDB(db);
      return res.json({ success: true, videos: db.videos, message: 'ভিডিও টাস্ক সফলভাবে তৈরি হয়েছে।' });
    }

    if (action === 'edit') {
      const idx = db.videos.findIndex(v => v.id === video.id);
      if (idx !== -1) {
        db.videos[idx] = { ...db.videos[idx], ...video };
        saveDB(db);
        return res.json({ success: true, videos: db.videos, message: 'ভিডিও টাস্ক সফলভাবে আপডেট হয়েছে।' });
      }
    }

    if (action === 'delete') {
      db.videos = db.videos.filter(v => v.id !== video.id);
      db.stats.activeTasks = Math.max(0, db.stats.activeTasks - 1);
      saveDB(db);
      return res.json({ success: true, videos: db.videos, message: 'ভিডিও টাস্ক ডিলিট করা হয়েছে।' });
    }

    if (action === 'delete_all') {
      db.videos = [];
      db.sessions = [];
      db.stats.activeTasks = 0;
      saveDB(db);
      return res.json({ success: true, videos: [], message: 'সকল ভিডিও সফলভাবে ডিলিট করা হয়েছে।' });
    }

    if (action === 'approve') {
      const idx = db.videos.findIndex(v => v.id === video.id);
      if (idx !== -1) {
        db.videos[idx].available = true;
        // Find corresponding pending advertiser billing transaction and approve it
        const txIdx = db.transactions.findIndex(t => t.userId === 'advertiser-user' && t.status === 'Pending');
        if (txIdx !== -1) {
          db.transactions[txIdx].status = 'Verified';
        }
        db.stats.activeTasks += 1;
        saveDB(db);
        return res.json({ success: true, videos: db.videos, message: 'বিজ্ঞাপন ক্যাম্পেইনটি সফলভাবে লাইভ করা হয়েছে!' });
      }
    }

    return res.status(400).json({ success: false, message: 'অবৈধ কমান্ড।' });
  });

  // Manage FAQs
  app.post('/api/admin/faqs', (req, res) => {
    const { action, faq } = req.body;
    const db = getDB();

    if (action === 'add') {
      const newFaq: FAQ = {
        id: 'faq-' + Date.now(),
        question: faq.question || 'নতুন প্রশ্ন',
        answer: faq.answer || 'নতুন উত্তর'
      };
      db.faqs.push(newFaq);
      saveDB(db);
      return res.json({ success: true, faqs: db.faqs, message: 'প্রশ্ন ও উত্তর সফলভাবে যুক্ত হয়েছে।' });
    }

    if (action === 'edit') {
      const idx = db.faqs.findIndex(f => f.id === faq.id);
      if (idx !== -1) {
        db.faqs[idx] = { ...db.faqs[idx], ...faq };
        saveDB(db);
        return res.json({ success: true, faqs: db.faqs, message: 'FAQ সফলভাবে আপডেট হয়েছে।' });
      }
    }

    if (action === 'delete') {
      db.faqs = db.faqs.filter(f => f.id !== faq.id);
      saveDB(db);
      return res.json({ success: true, faqs: db.faqs, message: 'FAQ সফলভাবে ডিলিট করা হয়েছে।' });
    }

    return res.status(400).json({ success: false, message: 'অবৈধ কমান্ড।' });
  });

  // Manage Withdrawal Actions (Approve / Reject)
  app.post('/api/admin/withdrawals/action', (req, res) => {
    const { transactionId, action } = req.body;
    if (!transactionId || !action) {
      return res.status(400).json({ success: false, message: 'মেসেজ বডি ত্রুটিপূর্ণ।' });
    }

    const db = getDB();
    const txIndex = db.transactions.findIndex(t => t.id === transactionId && t.type === 'withdrawal');
    if (txIndex === -1) {
      return res.status(404).json({ success: false, message: 'উইথড্র রিকোয়েস্টটি খুঁজে পাওয়া যায়নি।' });
    }

    const tx = db.transactions[txIndex];
    if (tx.status !== 'Pending') {
      return res.status(400).json({ success: false, message: 'এই রিকোয়েস্টটি ইতিপূর্বেই রিভিউ করা হয়েছে।' });
    }

    const userIndex = db.users.findIndex(u => u.id === tx.userId);
    if (userIndex === -1) {
      return res.status(404).json({ success: false, message: 'সংশ্লিষ্ট ব্যবহারকারী খুঁজে পাওয়া যায়নি।' });
    }

    const user = db.users[userIndex];

    if (action === 'approve') {
      tx.status = 'Verified';
      user.pendingRewards = Math.max(0, user.pendingRewards - tx.amount);
      saveDB(db);
      return res.json({ success: true, message: 'উইথড্র রিকোয়েস্ট অনুমোদন (Verified) করা হয়েছে।' });
    }

    if (action === 'reject') {
      tx.status = 'Rejected';
      user.pendingRewards = Math.max(0, user.pendingRewards - tx.amount);
      // Return funds back to available balance
      user.balance += tx.amount;
      saveDB(db);
      return res.json({ success: true, message: 'উইথড্র রিকোয়েস্ট প্রত্যাখ্যান করা হয়েছে এবং ব্যালেন্স ফেরত দেওয়া হয়েছে।' });
    }

    return res.status(400).json({ success: false, message: 'অবৈধ অ্যাকশন।' });
  });

  // Approve or Reject Deposit Request
  app.post('/api/admin/deposits/action', (req, res) => {
    const { transactionId, action } = req.body;
    if (!transactionId || !action) {
      return res.status(400).json({ success: false, message: 'ট্রানজেকশন আইডি এবং অ্যাকশন আবশ্যক।' });
    }

    const db = getDB();
    const txIndex = db.transactions.findIndex(t => t.id === transactionId);
    if (txIndex === -1) {
      return res.status(404).json({ success: false, message: 'ডিপোজিট রিকোয়েস্টটি খুঁজে পাওয়া যায়নি।' });
    }

    const tx = db.transactions[txIndex];
    if (tx.type !== 'deposit') {
      return res.status(400).json({ success: false, message: 'এটি কোনো ডিপোজিট ট্রানজেকশন নয়।' });
    }

    if (action === 'approve') {
      tx.status = 'Verified';
      // Find user and activate requested package
      const userIndex = db.users.findIndex(u => u.id === tx.userId);
      if (userIndex !== -1 && tx.packageKey) {
        db.users[userIndex].currentPackage = tx.packageKey;
      }
      saveDB(db);
      return res.json({ 
        success: true, 
        message: `৳${tx.amount.toLocaleString()} টাকার ডিপোজিট ও (${tx.packageName || 'প্যাকেজ'}) সফলভাবে অনুমোদন করা হয়েছে!` 
      });
    }

    if (action === 'reject') {
      tx.status = 'Rejected';
      saveDB(db);
      return res.json({ success: true, message: 'ডিপোজিট আবেদনটি বাতিল করা হয়েছে।' });
    }

    return res.status(400).json({ success: false, message: 'অবৈধ অ্যাকশন।' });
  });

  // GET Official Deposit Payment Numbers
  app.get('/api/payment-numbers', (req, res) => {
    const db = getDB();
    return res.json({
      success: true,
      paymentNumbers: db.paymentNumbers || { bkash: '01601499628', nagad: '01601499628', rocket: '01601499628' }
    });
  });

  // Update Official Payment Numbers
  app.post('/api/admin/payment-numbers', (req, res) => {
    const { bkash, nagad, rocket } = req.body;
    const db = getDB();

    db.paymentNumbers = {
      bkash: bkash ? String(bkash).trim() : (db.paymentNumbers?.bkash || '01601499628'),
      nagad: nagad ? String(nagad).trim() : (db.paymentNumbers?.nagad || '01601499628'),
      rocket: rocket ? String(rocket).trim() : (db.paymentNumbers?.rocket || '01601499628')
    };

    saveDB(db);
    return res.json({
      success: true,
      paymentNumbers: db.paymentNumbers,
      message: 'ডিপোজিট পেমেন্ট নম্বরসমূহ সফলভাবে আপডেট করা হয়েছে।'
    });
  });

  // Update overall Settings
  app.post('/api/admin/settings', (req, res) => {
    const { dailyBonusAmount, activityTickerActive } = req.body;
    const db = getDB();

    if (dailyBonusAmount !== undefined) db.dailyBonusAmount = parseFloat(dailyBonusAmount);
    if (activityTickerActive !== undefined) db.activityTickerActive = !!activityTickerActive;

    saveDB(db);
    return res.json({
      success: true,
      settings: {
        dailyBonusAmount: db.dailyBonusAmount,
        activityTickerActive: db.activityTickerActive
      },
      message: 'সেটিংস সফলভাবে সংরক্ষিত হয়েছে।'
    });
  });

  // Manage User Actions (Add/Deduct balance, toggle Admin role, change Package)
  app.post('/api/admin/users/action', (req, res) => {
    const { targetUserId, action, amount, newPackage } = req.body;
    if (!targetUserId || !action) {
      return res.status(400).json({ success: false, message: 'ইউজার আইডি ও অ্যাকশন প্রয়োজন।' });
    }

    const db = getDB();
    const userIndex = db.users.findIndex(u => u.id === targetUserId);
    if (userIndex === -1) {
      return res.status(404).json({ success: false, message: 'ব্যবহারকারী খুঁজে পাওয়া যায়নি।' });
    }

    const targetUser = db.users[userIndex];

    if (action === 'add-balance') {
      const numAmount = parseFloat(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        return res.status(400).json({ success: false, message: 'সঠিক ব্যালেন্স পরিমাণ প্রদান করুন।' });
      }
      targetUser.balance += numAmount;
      targetUser.totalEarnings += numAmount;
      
      const newTx: Transaction = {
        id: 'ADMIN-CREDIT-' + Date.now(),
        userId: targetUser.id,
        username: targetUser.username,
        amount: numAmount,
        type: 'bonus',
        completionTime: new Date().toLocaleString('bn-BD'),
        status: 'Credited',
        createdDate: new Date().toISOString()
      };
      db.transactions.push(newTx);
      saveDB(db);
      return res.json({ success: true, message: `৳${numAmount} ব্যালেন্স সফলভাবে যুক্ত হয়েছে!`, user: targetUser });
    }

    if (action === 'deduct-balance') {
      const numAmount = parseFloat(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        return res.status(400).json({ success: false, message: 'সঠিক ব্যালেন্স পরিমাণ প্রদান করুন।' });
      }
      targetUser.balance = Math.max(0, targetUser.balance - numAmount);
      saveDB(db);
      return res.json({ success: true, message: `৳${numAmount} ব্যালেন্স কাটা হয়েছে!`, user: targetUser });
    }

    if (action === 'toggle-admin') {
      targetUser.isAdmin = !targetUser.isAdmin;
      saveDB(db);
      return res.json({ success: true, message: `অ্যাডমিন পারমিশন ${targetUser.isAdmin ? 'দেওয়া হয়েছে' : 'সরিয়ে নেওয়া হয়েছে'}।`, user: targetUser });
    }

    if (action === 'change-package') {
      if (!newPackage || !PACKAGES_MAP[newPackage]) {
        return res.status(400).json({ success: false, message: 'অবৈধ প্যাকেজ নাম।' });
      }
      targetUser.currentPackage = newPackage;
      saveDB(db);
      return res.json({ success: true, message: `মেম্বারশিপ প্যাকেজ '${PACKAGES_MAP[newPackage].name}' এ পরিবর্তিত হয়েছে!`, user: targetUser });
    }

    return res.status(400).json({ success: false, message: 'অবৈধ অ্যাকশন।' });
  });

  // ----------------------------------------
  // INTEGRATE VITE FOR DEV / PRODUCTION SERVING
  // ----------------------------------------
  async function startServer() {
    if (process.env.VERCEL) {
      // Vercel serverless environment handles routing via api/index.ts.
      // Static assets are served directly by Vercel Edge CDN. Do not initialize Vite dev server.
      return;
    }

    const isProd = process.env.NODE_ENV === 'production' && fs.existsSync(path.resolve(__dirname, 'dist/index.html'));
    if (!isProd) {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'custom'
      });
      app.use(vite.middlewares);

      app.use('*', async (req, res, next) => {
        const url = req.originalUrl;
        if (url.startsWith('/api')) {
          return res.status(404).json({ success: false, message: 'এপিআই রুটটি পাওয়া যায়নি।' });
        }
        try {
          let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
          template = await vite.transformIndexHtml(url, template);
          res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
        } catch (e) {
          vite.ssrFixStacktrace(e as Error);
          next(e);
        }
      });
    } else {
      // Serve production static assets
      app.use(express.static(path.resolve(__dirname, 'dist')));
      app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'dist/index.html'));
      });
    }

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`[VidEarn] Server running successfully on port ${port}`);
    });
  }

  startServer();

  export default app;
