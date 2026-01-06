/**
 * Parser de archivos HTML de tests
 * Extrae preguntas, respuestas, estadísticas y temas de archivos HTML
 */

const fs = require('fs');
const { parseHtmlString } = require('./htmlParser');

/**
 * Parsea un archivo HTML y extrae su contenido estructurado
 * @param {string} htmlPath - Ruta del archivo HTML a parsear
 * @returns {{questions: Array, stats: Object, theme: string}} Datos extraídos del HTML
 */
function parseHtml(htmlPath) {
  const html = fs.readFileSync(htmlPath, 'utf-8');
  const normalized = parseHtmlString(html);
  
  // Convierte estructura normalizada al formato legacy esperado
  const questions = normalized.questions.map(q => ({
    title: q.title,
    answers: q.answers.map(a => ({ text: a.text, status: a.status })),
    reason: q.explanationHtml || ''
  }));
  
  const stats = {
    nota: normalized.exam.score || 'N/A',
    notaEquivalente: normalized.exam.scoreOverText || 'N/A',
    acertadas: normalized.exam.summaryCounts.correct || 0,
    falladas: normalized.exam.summaryCounts.wrong || 0,
    enBlanco: normalized.exam.summaryCounts.blank || 0,
    pctAcertadas: calcPct(normalized.exam.summaryCounts.correct, questions.length),
    pctFalladas: calcPct(normalized.exam.summaryCounts.wrong, questions.length),
    pctEnBlanco: calcPct(normalized.exam.summaryCounts.blank, questions.length)
  };
  
  return { questions, stats, theme: normalized.exam.topic || '' };
}

function calcPct(val, total) {
  return total > 0 ? Math.round((val / total) * 100) : 0;
}



module.exports = { parseHtml };
