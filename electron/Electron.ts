import { app, BrowserWindow } from "electron";

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  console.log(__dirname);
  win.loadURL("http://localhost:3000");
}

app.whenReady().then(createWindow);
