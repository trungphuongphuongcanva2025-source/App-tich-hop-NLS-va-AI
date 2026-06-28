@echo off
cd /d "%~dp0"
title Khoi chay ung dung Long ghep Nang luc So va AI
cls

echo =======================================================================
echo    KHOI CHAY UNG DUNG LONG GHEP NANG LUC SO VA AI (LOCAL PC)
echo =======================================================================
echo.

rem Kiem tra Node.js da duoc cai dat chua
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/ and try again.
    echo.
    pause
    exit /b
)

rem Kiem tra file .env
if not exist .env (
    echo [WARNING] File .env does not exist. Creating default .env file...
    echo GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE" > .env
    echo APP_URL="http://localhost:3000" >> .env
)

rem Kiem tra va cai dat thu vien neu chua co node_modules
if not exist node_modules (
    echo [INFO] Installing dependencies (npm install)...
    echo This might take a minute, please wait...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install dependencies.
        pause
        exit /b
    )
    echo [INFO] Dependencies installed successfully!
    echo.
)

rem Mo trinh duyet web den dia chi localhost:3000
echo [INFO] Opening app in your browser...
start http://localhost:3000

rem Chay ung dung o che do dev
echo [INFO] Starting the server...
call npm run dev

pause
