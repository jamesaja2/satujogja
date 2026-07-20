import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-16 px-6 border-t border-border bg-base">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-3 gap-10 mb-12">
          <div>
            <span className="text-2xl font-bold tracking-[0.2em] text-text" style={{ fontFamily: 'var(--font-logo)' }}>SATUJOGJA</span>
            <p className="text-text-dim text-sm mt-3 leading-relaxed">
              Portal digital untuk mengenal dan mencintai Yogyakarta. Inisiatif untuk warga dan wisatawan.
            </p>
          </div>
          <div>
            <h4 className="text-text font-semibold text-sm mb-3">Navigasi</h4>
            <div className="space-y-2">
              {['Sejarah', 'Budaya', 'Kuliner', 'Wisata', 'Peta'].map(s => (
                <a key={s} href={`#${s.toLowerCase()}`} className="block text-text-dim text-sm hover:text-accent transition-colors">{s}</a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-text font-semibold text-sm mb-3">Layanan</h4>
            <p className="text-text-dim text-sm mb-3 leading-relaxed">
              Akses layanan publik digital melalui portal warga kami.
            </p>
            <Link to="/dashboard" className="inline-flex items-center gap-1 text-accent text-sm font-medium hover:gap-2 transition-all">
              Portal Warga <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-text-dim text-xs">© {new Date().getFullYear()} SatuJogja. Dibuat untuk Yogyakarta.</p>
        </div>
      </div>
    </footer>
  );
}
