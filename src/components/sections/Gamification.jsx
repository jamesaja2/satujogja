import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { HelpCircle, Trophy, RefreshCw, ArrowRight, CheckCircle, XCircle } from 'lucide-react';

const QUIZ_DATA = [
  {
    id: 1,
    question: "Apa nama makanan khas Yogyakarta yang terbuat dari nangka muda yang dimasak dengan santan dalam waktu lama?",
    options: ["Bakpia", "Gudeg", "Sate Klatak", "Tiwul"],
    answer: "Gudeg",
    explanation: "Gudeg adalah hidangan ikonik Jogja yang manis dan gurih, terbuat dari nangka muda (gori)."
  },
  {
    id: 2,
    question: "Tugu Yogyakarta, simbol kota Jogja, dibangun oleh pendiri keraton, yaitu...",
    options: ["Sri Sultan Hamengkubuwono I", "Sri Sultan Hamengkubuwono IX", "Ki Hajar Dewantara", "Pangeran Diponegoro"],
    answer: "Sri Sultan Hamengkubuwono I",
    explanation: "Tugu Golong Gilig (sekarang Tugu Pal Putih) dibangun pada tahun 1755 oleh Sultan HB I."
  },
  {
    id: 3,
    question: "Candi Hindu terbesar di Indonesia yang terletak di perbatasan Yogyakarta dan Jawa Tengah adalah...",
    options: ["Candi Borobudur", "Candi Ratu Boko", "Candi Prambanan", "Candi Mendut"],
    answer: "Candi Prambanan",
    explanation: "Candi Prambanan dibangun pada abad ke-9 dan merupakan mahakarya arsitektur Hindu peninggalan Mataram Kuno."
  }
];

export default function Gamification() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  
  const cardRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(cardRef.current, 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
    );
  }, [currentQuestion, showResult]);

  const handleOptionClick = (option) => {
    if (isAnswered) return;
    
    setSelectedOption(option);
    setIsAnswered(true);
    
    if (option === QUIZ_DATA[currentQuestion].answer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion + 1 < QUIZ_DATA.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  return (
    <section className="py-24 px-6 bg-surface/50 border-t border-b border-border">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 mb-4">
            <HelpCircle className="w-6 h-6 text-accent" />
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-text">Seberapa Jogja Kamu?</h2>
          <p className="text-text-muted mt-3 max-w-lg mx-auto">Uji pengetahuanmu tentang kebudayaan dan sejarah Yogyakarta melalui kuis interaktif ini.</p>
        </div>

        <div ref={cardRef} className="bg-card border border-border rounded-2xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
          {/* Decorative background blob */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>

          {!showResult ? (
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-8">
                <span className="text-xs font-bold text-teal tracking-widest uppercase">Pertanyaan {currentQuestion + 1} / {QUIZ_DATA.length}</span>
                <span className="text-sm font-medium text-text bg-base px-3 py-1 rounded-full border border-border">
                  Skor: {score}
                </span>
              </div>
              
              <h3 className="text-xl md:text-2xl font-bold text-text mb-8 leading-relaxed">
                {QUIZ_DATA[currentQuestion].question}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {QUIZ_DATA[currentQuestion].options.map((option, idx) => {
                  const isCorrect = option === QUIZ_DATA[currentQuestion].answer;
                  const isSelected = selectedOption === option;
                  
                  let buttonClass = "flex items-center justify-between p-4 rounded-xl border text-left transition-all duration-300 font-medium ";
                  
                  if (!isAnswered) {
                    buttonClass += "bg-base border-border hover:border-accent hover:bg-accent/5 text-text-dim hover:text-text";
                  } else {
                    if (isCorrect) {
                      buttonClass += "bg-emerald-500/10 border-emerald-500/50 text-emerald-500";
                    } else if (isSelected && !isCorrect) {
                      buttonClass += "bg-rose-500/10 border-rose-500/50 text-rose-500";
                    } else {
                      buttonClass += "bg-base border-border opacity-50 text-text-dim";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionClick(option)}
                      disabled={isAnswered}
                      className={buttonClass}
                    >
                      <span>{option}</span>
                      {isAnswered && isCorrect && <CheckCircle className="w-5 h-5" />}
                      {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5" />}
                    </button>
                  );
                })}
              </div>

              {isAnswered && (
                <div className="animate-fade-in">
                  <div className={`p-4 rounded-xl border mb-6 ${selectedOption === QUIZ_DATA[currentQuestion].answer ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-rose-500/5 border-rose-500/20'}`}>
                    <p className="text-sm text-text leading-relaxed">
                      <span className="font-bold">{selectedOption === QUIZ_DATA[currentQuestion].answer ? 'Benar!' : 'Kurang Tepat.'}</span> {QUIZ_DATA[currentQuestion].explanation}
                    </p>
                  </div>
                  <button 
                    onClick={handleNext}
                    className="w-full md:w-auto bg-accent text-white px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-accent-hover transition-colors ml-auto"
                  >
                    Lanjut <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="relative z-10 text-center py-10">
              <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-10 h-10 text-amber-500" />
              </div>
              <h3 className="text-3xl font-bold text-text mb-2">Kuis Selesai!</h3>
              <p className="text-text-muted mb-8">Anda mendapatkan skor {score} dari {QUIZ_DATA.length}</p>
              
              <div className="inline-block bg-base border border-border px-6 py-3 rounded-2xl mb-8">
                <p className="text-lg font-medium text-text">
                  {score === QUIZ_DATA.length ? '🥇 Warga Jogja Sejati!' : 
                   score > 0 ? '🥈 Lumayan, masih perlu banyak main ke Jogja!' : 
                   '🥉 Wah, harus lebih sering baca sejarah Jogja nih!'}
                </p>
              </div>

              <div>
                <button 
                  onClick={restartQuiz}
                  className="bg-surface border border-border text-text px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-base transition-colors mx-auto"
                >
                  <RefreshCw className="w-4 h-4" /> Coba Lagi
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
