/**
 * Proceso principal de Electron
 * Orquesta la inicialización de la aplicación
 */

const { app } = require('electron');
const { createMainWindow } = require('./windows/createMainWindow');
const { createPDFWindow } = require('./windows/createPDFWindow');
const { PDFConverter } = require('./services/pdfConverter');
const { registerDialogHandlers } = require('./ipc/dialogHandlers');
const { registerConversionHandlers } = require('./ipc/conversionHandlers');

let mainWindow;
let pdfWindow;
let pdfConverter;

/**
 * Inicializa la aplicación
 */
app.whenReady().then(() => {
  mainWindow = createMainWindow();
  pdfWindow = createPDFWindow();
  pdfConverter = new PDFConverter(pdfWindow);

  registerDialogHandlers(mainWindow);
  registerConversionHandlers(pdfConverter);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
  if (pdfWindow) pdfWindow.destroy();
});
