import React, { useState } from 'react';
import { ArrowLeft, Bell, Download, Moon, Cpu, LogOut, CheckCircle } from 'lucide-react';

interface SettingsScreenProps {
  onNavigateBack: () => void;
  onLogout: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onNavigateBack,
  onLogout,
}) => {
  const [notifications, setNotifications] = useState(true);
  const [offlineCache, setOfflineCache] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="flex flex-col h-full bg-[#FEF7FF] dark:bg-[#141218] text-[#1D1B20] dark:text-[#E6E0E9]">
      {/* TopAppBar with Back Arrow */}
      <div className="flex items-center px-4 h-14 border-b border-[#79747E]/10 shrink-0 bg-white/60 dark:bg-[#141218]/60 backdrop-blur-md">
        <button
          type="button"
          onClick={onNavigateBack}
          className="p-2 -ml-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[#1D1B20] dark:text-white transition"
          aria-label="Back"
          title="navController.popBackStack()"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="ml-2 font-semibold text-base">Settings</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Preferences Section */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#1E1B24] border border-[#79747E]/15 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#79747E]">
            Preferences & Controls
          </h2>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#6750A4]/10 text-[#6750A4] dark:text-[#D0BCFF] flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold">Push Notifications</div>
                <div className="text-[10px] text-[#79747E]">Lesson reminders & updates</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="w-4 h-4 accent-[#6750A4] rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#6750A4]/10 text-[#6750A4] dark:text-[#D0BCFF] flex items-center justify-center">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold">Offline Course Cache</div>
                <div className="text-[10px] text-[#79747E]">Store slides & audio locally</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={offlineCache}
              onChange={(e) => setOfflineCache(e.target.checked)}
              className="w-4 h-4 accent-[#6750A4] rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Architecture Specs */}
        <div className="p-4 rounded-2xl bg-[#EADDFF]/40 dark:bg-[#381E72]/30 border border-[#6750A4]/20 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-[#6750A4] dark:text-[#D0BCFF]">
            <Cpu className="w-4 h-4" />
            <span>Architecture & Stack Verification</span>
          </div>

          <div className="space-y-1.5 text-xs text-[#49454F] dark:text-[#CAC4D0]">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-[#6750A4]" />
              <span>Pattern: Pure MVVM (UI → VM → Repo → Data)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-[#6750A4]" />
              <span>State: StateFlow reactive stream</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-[#6750A4]" />
              <span>Navigation: Compose NavHost with dynamic params</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-[#6750A4]" />
              <span>Backstack: System Back + Back Arrow popBackStack()</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-[#6750A4]" />
              <span>Session: DataStore Preferences persistence</span>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onLogout}
            className="w-full py-3 rounded-full bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition flex items-center justify-center gap-2 shadow-sm active:scale-[0.99]"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout Account</span>
          </button>
        </div>
      </div>
    </div>
  );
};
