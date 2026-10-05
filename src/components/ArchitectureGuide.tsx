import React from 'react';
import {
  CheckCircle2,
  Layers,
  ArrowRight,
  Database,
  Smartphone,
  Cpu,
  Shield,
  Search,
  RotateCw,
  LogOut,
  Navigation,
} from 'lucide-react';

export const ArchitectureGuide: React.FC = () => {
  return (
    <div className="h-full overflow-y-auto p-6 space-y-6 text-slate-800 dark:text-slate-100 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
          Android Jetpack Compose MVVM Architecture Guide
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Complete breakdown of architecture, Navigation Compose, ViewModel state management, and repository pattern.
        </p>
      </div>

      {/* 1. Core Architecture Flow */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-2">
          <Layers className="w-4 h-4" />
          <span>1. Strict MVVM Separation of Concerns</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-center text-xs">
          <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 font-semibold text-purple-900 dark:text-purple-200">
            UI / Composable
            <div className="font-normal text-[11px] text-slate-500 mt-0.5">Observes StateFlow only</div>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 font-semibold text-blue-900 dark:text-blue-200">
            ViewModel
            <div className="font-normal text-[11px] text-slate-500 mt-0.5">StateFlow & Coroutines</div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 font-semibold text-emerald-900 dark:text-emerald-200">
            Repository
            <div className="font-normal text-[11px] text-slate-500 mt-0.5">Clean Data Access API</div>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 font-semibold text-amber-900 dark:text-amber-200">
            Data Source
            <div className="font-normal text-[11px] text-slate-500 mt-0.5">DataStore & Course catalog</div>
          </div>
        </div>

        <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1 leading-relaxed">
          <p>
            <strong>Rule:</strong> Composable screens NEVER contain direct database, network, or business logic. All screens consume state via <code className="font-mono text-purple-600 dark:text-purple-400">val uiState by viewModel.uiState.collectAsStateWithLifecycle()</code> and dispatch user interactions directly to ViewModel methods.
          </p>
        </div>
      </div>

      {/* 2. Key Requirements Verification Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Requirement Box 1: Dynamic Navigation & Course ID */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
            <Navigation className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Dynamic Course ID Navigation</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Navigation Compose route is declared as <code className="font-mono text-[11px] bg-slate-100 dark:bg-slate-800 px-1 rounded">course/{"{courseId}"}</code>.
            When clicking a card:
          </p>
          <pre className="p-2 rounded bg-slate-50 dark:bg-slate-950 font-mono text-[11px] text-purple-700 dark:text-purple-300 overflow-x-auto">
            {'navController.navigate("course/${course.courseId}")'}
          </pre>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            In CourseDetailsScreen, <code className="font-mono text-[11px]">courseViewModel.selectCourse(courseId)</code> is called to load the course into <code className="font-mono text-[11px]">uiState.selectedCourse</code>.
          </p>
        </div>

        {/* Requirement Box 2: Back Arrow & System Back */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Back Arrow & Android System Back</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            TopAppBar back arrow in CourseDetails, Profile, and Settings calls:
          </p>
          <pre className="p-2 rounded bg-slate-50 dark:bg-slate-950 font-mono text-[11px] text-emerald-700 dark:text-emerald-300 overflow-x-auto">
navController.popBackStack()
          </pre>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            The Android hardware/gesture System Back button uses the exact same Navigation Compose backstack.
          </p>
        </div>

        {/* Requirement Box 3: Logout Backstack Clearing */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
            <LogOut className="w-4 h-4 text-red-600 dark:text-red-400" />
            <span>Secure Logout Backstack Clearing</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            On logout, <code className="font-mono text-[11px]">authViewModel.logout()</code> clears the DataStore session, and the backstack is cleared so user cannot press Back to return to Dashboard:
          </p>
          <pre className="p-2 rounded bg-slate-50 dark:bg-slate-950 font-mono text-[11px] text-red-700 dark:text-red-300 overflow-x-auto">
navController.navigate("login") {"{"}
    popUpTo(0) {"{"} inclusive = true {"}"}
{"}"}
          </pre>
        </div>

        {/* Requirement Box 4: Rotation & Configuration Survival */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
            <RotateCw className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>ViewModel Survives Rotation</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            By scoping ViewModel instances to ViewModelStoreOwner (Activity / NavGraph), rotating the device does not re-fetch courses or lose selected item state. StateFlow holds the canonical state.
          </p>
        </div>
      </div>
    </div>
  );
};
