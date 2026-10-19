@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo === Deploy da Edge Function obra-transcrever (Supabase) ===
if not exist supabase\functions mkdir supabase\functions
if not exist supabase\functions\obra-transcrever mkdir supabase\functions\obra-transcrever
copy /y obra-transcrever\index.ts supabase\functions\obra-transcrever\index.ts >nul
call npx supabase@2 login
call npx supabase@2 link --project-ref fimmjgdwhifsrrbreche
call npx supabase@2 functions deploy obra-transcrever --no-verify-jwt --project-ref fimmjgdwhifsrrbreche
echo.
echo Concluido. Feche esta janela.
pause
