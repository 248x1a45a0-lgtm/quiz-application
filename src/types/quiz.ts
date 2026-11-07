export type Difficulty = 'easy' | 'medium' | 'hard';

export interface QuizQuestion {
  id: string;
  category: string;
  categoryId?: number;
  difficulty: Difficulty;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  isCustom?: boolean;
}

export interface QuizCategory {
  id: string;
  numericId?: number; // OpenTDB category ID
  name: string;
  iconName: string;
  description: string;
  questionCount: number;
  difficulty: Difficulty;
  color: string;
  badgeBg: string;
}

export interface QuizResult {
  id: string;
  categoryName: string;
  difficulty: Difficulty;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unansweredQuestions: number;
  totalMarks: number;
  maxMarks: number;
  percentage: number;
  timeTakenSeconds: number;
  completedAt: string;
  negativeMarking: boolean;
  questions: QuizQuestion[];
  userAnswers: Record<number, string>; // question index -> selected option
}

export interface QuizHistoryItem {
  id: string;
  categoryName: string;
  difficulty: Difficulty;
  date: string;
  scoreObtained: number;
  maxMarks: number;
  percentage: number;
  correctCount: number;
  totalQuestions: number;
  timeTakenSeconds: number;
}

export interface TeamMember {
  id: string;
  name: string;
  rollNo: string;
  role: string;
  avatar: string;
  contribution: string;
}

export interface UserProfile {
  name: string;
  avatar: string;
  email: string;
  title: string;
  college: string;
  department: string;
  teamName: string;
  teamMembers: TeamMember[];
  totalQuizzes: number;
  totalCorrect: number;
  highestScore: number;
  averagePercentage: number;
  favouriteCategory: string;
  joinedDate: string;
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  avatar: string;
  points: number;
  highestScore: number;
  quizzesCompleted: number;
  accuracy: number;
  badge?: string;
  isCurrentUser?: boolean;
}

export interface AppSettings {
  darkMode: boolean;
  soundEffects: boolean;
  timerDurationSeconds: number; // e.g. 15, 30, 45, 60
  defaultDifficulty: Difficulty;
  negativeMarking: boolean; // -1 for wrong answer
  marksPerQuestion: number; // e.g. 4 or 10
  vibrationHaptics: boolean;
}

export type ScreenId =
  | 'splash'
  | 'home'
  | 'categories'
  | 'difficulty'
  | 'instructions'
  | 'quiz'
  | 'result'
  | 'review'
  | 'custom_create'
  | 'custom_list'
  | 'leaderboard'
  | 'history'
  | 'profile'
  | 'settings'
  | 'flutter_hub';
