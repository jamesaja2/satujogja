import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Utensils, X, MapPin } from 'lucide-react';

export default function Culinary() {
  const [selectedItem, setSelectedItem] = useState(null);
  const sectionRef = useRef();
  const cardsRef = useRef([]);

  const culinaries = [
    {
      title: 'Gudeg',
      sub: 'Warisan Rasa Jawa',
      desc: 'Nangka muda dimasak berjam-jam dengan santan dan gula merah Jawa. Disajikan dengan ayam kampung, telur pindang, dan sambal krecek.',
      img: 'https://asset.kompas.com/crops/QGErEgRilqQ3z4u7E5fZ5NKO1As=/23x0:868x563/1200x800/data/photo/2022/07/12/62ccebf61f9ce.jpeg',
      longDesc: 'Gudeg adalah identitas kuliner Yogyakarta yang tidak boleh dilewatkan oleh wisatawan. Terbuat dari nangka muda yang dimasak perlahan (slow-cooked) menggunakan kayu bakar, santan kental, dan gula merah Jawa selama belasan jam. Hasilnya? Sensasi rasa manis dan gurih legit yang lumer di mulut. Gudeg disajikan komplit dengan nasi hangat, ayam kampung super empuk, telur pindang, dan sambal goreng krecek (kulit sapi) yang sedikit pedas untuk menyeimbangkan rasa manisnya. Pengalaman makan gudeg di pawon (dapur tradisional) pada malam hari adalah hal yang wajib dicoba!',
      recommendations: 'Gudeg Yu Djum, Gudeg Pawon, Gudeg Permata'
    },
    {
      title: 'Bakpia Pathok',
      sub: 'Oleh-oleh Legendaris',
      desc: 'Kue bundar berisi kacang hijau, keju, atau cokelat yang dipanggang sempurna. Ikon oleh-oleh dari kampung Pathok.',
      img: 'https://imgcdn.espos.id/@espos/images/2023/03/bakpia-2.jpg?quality=60',
      longDesc: 'Sebelum meninggalkan Yogyakarta, Bakpia Pathok adalah buah tangan wajib bagi setiap turis. Kue lapis legit berbentuk bundar mungil ini dipanggang secara tradisional hingga kulit luarnya renyah, namun bagian dalamnya berisi pasta manis yang sangat lembut. Resep aslinya berisi kacang hijau (mung bean), tetapi kini Anda dapat memanjakan lidah dengan berbagai varian modern yang meledak di pasaran: keju lumer, cokelat pekat, hingga rasa green tea. Sangat cocok dinikmati bersama secangkir teh panas di sore hari.',
      recommendations: 'Bakpia Pathok 25, Bakpia Kurnia Sari, Bakpia Tugu Jogja'
    },
    {
      title: 'Kopi Joss',
      sub: 'Tradisi Angkringan',
      desc: 'Kopi tubruk hitam pekat yang diberi arang membara tepat ke dalam gelas. Sensasi rasa yang tak tertandingi.',
      img: 'https://asset.kompas.com/crops/bX-Ik0lxOeSQr7AsQynB7yjItgY=/0x196:1080x916/1200x800/data/photo/2023/01/17/63c6604a99ba3.jpeg',
      longDesc: 'Bagi pecinta kopi dan pencari pengalaman unik, Kopi Joss menawarkan atraksi yang tidak akan Anda temukan di tempat lain. Disajikan di angkringan (gerobak jalanan tradisional), kopi tubruk hitam pekat ini dihidangkan dengan cara ekstrem: sebongkah arang panas yang masih membara merah dicelupkan langsung ke dalam gelas kopi! Bunyi mendesis "joss" yang dihasilkan bukan hanya sekadar atraksi turis; arang tersebut dipercaya dapat mengikat racun dan memberikan aroma karamel gosong yang membuat rasa kopi semakin kaya dan rendah asam.',
      recommendations: 'Angkringan Kopi Joss Lik Man, Angkringan Pak Jabrik'
    },
    {
      title: 'Sate Klathak',
      sub: 'Kambing Pilihan',
      desc: 'Sate kambing muda ditusuk jeruji besi, dibakar dengan bumbu minimalis agar cita rasa daging murni terasa.',
      img: 'https://bdsgp.my.id/img/800/bsogmh5mbsog163d17_2/Ctn0JqeyuU7lCFHCtnpfEdFwarxKRhTuCk1ONeur0Q.jpg',
      longDesc: 'Lupakan tusuk sate dari bambu! Sate Klathak menggunakan inovasi unik khas Bantul, Yogyakarta: jeruji besi sepeda. Jeruji besi bertindak sebagai konduktor panas, memastikan potongan daging kambing muda (bawah lima bulan) matang sempurna hingga ke bagian paling dalam. Bumbunya sangat minimalis—hanya garam dan sedikit ketumbar—menonjolkan kualitas dan kesegaran rasa daging murni tanpa bau prengus. Disajikan bersama semangkuk kuah gulai kental hangat, sate ini menjanjikan surga dunia bagi para pecinta daging.',
      recommendations: 'Sate Klathak Pak Pong, Sate Klathak Mak Adi'
    },
  ];

  useEffect(() => {
    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      gsap.fromTo(card,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, delay: i * 0.1, ease: 'power2.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 55%' } }
      );
    });
  }, []);

  return (
    <section id="kuliner" ref={sectionRef} className="py-28 px-6 bg-base">
      <div className="max-w-5xl mx-auto">
        <div className="mb-14">
          <span className="text-accent text-xs tracking-[0.3em] uppercase font-medium">Cita Rasa Istimewa</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-text mt-2">Kuliner Legendaris</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {culinaries.map((item, i) => (
            <div
              key={i}
              ref={el => cardsRef.current[i] = el}
              onClick={() => setSelectedItem(item)}
              className="bg-card rounded-xl overflow-hidden border border-border group hover:border-accent/30 transition-colors flex flex-col sm:flex-row cursor-pointer"
            >
              <div className="sm:w-2/5 h-48 sm:h-auto shrink-0 relative overflow-hidden">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-3 left-3 w-8 h-8 rounded-lg bg-base/80 backdrop-blur-sm flex items-center justify-center">
                  <Utensils className="w-4 h-4 text-accent" />
                </div>
              </div>
              <div className="p-6 sm:w-3/5 flex flex-col justify-center">
                <h3 className="text-text font-semibold text-lg">{item.title}</h3>
                <span className="text-accent text-[10px] font-bold tracking-wider uppercase mt-1">{item.sub}</span>
                <div className="w-8 h-px bg-border my-3 group-hover:w-14 group-hover:bg-accent/50 transition-all duration-500" />
                <p className="text-text-dim text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Culinary Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedItem(null)}>
          <div className="bg-surface border border-border w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 p-1.5 bg-black/50 hover:bg-black/80 rounded-full transition-colors text-white z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="h-48 w-full relative">
              <img src={selectedItem.img} alt={selectedItem.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent"></div>
            </div>
            <div className="p-6 relative -mt-10">
              <span className="px-3 py-1 bg-accent text-white text-[10px] font-bold tracking-wider uppercase rounded-full shadow-lg">
                {selectedItem.sub}
              </span>
              <h3 className="text-text font-bold text-2xl mt-3 mb-2">{selectedItem.title}</h3>
              <p className="text-text-dim text-sm leading-relaxed mb-6">
                {selectedItem.longDesc}
              </p>

              <div className="space-y-3 mb-2 bg-base rounded-xl p-4 border border-border">
                <div className="flex gap-2 items-start text-sm">
                  <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <div>
                    <span className="text-text-muted block mb-1">Rekomendasi Tempat:</span>
                    <span className="text-text font-medium leading-tight">{selectedItem.recommendations}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
