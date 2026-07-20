import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Play, ArrowRight, ChevronDown, X } from 'lucide-react';
import tuguVideo from '../../assets/tugu-timelapse.webm';
import wayangLeft from '../../assets/wayang.png';
import wayangRight from '../../assets/wayang-2.png';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const curtainRef = useRef();
  const leftWayangRef = useRef();
  const rightWayangRef = useRef();
  const textRef = useRef();
  const descRef = useRef();

  useEffect(() => {
    // Wayang curtain opening on scroll
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: curtainRef.current,
        start: 'top top',
        end: '+=600',
        scrub: 0.8,
        pin: true,
      },
    });

    tl.to(leftWayangRef.current, { x: '-110%', ease: 'none' }, 0)
      .to(rightWayangRef.current, { x: '110%', ease: 'none' }, 0)
      .fromTo(textRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, ease: 'power2.out' }, 0.3);

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  return (
    <>
      {/* Wayang Curtain Intro */}
      <section ref={curtainRef} className="relative w-full h-screen overflow-hidden bg-base">
        {/* Video behind curtain */}
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover opacity-40">
          <source src={tuguVideo} type="video/webm" />
        </video>
        <div className="absolute inset-0 bg-base/40" />

        {/* Left Wayang */}
        <div ref={leftWayangRef} className="absolute left-0 top-0 w-1/2 h-full flex justify-end z-10 pointer-events-none">
          <img
            src={wayangLeft}
            alt=""
            className="h-full object-contain select-none"
            style={{ filter: 'brightness(0.7) sepia(0.15)', transform: 'scaleX(-1)' }}
          />
        </div>

        {/* Right Wayang */}
        <div ref={rightWayangRef} className="absolute right-0 top-0 w-1/2 h-full flex justify-start z-10 pointer-events-none">
          <img
            src={wayangRight}
            alt=""
            className="h-full object-contain select-none"
            style={{ filter: 'brightness(0.7) sepia(0.15)' }}
          />
        </div>

        {/* Content behind curtain */}
        <div ref={textRef} className="absolute inset-0 flex flex-col items-center justify-center z-[5] opacity-0 px-6">
          <span className="px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-white/80 text-xs tracking-widest font-medium uppercase mb-8">
            Jelajahi jantung warisan Indonesia.
          </span>
          <h1 className="font-display text-5xl sm:text-6xl md:text-8xl font-bold text-text text-center leading-tight">
            The Soul of <em className="text-accent">Java</em>
          </h1>
          <p 
            ref={descRef}
            className="text-lg md:text-xl text-text-dim mb-12 max-w-2xl font-light leading-relaxed text-center"
          >
            Sejarah. Budaya. Kuliner. Wisata. Semuanya ada di kota istimewa ini.
          </p>
          <div className="mt-8 flex gap-3">
            <a href="#sejarah" className="bg-accent text-white px-8 py-4 rounded-xl font-bold tracking-wide flex items-center gap-3 hover:bg-accent-hover hover:scale-105 transition-all shadow-[0_0_30px_rgba(212,149,106,0.3)]">
              Jelajah Sekarang <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1">
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/50">Gulir ke bawah</span>
          <ChevronDown className="w-5 h-5 text-accent animate-bounce mt-2" />
        </div>

        {/* Video Modal */}
        {isVideoOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <button 
              onClick={() => setIsVideoOpen(false)}
              className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/5F_C1a_0tUo?autoplay=1" 
                title="Pesona Yogyakarta" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
