// CourseViewModel.ts - Implements Android ViewModel with StateFlow for Courses
import { courseRepositoryInstance, CourseRepository } from '../repository/CourseRepository';
import { CourseUiState, Course } from '../types';

type StateListener = (state: CourseUiState) => void;

export class CourseViewModel {
  private repository: CourseRepository;
  private _uiState: CourseUiState;
  private listeners: Set<StateListener> = new Set();

  constructor(repository: CourseRepository = courseRepositoryInstance) {
    this.repository = repository;
    this._uiState = {
      courses: [],
      selectedCourse: null,
      searchQuery: '',
      isLoading: false,
      errorMessage: null,
    };
    this.loadCourses();
  }

  // Corresponds to: val uiState = _uiState.asStateFlow()
  public get uiState(): CourseUiState {
    return { ...this._uiState };
  }

  // Corresponds to: val uiState by viewModel.uiState.collectAsStateWithLifecycle()
  public subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    listener(this._uiState);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private updateState(partial: Partial<CourseUiState>): void {
    this._uiState = { ...this._uiState, ...partial };
    this.listeners.forEach((listener) => listener(this._uiState));
  }

  // Corresponds to: fun loadCourses()
  public loadCourses(): void {
    this.updateState({ isLoading: true, errorMessage: null });
    try {
      const courses = this.repository.getCourses();
      this.updateState({
        courses,
        isLoading: false,
        errorMessage: null,
      });
    } catch {
      this.updateState({
        isLoading: false,
        errorMessage: 'Failed to load courses',
      });
    }
  }

  // Corresponds to: fun selectCourse(courseId: String)
  public selectCourse(courseId: string): Course | null {
    this.updateState({ isLoading: true, errorMessage: null });
    const course = this.repository.getCourseById(courseId);
    if (course) {
      this.updateState({
        selectedCourse: course,
        isLoading: false,
        errorMessage: null,
      });
      return course;
    } else {
      this.updateState({
        selectedCourse: null,
        isLoading: false,
        errorMessage: `Course with ID "${courseId}" not found`,
      });
      return null;
    }
  }

  // Corresponds to: fun searchCourses(query: String)
  // Searches by title or course ID (e.g. "PY101" or "Python")
  public searchCourses(query: string): void {
    this.updateState({ searchQuery: query });
    const results = this.repository.searchCourses(query);
    this.updateState({
      courses: results,
      errorMessage: results.length === 0 && query ? `No courses found matching "${query}"` : null,
    });
  }

  public clearSelectedCourse(): void {
    this.updateState({ selectedCourse: null });
  }
}

export const courseViewModelInstance = new CourseViewModel();
