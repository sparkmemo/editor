const { ipcMain, dialog, BrowserWindow } = require('electron');
const fs = require('fs');
const { selectLanguage } = require('./i18n/lang.js');
const { store } = require('./settings-store.js');

console.log(`ipc.js > init t to ${store.get('preferredLang', undefined)}`);
let t = selectLanguage(store.get('preferredLang', undefined));

store.onDidChange('preferredLang', (newValue) => {
  console.log(`ipc.js > updating t to ${newValue}`);
  t = selectLanguage(newValue);
});

function initIPC() {
  // t -> translation
  ipcMain.on('save-reply', (event, data) => {
    console.log(`ipc.js > t ${t.menu.file}`);
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
