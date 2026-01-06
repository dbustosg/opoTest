/**
 * Parser unificado de HTML para formatos legacy y new
 */

const { JSDOM } = require('jsdom');
const iconv = require('iconv-lite');

/**
 * Fixes common encoding/escaping artifacts in HTML strings.
 *
 * Handles:
 * - Unicode escapes: \u00bf, \u00e9, etc.
 * - Hex byte escapes: \'bf, \'e9 and \xBF, \xE9
 * - HTML numeric entities: &#191; &#x00bf;
 * - Optional mojibake fix: "Ã¡" -> "á" (latin1->utf8)
 */
function fixEncoding(html) {
  if (html == null) return html;

  let fixed = String(html);

  // 0) Remove BOM (Byte Order Mark) and RTF artifacts
  fixed = fixed.replace(/\\u65279/g, ''); // BOM as escape sequence
  fixed = fixed.replace(/\uFEFF/g, '');   // BOM as actual character
  fixed = fixed.replace(/\\uc0/g, '');    // RTF control word

  // 1) Decode Unicode escapes: \uXXXX  (do NOT remove them)
  fixed = fixed.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) =>
    String.fromCharCode(parseInt(hex, 16))
  );

  // 2) Decode common hex-byte escapes:
  //    a) \'bf style (your observed case)
  //    b) \xBF style (standard)
  // We decode single bytes as ISO-8859-1 / Windows-1252 compatible.
  fixed = fixed.replace(/\\'(?:x)?([0-9a-fA-F]{2})/g, (_, hex) => {
    const byte = parseInt(hex, 16);
    return iconv.decode(Buffer.from([byte]), "latin1"); // latin1 == iso-8859-1 in Node
  });

  fixed = fixed.replace(/\\x([0-9a-fA-F]{2})/g, (_, hex) => {
    const byte = parseInt(hex, 16);
    return iconv.decode(Buffer.from([byte]), "latin1");
  });

  // 3) Decode standard HTML numeric entities
  fixed = fixed.replace(/&#(\d+);/g, (_, dec) =>
    String.fromCharCode(parseInt(dec, 10))
  );
  fixed = fixed.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
    String.fromCharCode(parseInt(hex, 16))
  );

  // 4) Optional: fix mojibake where UTF-8 bytes were mis-decoded as latin1
  // Typical symptom: presence of "Ã" or "Â" sequences.
  if (/[ÃÂ]/.test(fixed)) {
    const candidate = Buffer.from(fixed, "latin1").toString("utf8");
    // Heuristic: use candidate if it reduces the mojibake markers
    const score = (s) => (s.match(/[ÃÂ]/g) || []).length;
    if (score(candidate) < score(fixed)) fixed = candidate;
  }

  return fixed;
}

function detectFormat(doc) {
  const hasNew = doc.querySelector('div[data-testid^="results-question-"]') ||
                 doc.querySelector('span[data-testid="question-text"]') ||
                 doc.querySelector('div[data-testid^="answer-option-"]');
  
  if (hasNew) return 'new';
  
  const hasLegacy = doc.querySelector('.ExamQuestion-title-text') ||
                    doc.querySelector('.ExamQuestion-main') ||
                    doc.querySelector('[data-testid="question"]');
  
  return hasLegacy ? 'legacy' : 'new';
}

function parseLegacy(doc) {
  const themeEl = doc.querySelector('.ExamQuestion-metainfo-left');
  const topic = themeEl ? themeEl.textContent.trim() : null;

  const wrappers = doc.querySelectorAll('.p-examStats-summary-results-wrapper');
  let score = null, scoreOverText = null;
  
  if (wrappers.length > 0) {
    const scoreEl = wrappers[0].querySelector('.p-examStats-summary-results-wrapper-container-mark opo-text');
    if (scoreEl) score = scoreEl.textContent.trim();
  }
  if (wrappers.length > 1) {
    const scoreEqEl = wrappers[1].querySelector('.p-examStats-summary-results-wrapper-container-mark opo-text');
    if (scoreEqEl) scoreOverText = scoreEqEl.textContent.trim();
  }

  const questions = [];
  const questionBlocks = doc.querySelectorAll('[data-testid="question"]');

  questionBlocks.forEach((block, idx) => {
    const titleEl = block.querySelector('.ExamQuestion-title-text span');
    const title = titleEl ? titleEl.textContent.trim() : `Pregunta ${idx + 1}`;

    const answers = [];
    const answerEls = block.querySelectorAll('.ExamQuestion-main ul li label');
    
    answerEls.forEach(label => {
      const textEl = label.querySelector('.ExamQuestion-question-label span');
      const text = textEl ? textEl.textContent.trim() : '';
      
      let status = 'normal';
      if (label.querySelector('svg.Icon-answerResolutionWrong')) status = 'wrong';
      else if (label.querySelector('svg.Icon-answerResolutionAllRight')) status = 'correct-selected';
      else if (label.querySelector('svg.Icon-answerResolutionRight')) status = 'correct';
      
      answers.push({ label: null, text, status });
    });

    const reasonEl = block.querySelector('.ExamQuestion-reason-content');
    let explanationHtml = null;
    if (reasonEl) {
      const html = reasonEl.innerHTML.trim();
      if (html && html.replace(/<[^>]*>/g, '').trim()) explanationHtml = html;
    }

    questions.push({ index: idx + 1, title, answers, explanationHtml });
  });

  let correct = 0, wrong = 0, blank = 0;
  questions.forEach(q => {
    if (q.answers.some(a => a.status === 'correct-selected')) correct++;
    else if (q.answers.some(a => a.status === 'wrong')) wrong++;
    else blank++;
  });

  return {
    format: 'legacy',
    exam: {
      topic,
      score,
      scoreOverText,
      summaryCounts: { correct, wrong, blank }
    },
    questions
  };
}

function parseNew(doc) {
  const topicEl = doc.querySelector('[data-testid="exam-selector-trigger"]');
  const topic = topicEl ? topicEl.textContent.trim() : null;

  let score = null, scoreOverText = null;
  const scoreTexts = Array.from(doc.querySelectorAll('span')).filter(s => 
    s.textContent.includes('sobre 10')
  );
  if (scoreTexts.length > 0) {
    const parent = scoreTexts[0].closest('div');
    if (parent) {
      const bigNum = Array.from(parent.querySelectorAll('span')).find(s => 
        /^\d+([.,]\d+)?$/.test(s.textContent.trim()) && s.textContent.trim().length <= 4
      );
      if (bigNum) score = bigNum.textContent.trim();
    }
  }

  const questions = [];
  const questionBlocks = doc.querySelectorAll('div[data-testid^="results-question-"]');

  questionBlocks.forEach((block, idx) => {
    const titleEl = block.querySelector('span[data-testid="question-text"]');
    const title = titleEl ? titleEl.textContent.trim() : `Pregunta ${idx + 1}`;

    const answers = [];
    const answerEls = block.querySelectorAll('div[data-testid^="answer-option-"]');
    
    answerEls.forEach(answerDiv => {
      const pTags = answerDiv.querySelectorAll('p');
      let label = null, text = '';
      
      if (pTags.length > 0) {
        const firstP = pTags[0].textContent.trim();
        if (/^[A-Z]$/.test(firstP)) {
          label = firstP;
          text = pTags.length > 1 ? pTags[pTags.length - 1].textContent.trim() : '';
        } else {
          text = pTags[pTags.length - 1].textContent.trim();
        }
      }

      let status = 'normal';
      const svg = answerDiv.querySelector('svg');
      if (svg) {
        const paths = svg.querySelectorAll('path');
        const pathData = Array.from(paths).map(p => p.getAttribute('d') || '').join(' ');
        const isCross = paths.length === 2 || pathData.includes('M12 4L4 12') || pathData.includes('M4 4L12 12');
        const isCheck = pathData.includes('M16.25 5L7.5 15L3.75 11.25');
        
        if (isCross) {
          status = 'wrong';
        } else if (isCheck) {
          const allDivs = answerDiv.querySelectorAll('div');
          const hasBg = Array.from(allDivs).some(d => (d.className || '').includes('bg-[#10A489]/10'));
          const hasBorder = Array.from(allDivs).some(d => {
            const cls = d.className || '';
            return cls.includes('border-dashed') && cls.includes('border-[#87D1C4]');
          });
          status = hasBg ? 'correct-selected' : (hasBorder ? 'correct' : 'correct');
        }
      }

      answers.push({ label, text, status });
    });

    let explanationHtml = null;
    const btn = block.querySelector('button[aria-controls]');
    if (btn) {
      const ctrlId = btn.getAttribute('aria-controls');
      const contentDiv = doc.getElementById(ctrlId);
      if (contentDiv) {
        const editor = contentDiv.querySelector('[data-slate-editor="true"]');
        const html = (editor || contentDiv).innerHTML.trim();
        if (html && html.replace(/<[^>]*>/g, '').trim()) explanationHtml = html;
      }
    }

    questions.push({ index: idx + 1, title, answers, explanationHtml });
  });

  let correct = 0, wrong = 0, blank = 0;
  const buttons = doc.querySelectorAll('button');
  buttons.forEach(btn => {
    const txt = btn.textContent.toLowerCase();
    const match = txt.match(/(\d+)\s*(correcta|incorrecta|en blanco)/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (txt.includes('incorrecta')) wrong = num;
      else if (txt.includes('correcta')) correct = num;
      else if (txt.includes('blanco')) blank = num;
    }
  });

  if (!correct && !wrong && !blank) {
    questions.forEach(q => {
      if (q.answers.some(a => a.status === 'correct-selected')) correct++;
      else if (q.answers.some(a => a.status === 'wrong')) wrong++;
      else blank++;
    });
  }

  return {
    format: 'new',
    exam: {
      topic,
      score,
      scoreOverText,
      summaryCounts: { correct, wrong, blank }
    },
    questions
  };
}

function parseHtmlString(htmlString) {
  const normalized = fixEncoding(htmlString);
  const dom = new JSDOM(normalized);
  const doc = dom.window.document;
  
  const format = detectFormat(doc);
  return format === 'legacy' ? parseLegacy(doc) : parseNew(doc);
}

module.exports = { parseHtmlString };
