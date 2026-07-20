import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Eye, Lock, Unlock, Sparkles } from 'lucide-react';
import wayangImg from '../../assets/wayang.png';
import gamelanImg from '../../assets/gamelan.png';
import wayang2Img from '../../assets/wayang-2.png';

export default function Culture() {
  const cardsRef = useRef([]);
  const [explored, setExplored] = useState({});
  const [activeCard, setActiveCard] = useState(null);

  const items = [
    {
      id: 'wayang',
      img: wayangImg,
      title: 'Wayang Kulit',
      desc: 'Seni pertunjukan tradisional yang menceritakan epik Ramayana dan Mahabharata melalui bayangan boneka kulit.',
      details: [
        'Dalang mengisahkan lakon di balik layar kelir, menghidupkan karakter dengan suara dan gerak',
        'UNESCO menetapkan Wayang Kulit sebagai Masterpiece of Oral and Intangible Heritage of Humanity',
      ],
      badge: 'Lakon Terungkap',
    },
    {
      id: 'gamelan',
      img: gamelanImg,
      title: 'Gamelan',
      desc: 'Orkestra musik Jawa peninggalan Kerajaan Mataram Islam dengan harmoni slendro dan pelog.',
      details: [
        'Instrumen perunggu seperti saron, bonang, dan kenong menciptakan resonansi khas Nusantara',
        'Sering dimainkan pada upacara adat seperti Sekaten di Alun-Alun Utara',
      ],
      badge: 'Harmoni Nusantara',
    },
    {
      id: 'batik',
      img: wayang2Img,
      title: 'Batik Jogja',
      desc: 'Mahakarya visual dengan corak khas seperti Parang Barong yang dulunya eksklusif untuk raja.',
      details: [
        'Setiap motif memiliki filosofi dan strata sosial yang ketat dalam lingkungan Keraton',
        'Diakui secara resmi oleh UNESCO sebagai Representatif Warisan Budaya Takbenda Manusia',
      ],
      badge: 'Warisan Leluhur',
    },
  ];

  const toggleExplore = (id) => {
    setExplored(prev => ({ ...prev, [id]: true }));
    setActiveCard(activeCard === id ? null : id);
  };

  const exploredCount = Object.keys(explored).length;

  useEffect(() => {
    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      gsap.fromTo(card,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: i * 0.12, ease: 'power2.out', scrollTrigger: { trigger: card, start: 'top 85%' } }
      );
    });
  }, []);

  return (
    <section id="budaya" className="py-28 px-6 bg-surface">
      <div className="max-w-5xl mx-auto">
        <div className="mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <span className="text-accent text-xs tracking-[0.3em] uppercase font-medium">Warisan Tak Ternilai</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-text mt-2">Budaya & Tradisi</h2>
          </div>
          <div className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-2.5">
            <Sparkles className="w-5 h-5 text-accent" />
            <div>
              <div className="text-text font-bold text-sm">Warisan</div>
              <div className="text-text-dim text-[10px]">Leluhur Mataram</div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <div
              key={item.id}
              ref={el => cardsRef.current[i] = el}
              className={`group rounded-xl overflow-hidden border transition-all cursor-pointer ${
                activeCard === item.id ? 'border-accent/40' : 'border-border hover:border-accent/20'
              }`}
              onClick={() => toggleExplore(item.id)}
            >
              <div className="aspect-[4/5] overflow-hidden bg-card relative">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                {/* Explore overlay */}
                <div className="absolute inset-0 bg-base/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-card/80 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-2 border border-border">
                    <Eye className="w-4 h-4 text-accent" />
                    <span className="text-text text-xs font-medium">{explored[item.id] ? 'Lihat Detail' : 'Jelajahi'}</span>
                  </div>
                </div>
                {/* Badge */}
                {explored[item.id] && (
                  <div className="absolute top-3 right-3 bg-accent/90 text-base rounded-full px-2.5 py-1 text-[9px] font-bold flex items-center gap-1">
                    <Unlock className="w-3 h-3" /> {item.badge}
                  </div>
                )}
              </div>

              <div className="p-5 bg-card">
                <h3 className="text-text font-semibold flex items-center gap-2">
                  {item.title}
                  {!explored[item.id] && <Lock className="w-3.5 h-3.5 text-text-dim" />}
                </h3>
                <p className="text-text-dim text-sm mt-2 leading-relaxed">{item.desc}</p>

                {/* Expanded details */}
                {activeCard === item.id && explored[item.id] && (
                  <div className="mt-4 pt-4 border-t border-border space-y-2.5">
                    <p className="text-indigo text-[10px] font-semibold uppercase tracking-wider">Fakta Menarik</p>
                    {item.details.map((d, di) => (
                      <div key={di} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                        <p className="text-text-muted text-xs leading-relaxed">{d}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Completion message */}
        {exploredCount === items.length && (
          <div className="mt-8 bg-accent/10 border border-accent/20 rounded-xl p-5 text-center">
            <Sparkles className="w-6 h-6 text-accent mx-auto mb-2" />
            <p className="text-text font-semibold text-sm">Pengetahuan Budaya Terkumpul</p>
            <p className="text-text-dim text-xs mt-1">Anda telah memahami pilar-pilar utama warisan budaya Kasultanan Yogyakarta.</p>
          </div>
        )}
      </div>
    </section>
  );
}
