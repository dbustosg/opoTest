# opoTest - Conversor HTML a PDF

App de escritorio para convertir tests HTML a PDF con interfaz drag & drop.

## Características

- Drag & drop de hasta 10 archivos HTML
- Conversión a PDF con Electron printToPDF
- Opción de incluir/excluir respuestas
- Interfaz minimal y rápida

## Requisitos

- Node.js 18+

## Instalación

```bash
npm install
```

## Uso

```bash
npm start
```

## Build

```bash
npm run build:win    # Windows
npm run build:mac    # macOS
npm run build:linux  # Linux
```

## Testing

```bash
npm test              # Ejecutar tests
npm run test:coverage # Tests con cobertura
npm run test:watch    # Tests en modo watch
```

**Cobertura actual: >85% statements, >90% lines**

Ver [TESTING.md](TESTING.md) para más detalles.

---

## Arquitectura

### Estructura del Proyecto

```
opoTest/
├── src/
│   ├── main/                           # Proceso Principal (Node.js)
│   │   ├── index.js                    # Orquestador principal
│   │   ├── windows/                    # Factories de ventanas
│   │   │   ├── createMainWindow.js     # Ventana principal
│   │   │   └── createPDFWindow.js      # Ventana PDF oculta
│   │   ├── ipc/                        # Handlers IPC
│   │   │   ├── dialogHandlers.js       # Diálogos nativos
│   │   │   └── conversionHandlers.js   # Conversión de archivos
│   │   └── services/                   # Servicios de negocio
│   │       └── pdfConverter.js         # Lógica de conversión PDF
│   │
│   ├── renderer/                       # Proceso Renderer (UI)
│   │   ├── index.html                  # Vista principal
│   │   ├── styles.css                  # Estilos
│   │   ├── app.js                      # Inicializador/Orquestador
│   │   └── modules/                    # Módulos UI
│   │       ├── fileManager.js          # Gestión de estado de archivos
│   │       ├── modalManager.js         # Gestión de modales
│   │       ├── dropzoneManager.js      # Drag & drop
│   │       └── uiController.js         # Controlador principal UI
│   │
│   ├── preload/                        # Scripts Preload
│   │   └── index.js                    # Bridge IPC seguro
│   │
│   ├── utils/                          # Utilidades compartidas
│   │   ├── parser.js                   # Parser HTML
│   │   └── template.js                 # Generador de templates
│   │
│   └── shared/                         # Código compartido
│       └── constants.js                # Constantes globales
```

### Patrones de Diseño

#### 1. Separación de Responsabilidades (SRP)
Cada módulo tiene una única responsabilidad:
- **FileManager**: Estado de archivos
- **ModalManager**: Gestión de modales
- **DropzoneManager**: Drag & drop
- **UIController**: Coordinación de UI
- **PDFConverter**: Conversión de archivos

#### 2. Factory Pattern
- `createMainWindow()`: Crea ventana principal
- `createPDFWindow()`: Crea ventana PDF

#### 3. Service Pattern
- `PDFConverter`: Servicio de conversión encapsulado
- Inyección de dependencias (pdfWindow)

#### 4. Module Pattern (ES6)
- Módulos independientes con exports
- Importaciones explícitas
- Encapsulación de funcionalidad

#### 5. Dependency Injection
```javascript
const dropzoneManager = new DropzoneManager(elements, fileManager, modalManager);
const uiController = new UIController(elements, fileManager, modalManager, dropzoneManager);
```

### Flujo de Datos

#### Main Process
```
index.js → windows/ → services/ → ipc/
```

#### Renderer Process
```
app.js → modules/ → window.api (IPC)
```

#### Comunicación IPC
```
Renderer → preload → Main → Services → Response
```

### Flujo de Conversión

```
1. Usuario arrastra archivos
         ↓
2. DropzoneManager captura evento
         ↓
3. ModalManager solicita título
         ↓
4. FileManager almacena datos
         ↓
5. UIController actualiza UI
         ↓
6. Usuario hace clic en "Convertir"
         ↓
7. UIController → window.api.convertMultiple()
         ↓
8. Preload → IPC → conversionHandlers
         ↓
9. PDFConverter.convertMultiple()
         ├─► parser.js (parsea HTML)
         ├─► template.js (genera HTML limpio)
         └─► pdfWindow.printToPDF()
         ↓
10. Retorna resultado → Renderer
         ↓
11. ModalManager muestra resultado
```

### Responsabilidades por Módulo

#### Main Process

| Módulo | Responsabilidad |
|--------|----------------|
| `index.js` | Inicialización y orquestación |
| `createMainWindow` | Crear ventana principal |
| `createPDFWindow` | Crear ventana PDF oculta |
| `dialogHandlers` | Gestionar diálogos nativos |
| `conversionHandlers` | Gestionar conversión IPC |
| `PDFConverter` | Lógica de conversión PDF |

#### Renderer Process

| Módulo | Responsabilidad |
|--------|----------------|
| `app.js` | Inicialización de módulos UI |
| `FileManager` | Estado de archivos |
| `ModalManager` | Gestión de modales |
| `DropzoneManager` | Drag & drop de archivos |
| `UIController` | Coordinación de UI |

#### Shared

| Módulo | Responsabilidad |
|--------|----------------|
| `constants.js` | Constantes compartidas |
| `parser.js` | Parseo de HTML |
| `template.js` | Generación de templates |

### Ventajas de esta Arquitectura

✅ **Mantenibilidad**: Código organizado y fácil de localizar  
✅ **Testabilidad**: Módulos independientes fáciles de testear  
✅ **Escalabilidad**: Fácil añadir nuevas funcionalidades  
✅ **Reutilización**: Módulos reutilizables  
✅ **Separación de Concerns**: UI separada de lógica de negocio  
✅ **Type Safety**: Preparado para TypeScript si se necesita

## Tecnologías

- **Electron 28**: Framework de escritorio
- **jsdom**: Manipulación de HTML
- **ES6 Modules**: En renderer process
- **CommonJS**: En main process

## Licencia

ISC
