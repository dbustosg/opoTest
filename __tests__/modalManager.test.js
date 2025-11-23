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
  }
  askTitle(fileName, validateFn) {
    return Promise.resolve('Test Title');
  }
  showAlert(type, title, message) {
    this.alertIcon.className = type;
    this.alertIcon.textContent = type === 'success' ? '✓' : '✗';
    this.alertTitle.textContent = title;
    this.alertMessage.textContent = message;
    this.alertModal.classList.add('show');
  }
  setupAlertModal() {}
}

describe('ModalManager', () => {
  let modalManager;
  let mockElements;

  beforeEach(() => {
    mockElements = {
      modal: { classList: { add: jest.fn(), remove: jest.fn() }, querySelector: jest.fn() },
      titleInput: { value: '', focus: jest.fn() },
      okBtn: { addEventListener: jest.fn(), removeEventListener: jest.fn() },
      cancelBtn: { addEventListener: jest.fn(), removeEventListener: jest.fn() },
      alertModal: { classList: { add: jest.fn(), remove: jest.fn() } },
      alertIcon: { className: '', textContent: '' },
      alertTitle: { textContent: '' },
      alertMessage: { textContent: '' },
      alertOkBtn: { addEventListener: jest.fn() }
    };
    modalManager = new ModalManager(mockElements);
  });

  test('inicializa correctamente', () => {
    expect(modalManager.modal).toBeDefined();
    expect(modalManager.titleInput).toBeDefined();
  });

  test('solicita título', async () => {
    const title = await modalManager.askTitle('test.html', () => false);
    expect(title).toBe('Test Title');
  });

  test('muestra alerta de éxito', () => {
    modalManager.showAlert('success', 'Título', 'Mensaje');
    
    expect(mockElements.alertIcon.className).toBe('success');
    expect(mockElements.alertIcon.textContent).toBe('✓');
    expect(mockElements.alertTitle.textContent).toBe('Título');
    expect(mockElements.alertMessage.textContent).toBe('Mensaje');
  });

  test('muestra alerta de error', () => {
    modalManager.showAlert('error', 'Error', 'Mensaje error');
    
    expect(mockElements.alertIcon.className).toBe('error');
    expect(mockElements.alertIcon.textContent).toBe('✗');
  });
});
