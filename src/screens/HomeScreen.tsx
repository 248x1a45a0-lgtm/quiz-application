import React from 'react';
import {
  Trophy,
  Flame,
  Clock,
  ArrowRight,
  TrendingUp,
  Award,
  Sparkles,
  BookOpen,
  PlusCircle,
  Play,
  CheckCircle2,
  Users,
} from 'lucide-react';
import { QUIZ_CATEGORIES } from '../data/categories';
import {
  UserProfile,
  QuizCategory,
  QuizHistoryItem,
  ScreenId,
} from '../types/quiz';

interface HomeScreenProps {
  profile: UserProfile;
  history: QuizHistoryItem[];
  onSelectCategory: (category: QuizCategory) => void;
  onNavigate: (screen: ScreenId) => void;
  onStartDailyQuiz: () => void;
  onPlaySound?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  profile,
  history,
  onSelectCategory,
  onNavigate,
  onStartDailyQuiz,
  onPlaySound,
}) => {
  const recentHistory = history.slice(0, 3);
  const featuredCategories = QUIZ_CATEGORIES.slice(0, 6);

  return (
    <div className="space-y-6 pb-20 px-4 pt-3 max-w-4xl mx-auto animate-fadeIn">
      {/* 1. Welcome Profile Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-800 text-white p-5 shadow-xl shadow-indigo-500/15">
        <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-2 right-4 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-md flex items-center space-x-1 border border-white/20">
          <Award className="w-3.5 h-3.5 text-amber-300" />
          <span>KHIT CSE</span>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              onPlaySound?.();
              onNavigate('profile');
            }}
            className="w-16 h-16 rounded-2xl bg-white/20 border-2 border-white/30 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner hover:scale-105 transition-transform"
            title="View Profile"
          >
            {profile.avatar}
          </button>
          <div>
            <span className="text-xs font-semibold text-indigo-200 uppercase tracking-wider">
              Welcome back 👋
            </span>
            <h2 className="text-xl font-extrabold text-white leading-tight">
              {profile.name}
            </h2>
            <p className="text-xs text-indigo-100/90 font-medium mt-0.5 flex items-center space-x-1.5">
              <span>{profile.title}</span>
              <span>•</span>
              <span className="text-amber-300 font-semibold">{profile.favouriteCategory}</span>
            </p>
          </div>
        </div>

        {/* User Statistics Row */}
        <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-white/15">
          <div className="text-center p-2 rounded-xl bg-white/10 backdrop-blur-xs">
            <p className="text-[11px] text-indigo-100 font-medium">Quizzes</p>
            <p className="text-lg font-black text-white">{profile.totalQuizzes}</p>
          </div>
          <div className="text-center p-2 rounded-xl bg-white/10 backdrop-blur-xs">
            <p className="text-[11px] text-indigo-100 font-medium">High Score</p>
            <p className="text-lg font-black text-amber-300">{profile.highestScore}%</p>
          </div>
          <div className="text-center p-2 rounded-xl bg-white/10 backdrop-blur-xs">
            <p className="text-[11px] text-indigo-100 font-medium">Avg Accuracy</p>
            <p className="text-lg font-black text-emerald-300">{profile.averagePercentage}%</p>
          </div>
        </div>
      </div>

      {/* 2. Daily Quiz Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 text-white p-4 shadow-lg shadow-orange-500/20 flex items-center justify-between">
        <div className="space-y-1 z-10 max-w-[70%]">
          <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold tracking-wide">
            <Flame className="w-3.5 h-3.5 text-yellow-200 fill-current" />
            <span>DAILY CHALLENGE</span>
          </div>
          <h3 className="font-extrabold text-base text-white">Today’s Brain Teaser</h3>
          <p className="text-xs text-orange-100 font-medium">
            Test your knowledge across mixed subjects • 10 quick MCQs
          </p>
        </div>
        <button
          onClick={() => {
            onPlaySound?.();
            onStartDailyQuiz();
          }}
          className="z-10 px-4 py-2.5 rounded-xl bg-white text-orange-600 font-bold text-xs shadow-md hover:bg-orange-50 active:scale-95 transition-all flex items-center space-x-1.5"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Play Now</span>
        </button>
      </div>

      {/* 3. Quick Action Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <button
          onClick={() => {
            onPlaySound?.();
            onNavigate('categories');
          }}
          className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-left hover:border-indigo-400 dark:hover:border-indigo-500 transition-all group shadow-xs"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform mb-2">
            <BookOpen className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-slate-800 dark:text-white">12 Categories</h4>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Explore subjects</p>
        </button>

        <button
          onClick={() => {
            onPlaySound?.();
            onNavigate('leaderboard');
          }}
          className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-left hover:border-amber-400 dark:hover:border-amber-500 transition-all group shadow-xs"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform mb-2">
            <Trophy className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-slate-800 dark:text-white">Leaderboard</h4>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Top rankers</p>
        </button>

        <button
          onClick={() => {
            onPlaySound?.();
            onNavigate('custom_create');
          }}
          className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-left hover:border-purple-400 dark:hover:border-purple-500 transition-all group shadow-xs"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform mb-2">
            <PlusCircle className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-slate-800 dark:text-white">Create Quiz</h4>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Custom questions</p>
        </button>

        <button
          onClick={() => {
            onPlaySound?.();
            onNavigate('profile');
          }}
          className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-left hover:border-emerald-400 dark:hover:border-emerald-500 transition-all group shadow-xs"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform mb-2">
            <Users className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-slate-800 dark:text-white">KHIT Team</h4>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Project group</p>
        </button>
      </div>

      {/* 4. Quiz Categories Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center space-x-1.5">
              <span>Quiz Categories</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                12 Available
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pick a category to test your knowledge
            </p>
          </div>
          <button
            onClick={() => {
              onPlaySound?.();
              onNavigate('categories');
            }}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-0.5"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {featuredCategories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => {
                onPlaySound?.();
                onSelectCategory(cat);
              }}
              className="group cursor-pointer rounded-2xl p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-500 transition-all relative overflow-hidden"
            >
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${cat.color} text-white flex items-center justify-center shadow-sm mb-3 group-hover:scale-105 transition-transform`}
              >
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                {cat.name}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-snug">
                {cat.description}
              </p>
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/50 text-[10px]">
                <span className="font-semibold text-slate-400 dark:text-slate-500">
                  {cat.questionCount}+ MCQs
                </span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400 capitalize">
                  {cat.difficulty}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Recent Quiz History */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center space-x-1.5">
              <span>Recent Quizzes</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Your latest performance records
            </p>
          </div>
          <button
            onClick={() => {
              onPlaySound?.();
              onNavigate('history');
            }}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-0.5"
          >
            <span>History</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentHistory.length === 0 ? (
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
            <Clock className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No quizzes completed yet
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Select any category above to start your first quiz!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentHistory.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onPlaySound?.();
                  onNavigate('history');
                }}
                className="cursor-pointer p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors shadow-xs"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                      item.percentage >= 75
                        ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300'
                        : item.percentage >= 50
                        ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300'
                        : 'bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300'
                    }`}
                  >
                    {item.percentage}%
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                      {item.categoryName}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center space-x-1.5 mt-0.5">
                      <span>{item.date}</span>
                      <span>•</span>
                      <span className="capitalize">{item.difficulty}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    {item.correctCount}/{item.totalQuestions} Correct
                  </span>
                  <p className="text-[10px] text-slate-400">
                    {item.scoreObtained}/{item.maxMarks} marks
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
