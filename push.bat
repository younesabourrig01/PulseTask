@echo off

if "%~1"=="" (
    echo Usage: push "Commit message"
    exit /b 1
)

git add .
git commit -m %*

if errorlevel 1 exit /b 1

git push