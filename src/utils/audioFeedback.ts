/**
 * Web Audio API synthesizer for instant zero-dependency EdTech micro-interactions.
 * Generates harmonic chords, feedback cues, and realistic Vietnamese pitch contours.
 */

class AudioFeedbackManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private getContext(): AudioContext | null {
    if (this.isMuted) return null;
    if (typeof window === 'undefined') return null;

    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Sparkling dual-tone chord for correct answers (Duolingo-style reward feel)
   */
  public playSuccessChime() {
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 arpeggio
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.06);

      gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.06);
      gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + idx * 0.06 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.06 + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.06);
      osc.stop(ctx.currentTime + idx * 0.06 + 0.45);
    });
  }

  /**
   * Warm, gentle error thud (friendly, not jarring or punitive)
   */
  public playErrorSound() {
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(196, ctx.currentTime); // G3
    osc.frequency.exponentialRampToValueAtTime(130, ctx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.26);
  }

  /**
   * Crisp organic pop when picking or dropping a word pill
   */
  public playPopSound(pitchMultiplier: number = 1.0) {
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const startFreq = 420 * pitchMultiplier;
    osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(220 * pitchMultiplier, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.09);
  }

  /**
   * Swoosh effect when flipping flashcard
   */
  public playFlipSound() {
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(280, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(560, ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.13);
  }

  /**
   * Vietnamese Tone Pitch Synthesizer:
   * Generates genuine pitch contours for foreign learners to hear the pitch differences.
   */
  public playVietnameseTone(tone: 'NGANG' | 'HUYEN' | 'SAC' | 'HOI' | 'NGA' | 'NANG') {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';

    // Base pitch around 220Hz (A3 - comfortable human vocal register)
    switch (tone) {
      case 'NGANG': {
        // Level tone: steady ~220Hz
        osc.frequency.setValueAtTime(220, now);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
        osc.start(now);
        osc.stop(now + 0.56);
        break;
      }
      case 'HUYEN': {
        // Falling tone: starts 210Hz, gently glides down to 160Hz
        osc.frequency.setValueAtTime(210, now);
        osc.frequency.exponentialRampToValueAtTime(155, now + 0.5);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
        osc.start(now);
        osc.stop(now + 0.56);
        break;
      }
      case 'SAC': {
        // Rising tone: starts 220Hz, climbs rapidly to 320Hz
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.45);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.48);
        osc.start(now);
        osc.stop(now + 0.5);
        break;
      }
      case 'HOI': {
        // Dipping-rising tone: drops 200Hz -> 150Hz then rises back to 210Hz
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.linearRampToValueAtTime(150, now + 0.22);
        osc.frequency.linearRampToValueAtTime(215, now + 0.55);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.58);
        osc.start(now);
        osc.stop(now + 0.6);
        break;
      }
      case 'NGA': {
        // High broken/glottal rising: starts 230Hz, sharp rise with slight glottal break
        osc.frequency.setValueAtTime(230, now);
        osc.frequency.linearRampToValueAtTime(270, now + 0.2);
        osc.frequency.setValueAtTime(300, now + 0.25); // jump
        osc.frequency.linearRampToValueAtTime(340, now + 0.5);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.setValueAtTime(0.04, now + 0.22); // brief dip/constriction
        gain.gain.setValueAtTime(0.18, now + 0.26);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
        osc.start(now);
        osc.stop(now + 0.56);
        break;
      }
      case 'NANG': {
        // Heavy/dropping tone: drops fast and gets cut off abruptly
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.22);
        gain.gain.setValueAtTime(0.22, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.24); // abrupt drop/closure
        osc.start(now);
        osc.stop(now + 0.25);
        break;
      }
    }

    osc.connect(gain);
    gain.connect(ctx.destination);
  }

  /**
   * Browser Speech Synthesis fallback for full Vietnamese words
   */
  public speakVietnamese(text: string, rate: number = 0.85) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'vi-VN';
      utterance.rate = rate; // 1.0 for normal, 0.55 for turtle slow
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis not available:', e);
    }
  }
}

export const audioFeedback = new AudioFeedbackManager();
