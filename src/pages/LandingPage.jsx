import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Menu } from 'lucide-react';
import Hero from '../components/sections/Hero';
import History from '../components/sections/History';
import Culture from '../components/sections/Culture';
import Culinary from '../components/sections/Culinary';
import Destinations from '../components/sections/Destinations';
import TechSection from '../components/sections/TechSection';
import InteractiveMap from '../components/sections/InteractiveMap';
import Gamification from '../components/sections/Gamification';
import Footer from '../components/sections/Footer';
import GoogleTranslate from '../components/GoogleTranslate';

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  const navRef = useRef();

  useEffect(() => {
    ScrollTrigger.create({
      start: 'top -80',
      end: 99999,
      onEnter: () => navRef.current?.classList.add('nav-solid'),
      onLeaveBack: () => navRef.current?.classList.remove('nav-solid'),
    });
  }, []);

  return (
    <div className="bg-base">
      <nav ref={navRef} className="fixed top-0 left-0 w-full z-50 px-6 py-5 transition-all duration-300">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <span className="text-xl font-bold tracking-[0.2em] text-text" style={{ fontFamily: 'var(--font-logo)' }}>SATUJOGJA</span>
          <div className="hidden md:flex items-center gap-7">
            {['Sejarah', 'Budaya', 'Kuliner', 'Wisata', 'Peta'].map(s => (
              <a key={s} href={`#${s.toLowerCase()}`} className="text-xs text-text-muted hover:text-accent transition-colors tracking-wide">{s}</a>
            ))}
            
            <div className="flex items-center gap-4 ml-2 border-l border-border pl-6">
              <GoogleTranslate />
              
              <Link to="/dashboard" className="px-4 py-2 bg-accent text-white text-xs font-bold rounded-lg hover:bg-accent-hover transition-colors shadow-lg shadow-accent/20">
                Portal Warga
              </Link>
            </div>
          </div>
          <button className="md:hidden text-text-muted"><Menu className="w-5 h-5" /></button>
        </div>
      </nav>

      <style>{`
        .nav-solid {
          background: rgba(12,10,9,0.95) !important;
          backdrop-filter: blur(8px);
          padding-top: 0.75rem !important;
          padding-bottom: 0.75rem !important;
          border-bottom: 1px solid rgba(68,64,60,0.4);
        }
      `}</style>

      <Hero />
      <History />
      <Culture />
      <Culinary />
      <Destinations />
      <TechSection />
      <InteractiveMap />
      <Gamification />
      <Footer />
    </div>
  );
}
