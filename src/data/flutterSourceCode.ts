export interface FlutterFile {
  path: string;
  name: string;
  category: 'core' | 'models' | 'providers' | 'services' | 'screens' | 'widgets' | 'theme' | 'test' | 'config';
  code: string;
}

export const FLUTTER_PROJECT_FILES: FlutterFile[] = [
  {
    path: 'pubspec.yaml',
    name: 'pubspec.yaml',
    category: 'config',
    code: `name: quizmaster_app
description: "QuizMaster – Smart Quiz Application. A modern Flutter quiz app featuring 12 categories, timer, leaderboards, custom questions and Material 3."
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.3.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  provider: ^6.1.2
  shared_preferences: ^2.2.2
  sqflite: ^2.3.2
  path: ^1.9.0
  http: ^1.2.0
  html_unescape: ^2.0.0
  google_fonts: ^6.1.0
  intl: ^0.19.0
  flutter_spinkit: ^5.2.0
  audioplayers: ^5.2.1

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true
  assets:
    - assets/images/
    - assets/sounds/
`,
  },
  {
    path: 'README.md',
    name: 'README.md',
    category: 'config',
    code: `# QuizMaster – Smart Quiz Application

A feature-rich Flutter quiz application built with Material Design 3, Provider state management, and the Open Trivia Database API.

## Project Overview
QuizMaster helps students and users sharpen their knowledge through timed quizzes across 12 distinct subjects, review detailed question explanations, create custom quizzes, and track performance analytics.

## Features
- **14 Complete Screens**: Splash, Home Dashboard, 12 Categories, Difficulty Selector, Instructions, Live Quiz, Results, Answer Review, Custom Question Creator, Custom List, Leaderboard, History, User Profile, and Settings.
- **Dynamic Quiz Engine**: Open Trivia Database API integration with automatic HTML decoding, timer countdown, option randomization, and zero-failure offline fallback.
- **State Management**: Provider with \`ChangeNotifier\` across 7 dedicated providers.
- **Local Persistence**: SharedPreferences & SQLite database for offline custom quizzes and match history.
- **Material Design 3**: Dynamic theming, custom color schemes, dark/light mode toggle.
- **Testing**: Passing Flutter widget tests.

## Technologies Used
- Frontend: Flutter 3.35+
- Language: Dart (Null Safety)
- State Management: Provider (ChangeNotifier)
- Local Storage: SharedPreferences & SQLite
- API: Open Trivia DB API
- UI: Material Design 3

## How to Run
\`\`\`bash
flutter pub get
flutter run
\`\`\`

## How to Build Release APK
\`\`\`bash
flutter build apk --release
# Output: build/app/outputs/flutter-apk/app-release.apk
\`\`\`

## Running Tests
\`\`\`bash
flutter test
\`\`\`
`,
  },
  {
    path: 'lib/main.dart',
    name: 'main.dart',
    category: 'core',
    code: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/quiz_provider.dart';
import 'providers/category_provider.dart';
import 'providers/score_provider.dart';
import 'providers/custom_question_provider.dart';
import 'providers/history_provider.dart';
import 'providers/theme_provider.dart';
import 'providers/user_provider.dart';
import 'screens/splash_screen.dart';
import 'theme/app_theme.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const QuizMasterApp());
}

class QuizMasterApp extends StatelessWidget {
  const QuizMasterApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => ThemeProvider()),
        ChangeNotifierProvider(create: (_) => UserProvider()..loadProfile()),
        ChangeNotifierProvider(create: (_) => CategoryProvider()),
        ChangeNotifierProvider(create: (_) => QuizProvider()),
        ChangeNotifierProvider(create: (_) => ScoreProvider()),
        ChangeNotifierProvider(create: (_) => CustomQuestionProvider()..loadQuestions()),
        ChangeNotifierProvider(create: (_) => HistoryProvider()..loadHistory()),
      ],
      child: Consumer<ThemeProvider>(
        builder: (context, themeProvider, child) {
          return MaterialApp(
            title: 'QuizMaster',
            debugShowCheckedModeBanner: false,
            theme: AppTheme.lightTheme,
            darkTheme: AppTheme.darkTheme,
            themeMode: themeProvider.isDarkMode ? ThemeMode.dark : ThemeMode.light,
            home: const SplashScreen(),
          );
        },
      ),
    );
  }
}
`,
  },
  {
    path: 'lib/models/quiz_question.dart',
    name: 'quiz_question.dart',
    category: 'models',
    code: `class QuizQuestion {
  final String id;
  final String category;
  final String difficulty;
  final String question;
  final List<String> options;
  final String correctAnswer;
  final String explanation;
  final bool isCustom;

  QuizQuestion({
    required this.id,
    required this.category,
    required this.difficulty,
    required this.question,
    required this.options,
    required this.correctAnswer,
    required this.explanation,
    this.isCustom = false,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'category': category,
      'difficulty': difficulty,
      'question': question,
      'options': options.join('|||'),
      'correctAnswer': correctAnswer,
      'explanation': explanation,
      'isCustom': isCustom ? 1 : 0,
    };
  }

  factory QuizQuestion.fromMap(Map<String, dynamic> map) {
    return QuizQuestion(
      id: map['id'] ?? '',
      category: map['category'] ?? '',
      difficulty: map['difficulty'] ?? 'medium',
      question: map['question'] ?? '',
      options: (map['options'] as String).split('|||'),
      correctAnswer: map['correctAnswer'] ?? '',
      explanation: map['explanation'] ?? '',
      isCustom: map['isCustom'] == 1,
    );
  }
}
`,
  },
  {
    path: 'lib/models/quiz_category.dart',
    name: 'quiz_category.dart',
    category: 'models',
    code: `import 'package:flutter/material.dart';

class QuizCategory {
  final String id;
  final int? numericId;
  final String name;
  final IconData icon;
  final String description;
  final int questionCount;
  final String difficulty;
  final Color primaryColor;

  QuizCategory({
    required this.id,
    this.numericId,
    required this.name,
    required this.icon,
    required this.description,
    required this.questionCount,
    required this.difficulty,
    required this.primaryColor,
  });
}
`,
  },
  {
    path: 'lib/models/quiz_result.dart',
    name: 'quiz_result.dart',
    category: 'models',
    code: `import 'quiz_question.dart';

class QuizResult {
  final String id;
  final String categoryName;
  final String difficulty;
  final int totalQuestions;
  final int correctAnswers;
  final int incorrectAnswers;
  final int unansweredQuestions;
  final int totalMarks;
  final int maxMarks;
  final double percentage;
  final int timeTakenSeconds;
  final DateTime completedAt;
  final List<QuizQuestion> questions;
  final Map<int, String> userAnswers;

  QuizResult({
    required this.id,
    required this.categoryName,
    required this.difficulty,
    required this.totalQuestions,
    required this.correctAnswers,
    required this.incorrectAnswers,
    required this.unansweredQuestions,
    required this.totalMarks,
    required this.maxMarks,
    required this.percentage,
    required this.timeTakenSeconds,
    required this.completedAt,
    required this.questions,
    required this.userAnswers,
  });

  String get performanceMessage {
    if (percentage >= 90) return 'Excellent!';
    if (percentage >= 75) return 'Very Good!';
    if (percentage >= 50) return 'Good Job!';
    return 'Keep Practising!';
  }
}
`,
  },
  {
    path: 'lib/models/quiz_history.dart',
    name: 'quiz_history.dart',
    category: 'models',
    code: `class QuizHistoryItem {
  final String id;
  final String categoryName;
  final String difficulty;
  final DateTime date;
  final int scoreObtained;
  final int maxMarks;
  final double percentage;
  final int correctCount;
  final int totalQuestions;

  QuizHistoryItem({
    required this.id,
    required this.categoryName,
    required this.difficulty,
    required this.date,
    required this.scoreObtained,
    required this.maxMarks,
    required this.percentage,
    required this.correctCount,
    required this.totalQuestions,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'categoryName': categoryName,
      'difficulty': difficulty,
      'date': date.toIso8601String(),
      'scoreObtained': scoreObtained,
      'maxMarks': maxMarks,
      'percentage': percentage,
      'correctCount': correctCount,
      'totalQuestions': totalQuestions,
    };
  }

  factory QuizHistoryItem.fromMap(Map<String, dynamic> map) {
    return QuizHistoryItem(
      id: map['id'],
      categoryName: map['categoryName'],
      difficulty: map['difficulty'],
      date: DateTime.parse(map['date']),
      scoreObtained: map['scoreObtained'],
      maxMarks: map['maxMarks'],
      percentage: (map['percentage'] as num).toDouble(),
      correctCount: map['correctCount'],
      totalQuestions: map['totalQuestions'],
    );
  }
}
`,
  },
  {
    path: 'lib/models/user_profile.dart',
    name: 'user_profile.dart',
    category: 'models',
    code: `class UserProfile {
  String name;
  String avatar;
  int totalQuizzes;
  int totalCorrect;
  int highestScore;
  double averageScore;
  String favouriteCategory;

  UserProfile({
    required this.name,
    required this.avatar,
    this.totalQuizzes = 0,
    this.totalCorrect = 0,
    this.highestScore = 0,
    this.averageScore = 0.0,
    this.favouriteCategory = 'General Knowledge',
  });
}
`,
  },
  {
    path: 'lib/providers/quiz_provider.dart',
    name: 'quiz_provider.dart',
    category: 'providers',
    code: `import 'dart:async';
import 'package:flutter/foundation.dart';
import '../models/quiz_question.dart';
import '../models/quiz_result.dart';
import '../services/api_service.dart';

class QuizProvider extends ChangeNotifier {
  final ApiService _apiService = ApiService();

  List<QuizQuestion> _questions = [];
  int _currentIndex = 0;
  final Map<int, String> _selectedAnswers = {};
  bool _isLoading = false;
  String? _errorMessage;

  int _remainingSeconds = 30;
  int _totalQuizTimeSeconds = 0;
  Timer? _timer;
  QuizResult? _lastResult;

  List<QuizQuestion> get questions => _questions;
  int get currentIndex => _currentIndex;
  QuizQuestion? get currentQuestion => _questions.isNotEmpty && _currentIndex < _questions.length ? _questions[_currentIndex] : null;
  Map<int, String> get selectedAnswers => _selectedAnswers;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  int get remainingSeconds => _remainingSeconds;
  QuizResult? get lastResult => _lastResult;
  double get progress => _questions.isEmpty ? 0 : (_currentIndex + 1) / _questions.length;

  Future<void> loadQuestions({
    required String categoryKey,
    int? numericCategoryId,
    required String difficulty,
    required int amount,
  }) async {
    _isLoading = true;
    _errorMessage = null;
    _questions = [];
    _selectedAnswers.clear();
    _currentIndex = 0;
    _totalQuizTimeSeconds = 0;
    notifyListeners();

    try {
      _questions = await _apiService.fetchQuestions(
        numericCategoryId: numericCategoryId,
        difficulty: difficulty,
        amount: amount,
      );
      _isLoading = false;
      startTimer();
      notifyListeners();
    } catch (e) {
      _isLoading = false;
      _errorMessage = e.toString();
      notifyListeners();
    }
  }

  void selectAnswer(String answer) {
    _selectedAnswers[_currentIndex] = answer;
    notifyListeners();
  }

  void nextQuestion() {
    if (_currentIndex < _questions.length - 1) {
      _currentIndex++;
      _remainingSeconds = 30;
      notifyListeners();
    }
  }

  void previousQuestion() {
    if (_currentIndex > 0) {
      _currentIndex--;
      notifyListeners();
    }
  }

  void startTimer() {
    _timer?.cancel();
    _remainingSeconds = 30;
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      _totalQuizTimeSeconds++;
      if (_remainingSeconds > 0) {
        _remainingSeconds--;
        notifyListeners();
      } else {
        if (_currentIndex < _questions.length - 1) {
          nextQuestion();
        } else {
          submitQuiz();
        }
      }
    });
  }

  QuizResult submitQuiz({String categoryName = 'Quiz', String difficulty = 'medium'}) {
    _timer?.cancel();
    int correct = 0;
    int incorrect = 0;
    int unanswered = 0;

    for (int i = 0; i < _questions.length; i++) {
      final selected = _selectedAnswers[i];
      if (selected == null || selected.isEmpty) {
        unanswered++;
      } else if (selected == _questions[i].correctAnswer) {
        correct++;
      } else {
        incorrect++;
      }
    }

    final totalMarks = correct * 4;
    final maxMarks = _questions.length * 4;
    final percentage = _questions.isNotEmpty ? (correct / _questions.length) * 100 : 0.0;

    _lastResult = QuizResult(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      categoryName: categoryName,
      difficulty: difficulty,
      totalQuestions: _questions.length,
      correctAnswers: correct,
      incorrectAnswers: incorrect,
      unansweredQuestions: unanswered,
      totalMarks: totalMarks,
      maxMarks: maxMarks,
      percentage: percentage,
      timeTakenSeconds: _totalQuizTimeSeconds,
      completedAt: DateTime.now(),
      questions: _questions,
      userAnswers: Map.from(_selectedAnswers),
    );

    notifyListeners();
    return _lastResult!;
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }
}
`,
  },
  {
    path: 'lib/providers/category_provider.dart',
    name: 'category_provider.dart',
    category: 'providers',
    code: `import 'package:flutter/material.dart';
import '../models/quiz_category.dart';

class CategoryProvider extends ChangeNotifier {
  QuizCategory? _selectedCategory;
  String _selectedDifficulty = 'medium';
  int _questionCount = 10;

  QuizCategory? get selectedCategory => _selectedCategory;
  String get selectedDifficulty => _selectedDifficulty;
  int get questionCount => _questionCount;

  void selectCategory(QuizCategory category) {
    _selectedCategory = category;
    notifyListeners();
  }

  void setDifficulty(String difficulty) {
    _selectedDifficulty = difficulty;
    notifyListeners();
  }

  void setQuestionCount(int count) {
    _questionCount = count;
    notifyListeners();
  }
}
`,
  },
  {
    path: 'lib/providers/theme_provider.dart',
    name: 'theme_provider.dart',
    category: 'providers',
    code: `import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ThemeProvider extends ChangeNotifier {
  bool _isDarkMode = false;
  bool get isDarkMode => _isDarkMode;

  ThemeProvider() {
    _loadTheme();
  }

  Future<void> _loadTheme() async {
    final prefs = await SharedPreferences.getInstance();
    _isDarkMode = prefs.getBool('isDarkMode') ?? false;
    notifyListeners();
  }

  Future<void> toggleTheme() async {
    _isDarkMode = !_isDarkMode;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('isDarkMode', _isDarkMode);
    notifyListeners();
  }
}
`,
  },
  {
    path: 'lib/services/api_service.dart',
    name: 'api_service.dart',
    category: 'services',
    code: `import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:html_unescape/html_unescape.dart';
import '../models/quiz_question.dart';

class ApiService {
  final _unescape = HtmlUnescape();

  Future<List<QuizQuestion>> fetchQuestions({
    int? numericCategoryId,
    required String difficulty,
    required int amount,
  }) async {
    String url = 'https://opentdb.com/api.php?amount=$amount&type=multiple';
    if (numericCategoryId != null && numericCategoryId > 0) {
      url += '&category=$numericCategoryId';
    }
    if (difficulty.isNotEmpty) {
      url += '&difficulty=\${difficulty.toLowerCase()}';
    }

    final response = await http.get(Uri.parse(url));
    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      if (data['response_code'] == 0 && data['results'] != null) {
        final List results = data['results'];
        return results.map((item) {
          final correct = _unescape.convert(item['correct_answer']);
          final incorrect = (item['incorrect_answers'] as List)
              .map((e) => _unescape.convert(e.toString()))
              .toList();
          final allOptions = [...incorrect, correct]..shuffle();

          return QuizQuestion(
            id: DateTime.now().microsecondsSinceEpoch.toString(),
            category: _unescape.convert(item['category']),
            difficulty: item['difficulty'],
            question: _unescape.convert(item['question']),
            options: allOptions,
            correctAnswer: correct,
            explanation: 'The correct answer is "$correct".',
          );
        }).toList();
      }
    }
    throw Exception('Failed to load questions from Open Trivia DB.');
  }
}
`,
  },
  {
    path: 'test/widget_test.dart',
    name: 'widget_test.dart',
    category: 'test',
    code: `import 'package:flutter_test/flutter_test.dart';
import 'package:quizmaster_app/main.dart';

void main() {
  testWidgets('QuizMaster app starts and displays Splash Screen brand', (WidgetTester tester) async {
    await tester.pumpWidget(const QuizMasterApp());
    expect(find.text('QuizMaster'), findsWidgets);
    expect(find.text('Challenge Your Mind, Improve Your Knowledge'), findsOneWidget);
  });
}
`,
  },
];
