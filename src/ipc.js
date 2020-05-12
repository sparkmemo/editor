const { ipcMain, dialog, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');
const { selectLanguage } = require('./i18n/lang.js');

function getBrowserWindow(event) {
  return BrowserWindow.fromWebContents(event.sender);
}

function initIPC() {
  // t -> translation
  const t = selectLanguage();
  const mdFileFilter = [
    {
      name: t.dialog.mdFile,
      extensions: ['md'],
    },
  ];
  ipcMain.on('save-reply', (event, res) => {
    //
  });
  ipcMain.on('saveAs-reply', (event, res) => {
    //
  });
  ipcMain.on('load-reply', (event) => {
    //
  });
}

module.exports = {
  initIPC,
};
