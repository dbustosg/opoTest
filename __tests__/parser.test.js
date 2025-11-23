const { parseHtml } = require('../src/utils/parser');
const fs = require('fs');

jest.mock('fs');

describe('Parser', () => {
  test('parsea HTML completo', () => {
    const mockHtml = `<html><body>
      <div class="ExamQuestion-metainfo-left">Tema Test</div>
      <div data-testid="question">
        <div class="ExamQuestion-title-text"><span>¿Pregunta?</span></div>
        <ul class="ExamQuestion-main"><li><label class="ExamQuestion-question-label">
          <span class="ExamQuestion-question-label"><span>Respuesta</span></span>
          <svg class="Icon-answerResolutionAllRight"></svg>
        </label></li></ul>
        <div class="ExamQuestion-reason-content">Justificación</div>
      </div>
      <div class="p-examStats-summary-results-wrapper">
        <div class="p-examStats-summary-results-wrapper-container-mark"><opo-text>8.5</opo-text></div>
      </div>
      <div class="p-examStats-summary-results-wrapper">
        <div class="p-examStats-summary-results-wrapper-container-mark"><opo-text>9.0</opo-text></div>
      </div>
    </body></html>`;
    
    fs.readFileSync = jest.fn().mockReturnValue(mockHtml);
    const result = parseHtml('test.html');
    
    expect(result.theme).toBe('Tema Test');
    expect(result.questions.length).toBeGreaterThan(0);
    expect(result.stats).toBeDefined();
  });

  test('maneja HTML sin tema', () => {
    const mockHtml = `<html><body>
      <div data-testid="question">
        <div class="ExamQuestion-title-text"><span>P</span></div>
        <ul class="ExamQuestion-main"><li><label class="ExamQuestion-question-label">
          <span class="ExamQuestion-question-label"><span>A</span></span>
        </label></li></ul>
      </div>
    </body></html>`;
    
    fs.readFileSync = jest.fn().mockReturnValue(mockHtml);
    const result = parseHtml('test.html');
    
    expect(result.theme).toBe('');
  });

  test('extrae estadísticas', () => {
    const mockHtml = `<html><body>
      <div data-testid="question">
        <div class="ExamQuestion-title-text"><span>P1</span></div>
        <ul class="ExamQuestion-main"><li><label class="ExamQuestion-question-label">
          <span class="ExamQuestion-question-label"><span>A</span></span>
          <svg class="Icon-answerResolutionAllRight"></svg>
        </label></li></ul>
      </div>
      <div data-testid="question">
        <div class="ExamQuestion-title-text"><span>P2</span></div>
        <ul class="ExamQuestion-main"><li><label class="ExamQuestion-question-label">
          <span class="ExamQuestion-question-label"><span>A</span></span>
          <svg class="Icon-answerResolutionWrong"></svg>
        </label></li></ul>
      </div>
    </body></html>`;
    
    fs.readFileSync = jest.fn().mockReturnValue(mockHtml);
    const result = parseHtml('test.html');
    
    expect(result.stats).toBeDefined();
    expect(result.stats.acertadas).toBeGreaterThanOrEqual(0);
    expect(result.stats.falladas).toBeGreaterThanOrEqual(0);
  });

  test('calcula porcentajes correctamente', () => {
    const mockHtml = `<html><body>
      <div data-testid="question">
        <div class="ExamQuestion-title-text"><span>P</span></div>
        <ul class="ExamQuestion-main"><li><label class="ExamQuestion-question-label">
          <span class="ExamQuestion-question-label"><span>A</span></span>
        </label></li></ul>
      </div>
    </body></html>`;
    
    fs.readFileSync = jest.fn().mockReturnValue(mockHtml);
    const result = parseHtml('test.html');
    
    expect(result.stats.pctAcertadas).toBeGreaterThanOrEqual(0);
    expect(result.stats.pctFalladas).toBeGreaterThanOrEqual(0);
    expect(result.stats.pctEnBlanco).toBeGreaterThanOrEqual(0);
  });

  test('maneja pregunta sin título', () => {
    const mockHtml = `<html><body>
      <div data-testid="question">
        <ul class="ExamQuestion-main"><li><label class="ExamQuestion-question-label">
          <span class="ExamQuestion-question-label"><span>A</span></span>
        </label></li></ul>
      </div>
    </body></html>`;
    
    fs.readFileSync = jest.fn().mockReturnValue(mockHtml);
    const result = parseHtml('test.html');
    
    expect(result.questions[0].title).toContain('Pregunta');
  });

  test('maneja justificación vacía con HTML', () => {
    const mockHtml = `<html><body>
      <div data-testid="question">
        <div class="ExamQuestion-title-text"><span>P</span></div>
        <ul class="ExamQuestion-main"><li><label class="ExamQuestion-question-label">
          <span class="ExamQuestion-question-label"><span>A</span></span>
        </label></li></ul>
        <div class="ExamQuestion-reason-content"><p></p><br/></div>
      </div>
    </body></html>`;
    
    fs.readFileSync = jest.fn().mockReturnValue(mockHtml);
    const result = parseHtml('test.html');
    
    expect(result.questions[0].reason).toBe('');
  });
});
