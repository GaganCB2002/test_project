$ProjectDir = "D:\full_Stack_project\Recruitment & Hiring"
$AuraBackendDir = "$ProjectDir\backend"
$AuraFrontendDir = "$ProjectDir\frontend"
$XyzDir = "$ProjectDir\xyz_Model"
$XyzBackendDir = "$XyzDir\backend"
$XyzFrontendDir = "$XyzDir\frontend"

Write-Host "=================================================="
Write-Host "   Master Startup - AuraHR & Employee Dashboard   "
Write-Host "=================================================="

# 1. Start AuraHR Backend (Node.js)
Write-Host "[1/4] Starting AuraHR Backend..."
Start-Process -FilePath "node.exe" -ArgumentList "`"$AuraBackendDir\node_modules\tsx\dist\cli.mjs`" watch src/server.ts" -WorkingDirectory "$AuraBackendDir" -NoNewWindow

# 2. Start AuraHR Frontend (Vite)
Write-Host "[2/4] Starting AuraHR Frontend..."
Start-Process -FilePath "node.exe" -ArgumentList "`"$AuraFrontendDir\node_modules\vite\bin\vite.js`"" -WorkingDirectory "$AuraFrontendDir" -NoNewWindow

# 3. Start xyz_Model Backend (Django)
Write-Host "[3/4] Starting Employee Dashboard Backend..."
$env:PYTHONPATH = $XyzBackendDir
Start-Process -FilePath "$XyzDir\venv\Scripts\python.exe" -ArgumentList "manage.py runserver 8000" -WorkingDirectory "$XyzBackendDir" -NoNewWindow

# 4. Start xyz_Model Frontend (Vite)
Write-Host "[4/4] Starting Employee Dashboard Frontend..."
Start-Process -FilePath "node.exe" -ArgumentList "`"$XyzFrontendDir\node_modules\vite\bin\vite.js`" --port 3000" -WorkingDirectory "$XyzFrontendDir" -NoNewWindow

Write-Host "=================================================="
Write-Host "All services started!"
Write-Host "AuraHR: http://localhost:5173"
Write-Host "Dashboard: http://localhost:3000"
Write-Host "=================================================="

Start-Sleep -Seconds 5
Start-Process "http://localhost:5173"
Start-Process "http://localhost:3000"
