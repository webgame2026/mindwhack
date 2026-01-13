class SoundService {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  setEnabled(val: boolean) {
    this.enabled = val;
  }

  private createOscillator(freq: number, type: OscillatorType = 'sine'): { osc: OscillatorNode, gain: GainNode } | null {
    if (!this.enabled) return null;
    const ctx = this.init();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.connect(gain);
    gain.connect(ctx.destination);
    return { osc, gain };
  }

  playClick() {
    const result = this.createOscillator(800, 'sine');
    if (!result) return;
    const { osc, gain } = result;
    const ctx = this.init();
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  }

  playWhack() {
    if (!this.enabled) return;
    const ctx = this.init();
    const core = this.createOscillator(400, 'sawtooth');
    if (core) {
      core.osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.35);
      core.gain.gain.setValueAtTime(0.4, ctx.currentTime);
      core.gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      core.osc.start();
      core.osc.stop(ctx.currentTime + 0.35);
    }
    const boom = this.createOscillator(100, 'sine');
    if (boom) {
      boom.gain.gain.setValueAtTime(0.6, ctx.currentTime);
      boom.gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      boom.osc.start();
      boom.osc.stop(ctx.currentTime + 0.5);
    }
  }

  playBeep(isHigh = false) {
    const result = this.createOscillator(isHigh ? 880 : 440, 'sine');
    if (!result) return;
    const { osc, gain } = result;
    const ctx = this.init();
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  }

  playGameStart() {
    if (!this.enabled) return;
    const ctx = this.init();
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, i) => {
      const result = this.createOscillator(freq, 'sine');
      if (!result) return;
      const { osc, gain } = result;
      const time = ctx.currentTime + i * 0.1;
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.1, time + 0.05);
      gain.gain.linearRampToValueAtTime(0, time + 0.2);
      osc.start(time);
      osc.stop(time + 0.2);
    });
  }

  playGameEnd(success: boolean) {
    if (!this.enabled) return;
    const ctx = this.init();
    if (success) {
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, i) => {
        const result = this.createOscillator(freq, 'triangle');
        if (!result) return;
        const { osc, gain } = result;
        const time = ctx.currentTime + i * 0.15;
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.1, time + 0.1);
        gain.gain.linearRampToValueAtTime(0, time + 0.5);
        osc.start(time);
        osc.stop(time + 0.5);
      });
    } else {
      const result = this.createOscillator(220, 'sawtooth');
      if (!result) return;
      const { osc, gain } = result;
      osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.5);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    }
  }
}

export const soundService = new SoundService();