#!/bin/bash
# Script para ejecutar análisis de SonarQube en Unix/Linux/macOS

# Cargar variables de entorno desde .sonarqube.env
if [ -f .sonarqube.env ]; then
    echo "Cargando configuración desde .sonarqube.env..."
    export $(grep -v '^#' .sonarqube.env | xargs)
fi

echo "Ejecutando análisis de SonarQube..."

if [ -z "$SONAR_TOKEN" ]; then
    echo "Usando modo sin autenticación (solo para desarrollo local)"
    sonar-scanner -Dsonar.host.url=${SONAR_HOST_URL:-http://localhost:9000}
else
    sonar-scanner -Dsonar.host.url=${SONAR_HOST_URL:-http://localhost:9000} -Dsonar.login=${SONAR_TOKEN}
fi

if [ $? -eq 0 ]; then
    echo "Análisis completado exitosamente"
else
    echo "Error en el análisis de SonarQube"
    exit 1
fi
