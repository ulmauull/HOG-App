# ==============================================================================
# HOME OF GAMERS (HOG) — Windows Agent Service Installer
# Run as Administrator in PowerShell
# ==============================================================================

param(
    [string]$ServiceName = "HogSessionAgent",
    [string]$BinaryPath = "$PSScriptRoot\HogAgent\bin\Release\net8.0\win-x64\publish\HogAgent.exe",
    [string]$PcCode = "PC-01"
)

Write-Host ">>> Installing HOG Windows Agent for $PcCode..." -ForegroundColor Cyan

if (-not ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Error "Please run this script as Administrator!"
    exit 1
}

# Verify binary exists, or build it
if (-not (Test-Path $BinaryPath)) {
    Write-Host "Binary not found at $BinaryPath. Publishing .NET project..." -ForegroundColor Yellow
    dotnet publish "$PSScriptRoot\HogAgent\HogAgent.csproj" -c Release -r win-x64 --self-contained false -o "$PSScriptRoot\publish"
    $BinaryPath = "$PSScriptRoot\publish\HogAgent.exe"
}

# Stop and remove existing service if present
if (Get-Service -Name $ServiceName -ErrorAction SilentlyContinue) {
    Write-Host "Stopping existing service $ServiceName..." -ForegroundColor Yellow
    Stop-Service -Name $ServiceName -Force -ErrorAction SilentlyContinue
    sc.exe delete $ServiceName
    Start-Sleep -Seconds 2
}

# Create Windows Service set to start automatically on Windows boot
Write-Host "Registering Windows Service $ServiceName..." -ForegroundColor Green
New-Service -Name $ServiceName `
            -BinaryPathName "`"$BinaryPath`"" `
            -DisplayName "Home Of Gamers (HOG) Session Agent" `
            -Description "Authoritative session countdown and connectivity reporting agent for HOG gaming PCs. Operates independently from Cyberindo Billing." `
            -StartupType Automatic

# Configure Recovery: Restart service on failure
sc.exe failure $ServiceName reset= 86400 actions= restart/5000/restart/10000/restart/60000

# Start Service
Write-Host "Starting $ServiceName..." -ForegroundColor Green
Start-Service -Name $ServiceName

Write-Host ">>> Service $ServiceName successfully installed and running!" -ForegroundColor Cyan
Get-Service -Name $ServiceName
