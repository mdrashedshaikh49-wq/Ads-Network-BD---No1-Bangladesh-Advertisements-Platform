import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash, Check, Ban, Settings, Award, Video, MessageSquare, AlertCircle, Users, DollarSign, Shield, Search, RefreshCw, Layers, Wallet, Smartphone, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import PaymentLogoBadge from './PaymentLogos';

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
  currentPackage?: string;
}

interface VideoTask {
  id: string;
  title: string;
  category: string;
  duration: number;
  reward: number;
  url: string;
  thumbnail: string;
  description: string;
  available: boolean;
  isPaidOnly?: boolean;
  hideFromHome?: boolean;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
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

interface AdminPanelProps {
  onClose: () => void;
  onRefreshData: () => void;
}

const PACKAGE_OPTIONS = [
  { id: 'Free', name: 'Free (ফ্রি)' },
  { id: 'starter', name: 'Starter (৳৫০০)' },
  { id: 'basic', name: 'Basic (৳১,০০০)' },
  { id: 'standard', name: 'Standard (৳২,০০০)' },
  { id: 'silver', name: 'Silver (৳৩,০০০)' },
  { id: 'gold', name: 'Gold (৳৪,০০০)' },
  { id: 'platinum', name: 'Platinum (৳৫,০০০)' },
  { id: 'diamond', name: 'Diamond (৳৮,০০০)' },
  { id: 'elite', name: 'Elite (৳১০,০০০)' }
];

export default function AdminPanel({ onClose, onRefreshData }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'deposits' | 'withdrawals' | 'users' | 'videos' | 'payment-numbers' | 'faqs' | 'stats' | 'settings'>('deposits');
  
  // Loaded admin state
  const [adminData, setAdminData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Search filter
  const [userSearch, setUserSearch] = useState('');

  // Balance & Package Edit Modal States
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [balanceAmount, setBalanceAmount] = useState('');
  const [selectedPackage, setSelectedPackage] = useState('Free');
  const [modalAction, setModalAction] = useState<'add-balance' | 'deduct-balance' | 'change-package' | null>(null);

  // Form states - Stats
  const [registeredUsers, setRegisteredUsers] = useState('');
  const [videosWatched, setVideosWatched] = useState('');
  const [rewardsDistributed, setRewardsDistributed] = useState('');
  const [activeTasksCount, setActiveTasksCount] = useState('');

  // New video states
  const [vTitle, setVTitle] = useState('');
  const [vCategory, setVCategory] = useState('ঢাকাই জামদানি');
  const [vDuration, setVDuration] = useState('30');
  const [vReward, setVReward] = useState('100');
  const [vUrl, setVUrl] = useState('https://www.youtube.com/embed/p8ZshSOfmvs');
  const [vDesc, setVDesc] = useState('');
  const [vThumb, setVThumb] = useState('/src/assets/images/saree_jamdani_thumb_1790940620193.jpg');

  // New FAQ states
  const [fQuestion, setFQuestion] = useState('');
  const [fAnswer, setFAnswer] = useState('');

  // Official Payment Numbers
  const [bkashNum, setBkashNum] = useState('01601499628');
  const [nagadNum, setNagadNum] = useState('01601499628');
  const [rocketNum, setRocketNum] = useState('01601499628');

  // Settings
  const [bonusAmt, setBonusAmt] = useState('20');
  const [tickerActive, setTickerActive] = useState(true);

  // Fetch complete database state for admin
  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/data');
      const data = await res.json();
      if (data.success) {
        setAdminData(data);
        
        // Populate inputs
        setRegisteredUsers(data.stats.registeredUsers.toString());
        setVideosWatched(data.stats.videosWatched.toString());
        setRewardsDistributed(data.stats.rewardsDistributed.toString());
        setActiveTasksCount(data.stats.activeTasks.toString());
        
        setBonusAmt(data.settings.dailyBonusAmount.toString());
        setTickerActive(data.settings.activityTickerActive);

        if (data.paymentNumbers) {
          setBkashNum(data.paymentNumbers.bkash || '01601499628');
          setNagadNum(data.paymentNumbers.nagad || '01601499628');
          setRocketNum(data.paymentNumbers.rocket || '01601499628');
        }
      } else {
        setErrorMsg('অ্যাডমিন ডেটা লোড করতে ব্যর্থ হয়েছে।');
      }
    } catch (err) {
      setErrorMsg('সার্ভারের সাথে সংযোগ ত্রুটি ঘটেছে।');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Handle generic form submission response
  const triggerSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
    fetchAdminData();
    onRefreshData(); // Syncs root page statistics
  };

  // Deposit Request Action (Approve / Reject)
  const handleDepositAction = async (transactionId: string, action: 'approve' | 'reject') => {
    try {
      const res = await fetch('/api/admin/deposits/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId, action })
      });
      const data = await res.json();
      if (data.success) {
        triggerSuccess(data.message);
      } else {
        setErrorMsg(data.message || 'অ্যাকশন সম্পন্ন করা যায়নি।');
      }
    } catch (err) {
      setErrorMsg('সার্ভারে সংযোগ বিচ্ছিন্ন হয়েছে।');
    }
  };

  // Withdraw Request Action (Approve / Reject)
  const handleWithdrawalAction = async (transactionId: string, action: 'approve' | 'reject') => {
    try {
      const res = await fetch('/api/admin/withdrawals/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId, action })
      });
      const data = await res.json();
      if (data.success) {
        triggerSuccess(`উইথড্র আবেদনটি সফলভাবে ${action === 'approve' ? 'অনুমোদন' : 'বাতিল'} করা হয়েছে।`);
      } else {
        setErrorMsg(data.message || 'অ্যাকশন সম্পন্ন করা যায়নি।');
      }
    } catch (err) {
      setErrorMsg('সার্ভারে রিকোয়েস্ট পাঠাতে ব্যর্থ হয়েছে।');
    }
  };

  // Update Official Payment Numbers
  const handleSavePaymentNumbers = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/payment-numbers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bkash: bkashNum,
          nagad: nagadNum,
          rocket: rocketNum
        })
      });
      const data = await res.json();
      if (data.success) {
        triggerSuccess(data.message);
      } else {
        setErrorMsg(data.message || 'পেমেন্ট নম্বর আপডেট করা সম্ভব হয়নি।');
      }
    } catch (err) {
      setErrorMsg('সার্ভারে সেভ করতে সমস্যা হয়েছে।');
    }
  };

  // User Actions (Balance Add/Deduct, Toggle Admin, Change Package)
  const handleUserActionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !modalAction) return;

    try {
      const res = await fetch('/api/admin/users/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUserId: selectedUser.id,
          action: modalAction,
          amount: balanceAmount,
          newPackage: selectedPackage
        })
      });
      const data = await res.json();
      if (data.success) {
        triggerSuccess(data.message);
        setModalAction(null);
        setSelectedUser(null);
        setBalanceAmount('');
      } else {
        setErrorMsg(data.message || 'অ্যাকশন ব্যর্থ হয়েছে।');
      }
    } catch (err) {
      setErrorMsg('সার্ভারে রিকোয়েস্ট পাঠাতে ব্যর্থ হয়েছে।');
    }
  };

  const handleToggleAdmin = async (user: User) => {
    try {
      const res = await fetch('/api/admin/users/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUserId: user.id,
          action: 'toggle-admin'
        })
      });
      const data = await res.json();
      if (data.success) {
        triggerSuccess(data.message);
      }
    } catch (err) {
      setErrorMsg('অ্যাডমিন পারমিশন পরিবর্তন করা সম্ভব হয়নি।');
    }
  };

  // Submit Stats override
  const handleUpdateStats = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registeredUsers,
          videosWatched,
          rewardsDistributed,
          activeTasks: activeTasksCount
        })
      });
      const data = await res.json();
      if (data.success) {
        triggerSuccess('সিস্টেম পরিসংখ্যান সফলভাবে আপডেট করা হয়েছে।');
      }
    } catch (err) {
      setErrorMsg('পরিসংখ্যান সংরক্ষণ করা সম্ভব হয়নি।');
    }
  };

  // Submit Add Video task
  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vTitle || !vDesc) {
      setErrorMsg('ভিডিও শিরোনাম এবং বিবরণ আবশ্যক।');
      return;
    }

    try {
      const res = await fetch('/api/admin/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add',
          video: {
            title: vTitle,
            category: vCategory,
            duration: vDuration,
            reward: vReward,
            url: vUrl,
            description: vDesc,
            thumbnail: vThumb
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        setVTitle('');
        setVDesc('');
        triggerSuccess('নতুন ভিডিও ওয়াচ টাস্ক সফলভাবে তৈরি হয়েছে।');
      }
    } catch (err) {
      setErrorMsg('টাস্ক তৈরি করতে ত্রুটি হয়েছে।');
    }
  };

  // Submit Delete Video
  const handleDeleteVideo = async (id: string) => {
    try {
      const res = await fetch('/api/admin/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', video: { id } })
      });
      const data = await res.json();
      if (data.success) {
        triggerSuccess('ভিডিও টাস্কটি ডিলিট করা হয়েছে।');
      }
    } catch (err) {
      setErrorMsg('ডিলিট অপারেশন ব্যর্থ হয়েছে।');
    }
  };

  // Submit Delete All Videos
  const handleDeleteAllVideos = async () => {
    if (!window.confirm('আপনি কি নিশ্চিত যে সকল ভিডিও ডিলিট করতে চান?')) return;
    try {
      const res = await fetch('/api/admin/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_all' })
      });
      const data = await res.json();
      if (data.success) {
        triggerSuccess('সকল ভিডিও সফলভাবে ডিলিট করা হয়েছে।');
      } else {
        setErrorMsg(data.message || 'ডিলিট অপারেশন ব্যর্থ হয়েছে।');
      }
    } catch (err) {
      setErrorMsg('সার্ভারে সমস্যা হয়েছে।');
    }
  };

  // Submit Add FAQ
  const handleAddFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fQuestion || !fAnswer) {
      setErrorMsg('প্রশ্ন ও উত্তর উভয়ই পূরণ করুন।');
      return;
    }

    try {
      const res = await fetch('/api/admin/faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add',
          faq: { question: fQuestion, answer: fAnswer }
        })
      });
      const data = await res.json();
      if (data.success) {
        setFQuestion('');
        setFAnswer('');
        triggerSuccess('নতুন FAQ সফলভাবে যুক্ত হয়েছে।');
      }
    } catch (err) {
      setErrorMsg('FAQ যুক্ত করতে সমস্যা হয়েছে।');
    }
  };

  // Submit Delete FAQ
  const handleDeleteFaq = async (id: string) => {
    try {
      const res = await fetch('/api/admin/faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', faq: { id } })
      });
      const data = await res.json();
      if (data.success) {
        triggerSuccess('FAQ সফলভাবে ডিলিট করা হয়েছে।');
      }
    } catch (err) {
      setErrorMsg('FAQ ডিলিট অপারেশন ব্যর্থ হয়েছে।');
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dailyBonusAmount: bonusAmt,
          activityTickerActive: tickerActive
        })
      });
      const data = await res.json();
      if (data.success) {
        triggerSuccess('অ্যাডমিন সেটিংস সফলভাবে সংরক্ষিত হয়েছে।');
      }
    } catch (err) {
      setErrorMsg('সেটিংস সংরক্ষণ করা যায়নি।');
    }
  };

  // Filter transactions
  const deposits = adminData 
    ? adminData.transactions.filter((t: Transaction) => t.type === 'deposit').slice().reverse()
    : [];

  const withdrawals = adminData 
    ? adminData.transactions.filter((t: Transaction) => t.type === 'withdrawal').slice().reverse()
    : [];

  const pendingDepositsCount = deposits.filter((d: Transaction) => d.status === 'Pending').length;
  const pendingWithdrawalsCount = withdrawals.filter((w: Transaction) => w.status === 'Pending').length;

  // Filter users search
  const filteredUsers = adminData
    ? adminData.users.filter((u: User) => 
        u.username.toLowerCase().includes(userSearch.toLowerCase()) || 
        u.phone.includes(userSearch)
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 text-left">
      <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[92vh] overflow-hidden flex flex-col border border-slate-100">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-base font-black tracking-tight">Watch2Earn অ্যাডমিন কন্ট্রোল প্যানেল</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Layout split */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          
          {/* Left Navigation Sidebar */}
          <div className="md:w-60 bg-slate-50 border-r border-slate-200/80 p-4 shrink-0 flex flex-row md:flex-col gap-1.5 overflow-x-auto md:overflow-x-visible">
            {[
              { id: 'deposits', label: 'ডিপোজিট রিকোয়েস্ট', icon: ArrowDownCircle, badge: pendingDepositsCount },
              { id: 'withdrawals', label: 'উইথড্র রিকোয়েস্ট', icon: ArrowUpCircle, badge: pendingWithdrawalsCount },
              { id: 'users', label: 'ইউজার ম্যানেজমেন্ট', icon: Users },
              { id: 'videos', label: 'টাস্ক ও ভিডিও', icon: Video },
              { id: 'payment-numbers', label: 'পেমেন্ট নম্বর সেটিং', icon: Smartphone },
              { id: 'faqs', label: 'FAQ এডিটর', icon: MessageSquare },
              { id: 'stats', label: 'লাইভ সংখ্যা সংশোধন', icon: Settings },
              { id: 'settings', label: 'জেনারেল সেটিংস', icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`flex items-center justify-between px-3.5 py-2.5 text-xs font-bold rounded-xl whitespace-nowrap cursor-pointer transition-all ${
                    activeTab === item.id
                      ? 'bg-slate-900 text-white shadow-md font-black'
                      : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-950'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-mono font-black bg-amber-500 text-slate-950 rounded-full shrink-0 shadow-xs">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Main Content Workspace */}
          <div className="flex-1 p-6 overflow-y-auto bg-slate-50/50">
            {isLoading ? (
              <div className="py-24 text-center text-sm font-semibold text-slate-400 flex flex-col items-center justify-center gap-3">
                <span className="w-8 h-8 rounded-full border-2 border-[var(--brand-primary-start)] border-t-transparent animate-spin" />
                তথ্য লোড করা হচ্ছে...
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* Feedback notifications inside panels */}
                {successMsg && (
                  <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 flex items-center gap-2 shadow-xs">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>{successMsg}</span>
                  </div>
                )}
                {errorMsg && (
                  <div className="p-3 bg-red-50 text-red-800 text-xs font-bold rounded-xl border border-red-200 flex items-center gap-2 shadow-xs">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* TAB 1: DEPOSIT REQUESTS MANAGEMENT */}
                {activeTab === 'deposits' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b pb-3 border-slate-200">
                      <div>
                        <h3 className="text-sm font-extrabold text-slate-900">প্যাকেজ ডিপোজিট রিকোয়েস্টসমূহ</h3>
                        <p className="text-xs text-slate-500 mt-0.5">ইউজারদের ডিপোজিট আবেদন যাচাই করে প্যাকেজ সক্রিয় করুন</p>
                      </div>
                      <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-black rounded-xl border border-amber-300 font-mono">
                        PENDING DEPOSITS: {pendingDepositsCount}
                      </span>
                    </div>

                    {deposits.length === 0 ? (
                      <div className="py-16 text-center text-slate-400 text-xs bg-white rounded-2xl border border-slate-200 p-8">
                        <Wallet className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p>কোনো ডিপোজিট আবেদন জমা পড়েনি।</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
                        <table className="min-w-full text-left text-xs text-slate-600 divide-y divide-slate-100">
                          <thead className="bg-slate-50 font-bold text-slate-700">
                            <tr>
                              <th className="p-3">ব্যবহারকারী</th>
                              <th className="p-3">প্যাকেজ ও মূল্য</th>
                              <th className="p-3">পেমেন্ট গেটওয়ে</th>
                              <th className="p-3">সেন্ডার নম্বর</th>
                              <th className="p-3">TrxID / রেফারেন্স</th>
                              <th className="p-3">তারিখ</th>
                              <th className="p-3">স্ট্যাটাস</th>
                              <th className="p-3 text-right">অ্যাকশন</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-sans">
                            {deposits.map((item: Transaction) => (
                              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                <td className="p-3 font-bold text-slate-900">{item.username}</td>
                                <td className="p-3">
                                  <span className="font-mono font-extrabold text-emerald-600 block">৳{item.amount.toLocaleString()}</span>
                                  <span className="text-[10px] text-slate-400 font-bold uppercase">{item.packageName || 'Package'}</span>
                                </td>
                                <td className="p-3">
                                  <PaymentLogoBadge method={item.paymentMethod || 'bKash'} className="w-4 h-4" />
                                </td>
                                <td className="p-3 font-mono text-slate-800 font-bold">{item.phone}</td>
                                <td className="p-3 font-mono text-xs text-blue-600 font-extrabold">{item.trxId || 'N/A'}</td>
                                <td className="p-3 text-slate-400 text-[10px] font-mono">{item.completionTime}</td>
                                <td className="p-3">
                                  <span className={`px-2 py-0.5 text-[10px] font-black rounded-md font-mono uppercase ${
                                    item.status === 'Verified' || item.status === 'Credited'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : item.status === 'Rejected'
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-amber-100 text-amber-800 animate-pulse'
                                  }`}>
                                    {item.status}
                                  </span>
                                </td>
                                <td className="p-3 text-right">
                                  {item.status === 'Pending' ? (
                                    <div className="flex justify-end gap-1.5">
                                      <button
                                        onClick={() => handleDepositAction(item.id, 'approve')}
                                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-extrabold shadow-xs transition-colors cursor-pointer flex items-center gap-1"
                                      >
                                        <Check className="w-3.5 h-3.5" />
                                        অনুমোদন করুন
                                      </button>
                                      <button
                                        onClick={() => handleDepositAction(item.id, 'reject')}
                                        className="px-2.5 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                                      >
                                        বাতিল
                                      </button>
                                    </div>
                                  ) : (
                                    <span className="text-[10px] text-slate-400 font-bold">রিভিউ সম্পন্ন</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 2: WITHDRAWALS APPROVAL */}
                {activeTab === 'withdrawals' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b pb-3 border-slate-200">
                      <h3 className="text-sm font-extrabold text-slate-900">মোবাইল উইথড্র রিকোয়েস্টসমূহ</h3>
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-[10px] font-black rounded-lg border border-blue-200 font-mono">
                        PENDING: {pendingWithdrawalsCount} REQUESTS
                      </span>
                    </div>

                    {withdrawals.length === 0 ? (
                      <p className="text-slate-400 text-xs py-12 text-center">কোনো উত্তোলনের আবেদন জমা পড়েনি।</p>
                    ) : (
                      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
                        <table className="min-w-full text-left text-xs text-slate-600 divide-y divide-slate-100">
                          <thead className="bg-slate-50 font-bold text-slate-700">
                            <tr>
                              <th className="p-3">ব্যবহারকারী</th>
                              <th className="p-3">অ্যামাউন্ট</th>
                              <th className="p-3">মোবাইল নম্বর</th>
                              <th className="p-3">পেমেন্ট গেটওয়ে</th>
                              <th className="p-3">তারিখ</th>
                              <th className="p-3">স্ট্যাটাস</th>
                              <th className="p-3 text-right">পদক্ষেপ</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-sans">
                            {withdrawals.map((item: Transaction) => (
                              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                <td className="p-3 font-bold text-slate-900">{item.username}</td>
                                <td className="p-3 font-mono font-extrabold text-emerald-600">৳{item.amount.toLocaleString()}</td>
                                <td className="p-3 font-mono text-slate-700">{item.phone}</td>
                                <td className="p-3">
                                  <PaymentLogoBadge method={item.paymentMethod || 'bKash'} className="w-4 h-4" />
                                </td>
                                <td className="p-3 text-slate-400 text-[10px] font-mono">{item.completionTime}</td>
                                <td className="p-3">
                                  <span className={`px-2 py-0.5 text-[10px] font-black rounded-md font-mono uppercase ${
                                    item.status === 'Verified' || item.status === 'Credited'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : item.status === 'Rejected'
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-amber-100 text-amber-800'
                                  }`}>
                                    {item.status}
                                  </span>
                                </td>
                                <td className="p-3 text-right">
                                  {item.status === 'Pending' ? (
                                    <div className="flex justify-end gap-1.5">
                                      <button
                                        onClick={() => handleWithdrawalAction(item.id, 'approve')}
                                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-extrabold shadow-xs transition-colors cursor-pointer flex items-center gap-1"
                                      >
                                        <Check className="w-3.5 h-3.5" />
                                        অনুমোদন করুন
                                      </button>
                                      <button
                                        onClick={() => handleWithdrawalAction(item.id, 'reject')}
                                        className="px-2.5 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                                      >
                                        বাতিল
                                      </button>
                                    </div>
                                  ) : (
                                    <span className="text-[10px] text-slate-400 font-bold">রিভিউ সম্পন্ন</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 3: USER MANAGEMENT */}
                {activeTab === 'users' && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-3 border-slate-200">
                      <div>
                        <h3 className="text-sm font-extrabold text-slate-900">নিবন্ধিত সকল ব্যবহারকারী ({filteredUsers.length})</h3>
                        <p className="text-xs text-slate-500 mt-0.5">ব্যালেন্স যোগ/কর্তন করুন এবং মেম্বারশিপ প্যাকেজ আপগ্রেড করুন</p>
                      </div>

                      {/* User Search Input */}
                      <div className="relative w-full sm:w-64">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          value={userSearch}
                          onChange={(e) => setUserSearch(e.target.value)}
                          placeholder="নাম বা মোবাইল দিয়ে খুঁজুন..."
                          className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
                      <table className="min-w-full text-left text-xs text-slate-600 divide-y divide-slate-100">
                        <thead className="bg-slate-50 font-bold text-slate-700">
                          <tr>
                            <th className="p-3">ইউজার নাম</th>
                            <th className="p-3">মোবাইল</th>
                            <th className="p-3">বর্তমান ব্যালেন্স</th>
                            <th className="p-3">প্যাকেজ</th>
                            <th className="p-3">রোল</th>
                            <th className="p-3 text-right">ম্যানেজ অ্যাকশন</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-sans">
                          {filteredUsers.map((u: User) => (
                            <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                              <td className="p-3 font-bold text-slate-900">{u.username}</td>
                              <td className="p-3 font-mono text-slate-700">{u.phone}</td>
                              <td className="p-3 font-mono font-extrabold text-emerald-600">৳{Number(u.balance).toLocaleString()}</td>
                              <td className="p-3">
                                <span className="px-2 py-0.5 text-[10px] font-black bg-blue-50 text-blue-700 rounded-md border border-blue-100 uppercase">
                                  {u.currentPackage || 'Free'}
                                </span>
                              </td>
                              <td className="p-3">
                                {u.isAdmin ? (
                                  <span className="px-2 py-0.5 text-[10px] font-black bg-amber-100 text-amber-900 rounded-md border border-amber-200">
                                    অ্যাডমিন
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-slate-400 font-bold">ইউজার</span>
                                )}
                              </td>
                              <td className="p-3 text-right">
                                <div className="flex justify-end items-center gap-1.5">
                                  <button
                                    onClick={() => {
                                      setSelectedUser(u);
                                      setModalAction('add-balance');
                                      setBalanceAmount('500');
                                    }}
                                    className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                                  >
                                    + ব্যালেন্স
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedUser(u);
                                      setModalAction('deduct-balance');
                                      setBalanceAmount('100');
                                    }}
                                    className="px-2 py-1 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                                  >
                                    - কমান
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedUser(u);
                                      setSelectedPackage(u.currentPackage || 'Free');
                                      setModalAction('change-package');
                                    }}
                                    className="px-2 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                                  >
                                    প্যাকেজ
                                  </button>
                                  <button
                                    onClick={() => handleToggleAdmin(u)}
                                    className="p-1 text-slate-400 hover:text-amber-600 transition-colors cursor-pointer"
                                    title="অ্যাডমিন পারমিশন টগল করুন"
                                  >
                                    <Shield className={`w-3.5 h-3.5 ${u.isAdmin ? 'text-amber-600 fill-amber-600' : ''}`} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* TAB 4: OFFICIAL PAYMENT NUMBERS SETTINGS */}
                {activeTab === 'payment-numbers' && (
                  <div className="space-y-4">
                    <div className="border-b pb-3 border-slate-200">
                      <h3 className="text-sm font-extrabold text-slate-900">ডিপোজিট পেমেন্ট নম্বর সেটিংস</h3>
                      <p className="text-xs text-slate-500 mt-0.5">বিকাশ, নগদ এবং রকেটের অফিসিয়াল ডিপোজিট নম্বর পরিবর্তন করুন</p>
                    </div>

                    <form onSubmit={handleSavePaymentNumbers} className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 max-w-xl">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                          <PaymentLogoBadge method="bKash" className="w-4 h-4" />
                          বিকাশ (bKash) অফিসিয়াল নম্বর
                        </label>
                        <input
                          type="tel"
                          required
                          value={bkashNum}
                          onChange={(e) => setBkashNum(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                          <PaymentLogoBadge method="Nagad" className="w-4 h-4" />
                          নগদ (Nagad) অফিসিয়াল নম্বর
                        </label>
                        <input
                          type="tel"
                          required
                          value={nagadNum}
                          onChange={(e) => setNagadNum(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                          <PaymentLogoBadge method="Rocket" className="w-4 h-4" />
                          রকেট (Rocket) অফিসিয়াল নম্বর
                        </label>
                        <input
                          type="tel"
                          required
                          value={rocketNum}
                          onChange={(e) => setRocketNum(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      <button
                        type="submit"
                        className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold shadow-md cursor-pointer flex items-center gap-1.5 transition-all"
                      >
                        <Save className="w-4 h-4" />
                        পেমেন্ট নম্বরসমূহ সেভ করুন
                      </button>
                    </form>
                  </div>
                )}

                {/* TAB 5: VIDEO TASKS EDITOR */}
                {activeTab === 'videos' && (
                  <div className="space-y-6">
                    <div className="border-b pb-3 border-slate-200">
                      <h3 className="text-sm font-extrabold text-slate-900">ভিডিও ওয়াচ টাস্ক ও অ্যাডভারটাইজার লিস্ট</h3>
                      <p className="text-xs text-slate-500 mt-0.5">নতুন ইউটিউব ভিডিও যোগ করুন অথবা স্পন্সরদের ক্যাম্পেইন লাইভ করুন</p>
                    </div>

                    {/* Add new video form */}
                    <form onSubmit={handleAddVideo} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
                      <h4 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                        <Plus className="w-4 h-4 text-emerald-600" />
                        নতুন ভিডিও টাস্ক যোগ করুন
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="ভিডিও শিরোনাম (Title)"
                          value={vTitle}
                          onChange={(e) => setVTitle(e.target.value)}
                          className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                        />
                        <input
                          type="text"
                          placeholder="ক্যাটাগরি বা ব্র্যান্ড নাম"
                          value={vCategory}
                          onChange={(e) => setVCategory(e.target.value)}
                          className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                        />
                        <input
                          type="text"
                          placeholder="ইউটিউব এম্বেড লিংক (Embed URL)"
                          value={vUrl}
                          onChange={(e) => setVUrl(e.target.value)}
                          className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="number"
                            placeholder="ওয়াচ টাইম (সেকেন্ড)"
                            value={vDuration}
                            onChange={(e) => setVDuration(e.target.value)}
                            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono"
                          />
                          <input
                            type="number"
                            placeholder="পুরস্কার (৳)"
                            value={vReward}
                            onChange={(e) => setVReward(e.target.value)}
                            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono"
                          />
                        </div>
                      </div>

                      <textarea
                        rows={2}
                        placeholder="ভিডিওর বিস্তারিত বিবরণ..."
                        value={vDesc}
                        onChange={(e) => setVDesc(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                      />

                      <button
                        type="submit"
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                      >
                        + টাস্ক পাবলিশ করুন
                      </button>
                    </form>

                    {/* Video list */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-bold text-slate-700">বর্তমান লাইভ ভিডিওসমূহ ({adminData?.videos?.length || 0}):</h4>
                        {adminData?.videos && adminData.videos.length > 0 && (
                          <button
                            type="button"
                            onClick={handleDeleteAllVideos}
                            className="px-2.5 py-1 text-[11px] font-bold text-red-600 hover:text-white hover:bg-red-600 border border-red-200 hover:border-red-600 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Trash className="w-3.5 h-3.5" />
                            সব ভিডিও ডিলিট করুন
                          </button>
                        )}
                      </div>

                      {(!adminData?.videos || adminData.videos.length === 0) ? (
                        <div className="p-6 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center">
                          <p className="text-xs text-slate-500 font-medium">কোনো ভিডিও নেই। সকল ভিডিও ডিলিট করা হয়েছে।</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {adminData.videos.map((vid: VideoTask) => (
                            <div key={vid.id} className="p-3 bg-white rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                              <div className="truncate pr-2">
                                <div className="flex items-center gap-1.5 truncate">
                                  <p className="font-bold text-slate-900 truncate">{vid.title}</p>
                                  {vid.isPaidOnly && (
                                    <span className="text-[9px] font-black bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-sm shrink-0 font-mono">
                                      পেইড প্ল্যান
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] text-slate-400 font-mono">টাইম: {vid.duration}s | রিওয়ার্ড: ৳{vid.reward}</p>
                              </div>
                              <button
                                onClick={() => handleDeleteVideo(vid.id)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                                title="ডিলিট করুন"
                              >
                                <Trash className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 6: FAQ EDITOR */}
                {activeTab === 'faqs' && (
                  <div className="space-y-4">
                    <div className="border-b pb-3 border-slate-200">
                      <h3 className="text-sm font-extrabold text-slate-900">প্রশ্ন ও উত্তর (FAQ) এডিটর</h3>
                      <p className="text-xs text-slate-500 mt-0.5">হোমপেজের সচরাচর জিজ্ঞাসিত প্রশ্ন যোগ ও মুছুন</p>
                    </div>

                    <form onSubmit={handleAddFaq} className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
                      <input
                        type="text"
                        placeholder="প্রশ্নটি লিখুন..."
                        value={fQuestion}
                        onChange={(e) => setFQuestion(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
                      />
                      <textarea
                        rows={3}
                        placeholder="বিস্তারিত উত্তর লিখুন..."
                        value={fAnswer}
                        onChange={(e) => setFAnswer(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        + FAQ যুক্ত করুন
                      </button>
                    </form>

                    <div className="space-y-2">
                      {adminData?.faqs.map((faq: FAQ) => (
                        <div key={faq.id} className="p-3 bg-white rounded-xl border border-slate-200 flex justify-between items-start gap-2 text-xs">
                          <div>
                            <p className="font-bold text-slate-900">Q: {faq.question}</p>
                            <p className="text-slate-600 mt-1 text-[11px]">A: {faq.answer}</p>
                          </div>
                          <button
                            onClick={() => handleDeleteFaq(faq.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer shrink-0"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 7: OVERRIDE STATS */}
                {activeTab === 'stats' && (
                  <form onSubmit={handleUpdateStats} className="space-y-4">
                    <div className="border-b pb-3 border-slate-200">
                      <h3 className="text-sm font-extrabold text-slate-900">হোমপেজ লাইভ পরিসংখ্যান এডিটর</h3>
                      <p className="text-xs text-slate-500 mt-0.5">হোমপেজের পাবলিক কাউন্টার এডিট করুন</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-5 rounded-2xl border border-slate-200">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">মোট রেজিস্টার্ড মেম্বার</label>
                        <input
                          type="number"
                          value={registeredUsers}
                          onChange={(e) => setRegisteredUsers(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">মোট দেখা ভিডিও সংখ্যা</label>
                        <input
                          type="number"
                          value={videosWatched}
                          onChange={(e) => setVideosWatched(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">মোট বিতরণ করা রিওয়ার্ড (৳)</label>
                        <input
                          type="number"
                          value={rewardsDistributed}
                          onChange={(e) => setRewardsDistributed(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">সক্রিয় বিজ্ঞাপন টাস্ক সংখ্যা</label>
                        <input
                          type="number"
                          value={activeTasksCount}
                          onChange={(e) => setActiveTasksCount(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 shadow-md cursor-pointer"
                    >
                      সংখ্যা পরিবর্তন সংরক্ষণ করুন
                    </button>
                  </form>
                )}

                {/* TAB 8: GENERAL SETTINGS */}
                {activeTab === 'settings' && (
                  <form onSubmit={handleSaveSettings} className="space-y-4 max-w-lg">
                    <div className="border-b pb-3 border-slate-200">
                      <h3 className="text-sm font-extrabold text-slate-900">গ্লোবাল প্ল্যাটফর্ম সেটিংস</h3>
                      <p className="text-xs text-slate-500 mt-0.5">ডেইলি বোনাস ও অটোমেটিক টিপস নোটিফিকেশন কনফিগার করুন</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">ডেইলি ওয়াচ বোনাস পরিমাণ (৳)</label>
                        <input
                          type="number"
                          value={bonusAmt}
                          onChange={(e) => setBonusAmt(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <div>
                          <p className="text-xs font-bold text-slate-900">হোমপেজ লাইভ একটিভিটি টিংকার (Activity Ticker)</p>
                          <p className="text-[10px] text-slate-500">ইউজারদের রিওয়ার্ড অর্জনের পপআপ অ্যানিমেশন নোটিফিকেশন</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={tickerActive}
                          onChange={(e) => setTickerActive(e.target.checked)}
                          className="w-4 h-4 text-emerald-600 rounded-md cursor-pointer"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 shadow-md cursor-pointer"
                    >
                      সেটিংস সংরক্ষণ করুন
                    </button>
                  </form>
                )}

              </div>
            )}
          </div>

        </div>

      </div>

      {/* USER EDIT BALANCE / PACKAGE MODAL */}
      {selectedUser && modalAction && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-100 shadow-2xl relative text-left">
            <button
              onClick={() => {
                setSelectedUser(null);
                setModalAction(null);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-sm font-black text-slate-900 mb-1">
              {modalAction === 'add-balance' && 'ব্যালেন্স যুক্ত করুন'}
              {modalAction === 'deduct-balance' && 'ব্যালেন্স কেটে নিন'}
              {modalAction === 'change-package' && 'মেম্বারশিপ প্যাকেজ পরিবর্তন'}
            </h3>
            <p className="text-xs text-slate-500 mb-4 font-mono font-bold">
              ইউজার: {selectedUser.username} ({selectedUser.phone})
            </p>

            <form onSubmit={handleUserActionSubmit} className="space-y-4">
              {modalAction === 'change-package' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">নতুন প্যাকেজ নির্বাচন করুন</label>
                  <select
                    value={selectedPackage}
                    onChange={(e) => setSelectedPackage(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    {PACKAGE_OPTIONS.map((pkg) => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">টাকার পরিমাণ (৳)</label>
                  <input
                    type="number"
                    value={balanceAmount}
                    onChange={(e) => setBalanceAmount(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                কনফার্ম করুন
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
