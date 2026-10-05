// kotlinSourceCode.ts - Complete, compile-ready Kotlin source code for Android Studio project

export interface KotlinFile {
  path: string;
  name: string;
  category: 'Screen' | 'ViewModel' | 'Repository' | 'Model' | 'Data' | 'Navigation' | 'Config' | 'Activity';
  description: string;
  content: string;
}

export const KOTLIN_PROJECT_FILES: KotlinFile[] = [
  {
    path: 'com/example/myapp/MainActivity.kt',
    name: 'MainActivity.kt',
    category: 'Activity',
    description: 'Entry point initializing Jetpack Compose, Material 3 theme, ViewModels, and AppNavigation.',
    content: `package com.example.myapp

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.compose.rememberNavController
import com.example.myapp.data.SessionManager
import com.example.myapp.navigation.AppNavigation
import com.example.myapp.repository.AuthRepository
import com.example.myapp.repository.CourseRepository
import com.example.myapp.viewmodel.AuthViewModel
import com.example.myapp.viewmodel.AuthViewModelFactory
import com.example.myapp.viewmodel.CourseViewModel
import com.example.myapp.viewmodel.CourseViewModelFactory

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        // Initialize DataStore Session & Repositories
        val sessionManager = SessionManager(applicationContext)
        val authRepository = AuthRepository(sessionManager)
        val courseRepository = CourseRepository()

        setContent {
            MyAppTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    val navController = rememberNavController()

                    // Instantiate ViewModels using factories to inject repositories
                    val authViewModel: AuthViewModel = viewModel(
                        factory = AuthViewModelFactory(authRepository)
                    )
                    val courseViewModel: CourseViewModel = viewModel(
                        factory = CourseViewModelFactory(courseRepository)
                    )

                    // Centralized Navigation Host
                    AppNavigation(
                        navController = navController,
                        authViewModel = authViewModel,
                        courseViewModel = courseViewModel
                    )
                }
            }
        }
    }
}

@Composable
fun MyAppTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) {
        darkColorScheme(
            primary = Color(0xFF6750A4),
            onPrimary = Color(0xFFFFFFFF),
            primaryContainer = Color(0xFFEADDFF),
            secondary = Color(0xFF625B71),
            background = Color(0xFF141218),
            surface = Color(0xFF141218),
            surfaceVariant = Color(0xFF2B2930)
        )
    } else {
        lightColorScheme(
            primary = Color(0xFF6750A4),
            onPrimary = Color(0xFFFFFFFF),
            primaryContainer = Color(0xFFEADDFF),
            secondary = Color(0xFF625B71),
            background = Color(0xFFFEF7FF),
            surface = Color(0xFFFEF7FF),
            surfaceVariant = Color(0xFFE7E0EC)
        )
    }

    MaterialTheme(
        colorScheme = colorScheme,
        content = content
    )
}
`,
  },
  {
    path: 'com/example/myapp/navigation/AppNavigation.kt',
    name: 'AppNavigation.kt',
    category: 'Navigation',
    description: 'Centralized Jetpack Navigation Compose routes, arguments, popBackStack, and backstack clearing.',
    content: `package com.example.myapp.navigation

import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.navigation.NavHostController
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.navArgument
import com.example.myapp.screens.CourseDetailsScreen
import com.example.myapp.screens.CoursesScreen
import com.example.myapp.screens.DashboardScreen
import com.example.myapp.screens.LoginScreen
import com.example.myapp.screens.ProfileScreen
import com.example.myapp.screens.SettingsScreen
import com.example.myapp.screens.SignupScreen
import com.example.myapp.viewmodel.AuthViewModel
import com.example.myapp.viewmodel.CourseViewModel

sealed class Screen(val route: String) {
    data object Login : Screen("login")
    data object Signup : Screen("signup")
    data object Dashboard : Screen("dashboard")
    data object Courses : Screen("courses")
    data object CourseDetails : Screen("course/{courseId}") {
        fun createRoute(courseId: String): String = "course/$courseId"
    }
    data object Profile : Screen("profile")
    data object Settings : Screen("settings")
}

@Composable
fun AppNavigation(
    navController: NavHostController,
    authViewModel: AuthViewModel,
    courseViewModel: CourseViewModel
) {
    val authUiState by authViewModel.uiState.collectAsState()

    // Determine initial route based on session state
    val startDestination = if (authUiState.isLoggedIn) {
        Screen.Dashboard.route
    } else {
        Screen.Login.route
    }

    NavHost(
        navController = navController,
        startDestination = startDestination
    ) {
        // 1. Login Screen
        composable(route = Screen.Login.route) {
            LoginScreen(
                viewModel = authViewModel,
                onNavigateToSignup = {
                    navController.navigate(Screen.Signup.route)
                },
                onLoginSuccess = {
                    // Navigate to Dashboard and clear Login from backstack
                    navController.navigate(Screen.Dashboard.route) {
                        popUpTo(Screen.Login.route) { inclusive = true }
                    }
                }
            )
        }

        // 2. Signup Screen
        composable(route = Screen.Signup.route) {
            SignupScreen(
                viewModel = authViewModel,
                onNavigateToLogin = {
                    navController.popBackStack()
                },
                onSignupSuccess = {
                    // Navigate to Login after registration
                    navController.navigate(Screen.Login.route) {
                        popUpTo(Screen.Signup.route) { inclusive = true }
                    }
                }
            )
        }

        // 3. Dashboard Screen
        composable(route = Screen.Dashboard.route) {
            DashboardScreen(
                authViewModel = authViewModel,
                courseViewModel = courseViewModel,
                onNavigateToCourses = {
                    navController.navigate(Screen.Courses.route)
                },
                onNavigateToCourseDetails = { courseId ->
                    navController.navigate(Screen.CourseDetails.createRoute(courseId))
                },
                onNavigateToProfile = {
                    navController.navigate(Screen.Profile.route)
                },
                onNavigateToSettings = {
                    navController.navigate(Screen.Settings.route)
                },
                onLogout = {
                    authViewModel.logout()
                    // Clear the backstack completely on logout
                    navController.navigate(Screen.Login.route) {
                        popUpTo(0) { inclusive = true }
                    }
                }
            )
        }

        // 4. Courses Screen
        composable(route = Screen.Courses.route) {
            CoursesScreen(
                viewModel = courseViewModel,
                onCourseClick = { courseId ->
                    // Dynamic navigation passing Course ID
                    navController.navigate(Screen.CourseDetails.createRoute(courseId))
                },
                onNavigateBack = {
                    navController.popBackStack()
                }
            )
        }

        // 5. Course Details Screen with Course ID parameter
        composable(
            route = Screen.CourseDetails.route,
            arguments = listOf(
                navArgument("courseId") {
                    type = NavType.StringType
                    nullable = false
                }
            )
        ) { backStackEntry ->
            val courseId = backStackEntry.arguments?.getString("courseId") ?: ""

            // ViewModel selects course based on route argument
            LaunchedEffect(courseId) {
                courseViewModel.selectCourse(courseId)
            }

            CourseDetailsScreen(
                viewModel = courseViewModel,
                onNavigateBack = {
                    // Back arrow popBackStack()
                    navController.popBackStack()
                }
            )
        }

        // 6. Profile Screen
        composable(route = Screen.Profile.route) {
            ProfileScreen(
                authViewModel = authViewModel,
                courseViewModel = courseViewModel,
                onNavigateBack = {
                    navController.popBackStack()
                },
                onLogout = {
                    authViewModel.logout()
                    navController.navigate(Screen.Login.route) {
                        popUpTo(0) { inclusive = true }
                    }
                }
            )
        }

        // 7. Settings Screen
        composable(route = Screen.Settings.route) {
            SettingsScreen(
                authViewModel = authViewModel,
                onNavigateBack = {
                    navController.popBackStack()
                },
                onLogout = {
                    authViewModel.logout()
                    navController.navigate(Screen.Login.route) {
                        popUpTo(0) { inclusive = true }
                    }
                }
            )
        }
    }
}
`,
  },
  {
    path: 'com/example/myapp/screens/LoginScreen.kt',
    name: 'LoginScreen.kt',
    category: 'Screen',
    description: 'Material 3 Login screen observing AuthViewModel StateFlow. Handles login inputs, validation, and error alerts.',
    content: `package com.example.myapp.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Email
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.VisibilityOff
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.FocusDirection
import androidx.compose.ui.platform.LocalFocusManager
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.myapp.viewmodel.AuthViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LoginScreen(
    viewModel: AuthViewModel,
    onNavigateToSignup: () -> Unit,
    onLoginSuccess: () -> Unit
) {
    // Collect ViewModel state with lifecycle awareness
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()

    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var passwordVisible by remember { mutableStateOf(false) }

    val focusManager = LocalFocusManager.current

    // Observe login success state and trigger navigation callback
    LaunchedEffect(uiState.isLoggedIn) {
        if (uiState.isLoggedIn) {
            onLoginSuccess()
        }
    }

    Scaffold(
        topBar = {
            CenterAlignedTopAppBar(
                title = { Text("Welcome Back", fontWeight = FontWeight.SemiBold) }
            )
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(horizontal = 24.dp)
                .verticalScroll(rememberScrollState()),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Text(
                text = "Sign in to continue",
                style = MaterialTheme.typography.bodyLarge,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )

            Spacer(modifier = Modifier.height(32.dp))

            // Email OutlinedTextField
            OutlinedTextField(
                value = email,
                onValueChange = {
                    email = it
                    viewModel.clearError()
                },
                label = { Text("Email Address") },
                leadingIcon = {
                    Icon(imageVector = Icons.Default.Email, contentDescription = "Email")
                },
                singleLine = true,
                keyboardOptions = KeyboardOptions(
                    keyboardType = KeyboardType.Email,
                    imeAction = ImeAction.Next
                ),
                keyboardActions = KeyboardActions(
                    onNext = { focusManager.moveFocus(FocusDirection.Down) }
                ),
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(16.dp))

            // Password OutlinedTextField
            OutlinedTextField(
                value = password,
                onValueChange = {
                    password = it
                    viewModel.clearError()
                },
                label = { Text("Password") },
                leadingIcon = {
                    Icon(imageVector = Icons.Default.Lock, contentDescription = "Password")
                },
                trailingIcon = {
                    IconButton(onClick = { passwordVisible = !passwordVisible }) {
                        Icon(
                            imageVector = if (passwordVisible) Icons.Default.VisibilityOff else Icons.Default.Visibility,
                            contentDescription = if (passwordVisible) "Hide password" else "Show password"
                        )
                    }
                },
                singleLine = true,
                visualTransformation = if (passwordVisible) VisualTransformation.None else PasswordVisualTransformation(),
                keyboardOptions = KeyboardOptions(
                    keyboardType = KeyboardType.Password,
                    imeAction = ImeAction.Done
                ),
                keyboardActions = KeyboardActions(
                    onDone = {
                        focusManager.clearFocus()
                        viewModel.login(email = email, password = password)
                    }
                ),
                modifier = Modifier.fillMaxWidth()
            )

            // Error Message Display
            if (uiState.errorMessage != null) {
                Spacer(modifier = Modifier.height(12.dp))
                Text(
                    text = uiState.errorMessage ?: "",
                    color = MaterialTheme.colorScheme.error,
                    style = MaterialTheme.typography.bodyMedium
                )
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Login Button
            Button(
                onClick = {
                    focusManager.clearFocus()
                    viewModel.login(email = email, password = password)
                },
                enabled = !uiState.isLoading && email.isNotBlank() && password.isNotBlank(),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(50.dp)
            ) {
                if (uiState.isLoading) {
                    CircularProgressIndicator(
                        modifier = Modifier.size(24.dp),
                        color = MaterialTheme.colorScheme.onPrimary,
                        strokeWidth = 2.dp
                    )
                } else {
                    Text("Login", style = MaterialTheme.typography.titleMedium)
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Signup Navigation Option
            TextButton(onClick = onNavigateToSignup) {
                Text("Don't have an account? Sign Up")
            }
        }
    }
}
`,
  },
  {
    path: 'com/example/myapp/screens/SignupScreen.kt',
    name: 'SignupScreen.kt',
    category: 'Screen',
    description: 'Signup screen calling AuthViewModel.signup with validation, duplicate email check, and loading state.',
    content: `package com.example.myapp.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Email
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.FocusDirection
import androidx.compose.ui.platform.LocalFocusManager
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.myapp.viewmodel.AuthViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SignupScreen(
    viewModel: AuthViewModel,
    onNavigateToLogin: () -> Unit,
    onSignupSuccess: () -> Unit
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()

    var name by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var confirmPassword by remember { mutableStateOf("") }

    val focusManager = LocalFocusManager.current

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Create Account", fontWeight = FontWeight.SemiBold) },
                navigationIcon = {
                    IconButton(onClick = onNavigateToLogin) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                            contentDescription = "Back to Login"
                        )
                    }
                }
            )
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(horizontal = 24.dp)
                .verticalScroll(rememberScrollState()),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Text(
                text = "Join our learning platform",
                style = MaterialTheme.typography.bodyLarge,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )

            Spacer(modifier = Modifier.height(24.dp))

            // Full Name Input
            OutlinedTextField(
                value = name,
                onValueChange = {
                    name = it
                    viewModel.clearError()
                },
                label = { Text("Full Name") },
                leadingIcon = {
                    Icon(imageVector = Icons.Default.Person, contentDescription = "Name")
                },
                singleLine = true,
                keyboardOptions = KeyboardOptions(imeAction = ImeAction.Next),
                keyboardActions = KeyboardActions(
                    onNext = { focusManager.moveFocus(FocusDirection.Down) }
                ),
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(12.dp))

            // Email Input
            OutlinedTextField(
                value = email,
                onValueChange = {
                    email = it
                    viewModel.clearError()
                },
                label = { Text("Email Address") },
                leadingIcon = {
                    Icon(imageVector = Icons.Default.Email, contentDescription = "Email")
                },
                singleLine = true,
                keyboardOptions = KeyboardOptions(
                    keyboardType = KeyboardType.Email,
                    imeAction = ImeAction.Next
                ),
                keyboardActions = KeyboardActions(
                    onNext = { focusManager.moveFocus(FocusDirection.Down) }
                ),
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(12.dp))

            // Password Input
            OutlinedTextField(
                value = password,
                onValueChange = {
                    password = it
                    viewModel.clearError()
                },
                label = { Text("Password (min 6 characters)") },
                leadingIcon = {
                    Icon(imageVector = Icons.Default.Lock, contentDescription = "Password")
                },
                singleLine = true,
                visualTransformation = PasswordVisualTransformation(),
                keyboardOptions = KeyboardOptions(
                    keyboardType = KeyboardType.Password,
                    imeAction = ImeAction.Next
                ),
                keyboardActions = KeyboardActions(
                    onNext = { focusManager.moveFocus(FocusDirection.Down) }
                ),
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(12.dp))

            // Confirm Password Input
            OutlinedTextField(
                value = confirmPassword,
                onValueChange = {
                    confirmPassword = it
                    viewModel.clearError()
                },
                label = { Text("Confirm Password") },
                leadingIcon = {
                    Icon(imageVector = Icons.Default.Lock, contentDescription = "Confirm Password")
                },
                singleLine = true,
                visualTransformation = PasswordVisualTransformation(),
                keyboardOptions = KeyboardOptions(
                    keyboardType = KeyboardType.Password,
                    imeAction = ImeAction.Done
                ),
                keyboardActions = KeyboardActions(
                    onDone = { focusManager.clearFocus() }
                ),
                modifier = Modifier.fillMaxWidth()
            )

            if (uiState.errorMessage != null) {
                Spacer(modifier = Modifier.height(12.dp))
                Text(
                    text = uiState.errorMessage ?: "",
                    color = MaterialTheme.colorScheme.error,
                    style = MaterialTheme.typography.bodyMedium
                )
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Signup Submit Button
            Button(
                onClick = {
                    focusManager.clearFocus()
                    if (password != confirmPassword) {
                        // Immediate password mismatch validation
                        return@Button
                    }
                    viewModel.signup(
                        name = name,
                        email = email,
                        password = password,
                        onSuccess = onSignupSuccess
                    )
                },
                enabled = !uiState.isLoading &&
                        name.isNotBlank() &&
                        email.isNotBlank() &&
                        password.length >= 6 &&
                        password == confirmPassword,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(50.dp)
            ) {
                if (uiState.isLoading) {
                    CircularProgressIndicator(
                        modifier = Modifier.size(24.dp),
                        color = MaterialTheme.colorScheme.onPrimary,
                        strokeWidth = 2.dp
                    )
                } else {
                    Text("Create Account", style = MaterialTheme.typography.titleMedium)
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            TextButton(onClick = onNavigateToLogin) {
                Text("Already have an account? Sign In")
            }
        }
    }
}
`,
  },
  {
    path: 'com/example/myapp/screens/DashboardScreen.kt',
    name: 'DashboardScreen.kt',
    category: 'Screen',
    description: 'Dashboard screen displaying user greeting, statistics, enrolled progress, course recommendations, and bottom navigation.',
    content: `package com.example.myapp.screens

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material.icons.automirrored.filled.ExitToApp
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.myapp.model.Course
import com.example.myapp.viewmodel.AuthViewModel
import com.example.myapp.viewmodel.CourseViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DashboardScreen(
    authViewModel: AuthViewModel,
    courseViewModel: CourseViewModel,
    onNavigateToCourses: () -> Unit,
    onNavigateToCourseDetails: (String) -> Unit,
    onNavigateToProfile: () -> Unit,
    onNavigateToSettings: () -> Unit,
    onLogout: () -> Unit
) {
    val authState by authViewModel.uiState.collectAsStateWithLifecycle()
    val courseState by courseViewModel.uiState.collectAsStateWithLifecycle()

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = "Hello, \${authState.userName.ifBlank { "Student" }}",
                            style = MaterialTheme.typography.titleLarge,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = "Track your learning journey",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                },
                actions = {
                    IconButton(onClick = onNavigateToProfile) {
                        Icon(imageVector = Icons.Default.AccountCircle, contentDescription = "Profile")
                    }
                    IconButton(onClick = onLogout) {
                        Icon(imageVector = Icons.AutoMirrored.Filled.ExitToApp, contentDescription = "Logout")
                    }
                }
            )
        },
        bottomBar = {
            NavigationBar {
                NavigationBarItem(
                    selected = true,
                    onClick = { /* Already on Dashboard */ },
                    icon = { Icon(Icons.Default.Home, contentDescription = "Dashboard") },
                    label = { Text("Dashboard") }
                )
                NavigationBarItem(
                    selected = false,
                    onClick = onNavigateToCourses,
                    icon = { Icon(Icons.Default.Book, contentDescription = "Courses") },
                    label = { Text("Courses") }
                )
                NavigationBarItem(
                    selected = false,
                    onClick = onNavigateToProfile,
                    icon = { Icon(Icons.Default.Person, contentDescription = "Profile") },
                    label = { Text("Profile") }
                )
                NavigationBarItem(
                    selected = false,
                    onClick = onNavigateToSettings,
                    icon = { Icon(Icons.Default.Settings, contentDescription = "Settings") },
                    label = { Text("Settings") }
                )
            }
        }
    ) { paddingValues ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            item { Spacer(modifier = Modifier.height(4.dp)) }

            // Summary Metric Cards
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Card(
                        modifier = Modifier.weight(1f),
                        colors = CardDefaults.cardColors(
                            containerColor = MaterialTheme.colorScheme.primaryContainer
                        )
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Text(
                                text = "Enrolled",
                                style = MaterialTheme.typography.labelMedium,
                                color = MaterialTheme.colorScheme.onPrimaryContainer
                            )
                            Text(
                                text = "2 Courses",
                                style = MaterialTheme.typography.headlineSmall,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.onPrimaryContainer
                            )
                        }
                    }

                    Card(
                        modifier = Modifier.weight(1f),
                        colors = CardDefaults.cardColors(
                            containerColor = MaterialTheme.colorScheme.secondaryContainer
                        )
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Text(
                                text = "Completed",
                                style = MaterialTheme.typography.labelMedium,
                                color = MaterialTheme.colorScheme.onSecondaryContainer
                            )
                            Text(
                                text = "18 Lessons",
                                style = MaterialTheme.typography.headlineSmall,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.onSecondaryContainer
                            )
                        }
                    }
                }
            }

            // Quick Banner to Explore All Courses
            item {
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable(onClick = onNavigateToCourses),
                    elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = "Explore All Courses",
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.SemiBold
                            )
                            Text(
                                text = "Browse \${courseState.courses.size} available courses with full syllabus",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                        Icon(
                            imageVector = Icons.AutoMirrored.Filled.ArrowForward,
                            contentDescription = "Go to Courses"
                        )
                    }
                }
            }

            // Featured Courses Header
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Featured Courses",
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Bold
                    )
                    TextButton(onClick = onNavigateToCourses) {
                        Text("See All")
                    }
                }
            }

            // Featured Courses Horizontal Scroll
            item {
                LazyRow(
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    items(courseState.courses.take(4)) { course ->
                        CourseCompactCard(
                            course = course,
                            onClick = { onNavigateToCourseDetails(course.courseId) }
                        )
                    }
                }
            }

            item { Spacer(modifier = Modifier.height(16.dp)) }
        }
    }
}

@Composable
fun CourseCompactCard(
    course: Course,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .width(220.dp)
            .clickable(onClick = onClick),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(
                text = "ID: \${course.courseId}",
                style = MaterialTheme.typography.labelMedium,
                color = MaterialTheme.colorScheme.primary,
                fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.height(6.dp))
            Text(
                text = course.title,
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.SemiBold,
                maxLines = 1
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = course.instructor,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            Spacer(modifier = Modifier.height(8.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = course.duration,
                    style = MaterialTheme.typography.labelSmall
                )
                Text(
                    text = "\${course.lessons} Lessons",
                    style = MaterialTheme.typography.labelSmall,
                    fontWeight = FontWeight.Medium
                )
            }
        }
    }
}
`,
  },
  {
    path: 'com/example/myapp/screens/CoursesScreen.kt',
    name: 'CoursesScreen.kt',
    category: 'Screen',
    description: 'Courses screen observing CourseViewModel, supporting real-time search by title or Course ID, and dynamic card clicks.',
    content: `package com.example.myapp.screens

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.myapp.model.Course
import com.example.myapp.viewmodel.CourseViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CoursesScreen(
    viewModel: CourseViewModel,
    onCourseClick: (String) -> Unit,
    onNavigateBack: () -> Unit
) {
    // Collect StateFlow from CourseViewModel
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Courses", fontWeight = FontWeight.SemiBold) },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                            contentDescription = "Back"
                        )
                    }
                }
            )
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(horizontal = 16.dp)
        ) {
            // Search Course Field using ViewModel
            OutlinedTextField(
                value = uiState.searchQuery,
                onValueChange = { query ->
                    // Searches by title or course ID (e.g., PY101)
                    viewModel.searchCourses(query)
                },
                placeholder = { Text("Search Course...") },
                leadingIcon = {
                    Icon(imageVector = Icons.Default.Search, contentDescription = "Search")
                },
                trailingIcon = {
                    if (uiState.searchQuery.isNotEmpty()) {
                        IconButton(onClick = { viewModel.searchCourses("") }) {
                            Icon(imageVector = Icons.Default.Clear, contentDescription = "Clear")
                        }
                    }
                },
                singleLine = true,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 8.dp)
            )

            // Loading state
            if (uiState.isLoading) {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator()
                }
            } else if (uiState.courses.isEmpty()) {
                // Empty search result
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = uiState.errorMessage ?: "No courses found",
                        style = MaterialTheme.typography.bodyLarge,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            } else {
                // List of Course Cards
                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    verticalArrangement = Arrangement.spacedBy(12.dp),
                    contentPadding = PaddingValues(vertical = 8.dp)
                ) {
                    items(
                        items = uiState.courses,
                        key = { it.courseId }
                    ) { course ->
                        CourseCard(
                            course = course,
                            onClick = {
                                // Dynamic Course ID Navigation
                                onCourseClick(course.courseId)
                            }
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun CourseCard(
    course: Course,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = course.title,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = "Course ID: \${course.courseId}",
                    style = MaterialTheme.typography.labelMedium,
                    color = MaterialTheme.colorScheme.primary,
                    fontWeight = FontWeight.SemiBold
                )
            }

            Spacer(modifier = Modifier.height(6.dp))

            Text(
                text = course.description,
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                maxLines = 2
            )

            Spacer(modifier = Modifier.height(12.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = "Instructor: \${course.instructor}",
                    style = MaterialTheme.typography.bodySmall
                )
                Text(
                    text = "\${course.duration} · \${course.lessons} Lessons",
                    style = MaterialTheme.typography.bodySmall,
                    fontWeight = FontWeight.Medium
                )
            }
        }
    }
}
`,
  },
  {
    path: 'com/example/myapp/screens/CourseDetailsScreen.kt',
    name: 'CourseDetailsScreen.kt',
    category: 'Screen',
    description: 'Course details screen displaying selectedCourse from CourseViewModel, back arrow calling popBackStack(), and syllabus.',
    content: `package com.example.myapp.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Schedule
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.myapp.viewmodel.CourseViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CourseDetailsScreen(
    viewModel: CourseViewModel,
    onNavigateBack: () -> Unit
) {
    // Observe selectedCourse from ViewModel uiState
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    val course = uiState.selectedCourse

    var isEnrolled by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(course?.title ?: "Course Details") },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                            contentDescription = "Back"
                        )
                    }
                }
            )
        }
    ) { paddingValues ->
        if (uiState.isLoading) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues),
                contentAlignment = Alignment.Center
            ) {
                CircularProgressIndicator()
            }
        } else if (course == null) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = uiState.errorMessage ?: "Course details not found",
                    style = MaterialTheme.typography.bodyLarge
                )
            }
        } else {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues)
                    .padding(horizontal = 20.dp)
                    .verticalScroll(rememberScrollState())
            ) {
                Spacer(modifier = Modifier.height(8.dp))

                // Course ID Badge
                Text(
                    text = "Course ID: \${course.courseId}",
                    style = MaterialTheme.typography.labelLarge,
                    color = MaterialTheme.colorScheme.primary,
                    fontWeight = FontWeight.Bold
                )

                Spacer(modifier = Modifier.height(4.dp))

                // Course Title
                Text(
                    text = course.title,
                    style = MaterialTheme.typography.headlineMedium,
                    fontWeight = FontWeight.Bold
                )

                Spacer(modifier = Modifier.height(16.dp))

                // Meta Information Card
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(
                        containerColor = MaterialTheme.colorScheme.surfaceVariant
                    )
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp),
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = Icons.Default.Person,
                                contentDescription = "Instructor",
                                modifier = Modifier.size(20.dp)
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = "Instructor: \${course.instructor}",
                                style = MaterialTheme.typography.bodyMedium
                            )
                        }

                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = Icons.Default.Schedule,
                                contentDescription = "Duration",
                                modifier = Modifier.size(20.dp)
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = "Duration: \${course.duration} (\${course.lessons} Lessons)",
                                style = MaterialTheme.typography.bodyMedium
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(20.dp))

                // Course Description Section
                Text(
                    text = "Description",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.SemiBold
                )
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = course.description,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    lineHeight = MaterialTheme.typography.bodyLarge.lineHeight
                )

                Spacer(modifier = Modifier.height(24.dp))

                // Course Syllabus Section
                Text(
                    text = "Curriculum Highlights",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.SemiBold
                )
                Spacer(modifier = Modifier.height(12.dp))

                course.syllabus.forEachIndexed { index, lesson ->
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 4.dp),
                        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(12.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "\${index + 1}.",
                                fontWeight = FontWeight.Bold,
                                modifier = Modifier.width(28.dp)
                            )
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = lesson.title,
                                    style = MaterialTheme.typography.bodyMedium,
                                    fontWeight = FontWeight.Medium
                                )
                                Text(
                                    text = lesson.duration,
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                            Icon(
                                imageVector = Icons.Default.CheckCircle,
                                contentDescription = null,
                                tint = MaterialTheme.colorScheme.primary,
                                modifier = Modifier.size(20.dp)
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(32.dp))

                // Enroll Action Button
                Button(
                    onClick = { isEnrolled = !isEnrolled },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(50.dp)
                ) {
                    Text(
                        text = if (isEnrolled) "Enrolled ✓ (Start Learning)" else "Enroll in \${course.courseId}",
                        style = MaterialTheme.typography.titleMedium
                    )
                }

                Spacer(modifier = Modifier.height(24.dp))
            }
        }
    }
}
`,
  },
  {
    path: 'com/example/myapp/screens/ProfileScreen.kt',
    name: 'ProfileScreen.kt',
    category: 'Screen',
    description: 'Profile screen showing user info, session details, back arrow calling popBackStack(), and logout option.',
    content: `package com.example.myapp.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.ExitToApp
import androidx.compose.material.icons.filled.AccountCircle
import androidx.compose.material.icons.filled.Email
import androidx.compose.material.icons.filled.VerifiedUser
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.myapp.viewmodel.AuthViewModel
import com.example.myapp.viewmodel.CourseViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProfileScreen(
    authViewModel: AuthViewModel,
    courseViewModel: CourseViewModel,
    onNavigateBack: () -> Unit,
    onLogout: () -> Unit
) {
    val authState by authViewModel.uiState.collectAsStateWithLifecycle()
    val courseState by courseViewModel.uiState.collectAsStateWithLifecycle()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Student Profile", fontWeight = FontWeight.SemiBold) },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                            contentDescription = "Back"
                        )
                    }
                }
            )
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(horizontal = 24.dp)
                .verticalScroll(rememberScrollState()),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Spacer(modifier = Modifier.height(16.dp))

            // User Avatar
            Icon(
                imageVector = Icons.Default.AccountCircle,
                contentDescription = "User Avatar",
                modifier = Modifier.size(96.dp),
                tint = MaterialTheme.colorScheme.primary
            )

            Spacer(modifier = Modifier.height(12.dp))

            Text(
                text = authState.userName.ifBlank { "User" },
                style = MaterialTheme.typography.headlineSmall,
                fontWeight = FontWeight.Bold
            )

            Text(
                text = authState.userEmail,
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )

            Spacer(modifier = Modifier.height(24.dp))

            // Session & Account Card
            Card(
                modifier = Modifier.fillMaxWidth(),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Text(
                        text = "Account Details",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.SemiBold
                    )

                    HorizontalDivider()

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.VerifiedUser, contentDescription = null, modifier = Modifier.size(18.dp))
                            Spacer(modifier = Modifier.width(8.dp))
                            Text("Session Status")
                        }
                        Text("Active (DataStore)", fontWeight = FontWeight.Medium, color = MaterialTheme.colorScheme.primary)
                    }

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.Email, contentDescription = null, modifier = Modifier.size(18.dp))
                            Spacer(modifier = Modifier.width(8.dp))
                            Text("Email")
                        }
                        Text(authState.userEmail, style = MaterialTheme.typography.bodySmall)
                    }
                }
            }

            Spacer(modifier = Modifier.height(32.dp))

            // Logout Button
            OutlinedButton(
                onClick = onLogout,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(50.dp),
                colors = ButtonDefaults.outlinedButtonColors(
                    contentColor = MaterialTheme.colorScheme.error
                )
            ) {
                Icon(
                    imageVector = Icons.AutoMirrored.Filled.ExitToApp,
                    contentDescription = "Logout"
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text("Logout from Account")
            }
        }
    }
}
`,
  },
  {
    path: 'com/example/myapp/screens/SettingsScreen.kt',
    name: 'SettingsScreen.kt',
    category: 'Screen',
    description: 'Settings screen providing appearance, cache, session inspection, back arrow calling popBackStack(), and logout.',
    content: `package com.example.myapp.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.ExitToApp
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.example.myapp.viewmodel.AuthViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen(
    authViewModel: AuthViewModel,
    onNavigateBack: () -> Unit,
    onLogout: () -> Unit
) {
    var notificationsEnabled by remember { mutableStateOf(true) }
    var offlineDownloadEnabled by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Settings", fontWeight = FontWeight.SemiBold) },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                            contentDescription = "Back"
                        )
                    }
                }
            )
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(horizontal = 20.dp)
                .verticalScroll(rememberScrollState()),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Spacer(modifier = Modifier.height(4.dp))

            Text(
                text = "Preferences",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold
            )

            Card(modifier = Modifier.fillMaxWidth()) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text("Push Notifications", fontWeight = FontWeight.Medium)
                            Text(
                                "Receive course milestones and reminders",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                        Switch(
                            checked = notificationsEnabled,
                            onCheckedChange = { notificationsEnabled = it }
                        )
                    }

                    HorizontalDivider(modifier = Modifier.padding(vertical = 12.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text("Offline Course Cache", fontWeight = FontWeight.Medium)
                            Text(
                                "Download course notes for offline studying",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                        Switch(
                            checked = offlineDownloadEnabled,
                            onCheckedChange = { offlineDownloadEnabled = it }
                        )
                    }
                }
            }

            Text(
                text = "Architecture & Engine",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold
            )

            Card(modifier = Modifier.fillMaxWidth()) {
                Column(
                    modifier = Modifier.padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Text("Pattern: Clean MVVM + Repository", style = MaterialTheme.typography.bodyMedium)
                    Text("UI Toolkit: Jetpack Compose + Material 3", style = MaterialTheme.typography.bodyMedium)
                    Text("State Management: ViewModel + StateFlow", style = MaterialTheme.typography.bodyMedium)
                    Text("Navigation: Navigation Compose (Type-safe routes)", style = MaterialTheme.typography.bodyMedium)
                    Text("Persistence: AndroidX DataStore Preferences", style = MaterialTheme.typography.bodyMedium)
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            Button(
                onClick = onLogout,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(50.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = MaterialTheme.colorScheme.error
                )
            ) {
                Icon(Icons.AutoMirrored.Filled.ExitToApp, contentDescription = null)
                Spacer(modifier = Modifier.width(8.dp))
                Text("Log Out")
            }
        }
    }
}
`,
  },
  {
    path: 'com/example/myapp/viewmodel/AuthViewModel.kt',
    name: 'AuthViewModel.kt',
    category: 'ViewModel',
    description: 'AuthViewModel managing login, signup, logout, session restoration, and emitting AuthUiState StateFlow.',
    content: `package com.example.myapp.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.example.myapp.repository.AuthRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

data class AuthUiState(
    val isLoading: Boolean = false,
    val isLoggedIn: Boolean = false,
    val userName: String = "",
    val userEmail: String = "",
    val errorMessage: String? = null
)

class AuthViewModel(
    private val repository: AuthRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(AuthUiState())
    val uiState: StateFlow<AuthUiState> = _uiState.asStateFlow()

    init {
        // Restore session from DataStore on startup
        checkExistingSession()
    }

    private fun checkExistingSession() {
        viewModelScope.launch {
            repository.sessionFlow.collect { session ->
                _uiState.update { current ->
                    current.copy(
                        isLoggedIn = session.isLoggedIn,
                        userName = session.userName,
                        userEmail = session.userEmail
                    )
                }
            }
        }
    }

    fun login(
        email: String,
        password: String
    ) {
        val trimmedEmail = email.trim()
        val trimmedPassword = password.trim()

        if (trimmedEmail.isBlank() || trimmedPassword.isBlank()) {
            _uiState.update { it.copy(errorMessage = "Please enter email and password") }
            return
        }

        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorMessage = null) }
            try {
                val user = repository.login(trimmedEmail, trimmedPassword)
                _uiState.update {
                    it.copy(
                        isLoading = false,
                        isLoggedIn = true,
                        userName = user.name,
                        userEmail = user.email,
                        errorMessage = null
                    )
                }
            } catch (e: Exception) {
                _uiState.update {
                    it.copy(
                        isLoading = false,
                        errorMessage = e.message ?: "Authentication failed"
                    )
                }
            }
        }
    }

    fun signup(
        name: String,
        email: String,
        password: String,
        onSuccess: () -> Unit = {}
    ) {
        val trimmedName = name.trim()
        val trimmedEmail = email.trim()
        val trimmedPassword = password.trim()

        if (trimmedName.length < 2) {
            _uiState.update { it.copy(errorMessage = "Name must be at least 2 characters") }
            return
        }
        if (!trimmedEmail.contains("@") || !trimmedEmail.contains(".")) {
            _uiState.update { it.copy(errorMessage = "Please enter a valid email address") }
            return
        }
        if (trimmedPassword.length < 6) {
            _uiState.update { it.copy(errorMessage = "Password must be at least 6 characters") }
            return
        }

        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorMessage = null) }
            try {
                repository.signup(trimmedName, trimmedEmail, trimmedPassword)
                _uiState.update {
                    it.copy(
                        isLoading = false,
                        errorMessage = null
                    )
                }
                onSuccess()
            } catch (e: Exception) {
                _uiState.update {
                    it.copy(
                        isLoading = false,
                        errorMessage = e.message ?: "Signup failed"
                    )
                }
            }
        }
    }

    fun logout() {
        viewModelScope.launch {
            repository.logout()
            _uiState.update {
                AuthUiState(
                    isLoggedIn = false,
                    userName = "",
                    userEmail = "",
                    errorMessage = null
                )
            }
        }
    }

    fun clearError() {
        if (_uiState.value.errorMessage != null) {
            _uiState.update { it.copy(errorMessage = null) }
        }
    }
}

class AuthViewModelFactory(
    private val repository: AuthRepository
) : ViewModelProvider.Factory {
    @Suppress("UNCHECKED_CAST")
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(AuthViewModel::class.java)) {
            return AuthViewModel(repository) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}
`,
  },
  {
    path: 'com/example/myapp/viewmodel/CourseViewModel.kt',
    name: 'CourseViewModel.kt',
    category: 'ViewModel',
    description: 'CourseViewModel managing course list, selection by ID, search by title or Course ID, and surviving configuration changes.',
    content: `package com.example.myapp.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.example.myapp.model.Course
import com.example.myapp.repository.CourseRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

data class CourseUiState(
    val courses: List<Course> = emptyList(),
    val selectedCourse: Course? = null,
    val searchQuery: String = "",
    val isLoading: Boolean = false,
    val errorMessage: String? = null
)

class CourseViewModel(
    private val repository: CourseRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(CourseUiState())
    val uiState: StateFlow<CourseUiState> = _uiState.asStateFlow()

    init {
        loadCourses()
    }

    fun loadCourses() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorMessage = null) }
            try {
                val courses = repository.getCourses()
                _uiState.update {
                    it.copy(
                        courses = courses,
                        isLoading = false,
                        errorMessage = null
                    )
                }
            } catch (e: Exception) {
                _uiState.update {
                    it.copy(
                        isLoading = false,
                        errorMessage = e.message ?: "Failed to load courses"
                    )
                }
            }
        }
    }

    fun selectCourse(courseId: String) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorMessage = null) }
            val course = repository.getCourseById(courseId)
            if (course != null) {
                _uiState.update {
                    it.copy(
                        selectedCourse = course,
                        isLoading = false,
                        errorMessage = null
                    )
                }
            } else {
                _uiState.update {
                    it.copy(
                        selectedCourse = null,
                        isLoading = false,
                        errorMessage = "Course ID: $courseId not found"
                    )
                }
            }
        }
    }

    // Searches by course title OR Course ID (e.g. "PY101" or "Python")
    fun searchCourses(query: String) {
        _uiState.update { it.copy(searchQuery = query) }
        val filtered = repository.searchCourses(query)
        _uiState.update {
            it.copy(
                courses = filtered,
                errorMessage = if (filtered.isEmpty() && query.isNotBlank()) "No courses match '$query'" else null
            )
        }
    }
}

class CourseViewModelFactory(
    private val repository: CourseRepository
) : ViewModelProvider.Factory {
    @Suppress("UNCHECKED_CAST")
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(CourseViewModel::class.java)) {
            return CourseViewModel(repository) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}
`,
  },
  {
    path: 'com/example/myapp/model/Course.kt',
    name: 'Course.kt',
    category: 'Model',
    description: 'Course data model with courseId, title, description, instructor, duration, lessons, and syllabus.',
    content: `package com.example.myapp.model

data class LessonItem(
    val title: String,
    val duration: String
)

data class Course(
    val courseId: String,
    val title: String,
    val description: String,
    val instructor: String,
    val duration: String,
    val lessons: Int,
    val syllabus: List<LessonItem> = emptyList()
)
`,
  },
  {
    path: 'com/example/myapp/model/User.kt',
    name: 'User.kt',
    category: 'Model',
    description: 'User entity model containing id, name, email, and enrolled course IDs.',
    content: `package com.example.myapp.model

data class User(
    val id: String,
    val name: String,
    val email: String,
    val enrolledCourseIds: List<String> = emptyList()
)
`,
  },
  {
    path: 'com/example/myapp/repository/CourseRepository.kt',
    name: 'CourseRepository.kt',
    category: 'Repository',
    description: 'CourseRepository providing getCourses, getCourseById, and searchCourses implementations.',
    content: `package com.example.myapp.repository

import com.example.myapp.model.Course
import com.example.myapp.model.LessonItem

class CourseRepository {

    private val courseList = listOf(
        Course(
            courseId = "PY101",
            title = "Python Programming",
            description = "Complete Python programming course from fundamentals to object-oriented scripting and automation.",
            instructor = "John Smith",
            duration = "8 Weeks",
            lessons = 40,
            syllabus = listOf(
                LessonItem("Python Setup & Syntax Basics", "1.5h"),
                LessonItem("Data Structures & Control Flow", "2.5h"),
                LessonItem("Functions, Modules & Packages", "3h"),
                LessonItem("Object-Oriented Programming in Python", "4h"),
                LessonItem("File I/O & Exception Handling", "2h"),
                LessonItem("Capstone Project: CLI Automation", "4.5h")
            )
        ),
        Course(
            courseId = "WD101",
            title = "Web Development",
            description = "HTML, CSS and JavaScript essentials, responsive design, modern DOM manipulation, and asynchronous networking.",
            instructor = "David Khan",
            duration = "10 Weeks",
            lessons = 50,
            syllabus = listOf(
                LessonItem("Semantic HTML5 & Accessibility", "2h"),
                LessonItem("CSS3 Flexbox, Grid & Media Queries", "3.5h"),
                LessonItem("Modern JavaScript ES6+ Foundations", "4h"),
                LessonItem("DOM Events & Reactive UI Patterns", "3h"),
                LessonItem("Asynchronous JavaScript & REST APIs", "4h"),
                LessonItem("Production Deployment Workflow", "2.5h")
            )
        ),
        Course(
            courseId = "JV101",
            title = "Java Programming",
            description = "Complete Java programming course covering JVM architecture, memory management, OOP design patterns, and multithreading.",
            instructor = "Ali Ahmed",
            duration = "12 Weeks",
            lessons = 60,
            syllabus = listOf(
                LessonItem("Java Ecosystem & JVM Bytecode", "2.5h"),
                LessonItem("OOP Principles: Encapsulation & Polymorphism", "4h"),
                LessonItem("Collections Framework & Generics", "5h"),
                LessonItem("Java Streams & Functional Programming", "3.5h"),
                LessonItem("Multithreading & Concurrency", "4.5h"),
                LessonItem("Database Connectivity with JDBC", "3h")
            )
        ),
        Course(
            courseId = "KT101",
            title = "Kotlin & Jetpack Compose",
            description = "Modern declarative Android UI toolkit, state hoisting, Material 3 theming, Navigation Compose, and animations.",
            instructor = "Sarah Jenkins",
            duration = "9 Weeks",
            lessons = 48,
            syllabus = listOf(
                LessonItem("Kotlin Coroutines & Flow Fundamentals", "3h"),
                LessonItem("Composable Functions & Recomposition", "3.5h"),
                LessonItem("Material 3 Design & Dynamic Theming", "3h"),
                LessonItem("State Management: ViewModel & StateFlow", "4.5h"),
                LessonItem("Navigation Compose & Backstack Handling", "3.5h"),
                LessonItem("Building a Production Compose App", "5h")
            )
        )
    )

    fun getCourses(): List<Course> {
        return courseList
    }

    fun getCourseById(courseId: String): Course? {
        return courseList.find { it.courseId.equals(courseId, ignoreCase = true) }
    }

    fun searchCourses(query: String): List<Course> {
        val trimmed = query.trim().lowercase()
        if (trimmed.isEmpty()) return courseList

        return courseList.filter { course ->
            course.title.lowercase().contains(trimmed) ||
            course.courseId.lowercase().contains(trimmed) ||
            course.instructor.lowercase().contains(trimmed)
        }
    }
}
`,
  },
  {
    path: 'com/example/myapp/repository/AuthRepository.kt',
    name: 'AuthRepository.kt',
    category: 'Repository',
    description: 'AuthRepository handling authentication, validation, credentials checking, and session synchronization.',
    content: `package com.example.myapp.repository

import com.example.myapp.data.SessionData
import com.example.myapp.data.SessionManager
import com.example.myapp.model.User
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.Flow

class AuthRepository(
    private val sessionManager: SessionManager
) {
    val sessionFlow: Flow<SessionData> = sessionManager.sessionFlow

    // In-memory registered user database for testing (can be backed by Room)
    private val registeredUsers = mutableListOf(
        UserRecord("Alex Johnson", "alex@example.com", "password123", listOf("PY101", "WD101"))
    )

    suspend fun login(email: String, password: String): User {
        delay(400) // Simulate network/database latency
        val userRecord = registeredUsers.find { it.email.equals(email, ignoreCase = true) }
            ?: throw Exception("No account found with this email")

        if (userRecord.password != password) {
            throw Exception("Incorrect password. Please try again.")
        }

        // Save session in DataStore
        sessionManager.saveSession(
            isLoggedIn = true,
            userName = userRecord.name,
            userEmail = userRecord.email
        )

        return User(
            id = userRecord.email,
            name = userRecord.name,
            email = userRecord.email,
            enrolledCourseIds = userRecord.enrolledCourseIds
        )
    }

    suspend fun signup(name: String, email: String, password: String): User {
        delay(500)
        val exists = registeredUsers.any { it.email.equals(email, ignoreCase = true) }
        if (exists) {
            throw Exception("An account with this email already exists")
        }

        val newRecord = UserRecord(name, email, password, listOf("PY101"))
        registeredUsers.add(newRecord)

        return User(
            id = newRecord.email,
            name = newRecord.name,
            email = newRecord.email,
            enrolledCourseIds = newRecord.enrolledCourseIds
        )
    }

    suspend fun logout() {
        sessionManager.clearSession()
    }

    private data class UserRecord(
        val name: String,
        val email: String,
        val password: String,
        val enrolledCourseIds: List<String>
    )
}
`,
  },
  {
    path: 'com/example/myapp/data/SessionManager.kt',
    name: 'SessionManager.kt',
    category: 'Data',
    description: 'SessionManager leveraging AndroidX DataStore Preferences for reactive session state management.',
    content: `package com.example.myapp.data

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

private val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "user_session")

data class SessionData(
    val isLoggedIn: Boolean = false,
    val userName: String = "",
    val userEmail: String = ""
)

class SessionManager(private val context: Context) {

    companion object {
        val KEY_IS_LOGGED_IN = booleanPreferencesKey("is_logged_in")
        val KEY_USER_NAME = stringPreferencesKey("user_name")
        val KEY_USER_EMAIL = stringPreferencesKey("user_email")
    }

    val sessionFlow: Flow<SessionData> = context.dataStore.data.map { preferences ->
        SessionData(
            isLoggedIn = preferences[KEY_IS_LOGGED_IN] ?: false,
            userName = preferences[KEY_USER_NAME] ?: "",
            userEmail = preferences[KEY_USER_EMAIL] ?: ""
        )
    }

    suspend fun saveSession(isLoggedIn: Boolean, userName: String, userEmail: String) {
        context.dataStore.edit { preferences ->
            preferences[KEY_IS_LOGGED_IN] = isLoggedIn
            preferences[KEY_USER_NAME] = userName
            preferences[KEY_USER_EMAIL] = userEmail
        }
    }

    suspend fun clearSession() {
        context.dataStore.edit { preferences ->
            preferences[KEY_IS_LOGGED_IN] = false
            preferences[KEY_USER_NAME] = ""
            preferences[KEY_USER_EMAIL] = ""
        }
    }
}
`,
  },
  {
    path: 'app/build.gradle.kts',
    name: 'app/build.gradle.kts',
    category: 'Config',
    description: 'Module-level build.gradle.kts with Jetpack Compose BOM, Navigation, Material 3, and DataStore.',
    content: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
}

android {
    namespace = "com.example.myapp"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.example.myapp"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }

    buildFeatures {
        compose = true
    }
}

dependencies {
    // Jetpack Compose BOM
    val composeBom = platform("androidx.compose:compose-bom:2024.09.00")
    implementation(composeBom)
    androidTestImplementation(composeBom)

    // Compose UI, Graphics, and Preview
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3:1.3.0")
    implementation("androidx.compose.material:material-icons-extended")

    // Navigation Compose
    implementation("androidx.navigation:navigation-compose:2.8.1")

    // Lifecycle & ViewModel Compose
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.8.6")
    implementation("androidx.lifecycle:lifecycle-runtime-compose:2.8.6")

    // DataStore Preferences
    implementation("androidx.datastore:datastore-preferences:1.1.1")

    // Coroutines
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.8.1")

    // Core AndroidX
    implementation("androidx.core:core-ktx:1.13.1")
    implementation("androidx.activity:activity-compose:1.9.2")

    // Debugging
    debugImplementation("androidx.compose.ui:ui-tooling")
    debugImplementation("androidx.compose.ui:ui-test-manifest")
}
`,
  },
  {
    path: 'app/src/main/AndroidManifest.xml',
    name: 'AndroidManifest.xml',
    category: 'Config',
    description: 'Android manifest with edge-to-edge theme and MainActivity declaration.',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.MyApp">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|screenSize|screenLayout|keyboardHidden"
            android:theme="@style/Theme.MyApp">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>
`,
  },
  {
    path: 'build.gradle.kts',
    name: 'build.gradle.kts',
    category: 'Config',
    description: 'Root build.gradle.kts configuring Android and Kotlin plugins.',
    content: `// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.kotlin.compose) apply false
}
`,
  },
  {
    path: 'gradle/libs.versions.toml',
    name: 'libs.versions.toml',
    category: 'Config',
    description: 'Version catalog for Gradle dependencies and plugins.',
    content: `[versions]
agp = "8.6.0"
kotlin = "2.0.20"
coreKtx = "1.13.1"
composeBom = "2024.09.00"
navigationCompose = "2.8.1"
lifecycle = "2.8.6"
datastore = "1.1.1"

[libraries]
androidx-core-ktx = { group = "androidx.core", name = "core-ktx", version.ref = "coreKtx" }
androidx-compose-bom = { group = "androidx.compose", name = "compose-bom", version.ref = "composeBom" }
androidx-ui = { group = "androidx.compose.ui", name = "ui" }
androidx-ui-graphics = { group = "androidx.compose.ui", name = "ui-graphics" }
androidx-ui-tooling-preview = { group = "androidx.compose.ui", name = "ui-tooling-preview" }
androidx-material3 = { group = "androidx.compose.material3", name = "material3" }
androidx-navigation-compose = { group = "androidx.navigation", name = "navigation-compose", version.ref = "navigationCompose" }
androidx-lifecycle-viewmodel-compose = { group = "androidx.lifecycle", name = "lifecycle-viewmodel-compose", version.ref = "lifecycle" }
androidx-lifecycle-runtime-compose = { group = "androidx.lifecycle", name = "lifecycle-runtime-compose", version.ref = "lifecycle" }
androidx-datastore-preferences = { group = "androidx.datastore", name = "datastore-preferences", version.ref = "datastore" }

[plugins]
android-application = { id = "com.android.application", version.ref = "agp" }
kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
kotlin-compose = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }
`,
  }
];
