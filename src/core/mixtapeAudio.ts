const CHORD_SETS: Record<string, number[]> = {
  'song-1': [220, 277.18, 329.63, 415.3],
  'song-2': [196, 246.94, 293.66, 369.99],
  'song-3': [261.63, 329.63, 392, 493.88],
  'song-4': [174.61, 220, 261.63, 329.63],
};

class MixtapeAudioEngine {
  private ctx: AudioContext | null = null;
  private oscs: OscillatorNode[] = [];
  private gain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private currentSongId: string | null = null;
  private isPlaying = false;

  sync(songId: string | null, shouldPlay: boolean) {
    if (!shouldPlay || !songId) {
      this.stop();
      return;
    }
    if (this.isPlaying && this.currentSongId === songId && this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => undefined);
      }
      return;
    }

    this.stop();
    this.currentSongId = songId;
    this.isPlaying = true;

    try {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;

      const ctx = new AC();
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => undefined);
      }

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 540;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;

      const gain = ctx.createGain();
      gain.gain.value = 0.001;
      gain.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + 0.6);

      filter.connect(analyser).connect(gain).connect(ctx.destination);

      const freqs = CHORD_SETS[songId] ?? [220, 277.18, 329.63, 415.3];
      const oscs = freqs.map((f, idx) => {
        const osc = ctx.createOscillator();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.value = f;
        osc.detune.value = (idx - 1.5) * 4;
        osc.connect(filter);
        osc.start();
        return osc;
      });

      this.ctx = ctx;
      this.oscs = oscs;
      this.gain = gain;
      this.analyser = analyser;
    } catch {
      // Browser autoplay policy blocked AudioContext; UI calm wave animation continues gracefully
    }
  }

  stop() {
    this.isPlaying = false;
    this.currentSongId = null;
    if (!this.ctx) return;

    const ctxRef = this.ctx;
    const oscsRef = this.oscs;
    const gainRef = this.gain;

    this.ctx = null;
    this.oscs = [];
    this.gain = null;
    this.analyser = null;

    try {
      if (gainRef) {
        gainRef.gain.setTargetAtTime(0.0001, ctxRef.currentTime, 0.08);
      }
      window.setTimeout(() => {
        try {
          oscsRef.forEach((o) => o.stop());
          ctxRef.close();
        } catch {
          // ignore cleanup errors
        }
      }, 180);
    } catch {
      // ignore
    }
  }

  /**
   * Generates smooth, calm wave column heights (percentage 18..88) flowing continuously like water.
   */
  getCalmWaveHeights(count: number, timeMs: number, active: boolean): number[] {
    if (!active) {
      return Array.from({ length: count }, (_, i) => {
        const base = Math.sin(i * 0.35 + 0.5) * 0.5 + 0.5;
        return Math.round(20 + base * 22);
      });
    }

    const t = timeMs * 0.0022;
    return Array.from({ length: count }, (_, i) => {
      const primaryWave = Math.sin(t - i * 0.25) * 0.5 + 0.5;
      const secondarySwell = Math.sin(t * 0.58 + i * 0.13) * 0.5 + 0.5;
      const heightPct = 18 + primaryWave * 40 + secondarySwell * 24;
      return Math.min(86, Math.max(18, Math.round(heightPct)));
    });
  }
}

export const mixtapeAudio = new MixtapeAudioEngine();
