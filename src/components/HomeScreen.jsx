import { Play, Volume2, VolumeX, Timer, Flame, Award, Sparkles, Puzzle } from 'lucide-react';
import { CATEGORIES } from '../data/categories';

const LENGTHS = [10, 20, 30];

function Toggle({ on, onChange, Icon, IconOff, label, hint }) {
  const Glyph = on ? Icon : (IconOff ?? Icon);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className="clay clay-press flex min-h-14 w-full items-center gap-3 rounded-2xl px-4 py-3 text-right"
    >
      <span
        className="grid size-10 shrink-0 place-items-center rounded-xl transition-colors"
        style={{
          background: on ? 'var(--color-brand)' : '#eceafb',
          color: on ? '#fff' : 'var(--color-ink-faint)',
        }}
      >
        <Glyph className="size-5" strokeWidth={2.4} aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-base font-bold text-ink">{label}</span>
        <span className="block text-xs font-medium text-ink-faint">{hint}</span>
      </span>
      <span
        className="relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200"
        style={{ background: on ? 'var(--color-good)' : '#d9d6ee' }}
      >
        <span
          className="absolute top-1 size-5 rounded-full bg-white shadow-sm transition-[inset-inline-start] duration-200"
          style={{ insetInlineStart: on ? '1.75rem' : '0.25rem' }}
        />
      </span>
    </button>
  );
}

function Record({ Icon, value, label, color }) {
  return (
    <div className="clay flex flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-3">
      <Icon className="size-5" strokeWidth={2.6} style={{ color }} aria-hidden="true" />
      <span className="nums text-xl font-black leading-none text-ink">{value}</span>
      <span className="text-center text-[0.68rem] font-semibold leading-tight text-ink-faint">
        {label}
      </span>
    </div>
  );
}

export default function HomeScreen({ settings, onChangeSettings, onStart, totalQuestions }) {
  const categoryList = Object.values(CATEGORIES);

  return (
    <main className="mx-auto flex w-full max-w-lg flex-col gap-4 px-4 py-6 sm:gap-5 sm:py-10">
      <header className="anim-pop flex flex-col items-center gap-3 text-center">
        <span
          className="grid size-20 place-items-center rounded-[1.6rem] text-white sm:size-24"
          style={{
            background: 'linear-gradient(150deg,#8b7dff,#4c3ddb)',
            boxShadow:
              '0 20px 30px -12px rgb(76 61 219 / .45), inset 0 -5px 0 0 rgb(0 0 0 / .14), inset 0 3px 0 0 rgb(255 255 255 / .35)',
          }}
        >
          <Sparkles className="size-10 sm:size-12" strokeWidth={2.2} aria-hidden="true" />
        </span>
        <h1 className="text-[2rem] leading-tight text-ink sm:text-4xl">חידון הידע הגדול</h1>
        <p className="max-w-xs text-sm font-medium text-ink-soft sm:text-base">
          <span className="nums font-bold text-brand-deep">{totalQuestions}</span> שאלות מ־
          {categoryList.length} תחומים - וכל שאלה מסתיימת בעובדה מפתיעה
        </p>
      </header>

      <div className="anim-rise flex gap-2.5" style={{ animationDelay: '60ms' }}>
        <Record
          Icon={Award}
          value={`${settings.bestPercent}%`}
          label="השיא שלי"
          color="var(--color-accent-deep)"
        />
        <Record
          Icon={Flame}
          value={settings.bestStreak}
          label="רצף שיא"
          color="var(--color-bad)"
        />
        <Record
          Icon={Puzzle}
          value={settings.gamesPlayed}
          label="חידונים ששיחקתי"
          color="var(--color-brand)"
        />
      </div>

      <section className="clay anim-rise p-4 sm:p-5" style={{ animationDelay: '120ms' }}>
        <h2 className="mb-3 text-lg text-ink">כמה שאלות בחידון?</h2>
        <div className="grid grid-cols-3 gap-2.5">
          {LENGTHS.map((n) => {
            const active = settings.length === n;
            return (
              <button
                key={n}
                type="button"
                aria-pressed={active}
                aria-label={`${n} שאלות`}
                onClick={() => onChangeSettings({ length: n })}
                className="clay-press min-h-16 rounded-2xl font-black transition-colors"
                style={
                  active
                    ? {
                        background: 'linear-gradient(150deg,#8b7dff,#4c3ddb)',
                        color: '#fff',
                        boxShadow:
                          '0 12px 20px -10px rgb(76 61 219 / .5), inset 0 -4px 0 0 rgb(0 0 0 / .16), inset 0 2px 0 0 rgb(255 255 255 / .3)',
                      }
                    : {
                        background: 'var(--color-brand-tint)',
                        color: 'var(--color-brand-deep)',
                        boxShadow: 'inset 0 -4px 0 0 rgb(76 61 219 / .1)',
                      }
                }
              >
                <span className="nums block text-2xl leading-none">{n}</span>
                <span className="mt-0.5 block text-[0.7rem] font-bold opacity-80">שאלות</span>
              </button>
            );
          })}
        </div>
      </section>

      <div className="anim-rise flex flex-col gap-2.5" style={{ animationDelay: '180ms' }}>
        <Toggle
          on={settings.sound}
          onChange={(sound) => onChangeSettings({ sound })}
          Icon={Volume2}
          IconOff={VolumeX}
          label="צלילים"
          hint="צליל לתשובה נכונה ולרצף"
        />
        <Toggle
          on={settings.timer}
          onChange={(timer) => onChangeSettings({ timer })}
          Icon={Timer}
          label="טיימר לשאלה"
          hint="20 שניות לכל שאלה - למקצוענים"
        />
      </div>

      <button
        type="button"
        onClick={onStart}
        className="clay-press anim-rise flex min-h-16 items-center justify-center gap-3 rounded-[1.6rem] text-xl font-black text-white sm:text-2xl"
        style={{
          animationDelay: '240ms',
          background: 'linear-gradient(150deg,#ffc45a,#e08800)',
          boxShadow:
            '0 18px 28px -12px rgb(224 136 0 / .55), inset 0 -5px 0 0 rgb(0 0 0 / .16), inset 0 3px 0 0 rgb(255 255 255 / .4)',
        }}
      >
        <Play className="size-7" strokeWidth={2.8} aria-hidden="true" />
        יאללה, מתחילים!
      </button>

      <section className="anim-rise" style={{ animationDelay: '300ms' }}>
        <h2 className="mb-2 px-1 text-sm font-bold text-ink-soft">מה יש בפנים?</h2>
        <ul className="flex flex-wrap gap-1.5">
          {categoryList.map(({ label, Icon, tint, ink }) => (
            <li
              key={label}
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-bold"
              style={{ background: tint, color: ink }}
            >
              <Icon className="size-3.5 shrink-0" strokeWidth={2.4} aria-hidden="true" />
              {label}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
