Write-Host "========================================"
Write-Host "PopCat Game Starter for Windows" -ForegroundColor Cyan
Write-Host "========================================"
Write-Host ""

# Check if MongoDB is installed and running
$mongoService = Get-Service -Name "MongoDB" -ErrorAction SilentlyContinue
if ($mongoService) {
    Write-Host "MongoDB service found!" -ForegroundColor Green
    if ($mongoService.Status -ne 'Running') {
        Write-Host "Starting MongoDB..." -ForegroundColor Yellow
        Start-Service MongoDB
    }
    Write-Host "MongoDB is running." -ForegroundColor Green
} else {
    Write-Host "MongoDB not installed. Using mock server instead..." -ForegroundColor Yellow
    Write-Host ""
}

# Start Backend Server
Write-Host "Starting Backend Server..." -ForegroundColor Cyan
if ($mongoService) {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; bun run dev"
} else {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; bun run src/mock-server.ts"
}
Start-Sleep -Seconds 3

# Start Frontend Server
Write-Host "Starting Frontend Server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Servers are starting!" -ForegroundColor Green
Write-Host "Backend: http://localhost:3001" -ForegroundColor White
Write-Host "Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Opening game in browser..." -ForegroundColor Cyan
Start-Sleep -Seconds 2
Start-Process "http://localhost:3000"