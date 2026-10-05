// CourseRepository.ts - Provides course data and queries
import { Course } from '../types';

export class CourseRepository {
  private courses: Course[] = [
    {
      courseId: 'PY101',
      title: 'Python Programming',
      description: 'Complete Python programming course from fundamentals to object-oriented architecture and real-world scripting.',
      instructor: 'John Smith',
      duration: '8 Weeks',
      lessons: 40,
      category: 'Backend & Scripting',
      rating: 4.8,
      level: 'Beginner',
      syllabus: [
        { title: 'Variables, Data Types & Control Flow', duration: '2 hours' },
        { title: 'Functions, Scopes & Lambda Expressions', duration: '3 hours' },
        { title: 'Object-Oriented Programming & Classes', duration: '4 hours' },
        { title: 'File Handling & Exception Handling', duration: '2.5 hours' },
        { title: 'Standard Libraries, PyPI & Virtual Envs', duration: '3 hours' },
        { title: 'Final Capstone: Command-line Project', duration: '5 hours' },
      ],
    },
    {
      courseId: 'WD101',
      title: 'Web Development',
      description: 'HTML, CSS and JavaScript essentials, modern DOM manipulation, responsive design, and asynchronous networking.',
      instructor: 'David Khan',
      duration: '10 Weeks',
      lessons: 50,
      category: 'Web & Frontend',
      rating: 4.9,
      level: 'Beginner',
      syllabus: [
        { title: 'Semantic HTML5 & Document Structure', duration: '2 hours' },
        { title: 'CSS3 Flexbox, Grid & Responsive Layouts', duration: '4 hours' },
        { title: 'JavaScript ES6+ Core & Data Structures', duration: '5 hours' },
        { title: 'DOM Events & Interactive UI', duration: '3.5 hours' },
        { title: 'Fetch API, Promises & Async/Await', duration: '4 hours' },
        { title: 'Production Deployment & Best Practices', duration: '3 hours' },
      ],
    },
    {
      courseId: 'JV101',
      title: 'Java Programming',
      description: 'Complete Java programming course covering JVM architecture, memory management, OOP design patterns, and multithreading.',
      instructor: 'Ali Ahmed',
      duration: '12 Weeks',
      lessons: 60,
      category: 'Enterprise & Systems',
      rating: 4.7,
      level: 'Intermediate',
      syllabus: [
        { title: 'Java Syntax, JVM & Bytecode Execution', duration: '3 hours' },
        { title: 'OOP Principles: Polymorphism & Inheritance', duration: '5 hours' },
        { title: 'Collections Framework & Generics', duration: '6 hours' },
        { title: 'Streams API & Functional Interfaces', duration: '4 hours' },
        { title: 'Concurrency, Threads & Synchronization', duration: '5 hours' },
        { title: 'JDBC & Database Connectivity', duration: '4 hours' },
      ],
    },
    {
      courseId: 'KT101',
      title: 'Kotlin & Jetpack Compose',
      description: 'Modern Android UI toolkit, declarative layouts, state hoisting, Material 3 theming, and smooth animations.',
      instructor: 'Sarah Jenkins',
      duration: '9 Weeks',
      lessons: 48,
      category: 'Mobile & Android',
      rating: 4.95,
      level: 'Intermediate',
      syllabus: [
        { title: 'Kotlin Coroutines & Flow Fundamentals', duration: '3 hours' },
        { title: 'Composable Functions & Recomposition', duration: '4 hours' },
        { title: 'Material 3 Components & Dynamic Theming', duration: '3.5 hours' },
        { title: 'State Management with ViewModel & StateFlow', duration: '5 hours' },
        { title: 'Navigation Compose & Backstack Handling', duration: '4 hours' },
        { title: 'Building a Production Ready Compose App', duration: '6 hours' },
      ],
    },
    {
      courseId: 'AN101',
      title: 'Android MVVM Architecture',
      description: 'Clean Architecture guidelines for enterprise Android apps: Repository Pattern, Dependency Injection, Room & DataStore.',
      instructor: 'Marcus Vance',
      duration: '11 Weeks',
      lessons: 52,
      category: 'Mobile & Android',
      rating: 4.85,
      level: 'Advanced',
      syllabus: [
        { title: 'Clean Architecture & Layer Separation', duration: '3.5 hours' },
        { title: 'Repository Pattern with Room Database', duration: '5 hours' },
        { title: 'Offline-First Synchronization Patterns', duration: '4.5 hours' },
        { title: 'Hilt Dependency Injection Setup', duration: '4 hours' },
        { title: 'Unit Testing ViewModels & Repositories', duration: '5 hours' },
      ],
    },
    {
      courseId: 'DS101',
      title: 'Data Structures & Algorithms',
      description: 'Master binary trees, graphs, dynamic programming, sorting algorithms, and complexity analysis for technical interviews.',
      instructor: 'Elena Rostova',
      duration: '14 Weeks',
      lessons: 75,
      category: 'Computer Science',
      rating: 4.9,
      level: 'Advanced',
      syllabus: [
        { title: 'Big-O Asymptotic Notation & Amortized Time', duration: '3 hours' },
        { title: 'Arrays, Linked Lists, Stacks & Queues', duration: '5 hours' },
        { title: 'Hash Tables & Collision Resolution', duration: '4 hours' },
        { title: 'Trees, BST, AVL & Heap Priority Queues', duration: '7 hours' },
        { title: 'Graph Traversals: BFS, DFS, Dijkstra', duration: '8 hours' },
        { title: 'Dynamic Programming & Memoization', duration: '9 hours' },
      ],
    },
  ];

  public getCourses(): Course[] {
    return [...this.courses];
  }

  public getCourseById(courseId: string): Course | null {
    const found = this.courses.find(
      (c) => c.courseId.toLowerCase() === courseId.toLowerCase()
    );
    return found ? { ...found } : null;
  }

  public searchCourses(query: string): Course[] {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      return this.getCourses();
    }
    return this.courses.filter(
      (c) =>
        c.courseId.toLowerCase().includes(trimmed) ||
        c.title.toLowerCase().includes(trimmed) ||
        c.instructor.toLowerCase().includes(trimmed) ||
        c.category.toLowerCase().includes(trimmed)
    );
  }
}

export const courseRepositoryInstance = new CourseRepository();
