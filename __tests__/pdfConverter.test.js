jest.mock('fs');
jest.mock('path');
jest.mock('../src/utils/parser');
jest.mock('../src/utils/template');

const fs = require('fs');
const path = require('path');
const { PDFConverter } = require('../src/main/services/pdfConverter');
const { parseHtml } = require('../src/utils/parser');
const { generateHtml } = require('../src/utils/template');

describe('PDFConverter', () => {
  let pdfConverter;
  let mockPdfWindow;

  beforeEach(() => {
    mockPdfWindow = {
      loadURL: jest.fn().mockResolvedValue(),
      webContents: {
        printToPDF: jest.fn().mockResolvedValue(Buffer.from('pdf-data'))
      }
    };
    pdfConverter = new PDFConverter(mockPdfWindow);
    
    parseHtml.mockReturnValue({
      questions: [{ title: 'Q', answers: [], reason: '' }],
      stats: {},
      theme: ''
    });
    generateHtml.mockReturnValue('<html></html>');
    fs.existsSync.mockReturnValue(false);
    fs.writeFileSync.mockImplementation(() => {});
    path.join.mockImplementation((a, b) => `${a}/${b}`);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('convierte archivo único correctamente', async () => {
    await pdfConverter.convertSingle('/input/test.html', 'Test', true, '/output');
    
    expect(parseHtml).toHaveBeenCalledWith('/input/test.html');
    expect(generateHtml).toHaveBeenCalled();
    expect(mockPdfWindow.loadURL).toHaveBeenCalled();
    expect(mockPdfWindow.webContents.printToPDF).toHaveBeenCalled();
    expect(fs.writeFileSync).toHaveBeenCalled();
  });

  test('lanza error si archivo ya existe', async () => {
    fs.existsSync.mockReturnValue(true);
    
    await expect(
      pdfConverter.convertSingle('/input/test.html', 'Test', true, '/output')
    ).rejects.toThrow('Ya existe');
  });

  test('convierte múltiples archivos', async () => {
    const filesData = [
      { path: '/test1.html', title: 'Test1', withAnswers: true },
      { path: '/test2.html', title: 'Test2', withAnswers: false }
    ];
    
    const result = await pdfConverter.convertMultiple(filesData, '/output');
    
    expect(result.success).toBe(2);
    expect(result.failed).toBe(0);
  });

  test('maneja errores en conversión múltiple', async () => {
    const filesData = [
      { path: '/test1.html', title: 'Test1', withAnswers: true },
      { path: '/test2.html', title: 'Test2', withAnswers: false }
    ];
    
    fs.existsSync
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);
    
    const result = await pdfConverter.convertMultiple(filesData, '/output');
    
    expect(result.success).toBe(1);
    expect(result.failed).toBe(1);
    expect(result.errors.length).toBe(1);
  });

  test('pasa parámetros correctos a generateHtml', async () => {
    const mockData = { questions: [], stats: {}, theme: 'Theme' };
    parseHtml.mockReturnValue(mockData);
    
    await pdfConverter.convertSingle('/test.html', 'Title', false, '/output');
    
    expect(generateHtml).toHaveBeenCalledWith(mockData, 'Title', false);
  });

  test('codifica HTML para loadURL', async () => {
    generateHtml.mockReturnValue('<html>Test</html>');
    
    await pdfConverter.convertSingle('/test.html', 'Test', true, '/output');
    
    expect(mockPdfWindow.loadURL).toHaveBeenCalled();
    const callArg = mockPdfWindow.loadURL.mock.calls[0][0];
    expect(callArg).toContain('data:text/html');
  });
});
