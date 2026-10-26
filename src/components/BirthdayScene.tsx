import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Flame, Sparkles, ArrowRight, Music, Stars } from 'lucide-react';
import { soundEngine } from '../services/audio';

interface BirthdaySceneProps {
  candlesBlownOut: boolean;
  wishMade: boolean;
  wishText: string;
  onMakeWish: () => void;
  onRelightCandles: () => void;
  onProceedToMemories: () => void;
}

export const BirthdayScene: React.FC<BirthdaySceneProps> = ({
  candlesBlownOut,
  wishMade,
  wishText,
  onMakeWish,
  onRelightCandles,
  onProceedToMemories,
}) => {
  const [isPlayingSong, setIsPlayingSong] = useState<boolean>(() => soundEngine.isSongPlaying());

  // Mouse / Pointer motion values normalized from -1 to 1
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for luxurious, fluid inertia
  const springConfig = { damping: 28, stiffness: 120, mass: 0.6 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Deep Background Layer (Slowest, subtle drift & depth)
  const deepNebulaX = useTransform(smoothX, [-1, 1], [-25, 25]);
  const deepNebulaY = useTransform(smoothY, [-1, 1], [-25, 25]);
  const deepRotate = useTransform(smoothX, [-1, 1], [-4, 4]);

  // Mid Background Layer: 3D Orbital Rings & Astrological Geometry
  const midOrbitalX = useTransform(smoothX, [-1, 1], [-45, 45]);
  const midOrbitalY = useTransform(smoothY, [-1, 1], [-40, 40]);
  const midRotateX = useTransform(smoothY, [-1, 1], [14, -14]);
  const midRotateY = useTransform(smoothX, [-1, 1], [-16, 16]);
  const midScale = useTransform(smoothY, [-1, 1], [0.98, 1.02]);

  // Floating Stardust Bokeh Particles (Varied speeds & opposing depths)
  const bokeh1X = useTransform(smoothX, [-1, 1], [60, -60]);
  const bokeh1Y = useTransform(smoothY, [-1, 1], [50, -50]);
  const bokeh2X = useTransform(smoothX, [-1, 1], [-70, 70]);
  const bokeh2Y = useTransform(smoothY, [-1, 1], [-60, 60]);
  const bokeh3X = useTransform(smoothX, [-1, 1], [35, -35]);
  const bokeh3Y = useTransform(smoothY, [-1, 1], [-45, 45]);

  // Foreground 3D subtle tilt (Holographic card feel)
  const fgTiltX = useTransform(smoothY, [-1, 1], [5, -5]);
  const fgTiltY = useTransform(smoothX, [-1, 1], [-6, 6]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    mouseX.set(Math.max(-1, Math.min(1, x)));
    mouseY.set(Math.max(-1, Math.min(1, y)));
  };

  const handlePointerLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleToggleSong = () => {
    const playing = soundEngine.toggleBirthdaySong();
    setIsPlayingSong(playing);
  };

  const handleWish = () => {
    soundEngine.playCandleBlow();
    setTimeout(() => {
      soundEngine.playWishChime();
    }, 200);

    // Auto-play the Happy Birthday song on wish!
    setTimeout(() => {
      soundEngine.playHappyBirthdaySong();
      setIsPlayingSong(true);
    }, 600);

    // Launch celebratory confetti burst
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.65 },
      colors: ['#F5D58A', '#A78BFA', '#FFB6D9', '#FFFFFF'],
      disableForReducedMotion: true,
    });

    onMakeWish();
  };

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative min-h-screen flex flex-col items-center justify-between px-6 py-16 text-center z-10 overflow-hidden select-none"
      style={{ perspective: 1200 }}
    >
      {/* =========================================================================
          BACKGROUND 3D PARALLAX LAYERS (Pointer-events-none)
          ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        {/* Layer 1: Deep Atmospheric Glowing Nebulae */}
        <motion.div
          style={{ x: deepNebulaX, y: deepNebulaY, rotate: deepRotate }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {/* Top-Left Lavender Aurora */}
          <div className="absolute -top-16 -left-16 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-[#A78BFA]/18 blur-[90px] animate-pulse transition-all duration-1000" />
          
          {/* Bottom-Right Champagne Gold Bloom */}
          <div className="absolute -bottom-20 -right-20 w-88 sm:w-[420px] h-88 sm:h-[420px] rounded-full bg-[#F5D58A]/14 blur-[100px]" />
          
          {/* Center-Top Soft Rose Aura */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-72 sm:w-[500px] h-48 sm:h-[260px] rounded-full bg-[#FFB6D9]/12 blur-[80px]" />
        </motion.div>

        {/* Layer 2: Mid 3D Celestial Rings & Orbital Halo (3D Tilt & Parallax) */}
        <motion.div
          style={{
            x: midOrbitalX,
            y: midOrbitalY,
            rotateX: midRotateX,
            rotateY: midRotateY,
            scale: midScale,
            transformStyle: 'preserve-3d',
          }}
          className="absolute w-[360px] sm:w-[560px] md:w-[680px] h-[360px] sm:h-[560px] md:h-[680px] flex items-center justify-center"
        >
          {/* Outer Cosmic Milestone Orbit */}
          <div className="absolute inset-0 rounded-full border border-[#A78BFA]/20 border-dashed animate-[spin_120s_linear_infinite]" />
          
          {/* Concentric Golden Halo Ring */}
          <div className="absolute inset-8 sm:inset-12 rounded-full border border-[#F5D58A]/25 shadow-[0_0_50px_rgba(245,213,138,0.1)]" />

          {/* Inner Milestone Glow Circle with subtle 15th Chapter Runes */}
          <div className="absolute inset-20 sm:inset-28 rounded-full border border-[#FFB6D9]/15 flex items-center justify-center">
            {/* Subtle floating 15 celestial markers */}
            <div className="absolute top-0 -translate-y-1/2 px-2.5 py-0.5 rounded-full bg-[#1A1238]/80 border border-[#F5D58A]/30 text-[10px] font-mono tracking-widest text-[#F5D58A]/80 shadow-sm">
              CHAPTER XV
            </div>
            <div className="absolute bottom-0 translate-y-1/2 px-2.5 py-0.5 rounded-full bg-[#1A1238]/80 border border-[#A78BFA]/30 text-[10px] font-mono tracking-widest text-[#A78BFA]/80 shadow-sm">
              27 OCT
            </div>
          </div>

          {/* Subtle 3D Depth crosshairs */}
          <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-[#A78BFA]/20 to-transparent" />
          <div className="absolute h-full w-[1px] bg-gradient-to-b from-transparent via-[#A78BFA]/20 to-transparent" />
        </motion.div>

        {/* Layer 3: Floating Stardust Bokeh Particles & Star Motes (Near Parallax) */}
        <motion.div
          style={{ x: bokeh1X, y: bokeh1Y }}
          className="absolute top-[18%] left-[12%] sm:left-[20%]"
        >
          <div className="relative flex items-center justify-center">
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-[#A78BFA]/20 to-[#F5D58A]/30 blur-md animate-pulse" />
            <Stars className="w-4 h-4 text-[#F5D58A] absolute animate-spin" style={{ animationDuration: '14s' }} />
          </div>
        </motion.div>

        <motion.div
          style={{ x: bokeh2X, y: bokeh2Y }}
          className="absolute top-[28%] right-[10%] sm:right-[18%]"
        >
          <div className="relative flex items-center justify-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-bl from-[#FFB6D9]/25 to-[#A78BFA]/20 blur-md" />
            <Sparkles className="w-4 h-4 text-[#FFB6D9] absolute" />
          </div>
        </motion.div>

        <motion.div
          style={{ x: bokeh3X, y: bokeh3Y }}
          className="absolute bottom-[24%] left-[16%] sm:left-[22%]"
        >
          <div className="w-8 h-8 rounded-full bg-[#F5D58A]/20 blur-sm flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-[#FFF9FF] shadow-[0_0_10px_#FFF9FF]" />
          </div>
        </motion.div>

        <motion.div
          style={{ x: bokeh1X, y: bokeh2Y }}
          className="absolute bottom-[28%] right-[14%] sm:right-[20%]"
        >
          <div className="w-7 h-7 rounded-full bg-[#A78BFA]/25 blur-sm flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-[#A78BFA] shadow-[0_0_8px_#A78BFA]" />
          </div>
        </motion.div>
      </div>

      {/* =========================================================================
          FOREGROUND CONTENT WITH SUBTLE 3D TILT
          ========================================================================= */}
      
      {/* Top Birthday Typography */}
      <motion.div
        style={{
          rotateX: fgTiltX,
          rotateY: fgTiltY,
          transformStyle: 'preserve-3d',
        }}
        className="pt-8 max-w-3xl mx-auto flex flex-col items-center relative z-20"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1A1238]/70 border border-[#F5D58A]/30 mb-2 backdrop-blur-sm">
          <Sparkles className="w-3 h-3 text-[#F5D58A]" />
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#F5D58A] font-medium">
            27 OCTOBER 2026
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl md:text-3xl uppercase tracking-widest text-[#FFF9FF]/90 font-light mb-1">
          HAPPY BIRTHDAY
        </h2>

        <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#FFF9FF] via-[#FFB6D9] to-[#A78BFA] mb-3 drop-shadow-[0_10px_25px_rgba(167,139,250,0.3)]">
          BUSHRA
        </h1>

        <p className="text-sm sm:text-base md:text-lg tracking-widest uppercase text-[#A78BFA] font-medium mb-4">
          YOUR 15TH CHAPTER BEGINS.
        </p>

        {/* Happy Birthday Song Quick Play Button */}
        <button
          onClick={handleToggleSong}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs transition-all cursor-pointer ${
            isPlayingSong
              ? 'bg-[#F5D58A]/20 border-[#F5D58A] text-[#F5D58A] shadow-lg shadow-[#F5D58A]/10 scale-105'
              : 'bg-[#1A1238]/80 border-white/15 text-[#FFF9FF]/80 hover:border-[#F5D58A] hover:text-white'
          }`}
          title="Play Happy Birthday to You song"
        >
          <Music className={`w-3.5 h-3.5 ${isPlayingSong ? 'animate-bounce text-[#F5D58A]' : ''}`} />
          <span className="font-medium">
            {isPlayingSong ? 'Happy Birthday Song Playing 🎶' : 'Play "Happy Birthday to You" Song 🎵'}
          </span>
        </button>
      </motion.div>

      {/* Middle/Bottom Interactive Controls */}
      <motion.div
        style={{
          rotateX: fgTiltX,
          rotateY: fgTiltY,
          transformStyle: 'preserve-3d',
        }}
        className="pb-12 max-w-xl mx-auto w-full flex flex-col items-center relative z-20"
      >
        {wishMade ? (
          <div className="bg-[#1A1238]/90 border border-[#A78BFA]/30 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-2xl mb-6 text-center animate-fade-in w-full transition-all">
            <div className="flex items-center justify-center gap-3.5 mb-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-[#F5D58A] shadow-lg shadow-[#F5D58A]/30 shrink-0">
                <img
                  src="/assets/aistudio/WhatsApp_Image_2026-10-26_at_5.57.00_PM_31b69e3e.jpeg"
                  alt="Bushra"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="text-left">
                <span className="text-xs uppercase tracking-widest text-[#F5D58A] block font-medium">
                  Bushra · 15th Birthday
                </span>
                <span className="text-xs text-[#FFF9FF]/70 block font-light">
                  Celebrating 15 years · Best friends forever
                </span>
              </div>
            </div>
            <p className="text-base sm:text-lg text-[#FFF9FF] leading-relaxed font-serif italic mb-6">
              "{wishText}"
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={onRelightCandles}
                className="px-4 py-2 rounded-full border border-[#FFF9FF]/20 text-xs text-[#FFF9FF]/80 hover:text-white hover:border-[#FFF9FF]/40 transition-colors cursor-pointer"
              >
                Relight Candles &amp; Wish Again
              </button>
              <button
                onClick={onProceedToMemories}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#A78BFA] to-[#7C3AED] text-white text-xs sm:text-sm font-medium flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-[#7C3AED]/30"
              >
                <span>OUR LITTLE UNIVERSE</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={handleWish}
              className="group px-8 py-3.5 rounded-full bg-gradient-to-r from-[#F5D58A] via-[#FFB6D9] to-[#A78BFA] text-[#10091F] font-semibold text-sm sm:text-base shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2 cursor-pointer"
            >
              <Flame className="w-4 h-4 text-[#E65100] group-hover:scale-110 transition-transform" />
              <span>MAKE A WISH</span>
            </button>
            <span className="text-xs text-[#FFF9FF]/60 tracking-wider">
              Blow out the 15 candles on the cake to make your birthday wish
            </span>
          </div>
        )}
      </motion.div>
    </div>
  );
};
