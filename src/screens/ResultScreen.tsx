import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  BookOpen,
  Home,
  Share2,
  Award,
  Sparkles,
  HelpCircle,
  Copy,
  Check,
} from 'lucide-react';
import { QuizResult } from '../types/quiz';

interface ResultScreenProps {
  result: QuizResult;
  onReviewAnswers: () => void;
  onRetryQuiz: () => void;
  onGoHome: () => void;
  onPlaySound?: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  result,
  onReviewAnswers,
  onRetryQuiz,
  onGoHome,
  onPlaySound,
}) => {
  const [copied, setCopied] = useState(false);

  // Trigger celebration confetti if passing score
  useEffect(() => {
    if (result.percentage >= 50) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [result.percentage]);

  const getPerformanceData = () => {
    if (result.percentage >= 90) {
      return {
        badge: 'Excellent!',
        sub: 'Masterclass performance! You demonstrated exceptional mastery.',
        color: 'from-emerald-500 to-teal-600',
        bg: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300',
        icon: Trophy,
      };
    }
    if (result.percentage >= 75) {
      return {
        badge: 'Very Good!',
        sub: 'Impressive knowledge! Solid command across concepts.',
        color: 'from-blue-500 to-indigo-600',
        bg: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300',
        icon: Award,
      };
    }
    if (result.percentage >= 50) {
      return {
        badge: 'Good Job!',
        sub: 'Good effort! Review the explanations to reinforce weaker spots.',
        color: 'from-amber-500 to-orange-600',
        bg: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300',
        icon: Sparkles,
      };
    }
    return {
      badge: 'Keep Practising!',
      sub: 'Don’t be discouraged! Review mistakes and try the quiz again.',
      color: 'from-rose-500 to-pink-600',
      bg: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300',
      icon: RotateCcw,
    };
  };

  const perf = getPerformanceData();
  const PerfIcon = perf.icon;

  const minutes = Math.floor(result.timeTakenSeconds / 60);
  const seconds = result.timeTakenSeconds % 60;
  const timeFormatted = `${minutes}m ${seconds}s`;

  const handleShare = async () => {
    onPlaySound?.();
    const shareText = `🎯 QuizMaster - ${result.categoryName} Quiz Results:\nScore: ${result.totalMarks}/${result.maxMarks} (${result.percentage}%)\nAccuracy: ${result.correctAnswers}/${result.totalQuestions} Correct\nGrade: ${perf.badge}\n#QuizMaster #KHITGuntur`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'QuizMaster Results',
          text: shareText,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6 pb-20 px-4 pt-3 max-w-xl mx-auto animate-fadeIn select-none">
      {/* 1. Score Showcase Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white p-6 shadow-2xl shadow-indigo-600/20 text-center">
        {/* Glow ambient background circles */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          {/* Badge Icon */}
          <div
            className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${perf.color} p-0.5 shadow-xl mb-3 flex items-center justify-center`}
          >
            <div className="w-full h-full bg-slate-900/60 rounded-[14px] flex items-center justify-center backdrop-blur-xs">
              <PerfIcon className="w-8 h-8 text-white" />
            </div>
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-indigo-300">
            {result.categoryName} • {result.difficulty}
          </span>

          <h2 className="text-2xl sm:text-3xl font-black mt-1 tracking-tight text-white">
            {perf.badge}
          </h2>
          <p className="text-xs text-indigo-100/90 max-w-sm mt-1 leading-relaxed">
            {perf.sub}
          </p>

          {/* Large percentage circle gauge */}
          <div className="my-6 relative flex items-center justify-center">
            <div className="w-36 h-36 rounded-full border-4 border-white/10 flex flex-col items-center justify-center bg-white/5 backdrop-blur-md shadow-inner">
              <span className="text-4xl font-black tracking-tight text-white font-mono">
                {result.percentage}%
              </span>
              <span className="text-[11px] text-indigo-200 font-bold uppercase mt-0.5">
                Score
              </span>
            </div>
          </div>

          {/* Marks & Time Taken Banner */}
          <div className="w-full grid grid-cols-2 gap-2 pt-4 border-t border-white/15">
            <div className="p-2 rounded-xl bg-white/10 backdrop-blur-xs text-center">
              <span className="text-[10px] text-indigo-200 block font-medium">Marks Obtained</span>
              <span className="text-base font-extrabold text-amber-300 font-mono">
                {result.totalMarks} / {result.maxMarks}
              </span>
            </div>
            <div className="p-2 rounded-xl bg-white/10 backdrop-blur-xs text-center">
              <span className="text-[10px] text-indigo-200 block font-medium">Time Taken</span>
              <span className="text-base font-extrabold text-white font-mono flex items-center justify-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-indigo-300" />
                <span>{timeFormatted}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Breakdown Matrix */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
        <h3 className="font-extrabold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          Performance Breakdown
        </h3>

        <div className="grid grid-cols-3 gap-2.5">
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-100 dark:border-emerald-900/50 text-center">
            <div className="flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-1">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <p className="text-lg font-black text-emerald-700 dark:text-emerald-300">
              {result.correctAnswers}
            </p>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Correct</p>
          </div>

          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-100 dark:border-rose-900/50 text-center">
            <div className="flex items-center justify-center text-rose-600 dark:text-rose-400 mb-1">
              <XCircle className="w-4 h-4" />
            </div>
            <p className="text-lg font-black text-rose-700 dark:text-rose-300">
              {result.incorrectAnswers}
            </p>
            <p className="text-[10px] text-rose-600 dark:text-rose-400 font-bold">Incorrect</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-100 dark:border-slate-700 text-center">
            <div className="flex items-center justify-center text-slate-500 mb-1">
              <HelpCircle className="w-4 h-4" />
            </div>
            <p className="text-lg font-black text-slate-700 dark:text-slate-200">
              {result.unansweredQuestions}
            </p>
            <p className="text-[10px] text-slate-500 font-bold">Unanswered</p>
          </div>
        </div>
      </div>

      {/* 3. Action Buttons */}
      <div className="space-y-2.5">
        <button
          onClick={() => {
            onPlaySound?.();
            onReviewAnswers();
          }}
          className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-extrabold text-xs shadow-md shadow-indigo-600/25 flex items-center justify-center space-x-2 transition-all"
        >
          <BookOpen className="w-4 h-4" />
          <span>Review Answers & Explanations</span>
        </button>

        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => {
              onPlaySound?.();
              onRetryQuiz();
            }}
            className="py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center space-x-1.5 shadow-xs transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Retry</span>
          </button>

          <button
            onClick={handleShare}
            className="py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center space-x-1.5 shadow-xs transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-purple-600" />
                <span>Share</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              onPlaySound?.();
              onGoHome();
            }}
            className="py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center space-x-1.5 shadow-xs transition-colors"
          >
            <Home className="w-3.5 h-3.5 text-slate-600" />
            <span>Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};
