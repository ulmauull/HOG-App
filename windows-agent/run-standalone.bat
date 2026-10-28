@echo off
title HOG Windows Session Agent — Standalone Testing Mode
echo =====================================================================
echo  Home Of Gamers (HOG) — Windows Agent (Testing Mode)
echo  Operating independently from Cyberindo Billing
echo =====================================================================
echo.
cd /d "%~dp0HogAgent"
dotnet run -c Release
pause
