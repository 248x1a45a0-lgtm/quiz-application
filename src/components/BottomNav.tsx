import React from 'react';
import { Home, Layers, PlusCircle, Trophy, User } from 'lucide-react';
import { ScreenId } from '../types/quiz';

interface BottomNavProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  soundEnabled?: boolean;
  onPlaySound?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentScreen,
  onNavigate,
  onPlaySound,
}) => {
  const tabs = [
    { id: 'home' as ScreenId, label: 'Home', icon: Home },
    { id: 'categories' as ScreenId, label: 'Categories', icon: Layers },
    { id: 'custom_list' as ScreenId, label: 'Custom', icon: PlusCircle },
    { id: 'leaderboard' as ScreenId, label: 'Rankings', icon: Trophy },
    { id: 'profile' as ScreenId, label: 'Profile', icon: User },
  ];

  const handleTabClick = (screen: ScreenId) => {
    onPlaySound?.();
    onNavigate(screen);
  };

  return (
    <nav className="border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-2 py-1.5 transition-colors z-40">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive =
            currentScreen === tab.id ||
            (tab.id === 'categories' &&
              (currentScreen === 'difficulty' || currentScreen === 'instructions')) ||
            (tab.id === 'custom_list' && currentScreen === 'custom_create');
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className="flex flex-col items-center justify-center flex-1 py-1 transition-all group"
            >
              <div
                className={`relative px-4 py-1 rounded-full transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-400 scale-105'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                {isActive && (
                  <span className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
                )}
              </div>
              <span
                className={`text-[11px] mt-0.5 font-medium transition-colors ${
                  isActive
                    ? 'font-bold text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
