@echo off
REM Script para ejecutar análisis de SonarQube en Windows

REM Cargar variables de entorno desde .sonarqube.env
if exist .sonarqube.env (
    for /f "usebackq tokens=1,* delims==" %%a in (".sonarqube.env") do (
        set "line=%%a"
        if not "!line:~0,1!"=="#" if not "%%a"=="" set "%%a=%%b"
    )
)

echo Ejecutando análisis de SonarQube...

if "%SONAR_TOKEN%"=="" (
    echo Usando modo sin autenticación
    sonar-scanner.bat -Dsonar.host.url=http://localhost:9000
) else (
    sonar-scanner.bat -Dsonar.host.url=http://localhost:9000 -Dsonar.login=%SONAR_TOKEN%
)

if %ERRORLEVEL% EQU 0 (
    echo Análisis completado exitosamente
) else (
    echo Error en el análisis de SonarQube
    exit /b 1
)
