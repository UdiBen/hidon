const KEY = 'hidon:v1';

const DEFAULTS = {
  sound: true,
  timer: false,
  length: 20,
  bestPercent: 0,
  bestStreak: 0,
  gamesPlayed: 0,
};

export const loadState = () => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : { ...DEFAULTS };
  } catch {
    return { ...DEFAULTS };
  }
};

export const saveState = (state) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Private-mode browsers can reject writes; the game still works in memory.
  }
};
