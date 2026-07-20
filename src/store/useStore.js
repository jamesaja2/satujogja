import { create } from 'zustand';

export const useStore = create((set) => ({
  // Auth
  user: null,
  setUser: (user) => set({ user }),

  // Scroll
  scrollProgress: 0,
  setScrollProgress: (p) => set({ scrollProgress: p }),

  // Connectivity
  isOffline: true, // Start pessimistic until first ping succeeds
  setOfflineStatus: (s) => set({ isOffline: s }),

  // Dashboard
  activeTab: 'home',
  setActiveTab: (tab) => set({ activeTab: tab }),

  pendingReportsCount: 0,
  setPendingReportsCount: (c) => set({ pendingReportsCount: c }),

  // Loading
  appLoaded: false,
  setAppLoaded: (v) => set({ appLoaded: v }),

  // Weather
  weather: null,
  setWeather: (w) => set({ weather: w }),

  // Chatbot
  isChatOpen: false,
  setIsChatOpen: (v) => set({ isChatOpen: v }),
  initialChatMsg: '',
  setInitialChatMsg: (msg) => set({ initialChatMsg: msg }),
}));

if (typeof window !== 'undefined') {
  const checkBackend = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/stats.php`, { method: 'HEAD', cache: 'no-cache' });
      useStore.getState().setOfflineStatus(!res.ok);
    } catch {
      useStore.getState().setOfflineStatus(true);
    }
  };

  // Initial check
  checkBackend();

  // Ping every 10 seconds
  setInterval(checkBackend, 10000);

  // Still listen to browser events for immediate offline detection
  window.addEventListener('online', checkBackend);
  window.addEventListener('offline', () => useStore.getState().setOfflineStatus(true));
}
