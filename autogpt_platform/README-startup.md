# AutoGPT Platform Services Startup Scripts

This directory contains scripts to start all AutoGPT platform services in the recommended order with a single command.

## Available Scripts

### 1. PowerShell Script (Recommended)
**File:** `start-services.ps1`

A feature-rich PowerShell script with advanced options and monitoring.

#### Usage:
```powershell
# Basic usage - starts all services in background
.\start-services.ps1

# Start services in separate windows (good for debugging)
.\start-services.ps1 -SeparateWindows

# Start without delays between services (faster startup)
.\start-services.ps1 -NoDelay

# Combine options
.\start-services.ps1 -SeparateWindows -NoDelay
```

#### Features:
- ✅ Validates Poetry installation
- ✅ Checks if running from correct directory
- ✅ Starts services in recommended order with proper delays
- ✅ Color-coded output for better visibility
- ✅ Service monitoring and error detection
- ✅ Graceful shutdown with Ctrl+C
- ✅ Option to run in separate windows for debugging
- ✅ Displays all service URLs

### 2. Batch File (Simple)
**File:** `start-services.bat`

A simple batch file that starts each service in a separate command window.

#### Usage:
```cmd
start-services.bat
```

#### Features:
- ✅ Simple and straightforward
- ✅ Each service runs in its own window
- ✅ Basic validation checks
- ✅ Displays service URLs

## Services Started

The scripts start the following services in this order:

1. **Database Manager** (Port: 8005) - `poetry run db`
2. **WebSocket** (Port: 8001) - `poetry run ws`
3. **Notification** (Port: 8007) - `poetry run notification`
4. **Scheduler** (Port: 8003) - `poetry run scheduler`
5. **Executor** (Port: 8002) - `poetry run executor`
6. **REST API** (Port: 8006) - `poetry run rest`

## Prerequisites

1. **Poetry** must be installed and in your PATH
   - Install from: https://python-poetry.org/docs/#installation

2. **Run from the correct directory**:
   - You can run the scripts from either:
     - `autogpt_platform/` directory (recommended)
     - `autogpt_platform/backend/` directory
   - The scripts will automatically detect and navigate to the correct location

3. **Dependencies** should be installed:
   ```bash
   cd autogpt_platform/backend
   poetry install
   ```

## Service URLs

Once started, the services will be available at:

- Database Manager: http://localhost:8005
- WebSocket: http://localhost:8001
- Notification: http://localhost:8007
- Scheduler: http://localhost:8003
- Executor: http://localhost:8002
- REST API: http://localhost:8006

## Stopping Services

### PowerShell Script:
- Press `Ctrl+C` in the PowerShell window to gracefully stop all services
- The script will automatically clean up all background processes

### Batch File:
- Close the individual command windows for each service
- Or close all command windows manually

## Troubleshooting

### Common Issues:

1. **"Poetry not found"**
   - Install Poetry and ensure it's in your PATH
   - Restart your terminal after installation

2. **"pyproject.toml not found"**
   - Make sure you're running the script from `autogpt_platform/backend`
   - Use `cd autogpt_platform/backend` to navigate there first

3. **Port conflicts**
   - Check if any of the ports (8001-8007) are already in use
   - Stop existing services before starting new ones

4. **Service fails to start**
   - Check the individual service windows for error messages
   - Ensure all dependencies are installed with `poetry install`
   - Check your `.env` file configuration

### Debugging Tips:

- Use the `-SeparateWindows` option with the PowerShell script to see each service's output
- Check the logs in each service window for specific error messages
- Verify your environment variables in the `.env` file
- Ensure Docker is running if any services depend on it

## Development Tips

For development, you might want to:

1. Use the PowerShell script with `-SeparateWindows` to see each service's output
2. Start services individually for debugging: `poetry run db`, `poetry run ws`, etc.
3. Check the `pyproject.toml` for available scripts and their configurations
4. Use the existing `docker-compose.yml` for containerized development

## Additional Resources

- AutoGPT Platform Documentation
- Poetry Documentation: https://python-poetry.org/docs/
- PowerShell Scripting Guide
- Windows Batch File Reference
