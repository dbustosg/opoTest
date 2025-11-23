/**
 * Constantes compartidas entre procesos
 */

module.exports = {
  MAX_FILES: 10,
  ALLOWED_EXTENSION: '.html',
  PDF_CONFIG: {
    pageSize: 'A4',
    printBackground: true,
    margins: { top: 0.2, bottom: 0.2, left: 0, right: 0 }
  },
  IPC_CHANNELS: {
    SELECT_FOLDER: 'select-folder',
    SELECT_FILES: 'select-files',
    CONVERT_MULTIPLE: 'convert-multiple',
    SHOW_ERROR: 'show-error',
    SHOW_SUCCESS: 'show-success'
  }
};
