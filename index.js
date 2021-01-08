const { app, BrowserWindow, Menu, shell } = require("electron");
const fs = require("fs");
const path = require("path");
const { msgChannel, fsOption } = require("./core/const");

/**
 * Creates an editor window.
 *
 * @returns {BrowserWindow} - browserWindow
 */
function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
    },
  });

  // win.webContents.openDevTools();
  win
    .loadFile(path.resolve(__dirname, "pages", "editor", "index.html"))
    .then(() => {
      win.webContents.on("will-navigate", (e, url) => {
        e.preventDefault();
        shell.openExternal(url);
      });
    });
  return win;
}

/**
 * Sets the electron app menu.
 */
function setMenu() {
  const { menuTemplate } = require("./core/menu");
  Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));
}

/**
 * Handles open-file event on MacOS.
 *
 * @param {*} e - Event
 * @param {*} openPath - File Path
 */
function handleOpenFile_Darwin(e, openPath) {
  e.preventDefault();
  const content = fs.readFileSync(openPath, fsOption);
  if (app.isReady()) {
    const win = createWindow();
    win.once("ready-to-show", () => {
      win.webContents.send(msgChannel.open, { path: openPath }, content);
    });
  } else {
    app.whenReady().then(() => {
      const winList = BrowserWindow.getAllWindows();
      if (winList.length > 0) {
        const win = winList[0];
        win.once("ready-to-show", () => {
          win.webContents.send(msgChannel.open, { path: openPath }, content);
        });
      }
    });
  }
}
app.on("open-file", handleOpenFile_Darwin);

app.whenReady().then(() => {
  // Set application name
  app.setName("SparkMEMO");

  // Set application menu
  setMenu();

  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

module.exports = {
  createWindow,
};
