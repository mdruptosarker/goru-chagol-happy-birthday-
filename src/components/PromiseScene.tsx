import React, { useState } from 'react';
import { Heart, Sparkles, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../services/audio';

interface PromiseSceneProps {
  signature: string;
  onTriggerHeartPulse: () => void;
  onProceedToCelebration: () => void;
}

export const PromiseScene: React.FC<PromiseSceneProps> = ({
  signature,
  onTriggerHeartPulse,
  onProceedToCelebration,
}) => {
  const [stage, setStage] = useState<number>(4); // Display the 4 stages
  const [wishMade, setWishMade] = useState<boolean>(false);

  const handleLastWish = () => {
    soundEngine.playWishChime();
    onTriggerHeartPulse();

    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#F5D58A', '#A78BFA', '#FFB6D9', '#FFF9FF'],
      disableForReducedMotion: true,
    });

    setWishMade(true);
  };

  return (
    <div className="relative min-h-screen py-16 px-4 sm:px-6 md:px-8 z-10 flex flex-col justify-between items-center text-center">
      {/* Top Header */}
      <div className="max-w-2xl mx-auto pt-4 pointer-events-auto">
        <span className="text-xs uppercase tracking-[0.3em] text-[#F5D58A] mb-3 block font-medium">
          A LIFELONG HOPE
        </span>

        {/* Message Revealed in Stages */}
        <div className="space-y-2 mb-6">
          <p className="text-xl sm:text-2xl uppercase tracking-widest text-[#FFF9FF]/50 font-light">
            LIFE WILL CHANGE.
          </p>
          <p className="text-xl sm:text-2xl uppercase tracking-widest text-[#FFF9FF]/70 font-light">
            WE'LL GROW UP.
          </p>
          <p className="text-xl sm:text-2xl uppercase tracking-widest text-[#FFF9FF]/90 font-light">
            OUR DREAMS WILL GROW TOO.
          </p>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FFF9FF] via-[#FFB6D9] to-[#A78BFA] pt-2">
            BUT I HOPE WE NEVER STOP BEING BEST FRIENDS.
          </h2>
        </div>

        <p className="text-sm sm:text-base text-[#FFF9FF]/80 max-w-lg mx-auto font-light leading-relaxed mb-8">
          "I can't predict every chapter of the future. But I genuinely hope that, wherever life takes us, we continue choosing kindness, understanding, and friendship."
        </p>
      </div>

      {/* Center / Bottom Wish Trigger & Blessing */}
      <div className="max-w-xl mx-auto w-full pb-8 pointer-events-auto">
        {wishMade ? (
          <div className="bg-[#1A1238]/90 border border-[#F5D58A]/40 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl animate-fade-in text-center">
            <div className="w-12 h-12 rounded-full bg-[#FFB6D9]/10 border border-[#FFB6D9]/30 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-6 h-6 text-[#FFB6D9]" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#FFF9FF] mb-3">
              Happy Birthday, Bushra.
            </h3>

            <p className="text-base sm:text-lg text-[#F5D58A] font-serif italic leading-relaxed mb-6">
              "May your life be full of beautiful beginnings, and may our friendship remain one of the good things we carry with us."
            </p>

            <div className="pt-4 border-t border-white/10 mb-6">
              <span className="text-xs text-[#FFF9FF]/60 block mb-1">
                Made with lifelong care &amp; friendship by
              </span>
              <span className="text-base sm:text-lg font-serif font-bold text-[#F5D58A]">
                Rupto
              </span>
            </div>

            <button
              onClick={onProceedToCelebration}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#A78BFA] to-[#7C3AED] text-white text-xs sm:text-sm font-medium flex items-center justify-center gap-2 mx-auto hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-[#7C3AED]/30"
            >
              <span>CELEBRATE &amp; REPLAY</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={handleLastWish}
              className="group px-8 py-3.5 rounded-full bg-gradient-to-r from-[#FFB6D9] via-[#A78BFA] to-[#F5D58A] text-[#10091F] font-semibold text-sm sm:text-base shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#4C1D95]" />
              <span>ONE LAST WISH</span>
            </button>
            <span className="text-xs text-[#FFF9FF]/60">
              A sincere wish for happiness, growth, and our future
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
