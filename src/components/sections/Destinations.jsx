import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { MapPin, Trees, Landmark, Building2, ArrowRight, X, Sparkles } from 'lucide-react';
import { useStore } from '../../store/useStore';
import landscapeImg from '../../assets/background-landscape.png';

export default function Destinations() {
  const { setIsChatOpen, setInitialChatMsg } = useStore();
  const sectionRef = useRef();
  const cardsRef = useRef([]);
  const [filter, setFilter] = useState('Semua');
  const [selectedDest, setSelectedDest] = useState(null);

  const categories = [
    { key: 'Semua', icon: MapPin },
    { key: 'Alam', icon: Trees },
    { key: 'Sejarah', icon: Landmark },
    { key: 'Modern', icon: Building2 },
  ];

  const destinations = [
    {
      name: 'Candi Prambanan',
      cat: 'Sejarah',
      desc: 'Kompleks candi Hindu terbesar di Indonesia, warisan dunia UNESCO.',
      longDesc: 'Candi Prambanan adalah mahakarya arsitektur Hindu abad ke-9 dan situs Warisan Dunia UNESCO yang wajib dikunjungi. Menjulang anggun setinggi 47 meter, kompleks candi ini tidak hanya menawarkan pemandangan sunset yang sangat memukau, namun juga ukiran relief epik Ramayana yang sangat detail. Bagi wisatawan, kami sangat merekomendasikan untuk menyewa pemandu lokal agar dapat mendengar langsung legenda Roro Jonggrang, atau menonton pertunjukan Sendratari Ramayana spektakuler di malam hari dengan latar belakang candi yang menyala terang.',
      img: 'https://injourneydestination.id/wp-content/uploads/2025/12/Prambanan-Mobile-min.jpg',
      price: 'Rp 50.000',
      location: 'Jl. Raya Solo - Yogyakarta No.16'
    },
    {
      name: 'Pantai Parangtritis',
      cat: 'Alam',
      desc: 'Pantai ikonik dengan legenda Ratu Kidul dan sunset memukau.',
      longDesc: 'Parangtritis bukan sekadar pantai; ini adalah pusat spiritual dan rekreasi alam paling ikonik di Yogyakarta. Wisatawan dapat menyewa ATV atau naik bendi (kereta kuda) melintasi hamparan pasir vulkanik hitam yang eksotis, dengan latar belakang deburan ombak Samudra Hindia yang kuat. Jelang sore, Parangtritis menyuguhkan salah satu pemandangan matahari terbenam (sunset) terbaik di pesisir selatan Jawa. Ingatlah untuk mematuhi larangan berenang demi keselamatan Anda, mengingat kuatnya mitos Kanjeng Ratu Kidul dan arus lautnya.',
      img: 'https://rentalmobilbintaro.com/wp-content/uploads/2024/12/keindahan-pantai-parangtritis-yang-menawan.jpg',
      price: 'Rp 10.000',
      location: 'Kec. Kretek, Kab. Bantul'
    },
    {
      name: 'Malioboro',
      cat: 'Modern',
      desc: 'Jantung kota Jogja — pusat belanja, kuliner, dan kehidupan.',
      longDesc: 'Tidak ada yang lebih merepresentasikan denyut nadi Yogyakarta selain Jalan Malioboro. Bagi turis, ini adalah surga belanja tanpa batas—mulai dari batik, kerajinan perak, hingga kaus suvenir bisa ditawar dengan harga miring. Di malam hari, trotoar Malioboro bertransformasi menjadi panggung budaya yang hidup: musisi jalanan yang memukau, seniman angklung, dan jajaran kuliner lesehan. Nikmati suasana magis ini dengan berjalan kaki santai atau menyewa andong tradisional menyusuri jalanan yang romantis ini.',
      img: 'https://terasmalioboro.jogjaprov.go.id/wp-content/uploads/2022/08/5ee208425be9b.jpg',
      price: 'Gratis',
      location: 'Pusat Kota Yogyakarta'
    },
    {
      name: 'Hutan Pinus Mangunan',
      cat: 'Alam',
      desc: 'Pemandangan perbukitan hijau dan spot foto populer.',
      longDesc: 'Bagi wisatawan yang mencari ketenangan dan spot foto estetik di luar hiruk pikuk kota, Hutan Pinus Mangunan adalah permata yang tersembunyi. Deretan pohon pinus merkusii yang menjulang tinggi menciptakan atmosfer magis ala film-film fantasi, terutama di pagi hari saat kabut masih mengambang. Terdapat berbagai dek observasi dan panggung alam dari kayu yang dirancang khusus untuk berswafoto. Udaranya yang sejuk menjadikan tempat ini destinasi pelarian sempurna untuk bersantai.',
      img: 'https://visitingjogja.jogjaprov.go.id/wp-content/uploads/2020/03/288.jpg',
      price: 'Rp 7.500',
      location: 'Dlingo, Kab. Bantul'
    },
    {
      name: 'Keraton Yogyakarta',
      cat: 'Sejarah',
      desc: 'Istana Kasultanan yang masih dihuni hingga saat ini.',
      longDesc: 'Keraton Ngayogyakarta Hadiningrat adalah jantung sejarah dan budaya hidup masyarakat Jawa, sekaligus tempat tinggal Sultan yang masih memerintah hingga kini. Sebagai turis, Anda akan disuguhkan arsitektur keraton agung, paviliun-paviliun berlapis emas, serta koleksi pusaka kuno. Jika Anda datang di pagi hari, Anda berkesempatan menyaksikan abdi dalem berpakaian tradisional yang sedang beraktivitas, atau menikmati latihan pertunjukan tari gamelan dan wayang yang diselenggarakan secara rutin.',
      img: 'https://travelspromo.com/wp-content/uploads/2019/05/salah-satu-ruang-di-keraton-yogyakarta-Mujiman-Muji.jpg',
      price: 'Rp 15.000',
      location: 'Jl. Rotowijayan Blok No. 1'
    },
    {
      name: 'Taman Sari',
      cat: 'Sejarah',
      desc: 'Bekas taman kerajaan dengan kolam pemandian eksotis.',
      longDesc: 'Taman Sari, yang juga dikenal sebagai "Water Castle", dulunya adalah taman pemandian rahasia dan benteng pertahanan keluarga kerajaan. Turis sangat menyukai tempat ini karena arsitekturnya yang luar biasa fotogenik—memadukan gaya Jawa dan Portugis. Anda dapat menyusuri lorong bawah tanah yang misterius (Sumur Gumuling), melihat kolam-kolam biru kehijauan, dan menjelajahi reruntuhan benteng yang sangat estetik. Siapkan kamera Anda, karena setiap sudut Taman Sari adalah mahakarya seni yang memesona.',
      img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Indonesia_-_Java_-_Yogyakarta_-_Taman_Sari.jpg/960px-Indonesia_-_Java_-_Yogyakarta_-_Taman_Sari.jpg',
      price: 'Rp 15.000',
      location: 'Patehan, Kraton, Kota Yogyakarta'
    },
  ];

  const filtered = filter === 'Semua' ? destinations : destinations.filter(d => d.cat === filter);

  useEffect(() => {
    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      gsap.fromTo(card,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, delay: i * 0.08, ease: 'power2.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 55%' } }
      );
    });
  }, [filter]);

  return (
    <section id="wisata" ref={sectionRef} className="py-28 px-6 bg-surface relative">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <span className="text-accent text-xs tracking-[0.3em] uppercase font-medium">Pesona Tanpa Batas</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-text mt-2">Destinasi Wisata</h2>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-10 flex-wrap">
          {categories.map(({ key, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${filter === key
                ? 'bg-accent text-base'
                : 'bg-card text-text-muted border border-border hover:text-text'
                }`}
            >
              <Icon className="w-4 h-4" />
              {key}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((dest, i) => (
            <div
              key={dest.name}
              ref={el => cardsRef.current[i] = el}
              onClick={() => setSelectedDest(dest)}
              className="bg-card rounded-xl overflow-hidden border border-border hover:border-accent/30 transition-colors group cursor-pointer flex flex-col"
            >
              <div className="aspect-[4/3] w-full overflow-hidden relative">
                <img src={dest.img} alt={dest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-3 right-3 bg-base/80 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <Landmark className="w-3.5 h-3.5 text-accent" />
                  <span className="text-accent text-[10px] font-bold tracking-wider uppercase">{dest.cat}</span>
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-text font-semibold text-lg">{dest.name}</h3>
                <p className="text-text-dim text-sm mt-2 leading-relaxed flex-1">{dest.desc}</p>
                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-accent text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Lihat Detail</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedDest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedDest(null)}>
          <div className="bg-surface border border-border w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setSelectedDest(null)}
              className="absolute top-4 right-4 p-1.5 bg-black/50 hover:bg-black/80 rounded-full transition-colors text-white z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="h-48 w-full relative">
              <img src={selectedDest.img} alt={selectedDest.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent"></div>
            </div>
            <div className="p-6 relative -mt-10">
              <span className="px-3 py-1 bg-accent text-white text-[10px] font-bold tracking-wider uppercase rounded-full shadow-lg">
                {selectedDest.cat}
              </span>
              <h3 className="text-text font-bold text-2xl mt-3 mb-2">{selectedDest.name}</h3>
              <p className="text-text-dim text-sm leading-relaxed mb-6">
                {selectedDest.longDesc}
              </p>

              <div className="space-y-3 mb-6 bg-base rounded-xl p-4 border border-border">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-text-muted">Harga Tiket:</span>
                  <span className="text-accent font-bold">{selectedDest.price}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-text-muted">Lokasi:</span>
                  <span className="text-text font-medium text-right max-w-[200px]">{selectedDest.location}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedDest(null);
                  setInitialChatMsg(`Tolong buatkan itinerary singkat untuk mengunjungi ${selectedDest.name}, lengkap dengan saran transportasi dan estimasi biayanya.`);
                  setIsChatOpen(true);
                }}
                className="w-full bg-gradient-to-r from-accent to-[#e6a57a] text-white py-3 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(212,149,106,0.3)]"
              >
                <Sparkles className="w-4 h-4" />
                Rencanakan Trip dengan AI
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
