import React, { useState, useEffect } from 'react';
import { Mail, Sparkles, ArrowRight, Eye, Check } from 'lucide-react';
import { soundEngine } from '../services/audio';

interface LetterSceneProps {
  signature: string;
  onProceedToPromise: () => void;
}

const LETTER_PARAGRAPHS = [
  "Hey, Bushra.",
  "Today is your day, and I wanted to make something a little different for you. Not just another birthday wish, not just a message that you'll read and forget, but something that holds a little piece of what our friendship means to me.",
  "First of all, happy 15th birthday!",
  "I hope this new chapter of your life brings you happiness, confidence, beautiful memories, and a thousand reasons to smile. I hope you achieve the things you've been dreaming about, discover new things about yourself, and always remember how special you are.",
  "But there's something else I want to tell you.",
  "Out of all the people we meet in life, only a few become genuinely important to us. And I'm really glad that you became one of those people in my life.",
  "I don't know what the future has planned for us. Life will change, we'll grow up, we'll have new dreams, new responsibilities, and maybe a thousand different things to worry about.",
  "But honestly, I hope one thing never changes.",
  "I hope we never become strangers.",
  "I hope that even years from now, we'll still be able to talk about random things, laugh at stupid jokes, share our little victories, and be there for each other when life gets difficult.",
  "I hope that one day, when we're older, we'll look back at these moments and smile because we didn't let time erase a friendship that meant something to us.",
  "And if there's one thing I genuinely want, it's this:",
  "I want to keep you as my best friend for as long as life allows us to.",
  "Not because everything will always be perfect, and not because we'll never disagree, but because I believe real friendship is worth choosing, protecting, and taking care of.",
  "You don't have to be perfect. Neither do I. We just have to keep being honest with each other, respect each other, and never forget the value of what we share.",
  "So, Bushra, on your birthday, I wish you more than happiness for just one day. I wish you a beautiful life, genuine people around you, dreams that come true, and memories that make you smile even years later.",
  "And selfishly, I hope I get to be part of many of those memories.",
  "Here's to more conversations, more laughter, more unforgettable moments, and hopefully, a friendship that grows with us through every chapter of life.",
  "Happy Birthday, Bushra.",
  "Thank you for being my best friend.",
  "No matter how much life changes or where our journeys take us,",
  "I hope we always stay by each other's side, laughing together through every chapter of life.",
  "Here's to you, to your future, and to our friendship.",
  "With lots of respect, care, and friendship,",
];

export const LetterScene: React.FC<LetterSceneProps> = ({ signature, onProceedToPromise }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showFull, setShowFull] = useState(false);
  const [revealedIndex, setRevealedIndex] = useState(3);

  const handleOpenLetter = () => {
    soundEngine.playShimmer();
    setIsOpen(true);
  };

  // Gentle progressive reveal of paragraphs unless showFull is clicked
  useEffect(() => {
    if (!isOpen || showFull) return;
    if (revealedIndex < LETTER_PARAGRAPHS.length) {
      const timer = setTimeout(() => {
        setRevealedIndex((prev) => prev + 2);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [isOpen, showFull, revealedIndex]);

  return (
    <div className="relative min-h-screen py-16 px-4 sm:px-6 md:px-8 z-10 flex flex-col items-center justify-center">
      {!isOpen ? (
        /* Floating Envelope View */
        <div className="max-w-md w-full mx-auto text-center flex flex-col items-center animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-[#A78BFA]/10 border border-[#A78BFA]/30 flex items-center justify-center mb-6">
            <Mail className="w-7 h-7 text-[#F5D58A]" />
          </div>

          <span className="text-xs uppercase tracking-[0.25em] text-[#F5D58A] mb-2 font-medium">
            FROM RUPTO · A HEARTFELT LETTER
          </span>

          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#FFF9FF] mb-3">
            To My Best Friend, Bushra
          </h2>

          <p className="text-sm sm:text-base text-[#FFF9FF]/75 mb-8 italic font-light">
            "There's something I wanted you to know."
          </p>

          <button
            onClick={handleOpenLetter}
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#F5D58A] to-[#FFB6D9] text-[#10091F] font-semibold text-sm sm:text-base shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#831843]" />
            <span>OPEN MY LETTER</span>
          </button>
        </div>
      ) : (
        /* Letter Paper Layout */
        <div className="max-w-3xl w-full mx-auto bg-[#1A1238]/95 border border-[#A78BFA]/30 rounded-3xl p-6 sm:p-10 md:p-12 shadow-2xl backdrop-blur-xl animate-fade-in relative">
          {/* Header Bar inside Letter */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 mb-8 border-b border-[#A78BFA]/20 gap-3">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-[#F5D58A] font-medium block">
                PERSONAL LETTER · 27 OCTOBER 2026
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#FFF9FF]">
                To My Best Friend, Bushra
              </h2>
            </div>

            {!showFull && revealedIndex < LETTER_PARAGRAPHS.length && (
              <button
                onClick={() => setShowFull(true)}
                className="px-3.5 py-1.5 rounded-full border border-white/20 hover:border-white/40 text-xs text-[#FFF9FF]/80 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Show Full Letter</span>
              </button>
            )}
          </div>

          {/* Letter Body */}
          <div className="space-y-4 text-sm sm:text-base md:text-lg text-[#FFF9FF]/90 font-serif leading-relaxed max-h-[60vh] overflow-y-auto pr-3">
            {LETTER_PARAGRAPHS.map((p, idx) => {
              const isVisible = showFull || idx <= revealedIndex;
              if (!isVisible) return null;

              // Give emotional callout styling to key paragraphs
              const isCallout =
                p.startsWith('I hope we never become strangers') ||
                p.startsWith('I want to keep you as my best friend') ||
                p.startsWith('Thank you for being my best friend');

              return (
                <p
                  key={idx}
                  className={`transition-opacity duration-500 ${
                    isCallout
                      ? 'text-[#F5D58A] font-medium text-base sm:text-xl py-1 pl-4 border-l-2 border-[#F5D58A]/50 italic'
                      : 'text-[#FFF9FF]/85'
                  }`}
                >
                  {p}
                </p>
              );
            })}

            {/* Signature */}
            {(showFull || revealedIndex >= LETTER_PARAGRAPHS.length - 1) && (
              <div className="pt-8 mt-6 border-t border-white/10 text-right">
                <span className="text-sm font-sans uppercase tracking-widest text-[#A78BFA] block mb-1">
                  Always your best friend,
                </span>
                <span className="text-3xl sm:text-4xl font-serif italic font-bold text-[#F5D58A]">
                  Rupto
                </span>
              </div>
            )}
          </div>

          {/* Footer Controls */}
          <div className="mt-8 pt-6 border-t border-[#A78BFA]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-[#FFF9FF]/60 italic font-serif">
              "Real friendship is worth choosing, protecting, and taking care of."
            </span>

            <button
              onClick={onProceedToPromise}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#A78BFA] to-[#7C3AED] text-white text-xs sm:text-sm font-medium flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-[#7C3AED]/30"
            >
              <span>THE FRIENDSHIP PROMISE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
