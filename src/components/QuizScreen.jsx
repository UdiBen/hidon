import { useEffect, useRef } from 'react';
import { ArrowLeft, Check, X, Flame, Lightbulb, Home, Clock } from 'lucide-react';
import CategoryChip from './CategoryChip';

const OPTION_LETTERS = ['א', 'ב', 'ג', 'ד'];
const QUESTION_SECONDS = 20;

function ProgressTrack({ current, total }) {
  return (
    <div
      className="h-2.5 w-full overflow-hidden rounded-full bg-[#e6e2fa]"
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={current}
      aria-label={`שאלה ${current} מתוך ${total}`}
    >
      <div
        className="h-full rounded-full transition-[width] duration-500 ease-out"
        style={{
          width: `${(current / total) * 100}%`,
          background: 'linear-gradient(90deg,#8b7dff,#4c3ddb)',
        }}
      />
    </div>
  );
}

function TimerRing({ secondsLeft }) {
  const fraction = secondsLeft / QUESTION_SECONDS;
  const urgent = secondsLeft <= 5;
  const circumference = 2 * Math.PI * 18;

  return (
    <div
      className={`relative grid size-12 shrink-0 place-items-center rounded-full ${urgent ? 'anim-urgent' : ''}`}
      aria-label={`נותרו ${secondsLeft} שניות`}
    >
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 40 40" aria-hidden="true">
        <circle cx="20" cy="20" r="18" fill="none" stroke="#e6e2fa" strokeWidth="4" />
        <circle
          cx="20"
          cy="20"
          r="18"
          fill="none"
          stroke={urgent ? 'var(--color-bad)' : 'var(--color-brand)'}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - fraction)}
          style={{ transition: 'stroke-dashoffset 1s linear, stroke 200ms ease' }}
        />
      </svg>
      <span
        className="nums text-sm font-black"
        style={{ color: urgent ? 'var(--color-bad-deep)' : 'var(--color-brand-deep)' }}
      >
        {secondsLeft}
      </span>
    </div>
  );
}

function AnswerButton({ option, index, state, disabled, onSelect }) {
  const styles = {
    idle: {
      button: { background: '#fff', color: 'var(--color-ink)' },
      badge: { background: 'var(--color-brand-tint)', color: 'var(--color-brand-deep)' },
    },
    correct: {
      button: {
        background: 'var(--color-good-tint)',
        color: 'var(--color-good-deep)',
        boxShadow:
          '0 14px 24px -12px rgb(5 135 95 / .4), inset 0 0 0 3px var(--color-good), inset 0 -5px 0 0 rgb(5 135 95 / .18)',
      },
      badge: { background: 'var(--color-good)', color: '#fff' },
    },
    wrong: {
      button: {
        background: 'var(--color-bad-tint)',
        color: 'var(--color-bad-deep)',
        boxShadow:
          '0 14px 24px -12px rgb(195 29 60 / .4), inset 0 0 0 3px var(--color-bad), inset 0 -5px 0 0 rgb(195 29 60 / .18)',
      },
      badge: { background: 'var(--color-bad)', color: '#fff' },
    },
    // De-emphasised rather than faded out: the text stays readable so a child
    // can still see which options were rejected.
    muted: {
      button: { background: '#fbfaff', color: 'var(--color-ink-faint)' },
      badge: { background: '#f0eefb', color: 'var(--color-ink-faint)' },
    },
  }[state];

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      className={`clay clay-press anim-rise flex min-h-16 w-full items-center gap-3 rounded-2xl p-3 text-right text-base font-bold sm:min-h-18 sm:p-4 sm:text-lg ${
        state === 'wrong' ? 'anim-shake' : ''
      }`}
      style={{ ...styles.button, animationDelay: `${index * 55}ms` }}
    >
      <span
        className="grid size-9 shrink-0 place-items-center rounded-xl text-sm font-black sm:size-10 sm:text-base"
        style={styles.badge}
      >
        {state === 'correct' ? (
          <Check className="size-5" strokeWidth={3.2} aria-hidden="true" />
        ) : state === 'wrong' ? (
          <X className="size-5" strokeWidth={3.2} aria-hidden="true" />
        ) : (
          OPTION_LETTERS[index]
        )}
      </span>
      <span className="min-w-0 flex-1 leading-snug">{option}</span>
    </button>
  );
}

export default function QuizScreen({
  question,
  index,
  total,
  score,
  streak,
  selectedIdx,
  timedOut,
  secondsLeft,
  timerOn,
  onAnswer,
  onNext,
  onQuit,
}) {
  const answered = selectedIdx !== null || timedOut;
  const isLast = index + 1 === total;
  const nextRef = useRef(null);

  // Move focus to the primary action once feedback appears, so keyboard and
  // screen-reader users land on "next" instead of the disabled options.
  useEffect(() => {
    if (answered) nextRef.current?.focus({ preventScroll: true });
  }, [answered]);

  const stateFor = (idx) => {
    if (!answered) return 'idle';
    if (idx === question.answer) return 'correct';
    if (idx === selectedIdx) return 'wrong';
    return 'muted';
  };

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-3 px-3 py-4 sm:gap-4 sm:px-5 sm:py-6">
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={onQuit}
          aria-label="חזרה למסך הפתיחה"
          className="clay-sm clay-press grid size-11 shrink-0 place-items-center text-ink-soft"
        >
          <Home className="size-5" strokeWidth={2.4} aria-hidden="true" />
        </button>

        <div className="clay-sm flex min-w-0 flex-1 items-center gap-2 px-3 py-2">
          <span className="nums shrink-0 text-sm font-black text-ink sm:text-base">
            {index + 1}
            <span className="text-ink-faint">/{total}</span>
          </span>
          <div className="min-w-0 flex-1">
            <ProgressTrack current={index + 1} total={total} />
          </div>
          <span
            className="nums shrink-0 rounded-full px-2.5 py-1 text-sm font-black"
            style={{ background: 'var(--color-accent-tint)', color: 'var(--color-accent-deep)' }}
          >
            {score}
          </span>
        </div>

        {timerOn && !answered && <TimerRing secondsLeft={secondsLeft} />}
      </div>

      <section key={question.id} className="clay anim-pop p-4 sm:p-6">
        <div className="mb-3 flex items-center justify-between gap-2">
          <CategoryChip category={question.category} />
          {streak >= 2 && (
            // Keying on the streak remounts the badge, replaying the cheer.
            <span
              key={streak}
              className="nums anim-cheer inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-black sm:text-sm"
              style={{ background: 'var(--color-bad-tint)', color: 'var(--color-bad-deep)' }}
            >
              <Flame className="size-4" strokeWidth={2.6} aria-hidden="true" />
              רצף {streak}
            </span>
          )}
        </div>

        <h2 className="mb-4 text-center text-xl leading-snug text-ink sm:mb-5 sm:text-2xl">
          {question.question}
        </h2>

        <div className="flex flex-col gap-2.5">
          {question.options.map((option, idx) => (
            <AnswerButton
              key={idx}
              option={option}
              index={idx}
              state={stateFor(idx)}
              disabled={answered}
              onSelect={() => onAnswer(idx)}
            />
          ))}
        </div>
      </section>

      {answered && (
        <div className="anim-rise flex flex-col gap-3" aria-live="polite">
          {timedOut && (
            <div
              className="flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold"
              style={{ background: 'var(--color-bad-tint)', color: 'var(--color-bad-deep)' }}
            >
              <Clock className="size-5 shrink-0" strokeWidth={2.6} aria-hidden="true" />
              נגמר הזמן! התשובה הנכונה מסומנת בירוק.
            </div>
          )}

          <div className="clay flex gap-3 p-4">
            <span
              className="grid size-10 shrink-0 place-items-center rounded-xl"
              style={{ background: 'var(--color-accent-tint)', color: 'var(--color-accent-deep)' }}
            >
              <Lightbulb className="size-5" strokeWidth={2.6} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h3 className="mb-0.5 text-base text-ink">הידעת?</h3>
              <p className="text-sm font-medium leading-relaxed text-ink-soft sm:text-base">
                {question.fact}
              </p>
            </div>
          </div>

          <button
            ref={nextRef}
            type="button"
            onClick={onNext}
            className="clay-press group flex min-h-15 items-center justify-center gap-3 rounded-[1.4rem] text-lg font-black text-white sm:text-xl"
            style={{
              background: 'linear-gradient(150deg,#8b7dff,#4c3ddb)',
              boxShadow:
                '0 18px 28px -12px rgb(76 61 219 / .5), inset 0 -5px 0 0 rgb(0 0 0 / .16), inset 0 3px 0 0 rgb(255 255 255 / .3)',
            }}
          >
            {isLast ? 'לתוצאות!' : 'לשאלה הבאה'}
            <ArrowLeft
              className="size-6 transition-transform duration-200 group-hover:-translate-x-1"
              strokeWidth={2.8}
              aria-hidden="true"
            />
          </button>
        </div>
      )}
    </main>
  );
}
