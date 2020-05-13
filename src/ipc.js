const { ipcMain, dialog, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');
const { selectLanguage } = require('./i18n/lang.js');

function getBrowserWindow(event) {
  return BrowserWindow.fromWebContents(event.sender);
}

function tryLoadFile(parentWindow, t) {
  const loadPathSelected = dialog.showOpenDialogSync(parentWindow, {
    title: t.dialog.load.selectLoadPath,
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
        title: t.dialog.load.cannotLoadFile,
        detail: error.toString(),
      });
    }
  }
}

function trySaveFile(parentWindow, t, savePath, mdSource) {
  try {
    fs.writeFileSync(savePath, mdSource, {
      encoding: 'utf8',
    });
    parentWindow.webContents.send('save-process-request', {
      fileName: path.basename(savePath),
      filePath: savePath,
    });
  } catch (error) {
    dialog.showMessageBoxSync(parentWindow, {
      type: 'error',
      title: t.dialog.save.cannotSaveFile,
      detail: error.toString(),
    });
  }
}

function trySaveAsFile(parentWindow, t, saveAsPath, mdSource) {
  try {
    fs.writeFileSync(saveAsPath, mdSource, {
      encoding: 'utf8',
    });
    parentWindow.webContents.send('saveAs-process-request');
  } catch (error) {
    dialog.showMessageBoxSync(parentWindow, {
      type: 'error',
      title: t.dialog.saveAs.cannotSaveAsFile,
      detail: error.toString(),
    });
  }
}

function initIPC() {
  // t -> translation
  const t = selectLanguage();
  // Load file
  ipcMain.on('load-prepare-reply', (event, reply) => {
    const parentWindow = getBrowserWindow(event);
    if (reply.fileSaved) {
      tryLoadFile(parentWindow, t);
    } else {
      const optionSelected = dialog.showMessageBoxSync(parentWindow, {
        type: 'warning',
        buttons: [t.dialog.unsavedChange.discardUnsavedChange, t.dialog.cancel],
        message: t.dialog.unsavedChange.hasUnsavedChange,
      });
      if (optionSelected === 0) {
        tryLoadFile(parentWindow, t);
      }
    }
  });
  // Save file
  ipcMain.on('save-prepare-reply', (event, reply) => {
    const parentWindow = getBrowserWindow(event);
    if (reply.filePath === '') {
      const savePathSelected = dialog.showSaveDialogSync(parentWindow, {
        title: t.dialog.save.selectSavePath,
        filters: [
          {
            name: t.dialog.mdFile,
            extensions: ['md'],
          },
        ],
      });
      if (savePathSelected) {
        trySaveFile(parentWindow, t, savePathSelected, reply.mdSource);
      }
    } else {
      trySaveFile(parentWindow, t, reply.filePath, reply.mdSource);
    }
  });
  // Save as file
  ipcMain.on('saveAs-prepare-reply', (event, reply) => {
    const parentWindow = getBrowserWindow(event);
    const saveAsPathSelected = dialog.showSaveDialogSync(parentWindow, {
      title: t.dialog.saveAs.selectSaveAsPath,
      filters: [
        {
          name: t.dialog.mdFile,
          extensions: ['md'],
        },
      ],
    });
    if (saveAsPathSelected) {
      trySaveAsFile(parentWindow, t, saveAsPathSelected, reply.mdSource);
    }
  });
}

module.exports = {
  initIPC,
};
