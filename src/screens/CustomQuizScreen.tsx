import React, { useState } from 'react';
import {
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Save,
  ArrowLeft,
  ListFilter,
  Sparkles,
} from 'lucide-react';
import { QUIZ_CATEGORIES } from '../data/categories';
import { QuizQuestion, Difficulty } from '../types/quiz';

interface CustomQuizScreenProps {
  onSaveQuestion: (question: QuizQuestion) => void;
  onViewList: () => void;
  existingQuestions: QuizQuestion[];
  onPlaySound?: () => void;
}

export const CustomQuizScreen: React.FC<CustomQuizScreenProps> = ({
  onSaveQuestion,
  onViewList,
  existingQuestions,
  onPlaySound,
}) => {
  const [questionText, setQuestionText] = useState('');
  const [category, setCategory] = useState(QUIZ_CATEGORIES[0].name);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [correctOption, setCorrectOption] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [explanation, setExplanation] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!questionText.trim()) {
      newErrors.question = 'Question text is required.';
    } else if (questionText.trim().length < 8) {
      newErrors.question = 'Question must be at least 8 characters long.';
    }

    if (!optionA.trim()) newErrors.optionA = 'Option A is required.';
    if (!optionB.trim()) newErrors.optionB = 'Option B is required.';
    if (!optionC.trim()) newErrors.optionC = 'Option C is required.';
    if (!optionD.trim()) newErrors.optionD = 'Option D is required.';

    // Check duplicate options within this question
    const optionsArray = [optionA.trim(), optionB.trim(), optionC.trim(), optionD.trim()].filter(
      Boolean
    );
    if (new Set(optionsArray).size !== optionsArray.length) {
      newErrors.duplicateOptions = 'Options must be unique. Duplicate options are not allowed.';
    }

    // Check duplicate question in existing database
    const isDuplicate = existingQuestions.some(
      (q) => q.question.toLowerCase().trim() === questionText.toLowerCase().trim()
    );
    if (isDuplicate) {
      newErrors.duplicateQuestion =
        'A question with this exact wording already exists in your database.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    const optionsMap = {
      A: optionA.trim(),
      B: optionB.trim(),
      C: optionC.trim(),
      D: optionD.trim(),
    };

    const newQuestion: QuizQuestion = {
      id: `custom-${Date.now()}`,
      category,
      difficulty,
      question: questionText.trim(),
      options: [optionsMap.A, optionsMap.B, optionsMap.C, optionsMap.D],
      correctAnswer: optionsMap[correctOption],
      explanation:
        explanation.trim() ||
        `Option ${correctOption} (${optionsMap[correctOption]}) is the verified correct answer.`,
      isCustom: true,
    };

    onPlaySound?.();
    onSaveQuestion(newQuestion);

    // Reset form
    setQuestionText('');
    setOptionA('');
    setOptionB('');
    setOptionC('');
    setOptionD('');
    setExplanation('');
    setErrors({});
    setSuccessMessage(true);
    setTimeout(() => setSuccessMessage(false), 3000);
  };

  return (
    <div className="space-y-6 pb-20 px-4 pt-3 max-w-2xl mx-auto animate-fadeIn select-none">
      {/* Header with shortcut to View Custom List */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Create Custom Question
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Craft your own questions with four options and detailed explanations
          </p>
        </div>

        <button
          onClick={() => {
            onPlaySound?.();
            onViewList();
          }}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-bold text-xs border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition-colors"
        >
          <ListFilter className="w-3.5 h-3.5" />
          <span>View Custom ({existingQuestions.length})</span>
        </button>
      </div>

      {successMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Custom question saved successfully to your offline local storage!</span>
        </div>
      )}

      {errors.duplicateQuestion && (
        <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/70 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs font-semibold flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errors.duplicateQuestion}</span>
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4"
      >
        {/* Category & Difficulty Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white"
            >
              {QUIZ_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Difficulty Level
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['easy', 'medium', 'hard'] as const).map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setDifficulty(diff)}
                  className={`py-2 rounded-xl text-xs font-bold capitalize transition-colors ${
                    difficulty === diff
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-50 dark:bg-slate-750 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Question Text */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Question Text <span className="text-rose-500">*</span>
          </label>
          <textarea
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            rows={3}
            placeholder="e.g. Which algorithm is standard for finding shortest paths in a weighted graph?"
            className="w-full p-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
          />
          {errors.question && (
            <p className="text-[11px] text-rose-500 font-semibold mt-1">{errors.question}</p>
          )}
        </div>

        {/* 4 Options Grid */}
        <div className="space-y-3 pt-2">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            Four Multiple Choice Options & Correct Answer <span className="text-rose-500">*</span>
          </label>

          {errors.duplicateOptions && (
            <p className="text-[11px] text-rose-500 font-semibold">
              {errors.duplicateOptions}
            </p>
          )}

          {[
            { key: 'A', value: optionA, setter: setOptionA, error: errors.optionA },
            { key: 'B', value: optionB, setter: setOptionB, error: errors.optionB },
            { key: 'C', value: optionC, setter: setOptionC, error: errors.optionC },
            { key: 'D', value: optionD, setter: setOptionD, error: errors.optionD },
          ].map((item) => (
            <div key={item.key} className="space-y-1">
              <div className="flex items-center space-x-2">
                {/* Radio button for correct answer */}
                <button
                  type="button"
                  onClick={() => setCorrectOption(item.key as 'A' | 'B' | 'C' | 'D')}
                  className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 transition-all ${
                    correctOption === item.key
                      ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                  title={`Mark Option ${item.key} as correct answer`}
                >
                  {item.key}
                </button>

                <input
                  type="text"
                  value={item.value}
                  onChange={(e) => item.setter(e.target.value)}
                  placeholder={`Enter Option ${item.key}...`}
                  className="flex-1 px-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                />

                {correctOption === item.key && (
                  <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 shrink-0 px-2 py-1 bg-emerald-50 dark:bg-emerald-950 rounded-lg">
                    Correct
                  </span>
                )}
              </div>
              {item.error && (
                <p className="text-[11px] text-rose-500 font-semibold pl-10">{item.error}</p>
              )}
            </div>
          ))}
          <p className="text-[11px] text-slate-400 italic">
            Tip: Click on letter (A, B, C, D) to designate that option as the correct answer.
          </p>
        </div>

        {/* Explanation */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Explanation / Learning Fact (Optional)
          </label>
          <textarea
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            rows={2}
            placeholder="Explain why this answer is correct or add relevant background facts..."
            className="w-full p-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:scale-98 text-white font-extrabold text-xs shadow-md shadow-indigo-600/25 flex items-center justify-center space-x-2 transition-all mt-4"
        >
          <Save className="w-4 h-4" />
          <span>Save Custom Question</span>
        </button>
      </form>
    </div>
  );
};
