@echo off
echo ========================================
echo PopCat Game Starter for Windows
echo ========================================
echo.

echo Checking for MongoDB...
sc query MongoDB >nul 2>&1
if %errorlevel%==0 (
    echo MongoDB service found!
    net start MongoDB >nul 2>&1
    echo MongoDB started.
) else (
    echo MongoDB not installed. Using mock server instead...
    echo.
)

echo Starting Backend Server...
start cmd /k "cd backend && bun run src/mock-server.ts"
timeout /t 3 >nul

echo Starting Frontend Server...
start cmd /k "cd frontend && npm run dev"
timeout /t 3 >nul

echo.
echo ========================================
echo Servers are starting!
echo Backend: http://localhost:3001
echo Frontend: http://localhost:3000
echo ========================================
echo.
echo Press any key to open the game in browser...
pause >nul
start http://localhost:3000