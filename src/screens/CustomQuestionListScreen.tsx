import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Edit3,
  Search,
  Play,
  CheckCircle,
  HelpCircle,
  AlertTriangle,
  FolderOpen,
  Filter,
  Check,
} from 'lucide-react';
import { QuizQuestion, Difficulty } from '../types/quiz';
import { QUIZ_CATEGORIES } from '../data/categories';

interface CustomQuestionListScreenProps {
  questions: QuizQuestion[];
  onAddNew: () => void;
  onUpdateQuestion: (question: QuizQuestion) => void;
  onDeleteQuestion: (id: string) => void;
  onStartCustomQuiz: () => void;
  onPlaySound?: () => void;
}

export const CustomQuestionListScreen: React.FC<CustomQuestionListScreenProps> = ({
  questions,
  onAddNew,
  onUpdateQuestion,
  onDeleteQuestion,
  onStartCustomQuiz,
  onPlaySound,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [questionToDelete, setQuestionToDelete] = useState<QuizQuestion | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);

  // Edit form states
  const [editPrompt, setEditPrompt] = useState('');
  const [editOptA, setEditOptA] = useState('');
  const [editOptB, setEditOptB] = useState('');
  const [editOptC, setEditOptC] = useState('');
  const [editOptD, setEditOptD] = useState('');
  const [editCorrect, setEditCorrect] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [editExpl, setEditExpl] = useState('');

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.correctAnswer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'all' || q.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const openEditModal = (q: QuizQuestion) => {
    onPlaySound?.();
    setEditingQuestion(q);
    setEditPrompt(q.question);
    setEditOptA(q.options[0] || '');
    setEditOptB(q.options[1] || '');
    setEditOptC(q.options[2] || '');
    setEditOptD(q.options[3] || '');

    // Figure out which option is correct
    if (q.correctAnswer === q.options[0]) setEditCorrect('A');
    else if (q.correctAnswer === q.options[1]) setEditCorrect('B');
    else if (q.correctAnswer === q.options[2]) setEditCorrect('C');
    else if (q.correctAnswer === q.options[3]) setEditCorrect('D');
    else setEditCorrect('A');

    setEditExpl(q.explanation || '');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion) return;

    const optionsMap = {
      A: editOptA.trim(),
      B: editOptB.trim(),
      C: editOptC.trim(),
      D: editOptD.trim(),
    };

    const updated: QuizQuestion = {
      ...editingQuestion,
      question: editPrompt.trim(),
      options: [optionsMap.A, optionsMap.B, optionsMap.C, optionsMap.D],
      correctAnswer: optionsMap[editCorrect],
      explanation: editExpl.trim(),
    };

    onUpdateQuestion(updated);
    setEditingQuestion(null);
  };

  const confirmDelete = () => {
    if (questionToDelete) {
      onPlaySound?.();
      onDeleteQuestion(questionToDelete.id);
      setQuestionToDelete(null);
    }
  };

  return (
    <div className="space-y-4 pb-20 px-4 pt-3 max-w-3xl mx-auto animate-fadeIn select-none">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Custom Questions Bank
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your offline question library ({questions.length} saved)
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {questions.length > 0 && (
            <button
              onClick={() => {
                onPlaySound?.();
                onStartCustomQuiz();
              }}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Play Custom Quiz</span>
            </button>
          )}

          <button
            onClick={() => {
              onPlaySound?.();
              onAddNew();
            }}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New</span>
          </button>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search custom questions..."
            className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white shadow-xs"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 shadow-xs"
        >
          <option value="all">All Categories</option>
          {QUIZ_CATEGORIES.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Questions List */}
      {filteredQuestions.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
          <FolderOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
            No custom questions match your filter
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Tap &ldquo;Create New&rdquo; above to write your own multiple-choice questions.
          </p>
          <button
            onClick={onAddNew}
            className="mt-4 px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold text-xs"
          >
            Create Question Now
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredQuestions.map((q, idx) => (
            <div
              key={q.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs hover:border-slate-300 dark:hover:border-slate-600 transition-all space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                      {q.category}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400 capitalize">
                      {q.difficulty}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white mt-1.5 leading-snug">
                    {q.question}
                  </h4>
                </div>

                {/* Edit & Delete actions */}
                <div className="flex items-center space-x-1 shrink-0 ml-2">
                  <button
                    onClick={() => openEditModal(q)}
                    className="p-2 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    title="Edit Question"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setQuestionToDelete(q)}
                    className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                    title="Delete Question"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Options summary */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                {q.options.map((opt, optIdx) => {
                  const isCorrect = opt === q.correctAnswer;
                  return (
                    <div
                      key={optIdx}
                      className={`p-2 rounded-xl border flex items-center space-x-1.5 ${
                        isCorrect
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 font-bold'
                          : 'bg-slate-50 dark:bg-slate-750 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <span className="w-4 h-4 rounded-md bg-white/70 dark:bg-slate-850 flex items-center justify-center text-[10px] font-bold shrink-0">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="truncate">{opt}</span>
                    </div>
                  );
                })}
              </div>

              {q.explanation && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 italic pt-1 border-t border-slate-100 dark:border-slate-700/60">
                  💡 {q.explanation}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {questionToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Delete Question?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                &ldquo;{questionToDelete.question}&rdquo;
              </p>
              <p className="text-[11px] text-rose-500 font-semibold mt-2">
                This action is irreversible and removes the question from your local device storage.
              </p>
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setQuestionToDelete(null)}
                className="w-1/2 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="w-1/2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md shadow-rose-600/20"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Question Modal */}
      {editingQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4 my-8">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Edit Question
              </h3>
              <button
                onClick={() => setEditingQuestion(null)}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Question Text
                </label>
                <textarea
                  value={editPrompt}
                  onChange={(e) => setEditPrompt(e.target.value)}
                  rows={2}
                  required
                  className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Options (Click letter to select correct answer)
                </label>

                {[
                  { key: 'A', val: editOptA, set: setEditOptA },
                  { key: 'B', val: editOptB, set: setEditOptB },
                  { key: 'C', val: editOptC, set: setEditOptC },
                  { key: 'D', val: editOptD, set: setEditOptD },
                ].map((item) => (
                  <div key={item.key} className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setEditCorrect(item.key as 'A' | 'B' | 'C' | 'D')}
                      className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 ${
                        editCorrect === item.key
                          ? 'bg-emerald-600 text-white ring-2 ring-emerald-400'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600'
                      }`}
                    >
                      {item.key}
                    </button>
                    <input
                      type="text"
                      value={item.val}
                      onChange={(e) => item.set(e.target.value)}
                      required
                      className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Explanation
                </label>
                <textarea
                  value={editExpl}
                  onChange={(e) => setEditExpl(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingQuestion(null)}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md shadow-indigo-600/25"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
