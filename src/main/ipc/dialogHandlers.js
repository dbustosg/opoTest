/**
 * Handlers IPC para diálogos nativos
 */

const { ipcMain, dialog } = require('electron');
const { IPC_CHANNELS } = require('../../shared/constants');

/**
 * Registra handlers de diálogos
 * @param {BrowserWindow} mainWindow
 */
function registerDialogHandlers(mainWindow) {
  ipcMain.handle(IPC_CHANNELS.SELECT_FOLDER, async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory']
    });
    return result.filePaths[0];
  });

  ipcMain.handle(IPC_CHANNELS.SELECT_FILES, async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openFile', 'multiSelections'],
      filters: [{ name: 'HTML', extensions: ['html'] }]
    });
    return result.filePaths;
  });

  ipcMain.handle(IPC_CHANNELS.SHOW_ERROR, async (event, message) => {
    await dialog.showMessageBox(mainWindow, {
      type: 'error',
      title: 'Errores en la conversión',
      message: message
    });
  });

  ipcMain.handle(IPC_CHANNELS.SHOW_SUCCESS, async (event, message) => {
    await dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: 'Conversión completada',
      message: message
    });
  });
}

module.exports = { registerDialogHandlers };
