const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const { buildMenuTemplate } = require('./menu.js');
const { store } = require('./settings-store.js');

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

  // If preferredLang has not been set, set it to be system locale.
  if (!(store.has('preferredLang'))) {
    console.log(`window.js > setting store.preferredLang to ${app.getLocale()}`);
    store.set('preferredLang', app.getLocale());
  }
  Menu.setApplicationMenu(Menu.buildFromTemplate(buildMenuTemplate(store.get('preferredLang'))));
}

module.exports.createEditorWindow = createEditorWindow;
