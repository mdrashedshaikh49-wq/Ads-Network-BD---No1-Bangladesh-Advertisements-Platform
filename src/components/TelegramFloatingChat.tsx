import React, { useState, useEffect, useRef } from 'react';
import { Send, X, ExternalLink, MessageCircle, Check, CheckCheck, Info, ChevronRight, Sparkles, Volume2, Users, ArrowRight, Bell, Share2 } from 'lucide-react';

// Import high-fidelity generated portraits of the 4 Bangladeshi female AI agents
import sadiaImg from '../assets/images/agent_sadia_portrait_1791131756822.jpg';
import nusratImg from '../assets/images/agent_nusrat_portrait_1791131776223.jpg';
import anikaImg from '../assets/images/agent_anika_portrait_1791131793442.jpg';
import farihaImg from '../assets/images/agent_fariha_portrait_1791131806097.jpg';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user' | 'system';
  text: string;
  timestamp: string;
  ctaButton?: {
    text: string;
    url: string;
  };
}

interface ChannelPost {
  id: string;
  adminName: string;
  avatarBg: string;
  initials: string;
  text: string;
  views: number;
  time: string;
  date: string;
  paymentProof?: {
    user: string;
    amount: number;
    method: string;
    trxId: string;
    status: string;
  };
  imagePreview?: string;
}

interface Agent {
  id: string;
  name: string;
  role: string;
  bnRole: string;
  greeting: string;
  initials: string;
  focus: 'general' | 'payment' | 'membership' | 'technical';
  themeColor: string;
  textColor: string;
  imageSrc: string;
  renderFallbackSvg: () => React.ReactNode;
}

interface FAQOption {
  key: string;
  label: string;
  response: string;
  ctaText: string;
  ctaUrl: string;
}

export default function TelegramFloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'agents' | 'channel'>('agents');
  const [activeAgentId, setActiveAgentId] = useState<string>(() => {
    const ids = ['sadia', 'nusrat', 'anika', 'fariha'];
    return ids[Math.floor(Math.random() * ids.length)];
  });
  const [agentMessages, setAgentMessages] = useState<Record<string, ChatMessage[]>>({});
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  // Track image load errors to fall back to SVGs dynamically if needed
  const [avatarErrors, setAvatarErrors] = useState<Record<string, boolean>>({});
  
  // Simulated public channel posts stream
  const [channelPosts, setChannelPosts] = useState<ChannelPost[]>([]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const channelEndRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const channelLink = "https://t.me/Ads_NetworkBangladesh";

  // Female support agents data with imported image paths and handcrafted SVG fallbacks
  const AGENTS: Agent[] = [
    {
      id: 'sadia',
      name: 'Sadia Sultana (সাদিয়া)',
      role: 'Senior Customer Support',
      bnRole: 'সিনিয়র কাস্টমার সাপোর্ট',
      themeColor: '#be123c',
      textColor: 'text-rose-600',
      imageSrc: sadiaImg,
      greeting: 'আসসালামু আলাইকুম! আমি সাদিয়া সুলতানা। 🌸 Ads Network BD-তে বিজ্ঞাপন দেখে কিভাবে সহজে দৈনিক নিশ্চিত আয় করবেন, তা আমি আপনাকে বুঝিয়ে দেবো। এখানে রেজিস্ট্রেশন করা একদম ফ্রী! যেকোনো প্রশ্ন করতে পারেন।',
      initials: 'SS',
      focus: 'general',
      renderFallbackSvg: () => (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id="grad-sadia" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#fda4af" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="50" fill="url(#grad-sadia)" />
          <path d="M22,76 Q50,42 78,76 Z" fill="#e11d48" />
          <ellipse cx="50" cy="46" rx="16" ry="19" fill="#fed7aa" />
          <path d="M34,41 Q50,21 66,41 Q50,29 34,41 Z" fill="#e11d48" />
          <path d="M34,41 Q32,53 40,64 Q50,67 60,64 Q68,53 66,41 Q50,51 34,41 Z" fill="#be123c" />
          <ellipse cx="50" cy="47" rx="13" ry="14" fill="#fed7aa" />
          <circle cx="44" cy="45" r="1.5" fill="#1e293b" />
          <circle cx="56" cy="45" r="1.5" fill="#1e293b" />
          <circle cx="41" cy="49" r="2.2" fill="#f43f5e" opacity="0.45" />
          <circle cx="59" cy="49" r="2.2" fill="#f43f5e" opacity="0.45" />
          <path d="M47,53 Q50,56 53,53" stroke="#be123c" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          <path d="M41,63 L50,86 L59,63 Z" fill="#9f1239" />
        </svg>
      )
    },
    {
      id: 'nusrat',
      name: 'Nusrat Jahan (নুসরাত)',
      role: 'Payment Verification Officer',
      bnRole: 'পেমেন্ট ভেরিফিকেশন অফিসার',
      themeColor: '#6d28d9',
      textColor: 'text-violet-600',
      imageSrc: nusratImg,
      greeting: 'হ্যালো! আমি নুসরাত জাহান। 💸 বিকাশ, নগদ বা রকেটে পেমেন্ট ও উইথড্র সংক্রান্ত তথ্য ভেরিফাই করতে আমি আপনাদের সাহায্য করি। আপনি কি উইথড্র দিয়েছেন নাকি পেমেন্ট প্রুফ স্ক্রিনশট দেখতে চান?',
      initials: 'NJ',
      focus: 'payment',
      renderFallbackSvg: () => (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id="grad-nusrat" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="50" fill="url(#grad-nusrat)" />
          <path d="M22,82 Q50,58 78,82 Z" fill="#6d28d9" />
          <ellipse cx="50" cy="46" rx="16" ry="18" fill="#fecdd3" />
          <path d="M31,45 Q31,23 50,23 Q69,23 69,45 L72,58 Q62,35 50,35 Q38,35 28,58 Z" fill="#1e1b4b" />
          <circle cx="44" cy="46" r="1.5" fill="#1e293b" />
          <circle cx="56" cy="46" r="1.5" fill="#1e293b" />
          <rect x="38" y="42" width="11" height="8" rx="2" stroke="#be123c" strokeWidth="1.5" fill="none" />
          <rect x="51" y="42" width="11" height="8" rx="2" stroke="#be123c" strokeWidth="1.5" fill="none" />
          <line x1="49" y1="46" x2="51" y2="46" stroke="#be123c" strokeWidth="1.5" />
          <path d="M46,54 Q50,57 54,54" stroke="#4c1d95" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        </svg>
      )
    },
    {
      id: 'anika',
      name: 'Anika Rahman (আনিকা)',
      role: 'Membership Guideline Manager',
      bnRole: 'মেম্বারশিপ গাইডলাইন ম্যানেজার',
      themeColor: '#b45309',
      textColor: 'text-amber-600',
      imageSrc: anikaImg,
      greeting: 'আসসালামু আলাইকুম, আমি আনিকা রহমান। 🚀 আমাদের ১টি ফ্রী ট্রায়াল এবং ৮টি স্পেশাল ইনকাম মেম্বারশিপ প্যাকেজ (যেমন Gold, Elite) এবং অতিরিক্ত রেফারাল বোনাস সম্পর্কে বিস্তারিত গাইড করতে আমি প্রস্তুত। আপনার আয়ের মাত্রা বাড়িয়ে নিতে যেকোনো সাহায্য লাগলে জানান!',
      initials: 'AR',
      focus: 'membership',
      renderFallbackSvg: () => (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id="grad-anika" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#fef08a" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="50" fill="url(#grad-anika)" />
          <path d="M22,82 Q50,60 78,82 Z" fill="#b45309" />
          <ellipse cx="50" cy="46" rx="16" ry="18" fill="#ffedd5" />
          <path d="M32,44 Q30,22 50,20 Q70,22 68,44 L72,66 Q65,30 50,30 Q35,30 28,66 Z" fill="#451a03" />
          <circle cx="35" cy="28" r="3.5" fill="#ec4899" />
          <circle cx="50" cy="38" r="1.8" fill="#dc2626" />
          <circle cx="44" cy="45" r="1.5" fill="#1e293b" />
          <circle cx="56" cy="45" r="1.5" fill="#1e293b" />
          <path d="M45,53 Q50,56 55,53" stroke="#78350f" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        </svg>
      )
    },
    {
      id: 'fariha',
      name: 'Fariha Islam (ফারিহা)',
      role: 'Technical Support Expert',
      bnRole: 'টেকনিক্যাল সাপোর্ট এক্সপার্ট',
      themeColor: '#047857',
      textColor: 'text-emerald-600',
      imageSrc: farihaImg,
      greeting: 'হাই! আমি ফারিহা ইসলাম। 🛠 অ্যাকাউন্ট লগইন সমস্যা, নতুন আইডি রেজিস্ট্রেশন এরর, ভুল পাসওয়ার্ড পরিবর্তন বা যেকোনো ব্রাউজার ও টেকনিক্যাল ট্রাবলশুটিং-এ আমি আপনাদের সাথে লাইভে আছি। আপনার কি টেকনিক্যাল সাপোর্ট প্রয়োজন?',
      initials: 'FI',
      focus: 'technical',
      renderFallbackSvg: () => (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id="grad-fariha" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#a7f3d0" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="50" fill="url(#grad-fariha)" />
          <path d="M22,82 Q50,58 78,82 Z" fill="#047857" />
          <ellipse cx="50" cy="46" rx="16" ry="18" fill="#ffedd5" />
          <path d="M32,45 Q32,24 50,24 Q68,24 68,45 L70,60 Q58,36 50,36 Q42,36 30,60 Z" fill="#0f172a" />
          <path d="M32,39 Q50,14 68,39" stroke="#334155" strokeWidth="2.8" fill="none" />
          <rect x="29" y="37" width="5.5" height="11" rx="1.8" fill="#1e293b" />
          <rect x="65" y="37" width="5.5" height="11" rx="1.8" fill="#1e293b" />
          <path d="M31,45 Q33,58 45,56" stroke="#334155" strokeWidth="1.8" fill="none" />
          <circle cx="45" cy="56" r="1.8" fill="#334155" />
          <circle cx="44" cy="45" r="1.5" fill="#1e293b" />
          <circle cx="56" cy="45" r="1.5" fill="#1e293b" />
          <path d="M46,53 Q50,56 54,53" stroke="#065f46" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        </svg>
      )
    }
  ];

  const currentAgent = AGENTS.find(a => a.id === activeAgentId) || AGENTS[0];

  const faqOptions: FAQOption[] = [
    {
      key: 'how_to_start',
      label: '১. কিভাবে কাজ শুরু করবো?',
      response: '১. প্রথমে ১ মিনিটে ফ্রি রেজিস্ট্রেশন সম্পন্ন করুন।\n২. ওয়াচ (Watch) সেকশন থেকে আপনার দৈনিক লিমিট অনুযায়ী ভিডিও অ্যাড দেখুন।\n৩. প্রতিটি অ্যাড দেখার পর নিশ্চিত টাকা সরাসরি আপনার ওয়ালেটে যোগ হবে।\n\nলাইভ সাহায্য পেতে ও আমাদের বিশাল মেম্বার কমিউনিটিতে কথা বলতে নিচের বাটনে ক্লিক করুন।',
      ctaText: '👉 জয়েন টেলিগ্রাম চ্যানেল',
      ctaUrl: channelLink
    },
    {
      key: 'payment_time',
      label: '২. পেমেন্ট পেতে কত সময় লাগে?',
      response: 'আমাদের পেমেন্ট সিস্টেম অত্যন্ত দ্রুত ও বিশ্বস্ত! বিকাশ, নগদ বা রকেটের মাধ্যমে উইথড্র দেওয়ার পর সাধারণত ১০ থেকে ৩০ মিনিটের মধ্যে আপনার পেমেন্ট সম্পন্ন করা হয়।\n\nগ্রুপের আজকের হাজারো লাইভ পেমেন্ট প্রুফ ও স্ক্রিনশট দেখতে নিচে ক্লিক করুন।',
      ctaText: '👉 লাইভ পেমেন্ট প্রুফ দেখুন',
      ctaUrl: channelLink
    },
    {
      key: 'earning_limit',
      label: '৩. দৈনিক কত টাকা আয় করা সম্ভব?',
      response: 'ফ্রি ট্রায়াল প্ল্যানে দৈনিক ১০টি বিজ্ঞাপনে ৳১০০ পর্যন্ত আয় করতে পারবেন। এছাড়া আমাদের প্রিমিয়াম কমার্শিয়াল মেম্বারশিপ প্যাকেজে (যেমন Silver, Gold, Platinum, Elite) দৈনিক ৳৫০০ থেকে ৳৫,০০০+ টাকা পর্যন্ত নিশ্চিত আয়ের সুযোগ রয়েছে!\n\nসবচেয়ে সেরা লাভজনক প্যাকেজ সম্পর্কে বিস্তারিত তথ্য আমাদের চ্যানেলে নিয়মিত শেয়ার করা হয়।',
      ctaText: '👉 প্যাকেজ ও বোনাস আপডেট',
      ctaUrl: channelLink
    },
    {
      key: 'admin_support',
      label: '৪. সরাসরি এডমিন সাপোর্ট দরকার',
      response: 'কোনো চিন্তা করবেন না! আমাদের টেলিগ্রাম গ্রুপ ও চ্যানেলে সরাসরি ২ জন প্রধান এডমিন এবং সাপোর্ট টিম ২৪ ঘণ্টা সক্রিয় আছেন। আপনার যেকোনো পেমেন্ট বা টেকনিক্যাল সমস্যা সমাধানে চ্যানেল লিংকে ক্লিক করে আমাদের ইনবক্সে নক দিন।',
      ctaText: '👉 সরাসরি এডমিনকে নক দিন',
      ctaUrl: channelLink
    }
  ];

  // Helper method to render agent's beautiful photograph with absolute zero-broken-image SVG fallback
  const renderAgentAvatar = (agent: Agent) => {
    if (avatarErrors[agent.id]) {
      return agent.renderFallbackSvg();
    }
    return (
      <img 
        src={agent.imageSrc} 
        alt={agent.name} 
        referrerPolicy="no-referrer"
        onError={() => setAvatarErrors(prev => ({ ...prev, [agent.id]: true }))}
        className="w-full h-full object-cover transition-all"
      />
    );
  };

  // Sound Engine
  const playNotificationSound = () => {
    if (isMuted) return;
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.setValueAtTime(880.00, ctx.currentTime + 0.08);
      
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {}
  };

  function getFormattedTime(): string {
    const date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutesStr} ${ampm}`;
  }

  // Prepopulate conversations & separate feed
  useEffect(() => {
    const prepopulated: Record<string, ChatMessage[]> = {};
    AGENTS.forEach(agent => {
      prepopulated[agent.id] = [
        {
          id: `sys-${agent.id}-1`,
          sender: 'system',
          text: `${agent.name} (${agent.bnRole}) এখন সক্রিয় আছেন`,
          timestamp: getFormattedTime()
        },
        {
          id: `bot-${agent.id}-1`,
          sender: 'bot',
          text: agent.greeting,
          timestamp: getFormattedTime(),
          ctaButton: {
            text: '📢 আমাদের টেলিগ্রাম চ্যানেলে জয়েন করুন',
            url: channelLink
          }
        }
      ];
    });
    setAgentMessages(prepopulated);

    // Channel posts
    const initialPosts: ChannelPost[] = [
      {
        id: 'post-1',
        adminName: 'Sajjad Rahman (Founder)',
        avatarBg: 'bg-blue-600',
        initials: 'SR',
        text: 'আসসালামু আলাইকুম সবাইকে! 💙 Ads Network BD-এর অফিসিয়াল টেলিগ্রাম ইনফো চ্যানেলে আপনাকে স্বাগতম।\n\nদেশের ১০০০+ শীর্ষ ব্র্যান্ডের অনুমোদিত ভিডিও অ্যাড দেখে সবচেয়ে দ্রুত, বিশ্বস্ত ও সম্পূর্ণ ফ্রীতে পেমেন্ট পাবার নির্ভরযোগ্য প্ল্যাটফর্ম এটি। প্রতিদিনের সমস্ত অফিসিয়াল আপডেট, ক্যাশআউট লিস্ট এবং পেমেন্ট রিলিজ স্ক্রিনশট সরাসরি এই ফিডে পেয়ে যাবেন। চ্যানেলের সাথে থাকুন এবং নিরাপদে আয় করুন!',
        views: 1420,
        time: '10:15 AM',
        date: 'আজ'
      },
      {
        id: 'post-2',
        adminName: 'Nusrat Jahan (Verification)',
        avatarBg: 'bg-violet-600',
        initials: 'NJ',
        text: '✅ আজকের ১০০০+ মেম্বার পেমেন্ট ক্লিয়ার আপডেট!\n\nআমাদের ফাইনান্স ভেরিফিকেশন টিম আজ সকালের সকল বিকাশ ও নগদ উইথড্রাল সফলভাবে সম্পন্ন করেছে। মেম্বারদের সুবিধার জন্য নিচের পেমেন্ট রিলিজ ডাটাটি সরাসরি প্রকাশ করা হলো। সবাই বিজ্ঞাপন দেখুন এবং নিশ্চিত ওয়ালেট ক্যাশআউট বুঝে নিন।',
        views: 1890,
        time: '11:42 AM',
        date: 'আজ',
        paymentProof: {
          user: '017***8920',
          amount: 3500,
          method: 'bKash (বিকাশ Personal)',
          trxId: 'TRX9A83KD92L4',
          status: 'SUCCESS (সফল)'
        }
      },
      {
        id: 'post-3',
        adminName: 'Anika Rahman (Manager)',
        avatarBg: 'bg-amber-600',
        initials: 'AR',
        text: '🚀 বিশেষ মেম্বারশিপ প্ল্যান ও বোনাস আপডেট!\n\nনতুন মেম্বারদের জন্য আকর্ষণীয় সুখবর! আমাদের গোল্ড (Gold) অথবা প্লাটিনাম (Platinum) মেম্বারশিপ প্যাকেজে আপগ্রেড করলে প্রতিটি ভিডিও বিজ্ঞাপনের রেট ৫ গুণ পর্যন্ত বেড়ে ৳৫০ হয়ে যাবে এবং আপনার দৈনিক ওয়াচ লিমিট ৩০টি ভিডিওতে উন্নীত হবে। বাড়তি আয় ও নিশ্চিত মোবাইল ক্যাশআউট উপভোগ করতে এখনই ড্যাশবোর্ড থেকে আপগ্রেড করুন!',
        views: 2240,
        time: '12:30 PM',
        date: 'আজ'
      }
    ];
    setChannelPosts(initialPosts);

    const timer = setTimeout(() => {
      setShowNotification(true);
      playNotificationSound();
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  // Smooth scrolls
  useEffect(() => {
    if (currentView === 'agents' && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    } else if (currentView === 'channel' && channelEndRef.current) {
      channelEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [agentMessages, channelPosts, currentView, isTyping]);

  // Simulated real-time channel updates
  useEffect(() => {
    const channelTimer = setInterval(() => {
      if (!isOpen) return;

      const mockUsers = ['017***1102', '019***4459', '018***6670', '015***3380', '013***9910'];
      const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
      const randomAmt = Math.floor(Math.random() * 8) * 500 + 1000;
      const methods = ['bKash', 'Nagad', 'Rocket'];
      const randomMethod = methods[Math.floor(Math.random() * methods.length)];

      const newPost: ChannelPost = {
        id: `post-auto-${Date.now()}`,
        adminName: 'Ads Network BD Auto-Feed',
        avatarBg: 'bg-[#0088cc]',
        initials: 'ANB',
        text: `👥 মেম্বার জয়েনিং ও উইথড্র ট্র্যাকার:\n\nঅপূর্ব সাফল্য! মেম্বার ${randomUser} এইমাত্র সফলভাবে ${randomMethod} এর মাধ্যমে ৳${randomAmt} উইথড্র বুঝে নিয়েছেন। আমাদের চমৎকার পরিবারে যুক্ত হতে ও লাইভ চ্যাট করতে আমাদের চ্যানেলে জয়েন করুন।`,
        views: Math.floor(Math.random() * 400) + 100,
        time: getFormattedTime(),
        date: 'আজ',
        paymentProof: {
          user: randomUser,
          amount: randomAmt,
          method: `${randomMethod} (পার্সোনাল)`,
          trxId: 'TRX' + Math.random().toString(36).substring(2, 10).toUpperCase(),
          status: 'SUCCESSFUL'
        }
      };

      setChannelPosts(prev => [...prev, newPost]);
      playNotificationSound();
    }, 35000);

    return () => clearInterval(channelTimer);
  }, [isOpen]);

  const handleOpenChat = () => {
    setIsOpen(true);
    setShowNotification(false);
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  };

  const handleAgentSwitch = (agentId: string) => {
    setActiveAgentId(agentId);
    playNotificationSound();
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: inputText,
      timestamp: getFormattedTime()
    };

    setAgentMessages(prev => ({
      ...prev,
      [activeAgentId]: [...(prev[activeAgentId] || []), userMsg]
    }));

    const query = inputText;
    setInputText('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query, agentId: activeAgentId })
      });
      const data = await res.json();
      
      setIsTyping(false);
      let replyText = data.success ? data.text : 'দুঃখিত, এই মুহূর্তে আমি আপনার মেসেজটি প্রসেস করতে পারছি না। দয়া করে আবার চেষ্টা করুন।';
      
      let ctaText = '👉 জয়েন টেলিগ্রাম চ্যানেল';
      if (activeAgentId === 'nusrat') {
        ctaText = '👉 পেমেন্ট প্রুফ গ্যালারি';
      } else if (activeAgentId === 'anika') {
        ctaText = '👉 মেম্বারশিপ স্পেশাল অফার';
      } else if (activeAgentId === 'fariha') {
        ctaText = '👉 সরাসরি আইডি সাপোর্ট নিন';
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: replyText,
        timestamp: getFormattedTime(),
        ctaButton: {
          text: ctaText,
          url: channelLink
        }
      };

      setAgentMessages(prev => ({
        ...prev,
        [activeAgentId]: [...(prev[activeAgentId] || []), botMsg]
      }));
      playNotificationSound();
    } catch (err) {
      console.error('Failed to get AI reply:', err);
      setIsTyping(false);
      
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: 'দুঃখিত, নেটওয়ার্ক কানেকশন প্রবলেমের কারণে আমি উত্তর দিতে পারছি না। আমাদের অফিসিয়াল টেলিগ্রাম চ্যানেলে যোগাযোগ করতে পারেন।',
        timestamp: getFormattedTime(),
        ctaButton: {
          text: '👉 জয়েন টেলিগ্রাম চ্যানেল',
          url: channelLink
        }
      };
      setAgentMessages(prev => ({
        ...prev,
        [activeAgentId]: [...(prev[activeAgentId] || []), botMsg]
      }));
    }
  };

  const handleFAQClick = (faq: FAQOption) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: faq.label,
      timestamp: getFormattedTime()
    };

    setAgentMessages(prev => ({
      ...prev,
      [activeAgentId]: [...(prev[activeAgentId] || []), userMsg]
    }));
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const finalResponse = `[${currentAgent.name}]: ${faq.response}`;

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: finalResponse,
        timestamp: getFormattedTime(),
        ctaButton: {
          text: faq.ctaText,
          url: faq.ctaUrl
        }
      };

      setAgentMessages(prev => ({
        ...prev,
        [activeAgentId]: [...(prev[activeAgentId] || []), botMsg]
      }));
      playNotificationSound();
    }, 800);
  };

  const activeMessages = agentMessages[activeAgentId] || [];

  return (
    <>
      {/* ----------------------------------------
          FLOATING ACTION BUTTON (FAB) & TOAST ALERT
          ---------------------------------------- */}
      <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end gap-3 pointer-events-none">
        
        {/* Female AI Agent Notification Callout */}
        {showNotification && !isOpen && (
          <div className="bg-slate-900 text-white rounded-2xl shadow-2xl p-4 max-w-[290px] sm:max-w-[340px] border border-slate-800 flex items-start gap-3 pointer-events-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-rose-500 rounded-l-2xl"></div>
            
            <div className="pl-1.5 flex-1 text-left">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-rose-400 font-mono">
                  Live Support Agent Active
                </span>
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowNotification(false); }}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer p-0.5 rounded-full hover:bg-slate-800"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              
              {/* Showcase Active Girl */}
              <div className="flex items-center gap-1.5 mb-2.5">
                <div className="w-7 h-7 rounded-full border-2 border-slate-900 overflow-hidden bg-slate-800 shrink-0 shadow-md">
                  {renderAgentAvatar(currentAgent)}
                </div>
                <span className="text-[10px] text-slate-300 font-bold ml-1">
                  কাস্টমার এজেন্ট {currentAgent.name} লাইভ আছেন!
                </span>
              </div>

              <p className="text-[12px] font-black leading-snug text-slate-100">
                পেমেন্ট ভেরিফিকেশন ও সাপোর্ট নিয়ে সাহায্য দরকার?
              </p>
              <p className="text-[11px] text-slate-300 mt-1">
                আমাদের লাইভ চ্যাটে যুক্ত হয়ে দ্রুত সহযোগিতা বুঝে নিন।
              </p>
              
              <div className="mt-3 flex items-center gap-2">
                <button 
                  onClick={handleOpenChat}
                  className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black rounded-lg transition-all cursor-pointer shadow-sm flex items-center gap-1"
                >
                  চ্যাট শুরু করুন <ArrowRight className="w-3 h-3" />
                </button>
                <a 
                  href={channelLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold rounded-lg transition-all flex items-center gap-1"
                >
                  চ্যানেল লিঙ্ক <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Bubble Button */}
        <button
          onClick={() => isOpen ? setIsOpen(false) : handleOpenChat()}
          className="pointer-events-auto relative group flex items-center gap-2.5 px-4 py-3 sm:py-3.5 bg-gradient-to-r from-rose-600 via-[#0088cc] to-[#229ED9] text-white font-extrabold rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
          aria-label="Telegram Live Chat"
        >
          {!isOpen && (
            <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4.5 w-4.5 bg-emerald-500 text-[9px] font-black flex items-center justify-center font-mono shadow-sm">
                ●
              </span>
            </span>
          )}

          <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-900 border border-slate-700/50 shrink-0 relative mr-1">
            {renderAgentAvatar(currentAgent)}
            <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-emerald-400 ring-1 ring-white"></span>
          </div>
          
          <div className="flex flex-col items-start leading-tight">
            <span className="text-xs font-black tracking-wide">কাস্টমার সাপোর্ট (লাইভ)</span>
            <span className="text-[10px] text-sky-100 font-bold hidden sm:inline">{currentAgent.name} সক্রিয় আছেন</span>
          </div>

          <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-90' : 'group-hover:translate-x-0.5'}`} />
        </button>
      </div>

      {/* ----------------------------------------
          UNIFIED TELEGRAM PANEL (CHATS & SEPARATE CHANNEL)
          ---------------------------------------- */}
      {isOpen && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 z-50 w-full sm:w-[420px] h-full sm:h-[650px] bg-[#f0f4f8] rounded-none sm:rounded-3xl shadow-2xl border-none sm:border sm:border-slate-200/80 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-300">
          
          {/* Main Top Header */}
          <div className="bg-[#0088cc] text-white flex flex-col shrink-0 shadow-md">
            
            {/* Top Bar Context */}
            <div className="px-3.5 py-3 flex items-center justify-between border-b border-white/10 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-sky-400/10 to-transparent pointer-events-none"></div>
              
              <div className="flex items-center gap-2.5 relative z-10 text-left">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-black">
                  💬
                </div>
                <div>
                  <h4 className="text-sm font-black tracking-tight leading-tight flex items-center gap-1.5">
                    Ads Network BD
                    <span className="bg-emerald-500 text-white text-[8px] font-black px-1.5 py-0.2 rounded uppercase tracking-wider font-mono">
                      Official
                    </span>
                  </h4>
                  <p className="text-[10px] text-sky-100 font-medium">১২,৪৫০+ মেম্বার · কাস্টমার অ্যাসিস্ট্যান্ট সক্রিয়</p>
                </div>
              </div>

              <div className="flex items-center gap-1 relative z-10">
                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-1.5 rounded-lg hover:bg-white/15 transition-colors cursor-pointer ${isMuted ? 'text-sky-200/50' : 'text-white'}`}
                  title={isMuted ? "শব্দ অন করুন" : "শব্দ বন্ধ করুন"}
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/15 transition-colors text-white cursor-pointer"
                  title="চ্যাট বন্ধ করুন"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* SEPARATE CHANNELS VIEW SWITCHER */}
            <div className="bg-[#0077b3] px-3 py-2 flex gap-2 border-b border-white/5 shrink-0">
              <button
                onClick={() => setCurrentView('agents')}
                className={`flex-1 py-1.5 text-[11px] font-black rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  currentView === 'agents' 
                    ? 'bg-white text-[#0088cc] shadow-sm' 
                    : 'text-sky-100 hover:bg-white/10'
                }`}
              >
                💬 লাইভ কাস্টমার সাপোর্ট (অনলাইন)
              </button>
              
              <button
                onClick={() => setCurrentView('channel')}
                className={`flex-1 py-1.5 text-[11px] font-black rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  currentView === 'channel' 
                    ? 'bg-rose-600 text-white shadow-sm' 
                    : 'text-sky-100 hover:bg-white/10'
                }`}
              >
                📢 অফিসিয়াল চ্যানেল (ফিড)
              </button>
            </div>

          </div>

          {/* ----------------------------------------
              VIEW 1: PRIVATE CHATS WITH 4 GIRLS
              ---------------------------------------- */}
          {currentView === 'agents' && (
            <>
              {/* Manual Selection Carousel Removed for Automated 1-on-1 experience */}

              {/* Active Agent Pinned Info Strip */}
              <div className="bg-sky-50 px-3.5 py-1.5 text-xs border-b border-sky-100 flex items-center justify-between shrink-0 text-left">
                <div className="flex items-center gap-2 truncate text-slate-700">
                  <span className="px-1.5 py-0.2 rounded-sm text-[8px] font-black text-white bg-rose-600 uppercase font-mono tracking-wider shrink-0">
                    CHAT WITH
                  </span>
                  <div className="w-5.5 h-5.5 rounded-full overflow-hidden bg-slate-200 shrink-0 border border-slate-300">
                    {renderAgentAvatar(currentAgent)}
                  </div>
                  <span className="font-extrabold text-slate-800 text-[11px] truncate">
                    {currentAgent.name} · <span className={`${currentAgent.textColor} font-black`}>{currentAgent.bnRole}</span>
                  </span>
                </div>
              </div>

              {/* Chat Messages Field */}
              <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 bg-[#f5f7fa] scrollbar-thin">
                {activeMessages.map((msg) => {
                  if (msg.sender === 'system') {
                    return (
                      <div key={msg.id} className="flex justify-center my-1">
                        <span className="bg-slate-300/30 text-slate-500 font-bold px-3 py-0.5 rounded-full text-[9px] tracking-wide uppercase font-mono">
                          {msg.text}
                        </span>
                      </div>
                    );
                  }

                  const isBot = msg.sender === 'bot';
                  return (
                    <div 
                      key={msg.id} 
                      className={`flex ${isBot ? 'justify-start' : 'justify-end'} animate-in fade-in slide-in-from-bottom-2 duration-200`}
                    >
                      <div className={`max-w-[90%] rounded-2xl p-3 shadow-xs relative text-left ${
                        isBot 
                          ? 'bg-white text-slate-800 rounded-tl-xs border border-slate-100' 
                          : 'bg-[#d9fdd3] text-slate-900 rounded-tr-xs border border-green-200/40'
                      }`}>
                        
                        {isBot && (
                          <span className="block text-[9.5px] font-black text-[#0088cc] mb-1">
                            {currentAgent.name}
                          </span>
                        )}

                        <p className="text-sm sm:text-xs leading-relaxed font-semibold whitespace-pre-line text-slate-800">
                          {msg.text}
                        </p>

                        {msg.ctaButton && (
                          <div className="mt-2.5">
                            <a
                              href={msg.ctaButton.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#0088cc] hover:bg-[#0077b3] text-white text-[11px] font-black rounded-xl transition-all shadow-xs cursor-pointer text-center w-full justify-center"
                            >
                              {msg.ctaButton.text}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        )}

                        <div className="flex items-center justify-end gap-1 mt-1 text-[8px] text-slate-400 font-mono text-right">
                          <span>{msg.timestamp}</span>
                          {!isBot && (
                            <CheckCheck className="w-3 h-3 text-emerald-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Live Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start animate-pulse">
                    <div className="bg-white text-slate-500 rounded-2xl rounded-tl-xs p-3 border border-slate-100 shadow-xs flex items-center gap-1">
                      <span className="block text-[10px] font-black text-[#0088cc] mr-1">{currentAgent.name} is typing</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce duration-300"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce delay-100 duration-300"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce delay-200 duration-300"></span>
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* FAQ Options Area */}
              <div className="px-3.5 py-2 bg-white border-t border-slate-100 space-y-1.5 shrink-0 text-left">
                <span className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
                  {currentAgent.name}-কে সরাসরি জিজ্ঞেস করুন:
                </span>
                <div className="grid grid-cols-2 gap-1.5 max-h-[82px] overflow-y-auto pr-1">
                  {faqOptions.map((faq) => (
                    <button
                      key={faq.key}
                      onClick={() => handleFAQClick(faq)}
                      className="px-2.5 py-2 text-left text-[11px] font-bold text-slate-700 bg-slate-50 hover:bg-[#e1f3fc] hover:text-[#0088cc] border border-slate-200/60 rounded-xl transition-all cursor-pointer truncate"
                      title={faq.label}
                    >
                      {faq.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Input Form */}
              <form 
                onSubmit={handleSendMessage}
                className="p-3 bg-white border-t border-slate-100 flex items-center gap-2 shrink-0"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`${currentAgent.name}-কে মেসেজ লিখুন...`}
                  className="flex-1 px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-2xl text-sm sm:text-xs focus:outline-hidden focus:ring-1 focus:ring-[#0088cc] transition-all font-medium"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-2 bg-[#0088cc] hover:bg-[#0077b3] disabled:bg-slate-100 text-white disabled:text-slate-400 rounded-full transition-all cursor-pointer shadow-sm shrink-0"
                  title="মেসেজ পাঠান"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}

          {/* ----------------------------------------
              VIEW 2: SEPARATE OFFICIAL TELEGRAM CHANNEL
              ---------------------------------------- */}
          {currentView === 'channel' && (
            <>
              {/* Channel Header */}
              <div className="bg-[#0088cc] text-sky-100 px-4 py-2.5 text-xs text-left shrink-0 flex items-center justify-between border-b border-[#0077b3]">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center font-black shadow-inner font-mono text-xs">
                    AN
                  </div>
                  <div>
                    <h5 className="font-extrabold text-white text-[11.5px] leading-tight">Ads Network BD (অফিসিয়াল ইনফো)</h5>
                    <p className="text-[10px] text-sky-100">১২,৪৫০+ সাবস্ক্রাইবার · ব্রডকাস্ট চ্যানেল</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                  <span className="text-[10px] font-black text-white bg-rose-600 px-1.5 py-0.2 rounded font-mono">LIVE FEED</span>
                </div>
              </div>

              {/* Public Feed Stream */}
              <div className="flex-1 overflow-y-auto p-3.5 space-y-4 bg-[#e7ebf0] scrollbar-thin">
                {channelPosts.map((post) => (
                  <div 
                    key={post.id} 
                    className="bg-white rounded-2xl p-4 shadow-sm text-left max-w-[92%] mx-auto relative animate-in fade-in slide-in-from-bottom-2 duration-200 border border-slate-200/40"
                  >
                    <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full ${post.avatarBg} text-white flex items-center justify-center text-[10px] font-black font-mono`}>
                          {post.initials}
                        </div>
                        <span className="text-[11px] font-extrabold text-slate-800">
                          {post.adminName}
                        </span>
                      </div>
                      <span className="text-[9px] text-[#0088cc] font-black uppercase font-mono tracking-wider">
                        ★ ADMIN
                      </span>
                    </div>

                    <p className="text-[12px] leading-relaxed text-slate-700 whitespace-pre-line font-medium">
                      {post.text}
                    </p>

                    {post.paymentProof && (
                      <div className="mt-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-[11px] text-emerald-900 space-y-1.5 font-sans leading-relaxed shadow-inner">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-[10px] uppercase text-emerald-700 font-mono">RECEIPT CONFIRMED</span>
                          <span className="px-1.5 py-0.2 rounded text-[8px] font-black bg-emerald-600 text-white">SUCCESS</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">উইথড্র মেম্বার:</span>
                          <strong className="font-bold text-slate-800">{post.paymentProof.user}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">টাকার পরিমাণ:</span>
                          <strong className="font-black text-emerald-600 text-sm">৳{post.paymentProof.amount.toLocaleString()}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">পেমেন্ট মেথড:</span>
                          <strong className="font-bold text-slate-800">{post.paymentProof.method}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Transaction ID:</span>
                          <strong className="font-mono text-slate-700">{post.paymentProof.trxId}</strong>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-50 text-[10px] text-slate-400 font-mono">
                      <div className="flex items-center gap-1.5">
                        <span>👁 {post.views.toLocaleString()}</span>
                        <span>·</span>
                        <span>{post.time} ({post.date})</span>
                      </div>
                      <a 
                        href={channelLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0088cc] flex items-center gap-1 hover:underline font-bold"
                      >
                        <Share2 className="w-3 h-3" /> শেয়ার
                      </a>
                    </div>
                  </div>
                ))}
                
                <div ref={channelEndRef} />
              </div>

              {/* Join Channel Bar */}
              <div className="p-3 bg-white border-t border-slate-100 flex flex-col gap-2 shrink-0">
                <a 
                  href={channelLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 bg-[#0088cc] hover:bg-[#0077b3] text-white text-xs font-black rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 animate-pulse text-center"
                >
                  <Bell className="w-4 h-4" />
                  📢 জয়েন করুন আমাদের মূল চ্যানেলে (t.me)
                </a>
                <p className="text-[10px] text-slate-400 font-bold text-center">
                  চ্যানেলে জয়েন করলে প্রতিদিনের ডাবল-ইনকাম বোনাস কোড ফ্রী পেয়ে যাবেন!
                </p>
              </div>
            </>
          )}

          {/* Unified Core Footer Branding */}
          <div className="bg-slate-50 px-3 py-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono shrink-0">
            <span>Powered by Telegram Messenger</span>
            <a 
              href={channelLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0088cc] font-black hover:underline flex items-center gap-0.5"
            >
              t.me/adsnetworkbangladesh <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>

        </div>
      )}
    </>
  );
}
