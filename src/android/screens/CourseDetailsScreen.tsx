import React, { useEffect, useState } from 'react';
import { CourseUiState } from '../types';
import { CourseViewModel } from '../viewmodel/CourseViewModel';
import {
  ArrowLeft,
  User,
  Clock,
  BookOpen,
  CheckCircle,
  Share2,
  Bookmark,
  Award,
  Loader2,
} from 'lucide-react';

interface CourseDetailsScreenProps {
  viewModel: CourseViewModel;
  uiState: CourseUiState;
  courseId: string;
  onNavigateBack: () => void;
}

export const CourseDetailsScreen: React.FC<CourseDetailsScreenProps> = ({
  viewModel,
  uiState,
  courseId,
  onNavigateBack,
}) => {
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Trigger ViewModel course selection on mount or when courseId changes
  useEffect(() => {
    viewModel.selectCourse(courseId);
  }, [courseId, viewModel]);

  const course = uiState.selectedCourse;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#FEF7FF] dark:bg-[#141218] text-[#1D1B20] dark:text-[#E6E0E9]">
      {/* Material 3 TopAppBar with Back Arrow */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-[#79747E]/10 shrink-0 bg-white/70 dark:bg-[#141218]/70 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center">
          <button
            type="button"
            onClick={onNavigateBack}
            className="p-2 -ml-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[#1D1B20] dark:text-white transition"
            aria-label="Back to Courses"
            title="navController.popBackStack()"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="ml-2 font-semibold text-sm truncate max-w-[200px]">
            {course?.title || 'Course Details'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleShare}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition"
            title="Share Course"
          >
            <Share2 className="w-4 h-4 text-[#49454F] dark:text-[#CAC4D0]" />
          </button>
          <button
            type="button"
            onClick={() => setIsEnrolled(!isEnrolled)}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition"
            title="Bookmark"
          >
            <Bookmark className={`w-4 h-4 ${isEnrolled ? 'fill-[#6750A4] text-[#6750A4]' : 'text-[#49454F]'}`} />
          </button>
        </div>
      </div>

      {copiedNotification && (
        <div className="bg-[#6750A4] text-white text-xs py-1.5 px-4 text-center">
          Course link copied to clipboard!
        </div>
      )}

      {/* Main Body */}
      {uiState.isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-[#6750A4] mb-2" />
          <span className="text-xs text-[#79747E]">Loading Course ID {courseId}...</span>
        </div>
      ) : !course ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <p className="font-semibold text-base mb-1">Course not found</p>
          <p className="text-xs text-[#79747E] mb-4">
            Could not find course with ID: {courseId}
          </p>
          <button
            type="button"
            onClick={onNavigateBack}
            className="px-4 py-2 rounded-full bg-[#6750A4] text-white text-xs font-medium"
          >
            Back to Courses
          </button>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-5 space-y-5 pb-24">
          {/* Header Card */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-[#6750A4] text-white text-xs font-bold tracking-wide">
                Course ID: {course.courseId}
              </span>
              <span className="text-xs text-[#79747E] font-medium">
                {course.category}
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-[#1D1B20] dark:text-white">
              {course.title}
            </h1>

            <div className="flex items-center gap-2 text-xs text-[#79747E]">
              <span className="text-amber-600 dark:text-amber-400 font-semibold">
                ★ {course.rating} Rating
              </span>
              <span>·</span>
              <span>{course.level} Level</span>
              <span>·</span>
              <span>Certificate Included</span>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-[#79747E]/15">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#6750A4]/10 text-[#6750A4] dark:text-[#D0BCFF] flex items-center justify-center shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] text-[#79747E]">Instructor</div>
                <div className="text-xs font-semibold line-clamp-1">{course.instructor}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#6750A4]/10 text-[#6750A4] dark:text-[#D0BCFF] flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] text-[#79747E]">Duration</div>
                <div className="text-xs font-semibold">{course.duration}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#6750A4]/10 text-[#6750A4] dark:text-[#D0BCFF] flex items-center justify-center shrink-0">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] text-[#79747E]">Total Lessons</div>
                <div className="text-xs font-semibold">{course.lessons} Lessons</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#6750A4]/10 text-[#6750A4] dark:text-[#D0BCFF] flex items-center justify-center shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] text-[#79747E]">Credential</div>
                <div className="text-xs font-semibold">Verified Badge</div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#79747E] mb-1.5">
              Course Description
            </h2>
            <p className="text-sm leading-relaxed text-[#49454F] dark:text-[#CAC4D0]">
              {course.description}
            </p>
          </div>

          {/* Syllabus / Curriculum */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#79747E]">
                Curriculum Highlights
              </h2>
              <span className="text-xs text-[#79747E]">
                {course.syllabus.length} Modules
              </span>
            </div>

            <div className="space-y-2">
              {course.syllabus.map((lesson, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl border border-[#79747E]/15 bg-white dark:bg-[#1E1B24] flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#EADDFF] dark:bg-[#381E72] text-[#21005D] dark:text-[#EADDFF] font-bold text-[11px] flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="font-semibold text-[#1D1B20] dark:text-white">
                        {lesson.title}
                      </div>
                      <div className="text-[10px] text-[#79747E]">{lesson.duration}</div>
                    </div>
                  </div>
                  <CheckCircle className="w-4 h-4 text-[#6750A4] dark:text-[#D0BCFF]" />
                </div>
              ))}
            </div>
          </div>

          {/* Fixed Floating CTA Bottom Bar */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setIsEnrolled(!isEnrolled)}
              className={`w-full py-3.5 rounded-full font-semibold text-sm shadow-md transition flex items-center justify-center gap-2 ${
                isEnrolled
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-[#6750A4] hover:bg-[#584291] text-white active:scale-[0.99]'
              }`}
            >
              {isEnrolled ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Enrolled ✓ (Continue Learning)</span>
                </>
              ) : (
                <span>Enroll in {course.courseId}</span>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
