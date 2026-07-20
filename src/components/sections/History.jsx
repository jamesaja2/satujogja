import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, ContactShadows, Center } from '@react-three/drei';
import { MapPin, Info, Compass, ExternalLink } from 'lucide-react';
import gsap from 'gsap';

// Helper component to load and render GLB models
const Model = ({ url, scale = 1, yOffset = 0 }) => {
  const { scene } = useGLTF(url);
  return (
    <Center>
      <primitive object={scene} scale={scale} position={[0, yOffset, 0]} />
    </Center>
  );
};

// Loading Screen for 3D Models
const ModelLoader = () => {
  return (
    <mesh>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="#D4956A" wireframe />
    </mesh>
  );
};

export default function History() {
  const SITES = [

    {
      id: 'prambanan',
      name: 'Candi Prambanan',
      desc: 'Mahakarya arsitektur Hindu kuno peninggalan Mataram. Candi utamanya menjulang setinggi 47 meter yang didedikasikan untuk Dewa Siwa.',
      modelUrl: '/models/candi_prambanan_compressed.glb',
      scale: 0.05,
      yOffset: -2,
      year: 'Abad ke-9'
    },
    {
      id: 'malioboro',
      name: 'Teras Malioboro',
      desc: 'Jantung ekonomi dan budaya kota. Bagian penting dari Sumbu Filosofis Jogja yang menghubungkan Tugu, Keraton, dan Panggung Krapyak.',
      modelUrl: '/models/teras_malioboro.glb',
      scale: 0.15,
      yOffset: -1,
      year: '1755'
    },
    {
      id: 'tugu',
      name: 'Tugu Golong Gilig',
      desc: 'Lebih dikenal dengan Tugu Jogja. Awalnya berbentuk silinder (golong) dengan puncak bulat (gilig) sebagai simbol persatuan rakyat (Manunggaling Kawula Gusti).',
      modelUrl: '/models/tugu_jogja.glb',
      scale: 0.8,
      yOffset: -1,
      year: '1755'
    }
  ];

  const [activeSite, setActiveSite] = useState(SITES[0]);
  const [isRotating, setIsRotating] = useState(true);

  return (
    <section id="sejarah" className="py-28 px-6 bg-base">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <span className="text-accent text-xs tracking-[0.3em] uppercase font-medium">Jelajah 3D</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-text mt-2">Diorama Sejarah</h2>
          <p className="text-text-muted mt-4 max-w-2xl">Eksplorasi bangunan ikonik bersejarah Daerah Istimewa Yogyakarta secara interaktif dalam bentuk 3D. Putar dan perbesar untuk melihat detail.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Navigation Menu */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-6 flex items-center gap-2">
              <Compass className="w-4 h-4" /> Pilih Situs
            </h3>
            <div className="flex flex-col gap-3">
              {SITES.map(site => (
                <button 
                  key={site.id}
                  onClick={() => setActiveSite(site)}
                  className={`p-4 rounded-2xl border text-left transition-all duration-300 flex items-center gap-4 ${activeSite.id === site.id ? 'bg-accent/10 border-accent/30 shadow-[0_0_20px_rgba(212,149,106,0.1)]' : 'bg-surface border-border hover:border-accent/30 hover:bg-surface/80'}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${activeSite.id === site.id ? 'bg-accent text-white' : 'bg-base text-text-dim border border-border'}`}>
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className={`font-bold ${activeSite.id === site.id ? 'text-accent' : 'text-text'}`}>{site.name}</h4>
                    <p className="text-[10px] text-text-dim mt-0.5 tracking-wider uppercase">Didirikan: {site.year}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-8 bg-surface border border-border rounded-2xl p-5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3 group-hover:bg-accent/10 transition-colors"></div>
              <h4 className="font-bold text-text mb-2 flex items-center gap-2">
                <Info className="w-4 h-4 text-accent" /> Detail Singkat
              </h4>
              <p className="text-sm text-text-dim leading-relaxed">
                {activeSite.desc}
              </p>
            </div>
          </div>

          {/* 3D Viewport */}
          <div className="lg:col-span-2 h-[500px] lg:h-[650px] rounded-3xl overflow-hidden border border-border bg-surface relative group shadow-2xl">
            {/* Overlay Info */}
            <div className="absolute top-6 left-6 z-10 flex flex-col gap-2 pointer-events-none">
              <div className="bg-base/80 backdrop-blur-md px-4 py-2 rounded-xl border border-border">
                <h3 className="font-display font-bold text-text text-lg">{activeSite.name}</h3>
              </div>
              <div className="bg-base/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-border w-max">
                <p className="text-[10px] text-text-muted font-medium flex items-center gap-1.5">
                  <Compass className="w-3 h-3" /> Geser & Putar Kamera Bebas
                </p>
              </div>
            </div>

            {/* Toggle Rotation Button */}
            <button 
              onClick={() => setIsRotating(!isRotating)}
              className="absolute bottom-6 right-6 z-10 bg-base/80 backdrop-blur-md hover:bg-base px-4 py-2 rounded-xl border border-border text-xs font-bold text-text transition-colors shadow-lg flex items-center gap-2"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              {isRotating ? 'Hentikan Putaran' : 'Putar Otomatis'}
            </button>

            {/* Canvas */}
            <Canvas shadows camera={{ position: [0, 5, 10], fov: 45 }}>
              <ambientLight intensity={1.5} />
              <directionalLight position={[10, 20, 10]} intensity={2} castShadow shadow-mapSize={1024} />
              <directionalLight position={[-10, 10, -10]} intensity={1} color="#D4956A" />
              
              <Suspense fallback={<ModelLoader />}>
                <Model url={activeSite.modelUrl} scale={activeSite.scale} yOffset={activeSite.yOffset} />
              </Suspense>

              <ContactShadows position={[0, -2.5, 0]} opacity={0.7} scale={30} blur={2.5} far={10} color="#000000" />
              <Environment preset="city" />
              <OrbitControls 
                makeDefault 
                autoRotate={isRotating} 
                autoRotateSpeed={1}
                minDistance={0.5} 
                maxDistance={35}
                maxPolarAngle={Math.PI / 2 - 0.1}
                enableDamping
              />
            </Canvas>
          </div>

        </div>
      </div>
    </section>
  );
}
