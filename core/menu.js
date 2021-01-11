const fs = require("fs");

const {
  shell,
  dialog,
  clipboard,
  ipcMain,
  BrowserWindow,
} = require("electron");

const { fsOption, msgChannel } = require("../core/const");
const { createEditorWindow, createSettingsWindow } = require("../index");
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
          click(_, browserWindow) {
            showAbout(browserWindow);
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
            createEditorWindow();
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
          click(_, browserWindow) {
            browserWindow.webContents.send(msgChannel.saveReq);
          },
        },
        {
          label: t("fileMenu.saveAsFile"),
          accelerator: "CmdOrCtrl+Shift+S",
          click(_, browserWindow) {
            browserWindow.webContents.send(msgChannel.saveAsReq);
          },
        },
        {
          type: "separator",
        },
        {
          label: t("fileMenu.preference"),
          accelerator: "CmdOrCtrl+,",
          click(_, browserWindow) {
            createSettingsWindow(browserWindow);
          },
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
 * Show the about page.
 *
 * @param {*} browserWindow - Current browserWindow
 */
function showAbout(browserWindow) {
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
      msgChannel.open,
      {
        path: path[0],
        changed: false,
      },
      content
    );
  }
}

/**
 * Handles the save event from app menu "File - Save File"
 *
 * @param {*} e - Electron IpcMain event
 * @param {*} metaData - Current file meta data
 * @param {*} content - Current existing content
 * @returns {Array} - Operation status and path
 */
function saveFile(e, metaData, content) {
  if (metaData.path) {
    try {
      fs.writeFileSync(metaData.path, content, fsOption);
      return [true];
    } catch (e) {
      return [false];
    }
  } else {
    const browserWindow = BrowserWindow.fromWebContents(e.sender);
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
        return [true, path];
      } catch (e) {
        return [false];
      }
    } else {
      return [false];
    }
  }
}

ipcMain.handle(msgChannel.save, saveFile);

/**
 * Handles the save as event from app menu "File - Save As"
 *
 * @param {*} e - Electron IpcMain event
 * @param {*} metaData - Current file meta data
 * @param {*} content - Current existing content
 * @returns {boolean} - Operation status
 */
function saveAs(e, metaData, content) {
  const browserWindow = BrowserWindow.fromWebContents(e.sender);
  const path = dialog.showSaveDialogSync(browserWindow, {
    title: t("editor.saveAs"),
    message: t("editor.saveAs"),
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
}

ipcMain.handle(msgChannel.saveAs, saveAs);

/**
 * Handles saving existing content before opening a new file.
 *
 * @param {*} e - Electron IpcMain event
 * @param {*} metaData - Current file meta data
 * @param {*} content - Current existing content
 */
function saveBeforeNext(e, metaData, content) {
  const browserWindow = BrowserWindow.fromWebContents(e.sender);
  const selectedOption = dialog.showMessageBoxSync(browserWindow, {
    type: "warning",
    message: t("editor.saveBeforeSetSource.message"),
    detail: t("editor.saveBeforeSetSource.detail"),
    buttons: [
      t("editor.saveBeforeSetSource.save"),
      t("editor.saveBeforeSetSource.ignore"),
      t("editor.saveBeforeSetSource.cancel"),
    ],
    cancelId: 2,
  });

  switch (selectedOption) {
    // "Save"
    case 0:
      const path =
        metaData.path ||
        dialog.showSaveDialogSync(browserWindow, {
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
          e.returnValue = true;
        } catch (error) {
          e.returnValue = false;
        }
      } else {
        e.returnValue = false;
      }
      break;
    // "Ignore"
    case 1:
      e.returnValue = true;
      break;
    // "Cancel"
    case 2:
      e.returnValue = false;
      break;
  }
}

ipcMain.on(msgChannel.saveBeforeNext, saveBeforeNext);

module.exports = {
  menuTemplate: buildMenuTemplate(),
};
