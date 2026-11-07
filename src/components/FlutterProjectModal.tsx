import React, { useState } from 'react';
import JSZip from 'jszip';
import {
  Code2,
  Download,
  Copy,
  Check,
  FolderTree,
  FileCode,
  Terminal,
  HelpCircle,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { FLUTTER_PROJECT_FILES, FlutterFile } from '../data/flutterSourceCode';

interface FlutterProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlaySound?: () => void;
}

export const FlutterProjectModal: React.FC<FlutterProjectModalProps> = ({
  isOpen,
  onClose,
  onPlaySound,
}) => {
  const [activeTab, setActiveTab] = useState<'code' | 'viva' | 'build'>('code');
  const [selectedFile, setSelectedFile] = useState<FlutterFile>(FLUTTER_PROJECT_FILES[2]); // main.dart
  const [copied, setCopied] = useState<boolean>(false);
  const [isZipping, setIsZipping] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    onPlaySound?.();
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    onPlaySound?.();
    setIsZipping(true);
    try {
      const zip = new JSZip();

      // Add all project files into their respective paths
      FLUTTER_PROJECT_FILES.forEach((file) => {
        zip.file(file.path, file.code);
      });

      // Generate zip blob
      const content = await zip.generateAsync({ type: 'blob' });
      const downloadUrl = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = 'quizmaster-flutter-app.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error('Failed to generate ZIP archive', err);
    } finally {
      setIsZipping(false);
    }
  };

  const vivaQuestions = [
    {
      q: '1. Why did you choose Provider with ChangeNotifier for state management?',
      a: 'Provider is the official Google-recommended state management solution for Flutter apps of this scale. ChangeNotifier acts as an observable model: whenever state updates (such as when selectedAnswers changes or a timer ticks), notifyListeners() tells Consumer widgets to rebuild efficiently without re-rendering unaffected UI trees.',
    },
    {
      q: '2. How does QuizMaster handle network dropouts and Open Trivia DB API rate limits?',
      a: 'The ApiService implements a 7-second timeout with an AbortController and automatic HTML entity decoding (e.g., converting &quot; and &#039; into real characters). If the OpenTDB API is rate-limited (HTTP 429) or offline, the app seamlessly cascades to the internal curated question bank without crashing or showing blank screens.',
    },
    {
      q: '3. How are custom user-created questions and quiz history stored locally?',
      a: 'Custom questions and history items are serialized into structured JSON records and persisted to SharedPreferences / SQLite database. All records persist across application restarts, allowing offline practice.',
    },
    {
      q: '4. How is Material Design 3 implemented across the application?',
      a: 'The application utilizes ThemeData with Material 3 enabled (useMaterial3: true), defined in lib/theme/app_theme.dart. It features dynamic ColorScheme with Indigo and Violet primary seeds, rounded cards (BorderRadius.circular(24)), tonal elevations, and smooth dark/light theme switching.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-base text-white">
                  Flutter Source Code & GitHub Submission Hub
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                  Dart 3.35+
                </span>
              </div>
              <p className="text-xs text-indigo-200">
                KHIT Guntur • Android Studio Project Files & Release APK Generator
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownloadZip}
              disabled={isZipping}
              className="hidden sm:flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>{isZipping ? 'Creating ZIP...' : 'Download Project (ZIP)'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between px-4 py-2 bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                onPlaySound?.();
                setActiveTab('code');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors ${
                activeTab === 'code'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <FolderTree className="w-3.5 h-3.5" />
              <span>Browse Dart Files ({FLUTTER_PROJECT_FILES.length})</span>
            </button>

            <button
              onClick={() => {
                onPlaySound?.();
                setActiveTab('viva');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors ${
                activeTab === 'viva'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Viva & Defense Guide</span>
            </button>

            <button
              onClick={() => {
                onPlaySound?.();
                setActiveTab('build');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors ${
                activeTab === 'build'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>APK Build & Run</span>
            </button>
          </div>

          <button
            onClick={handleDownloadZip}
            disabled={isZipping}
            className="sm:hidden flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-bold"
          >
            <Download className="w-3.5 h-3.5" />
            <span>ZIP</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden p-4">
          {activeTab === 'code' && (
            <div className="h-full flex flex-col md:flex-row gap-3 overflow-hidden">
              {/* File Tree Left Sidebar */}
              <div className="w-full md:w-64 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 bg-slate-50 dark:bg-slate-850 overflow-y-auto max-h-48 md:max-h-[58vh]">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2 py-1 block">
                  Project Files
                </span>
                <div className="space-y-0.5">
                  {FLUTTER_PROJECT_FILES.map((file) => {
                    const isSelected = selectedFile.path === file.path;
                    return (
                      <button
                        key={file.path}
                        onClick={() => {
                          onPlaySound?.();
                          setSelectedFile(file);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-mono flex items-center space-x-2 transition-colors ${
                          isSelected
                            ? 'bg-indigo-600 text-white font-bold'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                        }`}
                      >
                        <FileCode className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{file.path}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Code Viewer Right Panel */}
              <div className="flex-1 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col bg-slate-900 text-slate-100 overflow-hidden max-h-[58vh]">
                <div className="px-4 py-2 border-b border-slate-800 bg-slate-950 flex items-center justify-between text-xs font-mono text-slate-400 shrink-0">
                  <span className="font-bold text-indigo-400">{selectedFile.path}</span>
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-sans font-semibold transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy File</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="flex-1 p-4 overflow-auto font-mono text-xs leading-relaxed">
                  <pre>{selectedFile.code}</pre>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'viva' && (
            <div className="h-full overflow-y-auto space-y-4 pr-2 max-h-[58vh]">
              <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900 text-xs text-indigo-900 dark:text-indigo-200">
                <span className="font-extrabold flex items-center space-x-1 mb-1">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>Academic Project Viva & Evaluation Checklist</span>
                </span>
                <p>
                  These key questions and architectural explanations are designed specifically for KHIT project defense presentations.
                </p>
              </div>

              <div className="space-y-3">
                {vivaQuestions.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-1.5"
                  >
                    <h4 className="font-bold text-xs sm:text-sm text-indigo-600 dark:text-indigo-400">
                      {item.q}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'build' && (
            <div className="h-full overflow-y-auto space-y-4 pr-2 max-h-[58vh]">
              <div className="p-4 rounded-2xl bg-slate-900 text-white font-mono text-xs space-y-3">
                <div className="text-slate-400"># Step 1: Clone or extract quizmaster-flutter-app.zip</div>
                <div className="text-emerald-400 bg-slate-950 p-2.5 rounded-xl">cd quizmaster-flutter-app</div>

                <div className="text-slate-400"># Step 2: Fetch all Flutter & Dart dependencies</div>
                <div className="text-emerald-400 bg-slate-950 p-2.5 rounded-xl">flutter pub get</div>

                <div className="text-slate-400"># Step 3: Run widget tests (verifies zero test failures)</div>
                <div className="text-emerald-400 bg-slate-950 p-2.5 rounded-xl">flutter test</div>

                <div className="text-slate-400"># Step 4: Run locally in Chrome or connected Android phone</div>
                <div className="text-emerald-400 bg-slate-950 p-2.5 rounded-xl">flutter run</div>

                <div className="text-slate-400"># Step 5: Build production release Android APK</div>
                <div className="text-emerald-400 bg-slate-950 p-2.5 rounded-xl">flutter build apk --release</div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 space-y-2">
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  APK Output Location:
                </h4>
                <p className="font-mono bg-slate-100 dark:bg-slate-750 p-2 rounded-lg text-[11px]">
                  build/app/outputs/flutter-apk/app-release.apk
                </p>
                <p>
                  This APK can be installed directly on any physical Android smartphone using WhatsApp, USB transfer, or Google Drive for your live 5-minute project demonstration.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500 font-medium">
            QuizMaster • KHIT Guntur Computer Science & Engineering
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 font-bold text-xs"
          >
            Close Exporter
          </button>
        </div>
      </div>
    </div>
  );
};
