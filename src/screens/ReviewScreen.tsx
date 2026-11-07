import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowLeft,
  Filter,
  Check,
  X,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { QuizResult } from '../types/quiz';

interface ReviewScreenProps {
  result: QuizResult;
  onBackToResults: () => void;
  onPlaySound?: () => void;
}

export const ReviewScreen: React.FC<ReviewScreenProps> = ({
  result,
  onBackToResults,
  onPlaySound,
}) => {
  const [filter, setFilter] = useState<'all' | 'correct' | 'incorrect' | 'unanswered'>('all');

  const filteredQuestions = result.questions.filter((_, idx) => {
    const selected = result.userAnswers[idx];
    const isAnswered = selected !== undefined && selected !== '';
    const isCorrect = selected === result.questions[idx].correctAnswer;

    if (filter === 'correct') return isCorrect;
    if (filter === 'incorrect') return isAnswered && !isCorrect;
    if (filter === 'unanswered') return !isAnswered;
    return true;
  });

  return (
    <div className="space-y-4 pb-20 px-4 pt-3 max-w-2xl mx-auto animate-fadeIn select-none">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            onPlaySound?.();
            onBackToResults();
          }}
          className="flex items-center space-x-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Results</span>
        </button>

        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
          {result.correctAnswers}/{result.totalQuestions} Correct ({result.percentage}%)
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
        <button
          onClick={() => {
            onPlaySound?.();
            setFilter('all');
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
            filter === 'all'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          All ({result.totalQuestions})
        </button>
        <button
          onClick={() => {
            onPlaySound?.();
            setFilter('correct');
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
            filter === 'correct'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-slate-700'
          }`}
        >
          Correct ({result.correctAnswers})
        </button>
        <button
          onClick={() => {
            onPlaySound?.();
            setFilter('incorrect');
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
            filter === 'incorrect'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 border border-slate-200 dark:border-slate-700'
          }`}
        >
          Incorrect ({result.incorrectAnswers})
        </button>
        <button
          onClick={() => {
            onPlaySound?.();
            setFilter('unanswered');
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
            filter === 'unanswered'
              ? 'bg-slate-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
          }`}
        >
          Unanswered ({result.unansweredQuestions})
        </button>
      </div>

      {/* Questions list */}
      <div className="space-y-4">
        {filteredQuestions.map((q) => {
          const originalIndex = result.questions.findIndex((item) => item.id === q.id);
          const userSelected = result.userAnswers[originalIndex];
          const isAnswered = userSelected !== undefined && userSelected !== '';
          const isCorrect = userSelected === q.correctAnswer;

          return (
            <div
              key={q.id}
              className={`p-5 rounded-2xl border transition-all ${
                isCorrect
                  ? 'bg-white dark:bg-slate-800/90 border-emerald-300 dark:border-emerald-800/80'
                  : !isAnswered
                  ? 'bg-white dark:bg-slate-800/90 border-slate-300 dark:border-slate-700'
                  : 'bg-white dark:bg-slate-800/90 border-rose-300 dark:border-rose-800/80'
              }`}
            >
              {/* Question Status Header */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold text-slate-500 uppercase">
                  Question #{originalIndex + 1}
                </span>

                <span
                  className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    isCorrect
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                      : !isAnswered
                      ? 'bg-slate-100 dark:bg-slate-750 text-slate-600 dark:text-slate-400'
                      : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                  }`}
                >
                  {isCorrect ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Correct (+4)</span>
                    </>
                  ) : !isAnswered ? (
                    <>
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Skipped (0)</span>
                    </>
                  ) : (
                    <>
                      <X className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Incorrect {result.negativeMarking ? '(-1)' : '(0)'}</span>
                    </>
                  )}
                </span>
              </div>

              {/* Question Text */}
              <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-relaxed mb-4">
                {q.question}
              </h3>

              {/* Options display with color highlights */}
              <div className="space-y-2 mb-4">
                {q.options.map((opt, optIdx) => {
                  const isThisCorrect = opt === q.correctAnswer;
                  const isThisSelected = opt === userSelected;

                  let optionStyle =
                    'bg-slate-50 dark:bg-slate-750 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300';

                  if (isThisCorrect) {
                    optionStyle =
                      'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold';
                  } else if (isThisSelected && !isCorrect) {
                    optionStyle =
                      'bg-rose-50 dark:bg-rose-950/70 border-rose-500 text-rose-900 dark:text-rose-200 font-bold';
                  }

                  return (
                    <div
                      key={optIdx}
                      className={`p-3 rounded-xl border text-xs flex items-center justify-between ${optionStyle}`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <span className="w-6 h-6 rounded-lg bg-white/60 dark:bg-slate-800 flex items-center justify-center font-bold text-[11px] shrink-0">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{opt}</span>
                      </div>

                      {isThisCorrect && (
                        <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider shrink-0 ml-2">
                          ✓ Correct Answer
                        </span>
                      )}
                      {isThisSelected && !isCorrect && (
                        <span className="text-[10px] font-extrabold text-rose-600 dark:text-rose-400 uppercase tracking-wider shrink-0 ml-2">
                          ✗ Your Choice
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Explanation section */}
              {q.explanation && (
                <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/60 text-xs">
                  <span className="font-extrabold text-indigo-700 dark:text-indigo-300 block mb-1 flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Explanation & Key Fact:</span>
                  </span>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {q.explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
