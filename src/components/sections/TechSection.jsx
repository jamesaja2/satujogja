import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Globe, Palette, Building, Rocket, BarChart3, Cpu, Users } from 'lucide-react';

export default function TechSection() {
  const sectionRef = useRef();
  const statsRef = useRef([]);
  const cardsRef = useRef([]);

  const stats = [
    { value: '4.5M+', label: 'Wisatawan / Tahun', icon: Users },
    { value: '300+', label: 'Startup Aktif', icon: Rocket },
    { value: '120+', label: 'Coworking Space', icon: Cpu },
    { value: 'Top 3', label: 'Kota Kreatif ASEAN', icon: BarChart3 },
  ];

  const features = [
    { title: 'Smart City Initiative', desc: 'Integrasi IoT untuk monitoring lalu lintas, kualitas udara, dan manajemen limbah secara real-time.', icon: Globe },
    { title: 'Digital Creative Hub', desc: 'Ekosistem startup dan industri kreatif yang terus berkembang pesat.', icon: Palette },
    { title: 'E-Government', desc: 'Layanan publik digital yang memudahkan warga mengakses informasi dan perizinan online.', icon: Building },
  ];

  useEffect(() => {
    [...statsRef.current, ...cardsRef.current].forEach((el, i) => {
      if (!el) return;
      gsap.fromTo(el,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, delay: i * 0.08, ease: 'power2.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 55%' } }
      );
    });
  }, []);

  return (
    <section ref={sectionRef} className="py-28 px-6 bg-base">
      <div className="max-w-5xl mx-auto">
        <div className="mb-14">
          <span className="text-teal text-xs tracking-[0.3em] uppercase font-medium">Menuju Masa Depan</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-text mt-2">Teknologi & Inovasi</h2>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} ref={el => statsRef.current[i] = el} className="bg-card rounded-xl p-5 border border-border text-center">
                <Icon className="w-5 h-5 text-teal mx-auto mb-3" />
                <div className="text-2xl font-bold text-text">{s.value}</div>
                <div className="text-text-dim text-xs mt-1">{s.label}</div>
              </div>
            );
          })}
        </div>

        {/* Feature cards */}
        <div className="grid md:grid-cols-3 gap-5">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} ref={el => cardsRef.current[i] = el} className="bg-card rounded-xl p-6 border border-border group hover:border-teal/30 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-teal/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-teal" />
                </div>
                <h3 className="text-text font-semibold">{f.title}</h3>
                <p className="text-text-dim text-sm mt-2 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
