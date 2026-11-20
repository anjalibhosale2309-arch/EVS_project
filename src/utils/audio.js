// Web Audio API Synthesizer - 100% client-side sound effects without external audio files

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.pumpOsc = null;
    this.pumpGain = null;
    this.waterNoise = null;
    this.waterGain = null;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (muted) {
      this.stopPumpSound();
    }
  }

  // Play a quick pleasant notification chime
  playBeep(freq = 600, duration = 0.12, type = 'sine') {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio context might be restricted before user gesture
    }
  }

  // Warning alarm sound
  playAlert() {
    if (this.isMuted) return;
    this.playBeep(880, 0.15, 'square');
    setTimeout(() => {
      this.playBeep(660, 0.2, 'square');
    }, 180);
  }

  // Success chime
  playSuccess() {
    if (this.isMuted) return;
    this.playBeep(523.25, 0.1, 'sine'); // C5
    setTimeout(() => this.playBeep(659.25, 0.1, 'sine'), 100); // E5
    setTimeout(() => this.playBeep(783.99, 0.18, 'sine'), 200); // G5
  }

  // Continuous subtle pump hum and water flow sound
  startPumpSound() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      if (this.pumpOsc) return; // already playing

      // Low frequency motor hum
      this.pumpOsc = this.ctx.createOscillator();
      this.pumpGain = this.ctx.createGain();
      this.pumpOsc.type = 'triangle';
      this.pumpOsc.frequency.setValueAtTime(75, this.ctx.currentTime);
      this.pumpGain.gain.setValueAtTime(0.02, this.ctx.currentTime);

      this.pumpOsc.connect(this.pumpGain);
      this.pumpGain.connect(this.ctx.destination);
      this.pumpOsc.start();
    } catch {
      // safe fallback
    }
  }

  stopPumpSound() {
    try {
      if (this.pumpOsc) {
        this.pumpOsc.stop();
        this.pumpOsc.disconnect();
        this.pumpOsc = null;
      }
    } catch {
      this.pumpOsc = null;
    }
  }
}

export const sound = new SoundEngine();
