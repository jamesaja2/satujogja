import { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { X, Send, Bot, User } from 'lucide-react';
import gsap from 'gsap';
import ReactMarkdown from 'react-markdown';
import { useStore } from '../store/useStore';

export default function Chatbot() {
  const { isChatOpen: isOpen, setIsChatOpen: setIsOpen, initialChatMsg, setInitialChatMsg } = useStore();
  const [messages, setMessages] = useState([
    { role: 'model', text: 'Halo! Saya Virtual Assistant SatuJogja. Ada yang bisa saya bantu terkait wisata, budaya, atau layanan publik di Yogyakarta?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const chatRef = useRef(null);
  const endOfMessagesRef = useRef(null);
  const genAI = useRef(null);
  const chatSession = useRef(null);

  // System instructions for the bot to keep it in context
  const systemInstruction = `Kamu adalah Virtual Assistant untuk website SatuJogja. 
Tugasmu adalah menjawab pertanyaan seputar pariwisata, kuliner, kebudayaan, sejarah Yogyakarta, serta fitur website SatuJogja (pelaporan publik, peta interaktif, berita). 
JIKA pengguna bertanya hal di luar konteks Yogyakarta atau website ini (misalnya coding, matematika, politik luar negeri, resep masakan non-Jogja, dll), TOLAK dengan sopan dan arahkan kembali ke topik Jogja.
Gunakan bahasa Indonesia yang ramah, sopan, dan informatif.`;

  useEffect(() => {
    // Initialize Gemini AI
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (apiKey) {
      genAI.current = new GoogleGenerativeAI(apiKey);
      const model = genAI.current.getGenerativeModel({
        model: 'gemini-3.1-flash-lite',
        systemInstruction,
      });
      chatSession.current = model.startChat({
        history: [],
      });
    }
  }, []);

  useEffect(() => {
    if (isOpen && chatRef.current) {
      gsap.fromTo(chatRef.current, 
        { y: 50, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.7)' }
      );
    }
  }, [isOpen]);

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && initialChatMsg && chatSession.current) {
      const prompt = initialChatMsg;
      setInitialChatMsg(''); // Clear it
      handleSendRaw(prompt);
    }
  }, [isOpen, initialChatMsg, chatSession.current]);

  const handleSendRaw = async (textToSend) => {
    if (!textToSend.trim() || isLoading) return;

    setMessages(prev => [...prev, { role: 'user', text: textToSend }]);
    setIsLoading(true);

    try {
      if (!chatSession.current) {
        throw new Error("API Key belum diset atau AI belum diinisialisasi.");
      }
      
      const result = await chatSession.current.sendMessage(textToSend);
      const response = await result.response;
      
      setMessages(prev => [...prev, { role: 'model', text: response.text() }]);
    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: `Terjadi kesalahan internal: ${error.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMessage = input.trim();
    setInput('');
    handleSendRaw(userMessage);
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-white border border-border shadow-2xl rounded-full flex items-center justify-center hover:scale-110 transition-transform z-50 ${isOpen ? 'scale-0' : 'scale-100'}`}
      >
        <img src="/images/Wayang.png" alt="AI Chat" className="w-10 h-10 object-contain drop-shadow-md" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div ref={chatRef} className="fixed bottom-6 right-6 w-80 md:w-96 bg-base border border-border rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden" style={{ maxHeight: 'calc(100vh - 120px)' }}>
          {/* Header */}
          <div className="bg-surface border-b border-border p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
                <img src="/images/Wayang.png" alt="Wayang" className="w-6 h-6 object-contain" />
              </div>
              <div>
                <h3 className="font-bold text-text text-sm">SatuJogja Assistant</h3>
                <span className="text-[10px] text-emerald-500 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Online
                </span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-text-muted hover:text-rose-500 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] max-h-[400px]">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex max-w-[85%] gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 ${msg.role === 'user' ? 'bg-accent text-white' : 'bg-surface border border-border'}`}>
                    {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <img src="/images/Wayang.png" alt="AI" className="w-4 h-4 object-contain" />}
                  </div>
                  <div className={`p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-accent text-white rounded-tr-none' : 'bg-surface border border-border text-text rounded-tl-none markdown-content'}`}>
                    {msg.role === 'user' ? (
                      msg.text
                    ) : (
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex max-w-[85%] gap-2">
                  <div className="w-6 h-6 rounded-full bg-surface border border-border flex items-center justify-center shrink-0 mt-1">
                    <img src="/images/Wayang.png" alt="AI" className="w-4 h-4 object-contain" />
                  </div>
                  <div className="p-4 rounded-2xl bg-surface border border-border rounded-tl-none flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                    <span className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={endOfMessagesRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-3 border-t border-border bg-base flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tanya sesuatu..." 
              className="flex-1 bg-surface border border-border rounded-full px-4 py-2 text-sm text-text focus:outline-none focus:border-accent"
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !input.trim()} className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center shrink-0 hover:bg-accent-hover transition-colors disabled:opacity-50">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Basic styles for markdown content since Tailwind resets them */}
      <style>{`
        .markdown-content p { margin-bottom: 0.5rem; }
        .markdown-content p:last-child { margin-bottom: 0; }
        .markdown-content strong { font-weight: bold; color: inherit; }
        .markdown-content em { font-style: italic; }
        .markdown-content ul { list-style-type: disc; margin-left: 1.25rem; margin-bottom: 0.5rem; }
        .markdown-content ol { list-style-type: decimal; margin-left: 1.25rem; margin-bottom: 0.5rem; }
        .markdown-content li { margin-bottom: 0.25rem; }
        .markdown-content h1, .markdown-content h2, .markdown-content h3 { font-weight: bold; margin-bottom: 0.5rem; margin-top: 0.5rem; }
      `}</style>
    </>
  );
}
