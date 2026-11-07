import {
  UserProfile,
  QuizHistoryItem,
  QuizQuestion,
  AppSettings,
  LeaderboardEntry,
} from '../types/quiz';

const KEYS = {
  PROFILE: 'quizmaster_user_profile',
  CUSTOM_QUESTIONS: 'quizmaster_custom_questions',
  HISTORY: 'quizmaster_quiz_history',
  SETTINGS: 'quizmaster_app_settings',
  LEADERBOARD: 'quizmaster_leaderboard',
};

const DEFAULT_PROFILE: UserProfile = {
  name: 'Alex Rivera (Team Lead)',
  avatar: '👨‍🎓',
  email: '248x1a45a0@khitguntur.ac.in',
  title: 'KHIT QuizMaster Lead',
  college: 'Kallam Haranadhareddy Institute of Technology (KHIT)',
  department: 'Computer Science & Engineering',
  teamName: 'KHIT QuizMaster Group Alpha',
  teamMembers: [
    {
      id: 'khit-1',
      name: 'P. Sai Kumar (Lead)',
      rollNo: '248X1A45A0',
      role: 'Project Lead & Architecture',
      avatar: '👨‍💻',
      contribution: 'Flutter Architecture, Provider State Management & UI Integration',
    },
    {
      id: 'khit-2',
      name: 'K. Bhavya Sri',
      rollNo: '248X1A45A1',
      role: 'Frontend UI/UX Engineer',
      avatar: '👩‍💻',
      contribution: 'Material Design 3 Components, Screens 1 to 7 & Theme Switching',
    },
    {
      id: 'khit-3',
      name: 'M. Venkata Dinesh',
      rollNo: '248X1A45A2',
      role: 'API & Backend Integration',
      avatar: '👨‍🔬',
      contribution: 'Open Trivia DB API, HTML decoding & Offline Question Bank',
    },
    {
      id: 'khit-4',
      name: 'Ch. Ananya Reddy',
      rollNo: '248X1A45A3',
      role: 'Database & QA Testing',
      avatar: '👩‍🎓',
      contribution: 'SQLite/SharedPreferences, Custom Quiz CRUD & Widget Testing',
    },
  ],
  totalQuizzes: 12,
  totalCorrect: 86,
  highestScore: 98,
  averagePercentage: 82.5,
  favouriteCategory: 'Computer Science',
  joinedDate: 'November 2026',
};

const DEFAULT_SETTINGS: AppSettings = {
  darkMode: false,
  soundEffects: true,
  timerDurationSeconds: 30,
  defaultDifficulty: 'medium',
  negativeMarking: false,
  marksPerQuestion: 4,
  vibrationHaptics: true,
};

const INITIAL_CUSTOM_QUESTIONS: QuizQuestion[] = [
  {
    id: 'custom-1',
    category: 'Computer Science',
    difficulty: 'medium',
    question: 'What is the purpose of the virtual DOM in modern frontend frameworks like React?',
    options: [
      'To minimize expensive browser repaint and reflow operations',
      'To bypass JavaScript security restrictions',
      'To convert TypeScript code into WebAssembly',
      'To provide direct access to the computer CPU registers',
    ],
    correctAnswer: 'To minimize expensive browser repaint and reflow operations',
    explanation: 'The virtual DOM allows React to compute minimal real DOM diffs (reconciliation) before updating the actual browser DOM.',
    isCustom: true,
  },
  {
    id: 'custom-2',
    category: 'Programming',
    difficulty: 'easy',
    question: 'In Flutter, what is the base class for widgets that do not require mutable state?',
    options: ['StatelessWidget', 'StatefulWidget', 'InheritedWidget', 'CanvasWidget'],
    correctAnswer: 'StatelessWidget',
    explanation: 'StatelessWidget is an immutable widget whose configuration and UI are built once and never change dynamically.',
    isCustom: true,
  },
  {
    id: 'custom-3',
    category: 'General Knowledge',
    difficulty: 'easy',
    question: 'Which planet is known as the "Red Planet" in our solar system?',
    options: ['Mars', 'Venus', 'Jupiter', 'Mercury'],
    correctAnswer: 'Mars',
    explanation: 'Mars appears reddish because of the widespread iron oxide (rust) on its surface.',
    isCustom: true,
  },
];

const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  {
    id: 'lead-1',
    rank: 1,
    name: 'Sophia Chen',
    avatar: '👩‍🔬',
    points: 2840,
    highestScore: 100,
    quizzesCompleted: 34,
    accuracy: 94,
    badge: 'Trivia Grandmaster',
  },
  {
    id: 'lead-2',
    rank: 2,
    name: 'Marcus Vance',
    avatar: '👨‍💻',
    points: 2510,
    highestScore: 98,
    quizzesCompleted: 29,
    accuracy: 91,
    badge: 'Code Guru',
  },
  {
    id: 'lead-3',
    rank: 3,
    name: 'Amina Al-Mansoor',
    avatar: '👩‍🎓',
    points: 2390,
    highestScore: 95,
    quizzesCompleted: 26,
    accuracy: 89,
    badge: 'Scholar',
  },
  {
    id: 'lead-4',
    rank: 4,
    name: 'Alex Rivera (You)',
    avatar: '👨‍🎓',
    points: 1980,
    highestScore: 98,
    quizzesCompleted: 12,
    accuracy: 82,
    badge: 'Rising Star',
    isCurrentUser: true,
  },
  {
    id: 'lead-5',
    rank: 5,
    name: 'Liam Gallagher',
    avatar: '🏃‍♂️',
    points: 1740,
    highestScore: 88,
    quizzesCompleted: 21,
    accuracy: 79,
    badge: 'Sports Wizard',
  },
  {
    id: 'lead-6',
    rank: 6,
    name: 'Elena Rostova',
    avatar: '🎨',
    points: 1520,
    highestScore: 85,
    quizzesCompleted: 18,
    accuracy: 76,
    badge: 'History Buff',
  },
  {
    id: 'lead-7',
    rank: 7,
    name: 'Devin Brooks',
    avatar: '🚀',
    points: 1390,
    highestScore: 82,
    quizzesCompleted: 15,
    accuracy: 74,
    badge: 'Brainiac',
  },
];

export const storageService = {
  // Profile
  getProfile(): UserProfile {
    try {
      const data = localStorage.getItem(KEYS.PROFILE);
      if (!data) return DEFAULT_PROFILE;
      const parsed = JSON.parse(data);
      return {
        ...DEFAULT_PROFILE,
        ...parsed,
        teamMembers: parsed.teamMembers && parsed.teamMembers.length > 0 ? parsed.teamMembers : DEFAULT_PROFILE.teamMembers,
      };
    } catch {
      return DEFAULT_PROFILE;
    }
  },

  saveProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save profile:', e);
    }
  },

  // Settings
  getSettings(): AppSettings {
    try {
      const data = localStorage.getItem(KEYS.SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: AppSettings): void {
    try {
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  },

  // Custom Questions
  getCustomQuestions(): QuizQuestion[] {
    try {
      const data = localStorage.getItem(KEYS.CUSTOM_QUESTIONS);
      if (!data) {
        this.saveCustomQuestions(INITIAL_CUSTOM_QUESTIONS);
        return INITIAL_CUSTOM_QUESTIONS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_CUSTOM_QUESTIONS;
    }
  },

  saveCustomQuestions(questions: QuizQuestion[]): void {
    try {
      localStorage.setItem(KEYS.CUSTOM_QUESTIONS, JSON.stringify(questions));
    } catch (e) {
      console.error('Failed to save custom questions:', e);
    }
  },

  addCustomQuestion(question: QuizQuestion): void {
    const list = this.getCustomQuestions();
    const updated = [question, ...list];
    this.saveCustomQuestions(updated);
  },

  updateCustomQuestion(question: QuizQuestion): void {
    const list = this.getCustomQuestions();
    const index = list.findIndex((q) => q.id === question.id);
    if (index !== -1) {
      list[index] = question;
      this.saveCustomQuestions(list);
    }
  },

  deleteCustomQuestion(id: string): void {
    const list = this.getCustomQuestions();
    const filtered = list.filter((q) => q.id !== id);
    this.saveCustomQuestions(filtered);
  },

  clearCustomQuestions(): void {
    try {
      localStorage.removeItem(KEYS.CUSTOM_QUESTIONS);
    } catch (e) {
      console.error('Failed to clear custom questions:', e);
    }
  },

  // Quiz History
  getHistory(): QuizHistoryItem[] {
    try {
      const data = localStorage.getItem(KEYS.HISTORY);
      if (!data) {
        const initialHistory: QuizHistoryItem[] = [
          {
            id: 'hist-sample-1',
            categoryName: 'Computer Science',
            difficulty: 'medium',
            date: 'Today, 10:45 AM',
            scoreObtained: 36,
            maxMarks: 40,
            percentage: 90,
            correctCount: 9,
            totalQuestions: 10,
            timeTakenSeconds: 114,
          },
          {
            id: 'hist-sample-2',
            categoryName: 'Science',
            difficulty: 'easy',
            date: 'Yesterday, 4:20 PM',
            scoreObtained: 20,
            maxMarks: 20,
            percentage: 100,
            correctCount: 5,
            totalQuestions: 5,
            timeTakenSeconds: 48,
          },
          {
            id: 'hist-sample-3',
            categoryName: 'General Knowledge',
            difficulty: 'hard',
            date: 'Nov 05, 2:15 PM',
            scoreObtained: 28,
            maxMarks: 40,
            percentage: 70,
            correctCount: 7,
            totalQuestions: 10,
            timeTakenSeconds: 165,
          },
        ];
        this.saveHistory(initialHistory);
        return initialHistory;
      }
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  saveHistory(history: QuizHistoryItem[]): void {
    try {
      localStorage.setItem(KEYS.HISTORY, JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save history:', e);
    }
  },

  addHistoryItem(item: QuizHistoryItem): void {
    const history = this.getHistory();
    const updated = [item, ...history];
    this.saveHistory(updated);

    // Update user profile statistics
    const profile = this.getProfile();
    const newTotalQuizzes = profile.totalQuizzes + 1;
    const newTotalCorrect = profile.totalCorrect + item.correctCount;
    const newHighestScore = Math.max(profile.highestScore, item.percentage);
    const newAveragePercentage = Math.round(
      (profile.averagePercentage * profile.totalQuizzes + item.percentage) / newTotalQuizzes
    );

    this.saveProfile({
      ...profile,
      totalQuizzes: newTotalQuizzes,
      totalCorrect: newTotalCorrect,
      highestScore: newHighestScore,
      averagePercentage: newAveragePercentage,
      favouriteCategory: item.categoryName,
    });

    // Update Leaderboard entry for current user
    this.updateLeaderboardPoints(item.scoreObtained, item.percentage);
  },

  clearHistory(): void {
    try {
      localStorage.removeItem(KEYS.HISTORY);
    } catch (e) {
      console.error('Failed to clear history:', e);
    }
  },

  // Leaderboard
  getLeaderboard(): LeaderboardEntry[] {
    try {
      const data = localStorage.getItem(KEYS.LEADERBOARD);
      return data ? JSON.parse(data) : INITIAL_LEADERBOARD;
    } catch {
      return INITIAL_LEADERBOARD;
    }
  },

  updateLeaderboardPoints(newPoints: number, accuracy: number): void {
    const list = this.getLeaderboard();
    const userIndex = list.findIndex((item) => item.isCurrentUser);
    if (userIndex !== -1) {
      const user = list[userIndex];
      user.points += newPoints * 10;
      user.quizzesCompleted += 1;
      user.highestScore = Math.max(user.highestScore, accuracy);
      user.accuracy = Math.round((user.accuracy + accuracy) / 2);

      // Re-sort by points descending and recalculate ranks
      list.sort((a, b) => b.points - a.points);
      list.forEach((entry, idx) => {
        entry.rank = idx + 1;
      });
      localStorage.setItem(KEYS.LEADERBOARD, JSON.stringify(list));
    }
  },

  // Reset Everything
  resetAll(): void {
    try {
      localStorage.removeItem(KEYS.PROFILE);
      localStorage.removeItem(KEYS.CUSTOM_QUESTIONS);
      localStorage.removeItem(KEYS.HISTORY);
      localStorage.removeItem(KEYS.SETTINGS);
      localStorage.removeItem(KEYS.LEADERBOARD);
    } catch (e) {
      console.error('Failed to reset data:', e);
    }
  },
};
