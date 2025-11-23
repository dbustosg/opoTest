/**
 * Factory para crear ventana principal
 */

const { BrowserWindow } = require('electron');
const path = require('path');

/**
 * Crea y configura la ventana principal
 * @returns {BrowserWindow}
 */
function createMainWindow() {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, '../../preload/index.js')
    }
  });

  mainWindow.loadFile(path.join(__dirname, '../../renderer/index.html'));
  
  return mainWindow;
}

module.exports = { createMainWindow };
