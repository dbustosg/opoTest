const { generateHtml } = require('../src/utils/template');

describe('Template', () => {
  const mockData = {
    questions: [
      {
        title: 'Pregunta 1',
        answers: [
          { text: 'Respuesta A', status: 'correct-selected' },
          { text: 'Respuesta B', status: 'normal' }
        ],
        reason: 'Justificación'
      }
    ],
    stats: {
      nota: '8.5',
      notaEquivalente: '9.0',
      acertadas: 8,
      falladas: 1,
      enBlanco: 1,
      pctAcertadas: 80,
      pctFalladas: 10,
      pctEnBlanco: 10
    },
    theme: 'Tema de prueba'
  };

  test('genera HTML con respuestas', () => {
    const html = generateHtml(mockData, 'Test Title', true);
    
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('Test Title');
    expect(html).toContain('Tema de prueba');
    expect(html).toContain('Pregunta 1');
    expect(html).toContain('Respuesta A');
    expect(html).toContain('Justificación');
    expect(html).toContain('8.5');
    expect(html).toContain('9.0');
    expect(html).toContain('✓✓');
  });

  test('genera HTML sin respuestas', () => {
    const html = generateHtml(mockData, 'Test Title', false);
    
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('Test Title');
    expect(html).toContain('Pregunta 1');
    expect(html).toContain('Respuesta A');
    expect(html).not.toContain('Justificación');
    expect(html).not.toContain('8.5');
    expect(html).not.toContain('✓✓');
  });

  test('genera HTML sin título', () => {
    const html = generateHtml(mockData, '', true);
    
    expect(html).not.toContain('<div class="pdf-title">');
  });

  test('genera HTML sin tema', () => {
    const dataNoTheme = { ...mockData, theme: '' };
    const html = generateHtml(dataNoTheme, 'Title', true);
    
    expect(html).not.toContain('<div class="pdf-theme">');
  });

  test('maneja respuestas incorrectas', () => {
    const data = {
      questions: [{
        title: 'P',
        answers: [{ text: 'A', status: 'wrong' }],
        reason: ''
      }]
    };
    
    const html = generateHtml(data, '', true);
    
    expect(html).toContain('✗');
    expect(html).toContain('wrong-answer');
  });

  test('maneja respuestas correctas no seleccionadas', () => {
    const data = {
      questions: [{
        title: 'P',
        answers: [{ text: 'A', status: 'correct' }],
        reason: ''
      }]
    };
    
    const html = generateHtml(data, '', true);
    
    expect(html).toContain('✓');
    expect(html).toContain('highlight');
  });

  test('acepta array de preguntas directamente', () => {
    const questions = [
      {
        title: 'P',
        answers: [{ text: 'A', status: 'normal' }],
        reason: ''
      }
    ];
    
    const html = generateHtml(questions, 'Title', true);
    
    expect(html).toContain('P');
  });

  test('genera HTML sin estadísticas cuando no se proporcionan', () => {
    const dataNoStats = {
      questions: mockData.questions,
      theme: 'Tema'
    };
    
    const html = generateHtml(dataNoStats, 'Title', true);
    
    expect(html).not.toContain('Resumen de Resultados');
  });

  test('genera tabla vacía en modo sin respuestas', () => {
    const html = generateHtml(mockData, 'Title', false);
    
    expect(html).toContain('Resumen de Resultados');
    expect(html).toContain('<td style="padding: 6px; border: 1px solid #000;"></td>');
  });
});
