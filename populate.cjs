const fs = require('fs');
const path = require('path');

const companies = [
  { id: 'vid-1', name: 'Grameenphone PLC', cat: 'Telecom', yt: 'ciBnbRssHno', title: 'Grameenphone PLC - ৪G ও ডিজিটাল স্পন্সরড টিভিসি অ্যাড' },
  { id: 'vid-2', name: 'Square Pharmaceuticals PLC', cat: 'Pharmaceuticals', yt: 'j8lRUAj5Gms', title: 'Square Pharmaceuticals - স্কয়ার ফার্মা ব্র্যান্ড কমার্শিয়াল' },
  { id: 'vid-3', name: 'Robi Axiata PLC', cat: 'Telecom', yt: 'WUU0A8TWLiA', title: 'Robi Axiata PLC - রবি ৪.৫জি বিলিভ ইন ইট টিভি কমার্শিয়াল' },
  { id: 'vid-4', name: 'BRAC Bank PLC', cat: 'Banking', yt: '4vMrbbrF6V0', title: 'BRAC Bank PLC - ব্র্যাক ব্যাংক সমৃদ্ধির অভিযাত্রা কমার্শিয়াল' },
  { id: 'vid-5', name: 'Walton Hi-Tech Industries PLC', cat: 'Electronics', yt: 'PUFCPkUBhkw', title: 'Walton Hi-Tech - ওয়ালটন স্মার্ট ইলেক্ট্রনিক্স অফিশিয়াল অ্যাড' },
  { id: 'vid-6', name: 'British American Tobacco Bangladesh', cat: 'FMCG', yt: 'FJtqMY-6MwI', title: 'BAT Bangladesh - বিএটি বাংলাদেশ কর্পোরেট কমার্শিয়াল' },
  { id: 'vid-7', name: 'Marico Bangladesh Ltd.', cat: 'FMCG', yt: 'XJBrkVkJatg', title: 'Marico Bangladesh - প্যারাস্যুট অ্যাডভান্সড হেয়ার কেয়ার অ্যাড' },
  { id: 'vid-8', name: 'Berger Paints Bangladesh Ltd.', cat: 'Paints', yt: 'tgbNymZ7vqY', title: 'Berger Paints - বার্জার পেইন্টস রঙের দুনিয়া টিভি কমার্শিয়াল' },
  { id: 'vid-9', name: 'United Power Generation & Distribution', cat: 'Power', yt: 'L_LUpnjgPso', title: 'United Power - ইউনাইটেড পাওয়ার ইনফ্রাস্ট্রাকচার কমার্শিয়াল' },
  { id: 'vid-10', name: 'Beximco Pharmaceuticals PLC', cat: 'Pharmaceuticals', yt: '3JZ_D3ELwOQ', title: 'Beximco Pharma - বেক্সিমকো ফার্মা গ্লোবাল ব্র্যান্ড টিভি অ্যাড' },
  { id: 'vid-11', name: 'Pubali Bank PLC', cat: 'Banking', yt: 'fJ9rUzIMcZQ', title: 'Pubali Bank PLC - পুবালী ব্যাংক বিশ্বস্ত ব্যাংকিং সেবার কমার্শিয়াল' },
  { id: 'vid-12', name: 'LafargeHolcim Bangladesh PLC', cat: 'Cement', yt: '2g811KomR4U', title: 'LafargeHolcim - লাফার্জহোলসিম বিল্ডিং সোলিউশনস কমার্শিয়াল' },
  { id: 'vid-13', name: 'City Bank PLC', cat: 'Banking', yt: 'kJQP7kiw5Fk', title: 'City Bank PLC - সিটি ব্যাংক আমেরিকান এক্সপ্রেস কার্ড অ্যাড' },
  { id: 'vid-14', name: 'Eastern Bank PLC', cat: 'Banking', yt: 'OPf0YbXqDm0', title: 'Eastern Bank PLC - ইস্টার্ন ব্যাংক ডিজিটাল ব্যাংকিং টিভি কমার্শিয়াল' },
  { id: 'vid-15', name: 'Renata PLC', cat: 'Pharmaceuticals', yt: 'l482T0yNkeo', title: 'Renata PLC - রেনাটা লিমিটেড হেলথকেয়ার ব্র্যান্ড অ্যাড' },
  { id: 'vid-16', name: 'Dutch-Bangla Bank PLC', cat: 'Banking', yt: 'hY7m5jjJ9mM', title: 'Dutch-Bangla Bank - ডাচ-বাংলা ব্যাংক রকেট মোবাইল ব্যাংকিং' },
  { id: 'vid-17', name: 'Prime Bank PLC', cat: 'Banking', yt: 'C0DPdy98e4c', title: 'Prime Bank PLC - প্রাইম ব্যাংক নেক্সট জেনারেশন ব্যাংকিং অ্যাড' },
  { id: 'vid-18', name: 'Islami Bank Bangladesh PLC', cat: 'Banking', yt: 'YykjpeuMNEk', title: 'Islami Bank - ইসলামী ব্যাংক বাংলাদেশ শরিয়াহ পেমেন্ট কমার্শিয়াল' },
  { id: 'vid-19', name: 'IDLC Finance PLC', cat: 'Financial Services', yt: 'LSOLM6DRtI4', title: 'IDLC Finance PLC - আইডিএলসি ফিন্যান্সিয়াল সোলিউশনস কমার্শিয়াল' },
  { id: 'vid-20', name: 'Bangladesh Export Import Company (BEXIMCO)', cat: 'Diversified', yt: 'M7lc1UVf-VE', title: 'BEXIMCO Group - বেক্সিমকো গ্রুপ কর্পোরেট ব্র্যান্ড টিভি অ্যাড' },
  { id: 'vid-21', name: 'United Commercial Bank PLC', cat: 'Banking', yt: 'e-ORhEE9VVg', title: 'UCB Bank PLC - ইউসিবি ব্যাংক উপায় ডিজিটাল পেমেন্ট সার্ভিস' },
  { id: 'vid-22', name: 'Heidelberg Materials Bangladesh PLC', cat: 'Cement', yt: '9bZkp7q19f0', title: 'Heidelberg Materials - হাইডেলবার্গ সিমেন্ট ব্র্যান্ড অ্যাড' },
  { id: 'vid-23', name: 'Bank Asia PLC', cat: 'Banking', yt: 'ktvTqknDobU', title: 'Bank Asia PLC - ব্যাংক এশিয়া এজেন্ট ব্যাংকিং সুবিধা' },
  { id: 'vid-24', name: 'Mutual Trust Bank PLC', cat: 'Banking', yt: 'E3N5Yv0u1eI', title: 'Mutual Trust Bank - মিউচুয়াল ট্রাস্ট ব্যাংক স্মার্ট ব্যাংকিং' },
  { id: 'vid-25', name: 'Eastern Housing Ltd.', cat: 'Real Estate', yt: 'a3ICNMQW7Ok', title: 'Eastern Housing - ইস্টার্ন হাউজিং আধুনিক রিয়েল এস্টেট কমার্শিয়াল' },
  { id: 'vid-26', name: 'Summit Power International', cat: 'Power', yt: 'V1bFr2SWP1I', title: 'Summit Power - সামিট পাওয়ার এনার্জি স্পন্সরড কর্পোরেট অ্যাড' },
  { id: 'vid-27', name: 'Olympic Industries PLC', cat: 'Food & Beverage', yt: '2S24-y0Ij3Y', title: 'Olympic Industries - অলিম্পিক এনার্জি প্লাস বিস্কুট কমার্শিয়াল' },
  { id: 'vid-28', name: 'Singer Bangladesh PLC', cat: 'Consumer Electronics', yt: '3xUX3nS3yG8', title: 'Singer Bangladesh - সিঙ্গার হোম অ্যান্ড কিচেন অ্যাপ্লায়েন্সেস' },
  { id: 'vid-29', name: 'ACI PLC', cat: 'Pharmaceuticals / FMCG', yt: 'kXYiU_JCYtU', title: 'ACI PLC - এসিআই পিওর ও এ্যারোসল ব্র্যান্ড কমার্শিয়াল' },
  { id: 'vid-30', name: 'Power Grid Bangladesh PLC', cat: 'Power', yt: 'fJ9rUzIMcZQ', title: 'Power Grid Bangladesh - পাওয়ার গ্রিড ইলেকট্রিক গ্রিড অ্যাড' },
  { id: 'vid-31', name: 'LankaBangla Finance PLC', cat: 'Financial Services', yt: 'aJOTlE1K90k', title: 'LankaBangla Finance - লংকাবাংলা ফিন্যান্সিয়াল ক্রেডিট কার্ড' },
  { id: 'vid-32', name: 'Prime Finance & Investment PLC', cat: 'Financial Services', yt: 'C0DPdy98e4c', title: 'Prime Finance PLC - প্রাইম ফিন্যান্স ইনভেস্টমেন্ট কমার্শিয়াল' },
  { id: 'vid-33', name: 'Meghna Petroleum PLC', cat: 'Fuel & Energy', yt: 'L_LUpnjgPso', title: 'Meghna Petroleum - মেঘনা পেট্রোলিয়াম এনার্জি সাপ্লাই অ্যাড' },
  { id: 'vid-34', name: 'Jamuna Oil Company PLC', cat: 'Fuel & Energy', yt: 'V1bFr2SWP1I', title: 'Jamuna Oil Company - যমুনা অয়েল ফুয়েল সার্ভিসেক্স কমার্শিয়াল' },
  { id: 'vid-35', name: 'Titas Gas Transmission & Distribution PLC', cat: 'Energy', yt: '3JZ_D3ELwOQ', title: 'Titas Gas - তিতাস গ্যাস নিরাপদ এনার্জি ট্রান্সমিশন' },
  { id: 'vid-36', name: 'MJL Bangladesh PLC', cat: 'Fuel & Energy', yt: '2g811KomR4U', title: 'MJL Bangladesh - মবিল ইঞ্জিনের সেরা পারফরম্যান্স অ্যাড' },
  { id: 'vid-37', name: 'IFIC Bank PLC', cat: 'Banking', yt: 'kJQP7kiw5Fk', title: 'IFIC Bank PLC - আইএফআইসি ব্যাংক আমার একাউন্ট কমার্শিয়াল' },
  { id: 'vid-38', name: 'Southeast Bank PLC', cat: 'Banking', yt: 'OPf0YbXqDm0', title: 'Southeast Bank PLC - সাউথইস্ট ব্যাংক স্মার্ট সেভিংস স্কিম' },
  { id: 'vid-39', name: 'One Bank PLC', cat: 'Banking', yt: 'hY7m5jjJ9mM', title: 'One Bank PLC - ওয়ান ব্যাংক ওকে ওয়ালেট ডিজিটাল ব্যাংকিং' },
  { id: 'vid-40', name: 'National Bank PLC', cat: 'Banking', yt: 'fJ9rUzIMcZQ', title: 'National Bank PLC - ন্যাশনাল ব্যাংক অফিশিয়াল টিভি কমার্শিয়াল' },
  { id: 'vid-41', name: 'The ACME Laboratories Ltd.', cat: 'Pharmaceuticals', yt: 'l482T0yNkeo', title: 'The ACME Laboratories - একমি ল্যাবরেটরিজ মেডিসিন ব্র্যান্ড' },
  { id: 'vid-42', name: 'Khulna Power Company Ltd.', cat: 'Power', yt: 'L_LUpnjgPso', title: 'Khulna Power Company - খুলনা পাওয়ার জেনারেশন প্রজেক্ট' },
  { id: 'vid-43', name: 'Square Textile PLC', cat: 'Textile', yt: 'j8lRUAj5Gms', title: 'Square Textile PLC - স্কয়ার টেক্সটাইল ইয়ার্ন অ্যান্ড ফেব্রিক' },
  { id: 'vid-44', name: 'DBL Industries PLC', cat: 'Textile', yt: '4vMrbbrF6V0', title: 'DBL Industries PLC - ডিবিএল গ্রুপ গার্মেন্টস ও টেক্সটাইল' },
  { id: 'vid-45', name: 'Envoy Textiles PLC', cat: 'Textile', yt: 'WUU0A8TWLiA', title: 'Envoy Textiles PLC - এনভয় টেক্সটাইল ডেনিম এন্ড ডাইং' },
  { id: 'vid-46', name: 'RAK Ceramics Bangladesh PLC', cat: 'Ceramics', yt: 'PUFCPkUBhkw', title: 'RAK Ceramics - আরএকে সিরামিকস লাক্সারি টাইলস অ্যাড' },
  { id: 'vid-47', name: 'BSCCL — Bangladesh Submarine Cables', cat: 'Telecom/ICT', yt: 'ciBnbRssHno', title: 'BSCCL - বাংলাদেশ সাবমেরিন কেবলস হাইস্পিড ইন্টারনেট' },
  { id: 'vid-48', name: 'Eastern Cables PLC', cat: 'Engineering', yt: 'FJtqMY-6MwI', title: 'Eastern Cables PLC - ইস্টার্ন কেবলস কোয়ালিটি ইলেকট্রিক কেবল' },
  { id: 'vid-49', name: 'Olympic Accessories Ltd.', cat: 'Textile', yt: '2S24-y0Ij3Y', title: 'Olympic Accessories - অলিম্পিক গারমেন্টস অ্যাক্সেসরিজ' },
  { id: 'vid-50', name: 'GPH Ispat Ltd.', cat: 'Steel', yt: 'tgbNymZ7vqY', title: 'GPH Ispat Ltd. - জিপিএইচ ইস্পাত স্ট্রাকচারাল স্টিল রড' }
];

const videoList = companies.map((c, i) => ({
  id: c.id,
  title: c.title,
  category: c.cat,
  duration: 30,
  reward: 100,
  url: `https://www.youtube.com/embed/${c.yt}`,
  thumbnail: `https://img.youtube.com/vi/${c.yt}/hqdefault.jpg`,
  description: `${c.name}-এর অফিসিয়াল কমার্শিয়াল ভিডিও বিজ্ঞাপনটি ৩০ সেকেন্ড মনোযোগ সহকারে সম্পূর্ণ দেখুন এবং নিশ্চিত ৳১০০ ইনকাম রিওয়ার্ড ওয়ালেটে গ্রহণ করুন।`,
  available: true
}));

const dbPath = path.join(process.cwd(), 'db.json');
if (fs.existsSync(dbPath)) {
  const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  dbData.videos = videoList;
  fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2), 'utf8');
  console.log('db.json successfully updated with 50 company videos!');
} else {
  console.error('db.json file not found!');
}
