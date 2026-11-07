import React, { useEffect, useState } from 'react';
import { Brain, Sparkles, ArrowRight, Award } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 5;
      });
    }, 90);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      const timeout = setTimeout(() => {
        onComplete();
      }, 400);
      return () => clearTimeout(timeout);
    }
  }, [progress, onComplete]);

  return (
    <div className="relative min-h-[92vh] flex flex-col items-center justify-between p-6 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white overflow-hidden select-none">
      {/* Decorative ambient glowing orbs */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 -right-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-10 w-40 h-40 bg-pink-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Top institution tag */}
      <div className="pt-6 text-center z-10">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-indigo-200">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-semibold tracking-wide">KHIT Guntur • CSE Project</span>
        </div>
      </div>

      {/* Center hero logo & name */}
      <div className="flex flex-col items-center text-center z-10 max-w-sm">
        {/* Animated Icon Container */}
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-2xl shadow-indigo-500/40 animate-pulse">
            <div className="w-full h-full bg-slate-900/90 rounded-[22px] flex items-center justify-center backdrop-blur-xs">
              <Brain className="w-12 h-12 text-indigo-400" />
            </div>
          </div>
          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-400 to-orange-400 p-1.5 rounded-full shadow-lg">
            <Sparkles className="w-4 h-4 text-slate-950" />
          </div>
        </div>

        {/* Application Name */}
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-indigo-100 to-purple-200 bg-clip-text text-transparent">
          QuizMaster
        </h1>
        <p className="text-xs uppercase tracking-widest text-indigo-300 font-bold mt-1">
          Smart Quiz Application
        </p>

        {/* Tagline */}
        <p className="mt-4 text-slate-300 text-sm font-medium leading-relaxed px-4">
          &ldquo;Challenge Your Mind, Improve Your Knowledge&rdquo;
        </p>

        {/* Loading Progress Bar */}
        <div className="w-56 mt-8">
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 transition-all duration-150 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-mono">
            {progress < 100 ? `Loading quiz modules... ${progress}%` : 'Ready to start!'}
          </p>
        </div>
      </div>

      {/* Bottom skip / enter button */}
      <div className="w-full max-w-xs pb-6 z-10">
        <button
          onClick={onComplete}
          className="w-full flex items-center justify-center space-x-2 py-3 px-6 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-98 border border-white/20 backdrop-blur-md text-white font-semibold text-sm transition-all shadow-lg"
        >
          <span>Get Started</span>
          <ArrowRight className="w-4 h-4 text-indigo-300" />
        </button>
        <p className="text-center text-[10px] text-slate-400 mt-3 font-medium">
          Material Design 3 • Android • Flutter
        </p>
      </div>
    </div>
  );
};
