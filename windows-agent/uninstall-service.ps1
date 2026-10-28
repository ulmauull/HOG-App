# ==============================================================================
# HOME OF GAMERS (HOG) — Windows Agent Service Uninstaller
# Run as Administrator in PowerShell
# ==============================================================================

param(
    [string]$ServiceName = "HogSessionAgent"
)

Write-Host ">>> Uninstalling HOG Windows Agent ($ServiceName)..." -ForegroundColor Yellow

if (-not ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Error "Please run this script as Administrator!"
    exit 1
}

if (Get-Service -Name $ServiceName -ErrorAction SilentlyContinue) {
    Write-Host "Stopping service..." -ForegroundColor Yellow
    Stop-Service -Name $ServiceName -Force -ErrorAction SilentlyContinue
    Write-Host "Removing service..." -ForegroundColor Yellow
    sc.exe delete $ServiceName
    Write-Host ">>> Service $ServiceName removed successfully." -ForegroundColor Green
} else {
    Write-Host "Service $ServiceName is not installed." -ForegroundColor Gray
}
