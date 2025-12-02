@echo off
REM Kill all PHP processes and start fresh

echo Killing old PHP processes...
taskkill /F /IM php.exe >nul 2>&1

timeout /t 2 /nobreak

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║     Starting PHP Server (CORRECT DIRECTORY)               ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

cd /d "e:\Zahrat Alrabie E-commerce\E-Shop\backend\public"

echo Serving from: %CD%
echo URL: http://localhost:8000
echo API: http://localhost:8000/api/products
echo.
echo Press Ctrl+C to stop
echo.

php -S localhost:8000

