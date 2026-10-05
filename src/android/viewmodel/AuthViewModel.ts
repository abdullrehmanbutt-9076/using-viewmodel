// AuthViewModel.ts - Implements Android ViewModel with StateFlow for Authentication
import { authRepositoryInstance, AuthRepository } from '../repository/AuthRepository';
import { AuthUiState } from '../types';

type StateListener = (state: AuthUiState) => void;

export class AuthViewModel {
  private repository: AuthRepository;
  private _uiState: AuthUiState;
  private listeners: Set<StateListener> = new Set();

  constructor(repository: AuthRepository = authRepositoryInstance) {
    this.repository = repository;

    // Initialize state from existing session
    const currentSession = this.repository.getCurrentSession();
    this._uiState = {
      isLoading: false,
      isLoggedIn: currentSession.isLoggedIn,
      userName: currentSession.userName,
      userEmail: currentSession.userEmail,
      errorMessage: null,
    };

    // Keep state synced with SessionManager changes
    this.repository.subscribeToSession((session) => {
      this.updateState({
        isLoggedIn: session.isLoggedIn,
        userName: session.userName,
        userEmail: session.userEmail,
      });
    });
  }

  // Corresponds to Kotlin: val uiState: StateFlow<AuthUiState> = _uiState.asStateFlow()
  public get uiState(): AuthUiState {
    return { ...this._uiState };
  }

  // Corresponds to Kotlin: viewModel.uiState.collectAsStateWithLifecycle()
  public subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    listener(this._uiState);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private updateState(partial: Partial<AuthUiState>): void {
    this._uiState = { ...this._uiState, ...partial };
    this.listeners.forEach((listener) => listener(this._uiState));
  }

  // Corresponds to: fun login(email: String, password: String)
  public async login(email: string, password: string): Promise<boolean> {
    this.updateState({ isLoading: true, errorMessage: null });
    try {
      const user = await this.repository.login(email, password);
      this.updateState({
        isLoading: false,
        isLoggedIn: true,
        userName: user.name,
        userEmail: user.email,
        errorMessage: null,
      });
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed. Please try again.';
      this.updateState({
        isLoading: false,
        errorMessage: message,
      });
      return false;
    }
  }

  // Corresponds to: fun signup(name: String, email: String, password: String)
  public async signup(name: string, email: string, password: string): Promise<boolean> {
    this.updateState({ isLoading: true, errorMessage: null });
    try {
      const user = await this.repository.signup(name, email, password);
      this.updateState({
        isLoading: false,
        errorMessage: null,
      });
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Signup failed. Please try again.';
      this.updateState({
        isLoading: false,
        errorMessage: message,
      });
      return false;
    }
  }

  // Corresponds to: fun logout()
  public async logout(): Promise<void> {
    this.updateState({ isLoading: true });
    await this.repository.logout();
    this.updateState({
      isLoading: false,
      isLoggedIn: false,
      userName: '',
      userEmail: '',
      errorMessage: null,
    });
  }

  public clearError(): void {
    if (this._uiState.errorMessage) {
      this.updateState({ errorMessage: null });
    }
  }
}

export const authViewModelInstance = new AuthViewModel();
