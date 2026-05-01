# WorkPulse Enterprise - Unified Platform Orchestrator
$rootDir = (Get-Item -LiteralPath "$PSScriptRoot\..").FullName

function Start-Service-Window($name, $path, $command, $args) {
    Write-Host "[ORCHESTRATOR] Launching $name..." -ForegroundColor Cyan
    # Use -LiteralPath to handle ampersands correctly in the directory name
    Start-Process powershell.exe -ArgumentList "-NoExit", "-Command", "Set-Location -LiteralPath '$path'; $command $args"
}

# 1. Infrastructure & Core Gateways
Start-Service-Window "HR Gateway (8081)" "$rootDir\Hr\backend" "npm" "run dev"
Start-Service-Window "Adminster Backend (5001)" "$rootDir\adminster\backend" "npm" "run dev"

# 2. Main Entry Points
Start-Service-Window "WorkPulse Hub (3005)" "$rootDir\web-page\frontend" "npm" "run dev -- --port 3005"

# 3. Departmental Ecosystems
# Employee
Start-Service-Window "Employee API (8000)" "$rootDir\Hr\Employee\backend" "python" "manage.py runserver 127.0.0.1:8000"
Start-Service-Window "Employee UI (5173)" "$rootDir\Hr\Employee\frontend" "npm" "run dev -- --port 5173"

# Tech Lead
Start-Service-Window "Tech API (5000)" "$rootDir\Hr\tech_lead\backend" "npm" "run dev"
Start-Service-Window "Tech UI (3003)" "$rootDir\Hr\tech_lead\frontend" "npm" "run dev -- --port 3003"

# IT Helpdesk
Start-Service-Window "Helpdesk API (5005)" "$rootDir\Hr\IT Helpdesk Ticketing System\server" "node" "server.js"
Start-Service-Window "Helpdesk UI (3004)" "$rootDir\Hr\IT Helpdesk Ticketing System\client" "npm" "run dev -- --port 3004"

# 4. Specialized Modules
Start-Service-Window "AI Marketing (3006)" "$rootDir\Hr\marketing_sales" "node" "startup.js"
Start-Service-Window "Location Tracker (3007)" "$rootDir\Hr\Location\server" "node" "index.js"

Write-Host "===================================================" -ForegroundColor Green
Write-Host "AuraHR Enterprise Platform is initializing..." -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Green

Start-Sleep -Seconds 8
Start-Process "http://127.0.0.1:3005"
