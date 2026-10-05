import React, { useState, useEffect } from 'react';
import { navControllerInstance } from './android/navigation/NavController';
import { authViewModelInstance } from './android/viewmodel/AuthViewModel';
import { courseViewModelInstance } from './android/viewmodel/CourseViewModel';
import { PhoneSimulator } from './components/PhoneSimulator';
import { CodeViewer } from './components/CodeViewer';
import { ArchitectureViewer } from './components/ArchitectureViewer';
import { ArchitectureGuide } from './components/ArchitectureGuide';
import { generateAndroidStudioProjectZip, downloadBlob } from './components/ProjectExporter';
import {
  Smartphone,
  FileCode,
  Layers,
  BookOpen,
  Download,
  Columns,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'code' | 'inspector' | 'guide'>('simulator');
  const [splitView, setSplitView] = useState<boolean>(true);
  const [downloading, setDownloading] = useState<boolean>(false);

  const handleDownloadZip = async () => {
    try {
      setDownloading(true);
      const blob = await generateAndroidStudioProjectZip();
      downloadBlob(blob, 'AndroidCourseApp-MVVM-Compose.zip');
    } catch (err) {
      console.error(err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      {/* Universal Top Bar Contract: Zone 1 (Brand), Zone 2 (Nav links), Zone 3 (Primary Action) */}
      <header className="h-16 px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 z-40 sticky top-0 shadow-sm">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#6750A4] text-white flex items-center justify-center font-bold text-base shadow-sm">
            M3
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
              Jetpack Compose MVVM
            </span>
            <span className="hidden sm:inline text-xs text-slate-500 dark:text-slate-400 ml-2">
              Kotlin · Navigation Compose · StateFlow
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links / Segmented Tabs */}
        <nav className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition ${
              activeTab === 'simulator'
                ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Simulator</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition ${
              activeTab === 'code'
                ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Kotlin Files</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('inspector')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition ${
              activeTab === 'inspector'
                ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>StateFlow</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('guide')}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition ${
              activeTab === 'guide'
                ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Architecture</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action & Controls */}
        <div className="flex items-center gap-2">
          {/* Split View Toggle for Wide Screens */}
          <button
            type="button"
            onClick={() => setSplitView(!splitView)}
            className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition ${
              splitView
                ? 'border-purple-300 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Toggle Split-Screen Simulator + Code/Inspector"
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Split View</span>
          </button>

          {/* Download Android Studio Zip */}
          <button
            type="button"
            onClick={handleDownloadZip}
            disabled={downloading}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#6750A4] hover:bg-[#584291] text-white text-xs font-medium shadow-sm transition disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{downloading ? 'Exporting...' : 'Download Project'}</span>
            <span className="sm:hidden">Export</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Body */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {splitView ? (
          /* Split View Mode: Phone Simulator on Left, Active Tab on Right */
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* Left: Pixel 9 Pro Simulator */}
            <div className="w-full lg:w-[480px] xl:w-[500px] border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70 p-4 overflow-y-auto flex items-center justify-center shrink-0">
              <PhoneSimulator
                navController={navControllerInstance}
                authViewModel={authViewModelInstance}
                courseViewModel={courseViewModelInstance}
              />
            </div>

            {/* Right: Code Viewer, Inspector, or Guide */}
            <div className="flex-1 overflow-hidden bg-white dark:bg-slate-900 flex flex-col">
              {activeTab === 'code' ? (
                <CodeViewer />
              ) : activeTab === 'inspector' ? (
                <ArchitectureViewer
                  navController={navControllerInstance}
                  authViewModel={authViewModelInstance}
                  courseViewModel={courseViewModelInstance}
                />
              ) : activeTab === 'guide' ? (
                <ArchitectureGuide />
              ) : (
                /* When in split view with simulator active, show the CodeViewer alongside for optimal dual experience */
                <CodeViewer />
              )}
            </div>
          </div>
        ) : (
          /* Single View Mode */
          <div className="flex-1 overflow-hidden flex flex-col">
            {activeTab === 'simulator' && (
              <div className="flex-1 bg-slate-50 dark:bg-slate-950/70 p-6 overflow-y-auto flex items-center justify-center">
                <PhoneSimulator
                  navController={navControllerInstance}
                  authViewModel={authViewModelInstance}
                  courseViewModel={courseViewModelInstance}
                />
              </div>
            )}
            {activeTab === 'code' && <CodeViewer />}
            {activeTab === 'inspector' && (
              <div className="flex-1 overflow-hidden bg-slate-50 dark:bg-slate-950/50">
                <div className="max-w-4xl mx-auto h-full">
                  <ArchitectureViewer
                    navController={navControllerInstance}
                    authViewModel={authViewModelInstance}
                    courseViewModel={courseViewModelInstance}
                  />
                </div>
              </div>
            )}
            {activeTab === 'guide' && <ArchitectureGuide />}
          </div>
        )}
      </main>
    </div>
  );
}
