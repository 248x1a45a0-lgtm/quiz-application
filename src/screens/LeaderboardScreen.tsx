import React, { useState } from 'react';
import {
  Trophy,
  Crown,
  Medal,
  Award,
  Sparkles,
  Search,
  Users,
  Flame,
} from 'lucide-react';
import { LeaderboardEntry } from '../types/quiz';

interface LeaderboardScreenProps {
  entries: LeaderboardEntry[];
  onPlaySound?: () => void;
}

export const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({
  entries,
  onPlaySound,
}) => {
  const [tab, setTab] = useState<'all' | 'weekly' | 'khit'>('all');

  const top3 = entries.slice(0, 3);
  const others = entries.slice(3);
  const currentUser = entries.find((e) => e.isCurrentUser);

  return (
    <div className="space-y-5 pb-20 px-4 pt-3 max-w-2xl mx-auto animate-fadeIn select-none">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
          <span>QuizMaster Leaderboard</span>
          <Trophy className="w-5 h-5 text-amber-500" />
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Top performers and academic standings across all quiz categories
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800">
        <button
          onClick={() => {
            onPlaySound?.();
            setTab('all');
          }}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            tab === 'all'
              ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          All-Time Masters
        </button>
        <button
          onClick={() => {
            onPlaySound?.();
            setTab('weekly');
          }}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            tab === 'weekly'
              ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Weekly Sprint
        </button>
        <button
          onClick={() => {
            onPlaySound?.();
            setTab('khit');
          }}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            tab === 'khit'
              ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          KHIT Classmates
        </button>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-3 gap-2 pt-6 items-end">
        {/* 2nd Place: Silver */}
        {top3[1] && (
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-slate-300 to-slate-400 p-0.5 shadow-md flex items-center justify-center text-2xl relative">
              <span className="w-full h-full bg-slate-100 dark:bg-slate-800 rounded-[14px] flex items-center justify-center">
                {top3[1].avatar}
              </span>
              <span className="absolute -bottom-2 px-2 py-0.5 rounded-full bg-slate-400 text-white font-extrabold text-[10px] shadow-xs">
                #2
              </span>
            </div>
            <h4 className="font-bold text-xs text-slate-800 dark:text-white mt-3 text-center line-clamp-1">
              {top3[1].name}
            </h4>
            <span className="text-[11px] font-extrabold text-indigo-600 dark:text-indigo-400 mt-0.5">
              {top3[1].points} pts
            </span>
            <div className="w-full h-20 rounded-t-2xl bg-gradient-to-b from-slate-200 to-slate-100 dark:from-slate-750 dark:to-slate-800 mt-2 flex items-center justify-center">
              <Medal className="w-6 h-6 text-slate-400" />
            </div>
          </div>
        )}

        {/* 1st Place: Gold */}
        {top3[0] && (
          <div className="flex flex-col items-center">
            <Crown className="w-6 h-6 text-amber-500 fill-amber-400 animate-bounce mb-1" />
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-500 p-0.5 shadow-xl flex items-center justify-center text-3xl relative">
              <span className="w-full h-full bg-amber-50 dark:bg-slate-850 rounded-[14px] flex items-center justify-center">
                {top3[0].avatar}
              </span>
              <span className="absolute -bottom-2 px-2.5 py-0.5 rounded-full bg-amber-500 text-white font-black text-[10px] shadow-sm">
                #1
              </span>
            </div>
            <h4 className="font-extrabold text-xs text-slate-900 dark:text-white mt-3 text-center line-clamp-1">
              {top3[0].name}
            </h4>
            <span className="text-xs font-black text-amber-600 dark:text-amber-400 mt-0.5">
              {top3[0].points} pts
            </span>
            <div className="w-full h-28 rounded-t-2xl bg-gradient-to-b from-amber-200 via-amber-100 to-amber-50 dark:from-amber-950/60 dark:to-slate-800 mt-2 flex items-center justify-center shadow-xs">
              <Trophy className="w-8 h-8 text-amber-500" />
            </div>
          </div>
        )}

        {/* 3rd Place: Bronze */}
        {top3[2] && (
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-700 to-orange-800 p-0.5 shadow-md flex items-center justify-center text-2xl relative">
              <span className="w-full h-full bg-orange-50 dark:bg-slate-800 rounded-[14px] flex items-center justify-center">
                {top3[2].avatar}
              </span>
              <span className="absolute -bottom-2 px-2 py-0.5 rounded-full bg-amber-700 text-white font-extrabold text-[10px] shadow-xs">
                #3
              </span>
            </div>
            <h4 className="font-bold text-xs text-slate-800 dark:text-white mt-3 text-center line-clamp-1">
              {top3[2].name}
            </h4>
            <span className="text-[11px] font-extrabold text-indigo-600 dark:text-indigo-400 mt-0.5">
              {top3[2].points} pts
            </span>
            <div className="w-full h-16 rounded-t-2xl bg-gradient-to-b from-orange-200 to-orange-100 dark:from-orange-950/60 dark:to-slate-800 mt-2 flex items-center justify-center">
              <Award className="w-5 h-5 text-amber-700" />
            </div>
          </div>
        )}
      </div>

      {/* Current User Floating Highlight Card */}
      {currentUser && (
        <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 border-2 border-indigo-500 text-indigo-950 dark:text-indigo-100 flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-3">
            <span className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-xs">
              #{currentUser.rank}
            </span>
            <span className="text-xl">{currentUser.avatar}</span>
            <div>
              <h4 className="font-extrabold text-xs text-slate-900 dark:text-white flex items-center space-x-1.5">
                <span>{currentUser.name}</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-indigo-600 text-white font-bold">
                  YOU
                </span>
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                {currentUser.quizzesCompleted} quizzes • {currentUser.accuracy}% accuracy
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="font-mono text-sm font-black text-indigo-600 dark:text-indigo-400">
              {currentUser.points} pts
            </span>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">High: {currentUser.highestScore}%</p>
          </div>
        </div>
      )}

      {/* Ranks 4+ List */}
      <div className="p-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-700/60 shadow-xs">
        {others.map((entry) => (
          <div
            key={entry.id}
            className={`p-3 flex items-center justify-between transition-colors ${
              entry.isCurrentUser ? 'bg-indigo-50/60 dark:bg-indigo-950/40' : 'hover:bg-slate-50 dark:hover:bg-slate-750'
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className="w-6 text-center font-bold text-xs text-slate-400">
                #{entry.rank}
              </span>
              <span className="text-xl">{entry.avatar}</span>
              <div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                  {entry.name}
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  {entry.quizzesCompleted} completed • {entry.accuracy}% acc
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                {entry.points} pts
              </span>
              <p className="text-[10px] text-slate-400">{entry.highestScore}% top</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
