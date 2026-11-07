import React, { useState } from 'react';
import {
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Clock,
  ShieldAlert,
  Trash2,
  RotateCcw,
  Info,
  Shield,
  Award,
  CheckCircle2,
  HelpCircle,
  Code2,
} from 'lucide-react';
import { AppSettings, Difficulty } from '../types/quiz';

interface SettingsScreenProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onClearHistory: () => void;
  onClearCustomQuestions: () => void;
  onResetAllData: () => void;
  onOpenFlutterHub: () => void;
  onPlaySoundTest?: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
  onClearHistory,
  onClearCustomQuestions,
  onResetAllData,
  onOpenFlutterHub,
  onPlaySoundTest,
}) => {
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    onUpdateSettings({
      ...settings,
      [key]: value,
    });
  };

  return (
    <div className="space-y-6 pb-20 px-4 pt-3 max-w-2xl mx-auto animate-fadeIn select-none">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
          Application Settings
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Customize theme, timers, sounds, and local data preferences
        </p>
      </div>

      {toastMessage && (
        <div className="p-3 rounded-2xl bg-indigo-600 text-white text-xs font-semibold flex items-center space-x-2 shadow-md animate-fadeIn">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Appearance & Theme */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
        <h3 className="font-extrabold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          Appearance & Sound
        </h3>

        {/* Theme mode toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              {settings.darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-amber-500" />}
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Dark Theme</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {settings.darkMode ? 'Night mode active' : 'Day mode active'}
              </p>
            </div>
          </div>

          <button
            onClick={() => updateSetting('darkMode', !settings.darkMode)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
              settings.darkMode ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                settings.darkMode ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Sound effects toggle */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-slate-700 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              {settings.soundEffects ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Audio & Sound FX</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Timer ticks, chimes, and results fanfare
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {settings.soundEffects && (
              <button
                type="button"
                onClick={onPlaySoundTest}
                className="px-2 py-1 rounded-lg text-[10px] font-bold bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
              >
                Test FX
              </button>
            )}

            <button
              onClick={() => updateSetting('soundEffects', !settings.soundEffects)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                settings.soundEffects ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                  settings.soundEffects ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Quiz Preferences */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
        <h3 className="font-extrabold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          Quiz Defaults
        </h3>

        {/* Timer duration */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Default Countdown Timer</span>
            </span>
            <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400">
              {settings.timerDurationSeconds}s / question
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[15, 30, 45, 60].map((sec) => (
              <button
                key={sec}
                onClick={() => updateSetting('timerDurationSeconds', sec)}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${
                  settings.timerDurationSeconds === sec
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-750 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {sec}s
              </button>
            ))}
          </div>
        </div>

        {/* Default Difficulty */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Default Difficulty
            </span>
            <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 capitalize">
              {settings.defaultDifficulty}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {(['easy', 'medium', 'hard'] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => updateSetting('defaultDifficulty', diff)}
                className={`py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                  settings.defaultDifficulty === diff
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-750 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Negative marking default */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Negative Marking</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {settings.negativeMarking ? 'Deduct 1 mark for wrong answers' : 'No penalty marks for wrong answers'}
            </p>
          </div>
          <button
            onClick={() => updateSetting('negativeMarking', !settings.negativeMarking)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
              settings.negativeMarking ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                settings.negativeMarking ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* 3. Flutter Source Code Hub shortcut */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-indigo-950/40 border border-indigo-200 dark:border-indigo-900 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Flutter Code & Submission Hub</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Download ZIP project, view Dart classes & Viva guide
            </p>
          </div>
        </div>
        <button
          onClick={onOpenFlutterHub}
          className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 shadow-xs"
        >
          Open Hub
        </button>
      </div>

      {/* 4. Data Management & Clear */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
        <h3 className="font-extrabold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          Storage & Reset Data
        </h3>

        <div className="space-y-2">
          <button
            onClick={() => {
              onClearHistory();
              showToast('Quiz history erased.');
            }}
            className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-750 hover:bg-slate-100 dark:hover:bg-slate-700 text-left flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors"
          >
            <span>Clear Quiz History Records</span>
            <Trash2 className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={() => {
              onClearCustomQuestions();
              showToast('Custom questions cleared.');
            }}
            className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-750 hover:bg-slate-100 dark:hover:bg-slate-700 text-left flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors"
          >
            <span>Clear Custom Created Questions</span>
            <Trash2 className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-left flex items-center justify-between text-xs font-bold text-rose-600 dark:text-rose-400 transition-colors border border-rose-200 dark:border-rose-900/60"
          >
            <span>Factory Reset All App Data</span>
            <RotateCcw className="w-4 h-4 text-rose-600" />
          </button>
        </div>
      </div>

      {/* 5. About & Privacy */}
      <div className="flex items-center justify-between px-2 text-xs">
        <button
          onClick={() => setShowAboutModal(true)}
          className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center space-x-1"
        >
          <Info className="w-3.5 h-3.5" />
          <span>About QuizMaster & KHIT Project</span>
        </button>

        <span className="text-slate-400 text-[11px]">v3.2.0 • Release Ready</span>
      </div>

      {/* About Modal */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center mx-auto mb-2 shadow-md">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                QuizMaster – Smart Quiz
              </h3>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">
                Version 3.2.0 (Material Design 3)
              </p>
            </div>

            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-750 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700">
              <p>
                <strong>Institution:</strong> Kallam Haranadhareddy Institute of Technology (KHIT), Guntur
              </p>
              <p>
                <strong>Department:</strong> Computer Science and Engineering
              </p>
              <p>
                <strong>Technologies:</strong> Flutter 3.35, Dart with Null Safety, Provider (ChangeNotifier), SQLite/SharedPreferences, Open Trivia DB API.
              </p>
              <p>
                <strong>Privacy Policy:</strong> All your custom questions, scores, and quiz histories are stored 100% locally on your device. No telemetry or unauthorized external sharing.
              </p>
            </div>

            <button
              onClick={() => setShowAboutModal(false)}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Reset Confirm Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Reset All App Data?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                This will wipe all custom questions, history records, and restore default KHIT team profile.
              </p>
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="w-1/2 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-750 text-slate-700 dark:text-slate-200 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onResetAllData();
                  setShowResetConfirm(false);
                  showToast('All app data has been factory reset.');
                }}
                className="w-1/2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md"
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
