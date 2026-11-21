// Tidepool Twins — sounds made with the Web Audio API, no audio files.
// A bright chime for a find, a dull buzz for a miss, an arpeggio for a win.

export class SoundFX {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  ensure() {
    try {
      if (!this.ctx) {
        const Ctor = window.AudioContext || window.webkitAudioContext;
        if (!Ctor) return false;
        this.ctx = new Ctor();
      }
      if (this.ctx.state === 'suspended') void this.ctx.resume();
      return true;
    } catch (err) {
      return false;
    }
  }

  tone(freq, dur, type, gain, delay) {
    if (!this.enabled || !this.ensure()) return;
    const when = this.ctx.currentTime + (delay || 0);
    const osc = this.ctx.createOscillator();
    const amp = this.ctx.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, when);
    amp.gain.setValueAtTime(0.0001, when);
    amp.gain.exponentialRampToValueAtTime(gain || 0.12, when + 0.015);
    amp.gain.exponentialRampToValueAtTime(0.0001, when + dur);
    osc.connect(amp);
    amp.connect(this.ctx.destination);
    osc.start(when);
    osc.stop(when + dur + 0.05);
  }

  click() {
    this.tone(620, 0.06, 'triangle', 0.07);
  }

  chime() {
    this.tone(880, 0.14, 'sine', 0.14);
    this.tone(1318.5, 0.22, 'sine', 0.12, 0.07);
    this.tone(1760, 0.2, 'sine', 0.07, 0.14);
  }

  buzz() {
    this.tone(140, 0.2, 'sawtooth', 0.1);
    this.tone(110, 0.22, 'sawtooth', 0.08, 0.02);
  }

  hint() {
    this.tone(1046.5, 0.12, 'sine', 0.1);
    this.tone(1568, 0.16, 'sine', 0.08, 0.08);
  }

  win() {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((n, i) => this.tone(n, 0.3, 'triangle', 0.13, i * 0.11));
  }

  lose() {
    this.tone(392, 0.25, 'triangle', 0.1);
    this.tone(311, 0.35, 'triangle', 0.1, 0.2);
  }
}
