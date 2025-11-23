/**
 * Parser de archivos HTML de tests
 * Extrae preguntas, respuestas, estadísticas y temas de archivos HTML
 */

const fs = require('fs');
const { JSDOM } = require('jsdom');

/**
 * Parsea un archivo HTML y extrae su contenido estructurado
 * @param {string} htmlPath - Ruta del archivo HTML a parsear
 * @returns {{questions: Array, stats: Object, theme: string}} Datos extraídos del HTML
 */
function parseHtml(htmlPath) {
  const html = fs.readFileSync(htmlPath, 'utf-8');
  const dom = new JSDOM(html);
  const doc = dom.window.document;

  // Extrae el tema del examen
  const themeEl = doc.querySelector('.ExamQuestion-metainfo-left');
  const theme = themeEl ? themeEl.textContent.trim() : '';

  const questions = [];
  const questionBlocks = doc.querySelectorAll('[data-testid="question"]');

  // Procesa cada bloque de pregunta
  questionBlocks.forEach((block, index) => {
    const titleEl = block.querySelector('.ExamQuestion-title-text span');
    const title = titleEl ? titleEl.textContent.trim() : `Pregunta ${index + 1}`;

    const answers = [];
    const answerEls = block.querySelectorAll('.ExamQuestion-main ul li label');
    
    // Extrae cada respuesta y su estado (correcta, incorrecta, seleccionada)
    answerEls.forEach(label => {
      const textEl = label.querySelector('.ExamQuestion-question-label span');
      const text = textEl ? textEl.textContent.trim() : '';
      
      // Determina el estado de la respuesta según los iconos SVG
      const wrongSvg = label.querySelector('svg.Icon-answerResolutionWrong');
      const rightSvg = label.querySelector('svg.Icon-answerResolutionRight');
      const allRightSvg = label.querySelector('svg.Icon-answerResolutionAllRight');
      
      let status = 'normal';
      if (wrongSvg) status = 'wrong';
      else if (allRightSvg) status = 'correct-selected';
      else if (rightSvg) status = 'correct';
      
      answers.push({ text, status });
    });

    // Extrae la justificación/explicación de la respuesta
    const reasonEl = block.querySelector('.ExamQuestion-reason-content');
    let reason = reasonEl ? reasonEl.innerHTML.trim() : '';
    if (reason && reason.replace(/<[^>]*>/g, '').trim() === '') reason = '';

    questions.push({ title, answers, reason });
  });

  const stats = extractStats(doc, questions);

  return { questions, stats, theme };
}

/**
 * Extrae estadísticas del examen
 * @param {Document} doc - Documento DOM
 * @param {Array} questions - Array de preguntas parseadas
 * @returns {Object} Estadísticas del examen
 */
function extractStats(doc, questions) {
  // Extrae notas del HTML
  const wrappers = doc.querySelectorAll('.p-examStats-summary-results-wrapper');
  let nota = 'N/A';
  let notaEquivalente = 'N/A';
  
  if (wrappers.length > 0) {
    const notaEl = wrappers[0].querySelector('.p-examStats-summary-results-wrapper-container-mark opo-text');
    if (notaEl) nota = notaEl.textContent.trim();
  }
  if (wrappers.length > 1) {
    const notaEqEl = wrappers[1].querySelector('.p-examStats-summary-results-wrapper-container-mark opo-text');
    if (notaEqEl) notaEquivalente = notaEqEl.textContent.trim();
  }

  // Calcula estadísticas de respuestas
  let acertadas = 0;
  let falladas = 0;
  let enBlanco = 0;

  questions.forEach(q => {
    const hasCorrectSelected = q.answers.some(a => a.status === 'correct-selected');
    const hasWrong = q.answers.some(a => a.status === 'wrong');
    
    if (hasCorrectSelected) acertadas++;
    else if (hasWrong) falladas++;
    else enBlanco++;
  });

  // Calcula porcentajes
  const total = questions.length;
  const pctAcertadas = total > 0 ? Math.round((acertadas / total) * 100) : 0;
  const pctFalladas = total > 0 ? Math.round((falladas / total) * 100) : 0;
  const pctEnBlanco = total > 0 ? Math.round((enBlanco / total) * 100) : 0;

  return {
    nota,
    notaEquivalente,
    acertadas,
    falladas,
    enBlanco,
    pctAcertadas,
    pctFalladas,
    pctEnBlanco
  };
}

module.exports = { parseHtml };
