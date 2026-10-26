import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, Image, Mail, Sparkles, Sliders } from 'lucide-react';
import { soundEngine } from '../services/audio';

interface CelebrationSceneProps {
  onReplay: () => void;
  onGoToMemories: () => void;
  onGoToLetter: () => void;
  onOpenCustomizer: () => void;
}

export const CelebrationScene: React.FC<CelebrationSceneProps> = ({
  onReplay,
  onGoToMemories,
  onGoToLetter,
  onOpenCustomizer,
}) => {
  useEffect(() => {
    // Elegant fireworks burst on mounting
    const end = Date.now() + 2.5 * 1000;
    const colors = ['#F5D58A', '#A78BFA', '#FFB6D9', '#FFFFFF'];

    let reqId = 0;
    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 50,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 50,
        origin: { x: 1 },
        colors,
      });

      if (Date.now() < end) {
        reqId = requestAnimationFrame(frame);
      }
    };
    reqId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(reqId);
    };
  }, []);

  return (
    <div className="relative min-h-screen py-20 px-4 sm:px-6 md:px-8 z-10 flex flex-col items-center justify-center text-center">
      <div className="max-w-2xl mx-auto flex flex-col items-center">
        {/* Decorative Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F5D58A]/10 border border-[#F5D58A]/30 text-xs uppercase tracking-widest text-[#F5D58A] mb-8">
          <Sparkles className="w-3.5 h-3.5" />
          <span>27 OCTOBER · 15 YEARS OF LIGHT</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#FFF9FF] mb-4">
          HAPPY 15TH BIRTHDAY,<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFB6D9] via-[#A78BFA] to-[#F5D58A]">
            BUSHRA!
          </span>
        </h1>

        {/* Supporting Text */}
        <p className="text-base sm:text-xl text-[#FFF9FF]/85 font-serif italic max-w-xl mx-auto mb-10 leading-relaxed">
          "Here's to beautiful memories, new beginnings, and a friendship that keeps growing."
        </p>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 mb-8">
          <button
            onClick={onReplay}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-[#A78BFA] to-[#7C3AED] text-white font-medium text-xs sm:text-sm flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#7C3AED]/30 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>REPLAY THE EXPERIENCE</span>
          </button>

          <button
            onClick={onGoToMemories}
            className="px-5 py-3 rounded-full bg-[#1A1238] border border-[#A78BFA]/30 text-xs sm:text-sm text-[#FFF9FF] hover:border-[#F5D58A] hover:bg-[#1A1238]/80 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Image className="w-4 h-4 text-[#A78BFA]" />
            <span>VIEW OUR MEMORIES</span>
          </button>

          <button
            onClick={onGoToLetter}
            className="px-5 py-3 rounded-full bg-[#1A1238] border border-[#A78BFA]/30 text-xs sm:text-sm text-[#FFF9FF] hover:border-[#F5D58A] hover:bg-[#1A1238]/80 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Mail className="w-4 h-4 text-[#F5D58A]" />
            <span>READ THE LETTER AGAIN</span>
          </button>
        </div>

        <div className="inline-flex items-center gap-2 text-xs text-[#F5D58A] bg-[#1A1238]/70 px-4 py-2 rounded-full border border-[#F5D58A]/30">
          <Sparkles className="w-3.5 h-3.5 text-[#F5D58A]" />
          <span>Created with friendship &amp; care by Rupto for Bushra</span>
        </div>
      </div>
    </div>
  );
};
