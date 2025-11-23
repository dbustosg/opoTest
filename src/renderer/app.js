/**
 * Inicializador de la aplicación renderer
 * Orquesta todos los módulos de UI
 */

import FileManager from './modules/fileManager.js';
import ModalManager from './modules/modalManager.js';
import DropzoneManager from './modules/dropzoneManager.js';
import UIController from './modules/uiController.js';

// Referencias a elementos del DOM
const elements = {
  modal: document.getElementById('modal'),
  titleInput: document.getElementById('titleInput'),
  okBtn: document.getElementById('okBtn'),
  cancelBtn: document.getElementById('cancelBtn'),
  loading: document.getElementById('loading'),
  convertBtn: document.getElementById('convertBtn'),
  clearBtn: document.getElementById('clearBtn'),
  alertModal: document.getElementById('alertModal'),
  alertIcon: document.getElementById('alertIcon'),
  alertTitle: document.getElementById('alertTitle'),
  alertMessage: document.getElementById('alertMessage'),
  alertOkBtn: document.getElementById('alertOkBtn'),
  dropzone1: document.getElementById('dropzone1'),
  dropzone2: document.getElementById('dropzone2'),
  status1: document.getElementById('status1'),
  status2: document.getElementById('status2')
};

// Inicializa módulos
const fileManager = new FileManager();
const modalManager = new ModalManager(elements);
const dropzoneManager = new DropzoneManager(elements, fileManager, modalManager);
const uiController = new UIController(elements, fileManager, modalManager, dropzoneManager);

// Inicia la aplicación
dropzoneManager.init();
uiController.init();

// Observa cambios en archivos para actualizar controles
const originalAddFile = fileManager.addFile.bind(fileManager);
fileManager.addFile = function(...args) {
  originalAddFile(...args);
  uiController.updateControls();
};
