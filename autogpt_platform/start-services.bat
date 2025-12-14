@echo off
setlocal enabledelayedexpansion

REM AutoGPT Platform Services Startup Script
REM This script starts all AutoGPT platform services in the recommended order

echo ========================================
echo   AutoGPT Platform Services Startup
echo ========================================
echo.

REM Check if we're in the correct directory
if exist "pyproject.toml" (
    REM We're already in the backend directory
    set "working_dir=%cd%"
) else if exist "backend\pyproject.toml" (
    REM We're in autogpt_platform directory, need to go to backend
    cd backend
    set "working_dir=%cd%"
    echo 切换到后端目录: %working_dir%
) else (
    echo 错误: 找不到 pyproject.toml 文件。
    echo 请从以下目录之一运行此脚本:
    echo   1. autogpt_platform\backend
    echo   2. autogpt_platform
    pause
    exit /b 1
)

REM Check if Poetry is available
poetry --version >nul 2>&1
if errorlevel 1 (
    echo Error: Poetry is not installed or not in PATH
    echo Please install Poetry first: https://python-poetry.org/docs/#installation
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('poetry --version') do set poetry_version=%%i
echo Found: %poetry_version%
echo.

echo Starting services in recommended order...
echo.

REM Start Database Manager (8005)
echo Starting Database Manager (Port: 8005)...
start "Database Manager" cmd /k "poetry run db"
echo ✓ Database Manager started
timeout /t 3 /nobreak >nul

REM Start WebSocket (8001)
echo Starting WebSocket (Port: 8001)...
start "WebSocket" cmd /k "poetry run ws"
echo ✓ WebSocket started
timeout /t 2 /nobreak >nul

REM Start Notification (8007)
echo Starting Notification (Port: 8007)...
start "Notification" cmd /k "poetry run notification"
echo ✓ Notification started
timeout /t 2 /nobreak >nul

REM Start Scheduler (8003)
echo Starting Scheduler (Port: 8003)...
start "Scheduler" cmd /k "poetry run scheduler"
echo ✓ Scheduler started
timeout /t 2 /nobreak >nul

REM Start Executor (8002)
echo Starting Executor (Port: 8002)...
start "Executor" cmd /k "poetry run executor"
echo ✓ Executor started
timeout /t 2 /nobreak >nul

REM Start REST API (8006)
echo Starting REST API (Port: 8006)...
start "REST API" cmd /k "poetry run rest"
echo ✓ REST API started

echo.
echo ========================================
echo   All services started successfully!
echo ========================================
echo.

echo Service URLs:
echo   • Database Manager: http://localhost:8005
echo   • WebSocket: http://localhost:8001
echo   • Notification: http://localhost:8007
echo   • Scheduler: http://localhost:8003
echo   • Executor: http://localhost:8002
echo   • REST API: http://localhost:8006
echo.

echo Services are running in separate windows.
echo Close those windows to stop the services.
echo.
echo Press any key to exit this script...
pause >nul
