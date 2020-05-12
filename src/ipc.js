const { ipcMain, dialog, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');
const { selectLanguage } = require('./i18n/lang.js');

function getBrowserWindow(event) {
  return BrowserWindow.fromWebContents(event.sender);
}

function tryLoadFile(parentWindow, t) {
  const loadPathSelected = dialog.showOpenDialogSync(parentWindow, {
    title: t.dialog.selectOpenPath,
    filters: [
      {
        name: t.dialog.mdFile,
        extensions: ['md'],
      },
    ],
    properties: ['openFile'],
  });
  if (loadPathSelected) {
    const loadPath = loadPathSelected[0];
    try {
      const fileContent = fs.readFileSync(loadPath, {
        encoding: 'utf8',
      });
      parentWindow.webContents.send('load-process-request', {
        fileName: path.basename(loadPath),
        filePath: loadPath,
        fileContent,
      });
    } catch (error) {
      dialog.showMessageBoxSync(parentWindow, {
        type: 'error',
        title: t.dialog.cannotLoadingFile,
        detail: error.toString(),
      });
    }
  }
}

function initIPC() {
  // t -> translation
  const t = selectLanguage();
  ipcMain.on('load-prepare-reply', (event, reply) => {
    const parentWindow = getBrowserWindow(event);
    if (reply.fileSaved) {
      tryLoadFile(parentWindow, t);
    } else {
      const optionSelected = dialog.showMessageBoxSync(parentWindow, {
        type: 'warning',
        buttons: [t.dialog.discardUnsavedChange, t.dialog.cancel],
        message: t.dialog.hasUnsavedChange,
      });
      if (optionSelected === 0) {
        tryLoadFile(parentWindow, t);
      }
    }
  });
}

module.exports = {
  initIPC,
};
