# WorkPulse Enterprise - Full Project Orchestrator (PowerShell)

$root = Get-Location

function Start-Service-Window($name, $path, $command, $args) {
    Write-Host "Launching $name..." -ForegroundColor Cyan
    Start-Process powershell.exe -ArgumentList "-NoExit", "-Command", "Set-Location -LiteralPath '$path'; $command $args"
}

# 1. HR Backend & Gateway (Port 8081)
Start-Service-Window "HR Gateway" "$root\backend" "npm" "run dev"

# 2. Main Platform Hub & Landing Page (Port 3005)
Start-Service-Window "WorkPulse Hub" "$root\frontend" "npm" "run dev"

# 3. Dedicated HR Dashboard (Port 3001)
Start-Service-Window "HR Dashboard" "$root\master-dashboard" "npm" "run dev"

# 4. Employee Ecosystem
Start-Service-Window "Employee API" "$root\Employee\backend" "python" "manage.py runserver 8000"
Start-Service-Window "Employee Hub UI" "$root\Employee\frontend" "npm" "run dev"

# 5. Tech Lead Ecosystem
Start-Service-Window "Tech Lead API" "$root\tech_lead\backend" "npm" "run dev"
Start-Service-Window "Tech Lead Hub UI" "$root\tech_lead\frontend" "npm" "run dev"

# 6. Specialized Hubs
Start-Service-Window "IT Helpdesk API" "$root\IT Helpdesk Ticketing System\server" "node" "server.js"
Start-Service-Window "IT Helpdesk UI" "$root\IT Helpdesk Ticketing System\client" "npm" "run dev"
Start-Service-Window "AI Marketing" "$root\marketing_sales" "node" "startup.js"
Start-Service-Window "Location Tracker" "$root\location\server" "node" "index.js"

Write-Host "===================================================" -ForegroundColor Green
Write-Host "All WorkPulse services are initializing..." -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Green

Start-Sleep -Seconds 8

Write-Host "Opening Secure Entry Point: http://127.0.0.1:3005" -ForegroundColor Yellow
Start-Process "http://127.0.0.1:3005"
