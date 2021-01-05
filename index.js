const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      contextIsolation: true,
    },
  });

  // win.webContents.openDevTools();
  win.loadFile(path.resolve(__dirname, "pages", "editor", "index.html"));
}

function setMenu() {
  const { menuTemplate } = require("./core/menu");
  Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));
}

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
