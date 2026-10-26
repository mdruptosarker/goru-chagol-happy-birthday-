import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface OpeningSceneProps {
  onEnter: () => void;
  onSkipIntro: () => void;
}

export const OpeningScene: React.FC<OpeningSceneProps> = ({ onEnter, onSkipIntro }) => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 py-12 text-center z-10">
      <div className="max-w-2xl mx-auto flex flex-col items-center">
        {/* Introductory kicker */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1A1238]/80 border border-[#F5D58A]/30 text-xs tracking-widest uppercase text-[#F5D58A] mb-6 shadow-lg shadow-[#F5D58A]/10">
          <Sparkles className="w-3.5 h-3.5 text-[#F5D58A]" />
          <span>27 OCTOBER · CREATED BY RUPTO FOR BUSHRA (EZMA)</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#FFF9FF] mb-6 leading-tight">
          Hey Ezma,<br />
          <span className="italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#FFB6D9] via-[#A78BFA] to-[#F5D58A]">
            This Little Universe
          </span> Is For You.
        </h1>

        {/* Supporting Text */}
        <p className="text-base sm:text-lg md:text-xl text-[#FFF9FF]/85 max-w-xl mx-auto mb-10 leading-relaxed font-light">
          "Some people make ordinary days a little more special. Today, this little world is all yours."
        </p>

        {/* Primary CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={onEnter}
            className="group relative px-8 py-3.5 rounded-full bg-gradient-to-r from-[#A78BFA] to-[#7C3AED] text-white font-medium text-sm sm:text-base shadow-lg shadow-[#7C3AED]/30 hover:shadow-xl hover:shadow-[#7C3AED]/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center gap-2 cursor-pointer"
          >
            <span>ENTER YOUR UNIVERSE</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onSkipIntro}
            className="px-5 py-3 text-xs uppercase tracking-wider text-[#FFF9FF]/60 hover:text-[#FFF9FF] transition-colors cursor-pointer"
          >
            Skip Intro
          </button>
        </div>
      </div>
    </div>
  );
};
