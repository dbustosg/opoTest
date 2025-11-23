# Casos de Uso - opoTest

Análisis completo de todos los casos de uso del conversor HTML a PDF.

---

## 📁 1. CARGAR ARCHIVOS HTML

### CU-01: Arrastrar y soltar archivos (Drag & Drop)

**Actor:** Usuario  
**Precondición:** Aplicación abierta  

**Flujo principal:**
1. Usuario arrastra hasta 10 archivos HTML sobre zona de drop (con/sin respuestas)
2. Sistema valida que sean archivos `.html`
3. Sistema filtra máximo 10 archivos
4. Para cada archivo, sistema solicita título mediante modal
5. Usuario ingresa título único
6. Sistema valida que el título no exista en esa zona
7. Sistema almacena archivo con su configuración
8. Sistema actualiza UI mostrando archivos cargados
9. Sistema habilita botones "Convertir" y "Limpiar"

**Flujos alternativos:**
- **3a:** Si no son archivos HTML → Muestra mensaje "Solo archivos HTML"
- **5a:** Usuario cancela modal → Archivo no se añade
- **6a:** Título duplicado → Muestra alerta de error y no añade archivo

**Postcondición:** Archivos listos para conversión  
**Módulos:** `DropzoneManager`, `ModalManager`, `FileManager`, `UIController`

---

### CU-02: Seleccionar archivos manualmente

**Actor:** Usuario  
**Precondición:** Aplicación abierta  

**Flujo principal:**
1. Usuario hace clic en botón "Selecciona archivo/s"
2. Sistema abre diálogo nativo de selección de archivos (filtro `.html`)
3. Usuario selecciona hasta 10 archivos HTML
4. Sistema procesa archivos igual que CU-01 (pasos 4-9)

**Flujos alternativos:**
- **3a:** Usuario cancela diálogo → No se añaden archivos

**Postcondición:** Archivos listos para conversión  
**Módulos:** `DropzoneManager`, `dialogHandlers`, `ModalManager`, `FileManager`

---

## 🏷️ 2. GESTIONAR TÍTULOS

### CU-03: Asignar título a archivo

**Actor:** Usuario  
**Precondición:** Archivo HTML seleccionado  

**Flujo principal:**
1. Sistema muestra modal con nombre del archivo
2. Usuario escribe título personalizado
3. Usuario presiona "Aceptar" o tecla Enter
4. Sistema valida que el título no esté vacío
5. Sistema valida que el título no exista en esa zona
6. Sistema asocia título al archivo
7. Sistema cierra modal

**Flujos alternativos:**
- **3a:** Usuario presiona "Cancelar" → Archivo no se añade
- **4a:** Título vacío → No cierra modal, espera entrada válida
- **5a:** Título duplicado → Muestra alerta de error, archivo no se añade

**Postcondición:** Archivo tiene título único  
**Módulos:** `ModalManager`, `FileManager`

---

## 📄 3. CONVERTIR A PDF

### CU-04: Convertir archivos a PDF

**Actor:** Usuario  
**Precondición:** Al menos 1 archivo cargado  

**Flujo principal:**
1. Usuario hace clic en botón "Convertir a PDF"
2. Sistema abre diálogo de selección de carpeta destino
3. Usuario selecciona carpeta
4. Sistema muestra spinner de carga
5. Sistema deshabilita botones
6. Para cada archivo:
   - 6.1. Verifica que no exista PDF con mismo nombre
   - 6.2. Lee y parsea HTML (extrae preguntas, respuestas, estadísticas, tema)
   - 6.3. Genera HTML limpio según configuración (con/sin respuestas)
   - 6.4. Carga HTML en ventana PDF oculta
   - 6.5. Ejecuta `printToPDF` con configuración A4
   - 6.6. Guarda PDF en carpeta destino
7. Sistema oculta spinner
8. Sistema muestra modal de éxito con cantidad de archivos convertidos
9. Sistema limpia todas las zonas
10. Sistema deshabilita botones

**Flujos alternativos:**
- **3a:** Usuario cancela selección → Cancela conversión
- **6.1a:** PDF ya existe → Registra error, continúa con siguiente
- **6.2-6.6a:** Error en conversión → Registra error, continúa con siguiente
- **8a:** Si hay errores → Muestra modal con lista de errores

**Postcondición:** PDFs generados en carpeta destino  
**Módulos:** `UIController`, `dialogHandlers`, `conversionHandlers`, `PDFConverter`, `parser`, `template`

---

### CU-05: Convertir con respuestas (Zona 1)

**Actor:** Usuario  
**Precondición:** Archivos en zona "Test con respuestas"  

**Flujo principal:**
1. Sigue flujo CU-04
2. En paso 6.3, sistema genera HTML con:
   - Respuestas marcadas (correctas ✓, incorrectas ✗)
   - Respuestas correctas resaltadas en verde
   - Respuestas incorrectas resaltadas en rojo
   - Justificaciones/explicaciones
   - Tabla de estadísticas (nota, acertadas, falladas, en blanco)

**Postcondición:** PDF con respuestas y estadísticas  
**Módulos:** `template.generateHtml()`, `parser.parseHtml()`

---

### CU-06: Convertir sin respuestas (Zona 2)

**Actor:** Usuario  
**Precondición:** Archivos en zona "Test sin respuestas"  

**Flujo principal:**
1. Sigue flujo CU-04
2. En paso 6.3, sistema genera HTML con:
   - Solo preguntas y opciones sin marcar
   - Sin indicadores de respuestas correctas/incorrectas
   - Sin justificaciones
   - Tabla de estadísticas vacía para rellenar manualmente

**Postcondición:** PDF limpio para practicar  
**Módulos:** `template.generateBlankHtml()`

---

## 🧹 4. LIMPIAR DATOS

### CU-07: Limpiar todas las zonas

**Actor:** Usuario  
**Precondición:** Al menos 1 archivo cargado  

**Flujo principal:**
1. Usuario hace clic en botón "Limpiar"
2. Sistema elimina todos los archivos de ambas zonas
3. Sistema resetea UI de ambas zonas (texto inicial, sin archivos)
4. Sistema limpia mensajes de estado
5. Sistema deshabilita botones "Convertir" y "Limpiar"

**Postcondición:** Aplicación en estado inicial  
**Módulos:** `UIController`, `FileManager`, `DropzoneManager`

---

## ✅ 5. VALIDACIONES Y ERRORES

### CU-08: Validar límite de archivos

**Actor:** Sistema  
**Precondición:** Usuario intenta cargar archivos  

**Flujo principal:**
1. Sistema recibe lista de archivos
2. Sistema aplica `.slice(0, 10)` para limitar a 10 archivos
3. Sistema procesa solo los primeros 10

**Postcondición:** Máximo 10 archivos por zona  
**Módulos:** `DropzoneManager`

---

### CU-09: Validar extensión de archivo

**Actor:** Sistema  
**Precondición:** Usuario arrastra archivos  

**Flujo principal:**
1. Sistema filtra archivos con `.filter(f => f.name.endsWith('.html'))`
2. Si no hay archivos HTML válidos, muestra "Solo archivos HTML"

**Postcondición:** Solo archivos HTML aceptados  
**Módulos:** `DropzoneManager`

---

### CU-10: Validar PDF existente

**Actor:** Sistema  
**Precondición:** Conversión en proceso  

**Flujo principal:**
1. Sistema verifica si existe PDF con mismo nombre en carpeta destino
2. Si existe, lanza error: `Ya existe: "nombre.pdf"`
3. Registra error y continúa con siguiente archivo

**Postcondición:** No sobrescribe PDFs existentes  
**Módulos:** `PDFConverter`

---

### CU-11: Manejar errores de conversión

**Actor:** Sistema  
**Precondición:** Error durante conversión  

**Flujo principal:**
1. Sistema captura error en try-catch
2. Sistema registra error con título del archivo
3. Sistema incrementa contador de fallidos
4. Sistema continúa con siguiente archivo
5. Al finalizar, muestra modal con lista de errores

**Postcondición:** Usuario informado de errores específicos  
**Módulos:** `PDFConverter`, `UIController`, `ModalManager`

---

## 🔧 6. PARSEO Y GENERACIÓN

### CU-12: Parsear HTML de test

**Actor:** Sistema  
**Precondición:** Archivo HTML válido  

**Flujo principal:**
1. Sistema lee archivo HTML con `fs.readFileSync`
2. Sistema crea DOM con jsdom
3. Sistema extrae:
   - Tema del examen (`.ExamQuestion-metainfo-left`)
   - Preguntas (`[data-testid="question"]`)
   - Respuestas con estado (normal, correct, wrong, correct-selected)
   - Justificaciones (`.ExamQuestion-reason-content`)
   - Estadísticas (notas, acertadas, falladas, en blanco)
4. Sistema calcula porcentajes
5. Sistema retorna objeto estructurado

**Postcondición:** Datos estructurados para generación  
**Módulos:** `parser.parseHtml()`

---

### CU-13: Generar HTML para PDF

**Actor:** Sistema  
**Precondición:** Datos parseados disponibles  

**Flujo principal:**
1. Sistema recibe datos, título y flag `withAnswers`
2. Si `withAnswers=true` → Genera HTML completo con respuestas
3. Si `withAnswers=false` → Genera HTML limpio sin respuestas
4. Sistema aplica estilos CSS inline
5. Sistema codifica HTML para data URI
6. Sistema retorna HTML completo

**Postcondición:** HTML listo para printToPDF  
**Módulos:** `template.generateHtml()`, `template.generateBlankHtml()`

---

## 💬 7. INTERFAZ Y FEEDBACK

### CU-14: Mostrar estado de carga

**Actor:** Sistema  
**Precondición:** Conversión iniciada  

**Flujo principal:**
1. Sistema muestra spinner de carga
2. Sistema deshabilita botones
3. Al finalizar, oculta spinner
4. Sistema habilita botones según estado

**Postcondición:** Usuario informado del progreso  
**Módulos:** `UIController`

---

### CU-15: Mostrar alertas de resultado

**Actor:** Sistema  
**Precondición:** Conversión finalizada  

**Flujo principal:**
1. Sistema determina tipo de alerta (success/error)
2. Sistema configura icono (✓ verde / ✗ rojo)
3. Sistema muestra modal con título y mensaje
4. Usuario hace clic en "Aceptar"
5. Sistema cierra modal

**Postcondición:** Usuario informado del resultado  
**Módulos:** `ModalManager`

---

### CU-16: Actualizar contador de archivos

**Actor:** Sistema  
**Precondición:** Archivos añadidos a zona  

**Flujo principal:**
1. Sistema cuenta archivos en zona
2. Sistema actualiza mensaje: "X archivo(s) listo(s)"
3. Sistema muestra lista numerada de archivos con títulos

**Postcondición:** Usuario ve archivos cargados  
**Módulos:** `DropzoneManager`

---

## 🔄 8. COMUNICACIÓN IPC

### CU-17: Comunicación Renderer → Main

**Actor:** Sistema  
**Precondición:** Operación requiere proceso principal  

**Flujo principal:**
1. Renderer invoca `window.api.{método}()`
2. Preload intercepta con contextBridge
3. Preload envía IPC a Main con `ipcRenderer.invoke()`
4. Main procesa con handler registrado
5. Main retorna resultado
6. Preload retorna a Renderer

**Postcondición:** Comunicación segura entre procesos  
**Módulos:** `preload/index.js`, `ipc/handlers`

---

## 📊 RESUMEN DE CASOS DE USO

| ID | Caso de Uso | Actor | Complejidad |
|----|-------------|-------|-------------|
| CU-01 | Arrastrar y soltar archivos | Usuario | Media |
| CU-02 | Seleccionar archivos manualmente | Usuario | Baja |
| CU-03 | Asignar título a archivo | Usuario | Baja |
| CU-04 | Convertir archivos a PDF | Usuario | Alta |
| CU-05 | Convertir con respuestas | Usuario | Alta |
| CU-06 | Convertir sin respuestas | Usuario | Alta |
| CU-07 | Limpiar todas las zonas | Usuario | Baja |
| CU-08 | Validar límite de archivos | Sistema | Baja |
| CU-09 | Validar extensión de archivo | Sistema | Baja |
| CU-10 | Validar PDF existente | Sistema | Media |
| CU-11 | Manejar errores de conversión | Sistema | Media |
| CU-12 | Parsear HTML de test | Sistema | Alta |
| CU-13 | Generar HTML para PDF | Sistema | Alta |
| CU-14 | Mostrar estado de carga | Sistema | Baja |
| CU-15 | Mostrar alertas de resultado | Sistema | Baja |
| CU-16 | Actualizar contador de archivos | Sistema | Baja |
| CU-17 | Comunicación IPC | Sistema | Media |

---

## 🎯 FLUJO COMPLETO TÍPICO

```
1. Usuario arrastra 3 archivos HTML a Zona 1 (con respuestas)
   ↓
2. Sistema solicita título para cada uno
   ↓
3. Usuario ingresa: "Test 1", "Test 2", "Test 3"
   ↓
4. Sistema muestra "3 archivo(s) listo(s)"
   ↓
5. Usuario arrastra 2 archivos HTML a Zona 2 (sin respuestas)
   ↓
6. Sistema solicita títulos
   ↓
7. Usuario ingresa: "Práctica 1", "Práctica 2"
   ↓
8. Sistema habilita botones "Convertir" y "Limpiar"
   ↓
9. Usuario hace clic en "Convertir a PDF"
   ↓
10. Sistema abre diálogo de carpeta
    ↓
11. Usuario selecciona carpeta destino
    ↓
12. Sistema muestra spinner de carga
    ↓
13. Sistema convierte 5 archivos:
    - 3 con respuestas marcadas y estadísticas
    - 2 sin respuestas (versión práctica)
    ↓
14. Sistema muestra "✓ 5 archivo(s) convertido(s) correctamente"
    ↓
15. Sistema limpia zonas automáticamente
    ↓
16. Aplicación vuelve a estado inicial
```

---

## 🔍 MATRIZ DE TRAZABILIDAD

| Caso de Uso | Módulo Principal | Dependencias |
|-------------|------------------|--------------|
| CU-01, CU-02 | DropzoneManager | FileManager, ModalManager |
| CU-03 | ModalManager | FileManager |
| CU-04, CU-05, CU-06 | PDFConverter | parser, template, dialogHandlers |
| CU-07 | UIController | FileManager, DropzoneManager |
| CU-08, CU-09 | DropzoneManager | - |
| CU-10, CU-11 | PDFConverter | - |
| CU-12 | parser | jsdom, fs |
| CU-13 | template | - |
| CU-14, CU-15, CU-16 | UIController / ModalManager | - |
| CU-17 | preload | ipcRenderer, contextBridge |

---

## 📝 NOTAS TÉCNICAS

### Límites del Sistema
- **Máximo 10 archivos** por zona (20 total)
- **Solo archivos .html** aceptados
- **Títulos únicos** por zona (pueden repetirse entre zonas)
- **No sobrescribe PDFs** existentes

### Configuración PDF
- **Tamaño:** A4
- **Márgenes:** Top/Bottom 0.2, Left/Right 0
- **Background:** Impreso
- **Formato:** Electron printToPDF

### Canales IPC
- `select-folder`: Seleccionar carpeta destino
- `select-files`: Seleccionar archivos HTML
- `convert-multiple`: Convertir múltiples archivos
- `show-error`: Mostrar error
- `show-success`: Mostrar éxito

---

**Última actualización:** 2024  
**Versión:** 1.0  
**Cobertura de tests:** >85% statements, >90% lines
