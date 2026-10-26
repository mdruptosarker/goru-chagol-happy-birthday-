import React, { useState } from 'react';
import { PhotoMemory } from '../types';
import { X, Sparkles, ChevronRight, ChevronLeft, Heart, Star, Sliders, Maximize2 } from 'lucide-react';
import { soundEngine } from '../services/audio';

interface MemoryGalleryProps {
  photos: PhotoMemory[];
  onOpenCustomizer: () => void;
  onProceedToTimeline: () => void;
}

export const MemoryGallery: React.FC<MemoryGalleryProps> = ({
  photos,
  onOpenCustomizer,
  onProceedToTimeline,
}) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  // Focus specifically on the 2 special memories
  const displayPhotos = photos.slice(0, 2);

  const handleOpenPhoto = (index: number) => {
    soundEngine.playShimmer();
    setSelectedPhotoIndex(index);
  };

  const selectedPhoto = selectedPhotoIndex !== null ? displayPhotos[selectedPhotoIndex] : null;

  return (
    <div className="relative min-h-screen py-16 sm:py-20 px-4 sm:px-6 md:px-8 z-10 max-w-6xl mx-auto flex flex-col justify-between">
      {/* Section Header */}
      <div className="text-center mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F5D58A]/10 border border-[#F5D58A]/30 text-xs uppercase tracking-[0.25em] text-[#F5D58A] mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>TIMELESS MEMORIES · 27 OCTOBER</span>
        </div>
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-[#FFF9FF] tracking-tight mb-3">
          Our Little Universe
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-[#FFF9FF]/75 max-w-2xl mx-auto italic font-serif leading-relaxed">
          "A birthday is one day. A real friendship is something you hope to keep for a lifetime."
        </p>
      </div>

      {/* Cinematic Dual Photo Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-stretch mb-12">
        {displayPhotos.map((photo, index) => (
          <div
            key={photo.id || index}
            onClick={() => handleOpenPhoto(index)}
            className="group relative cursor-pointer rounded-3xl overflow-hidden border border-[#A78BFA]/30 hover:border-[#F5D58A]/70 bg-gradient-to-b from-[#1E143E]/90 to-[#120B27]/95 shadow-2xl transition-all duration-500 hover:scale-[1.015] hover:shadow-[#7C3AED]/20 flex flex-col justify-between"
          >
            {/* Top Frame Bar */}
            <div className="p-4 sm:p-5 flex items-center justify-between border-b border-white/10 bg-black/20">
              <span className="text-xs font-mono tracking-widest text-[#F5D58A] uppercase font-medium">
                {index === 0 ? 'MEMOIR 01 · RADIANT SPIRIT' : 'MEMOIR 02 · GENTLE CHAPTERS'}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-[#FFF9FF]/60 group-hover:text-[#F5D58A] transition-colors">
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Enlarge</span>
              </div>
            </div>

            {/* Photo Container with cinematic styling */}
            <div className="relative w-full aspect-[3/4] max-h-[500px] overflow-hidden bg-[#0A0514] flex items-center justify-center p-3 sm:p-4">
              <div className="w-full h-full relative rounded-2xl overflow-hidden border border-white/10 shadow-inner">
                {photo.url ? (
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#1A1238]">
                    <Heart className="w-8 h-8 text-[#FFB6D9]/50 mb-2" />
                    <span className="text-xs text-[#FFF9FF]/50">Memory Slot</span>
                  </div>
                )}
                {/* Gentle vignette scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />

                {/* Floating caption chip on image */}
                <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-[#10091F]/80 backdrop-blur-md border border-white/15">
                  <span className="text-xs uppercase tracking-wider text-[#A78BFA] font-medium block mb-0.5">
                    {index === 0 ? 'October 27, 2011' : 'Cherished Memory'}
                  </span>
                  <h3 className="text-sm sm:text-base font-serif font-bold text-[#FFF9FF] truncate">
                    {photo.caption}
                  </h3>
                </div>
              </div>
            </div>

            {/* Bottom Note Bar */}
            <div className="p-5 sm:p-6 bg-black/30 border-t border-white/10">
              <p className="text-xs sm:text-sm text-[#FFF9FF]/85 font-light leading-relaxed">
                {photo.friendshipNote}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Quote Banner */}
      <div className="mb-10 p-5 sm:p-6 rounded-2xl bg-[#1A1238]/60 border border-[#A78BFA]/20 text-center backdrop-blur-sm">
        <p className="text-xs sm:text-sm text-[#F5D58A] font-serif italic max-w-xl mx-auto">
          "No matter how much life changes or where our paths lead, I hope our friendship stays as strong, genuine, and joyful as it is today — through every year ahead."
        </p>
      </div>

      {/* Bottom Navigation CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#A78BFA]/20">
        <div className="flex items-center gap-2 text-xs text-[#FFF9FF]/70">
          <Heart className="w-3.5 h-3.5 text-[#FFB6D9] fill-[#FFB6D9]/40" />
          <span>Curated with lifelong care by Rupto</span>
        </div>

        <button
          onClick={onProceedToTimeline}
          className="w-full sm:w-auto px-7 py-3 rounded-full bg-gradient-to-r from-[#A78BFA] to-[#7C3AED] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-[#7C3AED]/30"
        >
          <span>OUR FRIENDSHIP CHAPTERS</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Expanded Cinematic Spotlight Modal */}
      {selectedPhoto && selectedPhotoIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl animate-fade-in">
          <div className="relative max-w-3xl w-full max-h-[92vh] bg-[#170E30] border border-[#F5D58A]/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-[#120B27]">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-[#F5D58A] fill-[#F5D58A]" />
                <span className="text-xs uppercase tracking-widest text-[#F5D58A] font-medium">
                  {selectedPhotoIndex === 0 ? 'MEMOIR 01 OF 02' : 'MEMOIR 02 OF 02'}
                </span>
              </div>
              <button
                onClick={() => setSelectedPhotoIndex(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Image Preview with Next/Prev Arrows */}
            <div className="relative grow bg-[#0A0514] flex items-center justify-center overflow-hidden p-3 min-h-[340px] sm:min-h-[460px]">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.caption}
                referrerPolicy="no-referrer"
                className="max-h-[58vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
              />

              {/* Prev Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPhotoIndex(selectedPhotoIndex === 0 ? displayPhotos.length - 1 : selectedPhotoIndex - 1);
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Next Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPhotoIndex(selectedPhotoIndex === displayPhotos.length - 1 ? 0 : selectedPhotoIndex + 1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Footer Description */}
            <div className="p-5 sm:p-6 bg-[#170E30] border-t border-white/10">
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#FFF9FF] mb-2">
                {selectedPhoto.caption}
              </h3>
              <p className="text-xs sm:text-sm text-[#FFF9FF]/80 font-light leading-relaxed mb-4">
                {selectedPhoto.friendshipNote}
              </p>
              <div className="flex items-center justify-between text-xs text-[#A78BFA] pt-3 border-t border-white/10">
                <span>Dedicated to Bushra by her best friend, Rupto</span>
                <span className="text-[#F5D58A] italic font-serif">A Lifetime Friendship</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
