# Anshin Sweets - Auto Backup Script
# Usage: npm run backup
#        npm run backup -- "your commit message"
#        powershell -File scripts/backup.ps1 "your commit message"

param(
    [string]$Message = ""
)

$ErrorActionPreference = "Stop"

# Navigate to project root
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptDir
Set-Location $projectRoot

# Generate commit message
if (-not $Message) {
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
    $Message = "backup: auto-save $timestamp"
}

Write-Host ""
Write-Host "=== Anshin Sweets Backup ===" -ForegroundColor Cyan
Write-Host ""

# Check for changes
$status = git status --porcelain
if (-not $status) {
    Write-Host "No changes to backup." -ForegroundColor Yellow
    exit 0
}

# Show what will be committed
$fileCount = ($status | Measure-Object).Count
Write-Host "Files to backup: $fileCount" -ForegroundColor Green
Write-Host ""

# Stage all changes
git add -A
if ($LASTEXITCODE -ne 0) { Write-Host "ERROR: git add failed" -ForegroundColor Red; exit 1 }

# Commit
git commit -m $Message
if ($LASTEXITCODE -ne 0) { Write-Host "ERROR: git commit failed" -ForegroundColor Red; exit 1 }

# Push
Write-Host ""
Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
git push
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: git push failed. Trying with --set-upstream..." -ForegroundColor Yellow
    $branch = git branch --show-current
    git push --set-upstream origin $branch
    if ($LASTEXITCODE -ne 0) { Write-Host "ERROR: push failed" -ForegroundColor Red; exit 1 }
}

Write-Host ""
Write-Host "Backup complete!" -ForegroundColor Green
$hash = git log -1 --format="%h"
Write-Host "Commit: $hash - $Message" -ForegroundColor Gray
Write-Host ""
