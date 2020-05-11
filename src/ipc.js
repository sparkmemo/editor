const { ipcMain, dialog, BrowserWindow } = require('electron');
const fs = require('fs');
const { selectLanguage } = require('./i18n/lang.js');
const { store } = require('./settings-store.js');

function initIPC() {
  // t -> translation
  // const t = selectLanguage('en');
  ipcMain.on('save-reply', (event, data) => {
    try {
      fs.writeFileSync(data.filePath, data.mdSource);
    } catch (error) {
      event.reply('save-confirm', {
        success: false,
      });
      dialog.showMessageBoxSync(BrowserWindow.fromId(event.frameId), {
        type: 'error',
        message: 'error in saving file',
        detail: error.toString(),
      });
    }
    event.reply('save-confirm', {
      success: true,
    });
  });
}

module.exports = {
  initIPC,
};
