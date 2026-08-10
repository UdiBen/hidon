import { RotateCcw, Home, Star, Flame, Trophy, Sparkles } from 'lucide-react';
import { categoryOf } from '../data/categories';
import Confetti from './Confetti';

const starsFor = (percent) => (percent >= 90 ? 3 : percent >= 70 ? 2 : percent >= 50 ? 1 : 0);

const TITLES = [
  { min: 100, title: 'מושלם! אלוף החידונים', note: 'כל התשובות נכונות. אין על זה!' },
  { min: 90, title: 'מדהים!', note: 'כמעט הכול נכון - כובע!' },
  { min: 70, title: 'מצוין!', note: 'ידע רחב מאוד. עוד קצת ואתם בפסגה.' },
  { min: 50, title: 'כל הכבוד!', note: 'יותר מחצי נכון - בכיוון הנכון.' },
  { min: 25, title: 'התחלה טובה', note: 'כל שאלה שלמדתם נשארת איתכם.' },
  { min: 0, title: 'לא נורא בכלל', note: 'החידון הזה קשה. ננסה שוב?' },
];

function ScoreDial({ score, total, percent }) {
  const circumference = 2 * Math.PI * 54;

  return (
    <div className="relative grid size-40 place-items-center sm:size-44">
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 120 120" aria-hidden="true">
        <circle cx="60" cy="60" r="54" fill="none" stroke="#e6e2fa" strokeWidth="11" />
        <circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke="url(#dial)"
          strokeWidth="11"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - percent / 100)}
          style={{ transition: 'stroke-dashoffset 900ms cubic-bezier(.22,1,.36,1)' }}
        />
        <defs>
          <linearGradient id="dial" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffc45a" />
            <stop offset="1" stopColor="#6d5efc" />
          </linearGradient>
        </defs>
      </svg>
      <div className="text-center">
        <span className="nums block text-5xl font-black leading-none text-ink sm:text-6xl">
          {score}
        </span>
        <span className="nums mt-1 block text-base font-bold text-ink-faint">מתוך {total}</span>
      </div>
    </div>
  );
}

function Breakdown({ byCategory }) {
  return (
    <ul className="flex flex-col gap-2">
      {byCategory.map(({ key, correct, total }) => {
        const { label, Icon, tint, ink } = categoryOf(key);
        const percent = Math.round((correct / total) * 100);

        return (
          <li key={key} className="flex items-center gap-2.5">
            <span
              className="grid size-8 shrink-0 place-items-center rounded-lg"
              style={{ background: tint, color: ink }}
            >
              <Icon className="size-4" strokeWidth={2.4} aria-hidden="true" />
            </span>
            <span
              className="w-28 shrink-0 truncate text-xs font-bold text-ink sm:w-36 sm:text-sm"
              title={label}
            >
              {label}
            </span>
            <span className="h-2.5 min-w-0 flex-1 overflow-hidden rounded-full bg-black/6">
              <span
                className="block h-full rounded-full"
                style={{ width: `${percent}%`, background: ink }}
              />
            </span>
            <span className="nums w-9 shrink-0 text-left text-xs font-black text-ink-soft">
              {correct}/{total}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export default function ResultScreen({
  score,
  total,
  bestStreak,
  byCategory,
  isNewRecord,
  onReplay,
  onHome,
}) {
  const percent = Math.round((score / total) * 100);
  const stars = starsFor(percent);
  const { title, note } = TITLES.find((t) => percent >= t.min);

  return (
    <main className="mx-auto flex w-full max-w-lg flex-col gap-4 px-4 py-6 sm:py-10">
      {percent >= 70 && <Confetti />}

      <section className="clay anim-pop flex flex-col items-center gap-3 p-5 text-center sm:p-7">
        <div className="flex items-end gap-1.5" aria-label={`${stars} מתוך 3 כוכבים`}>
          {[0, 1, 2].map((i) => (
            <Star
              key={i}
              className={`${i === 1 ? 'size-11 sm:size-12' : 'size-9 sm:size-10'} ${
                i < stars ? 'anim-cheer' : ''
              }`}
              style={{ animationDelay: `${i * 130}ms` }}
              strokeWidth={2.2}
              fill={i < stars ? 'var(--color-accent)' : 'none'}
              color={i < stars ? 'var(--color-accent-deep)' : '#d9d6ee'}
              aria-hidden="true"
            />
          ))}
        </div>

        <h1 className="text-2xl leading-tight text-ink sm:text-3xl">{title}</h1>
        <ScoreDial score={score} total={total} percent={percent} />
        <p className="nums text-lg font-black text-brand-deep">{percent}% תשובות נכונות</p>
        <p className="max-w-xs text-sm font-medium text-ink-soft">{note}</p>

        {isNewRecord && (
          <p
            className="anim-cheer inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black"
            style={{ background: 'var(--color-accent-tint)', color: 'var(--color-accent-deep)' }}
          >
            <Trophy className="size-5" strokeWidth={2.6} aria-hidden="true" />
            שיא אישי חדש!
          </p>
        )}
      </section>

      <div className="anim-rise flex gap-2.5" style={{ animationDelay: '80ms' }}>
        <div className="clay flex flex-1 items-center gap-2.5 rounded-2xl px-3 py-3">
          <Flame
            className="size-6 shrink-0"
            strokeWidth={2.6}
            style={{ color: 'var(--color-bad)' }}
            aria-hidden="true"
          />
          <span className="min-w-0">
            <span className="nums block text-xl font-black leading-none text-ink">{bestStreak}</span>
            <span className="block text-[0.7rem] font-semibold text-ink-faint">
              הרצף הארוך שלכם
            </span>
          </span>
        </div>
        <div className="clay flex flex-1 items-center gap-2.5 rounded-2xl px-3 py-3">
          <Sparkles
            className="size-6 shrink-0"
            strokeWidth={2.6}
            style={{ color: 'var(--color-brand)' }}
            aria-hidden="true"
          />
          <span className="min-w-0">
            <span className="nums block text-xl font-black leading-none text-ink">
              {byCategory.length}
            </span>
            <span className="block text-[0.7rem] font-semibold text-ink-faint">
              תחומים בחידון
            </span>
          </span>
        </div>
      </div>

      <section className="clay anim-rise p-4 sm:p-5" style={{ animationDelay: '140ms' }}>
        <h2 className="mb-3 text-lg text-ink">איך הסתדרתם בכל תחום?</h2>
        <Breakdown byCategory={byCategory} />
      </section>

      <div className="anim-rise flex flex-col gap-2.5" style={{ animationDelay: '200ms' }}>
        <button
          type="button"
          onClick={onReplay}
          className="clay-press flex min-h-15 items-center justify-center gap-3 rounded-[1.4rem] text-lg font-black text-white sm:text-xl"
          style={{
            background: 'linear-gradient(150deg,#8b7dff,#4c3ddb)',
            boxShadow:
              '0 18px 28px -12px rgb(76 61 219 / .5), inset 0 -5px 0 0 rgb(0 0 0 / .16), inset 0 3px 0 0 rgb(255 255 255 / .3)',
          }}
        >
          <RotateCcw className="size-6" strokeWidth={2.8} aria-hidden="true" />
          חידון חדש
        </button>
        <button
          type="button"
          onClick={onHome}
          className="clay clay-press flex min-h-13 items-center justify-center gap-2.5 rounded-[1.4rem] text-base font-bold text-ink-soft"
        >
          <Home className="size-5" strokeWidth={2.6} aria-hidden="true" />
          למסך הפתיחה
        </button>
      </div>
    </main>
  );
}
