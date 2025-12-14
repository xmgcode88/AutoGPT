# AutoGPT Platform Services Startup Script
# This script starts all AutoGPT platform services in the recommended order

param(
    [switch]$NoDelay,
    [switch]$SeparateWindows
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  AutoGPT Platform Services Startup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the correct directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$backendDir = Join-Path $scriptDir "backend"

if (Test-Path "pyproject.toml") {
    # We're already in the backend directory
    $workingDir = Get-Location
} elseif (Test-Path (Join-Path $backendDir "pyproject.toml")) {
    # We're in autogpt_platform directory, need to go to backend
    $workingDir = $backendDir
    Write-Host "切换到后端目录: $workingDir" -ForegroundColor Yellow
} else {
    Write-Host "错误: 找不到 pyproject.toml 文件。" -ForegroundColor Red
    Write-Host "请从以下目录之一运行此脚本:" -ForegroundColor Red
    Write-Host "  1. autogpt_platform/backend" -ForegroundColor Red
    Write-Host "  2. autogpt_platform" -ForegroundColor Red
    exit 1
}

# Change to the backend directory
Set-Location $workingDir

# Check if Poetry is available
try {
    $poetryVersion = poetry --version 2>$null
    Write-Host "Found: $poetryVersion" -ForegroundColor Green
} catch {
    Write-Host "Error: Poetry is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Poetry first: https://python-poetry.org/docs/#installation" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Starting services in recommended order..." -ForegroundColor Yellow
Write-Host ""

# Service configuration
$services = @(
    @{ Name = "Database Manager"; Port = 8005; Command = "db"; Delay = 3 },
    @{ Name = "WebSocket"; Port = 8001; Command = "ws"; Delay = 2 },
    @{ Name = "Notification"; Port = 8007; Command = "notification"; Delay = 2 },
    @{ Name = "Scheduler"; Port = 8003; Command = "scheduler"; Delay = 2 },
    @{ Name = "Executor"; Port = 8002; Command = "executor"; Delay = 2 },
    @{ Name = "REST API"; Port = 8006; Command = "rest"; Delay = 0 }
)

$startedServices = @()

foreach ($service in $services) {
    Write-Host "Starting $($service.Name) (Port: $($service.Port))..." -ForegroundColor Yellow
    
    if ($SeparateWindows) {
        # Start in a new window
        $process = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; poetry run $($service.Command)" -PassThru
        $startedServices += @{ Process = $process; Name = $service.Name; Port = $service.Port }
    } else {
        # Start in background
        $job = Start-Job -ScriptBlock {
            param($command, $workingDir)
            Set-Location $workingDir
            poetry run $command
        } -ArgumentList $service.Command, $PWD
        
        $startedServices += @{ Job = $job; Name = $service.Name; Port = $service.Port }
    }
    
    Write-Host "✓ $($service.Name) started" -ForegroundColor Green
    
    if (-not $NoDelay -and $service.Delay -gt 0) {
        Write-Host "Waiting $($service.Delay) second(s) before next service..." -ForegroundColor Gray
        Start-Sleep -Seconds $service.Delay
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  All services started successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Service URLs:" -ForegroundColor Yellow
foreach ($service in $services) {
    Write-Host "  • $($service.Name): http://localhost:$($service.Port)" -ForegroundColor White
}

Write-Host ""
Write-Host "Press Ctrl+C to stop all services" -ForegroundColor Yellow
Write-Host ""

# Handle graceful shutdown
try {
    if ($SeparateWindows) {
        Write-Host "Services are running in separate windows." -ForegroundColor Gray
        Write-Host "Close those windows to stop the services." -ForegroundColor Gray
        Write-Host "Press any key to exit this script..." -ForegroundColor Gray
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    } else {
        Write-Host "Monitoring services... Press Ctrl+C to stop all." -ForegroundColor Gray
        while ($true) {
            Start-Sleep -Seconds 5
            
            # Check if any job has failed
            foreach ($service in $startedServices) {
                if ($service.Job.State -eq "Failed") {
                    Write-Host "Warning: $($service.Name) has failed!" -ForegroundColor Red
                    $errorInfo = Receive-Job $service.Job -ErrorAction SilentlyContinue
                    if ($errorInfo) {
                        Write-Host "Error details: $errorInfo" -ForegroundColor Red
                    }
                }
            }
        }
    }
} catch [System.Management.Automation.HaltCommandException] {
    Write-Host ""
    Write-Host "Stopping all services..." -ForegroundColor Yellow
    
    foreach ($service in $startedServices) {
        try {
            if ($SeparateWindows -and $service.Process) {
                $service.Process.Kill()
                Write-Host "✓ Stopped $($service.Name)" -ForegroundColor Green
            } elseif (-not $SeparateWindows -and $service.Job) {
                Remove-Job $service.Job -Force
                Write-Host "✓ Stopped $($service.Name)" -ForegroundColor Green
            }
        } catch {
            Write-Host "Warning: Could not stop $($service.Name): $($_.Exception.Message)" -ForegroundColor Yellow
        }
    }
    
    Write-Host "All services stopped." -ForegroundColor Green
    exit 0
}
