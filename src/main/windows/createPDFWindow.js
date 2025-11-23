/**
 * Factory para crear ventana PDF oculta
 */

const { BrowserWindow } = require('electron');

/**
 * Crea ventana oculta para generación de PDFs
 * @returns {BrowserWindow}
 */
function createPDFWindow() {
  return new BrowserWindow({ show: false });
}

module.exports = { createPDFWindow };
