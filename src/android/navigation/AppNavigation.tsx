import React, { useEffect, useState } from 'react';
import { NavController } from './NavController';
import { AuthViewModel } from '../viewmodel/AuthViewModel';
import { CourseViewModel } from '../viewmodel/CourseViewModel';
import { AuthUiState, CourseUiState } from '../types';
import { LoginScreen } from '../screens/LoginScreen';
import { SignupScreen } from '../screens/SignupScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { CoursesScreen } from '../screens/CoursesScreen';
import { CourseDetailsScreen } from '../screens/CourseDetailsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

interface AppNavigationProps {
  navController: NavController;
  authViewModel: AuthViewModel;
  courseViewModel: CourseViewModel;
}

export const AppNavigation: React.FC<AppNavigationProps> = ({
  navController,
  authViewModel,
  courseViewModel,
}) => {
  const [currentRoute, setCurrentRoute] = useState<string>(navController.getCurrentRoute());
  const [authState, setAuthState] = useState<AuthUiState>(authViewModel.uiState);
  const [courseState, setCourseState] = useState<CourseUiState>(courseViewModel.uiState);

  // Subscribe to NavController changes
  useEffect(() => {
    const unsub = navController.subscribe((route) => {
      setCurrentRoute(route);
    });
    return unsub;
  }, [navController]);

  // Subscribe to AuthViewModel StateFlow (collectAsStateWithLifecycle)
  useEffect(() => {
    const unsub = authViewModel.subscribe((state) => {
      setAuthState(state);
    });
    return unsub;
  }, [authViewModel]);

  // Subscribe to CourseViewModel StateFlow (collectAsStateWithLifecycle)
  useEffect(() => {
    const unsub = courseViewModel.subscribe((state) => {
      setCourseState(state);
    });
    return unsub;
  }, [courseViewModel]);

  // On session state change: if logged in and currently at login, auto-route to dashboard
  useEffect(() => {
    if (authState.isLoggedIn && currentRoute === 'login') {
      navController.navigate('dashboard', { popUpTo: 'login', inclusive: true });
    }
  }, [authState.isLoggedIn, currentRoute, navController]);

  // Handle logout: clear session and clear backstack completely
  const handleLogout = async () => {
    await authViewModel.logout();
    navController.resetToRoot('login');
  };

  // Route parser for course/{courseId}
  if (currentRoute.startsWith('course/')) {
    const courseId = currentRoute.replace('course/', '');
    return (
      <CourseDetailsScreen
        viewModel={courseViewModel}
        uiState={courseState}
        courseId={courseId}
        onNavigateBack={() => {
          navController.popBackStack();
        }}
      />
    );
  }

  switch (currentRoute) {
    case 'login':
      return (
        <LoginScreen
          viewModel={authViewModel}
          uiState={authState}
          onNavigateToSignup={() => navController.navigate('signup')}
          onLoginSuccess={() => {
            navController.navigate('dashboard', { popUpTo: 'login', inclusive: true });
          }}
        />
      );

    case 'signup':
      return (
        <SignupScreen
          viewModel={authViewModel}
          uiState={authState}
          onNavigateToLogin={() => navController.popBackStack()}
          onSignupSuccess={() => {
            navController.navigate('login', { popUpTo: 'signup', inclusive: true });
          }}
        />
      );

    case 'dashboard':
      return (
        <DashboardScreen
          authViewModel={authViewModel}
          courseViewModel={courseViewModel}
          authState={authState}
          courseState={courseState}
          onNavigateToCourses={() => navController.navigate('courses')}
          onNavigateToCourseDetails={(courseId) => navController.navigate(`course/${courseId}`)}
          onNavigateToProfile={() => navController.navigate('profile')}
          onNavigateToSettings={() => navController.navigate('settings')}
          onLogout={handleLogout}
        />
      );

    case 'courses':
      return (
        <CoursesScreen
          viewModel={courseViewModel}
          uiState={courseState}
          onCourseClick={(courseId) => navController.navigate(`course/${courseId}`)}
          onNavigateBack={() => navController.popBackStack()}
        />
      );

    case 'profile':
      return (
        <ProfileScreen
          authState={authState}
          onNavigateBack={() => navController.popBackStack()}
          onLogout={handleLogout}
        />
      );

    case 'settings':
      return (
        <SettingsScreen
          onNavigateBack={() => navController.popBackStack()}
          onLogout={handleLogout}
        />
      );

    default:
      return (
        <div className="p-6 text-center">
          <p>Unknown Route: {currentRoute}</p>
          <button
            onClick={() => navController.resetToRoot('dashboard')}
            className="mt-4 px-4 py-2 bg-[#6750A4] text-white rounded-lg text-sm"
          >
            Go to Dashboard
          </button>
        </div>
      );
  }
};
