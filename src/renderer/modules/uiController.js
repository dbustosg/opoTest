/**
 * Controlador principal de UI
 */

class UIController {
  constructor(elements, fileManager, modalManager, dropzoneManager) {
    this.elements = elements;
    this.fileManager = fileManager;
    this.modalManager = modalManager;
    this.dropzoneManager = dropzoneManager;
  }

  /**
   * Inicializa el controlador
   */
  init() {
    this.setupConvertButton();
    this.setupClearButton();
    this.updateControls();
  }

  /**
   * Configura botón de conversión
   */
  setupConvertButton() {
    this.elements.convertBtn.addEventListener('click', async () => {
      const folder = await window.api.selectFolder();
      if (!folder) return;

      this.setLoading(true);
      
      const allFiles = this.fileManager.getAllFilesWithConfig();
      
      try {
        const result = await window.api.convertMultiple(allFiles, folder);
        
        this.setLoading(false);
        
        if (result.errors.length > 0) {
          this.modalManager.showAlert('error', 'Errores en la conversión', result.errors.join('\n'));
        } else {
          this.modalManager.showAlert('success', 'Conversión completada', `✓ ${result.success} archivo(s) convertido(s) correctamente`);
        }
        
        this.clearAll();
      } catch (error) {
        this.setLoading(false);
        this.modalManager.showAlert('error', 'Error', error.message || 'Error desconocido');
      }
    });
  }

  /**
   * Configura botón de limpiar
   */
  setupClearButton() {
    this.elements.clearBtn.addEventListener('click', () => {
      this.clearAll();
    });
  }

  /**
   * Limpia todas las zonas
   */
  clearAll() {
    this.fileManager.clearAll();
    this.dropzoneManager.resetAll();
    this.updateControls();
  }

  /**
   * Actualiza estado de controles
   */
  updateControls() {
    const hasFiles = this.fileManager.hasFiles();
    this.elements.convertBtn.disabled = !hasFiles;
    this.elements.clearBtn.disabled = !hasFiles;
  }

  /**
   * Activa/desactiva estado de carga
   * @param {boolean} loading
   */
  setLoading(loading) {
    if (loading) {
      this.elements.loading.classList.add('show');
      this.elements.convertBtn.disabled = true;
      this.elements.clearBtn.disabled = true;
    } else {
      this.elements.loading.classList.remove('show');
      this.updateControls();
    }
  }
}

export default UIController;
