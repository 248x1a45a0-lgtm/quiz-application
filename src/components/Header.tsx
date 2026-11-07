import React from 'react';
import {
  ArrowLeft,
  Settings,
  Moon,
  Sun,
  Code2,
  Smartphone,
  Maximize2,
  Brain,
  History,
} from 'lucide-react';
import { ScreenId } from '../types/quiz';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  currentScreen: ScreenId;
  onBack?: () => void;
  onNavigate: (screen: ScreenId) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  isPhoneFrame: boolean;
  onTogglePhoneFrame: () => void;
  onOpenFlutterHub: () => void;
  onPlaySound?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  currentScreen,
  onBack,
  onNavigate,
  darkMode,
  onToggleDarkMode,
  isPhoneFrame,
  onTogglePhoneFrame,
  onOpenFlutterHub,
  onPlaySound,
}) => {
  const isRootTab = ['home', 'categories', 'custom_list', 'leaderboard', 'profile'].includes(
    currentScreen
  );

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="flex items-center justify-between px-4 py-2.5 max-w-5xl mx-auto">
        {/* Left: Back button or Logo */}
        <div className="flex items-center space-x-2.5">
          {!isRootTab && onBack ? (
            <button
              onClick={() => {
                onPlaySound?.();
                onBack();
              }}
              className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
              title="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={() => {
                onPlaySound?.();
                onNavigate('home');
              }}
              className="flex items-center space-x-2 text-left group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-extrabold text-base tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-purple-300 bg-clip-text text-transparent leading-none">
                  QuizMaster
                </h1>
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                  KHIT Smart Quiz
                </span>
              </div>
            </button>
          )}

          {/* Title when inner screen */}
          {!isRootTab && title && (
            <div className="ml-1 leading-tight">
              <h2 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                {title}
              </h2>
              {subtitle && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                  {subtitle}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Right action icons */}
        <div className="flex items-center space-x-1 sm:space-x-1.5">
          {/* Flutter Source Code Hub Button */}
          <button
            onClick={() => {
              onPlaySound?.();
              onOpenFlutterHub();
            }}
            className="flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/70 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 transition-all shadow-xs"
            title="Flutter & Dart Source Code Export Hub"
          >
            <Code2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="hidden sm:inline">Flutter Code</span>
            <span className="bg-indigo-600 text-white text-[9px] px-1.5 py-0.2 rounded-full font-bold">
              Dart
            </span>
          </button>

          {/* Quick History Button */}
          <button
            onClick={() => {
              onPlaySound?.();
              onNavigate('history');
            }}
            className={`p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
              currentScreen === 'history' ? 'bg-slate-100 dark:bg-slate-800 text-indigo-600' : ''
            }`}
            title="Quiz History"
          >
            <History className="w-4 h-4" />
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={() => {
              onPlaySound?.();
              onToggleDarkMode();
            }}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Desktop/Phone View Toggle (visible on medium/large screens) */}
          <button
            onClick={() => {
              onPlaySound?.();
              onTogglePhoneFrame();
            }}
            className="hidden md:flex p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isPhoneFrame ? 'Expand to Fullscreen View' : 'Switch to Mobile Frame'}
          >
            {isPhoneFrame ? (
              <Maximize2 className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            ) : (
              <Smartphone className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            )}
          </button>

          {/* Settings shortcut */}
          <button
            onClick={() => {
              onPlaySound?.();
              onNavigate('settings');
            }}
            className={`p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
              currentScreen === 'settings' ? 'bg-slate-100 dark:bg-slate-800 text-indigo-600' : ''
            }`}
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
