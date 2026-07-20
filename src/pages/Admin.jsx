import { useState, useEffect } from 'react';
import { Newspaper, Trash2, Plus, LogOut, Lock, MessageSquare, MapPin, CheckCircle, Clock, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Admin() {
  const [authKey, setAuthKey] = useState(localStorage.getItem('adminKey') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(!!authKey);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Pemerintahan');
  const [editNewsId, setEditNewsId] = useState(null);
  
  // Admin Tabs
  const [adminTab, setAdminTab] = useState('news'); // 'news' or 'reports'
  const [reports, setReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  
  const API_BASE = `${import.meta.env.VITE_API_URL}/admin_news.php`;
  const nav = useNavigate();

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_BASE);
      const data = await res.json();
      if (data.status === 'success') setNews(data.data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const fetchReports = async () => {
    setLoadingReports(true);
    try {
      const API_REPORTS = import.meta.env.VITE_API_URL + '/report.php';
      const res = await fetch(API_REPORTS, { cache: 'no-store' });
      const data = await res.json();
      if (data.status === 'success') setReports(data.data);
    } catch (e) {
      console.error(e);
    }
    setLoadingReports(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchNews();
      fetchReports();
    }
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    // Dummy check, real auth is in backend header
    if (authKey.trim() !== '') {
      localStorage.setItem('adminKey', authKey);
      setIsAuthenticated(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminKey');
    setAuthKey('');
    setIsAuthenticated(false);
  };

  const handleAddNews = async (e) => {
    e.preventDefault();
    if (!title) return;
    
    try {
      const method = editNewsId ? 'PUT' : 'POST';
      const body = editNewsId ? { id: editNewsId, title, tag: category } : { title, tag: category };
      
      const res = await fetch(API_BASE, {
        method,
        headers: { 'Content-Type': 'application/json', 'X-Admin-Key': authKey },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        setTitle('');
        setEditNewsId(null);
        fetchNews();
      } else {
        alert('Gagal menyimpan berita. Cek kunci Admin.');
      }
    } catch (e) {
      alert('Network Error');
    }
  };

  const handleEditNews = (n) => {
    setEditNewsId(n.id);
    setTitle(n.title);
    setCategory(n.tag);
  };

  const handleUpdateReportStatus = async (id, newStatus) => {
    // Optimistic UI update to prevent the dropdown from snapping back
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));

    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/report.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-Admin-Key': authKey },
        body: JSON.stringify({ id, status: newStatus })
      });
      if (!res.ok) {
        alert('Gagal memperbarui status laporan.');
        fetchReports(); // Revert state on failure
      }
    } catch (e) {
      alert('Network Error');
      fetchReports(); // Revert state on failure
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus berita ini?')) return;
    try {
      const res = await fetch(`${API_BASE}?id=${id}`, {
        method: 'DELETE',
        headers: { 'X-Admin-Key': authKey }
      });
      if (res.ok) fetchNews();
    } catch (e) {
      alert('Network Error');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-base flex items-center justify-center p-6">
        <div className="bg-surface border border-border p-8 rounded-2xl w-full max-w-sm">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
              <Lock className="w-6 h-6 text-accent" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-text text-center mb-6">Admin Panel</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Admin Key</label>
              <input
                type="password"
                value={authKey}
                onChange={e => setAuthKey(e.target.value)}
                className="w-full bg-base border border-border rounded-lg px-4 py-2.5 text-text focus:outline-none focus:border-accent"
                placeholder="Masukkan kata sandi..."
              />
            </div>
            <button type="submit" className="w-full bg-accent text-base font-bold py-2.5 rounded-lg">
              Masuk
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-text">SatuJogja Admin</h1>
            <p className="text-text-dim text-sm mt-1">Portal Manajemen Web & Laporan Warga</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => nav('/')} className="px-4 py-2 bg-surface border border-border text-text rounded-lg text-sm">Kembali ke Web</button>
            <button onClick={handleLogout} className="px-4 py-2 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-lg text-sm flex items-center gap-2">
              <LogOut className="w-4 h-4" /> Keluar
            </button>
          </div>
        </div>

        <div className="flex border-b border-border mb-6">
          <button onClick={() => setAdminTab('news')} className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${adminTab === 'news' ? 'border-accent text-accent' : 'border-transparent text-text-muted hover:text-text'}`}>
            <div className="flex items-center gap-2"><Newspaper className="w-4 h-4" /> Berita</div>
          </button>
          <button onClick={() => setAdminTab('reports')} className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${adminTab === 'reports' ? 'border-accent text-accent' : 'border-transparent text-text-muted hover:text-text'}`}>
            <div className="flex items-center gap-2"><MessageSquare className="w-4 h-4" /> Laporan Warga</div>
          </button>
        </div>

        {adminTab === 'news' ? (
        <div className="grid md:grid-cols-3 gap-6">
          {/* Form Tambah */}
          <div className="md:col-span-1">
            <div className="bg-surface border border-border rounded-xl p-5 sticky top-6">
              <h2 className="text-lg font-semibold text-text mb-4">{editNewsId ? 'Edit Berita' : 'Tambah Berita'}</h2>
              <form onSubmit={handleAddNews} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">Judul Berita</label>
                  <textarea
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full bg-base border border-border rounded-lg px-3 py-2 text-text text-sm focus:outline-none focus:border-accent"
                    rows={3}
                    placeholder="Contoh: Perbaikan Jalan Malioboro..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">Kategori</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full bg-base border border-border rounded-lg px-3 py-2 text-text text-sm focus:outline-none focus:border-accent"
                  >
                    <option>Infrastruktur</option>
                    <option>Budaya</option>
                    <option>Kesehatan</option>
                    <option>Pemerintahan</option>
                    <option>Lainnya</option>
                  </select>
                </div>
                <button type="submit" className="w-full bg-accent text-base font-bold py-2 rounded-lg flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" /> {editNewsId ? 'Simpan Perubahan' : 'Tambah'}
                </button>
                {editNewsId && (
                  <button type="button" onClick={() => { setEditNewsId(null); setTitle(''); }} className="w-full bg-surface border border-border text-text-muted text-sm font-bold py-2 rounded-lg mt-2">
                    Batal Edit
                  </button>
                )}
              </form>
            </div>
          </div>

          {/* List Berita */}
          <div className="md:col-span-2">
            <div className="bg-surface border border-border rounded-xl p-5">
              <h2 className="text-lg font-semibold text-text mb-4">Daftar Berita Aktif</h2>
              {loading ? (
                <div className="text-center py-10 text-text-muted">Memuat...</div>
              ) : news.length === 0 ? (
                <div className="text-center py-10 text-text-dim">Belum ada berita.</div>
              ) : (
                <div className="space-y-3">
                  {news.map(n => (
                    <div key={n.id} className="bg-base border border-border rounded-lg p-4 flex gap-4 items-center justify-between">
                      <div className="flex gap-3 items-start flex-1 min-w-0">
                        <div className="w-10 h-10 bg-surface rounded-lg flex items-center justify-center shrink-0">
                          <Newspaper className="w-5 h-5 text-text-dim" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-text leading-tight">{n.title}</h3>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[10px] font-medium text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded-full">{n.tag}</span>
                            <span className="text-[10px] text-text-dim">{n.time}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleEditNews(n)} className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors shrink-0">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(n.id)} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors shrink-0">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        ) : (
        <div className="bg-surface border border-border rounded-xl p-5">
          <h2 className="text-lg font-semibold text-text mb-4">Daftar Laporan Warga</h2>
          {loadingReports ? (
            <div className="text-center py-10 text-text-muted">Memuat...</div>
          ) : reports.length === 0 ? (
            <div className="text-center py-10 text-text-dim">Belum ada laporan.</div>
          ) : (
            <div className="space-y-4">
              {reports.map(r => (
                <div key={r.id} className="bg-base border border-border rounded-lg p-5 flex flex-col md:flex-row gap-5">
                  {r.image && (
                    <img src={r.image} alt="Bukti" className="w-full md:w-48 h-32 object-cover rounded-lg bg-surface border border-border" />
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-base font-bold text-text">{r.title}</h3>
                        <p className="text-[10px] text-text-dim mt-0.5">Dilaporkan oleh: {r.user_name || 'Anonim'} ({r.user_email || 'Tidak ada email'})</p>
                      </div>
                      <select 
                        value={r.status} 
                        onChange={(e) => handleUpdateReportStatus(r.id, e.target.value)}
                        className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase cursor-pointer outline-none border ${r.status === 'selesai' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}
                      >
                        <option value="pending">PENDING</option>
                        <option value="proses">PROSES</option>
                        <option value="selesai">SELESAI</option>
                      </select>
                    </div>
                    <p className="text-sm text-text-muted mb-3 mt-2">{r.description}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-auto">
                      <span className="text-xs bg-surface px-2 py-1 rounded-md border border-border flex items-center gap-1">
                        <Tag className="w-3 h-3 text-text-dim" /> {r.category}
                      </span>
                      {r.lat && r.lng ? (
                        <button onClick={() => setSelectedLocation({ lat: parseFloat(r.lat), lng: parseFloat(r.lng), loc: r.location })} className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-md flex items-center gap-1 hover:bg-accent hover:text-white transition-colors">
                          <MapPin className="w-3 h-3" /> Lihat Lokasi Peta
                        </button>
                      ) : (
                        <span className="text-xs bg-surface px-2 py-1 rounded-md border border-border flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-text-dim" /> {r.location}
                        </span>
                      )}
                      <span className="text-xs text-text-dim ml-auto flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {new Date(r.created_at).toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        )}

      </div>
      
      {/* Map Modal for Admin */}
      {selectedLocation && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className="font-bold text-gray-900">Lokasi Laporan</h3>
              <button onClick={() => setSelectedLocation(null)} className="px-4 py-2 bg-gray-100 text-gray-900 text-xs font-semibold rounded-lg hover:bg-gray-200">Tutup</button>
            </div>
            <div className="w-full bg-gray-100 relative" style={{ height: '50vh' }}>
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedLocation.lng-0.01}%2C${selectedLocation.lat-0.01}%2C${selectedLocation.lng+0.01}%2C${selectedLocation.lat+0.01}&layer=mapnik&marker=${selectedLocation.lat}%2C${selectedLocation.lng}`}
                allowFullScreen
              ></iframe>
            </div>
            <div className="p-3 bg-white flex items-center gap-2 text-sm text-gray-700">
              <MapPin className="w-4 h-4 text-red-500" />
              <span>{selectedLocation.loc || `${selectedLocation.lat}, ${selectedLocation.lng}`}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
