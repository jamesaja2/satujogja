import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import GoogleTranslate from '../components/GoogleTranslate';
import { useStore } from '../store/useStore';
import { addReportToQueue, getQueuedReports, removeReportFromQueue } from '../utils/indexedDB';
import {
  Home, FileText, Info, User, ArrowLeft, Wifi, WifiOff,
  AlertTriangle, CheckCircle, Send, Construction, Lightbulb,
  Trash2, Droplets, Heart, Phone, Flame, Shield,
  Zap, LifeBuoy, Newspaper, ChevronRight, Clock, MapPin,
  CloudSun, Bell, Globe, Smartphone, HelpCircle,
  History, LogOut, LogIn, Wrench, Tag, Video, PlayCircle
} from 'lucide-react';
import Hls from 'hls.js';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Fix leaflet icon issue in react
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

/* ─── Main Dashboard ─── */
export default function Dashboard() {
  const { isOffline, activeTab, setActiveTab, user, setUser } = useStore();
  const [queueCount, setQueueCount] = useState(0);

  const checkQueue = async () => {
    const q = await getQueuedReports();
    setQueueCount(q.length);
  };

  // Restore session from localStorage
  useEffect(() => {
    checkQueue();
    const saved = localStorage.getItem('satujogja_user');
    if (saved) {
      try { setUser(JSON.parse(saved)); } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    if (!isOffline && user) syncQueue();
  }, [isOffline]);

  const syncQueue = async () => {
    const queue = await getQueuedReports();
    for (const report of queue) {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/report.php`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(report),
        });
        if (res.ok) await removeReportFromQueue(report.id);
      } catch { /* stays queued */ }
    }
    checkQueue();
  };

  const handleLoginSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    const userData = {
      name: decoded.name,
      email: decoded.email,
      picture: decoded.picture,
    };
    setUser(userData);
    localStorage.setItem('satujogja_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('satujogja_user');
    setActiveTab('home');
  };

  const tabs = [
    { id: 'home', label: 'Beranda', Icon: Home },
    { id: 'lapor', label: 'Lapor', Icon: FileText },
    { id: 'info', label: 'Info', Icon: Info },
    { id: 'cctv', label: 'CCTV', Icon: Video },
    { id: 'profil', label: 'Profil', Icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#F7F5F2] text-[#1A1A1A] max-w-md mx-auto relative" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Status Bar */}
      <div className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-[#E7E5E4] px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xs text-[#9C9589] hover:text-[#78716C] flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Beranda
        </Link>
        <div className="flex items-center gap-2">
          {isOffline ? (
            <span className="flex items-center gap-1 text-[10px] text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full font-medium">
              <WifiOff className="w-3 h-3" /> Offline
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
              <Wifi className="w-3 h-3" /> Online
            </span>
          )}
          {queueCount > 0 && (
            <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-medium">
              {queueCount} antrean
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="pb-20">
        {activeTab === 'home' && <HomeTab user={user} onLoginSuccess={handleLoginSuccess} />}
        {activeTab === 'lapor' && (user ? <ReportTab isOffline={isOffline} onSubmit={checkQueue} user={user} /> : <LoginGate onLoginSuccess={handleLoginSuccess} />)}
        {activeTab === 'info' && <InfoTab />}
        {activeTab === 'cctv' && <CCTVTab />}
        {activeTab === 'profil' && (user ? <ProfileTab user={user} onLogout={handleLogout} /> : <LoginGate onLoginSuccess={handleLoginSuccess} />)}
        {activeTab === 'mock-service' && <MockServiceTab />}
      </div>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/90 backdrop-blur-xl border-t border-[#E7E5E4] z-50">
        <div className="flex justify-around py-1.5">
          {tabs.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-colors ${
                activeTab === id ? 'text-[#D4956A]' : 'text-[#9C9589]'
              }`}
            >
              <Icon className="w-5 h-5" strokeWidth={activeTab === id ? 2.5 : 1.5} />
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

/* ─── Login Gate ─── */
function LoginGate({ onLoginSuccess }) {
  return (
    <div className="px-5 pt-20 text-center">
      <div className="w-16 h-16 bg-[#F5F0EB] rounded-2xl flex items-center justify-center mx-auto mb-5">
        <LogIn className="w-7 h-7 text-[#D4956A]" />
      </div>
      <h2 className="text-lg font-bold text-[#1A1A1A]">Masuk Diperlukan</h2>
      <p className="text-sm text-[#9C9589] mt-2 max-w-xs mx-auto leading-relaxed">
        Untuk mengakses fitur ini, silakan masuk dengan akun Google Anda.
      </p>
      <div className="mt-6 flex justify-center">
        <GoogleLogin
          onSuccess={onLoginSuccess}
          onError={() => console.log('Login gagal')}
          shape="rectangular"
          text="signin_with"
          locale="id"
        />
      </div>
    </div>
  );
}

/* ─── HOME TAB ─── */
function HomeTab({ user, onLoginSuccess }) {
  const { setActiveTab, weather, setWeather } = useStore();
  const [stats, setStats] = useState({ total: 0, completed: 0, in_progress: 0 });
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsRes, newsRes, weatherRes] = await Promise.allSettled([
          fetch(`${API_BASE}/stats.php`).then(r => r.json()),
          fetch(`${API_BASE}/news.php`).then(r => r.json()),
          fetch('https://api.open-meteo.com/v1/forecast?latitude=-7.7956&longitude=110.3695&current_weather=true').then(r => r.json()),
        ]);
        if (statsRes.status === 'fulfilled' && statsRes.value.status === 'success') {
          setStats(statsRes.value.data);
        }
        if (newsRes.status === 'fulfilled' && newsRes.value.status === 'success') {
          setNews(newsRes.value.data);
        }
        if (weatherRes.status === 'fulfilled' && weatherRes.value.current_weather) {
          setWeather(weatherRes.value.current_weather);
        }
      } catch {
        // Silent catch
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const quickActions = [
    { Icon: Construction, label: 'Jalan Rusak', bg: 'bg-amber-50', fg: 'text-amber-700' },
    { Icon: Lightbulb, label: 'Lampu Mati', bg: 'bg-yellow-50', fg: 'text-yellow-700' },
    { Icon: Trash2, label: 'Sampah', bg: 'bg-green-50', fg: 'text-green-700' },
    { Icon: Droplets, label: 'Air & PAM', bg: 'bg-blue-50', fg: 'text-blue-700' },
    { Icon: Heart, label: 'Kesehatan', bg: 'bg-rose-50', fg: 'text-rose-700' },
    { Icon: Phone, label: 'Darurat', bg: 'bg-purple-50', fg: 'text-purple-700' },
  ];

  return (
    <div className="px-4 pt-5 space-y-5">
      {/* Greeting */}
      <div className="bg-[#1A1A1A] rounded-2xl p-5 text-white">
        <p className="text-white/50 text-xs">Selamat Datang di</p>
        <h1 className="text-xl font-bold mt-1" style={{ fontFamily: 'var(--font-logo)' }}>
          Portal SatuJogja
        </h1>
        <p className="text-white/40 text-[11px] mt-1">Layanan publik digital untuk warga Yogyakarta</p>
        <div className="mt-4 flex gap-2">
          {user ? (
            <button onClick={() => setActiveTab('lapor')} className="px-4 py-2.5 bg-[#D4956A] text-[#1A1A1A] text-xs font-semibold rounded-lg">
              Buat Laporan
            </button>
          ) : (
            <div className="[&>div]:!rounded-lg">
              <GoogleLogin
                onSuccess={onLoginSuccess}
                onError={() => {}}
                size="medium"
                text="signin"
                shape="rectangular"
                locale="id"
              />
            </div>
          )}
          <button onClick={() => setActiveTab('info')} className="px-4 py-2.5 bg-white/10 text-white text-xs font-medium rounded-lg border border-white/10">
            Info Darurat
          </button>
        </div>
        {weather && (
          <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CloudSun className="w-5 h-5 text-yellow-400" />
              <div>
                <div className="text-xs font-semibold">{weather.temperature}°C</div>
                <div className="text-[10px] text-white/50">Kota Yogyakarta</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xs font-bold text-[#1A1A1A] mb-2">Lapor Cepat</h2>
        <div className="grid grid-cols-3 gap-2">
          {quickActions.map(({ Icon, label, bg, fg }, i) => (
            <button
              key={i}
              onClick={() => setActiveTab('lapor')}
              className={`${bg} rounded-xl p-3 flex flex-col items-center gap-1.5 active:scale-95 transition-transform`}
            >
              <Icon className={`w-5 h-5 ${fg}`} />
              <span className={`text-[10px] font-semibold ${fg}`}>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stats — fetched from backend */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { val: loading ? '...' : stats.total, label: 'Laporan', color: 'text-[#1A1A1A]' },
          { val: loading ? '...' : stats.completed, label: 'Selesai', color: 'text-emerald-600' },
          { val: loading ? '...' : stats.in_progress, label: 'Proses', color: 'text-amber-600' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl p-3 text-center border border-[#E7E5E4]">
            <div className={`text-xl font-bold ${s.color}`}>{s.val}</div>
            <div className="text-[10px] text-[#9C9589]">{s.label}</div>
          </div>
        ))}
      </div>

      {/* News — fetched from backend */}
      <div>
        <h2 className="text-xs font-bold text-[#1A1A1A] mb-2">Berita Terkini</h2>
        <div className="space-y-2">
          {loading ? (
            <div className="text-center py-4 text-[#9C9589] text-xs">Memuat...</div>
          ) : news.map((n, i) => (
            <div key={i} className="bg-white rounded-xl p-3 border border-[#E7E5E4] flex gap-3 items-start">
              <div className="w-9 h-9 bg-[#F7F5F2] rounded-lg flex items-center justify-center shrink-0">
                <Newspaper className="w-4 h-4 text-[#9C9589]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-semibold text-[#1A1A1A] leading-tight">{n.title}</h3>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[9px] font-medium text-[#D4956A] bg-[#D4956A]/10 px-1.5 py-0.5 rounded">{n.tag}</span>
                  <span className="text-[9px] text-[#9C9589] flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" />{n.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency */}
      <div className="bg-rose-600 rounded-xl p-4 text-white">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Info Darurat</span>
        </div>
        <p className="text-xs text-white/80 leading-relaxed">Hubungi 112 untuk semua keadaan darurat. 24/7.</p>
        <div className="mt-3 flex gap-2">
          <a href="tel:112" className="px-3 py-2 bg-white text-rose-600 text-[11px] font-bold rounded-lg flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5" /> 112
          </a>
          <a href="tel:118" className="px-3 py-2 bg-white/15 text-white text-[11px] font-medium rounded-lg border border-white/20 flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5" /> 118
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─── REPORT TAB ─── */
function ReportTab({ isOffline, onSubmit, user }) {
  const [formData, setFormData] = useState({ title: '', description: '', location: '', category: 'infrastruktur', image: null, lat: null, lng: null });
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showMap, setShowMap] = useState(false);
  
  // Komponen Helper Peta untuk memilih lokasi
  function LocationMarker() {
    const map = useMapEvents({
      click(e) {
        setFormData(prev => ({
          ...prev,
          lat: e.latlng.lat,
          lng: e.latlng.lng,
          location: `${e.latlng.lat.toFixed(5)}, ${e.latlng.lng.toFixed(5)}`
        }));
        
        // Reverse Geocoding via Nominatim OSM
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}`)
          .then(res => res.json())
          .then(data => {
            if (data && data.display_name) {
              setFormData(prev => ({ ...prev, location: data.display_name }));
            }
          }).catch(() => {});
      }
    });

    return formData.lat === null ? null : (
      <Marker position={[formData.lat, formData.lng]}></Marker>
    );
  }

  const categories = [
    { value: 'infrastruktur', label: 'Infrastruktur', Icon: Construction },
    { value: 'kebersihan', label: 'Kebersihan', Icon: Trash2 },
    { value: 'keamanan', label: 'Keamanan', Icon: Shield },
    { value: 'lainnya', label: 'Lainnya', Icon: Tag },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = { ...formData, user_email: user.email, user_name: user.name };

    if (isOffline) {
      await addReportToQueue(payload);
      setStatus({ type: 'warning', msg: 'Offline. Laporan disimpan dan akan terkirim otomatis saat online.' });
    } else {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/report.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) setStatus({ type: 'success', msg: 'Laporan berhasil dikirim' });
        else throw new Error('Gagal mengirim');
      } catch {
        await addReportToQueue(payload);
        setStatus({ type: 'warning', msg: 'Koneksi gagal. Disimpan ke antrean.' });
      }
    }

    setFormData({ title: '', description: '', location: '', category: 'infrastruktur', image: null, lat: null, lng: null });
    setSubmitting(false);
    onSubmit();
  };

  return (
    <div className="px-4 pt-5 space-y-4">
      <div>
        <h1 className="text-lg font-bold text-[#1A1A1A]">Buat Laporan</h1>
        <p className="text-[11px] text-[#9C9589] mt-0.5">Laporkan masalah di lingkungan Anda</p>
      </div>

      {status && (
        <div className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
          status.type === 'success' ? 'bg-emerald-50 text-emerald-700' :
          status.type === 'warning' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
        }`}>
          {status.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
          <span>{status.msg}</span>
        </div>
      )}

      <div>
        <label className="text-[11px] font-semibold text-[#78716C] mb-1.5 block">Kategori</label>
        <div className="grid grid-cols-4 gap-2">
          {categories.map(({ value, label, Icon }) => (
            <button key={value} type="button"
              onClick={() => setFormData({ ...formData, category: value })}
              className={`p-2.5 rounded-xl text-center transition-colors ${
                formData.category === value ? 'bg-[#1A1A1A] text-white' : 'bg-white text-[#78716C] border border-[#E7E5E4]'
              }`}>
              <Icon className="w-4 h-4 mx-auto" />
              <span className="text-[9px] font-semibold block mt-1">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-[11px] font-semibold text-[#78716C] mb-1 block">Judul</label>
          <input type="text" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
            placeholder="Lampu Jalan Mati" className="w-full px-3 py-3 bg-white rounded-xl border border-[#E7E5E4] text-sm outline-none focus:border-[#D4956A] transition-colors" />
        </div>
        <div>
          <label className="text-[11px] font-semibold text-[#78716C] mb-1 block">Lokasi Laporan</label>
          <div 
            className="relative cursor-pointer group"
            onClick={() => setShowMap(true)}
          >
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9C9589] group-hover:text-[#D4956A] transition-colors" />
            <input type="text" required readOnly value={formData.location} 
              placeholder="Ketuk untuk memilih lokasi di peta..." 
              className="w-full pl-9 pr-3 py-3 bg-white rounded-xl border border-[#E7E5E4] text-sm outline-none cursor-pointer group-hover:border-[#D4956A] transition-colors truncate" />
          </div>
        </div>
        <div>
          <label className="text-[11px] font-semibold text-[#78716C] mb-1 block">Deskripsi</label>
          <textarea required rows="3" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
            placeholder="Jelaskan detail masalah..." className="w-full px-3 py-3 bg-white rounded-xl border border-[#E7E5E4] text-sm outline-none focus:border-[#D4956A] transition-colors resize-none" />
        </div>
        <div>
          <label className="text-[11px] font-semibold text-[#78716C] mb-1 block">Foto Bukti (Opsional)</label>
          <div className="relative border-2 border-dashed border-[#E7E5E4] rounded-xl p-4 text-center bg-white hover:border-[#D4956A] transition-colors">
            <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => setFormData({ ...formData, image: reader.result });
                  reader.readAsDataURL(file);
                }
              }}
            />
            {formData.image ? (
              <img src={formData.image} alt="Preview" className="h-24 mx-auto rounded-lg object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center">
                  <PlayCircle className="w-5 h-5 text-[#9C9589] rotate-90" />
                </div>
                <span className="text-xs text-[#9C9589]">Ketuk untuk unggah foto</span>
              </div>
            )}
          </div>
        </div>
        <button type="submit" disabled={submitting || !formData.lat}
          className="w-full py-3.5 bg-[#1A1A1A] text-white text-sm font-semibold rounded-xl hover:bg-[#1C1917] transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
          {submitting ? 'Mengirim...' : <><Send className="w-4 h-4" /> {isOffline ? 'Simpan Antrean' : 'Kirim Laporan'}</>}
        </button>
      </form>

      {/* Modal Peta */}
      {showMap && (
        <div className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[70vh]">
            <div className="flex justify-between items-center p-4 border-b border-[#E7E5E4]">
              <div>
                <h3 className="font-bold text-[#1A1A1A]">Pilih Lokasi</h3>
                <p className="text-[10px] text-[#78716C]">Ketuk pada peta untuk meletakkan pin</p>
              </div>
              <button type="button" onClick={() => setShowMap(false)} className="px-4 py-2 bg-[#F7F5F2] text-[#1A1A1A] text-xs font-semibold rounded-lg hover:bg-[#E7E5E4] transition-colors">Selesai</button>
            </div>
            <div className="flex-1 w-full bg-gray-100 relative">
              <MapContainer 
                center={formData.lat ? [formData.lat, formData.lng] : [-7.7956, 110.3695]} // Default Jogja
                zoom={14} 
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker />
              </MapContainer>
            </div>
            {formData.location && (
              <div className="p-3 bg-white border-t border-[#E7E5E4] flex items-center gap-2 text-xs">
                <MapPin className="w-4 h-4 text-[#D4956A] shrink-0" />
                <span className="truncate">{formData.location}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── INFO TAB ─── */
function InfoTab() {
  const { setActiveTab, weather, setWeather } = useStore();

  useEffect(() => {
    if (!weather) {
      fetch('https://api.open-meteo.com/v1/forecast?latitude=-7.7956&longitude=110.3695&current_weather=true')
        .then(r => r.json())
        .then(data => {
          if (data && data.current_weather) {
            setWeather(data.current_weather);
          }
        }).catch(() => {});
    }
  }, [weather, setWeather]);

  const emergencyNums = [
    { name: 'Darurat', num: '112', Icon: Phone, bg: 'bg-rose-50' },
    { name: 'Ambulans', num: '118', Icon: Heart, bg: 'bg-pink-50' },
    { name: 'Pemadam', num: '113', Icon: Flame, bg: 'bg-orange-50' },
    { name: 'Polisi', num: '110', Icon: Shield, bg: 'bg-blue-50' },
    { name: 'PLN', num: '123', Icon: Zap, bg: 'bg-yellow-50' },
    { name: 'SAR', num: '115', Icon: LifeBuoy, bg: 'bg-teal-50' },
  ];

  const services = [
    { title: 'BPJS Kesehatan', desc: 'Layanan JKN Mobile & Faskes', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/BPJS_Kesehatan_logo.svg' },
    { title: 'Dukcapil Online', desc: 'Layanan Administrasi Kependudukan', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Lambang_Daerah_Istimewa_Yogyakarta.svg' },
    { title: 'Pajak Daerah', desc: 'Info & Pembayaran Pajak', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Lambang_Daerah_Istimewa_Yogyakarta.svg' },
    { title: 'Perizinan DPMPTSP', desc: 'Pengajuan Izin Usaha', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Lambang_Daerah_Istimewa_Yogyakarta.svg' },
  ];

  return (
    <div className="px-4 pt-5 space-y-5 pb-20">
      <div>
        <h1 className="text-lg font-bold text-[#1A1A1A]">Informasi & Layanan</h1>
        <p className="text-[11px] text-[#9C9589] mt-0.5">Kontak darurat dan portal layanan resmi</p>
      </div>

      <div>
        <h2 className="text-xs font-bold text-[#1A1A1A] mb-2">Nomor Darurat</h2>
        <div className="grid grid-cols-2 gap-2">
          {emergencyNums.map(({ name, num, Icon, bg }, i) => (
            <a key={i} href={`tel:${num}`} className={`${bg} rounded-xl p-3 flex items-center gap-3 active:scale-95 transition-transform`}>
              <Icon className="w-5 h-5 text-[#78716C]" />
              <div>
                <div className="text-base font-bold text-[#1A1A1A]">{num}</div>
                <div className="text-[10px] text-[#9C9589]">{name}</div>
              </div>
            </a>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xs font-bold text-[#1A1A1A] mb-2">Akses Layanan Publik</h2>
        <div className="space-y-2">
          {services.map(({ title, desc, logoUrl }, i) => (
            <button key={i} onClick={() => setActiveTab('mock-service')} className="w-full bg-white rounded-xl p-3 border border-[#E7E5E4] flex items-center gap-3 hover:border-[#D4956A] active:bg-[#F7F5F2] transition-colors group text-left">
              <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shrink-0 border border-[#E7E5E4] overflow-hidden">
                <img src={logoUrl} alt={title} className="w-full h-full object-contain p-1" />
              </div>
              <div className="flex-1">
                <h3 className="text-xs font-semibold text-[#1A1A1A]">{title}</h3>
                <p className="text-[10px] text-[#9C9589]">{desc}</p>
              </div>
              <ArrowLeft className="w-4 h-4 text-[#D6D3D1] rotate-135 group-hover:text-[#D4956A]" style={{ transform: 'rotate(135deg)' }} />
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#1A1A1A] rounded-xl p-4 text-white flex items-center justify-between">
        <div>
          <p className="text-[10px] text-white/50 font-medium">Yogyakarta</p>
          <div className="text-3xl font-bold mt-0.5">{weather ? weather.temperature : '--'}°C</div>
          <p className="text-[10px] text-white/40 mt-0.5">Cerah Berawan</p>
        </div>
        <CloudSun className="w-12 h-12 text-white/20" />
      </div>
    </div>
  );
}

/* ─── HLS VIDEO PLAYER ─── */
function HlsVideo({ src }) {
  const videoRef = useRef(null);

  useEffect(() => {
    let hls;
    if (Hls.isSupported() && videoRef.current) {
      hls = new Hls({
        debug: false,
        enableWorker: true,
      });
      hls.loadSource(src);
      hls.attachMedia(videoRef.current);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoRef.current.play().catch(() => {});
      });
    } else if (videoRef.current && videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS (Safari)
      videoRef.current.src = src;
      videoRef.current.addEventListener('loadedmetadata', () => {
        videoRef.current.play().catch(() => {});
      });
    }

    return () => {
      if (hls) hls.destroy();
    };
  }, [src]);

  return <video ref={videoRef} controls className="w-full h-full object-contain" autoPlay muted playsInline />;
}

/* ─── CCTV TAB ─── */
function CCTVTab() {
  const [cctvs, setCctvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCctv, setSelectedCctv] = useState(null);

  useEffect(() => {
    const fetchCCTV = async () => {
      setLoading(true);
      try {
        const res = await fetch('/cctv-api/api/v1/location-pins?include=categories&filter%5Bhas_coords%5D=true&filter%5Bhas_slug%5D=true&filter%5Bevent_active%5D=true&filter%5Bdisabled%5D=false&fields%5Blocation-pins%5D=slug,name,alias_name,group_name,icon_url,event_name,event_icon_url,pin_type,lat,lng,featured,connected,categories&fields%5Bcategories%5D=name');
        const data = await res.json();
        // Cctvs are in data.data
        if (data.data) {
          setCctvs(data.data);
        }
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    fetchCCTV();
  }, []);

  const openStream = async (id) => {
    setSelectedCctv({ loading: true });
    try {
      const res = await fetch(`/cctv-api/api/v1/location-pins/${id}`);
      const data = await res.json();
      
      let attrs = data.data.attributes;
      // Ganti domain asli dengan endpoint proxy agar m3u8 tidak terkena CORS
      if (attrs.stream_url) {
        attrs.stream_url = attrs.stream_url.replace('https://cctv.jogjaprov.go.id', '/cctv-api');
      }

      setSelectedCctv({ ...attrs, loading: false });
    } catch (e) {
      setSelectedCctv(null);
    }
  };

  return (
    <div className="px-5 pt-5 space-y-4 pb-20">
      <h2 className="text-xl font-bold text-[#1A1A1A]">Pantauan CCTV</h2>
      <p className="text-[11px] text-[#9C9589] mt-0.5">Live streaming CCTV dari Pemprov DIY</p>
      
      {selectedCctv && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#1A1A1A] w-full max-w-md rounded-2xl overflow-hidden border border-white/10">
            <div className="flex justify-between items-center p-4 border-b border-white/10">
              <h3 className="text-white font-semibold text-sm truncate">{selectedCctv.name || 'Memuat...'}</h3>
              <button onClick={() => setSelectedCctv(null)} className="text-white/50 hover:text-white">Tutup</button>
            </div>
            <div className="aspect-video bg-black relative flex items-center justify-center">
              {selectedCctv.loading ? (
                <div className="text-white/50 text-xs flex items-center gap-2">Memuat Stream...</div>
              ) : selectedCctv.stream_url ? (
                <HlsVideo src={selectedCctv.stream_url} />
              ) : (
                <div className="text-red-400 text-xs">Stream tidak tersedia</div>
              )}
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-10 text-gray-400 text-sm">Memuat daftar CCTV...</div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {cctvs.map(c => (
            <div key={c.id} onClick={() => openStream(c.id)} className="bg-white rounded-xl p-3 border border-[#E7E5E4] cursor-pointer hover:border-[#D4956A] transition-colors active:scale-95 group">
              <div className="flex items-start gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-[#F7F5F2] flex items-center justify-center shrink-0">
                  {c.attributes.icon_url ? (
                    <img src={c.attributes.icon_url} alt="" className="w-5 h-5 object-contain" />
                  ) : (
                    <Video className="w-4 h-4 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-[#1A1A1A] truncate">{c.attributes.name}</h4>
                  <p className="text-[9px] text-[#9C9589] truncate">{c.attributes.group_name}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                <div className="flex items-center gap-4">
                  <GoogleTranslate />
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${c.attributes.connected ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    <span className="text-[9px] text-[#9C9589]">{c.attributes.connected ? 'Aktif' : 'Offline'}</span>
                  </div>
                </div>
                <PlayCircle className="w-4 h-4 text-gray-300 group-hover:text-[#D4956A]" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── PROFILE TAB ─── */
function ProfileTab({ user, onLogout }) {
  const [stats, setStats] = useState({ total: 0, selesai: 0, proses: 0 });
  const [showHistory, setShowHistory] = useState(false);
  const [reports, setReports] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const email = encodeURIComponent(user.email);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/stats.php?user_email=${email}`);
        const data = await res.json();
        if (data.status === 'success' && data.data) {
          setStats({
            total: data.data.total,
            selesai: data.data.completed,
            proses: data.data.in_progress
          });
        }
      } catch (e) {
        console.error('Failed to fetch stats', e);
      }
    };
    if (user?.email) fetchStats();
  }, [user]);

  const loadHistory = async () => {
    setShowHistory(true);
    setLoadingHistory(true);
    try {
      const email = encodeURIComponent(user.email);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/report.php?user_email=${email}`);
      const data = await res.json();
      if (data.status === 'success') {
        setReports(data.data);
      }
    } catch (e) {
      console.error(e);
    }
    setLoadingHistory(false);
  };

  const menuItems = [
    { Icon: History, label: 'Riwayat Laporan', desc: 'Lihat status laporan Anda', action: loadHistory },
    { Icon: Bell, label: 'Notifikasi', desc: 'Pengaturan pemberitahuan' },
    { Icon: Globe, label: 'Bahasa', desc: 'Indonesia' },
    { Icon: Smartphone, label: 'Tentang', desc: 'SatuJogja v1.0.0' },
    { Icon: HelpCircle, label: 'Bantuan', desc: 'FAQ dan panduan' },
  ];

  return (
    <div className="px-4 pt-5 space-y-5 pb-20">
      <div className="bg-white rounded-2xl p-5 border border-[#E7E5E4] text-center">
        {user?.picture ? (
          <img src={user.picture} alt="" className="w-16 h-16 rounded-full mx-auto border-2 border-[#E7E5E4]" referrerPolicy="no-referrer" />
        ) : (
          <div className="w-16 h-16 bg-[#1A1A1A] rounded-full mx-auto flex items-center justify-center">
            <User className="w-7 h-7 text-white" />
          </div>
        )}
        <h2 className="text-base font-bold text-[#1A1A1A] mt-3">{user?.name || 'Warga'}</h2>
        <p className="text-[11px] text-[#9C9589]">{user?.email || ''}</p>
        <div className="mt-3 flex justify-center gap-5">
          {[
            { v: stats.total, l: 'Laporan' }, 
            { v: stats.selesai, l: 'Selesai' }, 
            { v: stats.proses, l: 'Proses' }
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-sm font-bold text-[#1A1A1A]">{s.v}</div>
              <div className="text-[9px] text-[#9C9589]">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2 mt-4">
        {menuItems.map(({ Icon, label, desc, action }, i) => (
          <button key={i} onClick={action ? action : undefined} className="w-full bg-white rounded-xl p-3 border border-[#E7E5E4] flex items-center gap-3 hover:border-[#D4956A] active:bg-[#F7F5F2] transition-colors group text-left">
            <div className="w-9 h-9 bg-[#F7F5F2] rounded-lg flex items-center justify-center shrink-0 group-hover:bg-[#D4956A]/10">
              <Icon className="w-4 h-4 text-[#9C9589] group-hover:text-[#D4956A]" />
            </div>
            <div className="flex-1">
              <h3 className="text-xs font-semibold text-[#1A1A1A]">{label}</h3>
              <p className="text-[10px] text-[#9C9589]">{desc}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-[#D6D3D1] group-hover:text-[#D4956A]" />
          </button>
        ))}
      </div>

      <button onClick={onLogout} className="w-full mt-4 py-3 bg-rose-50 text-rose-600 text-[11px] font-bold rounded-xl flex items-center justify-center gap-1.5 hover:bg-rose-100 transition-colors">
        <LogOut className="w-4 h-4" /> Keluar
      </button>

      <p className="text-center text-[9px] text-[#D6D3D1] pb-4 mt-4">SatuJogja PWA v1.0.0</p>
        
      {showHistory && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col max-w-md mx-auto h-screen overflow-y-auto pb-20">
          <div className="sticky top-0 bg-white border-b border-[#E7E5E4] px-4 py-3 flex items-center gap-3">
            <button onClick={() => setShowHistory(false)} className="text-[#9C9589] hover:text-[#1A1A1A]">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-sm font-bold text-[#1A1A1A]">Riwayat Laporan Anda</h2>
          </div>
          <div className="p-4 space-y-3">
            {loadingHistory ? (
              <div className="text-center py-10 text-xs text-[#9C9589]">Memuat riwayat...</div>
            ) : reports.length === 0 ? (
              <div className="text-center py-10 text-xs text-[#9C9589]">Anda belum membuat laporan apa pun.</div>
            ) : (
              reports.map(r => (
                <div key={r.id} className="bg-white border border-[#E7E5E4] rounded-xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-sm font-bold text-[#1A1A1A] leading-tight">{r.title}</h3>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase shrink-0 ${r.status === 'selesai' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                      {r.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#78716C] mb-3 line-clamp-2">{r.description}</p>
                  <div className="flex items-center gap-3 text-[9px] text-[#9C9589]">
                    <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> {r.category}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(r.created_at).toLocaleString('id-ID')}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── MOCK SERVICE TAB ─── */
function MockServiceTab() {
  const { setActiveTab } = useStore();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  return (
    <div className="min-h-screen bg-white absolute inset-0 z-[100] flex flex-col">
      <div className="sticky top-0 bg-white border-b border-[#E7E5E4] px-4 py-3 flex items-center gap-3">
        <button onClick={() => setActiveTab('info')} className="text-[#9C9589] hover:text-[#1A1A1A]">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-sm font-bold text-[#1A1A1A]">Portal Layanan Terpadu</h2>
      </div>

      <div className="flex-1 p-5 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full text-xs text-[#9C9589]">Memuat Layanan...</div>
        ) : success ? (
          <div className="flex flex-col items-center justify-center h-full text-center mt-20">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="font-bold text-[#1A1A1A]">Pendaftaran Berhasil!</h3>
            <p className="text-xs text-[#9C9589] mt-2 max-w-xs">Pengajuan Anda telah direkam dalam sistem. Silakan periksa notifikasi berkala.</p>
            <button onClick={() => setActiveTab('info')} className="mt-8 px-6 py-2.5 bg-[#1A1A1A] text-white rounded-lg text-xs font-semibold">Kembali</button>
          </div>
        ) : (
          <div>
            <div className="w-16 h-16 bg-blue-50 border border-blue-100 rounded-2xl mx-auto flex items-center justify-center mb-4">
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b3/Lambang_Daerah_Istimewa_Yogyakarta.svg" alt="DIY" className="w-10 h-10 object-contain" />
            </div>
            <h1 className="text-xl font-bold text-center text-[#1A1A1A]">Form Pendaftaran / Pengajuan</h1>
            <p className="text-xs text-center text-[#9C9589] mt-1 mb-6">Pilih layanan yang Anda butuhkan (Mock Halaman)</p>

            <form onSubmit={(e) => { e.preventDefault(); setSuccess(true); }} className="space-y-4">
              <div>
                <label className="text-[11px] font-semibold text-[#78716C] mb-1 block">Nomor Induk Kependudukan (NIK)</label>
                <input type="text" required placeholder="3471..." className="w-full px-3 py-3 bg-[#F7F5F2] rounded-xl border border-[#E7E5E4] text-sm outline-none focus:border-blue-400" />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[#78716C] mb-1 block">Nama Lengkap</label>
                <input type="text" required placeholder="Sesuai KTP" className="w-full px-3 py-3 bg-[#F7F5F2] rounded-xl border border-[#E7E5E4] text-sm outline-none focus:border-blue-400" />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[#78716C] mb-1 block">Keperluan Layanan</label>
                <select className="w-full px-3 py-3 bg-[#F7F5F2] rounded-xl border border-[#E7E5E4] text-sm outline-none focus:border-blue-400">
                  <option>Daftar BPJS / Cek Tagihan</option>
                  <option>Administrasi Kependudukan JSS</option>
                  <option>Bayar Pajak Kendaraan</option>
                  <option>Buat Izin Usaha Baru</option>
                </select>
              </div>
              <button type="submit" className="w-full py-3.5 mt-4 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors">
                Proses Pengajuan
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
