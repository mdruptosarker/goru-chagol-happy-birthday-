import React, { useState } from 'react';
import { SceneId } from '../types';
import { Volume2, VolumeX, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface NavigationProps {
  currentScene: SceneId;
  onSelectScene: (scene: SceneId) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenCustomizer?: () => void;
}

const SCENE_ORDER: { id: SceneId; label: string }[] = [
  { id: 'opening', label: 'Universe' },
  { id: 'birthday', label: '15th Birthday' },
  { id: 'memories', label: 'Our Memories' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'letter', label: 'The Letter' },
  { id: 'promise', label: 'Friendship Promise' },
  { id: 'celebration', label: 'Celebration' },
];

export const Navigation: React.FC<NavigationProps> = ({
  currentScene,
  onSelectScene,
  isMuted,
  onToggleMute,
  onOpenCustomizer,
}) => {
  const [isDockCollapsed, setIsDockCollapsed] = useState(false);

  const currentIndex = SCENE_ORDER.findIndex((s) => s.id === currentScene);

  const handlePrev = () => {
    if (currentIndex > 0) {
      onSelectScene(SCENE_ORDER[currentIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (currentIndex < SCENE_ORDER.length - 1) {
      onSelectScene(SCENE_ORDER[currentIndex + 1].id);
    }
  };

  return (
    <>
      {/* Top Bar Contract: 3 Zones: Brand — Nav Links — 1 Primary Action */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#10091F]/75 backdrop-blur-md border-b border-[#A78BFA]/15 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-8 transition-all">
        {/* Zone 1: Single text wordmark */}
        <button
          onClick={() => onSelectScene('opening')}
          className="text-lg font-serif font-bold tracking-tight text-[#FFF9FF] hover:text-[#F5D58A] transition-colors whitespace-nowrap shrink-0 cursor-pointer text-left"
        >
          Bushra <span className="font-sans font-light text-xs text-[#A78BFA] tracking-widest ml-1">CHAPTER 15</span>
        </button>

        {/* Zone 2: Nav Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-[#FFF9FF]/70">
          {SCENE_ORDER.map((scene) => (
            <button
              key={scene.id}
              onClick={() => onSelectScene(scene.id)}
              className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                currentScene === scene.id
                  ? 'text-[#F5D58A] font-semibold border-b border-[#F5D58A] pb-0.5'
                  : 'hover:text-[#FFF9FF]'
              }`}
            >
              {scene.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: Dedication Badge */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1A1238] border border-[#F5D58A]/30 text-xs text-[#F5D58A] whitespace-nowrap shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-[#F5D58A]" />
          <span className="font-medium tracking-wide">From Rupto</span>
        </div>
      </header>

      {/* Collapsible Bottom Control Dock (Consolidated controls, zero viewport occlusion) */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center pointer-events-auto max-w-[min(920px,94vw)] w-full">
        {/* Toggle Collapse Pill */}
        <button
          onClick={() => setIsDockCollapsed(!isDockCollapsed)}
          className="mb-1.5 px-3 py-1 rounded-full bg-[#10091F]/90 border border-white/10 text-[11px] text-[#FFF9FF]/60 hover:text-white flex items-center gap-1 backdrop-blur-md shadow-lg transition-all cursor-pointer"
        >
          {isDockCollapsed ? (
            <>
              <ChevronUp className="w-3 h-3" />
              <span>Show Navigation Dock</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3 h-3" />
              <span>Cinema Mode (Hide Dock)</span>
            </>
          )}
        </button>

        {/* Main Dock Container */}
        {!isDockCollapsed && (
          <div className="w-full bg-[#140D2B]/90 border border-[#A78BFA]/30 rounded-2xl p-2.5 sm:px-4 sm:py-3 backdrop-blur-xl shadow-2xl flex items-center justify-between gap-3 text-xs text-[#FFF9FF]">
            {/* Audio Toggle */}
            <button
              onClick={onToggleMute}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer shrink-0 ${
                !isMuted
                  ? 'bg-[#F5D58A]/20 border-[#F5D58A] text-[#F5D58A]'
                  : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
              }`}
              title={isMuted ? 'Play Happy Birthday song' : 'Mute music'}
            >
              {!isMuted ? <Volume2 className="w-4 h-4 text-[#F5D58A]" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline">{!isMuted ? 'Song Playing 🎶' : 'Song Muted'}</span>
            </button>

            {/* Scene Stepper Indicator */}
            <div className="flex items-center gap-1 sm:gap-2 grow justify-center overflow-x-auto px-2">
              {SCENE_ORDER.map((scene, idx) => (
                <button
                  key={scene.id}
                  onClick={() => onSelectScene(scene.id)}
                  title={scene.label}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    currentScene === scene.id
                      ? 'w-6 sm:w-8 bg-[#F5D58A]'
                      : 'w-2 sm:w-2.5 bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
              <span className="text-[11px] text-[#FFF9FF]/60 whitespace-nowrap ml-2 hidden md:inline">
                {SCENE_ORDER[currentIndex]?.label}
              </span>
            </div>

            {/* Prev / Next Arrows */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 disabled:opacity-20 flex items-center justify-center transition-colors cursor-pointer"
                title="Previous Scene"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex === SCENE_ORDER.length - 1}
                className="w-8 h-8 rounded-xl bg-gradient-to-r from-[#A78BFA] to-[#7C3AED] hover:opacity-90 disabled:opacity-20 flex items-center justify-center transition-colors cursor-pointer text-white"
                title="Next Scene"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
