@echo off
setlocal enabledelayedexpansion

echo ============================================
echo  EnglishQuiz - Release Build
echo ============================================
echo.

rem Il codice (e package.json) sta in src\
pushd "%~dp0..\src"
if %errorlevel% neq 0 (
    echo [FAIL] Folder src not found.
    exit /b 1
)

echo [1/3] Running tests...
call npm run test
if %errorlevel% neq 0 (
    echo.
    echo [FAIL] Tests failed. Build aborted.
    popd
    exit /b 1
)
echo [OK] Tests passed.
echo.

echo [2/3] Running lint...
call npm run lint
if %errorlevel% neq 0 (
    echo.
    echo [FAIL] Lint failed. Build aborted.
    popd
    exit /b 1
)
echo [OK] Lint passed.
echo.

echo [3/3] Building for production...
call npm run build
if %errorlevel% neq 0 (
    echo.
    echo [FAIL] Build failed.
    popd
    exit /b 1
)

popd
echo.
echo ============================================
echo  Build complete. Output in: docs\
echo ============================================
endlocal
