const { shell, dialog, clipboard } = require("electron");
const { t } = require("../i18n");

const platform = {
  darwin: "darwin",
  linux: "linux",
  win32: "win32",
};

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
            dialog
              .showMessageBox(browserWindow, {
                message: "SparkMEMO",
                detail: versionInfo,
                buttons: ["OK", "Copy"],
              })
              .then(({ response }) => {
                if (response === 1) {
                  clipboard.writeText(versionInfo);
                }
              });
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
        },
        {
          type: "separator",
        },
        {
          label: t("fileMenu.openFile"),
          accelerator: "CmdOrCtrl+O",
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
    }
  );
  return menuTemplate;
}

module.exports = {
  menuTemplate: buildMenuTemplate(),
};
