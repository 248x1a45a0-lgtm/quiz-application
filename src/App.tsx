import React, { useState, useEffect } from 'react';
import {
  ScreenId,
  QuizCategory,
  Difficulty,
  QuizQuestion,
  QuizResult,
  UserProfile,
  AppSettings,
  QuizHistoryItem,
  LeaderboardEntry,
} from './types/quiz';
import { QUIZ_CATEGORIES } from './data/categories';
import { apiService } from './services/apiService';
import { storageService } from './services/storageService';
import { soundService } from './services/soundService';

// Components & Screens
import { AndroidStatusBar } from './components/AndroidStatusBar';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { FlutterProjectModal } from './components/FlutterProjectModal';

import { SplashScreen } from './screens/SplashScreen';
import { HomeScreen } from './screens/HomeScreen';
import { CategoryScreen } from './screens/CategoryScreen';
import { DifficultyScreen } from './screens/DifficultyScreen';
import { InstructionsScreen } from './screens/InstructionsScreen';
import { QuizScreen } from './screens/QuizScreen';
import { ResultScreen } from './screens/ResultScreen';
import { ReviewScreen } from './screens/ReviewScreen';
import { CustomQuizScreen } from './screens/CustomQuizScreen';
import { CustomQuestionListScreen } from './screens/CustomQuestionListScreen';
import { LeaderboardScreen } from './screens/LeaderboardScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { SettingsScreen } from './screens/SettingsScreen';

export default function App() {
  // Navigation State
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('splash');
  const [screenStack, setScreenStack] = useState<ScreenId[]>([]);

  // Persistent States
  const [profile, setProfile] = useState<UserProfile>(() => storageService.getProfile());
  const [settings, setSettings] = useState<AppSettings>(() => storageService.getSettings());
  const [history, setHistory] = useState<QuizHistoryItem[]>(() => storageService.getHistory());
  const [customQuestions, setCustomQuestions] = useState<QuizQuestion[]>(() =>
    storageService.getCustomQuestions()
  );
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() =>
    storageService.getLeaderboard()
  );

  // Active Quiz Configuration State
  const [activeCategory, setActiveCategory] = useState<QuizCategory>(QUIZ_CATEGORIES[0]);
  const [activeDifficulty, setActiveDifficulty] = useState<Difficulty>('medium');
  const [activeQuestionCount, setActiveQuestionCount] = useState<number>(10);
  const [activeTimerPerQuestion, setActiveTimerPerQuestion] = useState<number>(30);
  const [activeNegativeMarking, setActiveNegativeMarking] = useState<boolean>(false);

  // Active Quiz Runtime State
  const [activeQuizQuestions, setActiveQuizQuestions] = useState<QuizQuestion[]>([]);
  const [activeQuizResult, setActiveQuizResult] = useState<QuizResult | null>(null);
  const [isLoadingQuiz, setIsLoadingQuiz] = useState<boolean>(false);

  // UI Modes
  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(true);
  const [isFlutterHubOpen, setIsFlutterHubOpen] = useState<boolean>(false);

  // Apply dark mode class to <html>
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  // Navigation Helpers
  const navigateTo = (screen: ScreenId, addToStack = true) => {
    if (addToStack && currentScreen !== 'splash' && currentScreen !== screen) {
      setScreenStack((prev) => [...prev, currentScreen]);
    }
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    if (screenStack.length > 0) {
      const prevScreen = screenStack[screenStack.length - 1];
      setScreenStack((prev) => prev.slice(0, prev.length - 1));
      setCurrentScreen(prevScreen);
    } else {
      setCurrentScreen('home');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sound Helper
  const playSoundEffect = (type: 'tick' | 'select' | 'submit') => {
    if (!settings.soundEffects) return;
    if (type === 'tick') soundService.playTick(true);
    else if (type === 'select') soundService.playOptionSelect(true);
    else if (type === 'submit') soundService.playComplete(true);
  };

  // Select a category from Home or CategoryScreen
  const handleSelectCategory = (category: QuizCategory) => {
    setActiveCategory(category);
    setActiveDifficulty(category.difficulty || settings.defaultDifficulty);
    navigateTo('difficulty');
  };

  // Proceed to Instructions
  const handleProceedToInstructions = (config: {
    difficulty: Difficulty;
    questionCount: number;
    timerPerQuestion: number;
    negativeMarking: boolean;
  }) => {
    setActiveDifficulty(config.difficulty);
    setActiveQuestionCount(config.questionCount);
    setActiveTimerPerQuestion(config.timerPerQuestion);
    setActiveNegativeMarking(config.negativeMarking);
    navigateTo('instructions');
  };

  // Start live quiz (fetching Open Trivia DB or internal questions)
  const handleStartQuiz = async () => {
    setIsLoadingQuiz(true);
    try {
      const { questions } = await apiService.fetchQuestions({
        categoryKey: activeCategory.id,
        numericCategoryId: activeCategory.numericId,
        difficulty: activeDifficulty,
        amount: activeQuestionCount,
        customQuestions,
      });

      setActiveQuizQuestions(questions);
      setIsLoadingQuiz(false);
      navigateTo('quiz', false);
    } catch (err) {
      console.error('Failed to start quiz:', err);
      setIsLoadingQuiz(false);
    }
  };

  // Start Quick Daily Quiz Challenge
  const handleStartDailyQuiz = () => {
    const randomCat = QUIZ_CATEGORIES[Math.floor(Math.random() * QUIZ_CATEGORIES.length)];
    setActiveCategory(randomCat);
    setActiveDifficulty('medium');
    setActiveQuestionCount(10);
    setActiveTimerPerQuestion(30);
    setActiveNegativeMarking(false);
    handleStartQuiz();
  };

  // Start Custom Quiz using user-created questions
  const handleStartCustomQuiz = () => {
    if (customQuestions.length === 0) return;
    const customCat: QuizCategory = {
      id: 'custom',
      name: 'Custom Questions',
      iconName: 'PlusCircle',
      description: 'Your privately authored question repository',
      questionCount: customQuestions.length,
      difficulty: 'medium',
      color: 'from-purple-600 to-indigo-700',
      badgeBg: 'bg-purple-100 text-purple-800',
    };
    setActiveCategory(customCat);
    setActiveDifficulty('medium');
    setActiveQuestionCount(Math.min(customQuestions.length, 10));
    setActiveTimerPerQuestion(30);
    setActiveNegativeMarking(false);
    handleStartQuiz();
  };

  // Finish Quiz and compile result
  const handleFinishQuiz = (userAnswers: Record<number, string>, timeTakenSeconds: number) => {
    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;

    activeQuizQuestions.forEach((q, idx) => {
      const selected = userAnswers[idx];
      if (!selected) {
        unansweredCount++;
      } else if (selected === q.correctAnswer) {
        correctCount++;
      } else {
        incorrectCount++;
      }
    });

    const marksPerQ = settings.marksPerQuestion || 4;
    const positiveMarks = correctCount * marksPerQ;
    const penalty = activeNegativeMarking ? incorrectCount * 1 : 0;
    const totalMarks = Math.max(0, positiveMarks - penalty);
    const maxMarks = activeQuizQuestions.length * marksPerQ;
    const percentage =
      activeQuizQuestions.length > 0
        ? Math.round((correctCount / activeQuizQuestions.length) * 100)
        : 0;

    const result: QuizResult = {
      id: `res-${Date.now()}`,
      categoryName: activeCategory.name,
      difficulty: activeDifficulty,
      totalQuestions: activeQuizQuestions.length,
      correctAnswers: correctCount,
      incorrectAnswers: incorrectCount,
      unansweredQuestions: unansweredCount,
      totalMarks,
      maxMarks,
      percentage,
      timeTakenSeconds,
      completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      negativeMarking: activeNegativeMarking,
      questions: activeQuizQuestions,
      userAnswers,
    };

    setActiveQuizResult(result);

    // Save history record
    const historyItem: QuizHistoryItem = {
      id: result.id,
      categoryName: result.categoryName,
      difficulty: result.difficulty,
      date: 'Just now',
      scoreObtained: result.totalMarks,
      maxMarks: result.maxMarks,
      percentage: result.percentage,
      correctCount: result.correctAnswers,
      totalQuestions: result.totalQuestions,
      timeTakenSeconds,
    };

    storageService.addHistoryItem(historyItem);
    setHistory(storageService.getHistory());
    setProfile(storageService.getProfile());
    setLeaderboard(storageService.getLeaderboard());

    navigateTo('result', false);
  };

  // Profile Updates
  const handleUpdateProfile = (updated: UserProfile) => {
    storageService.saveProfile(updated);
    setProfile(updated);
  };

  // Settings Updates
  const handleUpdateSettings = (newSettings: AppSettings) => {
    storageService.saveSettings(newSettings);
    setSettings(newSettings);
  };

  // Custom Questions Updates
  const handleSaveCustomQuestion = (newQuestion: QuizQuestion) => {
    storageService.addCustomQuestion(newQuestion);
    setCustomQuestions(storageService.getCustomQuestions());
  };

  const handleUpdateCustomQuestion = (updated: QuizQuestion) => {
    storageService.updateCustomQuestion(updated);
    setCustomQuestions(storageService.getCustomQuestions());
  };

  const handleDeleteCustomQuestion = (id: string) => {
    storageService.deleteCustomQuestion(id);
    setCustomQuestions(storageService.getCustomQuestions());
  };

  // Clear data methods
  const handleClearHistory = () => {
    storageService.clearHistory();
    setHistory([]);
    setProfile(storageService.getProfile());
  };

  const handleClearCustomQuestions = () => {
    storageService.clearCustomQuestions();
    setCustomQuestions([]);
  };

  const handleResetAllData = () => {
    storageService.resetAll();
    setProfile(storageService.getProfile());
    setSettings(storageService.getSettings());
    setHistory(storageService.getHistory());
    setCustomQuestions(storageService.getCustomQuestions());
    setLeaderboard(storageService.getLeaderboard());
    setCurrentScreen('home');
  };

  // Dynamic titles for header
  const getHeaderTitle = () => {
    switch (currentScreen) {
      case 'categories':
        return { title: 'Categories', subtitle: '12 Available Subjects' };
      case 'difficulty':
        return { title: activeCategory.name, subtitle: 'Difficulty & Parameters' };
      case 'instructions':
        return { title: 'Instructions', subtitle: `${activeCategory.name} Quiz` };
      case 'quiz':
        return { title: 'Live Quiz', subtitle: activeCategory.name };
      case 'result':
        return { title: 'Quiz Scorecard', subtitle: activeCategory.name };
      case 'review':
        return { title: 'Answer Review', subtitle: 'Detailed Explanations' };
      case 'custom_create':
        return { title: 'Create Question', subtitle: 'Author Custom Quiz' };
      case 'custom_list':
        return { title: 'Custom Bank', subtitle: `${customQuestions.length} Saved Questions` };
      case 'leaderboard':
        return { title: 'Leaderboard', subtitle: 'Top Academic Rankings' };
      case 'history':
        return { title: 'Quiz History', subtitle: `${history.length} Completed Sessions` };
      case 'profile':
        return { title: 'User Profile', subtitle: 'KHIT QuizMaster Team' };
      case 'settings':
        return { title: 'Settings', subtitle: 'App Preferences & Theme' };
      default:
        return { title: 'QuizMaster', subtitle: 'KHIT Smart Quiz' };
    }
  };

  const headerInfo = getHeaderTitle();
  const showBottomNav =
    currentScreen !== 'splash' && currentScreen !== 'quiz' && currentScreen !== 'result';

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col items-center justify-start antialiased transition-colors">
      {/* Device wrapper container */}
      <div
        className={`w-full transition-all duration-300 ${
          isPhoneFrame
            ? 'max-w-md my-0 sm:my-6 rounded-none sm:rounded-[40px] shadow-2xl border-0 sm:border-8 sm:border-slate-800 dark:sm:border-slate-850 overflow-hidden bg-slate-50 dark:bg-slate-900 min-h-screen sm:min-h-[844px]'
            : 'max-w-4xl min-h-screen bg-slate-50 dark:bg-slate-900'
        }`}
      >
        {/* Android Status Bar (Shown in mobile mockup mode or on small screens) */}
        <AndroidStatusBar />

        {/* Top App Header (Hidden on Splash Screen) */}
        {currentScreen !== 'splash' && (
          <Header
            title={headerInfo.title}
            subtitle={headerInfo.subtitle}
            currentScreen={currentScreen}
            onBack={screenStack.length > 0 ? handleBack : undefined}
            onNavigate={(screen) => navigateTo(screen)}
            darkMode={settings.darkMode}
            onToggleDarkMode={() =>
              handleUpdateSettings({ ...settings, darkMode: !settings.darkMode })
            }
            isPhoneFrame={isPhoneFrame}
            onTogglePhoneFrame={() => setIsPhoneFrame(!isPhoneFrame)}
            onOpenFlutterHub={() => setIsFlutterHubOpen(true)}
            onPlaySound={() => soundService.playClick(settings.soundEffects)}
          />
        )}

        {/* Main Screen Views */}
        <main className="relative flex-1">
          {/* Loading overlay when preparing quiz questions */}
          {isLoadingQuiz && (
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-xs text-white">
              <div className="w-12 h-12 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin mb-4" />
              <h3 className="font-extrabold text-base">Loading Quiz Questions...</h3>
              <p className="text-xs text-indigo-300 mt-1">
                Connecting to Open Trivia DB & Question Bank
              </p>
            </div>
          )}

          {/* Screen 1: Splash Screen */}
          {currentScreen === 'splash' && (
            <SplashScreen onComplete={() => setCurrentScreen('home')} />
          )}

          {/* Screen 2: Home Screen */}
          {currentScreen === 'home' && (
            <HomeScreen
              profile={profile}
              history={history}
              onSelectCategory={handleSelectCategory}
              onNavigate={(screen) => navigateTo(screen)}
              onStartDailyQuiz={handleStartDailyQuiz}
              onPlaySound={() => soundService.playClick(settings.soundEffects)}
            />
          )}

          {/* Screen 3: Quiz Categories */}
          {currentScreen === 'categories' && (
            <CategoryScreen
              onSelectCategory={handleSelectCategory}
              onPlaySound={() => soundService.playClick(settings.soundEffects)}
            />
          )}

          {/* Screen 4: Difficulty Selection */}
          {currentScreen === 'difficulty' && (
            <DifficultyScreen
              category={activeCategory}
              onProceedToInstructions={handleProceedToInstructions}
              onPlaySound={() => soundService.playClick(settings.soundEffects)}
            />
          )}

          {/* Screen 5: Quiz Instructions */}
          {currentScreen === 'instructions' && (
            <InstructionsScreen
              category={activeCategory}
              difficulty={activeDifficulty}
              questionCount={activeQuestionCount}
              timerPerQuestion={activeTimerPerQuestion}
              negativeMarking={activeNegativeMarking}
              onStartQuiz={handleStartQuiz}
              onBack={handleBack}
              onPlaySound={() => soundService.playClick(settings.soundEffects)}
            />
          )}

          {/* Screen 6: Live Quiz Gameplay Screen */}
          {currentScreen === 'quiz' && (
            <QuizScreen
              questions={activeQuizQuestions}
              category={activeCategory}
              difficulty={activeDifficulty}
              timerDurationSeconds={activeTimerPerQuestion}
              negativeMarking={activeNegativeMarking}
              soundEnabled={settings.soundEffects}
              onFinishQuiz={handleFinishQuiz}
              onPlaySoundEffect={playSoundEffect}
            />
          )}

          {/* Screen 7: Results Scorecard */}
          {currentScreen === 'result' && activeQuizResult && (
            <ResultScreen
              result={activeQuizResult}
              onReviewAnswers={() => navigateTo('review')}
              onRetryQuiz={handleStartQuiz}
              onGoHome={() => navigateTo('home')}
              onPlaySound={() => soundService.playClick(settings.soundEffects)}
            />
          )}

          {/* Screen 8: Answer Review */}
          {currentScreen === 'review' && activeQuizResult && (
            <ReviewScreen
              result={activeQuizResult}
              onBackToResults={() => navigateTo('result')}
              onPlaySound={() => soundService.playClick(settings.soundEffects)}
            />
          )}

          {/* Screen 9: Custom Quiz Creation */}
          {currentScreen === 'custom_create' && (
            <CustomQuizScreen
              onSaveQuestion={handleSaveCustomQuestion}
              onViewList={() => navigateTo('custom_list')}
              existingQuestions={customQuestions}
              onPlaySound={() => soundService.playClick(settings.soundEffects)}
            />
          )}

          {/* Screen 10: Custom Quiz List */}
          {currentScreen === 'custom_list' && (
            <CustomQuestionListScreen
              questions={customQuestions}
              onAddNew={() => navigateTo('custom_create')}
              onUpdateQuestion={handleUpdateCustomQuestion}
              onDeleteQuestion={handleDeleteCustomQuestion}
              onStartCustomQuiz={handleStartCustomQuiz}
              onPlaySound={() => soundService.playClick(settings.soundEffects)}
            />
          )}

          {/* Screen 11: Leaderboard */}
          {currentScreen === 'leaderboard' && (
            <LeaderboardScreen
              entries={leaderboard}
              onPlaySound={() => soundService.playClick(settings.soundEffects)}
            />
          )}

          {/* Screen 12: Quiz History */}
          {currentScreen === 'history' && (
            <HistoryScreen
              history={history}
              onClearHistory={handleClearHistory}
              onPlaySound={() => soundService.playClick(settings.soundEffects)}
            />
          )}

          {/* Screen 13: User Profile with KHIT Team Members List */}
          {currentScreen === 'profile' && (
            <ProfileScreen
              profile={profile}
              onUpdateProfile={handleUpdateProfile}
              onPlaySound={() => soundService.playClick(settings.soundEffects)}
            />
          )}

          {/* Screen 14: Settings Screen */}
          {currentScreen === 'settings' && (
            <SettingsScreen
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              onClearHistory={handleClearHistory}
              onClearCustomQuestions={handleClearCustomQuestions}
              onResetAllData={handleResetAllData}
              onOpenFlutterHub={() => setIsFlutterHubOpen(true)}
              onPlaySoundTest={() => soundService.playComplete(true)}
            />
          )}
        </main>

        {/* Material 3 Bottom Navigation Bar */}
        {showBottomNav && (
          <BottomNav
            currentScreen={currentScreen}
            onNavigate={(screen) => navigateTo(screen)}
            onPlaySound={() => soundService.playClick(settings.soundEffects)}
          />
        )}
      </div>

      {/* Flutter Source Code, GitHub Project & Viva Submission Modal */}
      <FlutterProjectModal
        isOpen={isFlutterHubOpen}
        onClose={() => setIsFlutterHubOpen(false)}
        onPlaySound={() => soundService.playClick(settings.soundEffects)}
      />
    </div>
  );
}
