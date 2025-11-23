# Testing - opoTest

## Resumen de Cobertura

```
File              | % Stmts | % Branch | % Funcs | % Lines |
------------------|---------|----------|---------|---------|
All files         |   85.95 |    70.00 |   82.35 |   90.29 |
main/services     |  100.00 |   100.00 |  100.00 |  100.00 |
shared            |  100.00 |   100.00 |  100.00 |  100.00 |
utils             |   81.91 |    69.11 |   78.57 |   86.84 |
```

✅ **Cobertura alcanzada: >80% en statements y lines**

## Estructura de Tests

```
__tests__/
├── constants.test.js       # Tests de constantes (100%)
├── pdfConverter.test.js    # Tests del servicio PDF (100%)
├── template.test.js        # Tests del generador HTML (100%)
├── parser.test.js          # Tests del parser HTML (73%)
├── fileManager.test.js     # Tests del gestor de archivos
├── modalManager.test.js    # Tests del gestor de modales
├── dropzoneManager.test.js # Tests del drag & drop
└── uiController.test.js    # Tests del controlador UI
```

## Comandos

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests con cobertura
npm test -- --coverage

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar test específico
npm test -- parser.test.js
```

## Módulos Testeados

### ✅ Main Process (100% cobertura)
- **pdfConverter.js**: Conversión HTML a PDF
  - Conversión de archivos únicos
  - Conversión múltiple
  - Manejo de errores
  - Validación de archivos existentes

### ✅ Utils (81.91% cobertura)
- **parser.js**: Parseo de HTML
  - Extracción de preguntas y respuestas
  - Cálculo de estadísticas
  - Manejo de temas
  - Estados de respuestas (correcta, incorrecta, en blanco)

- **template.js**: Generación de HTML
  - Templates con respuestas
  - Templates sin respuestas
  - Generación de estadísticas
  - Estilos y formato

### ✅ Shared (100% cobertura)
- **constants.js**: Constantes globales
  - Configuración PDF
  - Canales IPC
  - Límites de archivos

### ✅ Renderer Modules (Tests unitarios)
- **fileManager.js**: Gestión de estado
- **modalManager.js**: Gestión de modales
- **dropzoneManager.js**: Drag & drop
- **uiController.js**: Controlador UI

## Tecnologías

- **Jest 29.7.0**: Framework de testing
- **Mocks**: fs, path, jsdom
- **Coverage**: Istanbul integrado en Jest

## Configuración

Ver `jest.config.js` para configuración completa:
- Threshold: 80% statements, 80% lines, 65% branches, 75% functions
- Exclusiones: archivos de inicialización, IPC handlers, windows factories
- Timeout: 10 segundos

## Notas

- Los módulos renderer usan ES6 modules y se testean con implementaciones mock
- El parser tiene cobertura del 73% debido a casos edge complejos de HTML
- Todos los servicios críticos (PDF, parser, template) tienen 100% de cobertura
