// NavController.ts - Simulates Jetpack Navigation Compose NavHostController and BackStack
export type NavigationListener = (currentRoute: string, backStack: string[]) => void;

export interface NavigateOptions {
  popUpTo?: string;
  inclusive?: boolean;
  launchSingleTop?: boolean;
}

export class NavController {
  private backStack: string[] = [];
  private currentRoute: string = 'login';
  private listeners: Set<NavigationListener> = new Set();

  constructor(initialRoute: string = 'login') {
    this.currentRoute = initialRoute;
    this.backStack = [initialRoute];
  }

  public getCurrentRoute(): string {
    return this.currentRoute;
  }

  public getBackStack(): string[] {
    return [...this.backStack];
  }

  public subscribe(listener: NavigationListener): () => void {
    this.listeners.add(listener);
    listener(this.currentRoute, this.backStack);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener(this.currentRoute, this.backStack));
  }

  // Corresponds to: navController.navigate(route) { popUpTo(...) { inclusive = ... } }
  public navigate(route: string, options?: NavigateOptions): void {
    if (options?.popUpTo) {
      const target = options.popUpTo;
      const targetIndex = this.backStack.indexOf(target);
      if (targetIndex !== -1) {
        if (options.inclusive) {
          this.backStack = this.backStack.slice(0, targetIndex);
        } else {
          this.backStack = this.backStack.slice(0, targetIndex + 1);
        }
      } else if (target === '0' || target === 'root') {
        this.backStack = [];
      }
    }

    if (options?.launchSingleTop && this.currentRoute === route) {
      return;
    }

    this.backStack.push(route);
    this.currentRoute = route;
    this.notify();
  }

  // Corresponds to: navController.popBackStack()
  public popBackStack(): boolean {
    if (this.backStack.length > 1) {
      this.backStack.pop();
      this.currentRoute = this.backStack[this.backStack.length - 1];
      this.notify();
      return true;
    }
    return false; // Root reached, in Android this exits or minimizes app
  }

  // Clears backstack completely and sets root route (used on logout)
  public resetToRoot(route: string): void {
    this.backStack = [route];
    this.currentRoute = route;
    this.notify();
  }
}

export const navControllerInstance = new NavController('login');
