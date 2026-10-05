// AuthRepository.ts - Repository handling authentication and session persistence
import { sessionManagerInstance } from '../data/SessionManager';
import { SessionData, User } from '../types';

export class AuthRepository {
  private sessionManager = sessionManagerInstance;

  public async login(email: string, password: string): Promise<User> {
    // Simulate repository network/local storage latency
    await new Promise((res) => setTimeout(res, 450));

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail) {
      throw new Error('Please enter your email address');
    }
    if (!cleanPassword) {
      throw new Error('Please enter your password');
    }

    const registered = this.sessionManager.getRegisteredUsers();
    const userMatch = registered.find(
      (u) => u.email.toLowerCase() === cleanEmail
    );

    if (!userMatch) {
      throw new Error('No account found with this email. Please check or sign up.');
    }

    if (userMatch.passwordHash !== cleanPassword) {
      throw new Error('Invalid password. Please check your credentials.');
    }

    // Persist session to SessionManager (DataStore)
    const sessionData: SessionData = {
      isLoggedIn: true,
      userName: userMatch.name,
      userEmail: userMatch.email,
    };
    this.sessionManager.saveSession(sessionData);

    return {
      id: userMatch.email,
      name: userMatch.name,
      email: userMatch.email,
      enrolledCourseIds: userMatch.enrolledCourseIds,
      joinedDate: 'October 2026',
    };
  }

  public async signup(name: string, email: string, password: string): Promise<User> {
    await new Promise((res) => setTimeout(res, 500));

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanName || cleanName.length < 2) {
      throw new Error('Name must be at least 2 characters long');
    }
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      throw new Error('Please provide a valid email address');
    }
    if (!cleanPassword || cleanPassword.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    const registered = this.sessionManager.getRegisteredUsers();
    const duplicate = registered.some(
      (u) => u.email.toLowerCase() === cleanEmail
    );

    if (duplicate) {
      throw new Error('An account with this email already exists. Please login instead.');
    }

    // Save newly created user
    const newUser = {
      name: cleanName,
      email: cleanEmail,
      passwordHash: cleanPassword,
      enrolledCourseIds: ['PY101'], // Welcome course enrolled by default
    };

    registered.push(newUser);
    this.sessionManager.saveRegisteredUsers(registered);

    return {
      id: cleanEmail,
      name: cleanName,
      email: cleanEmail,
      enrolledCourseIds: newUser.enrolledCourseIds,
      joinedDate: 'October 2026',
    };
  }

  public async logout(): Promise<void> {
    await new Promise((res) => setTimeout(res, 200));
    this.sessionManager.clearSession();
  }

  public getCurrentSession(): SessionData {
    return this.sessionManager.getSession();
  }

  public subscribeToSession(callback: (session: SessionData) => void): () => void {
    return this.sessionManager.subscribe(callback);
  }

  public toggleEnrollCourse(courseId: string, email: string): boolean {
    const registered = this.sessionManager.getRegisteredUsers();
    const userIndex = registered.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());
    if (userIndex === -1) return false;

    const user = registered[userIndex];
    const isEnrolled = user.enrolledCourseIds.includes(courseId);
    if (isEnrolled) {
      user.enrolledCourseIds = user.enrolledCourseIds.filter((id) => id !== courseId);
    } else {
      user.enrolledCourseIds.push(courseId);
    }
    registered[userIndex] = user;
    this.sessionManager.saveRegisteredUsers(registered);
    return !isEnrolled;
  }
}

export const authRepositoryInstance = new AuthRepository();
