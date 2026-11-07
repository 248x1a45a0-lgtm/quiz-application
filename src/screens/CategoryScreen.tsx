import React, { useState } from 'react';
import {
  Search,
  ArrowRight,
  Globe,
  Atom,
  Calculator,
  Cpu,
  Code,
  Smartphone,
  Hourglass,
  Compass,
  Trophy,
  BookOpen,
  Flame,
  Brain,
  Filter,
} from 'lucide-react';
import { QUIZ_CATEGORIES } from '../data/categories';
import { QuizCategory } from '../types/quiz';

interface CategoryScreenProps {
  onSelectCategory: (category: QuizCategory) => void;
  onPlaySound?: () => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Globe,
  Atom,
  Calculator,
  Cpu,
  Code,
  Smartphone,
  Hourglass,
  Compass,
  Trophy,
  BookOpen,
  Flame,
  Brain,
};

export const CategoryScreen: React.FC<CategoryScreenProps> = ({
  onSelectCategory,
  onPlaySound,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>(
    'all'
  );

  const filteredCategories = QUIZ_CATEGORIES.filter((cat) => {
    const matchesSearch =
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty =
      difficultyFilter === 'all' || cat.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="space-y-4 pb-20 px-4 pt-3 max-w-4xl mx-auto animate-fadeIn">
      {/* Title & Description */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
          Quiz Categories
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Choose from 12 structured academic and trivia disciplines
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search categories (e.g. Science, Programming)..."
            className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white shadow-xs"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Clear
            </button>
          )}
        </div>

        {/* Difficulty Filter Chips */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[11px] font-semibold text-slate-400 flex items-center mr-1">
            <Filter className="w-3 h-3 mr-1" /> Filter:
          </span>
          {(['all', 'easy', 'medium', 'hard'] as const).map((diff) => (
            <button
              key={diff}
              onClick={() => {
                onPlaySound?.();
                setDifficultyFilter(diff);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-colors ${
                difficultyFilter === diff
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Categories Grid */}
      {filteredCategories.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <Brain className="w-10 h-10 text-slate-400 mx-auto mb-2 opacity-60" />
          <p className="font-semibold text-slate-700 dark:text-slate-200 text-sm">
            No matching categories found
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Try adjusting your search keywords or clear the difficulty filter.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setDifficultyFilter('all');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-semibold hover:bg-indigo-100"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          {filteredCategories.map((category) => {
            const Icon = ICON_MAP[category.iconName] || Brain;

            return (
              <div
                key={category.id}
                className="rounded-2xl p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col justify-between hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-500 transition-all group"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${category.color} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${category.badgeBg}`}
                    >
                      {category.difficulty}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {category.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    {category.questionCount}+ Questions
                  </span>

                  <button
                    onClick={() => {
                      onPlaySound?.();
                      onSelectCategory(category);
                    }}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs shadow-xs transition-all"
                  >
                    <span>Start Quiz</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
