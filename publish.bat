@echo off
setlocal
cd /d "%~dp0"

git rev-parse --show-toplevel >nul 2>&1
if errorlevel 1 goto not_repo

for /f "delims=" %%B in ('git branch --show-current') do set "BRANCH=%%B"
if not "%BRANCH%"=="main" goto wrong_branch

git remote get-url origin >nul 2>&1
if errorlevel 1 goto no_remote

git add -A
if errorlevel 1 goto failed

git diff --cached --quiet
if errorlevel 1 goto commit_changes
goto push_changes

:commit_changes
git commit -m "Publish blog update"
if errorlevel 1 goto failed

:push_changes
git push -u origin main
if errorlevel 1 goto failed

echo.
echo Upload succeeded. Check the Actions page for deployment status.
start "" "https://github.com/Ranzint/CLPS-SonsOfLiberty/actions"
goto done

:not_repo
echo ERROR: This folder is not a Git repository.
goto failed

:wrong_branch
echo ERROR: Switch to the main branch before publishing.
goto failed

:no_remote
echo ERROR: The origin remote is not configured.
goto failed

:failed
echo.
echo Publishing stopped. Review the message above; no force push was attempted.

:done
echo.
pause
