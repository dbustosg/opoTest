/**
 * Gestor de modales
 */

class ModalManager {
  constructor(elements) {
    this.modal = elements.modal;
    this.titleInput = elements.titleInput;
    this.okBtn = elements.okBtn;
    this.cancelBtn = elements.cancelBtn;
    this.alertModal = elements.alertModal;
    this.alertIcon = elements.alertIcon;
    this.alertTitle = elements.alertTitle;
    this.alertMessage = elements.alertMessage;
    this.alertOkBtn = elements.alertOkBtn;

    this.setupAlertModal();
  }

  /**
   * Solicita título para un archivo
   * @param {string} fileName
   * @param {Function} validateFn - Función de validación
   * @returns {Promise<string|null>}
   */
  askTitle(fileName, validateFn) {
    return new Promise((resolve) => {
      this.modal.classList.add('show');
      this.titleInput.value = '';
      this.titleInput.focus();
      this.modal.querySelector('h3').textContent = `Título para: ${fileName}`;

      const handleOk = () => {
        const title = this.titleInput.value.trim();
        if (!title) return;
        
        if (validateFn(title)) {
          cleanup();
          this.showAlert('error', 'Título duplicado', `Ya existe un documento con el título "${title}"`);
          resolve(null);
          return;
        }
        cleanup();
        resolve(title);
      };

      const handleCancel = () => {
        cleanup();
        resolve(null);
      };

      const handleEnter = (e) => {
        if (e.key === 'Enter') handleOk();
      };

      const cleanup = () => {
        this.modal.classList.remove('show');
        this.okBtn.removeEventListener('click', handleOk);
        this.cancelBtn.removeEventListener('click', handleCancel);
        this.titleInput.removeEventListener('keypress', handleEnter);
      };

      this.okBtn.addEventListener('click', handleOk);
      this.cancelBtn.addEventListener('click', handleCancel);
      this.titleInput.addEventListener('keypress', handleEnter);
    });
  }

  /**
   * Muestra alerta
   * @param {string} type
   * @param {string} title
   * @param {string} message
   */
  showAlert(type, title, message) {
    this.alertIcon.className = type;
    this.alertIcon.textContent = type === 'success' ? '✓' : '✗';
    this.alertTitle.textContent = title;
    this.alertMessage.textContent = message;
    this.alertModal.classList.add('show');
  }

  setupAlertModal() {
    this.alertOkBtn.addEventListener('click', () => {
      this.alertModal.classList.remove('show');
    });
  }
}

export default ModalManager;
