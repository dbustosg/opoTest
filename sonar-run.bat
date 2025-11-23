@echo off
set SONAR_HOST_URL=http://localhost:9000
set SONAR_TOKEN=squ_fe15fa1126d3724d6f1c2d1ac97e060d7a566b85

echo Ejecutando análisis de SonarQube...
sonar-scanner.bat -Dsonar.host.url=%SONAR_HOST_URL% -Dsonar.login=%SONAR_TOKEN%

if %ERRORLEVEL% EQU 0 (
    echo Análisis completado exitosamente
) else (
    echo Error en el análisis de SonarQube
    exit /b 1
)
