const fs = require("fs");

const {
  shell,
  dialog,
  clipboard,
  ipcMain,
  BrowserWindow,
} = require("electron");

const { fsOption, msgChannel } = require("../core/const");
const { createWindow } = require("../index");
const { t } = require("../i18n");

const platform = {
  darwin: "darwin",
  linux: "linux",
  win32: "win32",
};

/**
 * Build Electron App Menu based on OS
 *
 * @returns {Array} menuTemplate
 */
function buildMenuTemplate() {
  const menuTemplate = [];
  if (process.platform === platform.darwin) {
    menuTemplate.push({
      label: "SparkMEMO",
      submenu: [
        {
          label: "About SparkMEMO",
          async click(_, browserWindow) {
            const versionInfo = [
              "Version: 0.2.0",
              `Electron: ${process.versions.electron}`,
              `Chrome: ${process.versions.chrome}`,
            ].join("\n");
            const selectedOption = dialog.showMessageBoxSync(browserWindow, {
              message: "SparkMEMO",
              detail: versionInfo,
              buttons: [t("about.close"), t("about.copy")],
              cancelId: 0,
            });
            if (selectedOption === 1) {
              clipboard.writeText(versionInfo);
            }
          },
        },
        {
          type: "separator",
        },
        {
          role: "services",
        },
        {
          type: "separator",
        },
        {
          role: "hide",
        },
        {
          role: "hideOthers",
        },
        {
          role: "unhide",
        },
        {
          type: "separator",
        },
        {
          role: "quit",
        },
      ],
    });
  }
  menuTemplate.push(
    {
      label: t("file"),
      submenu: [
        {
          label: t("fileMenu.newWindow"),
          accelerator: "CmdOrCtrl+N",
          click() {
            createWindow();
          },
        },
        {
          type: "separator",
        },
        {
          label: t("fileMenu.openFile"),
          accelerator: "CmdOrCtrl+O",
          click(_, browserWindow) {
            openFile(browserWindow);
          },
        },
        {
          type: "separator",
        },
        {
          label: t("fileMenu.saveFile"),
          accelerator: "CmdOrCtrl+S",
        },
        {
          label: t("fileMenu.saveAsFile"),
          accelerator: "CmdOrCtrl+Shift+S",
        },
        {
          type: "separator",
        },
        {
          label: t("fileMenu.preference"),
          accelerator: "CmdOrCtrl+,",
        },
        {
          type: "separator",
        },
        {
          role: "close",
        },
      ],
    },
    {
      role: "editMenu",
    },
    {
      role: "viewMenu",
    },
    {
      role: "windowMenu",
    },
    {
      label: "Help",
      submenu: [
        {
          label: "Homepage",
          click() {
            shell.openExternal("https://github.com/wtongze/sparkmemo");
          },
        },
        {
          label: "Report Issue",
          click() {
            shell.openExternal(
              "https://github.com/wtongze/sparkmemo/issues/new"
            );
          },
        },
        {
          label: "License",
          click() {
            shell.openExternal(
              "https://github.com/wtongze/sparkmemo/blob/master/LICENSE"
            );
          },
        },
      ],
    }
  );
  return menuTemplate;
}

/**
 * Handles the click event from app menu "File - Open File"
 *
 * @param {BrowserWindow} browserWindow - Current BrowserWindow
 */
function openFile(browserWindow) {
  const path = dialog.showOpenDialogSync(browserWindow, {
    title: t("editor.openFile"),
    message: t("editor.openFile"),
    filters: [
      {
        name: "Markdown",
        extensions: ["md"],
      },
    ],
    properties: ["openFile"],
  });
  if (path) {
    const content = fs.readFileSync(path[0], fsOption);
    browserWindow.webContents.send(
      msgChannel.setSource,
      {
        path: path[0],
      },
      content
    );
  }
}

/**
 * Handles saving existing content before opening a new file.
 *
 * @param {*} e - Electron IpcMain event
 * @param {*} metaData - Current file meta data
 * @param {*} content - Current existing content
 * @returns {boolean} - Should proceed to open a new file?
 */
function saveBeforeSetSource(e, metaData, content) {
  if (metaData.path) {
    try {
      fs.writeFileSync(path, content, fsOption);
      return true;
    } catch (e) {
      return false;
    }
  } else {
    const browserWindow = BrowserWindow.fromWebContents(e.sender);
    const selectedOption = dialog.showMessageBoxSync(browserWindow, {
      type: "warning",
      message: t("editor.saveBeforeSetSource.message"),
      detail: t("editor.saveBeforeSetSource.detail"),
      buttons: [
        t("editor.saveBeforeSetSource.detail.save"),
        t("editor.saveBeforeSetSource.detail.ignore"),
        t("editor.saveBeforeSetSource.detail.cancel"),
      ],
      cancelId: 2,
    });

    switch (selectedOption) {
      // "Save"
      case 0:
        const path = dialog.showSaveDialogSync(browserWindow, {
          title: t("editor.saveFile"),
          message: t("editor.saveFile"),
          filters: [
            {
              name: "Markdown",
              extensions: ["md"],
            },
          ],
          properties: ["createDirectory", "showOverwriteConfirmation"],
        });
        if (path) {
          try {
            fs.writeFileSync(path, content, fsOption);
            return true;
          } catch (e) {
            return false;
          }
        } else {
          return false;
        }

      // "Ignore"
      case 1:
        return true;

      // "Cancel"
      case 2:
        return false;
    }
  }
}

ipcMain.handle(msgChannel.saveBeforeSetSource, saveBeforeSetSource);

module.exports = {
  menuTemplate: buildMenuTemplate(),
};
