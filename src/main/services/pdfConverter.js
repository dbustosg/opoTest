/**
 * Servicio de conversión de HTML a PDF
 */

const fs = require('fs');
const path = require('path');
const { parseHtml } = require('../../utils/parser');
const { generateHtml } = require('../../utils/template');
const { PDF_CONFIG } = require('../../shared/constants');

class PDFConverter {
  constructor(pdfWindow) {
    this.pdfWindow = pdfWindow;
  }

  /**
   * Convierte múltiples archivos HTML a PDF
   * @param {Array} filesData - Datos de archivos a convertir
   * @param {string} outputFolder - Carpeta de destino
   * @returns {Promise<{success: number, failed: number, errors: string[]}>}
   */
  async convertMultiple(filesData, outputFolder) {
    let success = 0;
    let failed = 0;
    const errors = [];

    for (const { path: htmlPath, title, withAnswers } of filesData) {
      try {
        await this.convertSingle(htmlPath, title, withAnswers, outputFolder);
        success++;
      } catch (error) {
        errors.push(`Error en "${title}": ${error.message}`);
        failed++;
      }
    }

    return { success, failed, errors };
  }

  /**
   * Convierte un archivo HTML a PDF
   * @param {string} htmlPath - Ruta del archivo HTML
   * @param {string} title - Título del documento
   * @param {boolean} withAnswers - Incluir respuestas
   * @param {string} outputFolder - Carpeta de destino
   */
  async convertSingle(htmlPath, title, withAnswers, outputFolder) {
    const fileName = title + '.pdf';
    const pdfPath = path.join(outputFolder, fileName);

    if (fs.existsSync(pdfPath)) {
      throw new Error(`Ya existe: "${fileName}"`);
    }

    const data = parseHtml(htmlPath);
    const cleanHtml = generateHtml(data, title, withAnswers);
    
    await this.pdfWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(cleanHtml)}`);
    const pdfData = await this.pdfWindow.webContents.printToPDF(PDF_CONFIG);
    fs.writeFileSync(pdfPath, pdfData);
  }
}

module.exports = { PDFConverter };
