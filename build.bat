@echo off
rem Builds English Quiz for production: type-check, then output to the docs\ folder.
cd /d "%~dp0src"
if not exist node_modules (
  echo Installing dependencies...
  call npm install || exit /b 1
)
call npm run build
if errorlevel 1 (
  echo.
  echo Build FAILED.
  exit /b 1
)
echo.
echo Build completed: %~dp0docs
