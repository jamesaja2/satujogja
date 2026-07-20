import { useEffect, useRef, useState } from 'react';
import wayangImg from '../assets/wayang-full.png';

export default function LoadingScreen({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef();
  const wayangRef = useRef();

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onFinish, 400);
          return 100;
        }
        return prev + 2;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-base flex flex-col items-center justify-center"
      style={{ opacity: progress >= 100 ? 0 : 1, transition: 'opacity 0.4s ease' }}
    >
      {/* Wayang silhouette */}
      <img
        ref={wayangRef}
        src={wayangImg}
        alt=""
        className="h-48 object-contain mb-8 select-none"
        style={{
          filter: 'brightness(0.6) sepia(0.3)',
          animation: 'pulse 2s ease-in-out infinite',
        }}
      />

      {/* Brand */}
      <h1 className="font-display text-3xl font-bold text-text tracking-wider mb-2">
        SATUJOGJA
      </h1>
      <p className="text-text-dim text-xs tracking-[0.3em] uppercase">
        The Soul of Java
      </p>

      {/* Progress bar */}
      <div className="mt-8 w-48 h-0.5 bg-border rounded-full overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.02); }
        }
      `}</style>
    </div>
  );
}
