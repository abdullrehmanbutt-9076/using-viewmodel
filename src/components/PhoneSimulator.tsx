import React, { useState, useEffect } from 'react';
import { NavController } from '../android/navigation/NavController';
import { AuthViewModel } from '../android/viewmodel/AuthViewModel';
import { CourseViewModel } from '../android/viewmodel/CourseViewModel';
import { AppNavigation } from '../android/navigation/AppNavigation';
import {
  Wifi,
  BatteryMedium,
  RotateCw,
  Sun,
  Moon,
  ChevronLeft,
  Square,
  Minus,
  Sparkles,
} from 'lucide-react';

interface PhoneSimulatorProps {
  navController: NavController;
  authViewModel: AuthViewModel;
  courseViewModel: CourseViewModel;
}

export const PhoneSimulator: React.FC<PhoneSimulatorProps> = ({
  navController,
  authViewModel,
  courseViewModel,
}) => {
  const [currentTime, setCurrentTime] = useState('09:41');
  const [isLandscape, setIsLandscape] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [backStack, setBackStack] = useState<string[]>(navController.getBackStack());
  const [currentRoute, setCurrentRoute] = useState<string>(navController.getCurrentRoute());

  // Subscribe to navigation events
  useEffect(() => {
    const unsub = navController.subscribe((route, stack) => {
      setCurrentRoute(route);
      setBackStack([...stack]);
    });
    return unsub;
  }, [navController]);

  // Keep simulated device time synced
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const hrs = now.getHours().toString().padStart(2, '0');
      const mins = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hrs}:${mins}`);
    };
    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSystemBack = () => {
    navController.popBackStack();
  };

  const handleSystemHome = () => {
    const authState = authViewModel.uiState;
    if (authState.isLoggedIn) {
      navController.navigate('dashboard', { launchSingleTop: true });
    } else {
      navController.navigate('login', { launchSingleTop: true });
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Device Control Toolbar */}
      <div className="w-full max-w-[420px] flex items-center justify-between mb-3 px-1 text-xs">
        <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Pixel 9 Pro · Android 15</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Rotate Device Button */}
          <button
            type="button"
            onClick={() => setIsLandscape(!isLandscape)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
            title="Rotate phone (Demonstrates ViewModel surviving rotation)"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isLandscape ? 'Portrait' : 'Rotate'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={() => setIsDarkTheme(!isDarkTheme)}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
            title="Toggle Device Dark Mode"
          >
            {isDarkTheme ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Android Device Shell */}
      <div
        className={`relative transition-all duration-300 ${
          isLandscape
            ? 'w-[740px] h-[400px]'
            : 'w-[370px] sm:w-[390px] h-[750px]'
        } bg-[#1F1F24] rounded-[48px] p-3 shadow-2xl ring-1 ring-black/20 flex flex-col`}
        style={{
          boxShadow:
            '0 25px 60px -15px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.08) inset',
        }}
      >
        {/* Outer Phone Accents */}
        <div className="absolute -left-[5px] top-28 w-[3px] h-10 bg-slate-700 rounded-l-md" />
        <div className="absolute -left-[5px] top-42 w-[3px] h-14 bg-slate-700 rounded-l-md" />
        <div className="absolute -right-[5px] top-32 w-[3px] h-12 bg-slate-700 rounded-r-md" />

        {/* Screen Display Container */}
        <div
          className={`relative w-full h-full rounded-[38px] overflow-hidden flex flex-col ${
            isDarkTheme ? 'dark' : ''
          }`}
        >
          {/* Top Android Status Bar */}
          <div className="h-9 px-6 bg-[#FEF7FF] dark:bg-[#141218] text-[#1D1B20] dark:text-[#E6E0E9] flex items-center justify-between text-xs font-medium shrink-0 select-none z-30 transition-colors">
            {/* Clock */}
            <span>{currentTime}</span>

            {/* Camera Punchhole */}
            <div className="w-4 h-4 rounded-full bg-black flex items-center justify-center ring-2 ring-slate-800/40">
              <div className="w-1.5 h-1.5 rounded-full bg-[#1b263b]/80" />
            </div>

            {/* System Icons */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-semibold tracking-tighter">5G</span>
              <Wifi className="w-3.5 h-3.5" />
              <BatteryMedium className="w-4 h-4" />
            </div>
          </div>

          {/* Composable Screen Viewport */}
          <div className="flex-1 relative overflow-hidden bg-[#FEF7FF] dark:bg-[#141218] transition-colors">
            <AppNavigation
              navController={navController}
              authViewModel={authViewModel}
              courseViewModel={courseViewModel}
            />
          </div>

          {/* Bottom Android System Navigation Bar with Back Button */}
          <div className="h-10 bg-[#FEF7FF] dark:bg-[#141218] border-t border-black/5 dark:border-white/5 flex items-center justify-around px-8 shrink-0 select-none z-30 transition-colors">
            {/* Android System Back Button */}
            <button
              type="button"
              onClick={handleSystemBack}
              disabled={backStack.length <= 1}
              className={`p-1.5 rounded-full transition active:scale-90 ${
                backStack.length > 1
                  ? 'text-slate-800 dark:text-slate-200 hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer'
                  : 'text-slate-300 dark:text-slate-600 cursor-not-allowed opacity-40'
              }`}
              title="Android System Back Button (pops Compose backstack)"
              aria-label="System Back"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
            </button>

            {/* Android System Home / Gesture Pill */}
            <button
              type="button"
              onClick={handleSystemHome}
              className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition active:scale-95"
              title="Android System Home"
              aria-label="System Home"
            >
              <div className="w-20 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full" />
            </button>

            {/* Android System Recents Button */}
            <button
              type="button"
              className="p-1.5 rounded-full text-slate-800 dark:text-slate-200 opacity-60 hover:opacity-100 hover:bg-black/10 dark:hover:bg-white/10 transition"
              title="Android Recent Apps"
              aria-label="System Recents"
            >
              <Square className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Real-time Backstack Inspector Pill */}
      <div className="mt-4 px-3.5 py-1.5 rounded-full bg-slate-900/90 text-white text-xs flex items-center gap-2 shadow-sm font-mono text-[11px] max-w-[420px] overflow-x-auto no-scrollbar">
        <span className="text-purple-300 font-semibold shrink-0">BackStack:</span>
        <div className="flex items-center gap-1.5 truncate">
          {backStack.map((route, i) => (
            <React.Fragment key={i}>
              <span
                className={`px-1.5 py-0.5 rounded ${
                  i === backStack.length - 1
                    ? 'bg-purple-600 text-white font-bold'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                {route}
              </span>
              {i < backStack.length - 1 && <span className="text-slate-500">→</span>}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
