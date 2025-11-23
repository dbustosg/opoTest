/**
 * Gestor de zonas de drag & drop
 */

const MAX_FILES = 10;

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

  /**
   * Inicializa eventos de drag & drop
   */
  init() {
    Object.keys(this.zones).forEach(zoneId => {
      this.setupDragAndDrop(zoneId);
      this.setupSelectButton(zoneId);
    });
  }

  /**
   * Configura eventos drag & drop para una zona
   * @param {string} zoneId
   */
  setupDragAndDrop(zoneId) {
    const zone = this.zones[zoneId];

    zone.dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      zone.dropzone.classList.add('dragover');
    });

    zone.dropzone.addEventListener('dragleave', () => {
      zone.dropzone.classList.remove('dragover');
    });

    zone.dropzone.addEventListener('drop', async (e) => {
      e.preventDefault();
      zone.dropzone.classList.remove('dragover');

      const htmlFiles = Array.from(e.dataTransfer.files)
        .filter(f => f.name.endsWith('.html'))
        .slice(0, MAX_FILES);

      if (htmlFiles.length === 0) {
        zone.status.textContent = 'Solo archivos HTML';
        return;
      }

      await this.processFiles(zoneId, htmlFiles.map(f => ({ path: f.path, name: f.name })));
    });
  }

  /**
   * Configura botón de selección manual
   * @param {string} zoneId
   */
  setupSelectButton(zoneId) {
    const zone = this.zones[zoneId];
    const btn = zone.dropzone.querySelector('.selectBtn');
    
    if (btn) {
      btn.addEventListener('click', async () => {
        const filePaths = await window.api.selectFiles();
        if (!filePaths || filePaths.length === 0) return;

        const files = filePaths.slice(0, MAX_FILES).map(path => ({
          path,
          name: path.split(/[\\/]/).pop()
        }));

        await this.processFiles(zoneId, files);
      });
    }
  }

  /**
   * Procesa archivos añadidos
   * @param {string} zoneId
   * @param {Array} files
   */
  async processFiles(zoneId, files) {
    for (const file of files) {
      const title = await this.modalManager.askTitle(
        file.name,
        (title) => this.fileManager.titleExists(zoneId, title)
      );
      
      if (title) {
        this.fileManager.addFile(zoneId, { file, title });
      }
    }

    if (this.fileManager.getFiles(zoneId).length > 0) {
      this.showFiles(zoneId);
    }
  }

  /**
   * Muestra archivos en una zona
   * @param {string} zoneId
   */
  showFiles(zoneId) {
    const zone = this.zones[zoneId];
    const files = this.fileManager.getFiles(zoneId);
    
    zone.dropzone.classList.add('has-files');
    zone.dropzone.innerHTML = files.map((f, i) => 
      `<div class="file-item">${i + 1}. <span class="title">${f.title}</span> (${f.file.name})</div>`
    ).join('');
    zone.status.textContent = `${files.length} archivo(s) listo(s)`;
  }

  /**
   * Resetea una zona
   * @param {string} zoneId
   */
  reset(zoneId) {
    const zone = this.zones[zoneId];
    zone.dropzone.classList.remove('has-files');
    zone.dropzone.innerHTML = `<p>Arrastra hasta 10 archivos HTML</p><button class="selectBtn" data-zone="${zoneId}">Selecciona archivo/s</button>`;
    zone.status.textContent = '';
    this.setupSelectButton(zoneId);
  }

  /**
   * Resetea todas las zonas
   */
  resetAll() {
    this.reset('1');
    this.reset('2');
  }
}

export default DropzoneManager;
