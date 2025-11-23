# Integración con SonarQube

## Requisitos

1. **SonarQube Server** (local o remoto)
2. **SonarScanner CLI** instalado

## Instalación de SonarScanner

### Windows
```bash
choco install sonarscanner
```

### macOS
```bash
brew install sonar-scanner
```

### Linux
Descargar desde: https://docs.sonarqube.org/latest/analysis/scan/sonarscanner/

## Configuración

1. Copia el archivo de ejemplo:
```bash
cp .sonarqube.env.example .sonarqube.env
```

2. Edita `.sonarqube.env` con tus credenciales:
```
SONAR_HOST_URL=http://localhost:9000
SONAR_TOKEN=tu_token_generado_en_sonarqube
```

3. Genera un token en SonarQube:
   - Accede a tu servidor SonarQube
   - Ve a: Usuario → My Account → Security → Generate Token

## Uso

### Windows
```bash
npm run sonar:win
```

### Unix/Linux/macOS
```bash
npm run sonar
```

## Configuración del Proyecto

El archivo `sonar-project.properties` contiene:
- **projectKey**: Identificador único del proyecto
- **sources**: Directorio del código fuente (`src/`)
- **exclusions**: Archivos/carpetas excluidos del análisis

## Métricas Analizadas

- **Bugs**: Errores de código
- **Vulnerabilidades**: Problemas de seguridad
- **Code Smells**: Problemas de mantenibilidad
- **Cobertura**: Cobertura de tests (si se configura)
- **Duplicación**: Código duplicado

## Integración CI/CD

Agrega el análisis en tu pipeline:

```yaml
# Ejemplo GitHub Actions
- name: SonarQube Scan
  env:
    SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
    SONAR_HOST_URL: ${{ secrets.SONAR_HOST_URL }}
  run: npm run sonar
```

## Notas

- El directorio `.scannerwork/` se genera automáticamente y está en `.gitignore`
- No commitees el archivo `.sonarqube.env` (contiene credenciales)
