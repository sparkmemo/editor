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
  editor.webContents.openDevTools();
  Menu.setApplicationMenu(Menu.buildFromTemplate(buildMenuTemplate()));
}

module.exports.createEditorWindow = createEditorWindow;
