import { useEffect, useState } from 'react';
import { Globe } from 'lucide-react';

export default function GoogleTranslate() {
  const [lang, setLang] = useState('id'); // Default

  useEffect(() => {
    // Check if script is already injected
    if (!document.getElementById('google-translate-script')) {
      window.googleTranslateElementInit = () => {
        if (window.google && window.google.translate) {
          new window.google.translate.TranslateElement(
            { 
              pageLanguage: 'id', 
              includedLanguages: 'id,en', // Limit to ID and EN
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE 
            }, 
            'google_translate_element'
          );
        }
      };

      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    } else {
      // If returning to page, try re-initializing if element is empty
      const targetElement = document.getElementById('google_translate_element');
      if (targetElement && targetElement.innerHTML === '') {
        if (window.google && window.google.translate) {
          new window.google.translate.TranslateElement(
            { 
              pageLanguage: 'id', 
              includedLanguages: 'id,en', 
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE 
            }, 
            'google_translate_element'
          );
        }
      }
    }
  }, []);

  const triggerTranslation = (targetLang) => {
    setLang(targetLang);
    
    // First try the programmatic select change
    const select = document.querySelector('.goog-te-combo');
    if (select) {
      select.value = targetLang;
      select.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
    } else {
      // Fallback: Set the Google Translate cookie and reload
      document.cookie = `googtrans=/id/${targetLang}; path=/;`;
      document.cookie = `googtrans=/id/${targetLang}; domain=${window.location.hostname}; path=/;`;
      window.location.reload();
    }
  };

  // Synchronize state with Google Translate's cookie on mount
  useEffect(() => {
    const match = document.cookie.match(/googtrans=\/id\/([a-z]{2})/);
    if (match && match[1]) {
      setLang(match[1]);
    }
  }, []);

  return (
    <div className="relative flex items-center">
      {/* Hidden original widget */}
      <div 
        id="google_translate_element" 
        className="absolute opacity-0 pointer-events-none -z-10"
      ></div>

      {/* Custom Sleek UI Toggle */}
      <button 
        onClick={() => triggerTranslation(lang === 'id' ? 'en' : 'id')}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-base hover:border-accent/50 hover:bg-card transition-all"
        title={`Ubah ke Bahasa ${lang === 'id' ? 'Inggris' : 'Indonesia'}`}
      >
        <Globe className="w-3.5 h-3.5 text-accent" />
        <span className="text-[10px] font-bold tracking-wider text-text uppercase">
          {lang}
        </span>
      </button>
    </div>
  );
}
