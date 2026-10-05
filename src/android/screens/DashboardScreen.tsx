import React from 'react';
import { AuthUiState, CourseUiState } from '../types';
import { AuthViewModel } from '../viewmodel/AuthViewModel';
import { CourseViewModel } from '../viewmodel/CourseViewModel';
import {
  Home,
  BookOpen,
  User as UserIcon,
  Settings as SettingsIcon,
  LogOut,
  ArrowRight,
  Sparkles,
  Clock,
  GraduationCap,
} from 'lucide-react';

interface DashboardScreenProps {
  authViewModel: AuthViewModel;
  courseViewModel: CourseViewModel;
  authState: AuthUiState;
  courseState: CourseUiState;
  onNavigateToCourses: () => void;
  onNavigateToCourseDetails: (courseId: string) => void;
  onNavigateToProfile: () => void;
  onNavigateToSettings: () => void;
  onLogout: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  authState,
  courseState,
  onNavigateToCourses,
  onNavigateToCourseDetails,
  onNavigateToProfile,
  onNavigateToSettings,
  onLogout,
}) => {
  const featuredCourses = courseState.courses.slice(0, 3);

  return (
    <div className="flex flex-col h-full bg-[#FEF7FF] dark:bg-[#141218] text-[#1D1B20] dark:text-[#E6E0E9]">
      {/* TopAppBar */}
      <div className="flex items-center justify-between px-5 h-16 border-b border-[#79747E]/10 shrink-0 bg-white/70 dark:bg-[#141218]/70 backdrop-blur-md sticky top-0 z-10">
        <div>
          <h1 className="font-bold text-lg leading-tight">
            Hi, {authState.userName || 'Student'}
          </h1>
          <p className="text-[11px] text-[#49454F] dark:text-[#CAC4D0]">
            Track your learning journey
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onNavigateToProfile}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition"
            aria-label="Profile"
          >
            <UserIcon className="w-5 h-5 text-[#6750A4] dark:text-[#D0BCFF]" />
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-red-600 dark:text-red-400 transition"
            aria-label="Logout"
            title="Log out and clear backstack"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-[#EADDFF] dark:bg-[#381E72] text-[#21005D] dark:text-[#EADDFF] shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider opacity-80">
                Enrolled
              </span>
              <GraduationCap className="w-4 h-4 opacity-70" />
            </div>
            <div className="text-2xl font-bold tracking-tight">2 Courses</div>
            <div className="text-[11px] mt-1 opacity-75">PY101 & WD101</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#E8DEF8] dark:bg-[#4A4458] text-[#1D192B] dark:text-[#E8DEF8] shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider opacity-80">
                Completed
              </span>
              <Clock className="w-4 h-4 opacity-70" />
            </div>
            <div className="text-2xl font-bold tracking-tight">18 Lessons</div>
            <div className="text-[11px] mt-1 opacity-75">45% total progress</div>
          </div>
        </div>

        {/* Explore All Courses Banner CTA */}
        <div
          onClick={onNavigateToCourses}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onNavigateToCourses();
          }}
          className="p-4 rounded-2xl bg-gradient-to-r from-[#6750A4] to-[#7965B2] text-white shadow-md cursor-pointer hover:opacity-95 transition active:scale-[0.99] flex items-center justify-between"
        >
          <div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-[#EADDFF] mb-0.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full Curriculum</span>
            </div>
            <h2 className="text-base font-bold">Explore All Courses</h2>
            <p className="text-xs text-[#EADDFF]/90 mt-0.5">
              Search by title or Course ID ({courseState.courses.length} courses)
            </p>
          </div>
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Featured Courses Header */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <h3 className="font-bold text-base">Featured Courses</h3>
            <p className="text-xs text-[#49454F] dark:text-[#CAC4D0]">
              Click any course to inspect Course ID
            </p>
          </div>
          <button
            type="button"
            onClick={onNavigateToCourses}
            className="text-xs font-semibold text-[#6750A4] dark:text-[#D0BCFF] hover:underline"
          >
            See All
          </button>
        </div>

        {/* Featured Courses Horizontal Scroll List */}
        <div className="flex gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar">
          {featuredCourses.map((course) => (
            <div
              key={course.courseId}
              onClick={() => onNavigateToCourseDetails(course.courseId)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onNavigateToCourseDetails(course.courseId);
              }}
              className="min-w-[210px] p-4 rounded-2xl border border-[#79747E]/20 bg-white dark:bg-[#1E1B24] shadow-sm hover:shadow transition cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-[#6750A4] dark:text-[#D0BCFF]">
                    {course.courseId}
                  </span>
                  <span className="text-[10px] text-[#49454F] dark:text-[#CAC4D0]">
                    ★ {course.rating}
                  </span>
                </div>
                <h4 className="font-semibold text-sm line-clamp-1">{course.title}</h4>
                <p className="text-xs text-[#49454F] dark:text-[#CAC4D0] mt-1">
                  {course.instructor}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-[#79747E]/10 flex items-center justify-between text-[11px] text-[#49454F] dark:text-[#CAC4D0]">
                <span>{course.duration}</span>
                <span className="font-medium text-[#1D1B20] dark:text-[#E6E0E9]">
                  {course.lessons} lessons
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Architecture Note */}
        <div className="p-3.5 rounded-xl border border-dashed border-[#79747E]/30 bg-black/[0.02] dark:bg-white/[0.02] text-xs space-y-1">
          <div className="font-semibold text-[11px] text-[#6750A4] dark:text-[#D0BCFF] uppercase tracking-wide">
            Jetpack Navigation Compose Route
          </div>
          <p className="text-[#49454F] dark:text-[#CAC4D0]">
            Current screen: <code className="font-mono text-[11px] font-semibold">dashboard</code>
            {' '}→ Clicking a course triggers dynamic navigation{' '}
            <code className="font-mono text-[11px] font-semibold">course/{"{courseId}"}</code>
          </p>
        </div>
      </div>

      {/* Material 3 Bottom Navigation Bar */}
      <div className="h-16 border-t border-[#79747E]/15 bg-white/90 dark:bg-[#141218]/90 backdrop-blur-md grid grid-cols-4 items-center shrink-0">
        <button
          type="button"
          className="flex flex-col items-center justify-center text-[#6750A4] dark:text-[#D0BCFF]"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-1">Dashboard</span>
        </button>

        <button
          type="button"
          onClick={onNavigateToCourses}
          className="flex flex-col items-center justify-center text-[#49454F] dark:text-[#CAC4D0] hover:text-[#1D1B20] dark:hover:text-white transition"
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">Courses</span>
        </button>

        <button
          type="button"
          onClick={onNavigateToProfile}
          className="flex flex-col items-center justify-center text-[#49454F] dark:text-[#CAC4D0] hover:text-[#1D1B20] dark:hover:text-white transition"
        >
          <UserIcon className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">Profile</span>
        </button>

        <button
          type="button"
          onClick={onNavigateToSettings}
          className="flex flex-col items-center justify-center text-[#49454F] dark:text-[#CAC4D0] hover:text-[#1D1B20] dark:hover:text-white transition"
        >
          <SettingsIcon className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">Settings</span>
        </button>
      </div>
    </div>
  );
};
