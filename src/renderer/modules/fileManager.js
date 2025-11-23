/**
 * Gestor de estado de archivos
 */

class FileManager {
  constructor() {
    this.zones = {
      1: { files: [] },
      2: { files: [] }
    };
  }

  /**
   * Añade archivo a una zona
   * @param {string} zoneId
   * @param {Object} fileData
   */
  addFile(zoneId, fileData) {
    this.zones[zoneId].files.push(fileData);
  }

  /**
   * Verifica si un título ya existe en una zona
   * @param {string} zoneId
   * @param {string} title
   * @returns {boolean}
   */
  titleExists(zoneId, title) {
    return this.zones[zoneId].files.some(f => f.title === title);
  }

  /**
   * Obtiene archivos de una zona
   * @param {string} zoneId
   * @returns {Array}
   */
  getFiles(zoneId) {
    return this.zones[zoneId].files;
  }

  /**
   * Limpia archivos de una zona
   * @param {string} zoneId
   */
  clearZone(zoneId) {
    this.zones[zoneId].files = [];
  }

  /**
   * Limpia todas las zonas
   */
  clearAll() {
    this.zones[1].files = [];
    this.zones[2].files = [];
  }

  /**
   * Verifica si hay archivos en alguna zona
   * @returns {boolean}
   */
  hasFiles() {
    return this.zones[1].files.length > 0 || this.zones[2].files.length > 0;
  }

  /**
   * Obtiene todos los archivos con configuración
   * @returns {Array}
   */
  getAllFilesWithConfig() {
    return [
      ...this.zones[1].files.map(f => ({ path: f.file.path, title: f.title, withAnswers: true })),
      ...this.zones[2].files.map(f => ({ path: f.file.path, title: f.title, withAnswers: false }))
    ];
  }
}

export default FileManager;
