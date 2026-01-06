# Documentación: Estructura y Etiquetas del PDF

## Descripción General

El sistema convierte archivos HTML de tests de oposiciones a formato PDF. El proceso consta de tres fases principales:

1. **Parseo** (`parser.js`): Extrae datos del HTML original
2. **Generación** (`template.js`): Crea HTML limpio y formateado
3. **Conversión** (`pdfConverter.js`): Convierte el HTML a PDF

---

## 1. Parseo del HTML Original

### Etiquetas Buscadas

#### 1.1 Tema del Examen
```javascript
Selector: '.ExamQuestion-metainfo-left'
Contenido: Texto del tema/materia del examen
```

#### 1.2 Bloques de Preguntas
```javascript
Selector: '[data-testid="question"]'
Descripción: Cada bloque representa una pregunta completa
```

#### 1.3 Título de la Pregunta
```javascript
Selector: '.ExamQuestion-title-text span'
Contenido: Enunciado de la pregunta
Fallback: "Pregunta {índice + 1}"
```

#### 1.4 Respuestas
```javascript
Selector: '.ExamQuestion-main ul li label'
Descripción: Cada label contiene una opción de respuesta
```

**Componentes de cada respuesta:**
- **Texto**: `.ExamQuestion-question-label span`
- **Estado** (determinado por iconos SVG):
  - `svg.Icon-answerResolutionWrong` → `status: 'wrong'` (respuesta incorrecta seleccionada)
  - `svg.Icon-answerResolutionAllRight` → `status: 'correct-selected'` (respuesta correcta seleccionada)
  - `svg.Icon-answerResolutionRight` → `status: 'correct'` (respuesta correcta no seleccionada)
  - Sin icono → `status: 'normal'` (respuesta sin marcar)

#### 1.5 Justificación/Explicación
```javascript
Selector: '.ExamQuestion-reason-content'
Contenido: HTML con la explicación de la respuesta correcta
Nota: Se valida que no esté vacío (sin contenido real)
```

#### 1.6 Estadísticas
```javascript
Selector: '.p-examStats-summary-results-wrapper'
Descripción: Contenedores de estadísticas (puede haber 2)
```

**Notas extraídas:**
- **Primer wrapper**: `.p-examStats-summary-results-wrapper-container-mark opo-text` → Nota principal
- **Segundo wrapper**: `.p-examStats-summary-results-wrapper-container-mark opo-text` → Nota equivalente

---

## 2. Estructura de Datos Parseada

```javascript
{
  questions: [
    {
      title: "Enunciado de la pregunta",
      answers: [
        { text: "Opción a", status: "normal" },
        { text: "Opción b", status: "correct-selected" },
        { text: "Opción c", status: "correct" },
        { text: "Opción d", status: "wrong" }
      ],
      reason: "<p>Explicación HTML...</p>"
    }
  ],
  stats: {
    nota: "7.5",
    notaEquivalente: "8.0",
    acertadas: 15,
    falladas: 3,
    enBlanco: 2,
    pctAcertadas: 75,
    pctFalladas: 15,
    pctEnBlanco: 10
  },
  theme: "Tema 1: Constitución Española"
}
```

---

## 3. Generación del HTML para PDF

### 3.1 Versión CON Respuestas (`withAnswers: true`)

#### Componentes del HTML generado:

**Cabecera:**
```html
<div class="pdf-title">{título del documento}</div>
<div class="pdf-theme">{tema del examen}</div>
```

**Pregunta:**
```html
<div class="question">
  <div class="title">{número}. {enunciado}</div>
  <ul class="answers">
    <li class="answer [highlight|wrong-answer]">
      <span class="answer-letter">{a-d})</span>
      <span class="answer-content">{texto}</span>
      <span class="answer-icon [wrong|correct|correct-selected]">{✗|✓|✓✓}</span>
    </li>
  </ul>
  <div class="reason">{explicación HTML}</div>
</div>
```

**Clases CSS aplicadas según estado:**
- `status: 'wrong'` → clase `wrong-answer`, icono `✗` rojo
- `status: 'correct'` → clase `highlight`, icono `✓` verde, texto en negrita
- `status: 'correct-selected'` → clase `highlight`, icono `✓✓` azul, texto en negrita
- `status: 'normal'` → sin clase especial, sin icono

**Tabla de Estadísticas:**
```html
<div class="question" style="border: 2px solid #000;">
  <div class="title">Resumen de Resultados</div>
  <table>
    <tr><td>Nota</td><td>{nota}</td></tr>
    <tr><td>Nota equivalente</td><td>{notaEquivalente}</td></tr>
    <tr><td>Acertadas</td><td>{acertadas} ({pctAcertadas}%)</td></tr>
    <tr><td>Falladas</td><td>{falladas} ({pctFalladas}%)</td></tr>
    <tr><td>En blanco</td><td>{enBlanco} ({pctEnBlanco}%)</td></tr>
  </table>
</div>
```

### 3.2 Versión SIN Respuestas (`withAnswers: false`)

**Diferencias:**
- No se muestran iconos de estado (✗, ✓)
- No se aplican clases de resaltado
- No se incluyen justificaciones
- La tabla de estadísticas aparece vacía (para rellenar manualmente)

```html
<li class="answer">
  <span class="answer-letter">{a-d})</span>
  {texto sin formato}
</li>
```

---

## 4. Estilos CSS Aplicados

### Colores de Estado
- **Correcto**: `#28a745` (verde)
- **Incorrecto**: `#dc3545` (rojo)
- **Seleccionado**: `#007bff` (azul)
- **Justificación**: `#ffc107` (amarillo/naranja)

### Características de Diseño
- **Fuente**: Arial, sans-serif
- **Tamaño título pregunta**: 14px
- **Tamaño respuesta**: 12px
- **Bordes**: Redondeados (5px) para preguntas
- **Borde izquierdo**: 4px para respuestas destacadas
- **page-break-inside**: avoid (evita cortar preguntas entre páginas)

---

## 5. Flujo de Conversión a PDF

```
HTML Original
    ↓
[parseHtml()] → Extrae datos estructurados
    ↓
[generateHtml()] → Genera HTML limpio
    ↓
[loadURL()] → Carga en ventana invisible de Electron
    ↓
[printToPDF()] → Convierte a PDF con configuración
    ↓
[writeFileSync()] → Guarda archivo PDF
```

### Configuración PDF
Definida en `PDF_CONFIG` (constants.js):
- Formato de página
- Márgenes
- Orientación
- Escala

---

## 6. Resumen de Selectores Críticos

| Componente | Selector | Propósito |
|------------|----------|-----------|
| Tema | `.ExamQuestion-metainfo-left` | Identificar materia del examen |
| Pregunta | `[data-testid="question"]` | Bloque completo de pregunta |
| Enunciado | `.ExamQuestion-title-text span` | Texto de la pregunta |
| Respuestas | `.ExamQuestion-main ul li label` | Opciones de respuesta |
| Texto respuesta | `.ExamQuestion-question-label span` | Contenido de cada opción |
| Respuesta incorrecta | `svg.Icon-answerResolutionWrong` | Marca respuesta errónea |
| Respuesta correcta | `svg.Icon-answerResolutionRight` | Marca respuesta correcta |
| Respuesta acertada | `svg.Icon-answerResolutionAllRight` | Marca respuesta correcta seleccionada |
| Justificación | `.ExamQuestion-reason-content` | Explicación de la respuesta |
| Estadísticas | `.p-examStats-summary-results-wrapper` | Contenedor de notas |
| Nota | `.p-examStats-summary-results-wrapper-container-mark opo-text` | Valor de la nota |

---

## 7. Casos Especiales

### Preguntas sin responder
- No tienen iconos SVG
- Se cuentan como "en blanco" en estadísticas
- No se aplica resaltado en el PDF

### Justificaciones con HTML complejo
- Se preservan tablas, párrafos y saltos de línea
- Se aplican estilos específicos para tablas dentro de justificaciones
- Se valida que no estén vacías (solo etiquetas sin contenido)

### Archivos duplicados
- El sistema verifica si el PDF ya existe antes de generarlo
- Lanza error si el archivo destino ya existe
