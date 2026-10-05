import React from 'react';
import { CourseUiState } from '../types';
import { CourseViewModel } from '../viewmodel/CourseViewModel';
import { ArrowLeft, Search, X, Loader2, BookOpen } from 'lucide-react';

interface CoursesScreenProps {
  viewModel: CourseViewModel;
  uiState: CourseUiState;
  onCourseClick: (courseId: string) => void;
  onNavigateBack: () => void;
}

export const CoursesScreen: React.FC<CoursesScreenProps> = ({
  viewModel,
  uiState,
  onCourseClick,
  onNavigateBack,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    viewModel.searchCourses(e.target.value);
  };

  const handleClear = () => {
    viewModel.searchCourses('');
  };

  return (
    <div className="flex flex-col h-full bg-[#FEF7FF] dark:bg-[#141218] text-[#1D1B20] dark:text-[#E6E0E9]">
      {/* TopAppBar with Back Arrow */}
      <div className="flex items-center px-4 h-14 border-b border-[#79747E]/10 shrink-0 bg-white/60 dark:bg-[#141218]/60 backdrop-blur-md">
        <button
          type="button"
          onClick={onNavigateBack}
          className="p-2 -ml-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[#1D1B20] dark:text-white transition"
          aria-label="Back to Dashboard"
          title="navController.popBackStack()"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="ml-2">
          <h1 className="font-semibold text-base">Courses</h1>
          <p className="text-[10px] text-[#49454F] dark:text-[#CAC4D0]">
            Search by Title or Course ID
          </p>
        </div>
      </div>

      {/* Search Bar calling CourseViewModel.searchCourses(query) */}
      <div className="p-4 pb-2 shrink-0">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#79747E]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={uiState.searchQuery}
            onChange={handleSearchChange}
            placeholder="Search Course (e.g. PY101, Python, Web)..."
            className="w-full pl-10 pr-10 py-2.5 rounded-full border border-[#79747E]/30 bg-white dark:bg-[#211F26] text-sm focus:outline-none focus:ring-2 focus:ring-[#6750A4] transition placeholder:text-[#79747E]"
          />
          {uiState.searchQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#79747E] hover:text-[#1D1B20] dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Search Tag Suggestions */}
        <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto no-scrollbar text-xs text-[#49454F] dark:text-[#CAC4D0]">
          <span className="shrink-0 text-[11px] font-medium mr-1">Quick:</span>
          {['PY101', 'WD101', 'JV101', 'KT101', 'Python'].map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => viewModel.searchCourses(tag)}
              className={`px-2.5 py-1 rounded-md text-[11px] transition ${
                uiState.searchQuery.toLowerCase() === tag.toLowerCase()
                  ? 'bg-[#6750A4] text-white font-medium'
                  : 'bg-black/5 dark:bg-white/10 hover:bg-black/10'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Courses List */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
        {uiState.isLoading ? (
          <div className="flex flex-col items-center justify-center h-48 text-[#49454F]">
            <Loader2 className="w-6 h-6 animate-spin mb-2 text-[#6750A4]" />
            <span className="text-xs">Loading courses via CourseViewModel...</span>
          </div>
        ) : uiState.courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center p-6">
            <BookOpen className="w-8 h-8 text-[#79747E] mb-2 opacity-50" />
            <p className="text-sm font-medium">No courses found</p>
            <p className="text-xs text-[#79747E] mt-1">
              No results for "{uiState.searchQuery}". Try searching for "PY101" or "Python".
            </p>
            <button
              type="button"
              onClick={handleClear}
              className="mt-3 text-xs font-semibold text-[#6750A4] dark:text-[#D0BCFF] hover:underline"
            >
              Reset Search Filter
            </button>
          </div>
        ) : (
          uiState.courses.map((course) => (
            <div
              key={course.courseId}
              onClick={() => onCourseClick(course.courseId)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onCourseClick(course.courseId);
              }}
              className="p-4 rounded-2xl border border-[#79747E]/20 bg-white dark:bg-[#1E1B24] shadow-sm hover:border-[#6750A4]/40 hover:shadow-md transition cursor-pointer active:scale-[0.99]"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h3 className="font-bold text-base text-[#1D1B20] dark:text-white">
                    {course.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-bold text-[#6750A4] dark:text-[#D0BCFF]">
                      Course ID: {course.courseId}
                    </span>
                    <span className="text-xs text-[#79747E]">·</span>
                    <span className="text-xs text-[#79747E]">{course.level}</span>
                  </div>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-[#EADDFF]/70 dark:bg-[#4F378B]/70 text-[#21005D] dark:text-[#EADDFF] text-xs font-semibold">
                  ★ {course.rating}
                </div>
              </div>

              <p className="text-xs text-[#49454F] dark:text-[#CAC4D0] mt-2 line-clamp-2">
                {course.description}
              </p>

              <div className="mt-3 pt-3 border-t border-[#79747E]/10 flex items-center justify-between text-xs text-[#49454F] dark:text-[#CAC4D0]">
                <span>Instructor: <strong className="font-medium text-[#1D1B20] dark:text-[#E6E0E9]">{course.instructor}</strong></span>
                <span>{course.duration} · {course.lessons} Lessons</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
