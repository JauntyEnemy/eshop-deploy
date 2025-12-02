@echo off
REM Complete Restart Script for Zahrat Alrabie Admin Panel

cls
echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║     ZAHRAT ALRABIE - COMPLETE RESTART PROCEDURE         ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

REM Kill any existing PHP or Node processes
echo Killing any existing PHP and Node processes...
taskkill /F /IM php.exe >nul 2>&1
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║  RUNNING DATABASE VALIDATION TEST                       ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

cd /d "e:\Zahrat Alrabie E-commerce\E-Shop\backend"
php manual_test.php

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║  STARTING SERVERS                                        ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

echo.
echo Starting PHP Backend Server on localhost:8000
echo (Keep this window open while testing)
echo.
echo Press Ctrl+C to stop the server
echo.

start cmd /k "cd /d \"e:\Zahrat Alrabie E-commerce\E-Shop\backend\" && php -S localhost:8000"

timeout /t 3 /nobreak

echo.
echo Starting Vite Frontend Server on localhost:5173
echo (Keep this window open while testing)
echo.

start cmd /k "cd /d \"e:\Zahrat Alrabie E-commerce\E-Shop\frontend\" && npm run dev"

timeout /t 3 /nobreak

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║  SERVERS STARTED                                         ║
echo ╚══════════════════════════════════════════════════════════╝
echo.
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo Admin Login: http://localhost:5173/admin/login
echo.
echo Credentials:
echo   Username: admin
echo   Password: password123
echo.
echo When you close this window, all servers will stop.
echo.
pause
