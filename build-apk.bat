@echo off
echo ====================================================
echo   Marvel Cinematic TV Launcher - 1-Click APK Builder
echo ====================================================
echo [1/4] Installing dependencies...
call npm install
call npm install @capacitor/core @capacitor/cli @capacitor/android
echo [2/4] Building Minimalist Marvel UI...
call npm run build
echo [3/4] Syncing with Android TV Native Bridge...
call npx cap init "Marvel TV Launcher" "com.kushagra.marveltvlauncher" --web-dir dist
call npx cap add android
call npx cap sync android
echo [4/4] Compiling APK...
cd android
call gradlew.bat assembleDebug
echo ====================================================
echo DONE! Your APK is ready at:
echo android\app\build\outputs\apk\debug\app-debug.apk
echo ====================================================
pause
