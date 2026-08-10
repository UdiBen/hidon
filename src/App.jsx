import { useCallback, useEffect, useMemo, useState } from 'react';
import { ALL_QUESTIONS } from './data/questions';
import { loadState, saveState } from './lib/storage';
import { playSound } from './lib/sound';
import BlobBackground from './components/BlobBackground';
import HomeScreen from './components/HomeScreen';
import QuizScreen from './components/QuizScreen';
import ResultScreen from './components/ResultScreen';

const QUESTION_SECONDS = 20;

const shuffle = (items) => {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

// Options are shuffled per game so replaying a question never rewards
// remembering a position instead of the answer.
const withShuffledOptions = (question) => {
  const correct = question.options[question.answer];
  const options = shuffle(question.options);
  return { ...question, options, answer: options.indexOf(correct) };
};

const drawQuestions = (count) =>
  shuffle(ALL_QUESTIONS).slice(0, count).map(withShuffledOptions);

export default function App() {
  const [settings, setSettings] = useState(loadState);
  const [screen, setScreen] = useState('home');
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [timedOut, setTimedOut] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(QUESTION_SECONDS);
  const [results, setResults] = useState([]);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [isNewRecord, setIsNewRecord] = useState(false);

  const soundOn = settings.sound;
  const answered = selectedIdx !== null || timedOut;
  const score = results.filter((r) => r.correct).length;

  const persist = useCallback((patch) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      saveState(next);
      return next;
    });
  }, []);

  const startGame = useCallback(() => {
    setQuestions(drawQuestions(settings.length));
    setIndex(0);
    setSelectedIdx(null);
    setTimedOut(false);
    setSecondsLeft(QUESTION_SECONDS);
    setResults([]);
    setStreak(0);
    setBestStreak(0);
    setIsNewRecord(false);
    setScreen('quiz');
    playSound('tap', soundOn);
  }, [settings.length, soundOn]);

  const recordAnswer = useCallback(
    (correct) => {
      setResults((prev) => [...prev, { category: questions[index].category, correct }]);
      setStreak((prev) => {
        const next = correct ? prev + 1 : 0;
        setBestStreak((best) => Math.max(best, next));
        if (correct && next >= 3) playSound('streak', soundOn);
        else if (correct) playSound('correct', soundOn);
        return next;
      });
    },
    [index, questions, soundOn],
  );

  const handleAnswer = useCallback(
    (idx) => {
      if (answered) return;
      setSelectedIdx(idx);
      const correct = idx === questions[index].answer;
      if (!correct) playSound('wrong', soundOn);
      recordAnswer(correct);
    },
    [answered, index, questions, recordAnswer, soundOn],
  );

  const handleTimeout = useCallback(() => {
    setTimedOut(true);
    playSound('timeout', soundOn);
    recordAnswer(false);
  }, [recordAnswer, soundOn]);

  // Advancing past the last question is also where the run's records are
  // committed, so nothing has to be reconciled after the screen switches.
  const handleNext = useCallback(() => {
    if (index + 1 < questions.length) {
      setIndex((prev) => prev + 1);
      setSelectedIdx(null);
      setTimedOut(false);
      setSecondsLeft(QUESTION_SECONDS);
      playSound('tap', soundOn);
      return;
    }

    const percent = results.length ? Math.round((score / results.length) * 100) : 0;
    setIsNewRecord(percent > settings.bestPercent && percent > 0);
    persist({
      bestPercent: Math.max(settings.bestPercent, percent),
      bestStreak: Math.max(settings.bestStreak, bestStreak),
      gamesPlayed: settings.gamesPlayed + 1,
    });
    setScreen('result');
    playSound('finish', soundOn);
  }, [
    index,
    questions.length,
    results.length,
    score,
    bestStreak,
    settings,
    persist,
    soundOn,
  ]);

  // Countdown driven by a wall-clock deadline so it cannot drift, torn down as
  // soon as the question is answered.
  useEffect(() => {
    if (screen !== 'quiz' || !settings.timer || answered) return;
    const deadline = Date.now() + QUESTION_SECONDS * 1000;
    let lastWhole = QUESTION_SECONDS;
    const id = setInterval(() => {
      const left = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      if (left === lastWhole) return;
      lastWhole = left;
      setSecondsLeft(left);
      if (left === 0) {
        clearInterval(id);
        handleTimeout();
      } else if (left <= 4) {
        playSound('tick', soundOn);
      }
    }, 200);
    return () => clearInterval(id);
  }, [screen, settings.timer, answered, index, soundOn, handleTimeout]);

  const byCategory = useMemo(() => {
    const tally = new Map();
    for (const { category, correct } of results) {
      const row = tally.get(category) ?? { key: category, correct: 0, total: 0 };
      row.total += 1;
      if (correct) row.correct += 1;
      tally.set(category, row);
    }
    return [...tally.values()].sort(
      (a, b) => b.correct / b.total - a.correct / a.total || b.total - a.total,
    );
  }, [results]);

  return (
    <>
      <BlobBackground />

      {screen === 'home' && (
        <HomeScreen
          settings={settings}
          onChangeSettings={persist}
          onStart={startGame}
          totalQuestions={ALL_QUESTIONS.length}
        />
      )}

      {screen === 'quiz' && questions.length > 0 && (
        <QuizScreen
          question={questions[index]}
          index={index}
          total={questions.length}
          score={score}
          streak={streak}
          selectedIdx={selectedIdx}
          timedOut={timedOut}
          secondsLeft={secondsLeft}
          timerOn={settings.timer}
          onAnswer={handleAnswer}
          onNext={handleNext}
          onQuit={() => setScreen('home')}
        />
      )}

      {screen === 'result' && (
        <ResultScreen
          score={score}
          total={results.length}
          bestStreak={bestStreak}
          byCategory={byCategory}
          isNewRecord={isNewRecord}
          onReplay={startGame}
          onHome={() => setScreen('home')}
        />
      )}
    </>
  );
}
