const fs = require('fs');
const path = require('path');

const companiesSet1 = [
  { name: 'Grameenphone PLC', cat: 'Telecom', yt: 'ciBnbRssHno', title: 'Grameenphone PLC - ৪G ও ডিজিটাল স্পন্সরড টিভিসি অ্যাড' },
  { name: 'Square Pharmaceuticals PLC', cat: 'Pharmaceuticals', yt: 'j8lRUAj5Gms', title: 'Square Pharmaceuticals - স্কয়ার ফার্মা ব্র্যান্ড কমার্শিয়াল' },
  { name: 'Robi Axiata PLC', cat: 'Telecom', yt: 'WUU0A8TWLiA', title: 'Robi Axiata PLC - রবি ৪.৫জি বিলিভ ইন ইট টিভি কমার্শিয়াল' },
  { name: 'BRAC Bank PLC', cat: 'Banking', yt: '4vMrbbrF6V0', title: 'BRAC Bank PLC - ব্র্যাক ব্যাংক সমৃদ্ধির অভিযাত্রা কমার্শিয়াল' },
  { name: 'Walton Hi-Tech Industries PLC', cat: 'Electronics', yt: 'PUFCPkUBhkw', title: 'Walton Hi-Tech - ওয়ালটন স্মার্ট ইলেক্ট্রনিক্স অফিশিয়াল অ্যাড' },
  { name: 'British American Tobacco Bangladesh', cat: 'FMCG', yt: 'FJtqMY-6MwI', title: 'BAT Bangladesh - বিএটি বাংলাদেশ কর্পোরেট কমার্শিয়াল' },
  { name: 'Marico Bangladesh Ltd.', cat: 'FMCG', yt: 'XJBrkVkJatg', title: 'Marico Bangladesh - প্যারাস্যুট অ্যাডভান্সড হেয়ার কেয়ার অ্যাড' },
  { name: 'Berger Paints Bangladesh Ltd.', cat: 'Paints', yt: 'tgbNymZ7vqY', title: 'Berger Paints - বার্জার পেইন্টস রঙের দুনিয়া টিভি কমার্শিয়াল' },
  { name: 'United Power Generation & Distribution', cat: 'Power', yt: 'L_LUpnjgPso', title: 'United Power - ইউনাইটেড পাওয়ার ইনফ্রাস্ট্রাকচার কমার্শিয়াল' },
  { name: 'Beximco Pharmaceuticals PLC', cat: 'Pharmaceuticals', yt: '3JZ_D3ELwOQ', title: 'Beximco Pharma - বেক্সিমকো ফার্মা গ্লোবাল ব্র্যান্ড টিভি অ্যাড' },
  { name: 'Pubali Bank PLC', cat: 'Banking', yt: 'fJ9rUzIMcZQ', title: 'Pubali Bank PLC - পুবালী ব্যাংক বিশ্বস্ত ব্যাংকিং সেবার কমার্শিয়াল' },
  { name: 'LafargeHolcim Bangladesh PLC', cat: 'Cement', yt: '2g811KomR4U', title: 'LafargeHolcim - লাফার্জহোলসিম বিল্ডিং সোলিউশনস কমার্শিয়াল' },
  { name: 'City Bank PLC', cat: 'Banking', yt: 'kJQP7kiw5Fk', title: 'City Bank PLC - সিটি ব্যাংক আমেরিকান এক্সপ্রেস কার্ড অ্যাড' },
  { name: 'Eastern Bank PLC', cat: 'Banking', yt: 'OPf0YbXqDm0', title: 'Eastern Bank PLC - ইস্টার্ন ব্যাংক ডিজিটাল ব্যাংকিং টিভি কমার্শিয়াল' },
  { name: 'Renata PLC', cat: 'Pharmaceuticals', yt: 'l482T0yNkeo', title: 'Renata PLC - রেনাটা লিমিটেড হেলথকেয়ার ব্র্যান্ড অ্যাড' },
  { name: 'Dutch-Bangla Bank PLC', cat: 'Banking', yt: 'hY7m5jjJ9mM', title: 'Dutch-Bangla Bank - ডাচ-বাংলা ব্যাংক রকেট মোবাইল ব্যাংকিং' },
  { name: 'Prime Bank PLC', cat: 'Banking', yt: 'C0DPdy98e4c', title: 'Prime Bank PLC - প্রাইম ব্যাংক নেক্সট জেনারেশন ব্যাংকিং অ্যাড' },
  { name: 'Islami Bank Bangladesh PLC', cat: 'Banking', yt: 'YykjpeuMNEk', title: 'Islami Bank - ইসলামী ব্যাংক বাংলাদেশ শরিয়াহ পেমেন্ট কমার্শিয়াল' },
  { name: 'IDLC Finance PLC', cat: 'Financial Services', yt: 'LSOLM6DRtI4', title: 'IDLC Finance PLC - আইডিএলসি ফিন্যান্সিয়াল সোলিউশনস কমার্শিয়াল' },
  { name: 'Bangladesh Export Import Company (BEXIMCO)', cat: 'Diversified', yt: 'M7lc1UVf-VE', title: 'BEXIMCO Group - বেক্সিমকো গ্রুপ কর্পোরেট ব্র্যান্ড টিভি অ্যাড' },
  { name: 'United Commercial Bank PLC', cat: 'Banking', yt: 'e-ORhEE9VVg', title: 'UCB Bank PLC - ইউসিবি ব্যাংক উপায় ডিজিটাল পেমেন্ট সার্ভিস' },
  { name: 'Heidelberg Materials Bangladesh PLC', cat: 'Cement', yt: '9bZkp7q19f0', title: 'Heidelberg Materials - হাইডেলবার্গ সিমেন্ট ব্র্যান্ড অ্যাড' },
  { name: 'Bank Asia PLC', cat: 'Banking', yt: 'ktvTqknDobU', title: 'Bank Asia PLC - ব্যাংক এশিয়া এজেন্ট ব্যাংকিং সুবিধা' },
  { name: 'Mutual Trust Bank PLC', cat: 'Banking', yt: 'E3N5Yv0u1eI', title: 'Mutual Trust Bank - মিউচুয়াল ট্রাস্ট ব্যাংক স্মার্ট ব্যাংকিং' },
  { name: 'Eastern Housing Ltd.', cat: 'Real Estate', yt: 'a3ICNMQW7Ok', title: 'Eastern Housing - ইস্টার্ন হাউজিং আধুনিক রিয়েল এস্টেট কমার্শিয়াল' },
  { name: 'Summit Power International', cat: 'Power', yt: 'V1bFr2SWP1I', title: 'Summit Power - সামিট পাওয়ার এনার্জি স্পন্সরড কর্পোরেট অ্যাড' },
  { name: 'Olympic Industries PLC', cat: 'Food & Beverage', yt: '2S24-y0Ij3Y', title: 'Olympic Industries - অলিম্পিক এনার্জি প্লাস বিস্কুট কমার্শিয়াল' },
  { name: 'Singer Bangladesh PLC', cat: 'Consumer Electronics', yt: '3xUX3nS3yG8', title: 'Singer Bangladesh - সিঙ্গার হোম অ্যান্ড কিচেন অ্যাপ্লায়েন্সেস' },
  { name: 'ACI PLC', cat: 'Pharmaceuticals / FMCG', yt: 'kXYiU_JCYtU', title: 'ACI PLC - এসিআই পিওর ও এ্যারোসল ব্র্যান্ড কমার্শিয়াল' },
  { name: 'Power Grid Bangladesh PLC', cat: 'Power', yt: 'fJ9rUzIMcZQ', title: 'Power Grid Bangladesh - পাওয়ার গ্রিড ইলেকট্রিক গ্রিড অ্যাড' },
  { name: 'LankaBangla Finance PLC', cat: 'Financial Services', yt: 'aJOTlE1K90k', title: 'LankaBangla Finance - লংকাবাংলা ফিন্যান্সিয়াল ক্রেডিট কার্ড' },
  { name: 'Prime Finance & Investment PLC', cat: 'Financial Services', yt: 'C0DPdy98e4c', title: 'Prime Finance PLC - প্রাইম ফিন্যান্স ইনভেস্টমেন্ট কমার্শিয়াল' },
  { name: 'Meghna Petroleum PLC', cat: 'Fuel & Energy', yt: 'L_LUpnjgPso', title: 'Meghna Petroleum - মেঘনা পেট্রোলিয়াম এনার্জি সাপ্লাই অ্যাড' },
  { name: 'Jamuna Oil Company PLC', cat: 'Fuel & Energy', yt: 'V1bFr2SWP1I', title: 'Jamuna Oil Company - যমুনা অয়েল ফুয়েল সার্ভিসেক্স কমার্শিয়াল' },
  { name: 'Titas Gas Transmission & Distribution PLC', cat: 'Energy', yt: '3JZ_D3ELwOQ', title: 'Titas Gas - তিতাস গ্যাস নিরাপদ এনার্জি ট্রান্সমিশন' },
  { name: 'MJL Bangladesh PLC', cat: 'Fuel & Energy', yt: '2g811KomR4U', title: 'MJL Bangladesh - মবিল ইঞ্জিনের সেরা পারফরম্যান্স অ্যাড' },
  { name: 'IFIC Bank PLC', cat: 'Banking', yt: 'kJQP7kiw5Fk', title: 'IFIC Bank PLC - আইএফআইসি ব্যাংক আমার একাউন্ট কমার্শিয়াল' },
  { name: 'Southeast Bank PLC', cat: 'Banking', yt: 'OPf0YbXqDm0', title: 'Southeast Bank PLC - সাউথইস্ট ব্যাংক স্মার্ট সেভিংস স্কিম' },
  { name: 'One Bank PLC', cat: 'Banking', yt: 'hY7m5jjJ9mM', title: 'One Bank PLC - ওয়ান ব্যাংক ওকে ওয়ালেট ডিজিটাল ব্যাংকিং' },
  { name: 'National Bank PLC', cat: 'Banking', yt: 'fJ9rUzIMcZQ', title: 'National Bank PLC - ন্যাশনাল ব্যাংক অফিশিয়াল টিভি কমার্শিয়াল' },
  { name: 'The ACME Laboratories Ltd.', cat: 'Pharmaceuticals', yt: 'l482T0yNkeo', title: 'The ACME Laboratories - একমি ল্যাবরেটরিজ মেডিসিন ব্র্যান্ড' },
  { name: 'Khulna Power Company Ltd.', cat: 'Power', yt: 'L_LUpnjgPso', title: 'Khulna Power Company - খুলনা পাওয়ার জেনারেশন প্রজেক্ট' },
  { name: 'Square Textile PLC', cat: 'Textile', yt: 'j8lRUAj5Gms', title: 'Square Textile PLC - স্কয়ার টেক্সটাইল ইয়ার্ন অ্যান্ড ফেব্রিক' },
  { name: 'DBL Industries PLC', cat: 'Textile', yt: '4vMrbbrF6V0', title: 'DBL Industries PLC - ডিবিএল গ্রুপ গার্মেন্টস ও টেক্সটাইল' },
  { name: 'Envoy Textiles PLC', cat: 'Textile', yt: 'WUU0A8TWLiA', title: 'Envoy Textiles PLC - এনভয় টেক্সটাইল ডেনিম এন্ড ডাইং' },
  { name: 'RAK Ceramics Bangladesh PLC', cat: 'Ceramics', yt: 'PUFCPkUBhkw', title: 'RAK Ceramics - আরএকে সিরামিকস লাক্সারি টাইলস অ্যাড' },
  { name: 'BSCCL — Bangladesh Submarine Cables', cat: 'Telecom/ICT', yt: 'ciBnbRssHno', title: 'BSCCL - বাংলাদেশ সাবমেরিন কেবলস হাইস্পিড ইন্টারনেট' },
  { name: 'Eastern Cables PLC', cat: 'Engineering', yt: 'FJtqMY-6MwI', title: 'Eastern Cables PLC - ইস্টার্ন কেবলস কোয়ালিটি ইলেকট্রিক কেবল' },
  { name: 'Olympic Accessories Ltd.', cat: 'Textile', yt: '2S24-y0Ij3Y', title: 'Olympic Accessories - অলিম্পিক গারমেন্টস অ্যাক্সেসরিজ' },
  { name: 'GPH Ispat Ltd.', cat: 'Steel', yt: 'tgbNymZ7vqY', title: 'GPH Ispat Ltd. - জিপিএইচ ইস্পাত স্ট্রাকচারাল স্টিল রড' }
];

const companiesSet2 = [
  { name: 'Bashundhara Group', cat: 'Industrial Conglomerate', yt: 'ciBnbRssHno', title: 'Bashundhara Group - বসুন্ধরা পেপার ও টিস্যু ব্র্যান্ড কমার্শিয়াল' },
  { name: 'PRAN-RFL Group', cat: 'FMCG / Food & Plastics', yt: 'j8lRUAj5Gms', title: 'PRAN-RFL Group - প্রাণ ফ্রুটো ও আরএফএল প্লাস্টিক অফিশিয়াল অ্যাড' },
  { name: 'Square Group', cat: 'Conglomerate', yt: 'WUU0A8TWLiA', title: 'Square Group - স্কয়ার গ্রুপ কোয়ালিটি প্রোডাক্টস কর্পোরেট টিভিসি' },
  { name: 'Akij Group', cat: 'Industrial Conglomerate', yt: '4vMrbbrF6V0', title: 'Akij Group - আকিজ সিরামিকস ও বেভারেজ স্পন্সরড কমার্শিয়াল' },
  { name: 'Meghna Group of Industries', cat: 'FMCG / Industrial', yt: 'PUFCPkUBhkw', title: 'Meghna Group (MGI) - ফ্রেশ প্রিমিয়াম ফুড ও বেভারেজ কমার্শিয়াল' },
  { name: 'City Group', cat: 'FMCG / Agribusiness', yt: 'FJtqMY-6MwI', title: 'City Group - তীর সরিষার তেল ও আটা স্পন্সরড অ্যাড' },
  { name: 'Abul Khair Group', cat: 'Steel / Cement / FMCG', yt: 'XJBrkVkJatg', title: 'Abul Khair Group - শাহ সিমেন্ট ও মার্কস মিল্ক পাউডার' },
  { name: 'TK Group of Industries', cat: 'Conglomerate / Edible Oil', yt: 'tgbNymZ7vqY', title: 'TK Group - পুষ্টি সয়াবিন তেল ও অ্যাঙ্কর সিমেন্ট কমার্শিয়াল' },
  { name: 'Transcom Group', cat: 'FMCG / Pharma / Media', yt: 'L_LUpnjgPso', title: 'Transcom Group - পেপসিকো বিডি ও এসকেএফ ফার্মা কমার্শিয়াল' },
  { name: 'Jamuna Group', cat: 'Electronics / Retail / Media', yt: '3JZ_D3ELwOQ', title: 'Jamuna Group - যমুনা ইলেকট্রনিক্স ও পেগাসাস মোটরবাইক' },
  { name: 'ACI PLC', cat: 'Chemicals / Consumer Brands', yt: 'fJ9rUzIMcZQ', title: 'ACI PLC - এসিআই এ্যারোসল ও পিওর সল্ট অ্যাড' },
  { name: 'BSRM Group', cat: 'Steel & Infrastructure', yt: '2g811KomR4U', title: 'BSRM Group - বিএসআরএম স্টিল চরম শক্তিমত্তা রড' },
  { name: 'KDS Group', cat: 'Textile / Apparel / Logistics', yt: 'kJQP7kiw5Fk', title: 'KDS Group - কেডিএস নিটওয়্যার ও ইনল্যান্ড কন্টেইনার ডিপো' },
  { name: 'Anwar Group', cat: 'Steel / Cement / Finance', yt: 'OPf0YbXqDm0', title: 'Anwar Group - আনোয়ার গ্যালভানাইজিং ও আনোয়ার সিমেন্ট' },
  { name: 'Nitol-Niloy Group', cat: 'Automotive / Insurance', yt: 'l482T0yNkeo', title: 'Nitol-Niloy Group - টাটা কমার্শিয়াল ভেহিকেলস ও নিটল ইন্স্যুরেন্স' },
  { name: 'Navana Group', cat: 'Automotive / Real Estate', yt: 'hY7m5jjJ9mM', title: 'Navana Group - টয়োটা কারস ও নাভানা রিয়েল এস্টেট' },
  { name: 'Summit Group', cat: 'Energy / Infrastructure', yt: 'C0DPdy98e4c', title: 'Summit Group - সামিট পাওয়ার পাওয়ার জেনারেশন স্পন্সর' },
  { name: 'DBL Group', cat: 'Garments & Ceramics', yt: 'YykjpeuMNEk', title: 'DBL Group - ডিবিএল টাইপস টাইলস ও গার্মেন্টস টেক্সটাইল' },
  { name: 'Rahimafrooz', cat: 'Energy & Automotive', yt: 'LSOLM6DRtI4', title: 'Rahimafrooz - রহিমআফ্রোজ আইপিএস ও সোলার এনার্জি ব্যাটারি' },
  { name: 'Walton Group', cat: 'Electronics & Appliances', yt: 'M7lc1UVf-VE', title: 'Walton Group - ওয়ালটন রেফ্রিজারেটর, টেলিভিশন ও এসি' },
  { name: 'Incepta Pharmaceuticals', cat: 'Pharmaceuticals', yt: 'e-ORhEE9VVg', title: 'Incepta Pharma - ইনসেপ্টা লাইফ সেভিং মেডিসিন কমার্শিয়াল' },
  { name: 'Renata PLC', cat: 'Animal & Human Health', yt: '9bZkp7q19f0', title: 'Renata PLC - রেনাটা ফার্মা গ্লোবাল স্ট্যান্ডার্ড অ্যাড' },
  { name: 'Beacon Pharmaceuticals', cat: 'Oncology & Pharma', yt: 'ktvTqknDobU', title: 'Beacon Pharma - বিকন ফার্মাসিউটিক্যালস ক্যান্সার কেয়ার' },
  { name: 'Opsonin Pharma', cat: 'Healthcare & Pharma', yt: 'E3N5Yv0u1eI', title: 'Opsonin Pharma - অপসোনিন ফার্মা আধুনিক চিকিৎসা পণ্য' },
  { name: 'Eskayef Pharmaceuticals', cat: 'Pharmaceuticals', yt: 'a3ICNMQW7Ok', title: 'Eskayef Pharma - এসকেএফ ফার্মাসিউটিক্যালস ইউএস-এফডিএ সার্টিফাইড' },
  { name: 'Popular Pharmaceuticals', cat: 'Pharma & Diagnostic', yt: 'V1bFr2SWP1I', title: 'Popular Pharma - পপুলার ডায়াগনস্টিক সেন্টারে বিশ্বস্ত চিকিৎসা' },
  { name: 'Healthcare Pharmaceuticals', cat: 'Pharma & Medical', yt: '2S24-y0Ij3Y', title: 'Healthcare Pharma - হেলথকেয়ার ফার্মা ওয়ার্ল্ডক্লাস ব্র্যান্ড' },
  { name: 'ACME Laboratories', cat: 'Herbal & OTC Pharma', yt: '3xUX3nS3yG8', title: 'ACME Laboratories - একমি ফার্মা কোয়ালিটি মেডিসিন কমার্শিয়াল' },
  { name: 'Beximco Group', cat: 'Textile / DTH / Pharma', yt: 'kXYiU_JCYtU', title: 'Beximco Group - আকাশ ডিটিএইচ ও বেক্সিমকো টেক্সটাইলস' },
  { name: 'Orion Group', cat: 'Pharma / Infrastructure', yt: 'aJOTlE1K90k', title: 'Orion Group - ওরিয়ন ফার্মা ও ফ্লাইওভার ইনফ্রাস্ট্রাকচার' },
  { name: 'PHP Family', cat: 'Automobile & Float Glass', yt: 'ciBnbRssHno', title: 'PHP Family - পিএইচপি প্রোটন কার ও ফ্লোট গ্লাস লিমিটেড' },
  { name: 'TK Group', cat: 'Pusti Brand Foods', yt: 'j8lRUAj5Gms', title: 'TK Group - পুষ্টি প্রিমিয়াম রিফাইন্ড সুগার ও অয়েল' },
  { name: 'Confidence Group', cat: 'Cement / Power / Infrastructure', yt: 'WUU0A8TWLiA', title: 'Confidence Group - কনফিডেন্স সিমেন্ট ও কনফিডেন্স পাওয়ার' },
  { name: 'Partex Group', cat: 'Furniture & Beverages', yt: '4vMrbbrF6V0', title: 'Partex Group - পারটেক্স স্টার বোর্ড, প্লাস্টিক ও ফার্নিচার' },
  { name: 'Meghna Petroleum', cat: 'Fuel Oil & Energy', yt: 'PUFCPkUBhkw', title: 'Meghna Petroleum - মেঘনা পেট্রোলিয়াম ফুয়েল সাপ্লাই চেইন' },
  { name: 'United Group', cat: 'Healthcare / Energy / Education', yt: 'FJtqMY-6MwI', title: 'United Group - ইউনাইটেড হসপিটাল ও ইন্টারন্যাশনাল ইউনিভার্সিটি' },
  { name: 'SAIF Powertec', cat: 'Port Logistics & Engineering', yt: 'XJBrkVkJatg', title: 'SAIF Powertec - সাইফ পাওয়ারটেক টার্মিনাল হ্যান্ডলিং' },
  { name: 'Sheltech Group', cat: 'Real Estate & Property', yt: 'tgbNymZ7vqY', title: 'Sheltech Group - শেলটেক রিয়েল এস্টেট প্রিমিয়াম অ্যাপার্টমেন্ট' },
  { name: 'Concord Group', cat: 'Amusement & Construction', yt: 'L_LUpnjgPso', title: 'Concord Group - কনকর্ড আর্কিটেকচার ও ফ্যান্টাসি কিংডম' },
  { name: 'Bengal Group of Industries', cat: 'Plastics & Household', yt: '3JZ_D3ELwOQ', title: 'Bengal Group - বেঙ্গল প্লাস্টিকস ডিউরেবল হাউসওয়্যার' },
  { name: 'Fresh Group', cat: 'Pure Food & Beverage', yt: 'fJ9rUzIMcZQ', title: 'Fresh Group - ফ্রেশ রিফাইন্ড ফ্লাওয়ার, মিল্ক ও ওয়াটার' },
  { name: 'Akij Resource', cat: 'Jute & Particle Board', yt: '2g811KomR4U', title: 'Akij Resource - আকিজ জুট ও ইকো পার্টিকল বোর্ড' },
  { name: 'BSRM', cat: 'Extreme Strength Steel', yt: 'kJQP7kiw5Fk', title: 'BSRM - বিএসআরএম ৫০৫এক্সডব্লিউ অরিজিনাল রড' },
  { name: 'RAK Group Bangladesh', cat: 'Ceramics & Tiles', yt: 'OPf0YbXqDm0', title: 'RAK Group - আরএকে সিরামিকস অ্যান্ড সেনিটারি ডেকোর' },
  { name: 'GPH Group', cat: 'Quantum Steel & Iron', yt: 'l482T0yNkeo', title: 'GPH Group - জিপিএইচ ইস্পাত কোয়ান্টাম আর্ক রড' },
  { name: 'Olympic Industries', cat: 'Biscuits & Confectionery', yt: 'hY7m5jjJ9mM', title: 'Olympic Industries - অলিম্পিক পিনাট ও এনার্জি প্লাস বিস্কুট' },
  { name: 'Envoy Group', cat: 'Denim Fabrics & Apparel', yt: 'C0DPdy98e4c', title: 'Envoy Group - এনভয় ডেনিম গ্রিন টেক্সটাইল কারখানা' },
  { name: 'Ha-Meem Group', cat: 'RMG & Denim Industry', yt: 'YykjpeuMNEk', title: 'Ha-Meem Group - হা-মীম গ্রুপ রেডিমেড বিশ্বমানের পোশাক' },
  { name: 'Viyellatex Group', cat: 'Eco Apparel & Knitwear', yt: 'LSOLM6DRtI4', title: 'Viyellatex Group - ভিয়েল্যাটেক্স পরিবেশবান্ধব পোশাক কারখানা' },
  { name: 'Mohammadi Group', cat: 'Apparel Export Industry', yt: 'M7lc1UVf-VE', title: 'Mohammadi Group - মোহাম্মাদী গ্রুপ গার্মেন্ট রফতানি শিল্প' }
];

const allCompanies = [...companiesSet1, ...companiesSet2];

const videoList = allCompanies.map((c, i) => ({
  id: `vid-${i + 1}`,
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
const serverPath = path.join(process.cwd(), 'server.ts');

if (fs.existsSync(dbPath)) {
  const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  dbData.videos = videoList;
  fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2), 'utf8');
  console.log(`db.json successfully updated with ${videoList.length} company videos!`);
}

if (fs.existsSync(serverPath)) {
  let serverCode = fs.readFileSync(serverPath, 'utf8');
  const videosFormatted = JSON.stringify(videoList, null, 4);
  const regex = /videos:\s*\[[\s\S]*?\n  \],/;
  if (regex.test(serverCode)) {
    serverCode = serverCode.replace(regex, `videos: ${videosFormatted},`);
    fs.writeFileSync(serverPath, serverCode, 'utf8');
    console.log(`server.ts successfully updated with ${videoList.length} company videos!`);
  }
}
