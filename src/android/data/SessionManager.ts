// SessionManager.ts - Represents Android DataStore / SharedPreferences session persistence
import { SessionData } from '../types';

const SESSION_KEY = 'android_app_session';
const USERS_KEY = 'android_app_registered_users';

type SessionListener = (session: SessionData) => void;

class SessionManager {
  private listeners: Set<SessionListener> = new Set();
  private currentSession: SessionData;

  constructor() {
    this.currentSession = this.readFromStorage();
  }

  private readFromStorage(): SessionData {
    try {
      const saved = localStorage.getItem(SESSION_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return {
      isLoggedIn: false,
      userName: '',
      userEmail: '',
    };
  }

  public getSession(): SessionData {
    return { ...this.currentSession };
  }

  public saveSession(data: SessionData): void {
    this.currentSession = { ...data };
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(this.currentSession));
    } catch {
      // fallback
    }
    this.notify();
  }

  public clearSession(): void {
    this.currentSession = {
      isLoggedIn: false,
      userName: '',
      userEmail: '',
    };
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {
      // fallback
    }
    this.notify();
  }

  public subscribe(listener: SessionListener): () => void {
    this.listeners.add(listener);
    listener(this.currentSession);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener(this.currentSession));
  }

  // Persistence for mock user accounts registered during testing
  public getRegisteredUsers(): Array<{ name: string; email: string; passwordHash: string; enrolledCourseIds: string[] }> {
    try {
      const stored = localStorage.getItem(USERS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    // Default seeded user
    return [
      {
        name: 'Alex Johnson',
        email: 'alex@example.com',
        passwordHash: 'password123',
        enrolledCourseIds: ['PY101', 'WD101'],
      },
    ];
  }

  public saveRegisteredUsers(users: Array<{ name: string; email: string; passwordHash: string; enrolledCourseIds: string[] }>): void {
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch {
      // ignore
    }
  }
}

export const sessionManagerInstance = new SessionManager();
