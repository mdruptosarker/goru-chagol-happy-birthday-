import React, { useEffect, useState } from 'react';
import { Sparkles, Music2, Heart } from 'lucide-react';

interface IntroSplashProps {
  onComplete: () => void;
}

export const IntroSplash: React.FC<IntroSplashProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'enter' | 'visible' | 'exit'>('enter');

  useEffect(() => {
    // Phase 1: Enter animation
    const enterTimer = setTimeout(() => {
      setPhase('visible');
    }, 50);

    // Phase 2: Stay visible for ~1.2s to 1.5s, then initiate smooth cinematic exit
    const exitTimer = setTimeout(() => {
      setPhase('exit');
    }, 1400);

    // Phase 3: Complete callback after exit fade transition finishes
    const finishTimer = setTimeout(() => {
      onComplete();
    }, 2000);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
      clearTimeout(finishTimer);
    };
  }, [onComplete]);

  // Handle tap or click to speed up exit if user touches screen
  const handleClickToSkip = () => {
    if (phase !== 'exit') {
      setPhase('exit');
      setTimeout(onComplete, 400);
    }
  };

  return (
    <div
      onClick={handleClickToSkip}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center cursor-pointer select-none transition-all duration-700 ease-out overflow-hidden ${
        phase === 'enter'
          ? 'opacity-0 scale-95 pointer-events-auto'
          : phase === 'visible'
          ? 'opacity-100 scale-100 pointer-events-auto'
          : 'opacity-0 scale-105 pointer-events-none'
      }`}
      style={{
        background: 'radial-gradient(ellipse at center, #241442 0%, #130B24 50%, #090514 100%)',
      }}
    >
      {/* Ambient background glow orb */}
      <div className="absolute w-[360px] h-[360px] sm:w-[540px] sm:h-[540px] rounded-full bg-gradient-to-tr from-[#A78BFA]/20 via-[#FFB6D9]/15 to-[#F5D58A]/25 blur-3xl animate-pulse pointer-events-none" />

      {/* Floating stardust and celestial particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(24)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-[#FFF9FF] animate-ping"
            style={{
              top: `${(i * 17) % 95}%`,
              left: `${(i * 23) % 95}%`,
              width: `${(i % 3) + 2}px`,
              height: `${(i % 3) + 2}px`,
              opacity: 0.2 + (i % 5) * 0.15,
              animationDuration: `${2 + (i % 3)}s`,
              animationDelay: `${(i * 0.15)}s`,
            }}
          />
        ))}

        {/* Floating musical notes */}
        <span
          className="absolute top-1/4 left-1/5 text-[#F5D58A]/50 text-2xl animate-bounce"
          style={{ animationDuration: '3s' }}
        >
          ♪
        </span>
        <span
          className="absolute bottom-1/3 right-1/5 text-[#FFB6D9]/50 text-xl animate-bounce"
          style={{ animationDuration: '2.4s', animationDelay: '0.4s' }}
        >
          ♫
        </span>
        <span
          className="absolute top-1/3 right-1/4 text-[#A78BFA]/50 text-3xl animate-pulse"
          style={{ animationDuration: '2s' }}
        >
          ✨
        </span>
        <span
          className="absolute bottom-1/4 left-1/4 text-[#F5D58A]/40 text-lg animate-pulse"
          style={{ animationDuration: '2.8s' }}
        >
          ✦
        </span>
      </div>

      {/* Main floating container */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-xl mx-auto">
        {/* Shimmering Badge */}
        <div
          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1A1238]/90 border border-[#F5D58A]/40 shadow-lg shadow-[#F5D58A]/15 text-xs sm:text-sm tracking-widest uppercase text-[#F5D58A] mb-6 transition-all duration-700 delay-100 ${
            phase === 'enter' ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#F5D58A] animate-spin" style={{ animationDuration: '6s' }} />
          <span className="font-medium">FOR BUSHRA</span>
          <Heart className="w-3 h-3 text-[#FFB6D9] fill-[#FFB6D9]" />
        </div>

        {/* Floating Title: Happy Birthday Ezma */}
        <div
          className={`transition-all duration-700 delay-200 ${
            phase === 'enter' ? 'translate-y-6 opacity-0 scale-95' : 'translate-y-0 opacity-100 scale-100'
          }`}
        >
          <h1
            className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-4 font-serif leading-tight"
            style={{
              textShadow: '0 0 40px rgba(245, 213, 138, 0.35), 0 0 80px rgba(167, 139, 250, 0.25)',
            }}
          >
            <span className="block text-[#FFF9FF] text-3xl sm:text-5xl font-light mb-1">
              ✨ Happy Birthday
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#FFB6D9] via-[#F5D58A] to-[#A78BFA] italic">
              Ezma
            </span>
          </h1>
        </div>

        {/* Emotional Tagline */}
        <p
          className={`text-sm sm:text-base md:text-lg text-[#FFF9FF]/85 max-w-md mx-auto mb-6 font-light leading-relaxed transition-all duration-700 delay-300 ${
            phase === 'enter' ? 'translate-y-6 opacity-0' : 'translate-y-0 opacity-100'
          }`}
        >
          A special day for an extraordinary best friend.
        </p>

        {/* Audio Equalizer & Playing Indicator */}
        <div
          className={`flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#1A1238]/70 border border-[#A78BFA]/30 backdrop-blur-sm shadow-md transition-all duration-700 delay-400 ${
            phase === 'enter' ? 'translate-y-6 opacity-0' : 'translate-y-0 opacity-100'
          }`}
        >
          <Music2 className="w-4 h-4 text-[#A78BFA] animate-bounce" />
          <span className="text-xs sm:text-sm text-[#F5D58A] font-medium tracking-wide">
            Playing "Happy Birthday" Song
          </span>
          <div className="flex items-end gap-1 h-3.5 pl-1">
            <span className="w-1 bg-[#F5D58A] rounded-full animate-pulse h-3" />
            <span className="w-1 bg-[#FFB6D9] rounded-full animate-pulse h-2" style={{ animationDelay: '0.15s' }} />
            <span className="w-1 bg-[#A78BFA] rounded-full animate-pulse h-3.5" style={{ animationDelay: '0.3s' }} />
            <span className="w-1 bg-[#F5D58A] rounded-full animate-pulse h-2" style={{ animationDelay: '0.45s' }} />
          </div>
        </div>

        {/* Animated Progress Bar */}
        <div className="w-44 h-1 bg-[#1A1238] rounded-full mt-8 overflow-hidden border border-white/10">
          <div
            className="h-full bg-gradient-to-r from-[#A78BFA] via-[#F5D58A] to-[#FFB6D9] rounded-full transition-all duration-1400 ease-out"
            style={{
              width: phase === 'enter' ? '0%' : '100%',
            }}
          />
        </div>

        <p className="text-[11px] text-[#FFF9FF]/40 mt-3 font-light tracking-wider">
          Entering universe... (tap anywhere to open)
        </p>
      </div>
    </div>
  );
};
