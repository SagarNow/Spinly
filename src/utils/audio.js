// Web Audio API Synthesizer for sounds without requiring external files

let audioCtx = null;

export function warmUpAudio() {
  if (typeof window === 'undefined') return null;
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  } catch {}
  return audioCtx;
}

function getAudioContext() {
  return warmUpAudio();
}

export function playTickSound(enabled = true) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600 + Math.random() * 200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch {
    // Ignore audio failures if browser blocks autoplay
  }
}

export function playWinnerFanfare(enabled = true) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Play a 4-note ascending triumph chord: C5, E5, G5, C6
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      const startTime = ctx.currentTime + idx * 0.1;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(0.2, startTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.65);
    });
  } catch {
    // Ignore
  }
}

export function playButtonSound(enabled = true) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch {
    // Ignore
  }
}

export function playCoinFlipSound(enabled = true) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // 1. Crisp physical thumbnail flick snap (instant 15ms transient)
    const snapOsc = ctx.createOscillator();
    const snapGain = ctx.createGain();
    const snapFilter = ctx.createBiquadFilter();

    snapOsc.type = 'triangle';
    snapOsc.frequency.setValueAtTime(4200, now);
    snapOsc.frequency.exponentialRampToValueAtTime(1600, now + 0.015);

    snapFilter.type = 'highpass';
    snapFilter.frequency.setValueAtTime(2600, now);

    snapGain.gain.setValueAtTime(0.24, now);
    snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);

    snapOsc.connect(snapFilter);
    snapFilter.connect(snapGain);
    snapGain.connect(ctx.destination);
    snapOsc.start(now);
    snapOsc.stop(now + 0.02);

    // 2. Pure bell-like resonant metallic coin chime ("SHIIINGGGGG~~~~")
    const coinModes = [
      { freq: 2637, gain: 0.22, decay: 1.4 },  // Principal bright bullion chime (E7)
      { freq: 3296, gain: 0.12, decay: 1.0 },  // Secondary metallic overtone
      { freq: 5274, gain: 0.07, decay: 0.6 }   // Crystalline shimmer sparkle (E8)
    ];

    coinModes.forEach(({ freq, gain: initGain, decay }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(initGain, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + decay + 0.05);
    });
  } catch {
    // Ignore audio errors
  }
}

export function playCoinLandSound(enabled = true) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // 1. Table impact thud (low tactile surface contact)
    const thudOsc = ctx.createOscillator();
    const thudGain = ctx.createGain();
    thudOsc.type = 'sine';
    thudOsc.frequency.setValueAtTime(220, now);
    thudOsc.frequency.exponentialRampToValueAtTime(80, now + 0.045);
    thudGain.gain.setValueAtTime(0.22, now);
    thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
    thudOsc.connect(thudGain);
    thudGain.connect(ctx.destination);
    thudOsc.start(now);
    thudOsc.stop(now + 0.05);

    // 2. Realistic multi-bounce metallic clatter ("CLINK-clik-ting")
    const impacts = [
      { time: 0, freq: 2150, gain: 0.24, decay: 0.12 },       // Primary metallic strike
      { time: 0.055, freq: 2750, gain: 0.15, decay: 0.09 },   // 1st rebound clink
      { time: 0.11, freq: 3500, gain: 0.08, decay: 0.06 }     // Final settling ting
    ];

    impacts.forEach(({ time: offset, freq, gain: initGain, decay }) => {
      const hitTime = now + offset;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, hitTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.92, hitTime + decay);

      gain.gain.setValueAtTime(initGain, hitTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, hitTime + decay);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(hitTime);
      osc.stop(hitTime + decay + 0.02);
    });
  } catch {
    // Ignore
  }
}
