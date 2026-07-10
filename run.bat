@echo off
echo Starting PluseTask services...

:: client
:: cd frontend
:: start cmd /k npm run dev
:: cd ..

:: Backend
cd server
start cmd /k php artisan serve
start cmd /k php artisan schedule:work
start cmd /k php artisan queue:listen
start cmd /k php artisan reverb:start
cd ..

echo All services started!
pause