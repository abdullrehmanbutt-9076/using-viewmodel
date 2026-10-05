// ProjectExporter.ts - Bundles the Android Studio project into a downloadable .zip file
import JSZip from 'jszip';
import { KOTLIN_PROJECT_FILES } from '../kotlinSourceCode';

export async function generateAndroidStudioProjectZip(): Promise<Blob> {
  const zip = new JSZip();

  // 1. Add all Kotlin files and Gradle scripts
  KOTLIN_PROJECT_FILES.forEach((file) => {
    if (file.path.startsWith('com/')) {
      zip.file(`app/src/main/java/${file.path}`, file.content);
    } else {
      zip.file(file.path, file.content);
    }
  });

  // 2. Add Gradle wrapper and properties
  zip.file(
    'gradle.properties',
    `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.enableJetifier=false
kotlin.code.style=official
`
  );

  zip.file(
    'settings.gradle.kts',
    `pluginManagement {
    repositories {
        google {
            content {
                includeGroupByRegex("com\\\\.android.*")
                includeGroupByRegex("com\\\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "CourseApp"
include(":app")
`
  );

  // 3. Add Android string resources and theme
  zip.file(
    'app/src/main/res/values/strings.xml',
    `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">CourseApp</string>
</resources>
`
  );

  zip.file(
    'app/src/main/res/values/themes.xml',
    `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="Theme.MyApp" parent="android:Theme.Material.Light.NoActionBar">
        <item name="android:statusBarColor">@android:color/transparent</item>
        <item name="android:navigationBarColor">@android:color/transparent</item>
    </style>
</resources>
`
  );

  // 4. Generate README for Android Studio
  zip.file(
    'README.md',
    `# Kotlin Jetpack Compose MVVM Course App

A complete Android application built with:
- **Language**: Kotlin 2.0
- **UI Toolkit**: Jetpack Compose + Material 3
- **Navigation**: Navigation Compose 2.8+ with Dynamic Route Arguments (\`course/{courseId}\`)
- **Architecture**: MVVM (UI → ViewModel → Repository → Data Source)
- **State Management**: StateFlow + \`collectAsStateWithLifecycle()\`
- **Persistence**: AndroidX DataStore Preferences (SessionManager)

## How to Run in Android Studio:
1. Open Android Studio (Ladybug / Koala / Hedgehog or newer).
2. Choose **File > Open...** and select this unzipped directory.
3. Allow Gradle to sync.
4. Select an Android Emulator (API 34/35) or physical device.
5. Click **Run (Shift + F10)**.
`
  );

  return await zip.generateAsync({ type: 'blob' });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
