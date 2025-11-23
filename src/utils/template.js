/**
 * Generador de plantillas HTML para PDFs
 * Crea HTML formateado para tests con o sin respuestas
 */

/**
 * Genera HTML formateado para conversión a PDF
 * @param {Object|Array} data - Datos del test (objeto con questions/stats o array de preguntas)
 * @param {string} title - Título del documento
 * @param {boolean} withAnswers - Si debe incluir respuestas y estadísticas
 * @returns {string} HTML completo formateado
 */
function generateHtml(data, title = '', withAnswers = true) {
  const questions = data.questions || data;
  const stats = data.stats || null;
  const theme = data.theme || '';
  
  // Genera versión sin respuestas si se solicita
  if (!withAnswers) {
    return generateBlankHtml(questions, title, theme);
  }
  
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .pdf-title { font-size: 18px; font-weight: bold; text-align: center; margin-bottom: 5px; }
    .pdf-theme { font-size: 14px; text-align: center; color: #666; margin-bottom: 25px; padding-bottom: 15px; border-bottom: 3px solid #333; }
    .question { page-break-inside: avoid; margin-bottom: 15px; border: 1px solid #ddd; padding: 10px; border-radius: 5px; }
    .title { font-size: 14px; font-weight: bold; margin-bottom: 8px; color: #333; }
    .answers { list-style: none; padding: 0; }
    .answer { padding: 6px; margin: 3px 0; background: #f9f9f9; font-size: 12px; }
    .answer-letter { font-weight: bold; margin-right: 8px; }
    .answer-content { display: inline; }
    .answer-icon { margin-left: 4px; font-weight: bold; }
    .answer-icon.wrong { color: #dc3545; }
    .answer-icon.correct { color: #28a745; }
    .answer-icon.correct-selected { color: #007bff; }
    .answer.highlight { border-left: 4px solid #28a745; }
    .answer.wrong-answer { border-left: 4px solid #dc3545; }
    .reason { margin-top: 8px; padding: 6px; border-left: 4px solid #ffc107; font-size: 12px; }
    .reason table { border-collapse: collapse; width: 100%; margin: 5px 0; font-size: 11px; }
    .reason td, .reason th { border: 1px solid #ddd; padding: 4px; text-align: left; }
    .reason p { margin: 5px 0; }
    .reason br { display: block; margin: 3px 0; content: ''; }
  </style>
</head>
<body>
${title ? `<div class="pdf-title">${title}</div>` : ''}
${theme ? `<div class="pdf-theme">${theme}</div>` : ''}
${questions.map((q, i) => `
  <div class="question">
    <div class="title">${i + 1}. ${q.title}</div>
    <ul class="answers">
      ${q.answers.map((a, idx) => {
        const letter = String.fromCharCode(97 + idx);
        let icon = '';
        let className = '';
        let textStyle = '';
        if (a.status === 'wrong') { icon = '<span class="answer-icon wrong">✗</span>'; className = ' wrong-answer'; }
        else if (a.status === 'correct') { icon = '<span class="answer-icon correct">✓</span>'; className = ' highlight'; textStyle = ' style="font-weight: bold;"'; }
        else if (a.status === 'correct-selected') { icon = '<span class="answer-icon correct-selected">✓✓</span>'; className = ' highlight'; textStyle = ' style="font-weight: bold;"'; }
        return `<li class="answer${className}"><span class="answer-letter">${letter})</span><span class="answer-content"${textStyle}>${a.text}${icon}</span></li>`;
      }).join('')}
    </ul>
    ${q.reason && q.reason.trim() !== '' ? `<div class="reason">${q.reason}</div>` : ''}
  </div>
`).join('')}
${stats ? generateStatsHtml(stats) : ''}
</body>
</html>`;
}

/**
 * Genera HTML sin respuestas marcadas (versión en blanco para practicar)
 * @param {Array} questions - Array de preguntas
 * @param {string} title - Título del documento
 * @param {string} theme - Tema del examen
 * @returns {string} HTML sin respuestas marcadas
 */
function generateBlankHtml(questions, title = '', theme = '') {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .pdf-title { font-size: 18px; font-weight: bold; text-align: center; margin-bottom: 5px; }
    .pdf-theme { font-size: 14px; text-align: center; color: #666; margin-bottom: 25px; padding-bottom: 15px; border-bottom: 3px solid #333; }
    .question { page-break-inside: avoid; margin-bottom: 15px; border: 1px solid #ddd; padding: 10px; border-radius: 5px; }
    .title { font-size: 14px; font-weight: bold; margin-bottom: 8px; color: #333; }
    .answers { list-style: none; padding: 0; }
    .answer { padding: 6px; margin: 3px 0; background: #f9f9f9; font-size: 12px; }
    .answer-letter { font-weight: bold; margin-right: 8px; }
  </style>
</head>
<body>
${title ? `<div class="pdf-title">${title}</div>` : ''}
${theme ? `<div class="pdf-theme">${theme}</div>` : ''}
${questions.map((q, i) => `
  <div class="question">
    <div class="title">${i + 1}. ${q.title}</div>
    <ul class="answers">
      ${q.answers.map((a, idx) => {
        const letter = String.fromCharCode(97 + idx);
        return `<li class="answer"><span class="answer-letter">${letter})</span>${a.text}</li>`;
      }).join('')}
    </ul>
  </div>
`).join('')}
<div class="question" style="border: 2px solid #000;">
  <div class="title">Resumen de Resultados</div>
  <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
    <tr>
      <td style="padding: 6px; border: 1px solid #000; font-weight: bold;">Nota</td>
      <td style="padding: 6px; border: 1px solid #000;"></td>
    </tr>
    <tr>
      <td style="padding: 6px; border: 1px solid #000; font-weight: bold;">Nota equivalente</td>
      <td style="padding: 6px; border: 1px solid #000;"></td>
    </tr>
    <tr>
      <td style="padding: 6px; border: 1px solid #000; font-weight: bold;">Acertadas</td>
      <td style="padding: 6px; border: 1px solid #000;"></td>
    </tr>
    <tr>
      <td style="padding: 6px; border: 1px solid #000; font-weight: bold;">Falladas</td>
      <td style="padding: 6px; border: 1px solid #000;"></td>
    </tr>
    <tr>
      <td style="padding: 6px; border: 1px solid #000; font-weight: bold;">En blanco</td>
      <td style="padding: 6px; border: 1px solid #000;"></td>
    </tr>
  </table>
</div>
</body>
</html>`;
}

/**
 * Genera HTML para la tabla de estadísticas
 * @param {Object} stats - Objeto con estadísticas del examen
 * @returns {string} HTML de la tabla de estadísticas
 */
function generateStatsHtml(stats) {
  return `
  <div class="question" style="border: 2px solid #000;">
    <div class="title">Resumen de Resultados</div>
    <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
      <tr>
        <td style="padding: 6px; border: 1px solid #000; font-weight: bold;">Nota</td>
        <td style="padding: 6px; border: 1px solid #000;">${stats.nota}</td>
      </tr>
      <tr>
        <td style="padding: 6px; border: 1px solid #000; font-weight: bold;">Nota equivalente</td>
        <td style="padding: 6px; border: 1px solid #000;">${stats.notaEquivalente}</td>
      </tr>
      <tr>
        <td style="padding: 6px; border: 1px solid #000; font-weight: bold; color: #28a745;">Acertadas</td>
        <td style="padding: 6px; border: 1px solid #000;">${stats.acertadas} (${stats.pctAcertadas}%)</td>
      </tr>
      <tr>
        <td style="padding: 6px; border: 1px solid #000; font-weight: bold; color: #dc3545;">Falladas</td>
        <td style="padding: 6px; border: 1px solid #000;">${stats.falladas} (${stats.pctFalladas}%)</td>
      </tr>
      <tr>
        <td style="padding: 6px; border: 1px solid #000; font-weight: bold; color: #6c757d;">En blanco</td>
        <td style="padding: 6px; border: 1px solid #000;">${stats.enBlanco} (${stats.pctEnBlanco}%)</td>
      </tr>
    </table>
  </div>
  `;
}

module.exports = { generateHtml };
