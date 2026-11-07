import React, { useState, useEffect, useRef } from 'react';
import {
  Clock,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  HelpCircle,
  Flag,
  Sparkles,
} from 'lucide-react';
import { QuizQuestion, QuizCategory, Difficulty } from '../types/quiz';

interface QuizScreenProps {
  questions: QuizQuestion[];
  category: QuizCategory;
  difficulty: Difficulty;
  timerDurationSeconds: number;
  negativeMarking: boolean;
  soundEnabled: boolean;
  onFinishQuiz: (userAnswers: Record<number, string>, timeTakenSeconds: number) => void;
  onPlaySoundEffect: (type: 'tick' | 'select' | 'submit') => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({
  questions,
  category,
  difficulty,
  timerDurationSeconds,
  negativeMarking,
  soundEnabled,
  onFinishQuiz,
  onPlaySoundEffect,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [remainingSeconds, setRemainingSeconds] = useState<number>(timerDurationSeconds);
  const [totalElapsedTime, setTotalElapsedTime] = useState<number>(0);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const currentQuestion = questions[currentIndex];
  const progressPercent = ((currentIndex + 1) / questions.length) * 100;
  const answeredCount = Object.keys(selectedAnswers).length;
  const unansweredCount = questions.length - answeredCount;

  // Question countdown timer
  useEffect(() => {
    setRemainingSeconds(timerDurationSeconds);

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTotalElapsedTime((prev) => prev + 1);

      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          // Timer expired for this question
          handleAutoAdvance();
          return timerDurationSeconds;
        }

        // Sound effect tick if under 5 seconds
        if (prev <= 5 && soundEnabled) {
          onPlaySoundEffect('tick');
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, timerDurationSeconds]);

  const handleAutoAdvance = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Last question expired - trigger submission
      doSubmit();
    }
  };

  const handleOptionSelect = (optionText: string) => {
    if (isSubmitting) return;
    onPlaySoundEffect('select');
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionText,
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      onPlaySoundEffect('select');
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      onPlaySoundEffect('select');
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const doSubmit = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    if (timerRef.current) clearInterval(timerRef.current);
    onPlaySoundEffect('submit');
    setShowConfirmModal(false);
    onFinishQuiz(selectedAnswers, totalElapsedTime);
  };

  if (!currentQuestion) {
    return (
      <div className="p-8 text-center text-slate-500">
        <p>No questions loaded.</p>
      </div>
    );
  }

  const selectedForCurrent = selectedAnswers[currentIndex];
  const isTimerCritical = remainingSeconds <= 5;
  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <div className="min-h-[85vh] flex flex-col justify-between pb-8 px-4 pt-2 max-w-3xl mx-auto animate-fadeIn select-none">
      {/* 1. Top Header Bar: Progress & Timer */}
      <div className="space-y-3">
        {/* Top Info Row */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 capitalize">
                {currentQuestion.difficulty || difficulty}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">{category.name}</p>
          </div>

          {/* Animated Timer Pill */}
          <div
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-2xl font-mono text-xs font-bold border transition-all ${
              isTimerCritical
                ? 'bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-800 animate-bounce'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 shadow-xs'
            }`}
          >
            <Clock className={`w-3.5 h-3.5 ${isTimerCritical ? 'text-rose-600 animate-spin' : 'text-indigo-600'}`} />
            <span>00:{remainingSeconds.toString().padStart(2, '0')}</span>
          </div>
        </div>

        {/* Linear Progress Bar */}
        <div className="relative w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-300 ease-out rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 2. Question Card & Multiple Choice Options */}
      <div className="my-auto py-4 space-y-5">
        {/* Question Prompt */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2 block">
              Question #{currentIndex + 1}
            </span>
            <span className="text-[10px] text-slate-400 font-semibold">
              +4 Marks {negativeMarking ? '(-1 if wrong)' : ''}
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
            {currentQuestion.question}
          </h2>
        </div>

        {/* 4 Options Grid */}
        <div className="space-y-2.5">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedForCurrent === option;
            const letter = optionLetters[idx] || `${idx + 1}`;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleOptionSelect(option)}
                className={`w-full p-4 rounded-2xl text-left border transition-all flex items-center justify-between group active:scale-[0.99] ${
                  isSelected
                    ? 'bg-indigo-50/90 dark:bg-indigo-950/60 border-indigo-600 dark:border-indigo-500 shadow-md ring-2 ring-indigo-600 dark:ring-indigo-500'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-750 shadow-xs'
                }`}
              >
                <div className="flex items-center space-x-3.5 flex-1 pr-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs transition-colors shrink-0 ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 group-hover:bg-indigo-100 group-hover:text-indigo-600 dark:group-hover:bg-indigo-900/50'
                    }`}
                  >
                    {letter}
                  </div>
                  <span
                    className={`text-xs sm:text-sm font-semibold transition-colors leading-relaxed ${
                      isSelected
                        ? 'text-indigo-900 dark:text-indigo-100 font-bold'
                        : 'text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {option}
                  </span>
                </div>

                {isSelected ? (
                  <CheckCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600 group-hover:border-indigo-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Bottom Navigation & Action Controls */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between space-x-3">
        {/* Previous Button */}
        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className={`px-4 py-3 rounded-2xl font-bold text-xs flex items-center space-x-1.5 transition-all ${
            currentIndex === 0
              ? 'bg-slate-100 dark:bg-slate-800/50 text-slate-400 dark:text-slate-600 cursor-not-allowed'
              : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 active:scale-95'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Quick Question Bubble Indicator Navigator */}
        <div className="hidden md:flex items-center space-x-1 overflow-x-auto max-w-[200px] py-1">
          {questions.map((_, idx) => {
            const isAnswered = selectedAnswers[idx] !== undefined;
            const isCurrent = idx === currentIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`w-6 h-6 rounded-full text-[10px] font-bold transition-all shrink-0 ${
                  isCurrent
                    ? 'ring-2 ring-indigo-600 bg-indigo-600 text-white'
                    : isAnswered
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {/* Next / Submit Button */}
        {currentIndex < questions.length - 1 ? (
          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-extrabold text-xs shadow-md shadow-indigo-600/25 flex items-center space-x-1.5 transition-all"
          >
            <span>Next Question</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setShowConfirmModal(true)}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-95 text-white font-extrabold text-xs shadow-md shadow-emerald-600/25 flex items-center space-x-1.5 transition-all"
          >
            <span>Submit Quiz</span>
            <Flag className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Confirmation Modal Before Submission */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Submit Quiz?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Are you sure you want to finalize your answers?
              </p>
            </div>

            {/* Answered summary stats */}
            <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-center">
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Answered</span>
                <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                  {answeredCount} Qs
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Unanswered</span>
                <span className="text-sm font-extrabold text-amber-600 dark:text-amber-400">
                  {unansweredCount} Qs
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="w-1/2 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-600"
              >
                Keep Reviewing
              </button>
              <button
                type="button"
                onClick={doSubmit}
                className="w-1/2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md shadow-indigo-600/25"
              >
                Yes, Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
