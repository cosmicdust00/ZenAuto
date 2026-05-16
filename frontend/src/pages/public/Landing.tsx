import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  CarFront, ArrowRight, Globe, Camera, MessageCircle, 
  ChevronLeft, ChevronRight, Zap, Target, Siren, Timer, ShieldCheck, Cog, Key, RefreshCcw
} from 'lucide-react';

// --- DATA 20 KARTU FAQ (LENGKAP UNTUK RENTAL MOBIL DENGAN IKON MOBIL KUSTOM) ---
const FAQ_CARDS = [
  { q: "ID CARD?", a: "You must provide a valid National ID Card (KTP) and an active Driver's License (SIM A).", icon: CarFront },
  { q: "AGE LIMIT?", a: "The minimum age to rent a standard vehicle is 21 years old.", icon: Zap },
  { q: "DEPOSIT?", a: "Yes, a security deposit is held on your credit card and released upon safe return.", icon: Key },
  { q: "PAYMENT?", a: "Credit cards are preferred. Debit cards accepted subject to background checks.", icon: Target },
  { q: "INSURANCE?", a: "Comprehensive insurance is fully included in the base daily rate.", icon: ShieldCheck },
  { q: "LATE FEE?", a: "Telemetry system generates a late fee of IDR 50,000/hour automatically.", icon: Timer },
  { q: "FUEL RULE?", a: "We operate on a strict full-to-full fuel policy. Return it as you got it.", icon: Cog },
  { q: "MILEAGE?", a: "Standard rentals come with unlimited mileage. Drive freely.", icon: CarFront },
  { q: "ACCIDENT?", a: "Immediately contact our 24/7 support line and the local authorities.", icon: Siren },
  { q: "CO-DRIVER?", a: "An additional driver can be registered during the checkout process.", icon: CarFront },
  { q: "PETS?", a: "Pets allowed, but heavy cleaning fees apply if the interior is ruined.", icon: CarFront },
  { q: "RENT EV?", a: "Absolutely. We offer a premium range of EVs including Tesla and BYD.", icon: Zap },
  { q: "CHARGING?", a: "Cables are provided, access our partner charging network anywhere.", icon: Zap },
  { q: "BORDERS?", a: "Cross-border travel requires prior approval and extended coverage.", icon: Globe },
  { q: "BABY SEAT?", a: "ISOFIX child seats are available as an add-on during checkout.", icon: CarFront },
  { q: "CANCEL?", a: "Free cancellation up to 48 hours before the scheduled pickup time.", icon: RefreshCcw },
  { q: "BREAKDOWN?", a: "Free 24/7 roadside assistance and towing are included.", icon: Siren },
  { q: "UNLOCK?", a: "Use the physical smart key or digital unlocking via our web terminal.", icon: Key },
  { q: "HIDDEN FEE?", a: "Zero. Our pricing matrix is 100% transparent. No surprises.", icon: Target },
  { q: "EXTEND?", a: "Extend your lease via the Borrower Dashboard, subject to availability.", icon: RefreshCcw }
].map((item, index) => ({
  id: String(index + 1).padStart(2, '0'),
  numberId: index + 1,
  title: item.q,
  desc: item.a,
  CardIcon: item.icon,
  // Menggunakan warna-warna Neo-Brutalism secara bergiliran
  color: ['bg-rose-500', 'bg-emerald-400', 'bg-sky-400', 'bg-yellow-400', 'bg-[#DAD0C4]'][index % 5]
}));

export default function Landing() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState<'next' | 'prev' | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Ref untuk mengontrol scroll pada daftar FAQ kanan
  const faqListRef = useRef<HTMLDivElement>(null);
  const faqItemRefs = useRef<Array<HTMLDivElement | null>>([]);

  // Trigger animasi halaman pertama kali dimuat
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Sinkronisasi Scroll: Saat kartu aktif berganti, scroll daftar FAQ kanan ke item yang sesuai
  useEffect(() => {
    const activeFaqItem = faqItemRefs.current[activeIndex];
    const faqList = faqListRef.current;
    if (activeFaqItem && faqList) {
      const listHeight = faqList.clientHeight;
      const itemHeight = activeFaqItem.clientHeight;
      const itemOffset = activeFaqItem.offsetTop;
      
      faqList.scrollTo({
        top: itemOffset - (listHeight / 2) + (itemHeight / 2),
        behavior: 'smooth'
      });
    }
  }, [activeIndex]);

  // Logika Lempar Kartu (Throw Effect)
  const handleNext = () => {
    if (animating) return;
    setAnimating('next');
    setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % FAQ_CARDS.length);
      setAnimating(null);
    }, 400);
  };

  const handlePrev = () => {
    if (animating) return;
    setAnimating('prev');
    setTimeout(() => {
      setActiveIndex((prev) => (prev - 1 + FAQ_CARDS.length) % FAQ_CARDS.length);
      setAnimating(null);
    }, 400);
  };

  // Observers kustom tahan banting (Anti blank-screen)
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('opacity-0', 'translate-y-12', '-translate-x-full');
          entry.target.classList.add('opacity-100', 'translate-y-0', 'translate-x-0');
        }
      });
    }, { threshold: 0.05, rootMargin: '50px' });

    document.querySelectorAll('.scroll-target').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const currentCard = FAQ_CARDS[activeIndex];

  return (
    <div className="min-h-screen bg-[#F0E9E0] overflow-hidden">
      
      {/* SUNTIKAN CSS KHUSUS UNTUK RUNNING TEXT BIAR LANCAR 100% */}
      <style>
        {`
          @keyframes newsTicker {
            0% { transform: translate3d(0, 0, 0); }
            100% { transform: translate3d(-50%, 0, 0); }
          }
          .animate-news-ticker {
            display: flex;
            width: max-content;
            animation: newsTicker 35s linear infinite;
          }
          .animate-news-ticker:hover {
            animation-play-state: paused;
          }
        `}
      </style>

      {/* 1. RUNNING TEXT PROMO (MERAH, TEKS PUTIH, GARIS PEMISAH PUTIH) */}
      <div className="bg-red-600 border-b-4 border-[#0F1525] py-3 flex overflow-hidden">
        <div className="animate-news-ticker font-black uppercase text-sm tracking-widest text-white">
          
          {/* --- KELOMPOK BERITA 1 --- */}
          <span className="mx-6 flex items-center gap-2"><Zap className="w-5 h-5"/> NEW ARRIVAL: TESLA MODEL 3 NOW AVAILABLE</span>
          <div className="w-1 h-5 bg-white mx-2 rounded-full"></div>
          
          <span className="mx-6 flex items-center gap-2"><Zap className="w-5 h-5"/> USE CODE "ZENAUTO2026" FOR 20% OFF YOUR FIRST RENT</span>
          <div className="w-1 h-5 bg-white mx-2 rounded-full"></div>
          
          <span className="mx-6 flex items-center gap-2"><Zap className="w-5 h-5"/> 24/7 ROADSIDE ASSISTANCE INCLUDED</span>
          <div className="w-1 h-5 bg-white mx-2 rounded-full"></div>

          <span className="mx-6 flex items-center gap-2"><Zap className="w-5 h-5"/> UNLIMITED MILEAGE FOR STANDARD RENTALS</span>
          <div className="w-1 h-5 bg-white mx-2 rounded-full"></div>

          <span className="mx-6 flex items-center gap-2"><Zap className="w-5 h-5"/> FULLY INSURED PREMIUM FLEETS</span>
          <div className="w-1 h-5 bg-white mx-2 rounded-full"></div>

          <span className="mx-6 flex items-center gap-2"><Zap className="w-5 h-5"/> BOOK INSTANTLY VIA OUR WEB TERMINAL</span>
          <div className="w-1 h-5 bg-white mx-2 rounded-full"></div>

          {/* --- KELOMPOK BERITA 2 (DUPLIKAT AGAR LOOPINGNYA HALUS & TIDAK PUTUS) --- */}
          <span className="mx-6 flex items-center gap-2"><Zap className="w-5 h-5"/> NEW ARRIVAL: TESLA MODEL 3 NOW AVAILABLE</span>
          <div className="w-1 h-5 bg-white mx-2 rounded-full"></div>
          
          <span className="mx-6 flex items-center gap-2"><Zap className="w-5 h-5"/> USE CODE "ZENAUTO2026" FOR 20% OFF YOUR FIRST RENT</span>
          <div className="w-1 h-5 bg-white mx-2 rounded-full"></div>
          
          <span className="mx-6 flex items-center gap-2"><Zap className="w-5 h-5"/> 24/7 ROADSIDE ASSISTANCE INCLUDED</span>
          <div className="w-1 h-5 bg-white mx-2 rounded-full"></div>

          <span className="mx-6 flex items-center gap-2"><Zap className="w-5 h-5"/> UNLIMITED MILEAGE FOR STANDARD RENTALS</span>
          <div className="w-1 h-5 bg-white mx-2 rounded-full"></div>

          <span className="mx-6 flex items-center gap-2"><Zap className="w-5 h-5"/> FULLY INSURED PREMIUM FLEETS</span>
          <div className="w-1 h-5 bg-white mx-2 rounded-full"></div>

          <span className="mx-6 flex items-center gap-2"><Zap className="w-5 h-5"/> BOOK INSTANTLY VIA OUR WEB TERMINAL</span>
          <div className="w-1 h-5 bg-white mx-2 rounded-full"></div>

        </div>
      </div>

      {/* 2. HERO SECTION */}
      <header className="relative bg-[#0F1525] text-white pt-20 pb-24 border-b-8 border-[#DAD0C4]">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>
        
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div className={`space-y-6 transition-all duration-1000 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <span className="bg-yellow-400 text-[#0F1525] uppercase font-black px-4 py-1.5 text-xs border-2 border-[#0F1525] shadow-[3px_3px_0px_#DAD0C4] tracking-widest inline-block">
              PREMIUM CAR RENTAL SERVICE
            </span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none uppercase">
              DRIVE YOUR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-amber-200 underline decoration-8 decoration-[#DAD0C4] pb-2 inline-block">
                DREAM CAR
              </span>
            </h1>
            <p className="text-lg text-gray-300 max-w-md font-medium leading-relaxed">
              Experience the ultimate freedom on the road. We provide a seamless, premium car rental experience with a diverse fleet of standard and electric vehicles tailored for your journey.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link to="/borrower/cars" className="neo-btn bg-yellow-400 text-black px-8 py-4 text-base font-black uppercase tracking-wider inline-flex items-center gap-2 rounded-none">
                Browse Fleet <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/register" className="neo-btn bg-white text-black px-8 py-4 text-base font-black uppercase tracking-wider rounded-none">
                Become a Member
              </Link>
            </div>
          </div>
          
          <div className={`flex justify-center transition-all duration-1000 delay-300 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <div className="bg-[#DAD0C4] border-4 border-[#0F1525] p-4 shadow-[12px_12px_0px_0px_#062954] max-w-sm transform rotate-3 hover:rotate-0 transition-all duration-300">
              <img 
                src="https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=600&q=80" 
                alt="ZenAuto Premium Fleet" 
                className="border-4 border-[#0F1525] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </header>

      {/* 3. CHAINZOKU STYLE FAQ CARD SLIDER WITH SCROLLABLE KNOWLEDGE BASE */}
      <section className="bg-[#1A4B3A] text-[#F0E9E0] py-32 border-b-8 border-[#DAD0C4] overflow-hidden">
        
        {/* Kontainer Utama - Slide in from Left */}
        <div className="scroll-target opacity-0 -translate-x-full transition-all duration-1000 ease-out max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-16">
          
          {/* Tumpukan Kartu (KIRI) - Hanya Nomor Besar & Ikon */}
          <div className="relative flex justify-center items-center w-full md:w-1/2 h-[550px]">
            
            {/* Kartu Latar Belakang (Hiasan 2) */}
            <div className="absolute w-[320px] md:w-[380px] h-[500px] bg-white border-4 border-black transform -rotate-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)] opacity-40"></div>
            
            {/* Kartu Latar Belakang (Hiasan 1) */}
            <div className="absolute w-[320px] md:w-[380px] h-[500px] bg-[#DAD0C4] border-4 border-black transform rotate-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] opacity-80 z-0"></div>
            
            {/* Kartu Utama (Active) - Efek Terlempar (Throw) */}
            <div 
              className={`absolute w-[320px] md:w-[380px] h-[500px] border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-center items-center p-6 z-10 transition-all duration-400 ease-in-out ${currentCard.color}
                ${animating === 'next' ? 'translate-y-[150%] rotate-[25deg] opacity-0 scale-90' : ''}
                ${animating === 'prev' ? 'translate-y-[150%] -rotate-[25deg] opacity-0 scale-90' : ''}
                ${!animating ? 'translate-y-0 rotate-0 opacity-100 scale-100' : ''}
              `}
            >
              {/* Header Kartu - ZenAuto Branding */}
              <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-20">
                <span className="font-black text-black tracking-widest uppercase bg-white px-2 border-2 border-black text-xs shadow-[2px_2px_0px_#000]">ZenAuto Inc.</span>
                <div className="w-10 h-10 bg-white rounded-full border-4 border-black flex items-center justify-center text-black font-black text-sm shadow-[2px_2px_0px_#000]">
                  #{currentCard.id}
                </div>
              </div>
              
              {/* Giant Number & Car Icon */}
              <div className="text-center relative flex flex-col items-center justify-center">
                <h2 className="text-[200px] md:text-[250px] leading-none font-black text-white drop-shadow-[8px_8px_0px_rgba(0,0,0,1)] tracking-tighter z-0">
                  {currentCard.numberId}
                </h2>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white opacity-40 z-10">
                  <currentCard.CardIcon size={120} strokeWidth={4} />
                </div>
              </div>
            </div>

            {/* Tombol Kiri Kanan Mengambang di Luar Kartu (Bouncy Buttons) */}
            <button 
              onClick={handlePrev} 
              disabled={animating !== null}
              className="absolute top-1/2 left-0 md:-left-12 transform -translate-y-1/2 bg-lime-300 w-16 h-16 rounded-full border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_#000] hover:bg-white active:translate-y-1 active:shadow-none transition-all cursor-pointer z-20"
            >
              <ChevronLeft className="w-10 h-10 text-black" />
            </button>
            <button 
              onClick={handleNext} 
              disabled={animating !== null}
              className="absolute top-1/2 right-0 md:-right-12 transform -translate-y-1/2 bg-lime-300 w-16 h-16 rounded-full border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_#000] hover:bg-white active:translate-y-1 active:shadow-none transition-all cursor-pointer z-20"
            >
              <ChevronRight className="w-10 h-10 text-black" />
            </button>
          </div>

          {/* Panel FAQ KNOWLEDGE BASE (KANAN) - Scrollable */}
          <div className="w-full md:w-1/2 space-y-8 text-left h-[550px] flex flex-col justify-between">
            {/* Judul Utama Bergaya Neo-Brutalism (Teks Lime) */}
            <h2 className="text-5xl font-black text-lime-300 uppercase tracking-tighter leading-none border-b-4 border-lime-300 pb-4">
              KNOWLEDGE <br/> DATABASE
            </h2>
            
            {/* Daftar FAQ Lengkap 1-20 (Scrollable Container) */}
            <div 
              ref={faqListRef} 
              className="flex-1 overflow-y-auto pr-4 space-y-8 scroll-bar-brutalism"
            >
              {FAQ_CARDS.map((faq, index) => (
                <div 
                  key={`${faq.id}-${index}`}
                  ref={(el) => { faqItemRefs.current[index] = el; }}
                  className={`flex items-start gap-6 transition-all duration-300 p-4 border-4 border-black rounded-lg ${activeIndex === index ? 'bg-yellow-400 text-black shadow-[4px_4px_0px_#000]' : 'bg-transparent text-[#F0E9E0]'}`}
                >
                  {/* Nomor Besar FAQ (Kiri Item) */}
                  <span className={`text-6xl font-black tracking-tighter leading-none ${activeIndex === index ? 'text-black' : 'text-gray-500'}`}>
                    {faq.id}
                  </span>
                  
                  {/* Konten FAQ (Kanan Nomor) */}
                  <div className="space-y-2 flex-1">
                    <h4 className="text-lg font-black uppercase tracking-wide leading-tight">
                      {faq.title}
                    </h4>
                    <p className={`font-bold text-sm leading-relaxed ${activeIndex === index ? 'text-black' : 'text-gray-300'}`}>
                      {faq.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Helper Text bawah FAQ */}
            <p className="text-gray-300 font-bold leading-relaxed border-t-2 border-dashed border-gray-600 pt-4 text-xs italic">
              Everything you need to know before stepping on the gas pedal. The Knowledge Base follows standard structure. Total autonomy.
            </p>
          </div>

        </div>
      </section>

      {/* 4. FOOTER */}
      <footer className="bg-[#0F1525] border-t-8 border-white py-16 px-6 relative">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>
        <div className="scroll-target opacity-0 translate-y-12 transition-all duration-700 ease-out max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-white relative z-10">
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-4xl font-black italic tracking-widest flex items-center gap-3">
               <span className="bg-white text-black p-2 rounded-xl border-2 border-black shadow-[3px_3px_0px_gray]"><CarFront className="w-8 h-8"/></span>
               ZENAUTO RIDE
            </h2>
            <p className="text-gray-300 font-medium text-lg max-w-sm italic">
              The world's first premium car rental service tailored with robust telemetry. Built for legends, by legends.
            </p>
            <div className="flex gap-4 pt-4">
              <button className="bg-white text-black p-3 rounded-2xl border-2 border-black shadow-[4px_4px_0px_gray] hover:translate-y-1 hover:shadow-none transition-all cursor-pointer">
                <MessageCircle className="w-6 h-6" />
              </button>
              <button className="bg-white text-black p-3 rounded-2xl border-2 border-black shadow-[4px_4px_0px_gray] hover:translate-y-1 hover:shadow-none transition-all cursor-pointer">
                <Camera className="w-6 h-6" />
              </button>
              <button className="bg-white text-black p-3 rounded-2xl border-2 border-black shadow-[4px_4px_0px_gray] hover:translate-y-1 hover:shadow-none transition-all cursor-pointer">
                <Globe className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-black italic tracking-widest uppercase text-lime-300">Links</h3>
            <ul className="space-y-4 font-bold text-gray-400 tracking-wider text-sm">
              <li className="hover:text-yellow-400 cursor-pointer transition-colors uppercase">THE FLEET</li>
              <li className="hover:text-yellow-400 cursor-pointer transition-colors uppercase">LOCATIONS</li>
              <li className="hover:text-yellow-400 cursor-pointer transition-colors uppercase">MEMBERSHIP</li>
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-black italic tracking-widest uppercase text-lime-300">Legal</h3>
            <ul className="space-y-4 font-bold text-gray-400 tracking-wider text-sm">
              <li className="hover:text-yellow-400 cursor-pointer transition-colors uppercase">TERMS OF USE</li>
              <li className="hover:text-yellow-400 cursor-pointer transition-colors uppercase">PRIVACY POLICY</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}