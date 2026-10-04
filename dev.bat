@echo off
rem Starts EnglishQuiz in development mode (opens the browser).
cd /d "%~dp0src"
if not exist node_modules (
  echo Installing dependencies...
  call npm install || exit /b 1
)
call npm run dev -- --open
