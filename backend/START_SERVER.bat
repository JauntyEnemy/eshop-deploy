@echo off
REM Start PHP Server from the public directory

cd /d "e:\Zahrat Alrabie E-commerce\E-Shop\backend\public"

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║         Starting PHP Development Server                    ║
echo ║         Serving from: public/ directory                    ║
echo ║         URL: http://localhost:8000                         ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo Press Ctrl+C to stop the server
echo.

php -S localhost:8000

