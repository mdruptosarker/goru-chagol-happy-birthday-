/**
 * Procedural Web Audio API sound generator.
 * Provides authentic, sweet music-box / celeste rendition of "Happy Birthday to You"
 * plus ambient celestial music and celebratory sound effects with zero external 404 risk.
 */

// Musical notes frequencies (Hz)
const NOTE = {
  C3: 130.81,
  E3: 164.81,
  F3: 174.61,
  G3: 196.0,
  A3: 220.0,
  Bb3: 233.08,
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.0,
  A4: 440.0,
  Bb4: 466.16,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  F5: 698.46,
  G5: 783.99,
  A5: 880.0,
};

// "Happy Birthday to You" melody notes and beat durations (in beats)
interface MelodyNote {
  note: number;
  duration: number; // in beats (1 beat = 0.5s at 120 BPM)
  chord?: number[]; // optional warm accompaniment chord
}

const HAPPY_BIRTHDAY_SCORE: MelodyNote[] = [
  // Phrase 1: "Happy Birthday to You"
  { note: NOTE.C4, duration: 0.75, chord: [NOTE.F3, NOTE.A3, NOTE.C4] },
  { note: NOTE.C4, duration: 0.25 },
  { note: NOTE.D4, duration: 1.0 },
  { note: NOTE.C4, duration: 1.0 },
  { note: NOTE.F4, duration: 1.0 },
  { note: NOTE.E4, duration: 2.0, chord: [NOTE.C3, NOTE.E3, NOTE.G3] },

  // Phrase 2: "Happy Birthday to You"
  { note: NOTE.C4, duration: 0.75 },
  { note: NOTE.C4, duration: 0.25 },
  { note: NOTE.D4, duration: 1.0 },
  { note: NOTE.C4, duration: 1.0 },
  { note: NOTE.G4, duration: 1.0 },
  { note: NOTE.F4, duration: 2.0, chord: [NOTE.F3, NOTE.A3, NOTE.C4] },

  // Phrase 3: "Happy Birthday dear Bushra"
  { note: NOTE.C4, duration: 0.75 },
  { note: NOTE.C4, duration: 0.25 },
  { note: NOTE.C5, duration: 1.0, chord: [NOTE.F3, NOTE.A3, NOTE.C4] },
  { note: NOTE.A4, duration: 1.0 },
  { note: NOTE.F4, duration: 1.0, chord: [NOTE.Bb3, NOTE.D4, NOTE.F4] },
  { note: NOTE.E4, duration: 1.0 },
  { note: NOTE.D4, duration: 2.0 },

  // Phrase 4: "Happy Birthday to You!"
  { note: NOTE.Bb4, duration: 0.75, chord: [NOTE.Bb3, NOTE.D4, NOTE.F4] },
  { note: NOTE.Bb4, duration: 0.25 },
  { note: NOTE.A4, duration: 1.0 },
  { note: NOTE.F4, duration: 1.0, chord: [NOTE.C3, NOTE.E3, NOTE.G3] },
  { note: NOTE.G4, duration: 1.0 },
  { note: NOTE.F4, duration: 2.5, chord: [NOTE.F3, NOTE.A3, NOTE.C4] },
];

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;
  private songTimeouts: number[] = [];
  private isSongPlayingState: boolean = false;
  private ambientInterval: number | null = null;

  public initContext() {
    if (!this.ctx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.24, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public setIsMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopHappyBirthdaySong();
      this.stopAmbientMusic();
    }
  }

  public isSongPlaying(): boolean {
    return this.isSongPlayingState;
  }

  public async ensureAudioStarted(): Promise<boolean> {
    try {
      this.initContext();
      this.isMuted = false;
      if (this.ctx && this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }
      if (!this.isSongPlayingState) {
        this.playHappyBirthdaySong();
      }
      return true;
    } catch {
      return false;
    }
  }

  public toggleMute(): boolean {
    if (this.isMuted) {
      this.initContext();
      this.isMuted = false;
      this.playHappyBirthdaySong();
    } else {
      this.isMuted = true;
      this.stopHappyBirthdaySong();
      this.stopAmbientMusic();
    }
    return !this.isMuted;
  }

  /**
   * Plays a single sweet music-box bell tone
   */
  private playBellNote(freq: number, startTime: number, durationSec: number, volume = 0.08) {
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    // Fundamental oscillator (celeste bell timbre)
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, startTime);

    // Soft chime overtone (2nd harmonic)
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, startTime);

    // Exponential bell envelope
    gain1.gain.setValueAtTime(0.0001, startTime);
    gain1.gain.exponentialRampToValueAtTime(volume, startTime + 0.03);
    gain1.gain.exponentialRampToValueAtTime(0.0001, startTime + durationSec * 1.4);

    gain2.gain.setValueAtTime(0.0001, startTime);
    gain2.gain.exponentialRampToValueAtTime(volume * 0.45, startTime + 0.02);
    gain2.gain.exponentialRampToValueAtTime(0.0001, startTime + durationSec * 0.9);

    osc1.connect(gain1);
    osc2.connect(gain2);
    gain1.connect(this.masterGain);
    gain2.connect(this.masterGain);

    osc1.start(startTime);
    osc2.start(startTime);
    osc1.stop(startTime + durationSec * 1.5);
    osc2.stop(startTime + durationSec * 1.0);
  }

  /**
   * Plays the complete "Happy Birthday to You" melody
   */
  public playHappyBirthdaySong() {
    this.initContext();
    this.isMuted = false;
    this.stopHappyBirthdaySong();
    this.stopAmbientMusic();

    if (!this.ctx || !this.masterGain) return;
    this.isSongPlayingState = true;

    const beatDuration = 0.52; // 115 BPM: comfortable, festive, heartwarming tempo
    let scheduleOffset = 0.1; // start slightly ahead for smooth web audio scheduling

    HAPPY_BIRTHDAY_SCORE.forEach((item) => {
      const noteDurationSec = item.duration * beatDuration;
      const t = this.ctx!.currentTime + scheduleOffset;

      // Play main melody note
      this.playBellNote(item.note, t, noteDurationSec, 0.12);

      // Play warm accompaniment chord if present
      if (item.chord) {
        item.chord.forEach((chordFreq, cIdx) => {
          this.playBellNote(chordFreq, t + cIdx * 0.04, noteDurationSec * 1.8, 0.045);
        });
      }

      scheduleOffset += noteDurationSec;
    });

    // Schedule loop after song finishes
    const totalDurationMs = scheduleOffset * 1000 + 2500;
    const loopTimeout = window.setTimeout(() => {
      if (this.isSongPlayingState && !this.isMuted) {
        this.playHappyBirthdaySong();
      }
    }, totalDurationMs);

    this.songTimeouts.push(loopTimeout);
  }

  public stopHappyBirthdaySong() {
    this.isSongPlayingState = false;
    this.songTimeouts.forEach((tid) => window.clearTimeout(tid));
    this.songTimeouts = [];
  }

  public toggleBirthdaySong(): boolean {
    if (this.isSongPlayingState) {
      this.stopHappyBirthdaySong();
      return false;
    } else {
      this.playHappyBirthdaySong();
      return true;
    }
  }

  public startAmbientMusic() {
    if (this.isMuted || this.ambientInterval !== null) return;
    this.initContext();

    const notes = [293.66, 369.99, 440.0, 493.88, 554.37, 659.25, 739.99, 880.0];
    let step = 0;

    const playChordStep = () => {
      if (this.isMuted || !this.ctx || !this.masterGain || this.isSongPlayingState) return;
      const t = this.ctx.currentTime;
      const note1 = notes[step % notes.length];
      const note2 = notes[(step + 2) % notes.length];

      [note1, note2].forEach((freq, idx) => {
        this.playBellNote(freq, t + idx * 0.18, 3.0, 0.035);
      });
      step++;
    };

    playChordStep();
    this.ambientInterval = window.setInterval(playChordStep, 3500);
  }

  public stopAmbientMusic() {
    if (this.ambientInterval !== null) {
      window.clearInterval(this.ambientInterval);
      this.ambientInterval = null;
    }
  }

  public playWishChime() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const chord = [NOTE.C4, NOTE.E4, NOTE.G4, NOTE.B4, NOTE.D5, NOTE.G5];
    chord.forEach((freq, i) => {
      const t = this.ctx!.currentTime + i * 0.07;
      this.playBellNote(freq, t, 2.2, 0.08);
    });
  }

  public playShimmer() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, t);
    osc.frequency.exponentialRampToValueAtTime(880, t + 0.35);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.exponentialRampToValueAtTime(0.05, t + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.55);
  }

  public playCandleBlow() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const bufferSize = this.ctx.sampleRate * 0.5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.15));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(500, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.45);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.45);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start();
  }
}

export const soundEngine = new SoundEngine();
