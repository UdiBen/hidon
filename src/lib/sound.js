// Tiny Web Audio sound kit - no assets, no dependencies.
// The context is created lazily on the first user gesture, which is what
// mobile browsers require before any audio may play.

let ctx = null;

const audioContext = () => {
  if (!ctx) {
    const Ctor = window.AudioContext ?? window.webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
};

const tone = (freq, start, duration, { type = 'sine', gain = 0.13 } = {}) => {
  const ac = audioContext();
  if (!ac) return;
  const osc = ac.createOscillator();
  const vol = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  const t = ac.currentTime + start;
  vol.gain.setValueAtTime(0.0001, t);
  vol.gain.exponentialRampToValueAtTime(gain, t + 0.012);
  vol.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  osc.connect(vol).connect(ac.destination);
  osc.start(t);
  osc.stop(t + duration + 0.02);
};

const SOUNDS = {
  correct: () => {
    [523.25, 659.25, 783.99].forEach((f, i) => tone(f, i * 0.075, 0.24, { type: 'triangle' }));
  },
  wrong: () => {
    tone(311.13, 0, 0.2, { type: 'sawtooth', gain: 0.07 });
    tone(207.65, 0.1, 0.28, { type: 'sawtooth', gain: 0.07 });
  },
  streak: () => {
    [659.25, 830.61, 987.77, 1318.51].forEach((f, i) =>
      tone(f, i * 0.06, 0.2, { type: 'triangle', gain: 0.1 }),
    );
  },
  tick: () => tone(880, 0, 0.06, { type: 'square', gain: 0.04 }),
  timeout: () => {
    tone(392, 0, 0.16, { type: 'square', gain: 0.06 });
    tone(261.63, 0.14, 0.3, { type: 'square', gain: 0.06 });
  },
  finish: () => {
    [523.25, 659.25, 783.99, 1046.5, 1318.51].forEach((f, i) =>
      tone(f, i * 0.11, 0.4, { type: 'triangle', gain: 0.11 }),
    );
  },
  tap: () => tone(1046.5, 0, 0.05, { type: 'sine', gain: 0.05 }),
};

export const playSound = (name, enabled) => {
  if (!enabled) return;
  try {
    SOUNDS[name]?.();
  } catch {
    // Audio is a nice-to-have; never let it break the game.
  }
};
