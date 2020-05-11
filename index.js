const { app, BrowserWindow } = require('electron');
const { createEditorWindow } = require('./src/window.js');
const { initIPC } = require('./src/ipc.js');

app.whenReady().then(() => {
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

initIPC();
