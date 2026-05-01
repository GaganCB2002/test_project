$ProjectDir = "D:\full_Stack_project\Recruitment & Hiring"
$BackendDir = "$ProjectDir\backend"
$FrontendDir = "$ProjectDir\frontend"

Write-Host "Starting AuraHR Services (Direct Mode to bypass & issue)..."

# Start Backend
# node node_modules\tsx\dist\cli.mjs watch src/server.ts
Start-Process -FilePath "node.exe" -ArgumentList "`"$BackendDir\node_modules\tsx\dist\cli.mjs`" watch src/server.ts" -WorkingDirectory "$BackendDir" -NoNewWindow

# Start Frontend
# node node_modules\vite\bin\vite.js
Start-Process -FilePath "node.exe" -ArgumentList "`"$FrontendDir\node_modules\vite\bin\vite.js`"" -WorkingDirectory "$FrontendDir" -NoNewWindow

Write-Host "Services started."
