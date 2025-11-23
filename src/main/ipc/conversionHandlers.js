/**
 * Handlers IPC para conversión de archivos
 */

const { ipcMain } = require('electron');
const { IPC_CHANNELS } = require('../../shared/constants');

/**
 * Registra handlers de conversión
 * @param {PDFConverter} pdfConverter
 */
function registerConversionHandlers(pdfConverter) {
  ipcMain.handle(IPC_CHANNELS.CONVERT_MULTIPLE, async (event, filesData, outputFolder) => {
    return await pdfConverter.convertMultiple(filesData, outputFolder);
  });
}

module.exports = { registerConversionHandlers };
