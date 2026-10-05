import React, { useState, useEffect } from 'react';
import { NavController } from '../android/navigation/NavController';
import { AuthViewModel } from '../android/viewmodel/AuthViewModel';
import { CourseViewModel } from '../android/viewmodel/CourseViewModel';
import { sessionManagerInstance } from '../android/data/SessionManager';
import { AuthUiState, CourseUiState, SessionData } from '../android/types';
import {
  Layers,
  ArrowDown,
  Activity,
  Database,
  Smartphone,
  Cpu,
  RefreshCw,
  Search,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';

interface ArchitectureViewerProps {
  navController: NavController;
  authViewModel: AuthViewModel;
  courseViewModel: CourseViewModel;
}

export const ArchitectureViewer: React.FC<ArchitectureViewerProps> = ({
  navController,
  authViewModel,
  courseViewModel,
}) => {
  const [authState, setAuthState] = useState<AuthUiState>(authViewModel.uiState);
  const [courseState, setCourseState] = useState<CourseUiState>(courseViewModel.uiState);
  const [session, setSession] = useState<SessionData>(sessionManagerInstance.getSession());
  const [currentRoute, setCurrentRoute] = useState<string>(navController.getCurrentRoute());
  const [backStack, setBackStack] = useState<string[]>(navController.getBackStack());

  useEffect(() => {
    const unsubNav = navController.subscribe((route, stack) => {
      setCurrentRoute(route);
      setBackStack([...stack]);
    });
    const unsubAuth = authViewModel.subscribe((state) => {
      setAuthState(state);
    });
    const unsubCourse = courseViewModel.subscribe((state) => {
      setCourseState(state);
    });
    const unsubSession = sessionManagerInstance.subscribe((s) => {
      setSession(s);
    });

    return () => {
      unsubNav();
      unsubAuth();
      unsubCourse();
      unsubSession();
    };
  }, [navController, authViewModel, courseViewModel]);

  return (
    <div className="h-full flex flex-col overflow-y-auto p-4 space-y-5 text-slate-800 dark:text-slate-100">
      {/* Title & Architecture Banner */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Layers className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h2 className="text-base font-bold">Android MVVM Architecture Inspector</h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Live verification of unidirectional data flow: UI → ViewModel → Repository → Data Source
        </p>
      </div>

      {/* Visual MVVM Layer Diagram */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
          <span>Active Layer Data Flow</span>
          <span className="text-[11px] font-mono text-purple-600 dark:text-purple-400">
            Route: {currentRoute}
          </span>
        </h3>

        {/* Layer 1: Composable Screen */}
        <div className="p-3 rounded-xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/50 dark:bg-purple-950/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-xs font-bold text-purple-900 dark:text-purple-200">
                1. UI Layer (Composable Screens)
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-purple-200 dark:bg-purple-800 text-purple-900 dark:text-purple-100 font-mono">
              collectAsStateWithLifecycle()
            </span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">
            Pure declarative UI. No business logic in screens. Observes StateFlow and dispatches user actions to ViewModel.
          </p>
        </div>

        <div className="flex justify-center -my-1 text-slate-400">
          <ArrowDown className="w-4 h-4" />
        </div>

        {/* Layer 2: ViewModels */}
        <div className="p-3 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-bold text-blue-900 dark:text-blue-200">
                2. ViewModel Layer (StateFlow)
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-100 font-mono">
              Survives Rotation
            </span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">
            <code className="font-mono text-blue-600 dark:text-blue-300">AuthViewModel</code> &{' '}
            <code className="font-mono text-blue-600 dark:text-blue-300">CourseViewModel</code> manage UI state, coroutines, and coordinate with repositories.
          </p>
        </div>

        <div className="flex justify-center -my-1 text-slate-400">
          <ArrowDown className="w-4 h-4" />
        </div>

        {/* Layer 3: Repositories */}
        <div className="p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                3. Repository Layer (Clean API)
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 font-mono">
              Single Source of Truth
            </span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">
            <code className="font-mono text-emerald-700 dark:text-emerald-300">AuthRepository</code> &{' '}
            <code className="font-mono text-emerald-700 dark:text-emerald-300">CourseRepository</code> abstract data sources, handle caching and credentials.
          </p>
        </div>

        <div className="flex justify-center -my-1 text-slate-400">
          <ArrowDown className="w-4 h-4" />
        </div>

        {/* Layer 4: Data Source / DataStore */}
        <div className="p-3 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="text-xs font-bold text-amber-900 dark:text-amber-200">
                4. Data Source (DataStore Session)
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 font-mono">
              SessionManager.kt
            </span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">
            Persists <code className="font-mono">isLoggedIn</code>, <code className="font-mono">userName</code>, and <code className="font-mono">userEmail</code> across app restarts.
          </p>
        </div>
      </div>

      {/* Live StateFlow Emission Inspector */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Live StateFlow Emissions
        </h3>

        {/* AuthUiState Box */}
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono">
          <div className="flex items-center justify-between text-[11px] font-sans font-bold text-purple-700 dark:text-purple-300 mb-2">
            <span>AuthViewModel.uiState</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${
              authState.isLoggedIn ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
            }`}>
              {authState.isLoggedIn ? 'LoggedIn ✓' : 'LoggedOut'}
            </span>
          </div>
          <pre className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 text-[11px] overflow-x-auto text-slate-700 dark:text-slate-300">
{JSON.stringify(
  {
    isLoading: authState.isLoading,
    isLoggedIn: authState.isLoggedIn,
    userName: authState.userName,
    userEmail: authState.userEmail,
    errorMessage: authState.errorMessage,
  },
  null,
  2
)}
          </pre>
        </div>

        {/* CourseUiState Box */}
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono">
          <div className="flex items-center justify-between text-[11px] font-sans font-bold text-blue-700 dark:text-blue-300 mb-2">
            <span>CourseViewModel.uiState</span>
            <span className="text-[10px] text-slate-500 font-sans">
              Courses: {courseState.courses.length}
            </span>
          </div>
          <pre className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 text-[11px] overflow-x-auto text-slate-700 dark:text-slate-300">
{JSON.stringify(
  {
    selectedCourseId: courseState.selectedCourse?.courseId ?? null,
    selectedTitle: courseState.selectedCourse?.title ?? null,
    searchQuery: courseState.searchQuery,
    totalCourses: courseState.courses.length,
    isLoading: courseState.isLoading,
    errorMessage: courseState.errorMessage,
  },
  null,
  2
)}
          </pre>
        </div>
      </div>

      {/* Interactive Quick Route Simulation Controls */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Interactive Navigation Triggers
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Click any button below to trigger real Navigation Compose actions inside the simulated phone:
        </p>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() => navController.navigate('courses')}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-left transition"
          >
            <div className="font-semibold text-purple-700 dark:text-purple-300">navController.navigate("courses")</div>
            <div className="text-[10px] text-slate-500">Go to Course List</div>
          </button>

          <button
            type="button"
            onClick={() => navController.navigate('course/PY101')}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-left transition"
          >
            <div className="font-semibold text-purple-700 dark:text-purple-300">navigate("course/PY101")</div>
            <div className="text-[10px] text-slate-500">Dynamic Course ID</div>
          </button>

          <button
            type="button"
            onClick={() => navController.navigate('course/WD101')}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-left transition"
          >
            <div className="font-semibold text-purple-700 dark:text-purple-300">navigate("course/WD101")</div>
            <div className="text-[10px] text-slate-500">Dynamic Course ID</div>
          </button>

          <button
            type="button"
            onClick={() => navController.popBackStack()}
            disabled={backStack.length <= 1}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-left transition disabled:opacity-40"
          >
            <div className="font-semibold text-purple-700 dark:text-purple-300">popBackStack()</div>
            <div className="text-[10px] text-slate-500">Pop active screen</div>
          </button>

          <button
            type="button"
            onClick={() => courseViewModel.searchCourses('PY101')}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-left transition"
          >
            <div className="font-semibold text-blue-700 dark:text-blue-300">searchCourses("PY101")</div>
            <div className="text-[10px] text-slate-500">Search by Course ID</div>
          </button>

          <button
            type="button"
            onClick={() => courseViewModel.searchCourses('Python')}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-left transition"
          >
            <div className="font-semibold text-blue-700 dark:text-blue-300">searchCourses("Python")</div>
            <div className="text-[10px] text-slate-500">Search by Title</div>
          </button>
        </div>
      </div>
    </div>
  );
};
