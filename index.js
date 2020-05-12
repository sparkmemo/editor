const { app, BrowserWindow } = require('electron');
const { createEditorWindow } = require('./src/window.js');
const { initIPC } = require('./src/ipc.js');
const { store } = require('./src/settings-store.js');

app.whenReady().then(() => {
  // If preferredLang has not been set, set it to be system locale.
  if (!(store.has('preferredLang'))) {
    console.log(`index.js > setting store.preferredLang to ${app.getLocale()}`);
    store.set('preferredLang', app.getLocale());
  }
  initIPC();
  createEditorWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createEditorWindow();
  }
});
