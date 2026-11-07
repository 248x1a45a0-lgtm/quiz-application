import React from 'react';
import {
  Clock,
  Award,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { QuizCategory, Difficulty } from '../types/quiz';

interface InstructionsScreenProps {
  category: QuizCategory;
  difficulty: Difficulty;
  questionCount: number;
  timerPerQuestion: number;
  negativeMarking: boolean;
  onStartQuiz: () => void;
  onBack: () => void;
  onPlaySound?: () => void;
}

export const InstructionsScreen: React.FC<InstructionsScreenProps> = ({
  category,
  difficulty,
  questionCount,
  timerPerQuestion,
  negativeMarking,
  onStartQuiz,
  onBack,
  onPlaySound,
}) => {
  const totalSeconds = questionCount * timerPerQuestion;
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;
  const timeFormatted =
    minutes > 0 ? `${minutes}m ${remainingSeconds > 0 ? `${remainingSeconds}s` : ''}` : `${totalSeconds}s`;

  const rules = [
    {
      title: 'Four Multiple Choice Options',
      desc: 'Each question presents 4 distinct options (A, B, C, D). Only one option is correct.',
    },
    {
      title: 'Per-Question Countdown Timer',
      desc: `You have ${timerPerQuestion} seconds for each question. The screen will automatically progress if time expires.`,
    },
    {
      title: 'Flexible Navigation & Answer Saving',
      desc: 'You can navigate freely using Previous and Next buttons. Your selected choices remain saved.',
    },
    {
      title: 'Scoring & Marking Scheme',
      desc: negativeMarking
        ? 'Earn +4 marks for every correct answer. A deduction of -1 mark applies for incorrect choices.'
        : 'Earn +4 marks for every correct answer. Zero penalty marks for incorrect or unanswered questions.',
    },
    {
      title: 'Submission & Review',
      desc: 'A confirmation dialog will appear before final submission. After completion, access full answer reviews with explanations.',
    },
  ];

  return (
    <div className="space-y-6 pb-20 px-4 pt-3 max-w-2xl mx-auto animate-fadeIn">
      {/* Category & Mode Summary Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-800 text-white shadow-xl shadow-indigo-600/15">
        <div className="flex items-center space-x-3.5 mb-4">
          <div
            className={`w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-xl shadow-sm`}
          >
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-200">
              Quiz Confirmation
            </span>
            <h2 className="text-xl font-extrabold text-white leading-tight">
              {category.name}
            </h2>
            <p className="text-xs text-indigo-100 font-medium capitalize mt-0.5">
              {difficulty} Difficulty • Standard Academic MCQ
            </p>
          </div>
        </div>

        {/* 4 Key Quiz Parameters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-white/15">
          <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs text-center">
            <span className="text-[10px] text-indigo-200 block font-medium">Questions</span>
            <span className="text-base font-extrabold text-white">{questionCount} MCQs</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs text-center">
            <span className="text-[10px] text-indigo-200 block font-medium">Est. Duration</span>
            <span className="text-base font-extrabold text-white">{timeFormatted}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs text-center">
            <span className="text-[10px] text-indigo-200 block font-medium">Correct Mark</span>
            <span className="text-base font-extrabold text-emerald-300">+4 Marks</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs text-center">
            <span className="text-[10px] text-indigo-200 block font-medium">Negative</span>
            <span
              className={`text-base font-extrabold ${
                negativeMarking ? 'text-rose-300' : 'text-slate-200'
              }`}
            >
              {negativeMarking ? '-1 Mark' : 'None'}
            </span>
          </div>
        </div>
      </div>

      {/* Rules Checklist */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Rules & Guidelines</span>
        </h3>

        <div className="space-y-3.5">
          {rules.map((rule, idx) => (
            <div key={idx} className="flex items-start space-x-3">
              <div className="w-5 h-5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  {rule.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  {rule.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => {
            onPlaySound?.();
            onBack();
          }}
          className="w-1/3 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          onClick={() => {
            onPlaySound?.();
            onStartQuiz();
          }}
          className="w-2/3 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 hover:from-indigo-700 hover:to-purple-800 active:scale-98 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/25 flex items-center justify-center space-x-2 transition-all"
        >
          <span>Start Now</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
