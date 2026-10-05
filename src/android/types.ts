// Android Jetpack Compose MVVM Type Definitions

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  enrolledCourseIds: string[];
  joinedDate: string;
}

export interface Course {
  courseId: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  lessons: IntNumber;
  category: string;
  rating: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  syllabus: { title: string; duration: string }[];
}

export type IntNumber = number;

export interface AuthUiState {
  isLoading: boolean;
  isLoggedIn: boolean;
  userName: string;
  userEmail: string;
  errorMessage: string | null;
}

export interface CourseUiState {
  courses: Course[];
  selectedCourse: Course | null;
  searchQuery: string;
  isLoading: boolean;
  errorMessage: string | null;
}

export interface SessionData {
  isLoggedIn: boolean;
  userName: string;
  userEmail: string;
  userId?: string;
}

export type ScreenRoute =
  | 'login'
  | 'signup'
  | 'dashboard'
  | 'courses'
  | `course/${string}`
  | 'profile'
  | 'settings';
