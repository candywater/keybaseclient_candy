
for %%I in ("%~dp0..\..") do set "CLIENT_DIR=%%~fI"
if not DEFINED GOPATH set GOPATH=C:\work

if exist "C:\Program Files (x86)\Microsoft Visual Studio 14.0\Common7\Tools\vsvars32.bat" (
  call "C:\Program Files (x86)\Microsoft Visual Studio 14.0\Common7\Tools\vsvars32.bat"
) else if exist "C:\Program Files\Microsoft Visual Studio\2022\Community\Common7\Tools\VsDevCmd.bat" (
  call "C:\Program Files\Microsoft Visual Studio\2022\Community\Common7\Tools\VsDevCmd.bat"
) else (
  echo Warning: could not find VS2015 vsvars32.bat or VS2022 VsDevCmd.bat.
)
set MINGW_DIR=%USERPROFILE%\scoop\apps\mingw\current
set PATH=%MINGW_DIR%\bin;%PATH%
set CC=%MINGW_DIR%\bin\gcc
set CPATH=%MINGW_DIR%\include
set KEYBASE_WINBUILD=0

set DevCert=1

cd /d %CLIENT_DIR%\packaging\windows
call .\build_prerelease.cmd
IF %ERRORLEVEL% NEQ 0 (
  EXIT /B 1
)
cd /d %CLIENT_DIR%\packaging\windows
call .\buildui.cmd
IF %ERRORLEVEL% NEQ 0 (
  EXIT /B 1
)
cd /d %CLIENT_DIR%\packaging\windows
call .\doinstaller_wix.cmd debug
IF %ERRORLEVEL% NEQ 0 (
  EXIT /B 1
)

cd /d %CLIENT_DIR%\packaging\windows\WIXInstallers\KeybaseApps\bin\Debug
echo Success: here is your .msi file

