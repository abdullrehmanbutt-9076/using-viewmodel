import React, { useState } from 'react';
import { AuthUiState } from '../types';
import { AuthViewModel } from '../viewmodel/AuthViewModel';
import { ArrowLeft, User, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

interface SignupScreenProps {
  viewModel: AuthViewModel;
  uiState: AuthUiState;
  onNavigateToLogin: () => void;
  onSignupSuccess: () => void;
}

export const SignupScreen: React.FC<SignupScreenProps> = ({
  viewModel,
  uiState,
  onNavigateToLogin,
  onSignupSuccess,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (name.trim().length < 2) {
      setValidationError('Name must be at least 2 characters long');
      return;
    }
    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      setValidationError('Please enter a valid email address');
      return;
    }
    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters long');
      return;
    }
    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    const success = await viewModel.signup(name, email, password);
    if (success) {
      onSignupSuccess();
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#FEF7FF] dark:bg-[#141218] text-[#1D1B20] dark:text-[#E6E0E9]">
      {/* TopAppBar with Back Arrow */}
      <div className="flex items-center px-4 h-14 border-b border-[#79747E]/10 shrink-0">
        <button
          type="button"
          onClick={onNavigateToLogin}
          className="p-2 -ml-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[#1D1B20] dark:text-white transition"
          aria-label="Back to Login"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="ml-2 font-semibold text-base">Create Account</h1>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="mb-6">
          <h2 className="text-xl font-bold">Join CourseApp</h2>
          <p className="text-xs text-[#49454F] dark:text-[#CAC4D0] mt-1">
            Access world-class programming courses
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-medium text-[#49454F] dark:text-[#CAC4D0] mb-1">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#79747E]">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  viewModel.clearError();
                  setValidationError(null);
                }}
                placeholder="e.g. Jordan Miller"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#79747E]/30 bg-white dark:bg-[#211F26] text-sm focus:outline-none focus:ring-2 focus:ring-[#6750A4] transition"
                required
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-medium text-[#49454F] dark:text-[#CAC4D0] mb-1">
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
                  setValidationError(null);
                }}
                placeholder="jordan@example.com"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#79747E]/30 bg-white dark:bg-[#211F26] text-sm focus:outline-none focus:ring-2 focus:ring-[#6750A4] transition"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-medium text-[#49454F] dark:text-[#CAC4D0] mb-1">
              Password (min 6 chars)
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
                  setValidationError(null);
                }}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#79747E]/30 bg-white dark:bg-[#211F26] text-sm focus:outline-none focus:ring-2 focus:ring-[#6750A4] transition"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#79747E]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-medium text-[#49454F] dark:text-[#CAC4D0] mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#79747E]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  viewModel.clearError();
                  setValidationError(null);
                }}
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#79747E]/30 bg-white dark:bg-[#211F26] text-sm focus:outline-none focus:ring-2 focus:ring-[#6750A4] transition"
                required
              />
            </div>
          </div>

          {/* Error Message */}
          {(validationError || uiState.errorMessage) && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs">
              {validationError || uiState.errorMessage}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={uiState.isLoading || !name.trim() || !email.trim() || password.length < 6}
            className="w-full py-3.5 px-4 mt-2 rounded-full bg-[#6750A4] hover:bg-[#584291] text-white font-medium text-sm shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {uiState.isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-[#49454F] dark:text-[#CAC4D0]">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onNavigateToLogin}
              className="text-[#6750A4] dark:text-[#D0BCFF] font-semibold hover:underline"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
