import React, { useState } from 'react';
import { TIMELINE_CHAPTERS } from '../services/storage';
import { Sparkles, ArrowRight, BookOpen, Compass, HeartHandshake, Smile } from 'lucide-react';

interface TimelineSectionProps {
  onProceedToLetter: () => void;
}

const icons = [Compass, Smile, HeartHandshake, BookOpen];

export const TimelineSection: React.FC<TimelineSectionProps> = ({ onProceedToLetter }) => {
  const [activeChapterId, setActiveChapterId] = useState<number>(1);

  return (
    <div className="relative min-h-screen py-20 px-4 sm:px-6 md:px-8 z-10 max-w-5xl mx-auto flex flex-col justify-between">
      {/* Header */}
      <div className="text-center mb-14">
        <span className="text-xs uppercase tracking-[0.25em] text-[#F5D58A] mb-2 block font-medium">
          INTERACTIVE TIMELINE
        </span>
        <h2 className="text-3xl sm:text-5xl font-bold text-[#FFF9FF] tracking-tight mb-3">
          Our Friendship Story
        </h2>
        <p className="text-sm sm:text-base text-[#FFF9FF]/75 max-w-xl mx-auto font-light">
          Rupto &amp; Bushra · A lifelong friendship told across four chapters.
        </p>
      </div>

      {/* Chapters Grid / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {TIMELINE_CHAPTERS.map((chapter, index) => {
          const Icon = icons[index % icons.length];
          const isActive = activeChapterId === chapter.id;

          return (
            <div
              key={chapter.id}
              onClick={() => setActiveChapterId(chapter.id)}
              className={`group cursor-pointer rounded-2xl p-6 sm:p-7 border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                isActive
                  ? 'bg-[#1A1238]/90 border-[#F5D58A] shadow-2xl scale-[1.01]'
                  : 'bg-[#1A1238]/50 border-[#A78BFA]/25 hover:border-[#A78BFA]/60 hover:bg-[#1A1238]/70'
              }`}
            >
              {/* Header inside card */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono tracking-widest text-[#A78BFA] uppercase">
                    Chapter {chapter.chapterNumber}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      isActive
                        ? 'bg-[#F5D58A]/20 text-[#F5D58A]'
                        : 'bg-white/5 text-[#FFF9FF]/60 group-hover:text-[#FFF9FF]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#FFF9FF] mb-3 group-hover:text-[#F5D58A] transition-colors">
                  {chapter.title}
                </h3>

                <p className="text-sm sm:text-base text-[#FFF9FF]/90 font-light leading-relaxed mb-4">
                  "{chapter.message}"
                </p>
              </div>

              {/* Reflection note revealed */}
              <div
                className={`pt-4 border-t border-white/10 transition-all duration-300 ${
                  isActive ? 'opacity-100' : 'opacity-60'
                }`}
              >
                <div className="flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#F5D58A] shrink-0 mt-0.5" />
                  <p className="text-xs text-[#FFF9FF]/70 italic font-serif">
                    {chapter.reflection}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#A78BFA]/20">
        <span className="text-xs text-[#FFF9FF]/60 italic font-serif">
          "A birthday is one day. A real friendship is something you hope to keep for a lifetime."
        </span>
        <button
          onClick={onProceedToLetter}
          className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#A78BFA] to-[#7C3AED] text-white text-xs sm:text-sm font-medium flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-[#7C3AED]/30"
        >
          <span>OPEN THE LETTER</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
