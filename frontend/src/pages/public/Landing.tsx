import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext'; 
import { 
  CarFront, ArrowRight, Globe, Camera, MessageCircle, 
  ChevronLeft, ChevronRight, Zap, Target, Siren, Timer, ShieldCheck, Cog, Key, RefreshCcw,
  Send, BellRing, CheckCircle2, X, MapPin, Aperture,
  Video, Share2, Music
} from 'lucide-react';

// Daftar Ikon untuk dirotasi pada data yang ditarik dari database
const ICON_POOL = [CarFront, Zap, Key, Target, ShieldCheck, Timer, Cog, Globe, RefreshCcw, Siren];

// Fallback data jika backend mati
const INITIAL_FAQ_CARDS = [
  { q: "ID CARD?", a: "You must provide a valid National ID Card (KTP) and an active Driver's License (SIM A).", icon: CarFront },
  { q: "AGE LIMIT?", a: "The minimum age to rent a standard vehicle is 21 years old.", icon: Zap },
  { q: "DEPOSIT?", a: "Yes, a security deposit is held on your credit card and released upon safe return.", icon: Key },
].map((item, index) => ({
  id: String(index + 1).padStart(2, '0'),
  numberId: index + 1,
  title: item.q,
  desc: item.a,
  CardIcon: item.icon,
  rawId: 'fallback',
  color: ['bg-rose-500', 'bg-emerald-400', 'bg-sky-400', 'bg-yellow-400', 'bg-[#DAD0C4]'][index % 5]
}));

export default function Landing() {
  const { token } = useAuth();

  const [rotation, setRotation] = useState(0); 
  const [isInteracting, setIsInteracting] = useState(false); 
  const [lastX, setLastX] = useState(0); 

  const handleInteractionStart = (e: any) => {
    setIsInteracting(true);
    setLastX(e.clientX || (e.touches && e.touches[0].clientX));
  };

  const handleInteractionMove = (e: any) => {
    if (!isInteracting) return;
    const currentX = e.clientX || (e.touches && e.touches[0].clientX);
    const deltaX = currentX - lastX;
    setRotation((prev) => prev + deltaX * 0.6); 
    setLastX(currentX);
  };

  const handleInteractionEnd = () => {
    setIsInteracting(false);
  };

  const [faqCards, setFaqCards] = useState<any[]>(INITIAL_FAQ_CARDS);
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState<'next' | 'prev' | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatStep, setChatStep] = useState<'customer_input' | 'admin_reply'>('customer_input');
  const [savedQuestion, setSavedQuestion] = useState('');
  const [adminAnswer, setAdminAnswer] = useState('');

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isGlobeOpen, setIsGlobeOpen] = useState(false);

  const faqListRef = useRef<HTMLDivElement>(null);
  const faqItemRefs = useRef<Array<HTMLDivElement | null>>([]);

  // Fetch data FAQ dari backend saat komponen dimuat
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/faqs');
        const dbFaqs = response.data.map((faq: any, index: number) => ({
          id: String(faq.number_id || index + 1).padStart(2, '0'),
          numberId: faq.number_id || index + 1,
          title: faq.title,
          desc: faq.desc,
          CardIcon: ICON_POOL[index % ICON_POOL.length],
          rawId: faq.id, 
          color: ['bg-rose-500', 'bg-emerald-400', 'bg-sky-400', 'bg-yellow-400', 'bg-[#DAD0C4]'][index % 5]
        }));
        
        if (dbFaqs.length > 0) {
          setFaqCards(dbFaqs);
        }
      } catch (error) {
        console.error("Gagal memuat FAQ dari database, menggunakan data fallback.", error);
      } finally {
        setIsLoaded(true);
      }
    };

    fetchFaqs();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('opacity-0', 'translate-y-12', '-translate-x-full');
          entry.target.classList.add('opacity-100', 'translate-y-0', 'translate-x-0');
        }
      });
    }, { threshold: 0.05, rootMargin: '50px' });

    // Temukan semua kelas 'scroll-target' di dalam DOM dan berikan observer
    document.querySelectorAll('.scroll-target').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isLoaded, faqCards]); // Efek dipicu ulang saat data selesai di-load

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
  }, [activeIndex, faqCards.length]);

  const handleNext = () => {
    if (animating) return;
    setAnimating('next');
    setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % faqCards.length);
      setAnimating(null);
    }, 400);
  };

  const handlePrev = () => {
    if (animating) return;
    setAnimating('prev');
    setTimeout(() => {
      setActiveIndex((prev) => (prev - 1 + faqCards.length) % faqCards.length);
      setAnimating(null);
    }, 400);
  };

  const handleCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!savedQuestion.trim()) return;
    
    try {
      await axios.post('http://localhost:5000/api/faqs/inquiry', { 
        question: savedQuestion 
      });
      alert("Pertanyaan berhasil dikirim ke antrean admin!");
      setChatStep('admin_reply');
    } catch (error) {
      console.error("Gagal mengirim pertanyaan:", error);
      alert("Terjadi kesalahan saat mengirim pertanyaan.");
    }
  };

  const handleAdminPublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminAnswer.trim()) return;

    if (!token) {
      alert("Akses Ditolak: Anda harus login sebagai Admin/Staff untuk mempublikasikan FAQ.");
      return;
    }

    try {
      const simulationId = "dummy-uuid-atau-id-asli-dari-tabel-faq"; 

      await axios.put(`http://localhost:5000/api/faqs/publish/${simulationId}`, {
        answer: adminAnswer
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const nextId = faqCards.length + 1;
      const newFaqItem = {
        id: String(nextId).padStart(2, '0'),
        numberId: nextId,
        title: savedQuestion.toUpperCase().endsWith('?') ? savedQuestion.toUpperCase() : `${savedQuestion.toUpperCase()}?`,
        desc: adminAnswer,
        CardIcon: MessageCircle,
        rawId: simulationId,
        color: ['bg-rose-500', 'bg-emerald-400', 'bg-sky-400', 'bg-yellow-400', 'bg-[#DAD0C4]'][faqCards.length % 5]
      };

      setFaqCards(prev => [...prev, newFaqItem]);
      setSavedQuestion('');
      setAdminAnswer('');
      setChatStep('customer_input');
      setIsChatOpen(false);

      setAnimating('next');
      setTimeout(() => {
        setActiveIndex(faqCards.length);
        setAnimating(null);
      }, 400);

      alert("FAQ Berhasil Dipublikasikan!");

    } catch (error: any) {
      console.error("Gagal mempublikasikan FAQ:", error);
      alert(error.response?.data?.message || "Gagal mempublikasikan. Pastikan ID valid dan token aktif.");
    }
  };

  const currentCard = faqCards[activeIndex] || faqCards[0];

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-[#F0E9E0] overflow-hidden relative">
      
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
          .scroll-bar-brutalism::-webkit-scrollbar { width: 12px; }
          .scroll-bar-brutalism::-webkit-scrollbar-track { background: #0F1525; border-left: 4px solid #F0E9E0; }
          .scroll-bar-brutalism::-webkit-scrollbar-thumb { background: #a3e635; border: 4px solid #0F1525; }

          @keyframes bubblePop {
            0% { transform: scale(0.6) translateY(30px); opacity: 0; }
            100% { transform: scale(1) translateY(0); opacity: 1; }
          }
          .animate-bubble-pop {
            animation: bubblePop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          }
        `}
      </style>

      {/* 1. RUNNING TEXT PROMO */}
      <div className="bg-red-600 border-b-4 border-[#0F1525] py-3 flex overflow-hidden">
        <div className="animate-news-ticker font-black uppercase text-sm tracking-widest text-white">
          <span className="mx-6 flex items-center gap-2"><Zap className="w-5 h-5"/> NEW ARRIVAL: TESLA MODEL 3 NOW AVAILABLE</span>
          <div className="w-1 h-5 bg-white mx-2 rounded-full"></div>
          <span className="mx-6 flex items-center gap-2"><Zap className="w-5 h-5"/> USE CODE "ZENAUTO2026" FOR 20% OFF YOUR FIRST RENT</span>
          <div className="w-1 h-5 bg-white mx-2 rounded-full"></div>
          <span className="mx-6 flex items-center gap-2"><Zap className="w-5 h-5"/> 24/7 ROADSIDE ASSISTANCE INCLUDED</span>
          <div className="w-1 h-5 bg-white mx-2 rounded-full"></div>
          
          <span className="mx-6 flex items-center gap-2"><Zap className="w-5 h-5"/> NEW ARRIVAL: TESLA MODEL 3 NOW AVAILABLE</span>
          <div className="w-1 h-5 bg-white mx-2 rounded-full"></div>
          <span className="mx-6 flex items-center gap-2"><Zap className="w-5 h-5"/> USE CODE "ZENAUTO2026" FOR 20% OFF YOUR FIRST RENT</span>
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
              <Link to="/cars" className="neo-btn bg-yellow-400 text-black px-8 py-4 text-base font-black uppercase tracking-wider inline-flex items-center gap-2 rounded-none">
                Browse Fleet <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/register" className="neo-btn bg-white text-black px-8 py-4 text-base font-black uppercase tracking-wider rounded-none">
                Become a Member
              </Link>
            </div>
          </div>
          
          <div className={`flex justify-center transition-all duration-1000 delay-300 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <div className="relative group">
              <div className="bg-[#DAD0C4] border-4 border-[#0F1525] p-5 shadow-[12px_12px_0px_0px_#062954] transform rotate-2 rounded-2xl">
                <div 
                  className="w-[290px] h-[290px] sm:w-[350px] sm:h-[350px] relative rounded-full border-4 border-black overflow-hidden bg-black cursor-grab active:cursor-grabbing shadow-2xl transition-transform duration-150 ease-out select-none"
                  style={{ transform: `rotate(${rotation}deg)` }}
                  onMouseDown={handleInteractionStart}
                  onMouseMove={handleInteractionMove}
                  onMouseUp={handleInteractionEnd}
                  onMouseLeave={handleInteractionEnd}
                  onTouchStart={handleInteractionStart}
                  onTouchMove={handleInteractionMove}
                  onTouchEnd={handleInteractionEnd}
                >
                  <img 
                    src="https://i.pinimg.com/736x/85/93/fc/8593fc2db336172660f4dbea1783b758.jpg" 
                    alt="ZenAuto Interactive Album" 
                    className="w-full h-full object-cover pointer-events-none select-none"
                  />
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-[#DAD0C4] rounded-full border-4 border-black shadow-inner flex items-center justify-center">
                    <div className="w-2.5 h-2.5 bg-[#0F1525] rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 3. CHAINZOKU STYLE FAQ SLIDER */}
      <section className="bg-[#1A4B3A] text-[#F0E9E0] py-32 border-b-8 border-[#DAD0C4] overflow-hidden">
        <div className="scroll-target opacity-0 -translate-x-full transition-all duration-1000 ease-out max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-16">
          
          <div className="relative flex justify-center items-center w-full md:w-1/2 h-[550px]">
            <div className="absolute w-[320px] md:w-[380px] h-[500px] bg-white border-4 border-black transform -rotate-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)] opacity-40"></div>
            <div className="absolute w-[320px] md:w-[380px] h-[500px] bg-[#DAD0C4] border-4 border-black transform rotate-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] opacity-80 z-0"></div>
            
            {currentCard && (
              <div 
                className={`absolute w-[320px] md:w-[380px] h-[500px] border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-center items-center p-6 z-10 transition-all duration-400 ease-in-out ${currentCard.color}
                  ${animating === 'next' ? 'translate-y-[150%] rotate-[25deg] opacity-0 scale-90' : ''}
                  ${animating === 'prev' ? 'translate-y-[150%] -rotate-[25deg] opacity-0 scale-90' : ''}
                  ${!animating ? 'translate-y-0 rotate-0 opacity-100 scale-100' : ''}
                `}
              >
                <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-20">
                  <span className="font-black text-black tracking-widest uppercase bg-white px-2 border-2 border-black text-xs shadow-[2px_2px_0px_#000]">ZenAuto Inc.</span>
                  <div className="w-10 h-10 bg-white rounded-full border-4 border-black flex items-center justify-center text-black font-black text-sm shadow-[2px_2px_0px_#000]">
                    #{currentCard.id}
                  </div>
                </div>
                
                <div className="text-center relative flex flex-col items-center justify-center">
                  <h2 className="text-[200px] md:text-[250px] leading-none font-black text-white drop-shadow-[8px_8px_0px_rgba(0,0,0,1)] tracking-tighter z-0">
                    {currentCard.numberId}
                  </h2>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white opacity-40 z-10">
                    <currentCard.CardIcon size={120} strokeWidth={4} />
                  </div>
                </div>
              </div>
            )}

            <button onClick={handlePrev} disabled={animating !== null} className="absolute top-1/2 left-0 md:-left-12 transform -translate-y-1/2 bg-lime-300 w-16 h-16 rounded-full border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_#000] hover:bg-white active:translate-y-1 active:shadow-none transition-all cursor-pointer z-20">
              <ChevronLeft className="w-10 h-10 text-black" />
            </button>
            <button onClick={handleNext} disabled={animating !== null} className="absolute top-1/2 right-0 md:-right-12 transform -translate-y-1/2 bg-lime-300 w-16 h-16 rounded-full border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_#000] hover:bg-white active:translate-y-1 active:shadow-none transition-all cursor-pointer z-20">
              <ChevronRight className="w-10 h-10 text-black" />
            </button>
          </div>

          <div className="w-full md:w-1/2 space-y-8 text-left h-[550px] flex flex-col justify-between">
            <h2 className="text-5xl font-black text-lime-300 uppercase tracking-tighter leading-none border-b-4 border-lime-300 pb-4">
              KNOWLEDGE <br/> DATABASE
            </h2>
            
            <div ref={faqListRef} className="flex-1 overflow-y-auto pr-4 space-y-8 scroll-bar-brutalism">
              {faqCards.map((faq, index) => (
                <div 
                  key={`${faq.id}-${index}`}
                  ref={(el) => { faqItemRefs.current[index] = el; }}
                  className={`flex items-start gap-6 transition-all duration-300 p-4 border-4 border-black rounded-lg ${activeIndex === index ? 'bg-yellow-400 text-black shadow-[4px_4px_0px_#000]' : 'bg-transparent text-[#F0E9E0]'}`}
                >
                  <span className={`text-6xl font-black tracking-tighter leading-none ${activeIndex === index ? 'text-black' : 'text-gray-500'}`}>
                    {faq.id}
                  </span>
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
            
            <p className="text-gray-300 font-bold border-t-2 border-dashed border-gray-600 pt-4 text-xs italic">
              Total {faqCards.length} entries registered in database. Continuous integration enabled.
            </p>
          </div>
        </div>
      </section>

      {/* 4. FOOTER */}
      <footer className="bg-[#0F1525] border-t-8 border-white py-16 px-6 relative">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>
        <div className="scroll-target opacity-0 translate-y-12 transition-all duration-700 ease-out max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-white relative z-10">
          <div className="md:col-span-2 space-y-6 relative">
            <h2 className="text-4xl font-black italic tracking-widest flex items-center gap-3">
               <span className="bg-white text-black p-2 rounded-xl border-2 border-black shadow-[3px_3px_0px_gray]"><CarFront className="w-8 h-8"/></span>
               ZENAUTO RIDE
            </h2>
            <p className="text-gray-300 font-medium text-lg max-w-sm italic">
              The world's first premium car rental service tailored with robust telemetry. Built for legends, by legends.
            </p>
            
            <div className="flex gap-4 pt-4 items-center">
              
              <div className="relative">
                <button 
                  onClick={() => {
                    setIsChatOpen(!isChatOpen);
                    setIsCameraOpen(false);
                    setIsGlobeOpen(false);
                    setChatStep('customer_input');
                  }}
                  className={`p-3 rounded-2xl border-2 border-black shadow-[4px_4px_0px_gray] transition-all cursor-pointer block ${isChatOpen ? 'bg-rose-500 text-white' : 'bg-white text-black hover:translate-y-1 hover:shadow-none'}`}
                >
                  <MessageCircle className="w-6 h-6" />
                </button>

                {isChatOpen && (
                  <div className="animate-bubble-pop absolute bottom-16 left-0 w-[320px] bg-white border-4 border-black p-5 shadow-[8px_8px_0px_rgba(0,0,0,0.3)] z-[999] rounded-[2rem] rounded-bl-none text-black">
                    {chatStep === 'customer_input' && (
                      <form onSubmit={handleCustomerSubmit} className="space-y-4">
                        <div className="flex items-center gap-2 border-b-2 border-gray-200 pb-2">
                          <MessageCircle className="w-5 h-5 text-lime-600" />
                          <h4 className="font-black uppercase text-xs tracking-wider text-gray-700">Customer Inquiry Frame</h4>
                        </div>
                        <textarea value={savedQuestion} onChange={(e) => setSavedQuestion(e.target.value)} placeholder="Ex: Do you accept international permits?" className="w-full p-3 border-2 border-black rounded-xl text-xs font-bold resize-none outline-none bg-gray-50 h-20" required />
                        <button type="submit" className="w-full bg-lime-400 text-black font-black uppercase text-xs py-2.5 rounded-xl border-2 border-black flex justify-center items-center gap-2 shadow-[2px_2px_0px_#000]">Send to Admin <Send className="w-3.5 h-3.5" /></button>
                      </form>
                    )}
                    {chatStep === 'admin_reply' && (
                      <form onSubmit={handleAdminPublish} className="space-y-4">
                        <div className="bg-rose-100 border-2 border-rose-500 rounded-xl p-2.5 flex items-center gap-2 text-rose-800 animate-pulse">
                          <BellRing className="w-5 h-5 flex-shrink-0" />
                          <span className="font-black text-[10px] uppercase tracking-wider">[!] 1 NEW FAQ PENDING</span>
                        </div>
                        <textarea value={adminAnswer} onChange={(e) => setAdminAnswer(e.target.value)} placeholder="Type the official answer registry..." className="w-full p-3 border-2 border-black rounded-xl text-xs font-bold resize-none outline-none bg-yellow-50 h-24" required />
                        <button type="submit" className="w-full bg-[#0F1525] text-white font-black uppercase text-xs py-2.5 rounded-xl border-2 border-black shadow-[3px_3px_0px_#a3e635]">Approve & Publish <CheckCircle2 className="w-4 h-4 text-lime-400" /></button>
                      </form>
                    )}
                  </div>
                )}
              </div>

              <div className="relative">
                <button 
                  onClick={() => {
                    setIsCameraOpen(!isCameraOpen);
                    setIsChatOpen(false);
                    setIsGlobeOpen(false);
                  }}
                  className={`p-3 rounded-2xl border-2 border-black shadow-[4px_4px_0px_gray] transition-all cursor-pointer block ${isCameraOpen ? 'bg-amber-400 text-black' : 'bg-white text-black hover:translate-y-1 hover:shadow-none'}`}
                >
                  <Camera className="w-6 h-6" />
                </button>

                {isCameraOpen && (
                  <div className="animate-bubble-pop absolute bottom-16 left-0 w-[300px] bg-white border-4 border-black p-5 shadow-[8px_8px_0px_rgba(0,0,0,0.3)] z-[999] rounded-[2rem] rounded-bl-none text-black space-y-4">
                    <div className="flex items-center justify-between border-b-2 border-gray-200 pb-2">
                      <h4 className="font-black text-xs uppercase tracking-wider text-gray-700 flex items-center gap-2">
                        <Camera className="w-4 h-4 text-rose-500" /> Official Social Matrix
                      </h4>
                      <span className="bg-lime-300 text-[9px] font-black px-2 py-0.5 border border-black rounded-full">ONLINE</span>
                    </div>

                    <div className="space-y-3 font-black text-xs uppercase tracking-wide">
                      <div className="flex items-center gap-3 p-2 bg-gray-50 border-2 border-black rounded-xl hover:bg-yellow-50 transition-colors">
                        <div className="w-8 h-8 bg-pink-100 rounded-lg border border-black flex items-center justify-center text-pink-600"><Aperture className="w-4 h-4" /></div>
                        <div>
                          <span className="text-[9px] text-gray-400 block font-bold">Instagram</span>
                          <span className="text-[#0F1525]">@zenAuto.car</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-2 bg-gray-50 border-2 border-black rounded-xl hover:bg-yellow-50 transition-colors">
                        <div className="w-8 h-8 bg-red-100 rounded-lg border border-black flex items-center justify-center text-red-600"><Video className="w-4 h-4" /></div>
                        <div>
                          <span className="text-[9px] text-gray-400 block font-bold">YouTube</span>
                          <span className="text-[#0F1525]">ZenAuto Rent Car</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-2 bg-gray-50 border-2 border-black rounded-xl hover:bg-yellow-50 transition-colors">
                        <div className="w-8 h-8 bg-gray-900 rounded-lg border border-black flex items-center justify-center text-white"><Share2 className="w-4 h-4" /></div>
                        <div>
                          <span className="text-[9px] text-gray-400 block font-bold">Twitter / X</span>
                          <span className="text-[#0F1525]">@zenAuto.car</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-2 bg-gray-50 border-2 border-black rounded-xl hover:bg-yellow-50 transition-colors">
                        <div className="w-8 h-8 bg-cyan-100 rounded-lg border border-black flex items-center justify-center text-black"><Music className="w-4 h-4" /></div>
                        <div>
                          <span className="text-[9px] text-gray-400 block font-bold">TikTok</span>
                          <span className="text-[#0F1525]">@zenAuto.car</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <button 
                  onClick={() => {
                    setIsGlobeOpen(!isGlobeOpen);
                    setIsChatOpen(false);
                    setIsCameraOpen(false);
                  }}
                  className={`p-3 rounded-2xl border-2 border-black shadow-[4px_4px_0px_gray] transition-all cursor-pointer block ${isGlobeOpen ? 'bg-sky-400 text-black' : 'bg-white text-black hover:translate-y-1 hover:shadow-none'}`}
                >
                  <Globe className="w-6 h-6" />
                </button>

                {isGlobeOpen && (
                  <div className="animate-bubble-pop absolute bottom-16 left-0 w-[320px] bg-[#0F1525] border-4 border-black p-4 shadow-[8px_8px_0px_rgba(0,0,0,0.5)] z-[999] rounded-[2rem] rounded-bl-none text-white space-y-3">
                    <div className="flex items-center gap-2 border-b-2 border-gray-700 pb-2 text-sky-400">
                      <Globe className="w-4 h-4" />
                      <h4 className="font-black uppercase text-xs tracking-wider">Garages Operational Matrix</h4>
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold leading-normal uppercase">Active deployment nodes across Indonesian high-density sectors:</p>
                    <div className="space-y-1.5 text-[11px] font-black uppercase tracking-wide">
                      <div className="flex items-center gap-2 text-lime-400"><MapPin className="w-3.5 h-3.5 text-rose-500 animate-pulse"/> Greater Jakarta Metro (3 Hubs)</div>
                      <div className="flex items-center gap-2 text-gray-300"><MapPin className="w-3.5 h-3.5 text-rose-500"/> West Java sector (Pasteur Hub)</div>
                      <div className="flex items-center gap-2 text-gray-300"><MapPin className="w-3.5 h-3.5 text-rose-500"/> Bali Tourist Zone (Ngurah Rai Hub)</div>
                    </div>
                    <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden border border-black"><div className="bg-sky-400 h-full w-[85%]"></div></div>
                    <span className="text-[9px] font-black text-gray-500 block text-right">85% SERVICE EXPANSION RATE</span>
                  </div>
                )}
              </div>

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