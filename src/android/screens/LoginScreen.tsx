import React, { useState } from 'react';
import { AuthUiState } from '../types';
import { AuthViewModel } from '../viewmodel/AuthViewModel';
import { Mail, Lock, Eye, EyeOff, Loader2, BookOpen } from 'lucide-react';

interface LoginScreenProps {
  viewModel: AuthViewModel;
  uiState: AuthUiState;
  onNavigateToSignup: () => void;
  onLoginSuccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  viewModel,
  uiState,
  onNavigateToSignup,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('alex@example.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    const success = await viewModel.login(email, password);
    if (success) {
      onLoginSuccess();
    }
  };

  const handleQuickFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    viewModel.clearError();
  };

  return (
    <div className="flex flex-col h-full bg-[#FEF7FF] dark:bg-[#141218] text-[#1D1B20] dark:text-[#E6E0E9] p-6 overflow-y-auto">
      {/* Top Brand Branding */}
      <div className="flex flex-col items-center mt-6 mb-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#6750A4] text-white flex items-center justify-center shadow-md mb-3">
          <BookOpen className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[#1D1B20] dark:text-white">
          CourseApp
        </h1>
        <p className="text-xs text-[#49454F] dark:text-[#CAC4D0] mt-1">
          Kotlin · Jetpack Compose · Material 3 · MVVM
        </p>
      </div>

      {/* Screen Title */}
      <div className="mb-6 text-center">
        <h2 className="text-xl font-semibold">Welcome Back</h2>
        <p className="text-sm text-[#49454F] dark:text-[#CAC4D0]">
          Sign in to your learning dashboard
        </p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div>
          <label className="block text-xs font-medium text-[#49454F] dark:text-[#CAC4D0] mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#79747E]">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                viewModel.clearError();
              }}
              placeholder="name@example.com"
              className="w-full pl-10 pr-3 py-3 rounded-xl border border-[#79747E]/30 bg-white dark:bg-[#211F26] text-sm focus:outline-none focus:ring-2 focus:ring-[#6750A4] focus:border-transparent transition"
              required
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-xs font-medium text-[#49454F] dark:text-[#CAC4D0] mb-1.5">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#79747E]">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                viewModel.clearError();
              }}
              placeholder="••••••••"
              className="w-full pl-10 pr-10 py-3 rounded-xl border border-[#79747E]/30 bg-white dark:bg-[#211F26] text-sm focus:outline-none focus:ring-2 focus:ring-[#6750A4] focus:border-transparent transition"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#79747E] hover:text-[#1D1B20] dark:hover:text-white"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Error Message Display */}
        {uiState.errorMessage && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs">
            {uiState.errorMessage}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={uiState.isLoading || !email.trim() || !password.trim()}
          className="w-full py-3.5 px-4 rounded-full bg-[#6750A4] hover:bg-[#584291] text-white font-medium text-sm shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.99]"
        >
          {uiState.isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Authenticating...</span>
            </>
          ) : (
            <span>Login to Dashboard</span>
          )}
        </button>
      </form>

      {/* Quick Fill Demo Credentials */}
      <div className="mt-6 pt-5 border-t border-[#79747E]/20 text-center">
        <p className="text-[11px] text-[#49454F] dark:text-[#CAC4D0] mb-2 font-medium">
          Quick Demo User:
        </p>
        <button
          type="button"
          onClick={() => handleQuickFill('alex@example.com', 'password123')}
          className="text-xs px-3 py-1.5 rounded-lg bg-[#EADDFF] dark:bg-[#4F378B] text-[#21005D] dark:text-[#EADDFF] font-medium hover:opacity-90 transition"
        >
          Use alex@example.com (password123)
        </button>
      </div>

      {/* Navigate to Signup */}
      <div className="mt-auto pt-6 text-center">
        <p className="text-xs text-[#49454F] dark:text-[#CAC4D0]">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onNavigateToSignup}
            className="text-[#6750A4] dark:text-[#D0BCFF] font-semibold hover:underline"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};
