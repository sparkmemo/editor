const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const { buildMenuTemplate } = require('./menu.js');

function createEditorWindow() {
  const editor = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  editor.loadFile(path.join(app.getAppPath(), 'src', 'editor', 'editor.html'));
  // editor.webContents.openDevTools();
  Menu.setApplicationMenu(Menu.buildFromTemplate(buildMenuTemplate()));
  editor.on('close', (event) => {
    event.preventDefault();
    editor.webContents.send('close-prepare-request');
  });
}

module.exports.createEditorWindow = createEditorWindow;
