/**
 * Script preload de Electron
 * Expone APIs seguras al proceso renderer mediante contextBridge
 */

const { contextBridge, ipcRenderer } = require('electron');

/**
 * API expuesta al renderer para comunicación IPC segura
 * @namespace window.api
 */
contextBridge.exposeInMainWorld('api', {
  /** @returns {Promise<string>} Ruta de carpeta seleccionada */
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  
  /** @returns {Promise<string[]>} Rutas de archivos seleccionados */
  selectFiles: () => ipcRenderer.invoke('select-files'),
  
  /**
   * @param {Array} filesData - Datos de archivos a convertir
   * @param {string} folder - Carpeta de destino
   * @returns {Promise<{success: number, failed: number, errors: string[]}>}
   */
  convertMultiple: (filesData, folder) => ipcRenderer.invoke('convert-multiple', filesData, folder),
  
  /** @param {string} message - Mensaje de error */
  showError: (message) => ipcRenderer.invoke('show-error', message),
  
  /** @param {string} message - Mensaje de éxito */
  showSuccess: (message) => ipcRenderer.invoke('show-success', message)
});
