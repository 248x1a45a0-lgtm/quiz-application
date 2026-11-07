import React, { useState } from 'react';
import {
  History,
  Calendar,
  Clock,
  Trash2,
  AlertTriangle,
  ChevronRight,
  Award,
  CheckCircle2,
  FolderOpen,
} from 'lucide-react';
import { QuizHistoryItem } from '../types/quiz';

interface HistoryScreenProps {
  history: QuizHistoryItem[];
  onClearHistory: () => void;
  onPlaySound?: () => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  history,
  onClearHistory,
  onPlaySound,
}) => {
  const [selectedItem, setSelectedItem] = useState<QuizHistoryItem | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);

  const confirmClear = () => {
    onPlaySound?.();
    onClearHistory();
    setShowClearConfirm(false);
  };

  return (
    <div className="space-y-4 pb-20 px-4 pt-3 max-w-2xl mx-auto animate-fadeIn select-none">
      {/* Header & Clear history button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
            <span>Quiz History</span>
            <History className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Log of all completed test sessions ({history.length} records)
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={() => {
              onPlaySound?.();
              setShowClearConfirm(true);
            }}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* History Items List */}
      {history.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
          <FolderOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
            No quiz records found
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Complete your first quiz to generate permanent performance history.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {history.map((item) => {
            const isPassing = item.percentage >= 75;
            const isAverage = item.percentage >= 50 && item.percentage < 75;

            return (
              <div
                key={item.id}
                onClick={() => {
                  onPlaySound?.();
                  setSelectedItem(item);
                }}
                className="cursor-pointer p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all flex items-center justify-between group shadow-xs"
              >
                <div className="flex items-center space-x-3.5">
                  <div
                    className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-bold text-xs shrink-0 ${
                      isPassing
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                        : isAverage
                        ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                        : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                    }`}
                  >
                    <span className="text-sm font-black font-mono">{item.percentage}%</span>
                    <span className="text-[9px] uppercase font-bold tracking-tight">Score</span>
                  </div>

                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {item.categoryName}
                    </h4>
                    <div className="flex items-center space-x-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      <span className="capitalize font-semibold">{item.difficulty}</span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{item.date}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 block">
                      {item.correctCount}/{item.totalQuestions} Correct
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {item.scoreObtained}/{item.maxMarks} marks
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Quiz Details
              </span>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕ Close
              </button>
            </div>

            <div className="text-center py-2">
              <h3 className="font-black text-lg text-slate-900 dark:text-white">
                {selectedItem.categoryName}
              </h3>
              <p className="text-xs text-slate-500 capitalize mt-0.5">
                {selectedItem.difficulty} Difficulty Level
              </p>
              <div className="my-4 inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border-2 border-indigo-500 font-mono text-2xl font-black text-indigo-600 dark:text-indigo-300">
                {selectedItem.percentage}%
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-700/60">
                <span className="text-slate-500">Date & Time</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedItem.date}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-700/60">
                <span className="text-slate-500">Correct Answers</span>
                <span className="font-bold text-emerald-600">
                  {selectedItem.correctCount} / {selectedItem.totalQuestions}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-700/60">
                <span className="text-slate-500">Total Marks</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  {selectedItem.scoreObtained} / {selectedItem.maxMarks}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Time Taken</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {Math.floor(selectedItem.timeTakenSeconds / 60)}m{' '}
                  {selectedItem.timeTakenSeconds % 60}s
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedItem(null)}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Clear All History?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Are you sure you want to erase all your past quiz performance logs?
              </p>
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="w-1/2 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmClear}
                className="w-1/2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
