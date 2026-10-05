import React from 'react';
import { AuthUiState } from '../types';
import { ArrowLeft, User, Mail, ShieldCheck, Award, LogOut, BookOpen } from 'lucide-react';

interface ProfileScreenProps {
  authState: AuthUiState;
  onNavigateBack: () => void;
  onLogout: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  authState,
  onNavigateBack,
  onLogout,
}) => {
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
        <h1 className="ml-2 font-semibold text-base">Student Profile</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Profile Card */}
        <div className="flex flex-col items-center p-6 rounded-2xl bg-white dark:bg-[#1E1B24] border border-[#79747E]/15 shadow-sm text-center">
          <div className="w-20 h-20 rounded-full bg-[#EADDFF] dark:bg-[#4F378B] text-[#21005D] dark:text-[#EADDFF] flex items-center justify-center font-bold text-2xl shadow-inner mb-3">
            {authState.userName ? authState.userName.charAt(0).toUpperCase() : 'U'}
          </div>
          <h2 className="text-xl font-bold">{authState.userName || 'Student'}</h2>
          <p className="text-xs text-[#79747E] mt-0.5">{authState.userEmail}</p>

          <div className="mt-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Authenticated (DataStore Session)</span>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-white dark:bg-[#1E1B24] border border-[#79747E]/15 text-center">
            <div className="text-xl font-bold text-[#6750A4] dark:text-[#D0BCFF]">2</div>
            <div className="text-[11px] text-[#79747E] mt-0.5">Enrolled Courses</div>
          </div>
          <div className="p-3.5 rounded-xl bg-white dark:bg-[#1E1B24] border border-[#79747E]/15 text-center">
            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">1</div>
            <div className="text-[11px] text-[#79747E] mt-0.5">Certificates Earned</div>
          </div>
        </div>

        {/* Account Details Section */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#1E1B24] border border-[#79747E]/15 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#79747E]">
            Account & Identity
          </h3>

          <div className="flex items-center justify-between text-xs py-1 border-b border-[#79747E]/10">
            <span className="text-[#79747E] flex items-center gap-2">
              <User className="w-3.5 h-3.5" /> Name
            </span>
            <span className="font-medium">{authState.userName}</span>
          </div>

          <div className="flex items-center justify-between text-xs py-1 border-b border-[#79747E]/10">
            <span className="text-[#79747E] flex items-center gap-2">
              <Mail className="w-3.5 h-3.5" /> Email
            </span>
            <span className="font-medium">{authState.userEmail}</span>
          </div>

          <div className="flex items-center justify-between text-xs py-1">
            <span className="text-[#79747E] flex items-center gap-2">
              <Award className="w-3.5 h-3.5" /> Role
            </span>
            <span className="font-medium text-[#6750A4] dark:text-[#D0BCFF]">Android Developer</span>
          </div>
        </div>

        {/* Logout Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onLogout}
            className="w-full py-3 rounded-full border border-red-300 dark:border-red-900/60 bg-red-50/50 dark:bg-red-950/20 text-red-600 dark:text-red-400 hover:bg-red-100/50 dark:hover:bg-red-900/40 text-sm font-semibold transition flex items-center justify-center gap-2 shadow-sm active:scale-[0.99]"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout (Clear Session & BackStack)</span>
          </button>
          <p className="text-[10px] text-center text-[#79747E] mt-2">
            Prevents back-navigation to protected screens after logout
          </p>
        </div>
      </div>
    </div>
  );
};
