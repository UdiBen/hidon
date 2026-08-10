import {
  PawPrint, Rocket, Globe2, FlaskConical, HeartPulse, Trophy, Music,
  Clapperboard, Hourglass, Star, Apple, Cpu, Swords, BookOpen, Calculator,
  Palette, Lightbulb,
} from 'lucide-react';

// `tint`/`ink` are the chip's own colors; each category reads as a distinct hue
// while staying inside the app's soft, high-contrast palette.
export const CATEGORIES = {
  animals: { label: 'חיות', Icon: PawPrint, tint: '#e7fbef', ink: '#04794f' },
  space: { label: 'חלל', Icon: Rocket, tint: '#eae7ff', ink: '#4034b8' },
  geography: { label: 'גאוגרפיה', Icon: Globe2, tint: '#e2f5ff', ink: '#0b6a94' },
  science: { label: 'מדע', Icon: FlaskConical, tint: '#e8fbfa', ink: '#0a7a72' },
  body: { label: 'גוף האדם', Icon: HeartPulse, tint: '#ffeaf1', ink: '#b01450' },
  sports: { label: 'ספורט', Icon: Trophy, tint: '#fff2dc', ink: '#95560a' },
  music: { label: 'מוזיקה', Icon: Music, tint: '#f6e9ff', ink: '#6c2496' },
  movies: { label: 'סרטים', Icon: Clapperboard, tint: '#ffeae5', ink: '#a83a1e' },
  history: { label: 'היסטוריה', Icon: Hourglass, tint: '#f3eee3', ink: '#6b5320' },
  israel: { label: 'ישראל', Icon: Star, tint: '#e4f1ff', ink: '#14549e' },
  food: { label: 'אוכל', Icon: Apple, tint: '#fdefe7', ink: '#9c4a17' },
  tech: { label: 'טכנולוגיה', Icon: Cpu, tint: '#e9eefb', ink: '#2b4a9c' },
  mythology: { label: 'מיתולוגיה', Icon: Swords, tint: '#efeafc', ink: '#5a32b0' },
  literature: { label: 'ספרות', Icon: BookOpen, tint: '#fdeef6', ink: '#9b2069' },
  math: { label: 'חשבון והיגיון', Icon: Calculator, tint: '#e8f2ec', ink: '#2c6647' },
  art: { label: 'אמנות', Icon: Palette, tint: '#fdf0dd', ink: '#8c5a0c' },
  general: { label: 'ידע כללי', Icon: Lightbulb, tint: '#eef0f6', ink: '#454f70' },
};

export const categoryOf = (key) => CATEGORIES[key] ?? CATEGORIES.general;
