:: Build keybase.exe with prerelease options

for %%I in ("%~dp0..\..") do set "CLIENT_DIR=%%~fI"

echo GOPATH %GOPATH%

:: check os/exec path fix is in place
pushd %CLIENT_DIR%\packaging\windows
go run osexeccheck.go 
IF %ERRORLEVEL% NEQ 0 (
  EXIT /B 1
)
popd

:: CGO causes dll loading security vulnerabilities
set CGO_ENABLED=0
go env
pushd %CLIENT_DIR%\go\keybase
:: Make sure the whole build fails if we can't build keybase
del keybase.exe
go version
go generate
winresource.exe -kbfsicon=../../media/icons/windows/keybase-root-icon.ico

if DEFINED BUILD_NUMBER set KEYBASE_WINBUILD=%BUILD_NUMBER%

for /f %%i in ('winresource.exe -cv') do set KEYBASE_VERSION=%%i
echo KEYBASE_VERSION %KEYBASE_VERSION%
for /f %%i in ('winresource.exe -cb') do set KEYBASE_BUILD=%%i
echo KEYBASE_BUILD %KEYBASE_BUILD%
go build -a -tags "prerelease production" -ldflags="-X github.com/keybase/client/go/libkb.PrereleaseBuild=%KEYBASE_BUILD% -s -w"
popd

:: Then build kbfsdokan.
pushd %CLIENT_DIR%\go\kbfs\kbfsdokan
:: Make sure the whole build fails if we can't build kbfsdokan
del kbfsdokan.exe

set CGO_ENABLED=1
go build -a -tags "prerelease production" -ldflags="-X github.com/keybase/client/go/kbfs/libkbfs.PrereleaseBuild=%KEYBASE_BUILD% -s -w"
IF %ERRORLEVEL% NEQ 0 (
  EXIT /B 1
)
popd

:: git-remote-keybase
pushd %CLIENT_DIR%\go\kbfs\kbfsgit\git-remote-keybase
del get-remote-keybase.exe
go build -a
IF %ERRORLEVEL% NEQ 0 (
  EXIT /B 1
)
popd

:: Updater
pushd %CLIENT_DIR%\go\updater\service
del upd.exe
go build -a -o upd.exe
IF %ERRORLEVEL% NEQ 0 (
  EXIT /B 1
)
popd

:: Browser Extension
pushd %CLIENT_DIR%\go\kbnm
del kbnm.exe
if "%KBNM_BUILD%" == "" (
    set KBNM_BUILD=%KEYBASE_BUILD%
)
echo KBNM_BUILD %KBNM_BUILD%
go build -a -ldflags="-X main.Version=%KBNM_BUILD%"
IF %ERRORLEVEL% NEQ 0 (
  EXIT /B 1
)
popd

:: keybaserq
pushd %CLIENT_DIR%\go\tools\runquiet
del keybaserq.exe
..\..\keybase\winresource.exe  -d "Keybase quiet start utility" -n "keybaserq.exe" -i ../../../media/icons/Keybase.ico
go build -ldflags "-H windowsgui" -o keybaserq.exe
