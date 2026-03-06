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
    // Select 20 random questions from the bank of 200
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
        <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md text-center border-4 border-yellow-400 transform transition-all animate-in zoom-in duration-500">
          <Trophy className="w-24 h-24 text-yellow-500 mx-auto mb-6" />
          <h1 className="text-4xl font-black text-slate-800 mb-2">כל הכבוד!</h1>
          <p className="text-xl text-slate-600 mb-8">
            סיימת את החידון עם ציון של:
            <br />
            <span className="text-5xl font-black text-blue-600 inline-block mt-4">
              {score} / {questions.length}
            </span>
          </p>
          
          <button 
            onClick={startNewGame}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-5 rounded-2xl text-2xl flex items-center justify-center gap-3 shadow-lg shadow-blue-200 transition-all active:scale-95"
          >
            <RefreshCw className="w-8 h-8" />
            שחקו שוב
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIdx];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-4 sm:p-8 font-sans">
      {/* Header */}
      <div className="w-full max-w-2xl flex justify-between items-center mb-8">
        <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border-2 border-slate-100 font-bold text-slate-600 text-lg">
          שאלה {currentIdx + 1} מתוך {questions.length}
        </div>
        <div className="bg-yellow-100 text-yellow-700 px-6 py-3 rounded-2xl border-2 border-yellow-200 font-black text-xl">
          נקודות: {score}
        </div>
      </div>

      {/* Question Card */}
      <div className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-xl p-6 sm:p-10 border-4 border-blue-100 relative mb-8 overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
           <HelpCircle size={120} className="text-blue-500" />
        </div>
        
        <h2 className="text-3xl sm:text-4xl font-black text-slate-800 mb-10 leading-tight relative z-10 text-center">
          {currentQuestion.question}
        </h2>

        <div className="grid grid-cols-1 gap-4 relative z-10">
          {currentQuestion.options.map((option, idx) => {
            let statusClasses = "border-slate-100 hover:border-blue-300 hover:bg-blue-50";
            let icon = null;

            if (selectedIdx !== null) {
              if (idx === currentQuestion.answer) {
                statusClasses = "border-green-500 bg-green-50 text-green-700 ring-4 ring-green-100";
                icon = <CheckCircle2 className="w-6 h-6 text-green-600" />;
              } else if (idx === selectedIdx) {
                statusClasses = "border-red-500 bg-red-50 text-red-700 ring-4 ring-red-100";
                icon = <XCircle className="w-6 h-6 text-red-600" />;
              } else {
                statusClasses = "border-slate-100 opacity-50";
              }
            }

            return (
              <button
                key={idx}
                disabled={selectedIdx !== null}
                onClick={() => handleAnswer(idx)}
                className={`flex items-center justify-between text-right p-5 rounded-2xl border-4 text-xl sm:text-2xl font-bold transition-all ${statusClasses} active:scale-[0.98]`}
              >
                <span>{option}</span>
                {icon}
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback & Next Button */}
      {showFact && (
        <div className="w-full max-w-2xl animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-indigo-50 border-2 border-indigo-100 rounded-3xl p-6 mb-6 flex gap-4 items-start">
            <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600">
              <Info className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-indigo-900 text-lg mb-1">הידעת?</h4>
              <p className="text-indigo-800 leading-relaxed text-lg">
                {currentQuestion.fact}
              </p>
            </div>
          </div>
          
          <button 
            onClick={handleNext}
            className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-6 rounded-3xl text-2xl flex items-center justify-center gap-4 transition-all active:scale-95 group shadow-xl"
          >
            <span>לשאלה הבאה</span>
            <ArrowLeft className="w-8 h-8 group-hover:-translate-x-2 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
}
