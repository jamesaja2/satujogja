import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import gsap from 'gsap';
import { MapPin, Users as UsersIcon, Maximize2 } from 'lucide-react';
import geoDataRaw from '../../assets/yogyakarta.geojson?raw';

const geoData = JSON.parse(geoDataRaw);

const districtInfo = {
  'Mantrijeron': { pop: '33.2K', area: '2.61 km²', note: 'Kampung wisata heritage' },
  'Kraton': { pop: '18.6K', area: '1.40 km²', note: 'Pusat Kasultanan Yogyakarta' },
  'Mergangsan': { pop: '31.0K', area: '2.31 km²', note: 'Prawirotaman & cafe culture' },
  'Umbulharjo': { pop: '89.4K', area: '8.12 km²', note: 'Kawasan pendidikan terbesar' },
  'Kotagede': { pop: '35.1K', area: '3.07 km²', note: 'Sentra kerajinan perak' },
  'Gondokusuman': { pop: '46.7K', area: '3.99 km²', note: 'Pusat bisnis & perkantoran' },
  'Danurejan': { pop: '19.5K', area: '1.10 km²', note: 'Area perdagangan tradisional' },
  'Gondomanan': { pop: '13.5K', area: '1.12 km²', note: 'Malioboro & Beringharjo' },
  'Ngampilan': { pop: '16.3K', area: '0.82 km²', note: 'Sentra batik tradisional' },
  'Wirobrajan': { pop: '25.5K', area: '1.76 km²', note: 'Kampung industri kreatif' },
  'Gedongtengen': { pop: '18.5K', area: '0.96 km²', note: 'Stasiun Tugu & heritage' },
  'Jetis': { pop: '24.9K', area: '1.70 km²', note: 'Museum & pusat pendidikan' },
  'Tegalrejo': { pop: '38.6K', area: '2.91 km²', note: 'Kawasan permukiman & UGM' },
};

const palette = ['#C2956B','#5EEAD4','#FB7185','#A78BFA','#FBBF24','#38BDF8','#4ADE80','#F472B6','#818CF8','#34D399','#FB923C','#E879F9','#6EE7B7'];

export default function InteractiveMap() {
  const sectionRef = useRef();
  const mapRef = useRef();
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    gsap.fromTo(mapRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 60%' } }
    );
  }, []);

  const style = (feature, index) => ({
    color: palette[index % palette.length],
    weight: 1.5,
    fillColor: palette[index % palette.length],
    fillOpacity: 0.12,
  });

  const onEachFeature = (feature, layer) => {
    const name = feature.properties.name;
    layer.on({
      mouseover: (e) => { e.target.setStyle({ fillOpacity: 0.45, weight: 2.5 }); setSelected({ name, ...districtInfo[name] }); },
      mouseout: (e) => { e.target.setStyle({ fillOpacity: 0.12, weight: 1.5 }); },
      click: () => setSelected({ name, ...districtInfo[name] }),
    });
  };

  return (
    <section id="peta" ref={sectionRef} className="py-28 px-6 bg-surface">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <span className="text-accent text-xs tracking-[0.3em] uppercase font-medium">Eksplorasi Wilayah</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-text mt-2">Peta Kecamatan</h2>
          <p className="text-text-dim text-sm mt-2">Arahkan kursor ke setiap wilayah untuk melihat detail.</p>
        </div>

        <div className="grid md:grid-cols-[1fr_280px] gap-5">
          <div ref={mapRef} className="rounded-xl overflow-hidden border border-border h-[450px] md:h-[520px]">
            <MapContainer center={[-7.797, 110.365]} zoom={13} className="w-full h-full" scrollWheelZoom={false} zoomControl={false}>
              <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution="CARTO" />
              {geoData.features.map((f, i) => (
                <GeoJSON key={f.properties.name} data={f} style={() => style(f, i)} onEachFeature={onEachFeature} />
              ))}
            </MapContainer>
          </div>

          {/* Info Panel */}
          <div className="bg-card rounded-xl border border-border p-5 flex flex-col justify-center">
            {selected ? (
              <>
                <h3 className="text-text font-semibold text-lg font-display">{selected.name}</h3>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-3 py-2 border-b border-border">
                    <UsersIcon className="w-4 h-4 text-text-dim" />
                    <div className="flex-1 flex justify-between">
                      <span className="text-text-dim text-sm">Populasi</span>
                      <span className="text-text font-medium text-sm">{selected.pop || '-'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 py-2 border-b border-border">
                    <Maximize2 className="w-4 h-4 text-text-dim" />
                    <div className="flex-1 flex justify-between">
                      <span className="text-text-dim text-sm">Luas</span>
                      <span className="text-text font-medium text-sm">{selected.area || '-'}</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-accent" />
                      <span className="text-accent text-sm font-medium">{selected.note || '-'}</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center text-text-dim">
                <MapPin className="w-8 h-8 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Hover pada peta untuk melihat detail kecamatan</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
