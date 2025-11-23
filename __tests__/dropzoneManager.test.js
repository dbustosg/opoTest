class DropzoneManager {
  constructor(elements, fileManager, modalManager) {
    this.elements = elements;
    this.fileManager = fileManager;
    this.modalManager = modalManager;
    this.zones = {
      1: { dropzone: elements.dropzone1, status: elements.status1 },
      2: { dropzone: elements.dropzone2, status: elements.status2 }
    };
  }
  init() {}
  setupDragAndDrop(zoneId) {}
  setupSelectButton(zoneId) {}
  async processFiles(zoneId, files) {
    for (const file of files) {
      const title = await this.modalManager.askTitle(file.name, () => false);
      if (title) {
        this.fileManager.addFile(zoneId, { file, title });
      }
    }
    if (this.fileManager.getFiles(zoneId).length > 0) {
      this.showFiles(zoneId);
    }
  }
  showFiles(zoneId) {
    const zone = this.zones[zoneId];
    const files = this.fileManager.getFiles(zoneId);
    zone.dropzone.classList.add('has-files');
    zone.status.textContent = `${files.length} archivo(s) listo(s)`;
  }
  reset(zoneId) {
    const zone = this.zones[zoneId];
    zone.dropzone.classList.remove('has-files');
    zone.status.textContent = '';
  }
  resetAll() {
    this.reset('1');
    this.reset('2');
  }
}

describe('DropzoneManager', () => {
  let dropzoneManager;
  let mockFileManager;
  let mockModalManager;
  let mockElements;

  beforeEach(() => {
    mockFileManager = {
      addFile: jest.fn(),
      getFiles: jest.fn().mockReturnValue([{ file: { name: 'test.html' }, title: 'Test' }]),
      titleExists: jest.fn().mockReturnValue(false)
    };
    
    mockModalManager = {
      askTitle: jest.fn().mockResolvedValue('Test Title')
    };
    
    mockElements = {
      dropzone1: { classList: { add: jest.fn(), remove: jest.fn() }, innerHTML: '' },
      dropzone2: { classList: { add: jest.fn(), remove: jest.fn() }, innerHTML: '' },
      status1: { textContent: '' },
      status2: { textContent: '' }
    };
    
    dropzoneManager = new DropzoneManager(mockElements, mockFileManager, mockModalManager);
  });

  test('inicializa correctamente', () => {
    expect(dropzoneManager.zones['1']).toBeDefined();
    expect(dropzoneManager.zones['2']).toBeDefined();
  });

  test('procesa archivos', async () => {
    const files = [{ path: '/test.html', name: 'test.html' }];
    await dropzoneManager.processFiles('1', files);
    
    expect(mockModalManager.askTitle).toHaveBeenCalled();
    expect(mockFileManager.addFile).toHaveBeenCalled();
  });

  test('muestra archivos', () => {
    dropzoneManager.showFiles('1');
    
    expect(mockElements.dropzone1.classList.add).toHaveBeenCalledWith('has-files');
    expect(mockElements.status1.textContent).toContain('archivo(s) listo(s)');
  });

  test('resetea zona', () => {
    dropzoneManager.reset('1');
    
    expect(mockElements.dropzone1.classList.remove).toHaveBeenCalledWith('has-files');
    expect(mockElements.status1.textContent).toBe('');
  });

  test('resetea todas las zonas', () => {
    dropzoneManager.resetAll();
    
    expect(mockElements.dropzone1.classList.remove).toHaveBeenCalled();
    expect(mockElements.dropzone2.classList.remove).toHaveBeenCalled();
  });
});
