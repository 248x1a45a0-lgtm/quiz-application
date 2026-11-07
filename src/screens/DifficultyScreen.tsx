import React, { useState } from 'react';
import {
  ShieldCheck,
  Zap,
  Flame,
  Clock,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Check,
} from 'lucide-react';
import { QuizCategory, Difficulty } from '../types/quiz';

interface DifficultyScreenProps {
  category: QuizCategory;
  onProceedToInstructions: (config: {
    difficulty: Difficulty;
    questionCount: number;
    timerPerQuestion: number;
    negativeMarking: boolean;
  }) => void;
  onPlaySound?: () => void;
}

export const DifficultyScreen: React.FC<DifficultyScreenProps> = ({
  category,
  onProceedToInstructions,
  onPlaySound,
}) => {
  const [difficulty, setDifficulty] = useState<Difficulty>(category.difficulty || 'medium');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [timerPerQuestion, setTimerPerQuestion] = useState<number>(30);
  const [negativeMarking, setNegativeMarking] = useState<boolean>(false);

  const difficultyOptions = [
    {
      id: 'easy' as Difficulty,
      title: 'Easy',
      desc: 'Ideal for beginners and quick warm-ups. Standard questions with clear answers.',
      icon: ShieldCheck,
      color: 'from-emerald-500 to-teal-600',
      border: 'border-emerald-500',
      badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
    },
    {
      id: 'medium' as Difficulty,
      title: 'Medium',
      desc: 'Balanced mix of conceptual, intermediate and trivia questions.',
      icon: Zap,
      color: 'from-amber-500 to-orange-600',
      border: 'border-amber-500',
      badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
    },
    {
      id: 'hard' as Difficulty,
      title: 'Hard',
      desc: 'Deep analytical and advanced questions to truly test your expertise.',
      icon: Flame,
      color: 'from-rose-500 to-red-700',
      border: 'border-rose-500',
      badge: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300',
    },
  ];

  const handleStart = () => {
    onPlaySound?.();
    onProceedToInstructions({
      difficulty,
      questionCount,
      timerPerQuestion,
      negativeMarking,
    });
  };

  return (
    <div className="space-y-6 pb-20 px-4 pt-3 max-w-2xl mx-auto animate-fadeIn">
      {/* Category Header banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 flex items-center space-x-3.5">
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${category.color} text-white flex items-center justify-center shadow-sm shrink-0`}
        >
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Selected Category
          </span>
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
            {category.name}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure your quiz parameters before testing your knowledge
          </p>
        </div>
      </div>

      {/* Step 1: Select Difficulty */}
      <div className="space-y-2.5">
        <label className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center justify-between">
          <span>1. Select Difficulty Level</span>
          <span className="text-[11px] text-indigo-600 dark:text-indigo-400 capitalize font-bold">
            {difficulty} mode
          </span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {difficultyOptions.map((opt) => {
            const isSelected = difficulty === opt.id;
            const Icon = opt.icon;

            return (
              <div
                key={opt.id}
                onClick={() => {
                  onPlaySound?.();
                  setDifficulty(opt.id);
                }}
                className={`relative cursor-pointer p-4 rounded-2xl border transition-all text-left ${
                  isSelected
                    ? `bg-white dark:bg-slate-800 ring-2 ring-indigo-600 dark:ring-indigo-400 border-transparent shadow-md`
                    : `bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600`
                }`}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
                <div
                  className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${opt.color} text-white flex items-center justify-center shadow-xs mb-3`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {opt.title}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                  {opt.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 2: Number of Questions */}
      <div className="space-y-2.5">
        <label className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center justify-between">
          <span>2. Number of Questions</span>
          <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold">
            {questionCount} Questions
          </span>
        </label>

        <div className="grid grid-cols-4 gap-2.5">
          {[5, 10, 15, 20].map((count) => {
            const isSelected = questionCount === count;
            return (
              <button
                key={count}
                type="button"
                onClick={() => {
                  onPlaySound?.();
                  setQuestionCount(count);
                }}
                className={`py-3 rounded-2xl font-extrabold text-sm transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 scale-102'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                {count} Qs
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 3: Timer & Marking options */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4">
        {/* Timer selection */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Time Per Question</span>
            </span>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
              {timerPerQuestion}s / Q
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[15, 30, 45].map((sec) => (
              <button
                key={sec}
                type="button"
                onClick={() => {
                  onPlaySound?.();
                  setTimerPerQuestion(sec);
                }}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${
                  timerPerQuestion === sec
                    ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700'
                    : 'bg-slate-50 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                {sec} Seconds
              </button>
            ))}
          </div>
        </div>

        {/* Negative marking switch */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
              <HelpCircle className="w-4 h-4 text-slate-500" />
              <span>Negative Marking</span>
            </span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {negativeMarking
                ? 'Enabled: +4 for correct, -1 for wrong answer'
                : 'Disabled: +4 for correct, 0 for wrong answer'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              onPlaySound?.();
              setNegativeMarking(!negativeMarking);
            }}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              negativeMarking ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                negativeMarking ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Start Quiz CTA */}
      <button
        onClick={handleStart}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 hover:from-indigo-700 hover:to-purple-800 active:scale-98 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/25 flex items-center justify-center space-x-2 transition-all"
      >
        <span>View Instructions & Start</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
