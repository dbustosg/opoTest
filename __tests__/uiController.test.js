class UIController {
  constructor(elements, fileManager, modalManager, dropzoneManager) {
    this.elements = elements;
    this.fileManager = fileManager;
    this.modalManager = modalManager;
    this.dropzoneManager = dropzoneManager;
  }
  init() {}
  async handleConvert() {
    if (!this.fileManager.hasFiles()) return;
    const folder = await window.api.selectFolder();
    if (!folder) return;
    const files = this.fileManager.getAllFilesWithConfig();
    const result = await window.api.convertMultiple(files, folder);
    if (result.success > 0) {
      this.modalManager.showAlert('success', 'Éxito', `${result.success} archivos convertidos`);
    }
  }
  handleClear(zoneId) {
    this.fileManager.clearZone(zoneId);
    this.dropzoneManager.reset(zoneId);
  }
  handleClearAll() {
    this.fileManager.clearAll();
    this.dropzoneManager.resetAll();
  }
}

describe('UIController', () => {
  let uiController;
  let mockFileManager;
  let mockModalManager;
  let mockDropzoneManager;
  let mockElements;

  beforeEach(() => {
    mockFileManager = {
      hasFiles: jest.fn().mockReturnValue(true),
      getAllFilesWithConfig: jest.fn().mockReturnValue([]),
      clearZone: jest.fn(),
      clearAll: jest.fn()
    };
    
    mockModalManager = {
      showAlert: jest.fn()
    };
    
    mockDropzoneManager = {
      reset: jest.fn(),
      resetAll: jest.fn()
    };
    
    mockElements = {
      convertBtn: { addEventListener: jest.fn() },
      clearBtn1: { addEventListener: jest.fn() },
      clearBtn2: { addEventListener: jest.fn() },
      clearAllBtn: { addEventListener: jest.fn() }
    };
    
    global.window = {
      api: {
        selectFolder: jest.fn().mockResolvedValue('/output'),
        convertMultiple: jest.fn().mockResolvedValue({ success: 2, failed: 0, errors: [] })
      }
    };
    
    uiController = new UIController(mockElements, mockFileManager, mockModalManager, mockDropzoneManager);
  });

  test('inicializa correctamente', () => {
    expect(uiController.fileManager).toBeDefined();
    expect(uiController.modalManager).toBeDefined();
  });

  test('maneja conversión', async () => {
    await uiController.handleConvert();
    
    expect(mockFileManager.hasFiles).toHaveBeenCalled();
    expect(window.api.selectFolder).toHaveBeenCalled();
    expect(mockModalManager.showAlert).toHaveBeenCalled();
  });

  test('limpia zona específica', () => {
    uiController.handleClear('1');
    
    expect(mockFileManager.clearZone).toHaveBeenCalledWith('1');
    expect(mockDropzoneManager.reset).toHaveBeenCalledWith('1');
  });

  test('limpia todas las zonas', () => {
    uiController.handleClearAll();
    
    expect(mockFileManager.clearAll).toHaveBeenCalled();
    expect(mockDropzoneManager.resetAll).toHaveBeenCalled();
  });
});
