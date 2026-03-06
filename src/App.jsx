import React, { useState, useEffect } from 'react';
import { Trophy, ArrowLeft, RefreshCw, Info, HelpCircle, CheckCircle2, XCircle } from 'lucide-react';
import { ALL_QUESTIONS } from './data/questions';

const shuffleArray = (array) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

export default function App() {
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [isFinished, setIsFinished] = useState(false);
  const [showFact, setShowFact] = useState(false);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const shuffled = shuffleArray(ALL_QUESTIONS).slice(0, 20);
    setQuestions(shuffled);
    setCurrentIdx(0);
    setScore(0);
    setSelectedIdx(null);
    setIsFinished(false);
    setShowFact(false);
  };

  const handleAnswer = (idx) => {
    if (selectedIdx !== null) return;
    
    setSelectedIdx(idx);
    setShowFact(true);
    
    if (idx === questions[currentIdx].answer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(prev => prev + 1);
      setSelectedIdx(null);
      setShowFact(false);
    } else {
      setIsFinished(true);
    }
  };

  if (questions.length === 0) return null;

  if (isFinished) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
        <div className="bg-white rounded-3xl shadow-xl p-6 w-full max-w-md text-center border-4 border-yellow-400 transform transition-all animate-in zoom-in duration-500">
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-3xl font-black text-slate-800 mb-2">כל הכבוד!</h1>
          <p className="text-lg text-slate-600 mb-6">
            סיימת את החידון עם ציון של:
            <br />
            <span className="text-4xl font-black text-blue-600 inline-block mt-2">
              {score} / {questions.length}
            </span>
          </p>
          
          <button 
            onClick={startNewGame}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-2xl text-xl flex items-center justify-center gap-3 shadow-lg shadow-blue-200 transition-all active:scale-95"
          >
            <RefreshCw className="w-6 h-6" />
            שחקו שוב
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIdx];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-3 sm:p-6 font-sans">
      {/* Header - Compact */}
      <div className="w-full max-w-2xl flex justify-between items-center mb-4">
        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border-2 border-slate-100 font-bold text-slate-600 text-base sm:text-lg">
          שאלה {currentIdx + 1} מתוך {questions.length}
        </div>
        <div className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-xl border-2 border-yellow-200 font-black text-lg sm:text-xl">
          נקודות: {score}
        </div>
      </div>

      {/* Question Card - Tighter */}
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-lg p-5 sm:p-8 border-4 border-blue-100 relative mb-4 overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
           <HelpCircle size={80} className="text-blue-500" />
        </div>
        
        <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mb-6 leading-tight relative z-10 text-center">
          {currentQuestion.question}
        </h2>

        <div className="grid grid-cols-1 gap-3 relative z-10">
          {currentQuestion.options.map((option, idx) => {
            let statusClasses = "border-slate-100 hover:border-blue-300 hover:bg-blue-50";
            let icon = null;

            if (selectedIdx !== null) {
              if (idx === currentQuestion.answer) {
                statusClasses = "border-green-500 bg-green-50 text-green-700 ring-2 ring-green-100";
                icon = <CheckCircle2 className="w-5 h-5 text-green-600" />;
              } else if (idx === selectedIdx) {
                statusClasses = "border-red-500 bg-red-50 text-red-700 ring-2 ring-red-100";
                icon = <XCircle className="w-5 h-5 text-red-600" />;
              } else {
                statusClasses = "border-slate-100 opacity-50";
              }
            }

            return (
              <button
                key={idx}
                disabled={selectedIdx !== null}
                onClick={() => handleAnswer(idx)}
                className={`flex items-center justify-between text-right p-3.5 sm:p-5 rounded-2xl border-4 text-lg sm:text-xl font-bold transition-all ${statusClasses} active:scale-[0.98]`}
              >
                <span>{option}</span>
                {icon}
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback & Next Button - Tighter */}
      {showFact && (
        <div className="w-full max-w-2xl animate-in slide-in-from-bottom-2 duration-300">
          <div className="bg-indigo-50 border-2 border-indigo-100 rounded-2xl p-4 mb-4 flex gap-3 items-start">
            <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600 shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-indigo-900 text-base mb-0.5">הידעת?</h4>
              <p className="text-indigo-800 leading-snug text-sm sm:text-base">
                {currentQuestion.fact}
              </p>
            </div>
          </div>
          
          <button 
            onClick={handleNext}
            className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 rounded-2xl text-xl flex items-center justify-center gap-3 transition-all active:scale-95 group shadow-lg"
          >
            <span>לשאלה הבאה</span>
            <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
}
