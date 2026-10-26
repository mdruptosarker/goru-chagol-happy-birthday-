/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SceneId, ExperienceConfig } from './types';
import { loadConfig, saveConfig, resetConfig } from './services/storage';
import { soundEngine } from './services/audio';
import { ThreeCanvas } from './components/ThreeCanvas';
import { Navigation } from './components/Navigation';
import { OpeningScene } from './components/OpeningScene';
import { BirthdayScene } from './components/BirthdayScene';
import { MemoryGallery } from './components/MemoryGallery';
import { TimelineSection } from './components/TimelineSection';
import { LetterScene } from './components/LetterScene';
import { PromiseScene } from './components/PromiseScene';
import { CelebrationScene } from './components/CelebrationScene';
import { IntroSplash } from './components/IntroSplash';

export default function App() {
  const [config, setConfig] = useState<ExperienceConfig>(() => loadConfig());
  const [currentScene, setCurrentScene] = useState<SceneId>('opening');
  const [showIntroSplash, setShowIntroSplash] = useState<boolean>(true);
  const [candlesBlownOut, setCandlesBlownOut] = useState<boolean>(false);
  const [wishMade, setWishMade] = useState<boolean>(false);
  const [wishTriggeredCount, setWishTriggeredCount] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Trigger automatic birthday song playback on app startup
  useEffect(() => {
    // Attempt playback immediately
    soundEngine.ensureAudioStarted().then(() => {
      setIsMuted(soundEngine.getIsMuted());
    });

    // Handle browser autoplay policy by unmuting on first interaction if blocked
    const unlockAudio = () => {
      soundEngine.ensureAudioStarted();
      setIsMuted(false);
      ['pointerdown', 'touchstart', 'click', 'keydown'].forEach((evt) => {
        window.removeEventListener(evt, unlockAudio);
      });
    };

    ['pointerdown', 'touchstart', 'click', 'keydown'].forEach((evt) => {
      window.addEventListener(evt, unlockAudio, { passive: true });
    });

    return () => {
      ['pointerdown', 'touchstart', 'click', 'keydown'].forEach((evt) => {
        window.removeEventListener(evt, unlockAudio);
      });
    };
  }, []);

  const handleToggleMute = () => {
    const unmuted = soundEngine.toggleMute();
    setIsMuted(!unmuted);
  };

  const handleEnterUniverse = () => {
    soundEngine.playShimmer();
    soundEngine.playHappyBirthdaySong();
    setIsMuted(false);
    setCurrentScene('birthday');
  };

  const handleSkipIntro = () => {
    soundEngine.playHappyBirthdaySong();
    setIsMuted(false);
    setCurrentScene('birthday');
  };

  const handleMakeWish = () => {
    setCandlesBlownOut(true);
    setWishMade(true);
    setWishTriggeredCount((prev) => prev + 1);
  };

  const handleRelightCandles = () => {
    setCandlesBlownOut(false);
    setWishMade(false);
  };

  const handleTriggerHeartPulse = () => {
    setWishTriggeredCount((prev) => prev + 1);
  };

  const handleReplay = () => {
    setCandlesBlownOut(false);
    setWishMade(false);
    setCurrentScene('opening');
    setShowIntroSplash(true);
    soundEngine.playHappyBirthdaySong();
    setIsMuted(false);
  };

  return (
    <div className="relative min-h-screen bg-[#10091F] text-[#FFF9FF] font-sans overflow-x-hidden">
      {/* Cinematic Floating Intro Splash: Happy Birthday Ezma */}
      {showIntroSplash && (
        <IntroSplash onComplete={() => setShowIntroSplash(false)} />
      )}

      {/* 3D / 2D Cinematic Canvas */}
      <ThreeCanvas
        currentScene={currentScene}
        candlesBlownOut={candlesBlownOut}
        wishTriggeredCount={wishTriggeredCount}
      />

      {/* Navigation Bars: Fixed Top Bar & Collapsible Bottom Dock */}
      <Navigation
        currentScene={currentScene}
        onSelectScene={setCurrentScene}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* Active Scene Overlay */}
      <main className="relative z-10 min-h-screen flex flex-col justify-center">
        {currentScene === 'opening' && (
          <OpeningScene
            onEnter={handleEnterUniverse}
            onSkipIntro={handleSkipIntro}
          />
        )}

        {currentScene === 'birthday' && (
          <BirthdayScene
            candlesBlownOut={candlesBlownOut}
            wishMade={wishMade}
            wishText={config.customWishText}
            onMakeWish={handleMakeWish}
            onRelightCandles={handleRelightCandles}
            onProceedToMemories={() => setCurrentScene('memories')}
          />
        )}

        {currentScene === 'memories' && (
          <MemoryGallery
            photos={config.photos}
            onOpenCustomizer={() => {}}
            onProceedToTimeline={() => setCurrentScene('timeline')}
          />
        )}

        {currentScene === 'timeline' && (
          <TimelineSection
            onProceedToLetter={() => setCurrentScene('letter')}
          />
        )}

        {currentScene === 'letter' && (
          <LetterScene
            signature={config.signature}
            onProceedToPromise={() => setCurrentScene('promise')}
          />
        )}

        {currentScene === 'promise' && (
          <PromiseScene
            signature={config.signature}
            onTriggerHeartPulse={handleTriggerHeartPulse}
            onProceedToCelebration={() => setCurrentScene('celebration')}
          />
        )}

        {currentScene === 'celebration' && (
          <CelebrationScene
            onReplay={handleReplay}
            onGoToMemories={() => setCurrentScene('memories')}
            onGoToLetter={() => setCurrentScene('letter')}
            onOpenCustomizer={() => {}}
          />
        )}
      </main>
    </div>
  );
}
