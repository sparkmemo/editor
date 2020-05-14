const { shell } = require('electron');
const { selectLanguage } = require('./i18n/lang.js');

module.exports.buildMenuTemplate = function () {
  // t -> translation
  const t = selectLanguage();
  return [
    {
      label: t.menu.file,
      submenu: [
        {
          label: t.menu.fileMenu.open,
          accelerator: 'CmdOrCtrl+o',
          click(menuItem, window) {
            window.webContents.send('load-prepare-request');
          },
        },
        {
          label: t.menu.fileMenu.save,
          accelerator: 'CmdOrCtrl+s',
          click(menuItem, window) {
            window.webContents.send('save-prepare-request');
          },
        },
        {
          label: t.menu.fileMenu.saveAs,
          accelerator: 'CmdOrCtrl+shift+s',
          click(menuItem, window) {
            window.webContents.send('saveAs-prepare-request');
          },
        },
        {
          type: 'separator',
        },
        {
          label: t.menu.fileMenu.export,
          submenu: [
            {
              label: t.menu.fileMenu.exportMenu.exportToPDF,
              click(menuItem, parentWindow) {
                parentWindow.webContents.send('exportToPDF-request');
              },
            },
          ],
        },
        {
          type: 'separator',
        },
        // {
        //   label: t.menu.fileMenu.settings,
        //   accelerator: 'CmdOrCtrl+,',
        //   click(menuIte, parentWindow) {
        //     //
        //   },
        // },
        // {
        //   type: 'separator',
        // },
        {
          role: 'quit',
          label: t.menu.fileMenu.quit,
          accelerator: 'CmdOrCtrl+q',
        },
      ],
    },
    {
      label: t.menu.edit,
      submenu: [
        {
          label: t.menu.editMenu.undo,
          role: 'undo',
        },
        {
          label: t.menu.editMenu.redo,
          role: 'redo',
        },
        {
          type: 'separator',
        },
        {
          label: t.menu.editMenu.cut,
          role: 'cut',
        },
        {
          label: t.menu.editMenu.copy,
          role: 'copy',
        },
        {
          label: t.menu.editMenu.paste,
          role: 'paste',
        },
        {
          label: t.menu.editMenu.delete,
          role: 'delete',
        },
        {
          type: 'separator',
        },
        {
          label: t.menu.editMenu.selectAll,
          role: 'selectAll',
        },
      ],
    },
    {
      label: t.menu.insert,
      submenu: [
        {
          label: t.menu.insertMenu.heading,
          submenu: [
            {
              label: t.menu.insertMenu.headingMenu.heading1,
              accelerator: process.platform === 'darwin' ? 'Ctrl+1' : 'Alt+1',
              click(menuItem, parentWindow) {
                parentWindow.webContents.send('insertMd-request', 'heading1');
              },
            },
            {
              label: t.menu.insertMenu.headingMenu.heading2,
              accelerator: process.platform === 'darwin' ? 'Ctrl+2' : 'Alt+2',
              click(menuItem, parentWindow) {
                parentWindow.webContents.send('insertMd-request', 'heading2');
              },
            },
            {
              label: t.menu.insertMenu.headingMenu.heading3,
              accelerator: process.platform === 'darwin' ? 'Ctrl+3' : 'Alt+3',
              click(menuItem, parentWindow) {
                parentWindow.webContents.send('insertMd-request', 'heading3');
              },
            },
            {
              label: t.menu.insertMenu.headingMenu.heading4,
              accelerator: process.platform === 'darwin' ? 'Ctrl+4' : 'Alt+4',
              click(menuItem, parentWindow) {
                parentWindow.webContents.send('insertMd-request', 'heading4');
              },
            },
            {
              label: t.menu.insertMenu.headingMenu.heading5,
              accelerator: process.platform === 'darwin' ? 'Ctrl+5' : 'Alt+5',
              click(menuItem, parentWindow) {
                parentWindow.webContents.send('insertMd-request', 'heading5');
              },
            },
            {
              label: t.menu.insertMenu.headingMenu.heading6,
              accelerator: process.platform === 'darwin' ? 'Ctrl+6' : 'Alt+6',
              click(menuItem, parentWindow) {
                parentWindow.webContents.send('insertMd-request', 'heading6');
              },
            },
          ],
        },
        {
          label: t.menu.insertMenu.format,
          submenu: [
            {
              label: t.menu.insertMenu.formatMenu.bold,
              accelerator: process.platform === 'darwin' ? 'Ctrl+b' : 'Alt+b',
              click(menuItem, parentWindow) {
                parentWindow.webContents.send('insertMd-request', 'bold');
              },
            },
            {
              label: t.menu.insertMenu.formatMenu.italic,
              accelerator: process.platform === 'darwin' ? 'Ctrl+i' : 'Alt+i',
              click(menuItem, parentWindow) {
                parentWindow.webContents.send('insertMd-request', 'italic');
              },
            },
            {
              label: t.menu.insertMenu.formatMenu.strikethrough,
              accelerator: process.platform === 'darwin' ? 'Ctrl+d' : 'Alt+d',
              click(menuItem, parentWindow) {
                parentWindow.webContents.send('insertMd-request', 'strikethrough');
              },
            },
          ],
        },
        {
          type: 'separator',
        },
        {
          label: t.menu.insertMenu.inlineCode,
          accelerator: process.platform === 'darwin' ? 'Ctrl+c' : 'Alt+c',
          click(menuItem, parentWindow) {
            parentWindow.webContents.send('insertMd-request', 'inlineCode');
          },
        },
        {
          label: t.menu.insertMenu.inlineMath,
          accelerator: process.platform === 'darwin' ? 'Ctrl+m' : 'Alt+m',
          click(menuItem, parentWindow) {
            parentWindow.webContents.send('insertMd-request', 'inlineMath');
          },
        },
        {
          type: 'separator',
        },
        {
          label: t.menu.insertMenu.codeBlock,
          accelerator: 'CmdOrCtrl+Alt+c',
          click(menuItem, parentWindow) {
            parentWindow.webContents.send('insertMd-request', 'codeBlock');
          },
        },
        {
          label: t.menu.insertMenu.mathBlock,
          accelerator: 'CmdOrCtrl+Alt+m',
          click(menuItem, parentWindow) {
            parentWindow.webContents.send('insertMd-request', 'mathBlock');
          },
        },
        {
          type: 'separator',
        },
        {
          label: t.menu.insertMenu.hyperlink,
          accelerator: process.platform === 'darwin' ? 'Ctrl+l' : 'Alt+l',
          click(menuItem, parentWindow) {
            parentWindow.webContents.send('insertMd-request', 'hyperlink');
          },
        },
        {
          label: t.menu.insertMenu.image,
          accelerator: process.platform === 'darwin' ? 'Ctrl+p' : 'Alt+p',
          click(menuItem, parentWindow) {
            parentWindow.webContents.send('insertMd-request', 'image');
          },
        },
        {
          label: t.menu.insertMenu.quote,
          accelerator: process.platform === 'darwin' ? 'Ctrl+q' : 'Alt+q',
          click(menuItem, parentWindow) {
            parentWindow.webContents.send('insertMd-request', 'quote');
          },
        },
        {
          type: 'separator',
        },
        {
          label: t.menu.insertMenu.horizontalRule,
          accelerator: process.platform === 'darwin' ? 'Ctrl+h' : 'Alt+h',
          click(menuItem, parentWindow) {
            parentWindow.webContents.send('insertMd-request', 'horizontalRule');
          },
        },
      ],
    },
    {
      label: t.menu.view,
      submenu: [
        {
          label: t.menu.viewMenu.editMode,
          accelerator: 'CmdOrCtrl+[',
          click(menuItem, parentWindow) {
            parentWindow.webContents.send('applyMode-request', 'edit');
          },
        },
        {
          label: t.menu.viewMenu.readMode,
          accelerator: 'CmdOrCtrl+]',
          click(menuItem, parentWindow) {
            parentWindow.webContents.send('applyMode-request', 'read');
          },
        },
        {
          label: t.menu.viewMenu.standardMode,
          accelerator: 'CmdOrCtrl+\\',
          click(menuItem, parentWindow) {
            parentWindow.webContents.send('applyMode-request', 'standard');
          },
        },
        {
          type: 'separator',
        },
        {
          label: t.menu.viewMenu.reload,
          role: 'reload',
        },
        {
          label: t.menu.viewMenu.toggleDevTools,
          role: 'toggleDevTools',
        },
        {
          type: 'separator',
        },
        {
          label: t.menu.viewMenu.resetZoom,
          role: 'resetZoom',
        },
        {
          label: t.menu.viewMenu.zoomIn,
          role: 'zoomIn',
          accelerator: 'CmdOrCtrl+=',
        },
        {
          label: t.menu.viewMenu.zoomOut,
          role: 'zoomOut',
          accelerator: 'CmdOrCtrl+-',
        },
      ],
    },
    {
      label: t.menu.window,
      submenu: [
        {
          label: t.menu.windowMenu.minimize,
          role: 'minimize',
        },
        {
          label: t.menu.windowMenu.toggleFullScreen,
          role: 'togglefullscreen',
        },
      ],
    },
    {
      label: t.menu.help,
      submenu: [
        {
          label: t.menu.helpMenu.about,
          click() {
            shell.openExternal('https://github.com/sparkmemo/editor');
          },
        },
        {
          label: t.menu.helpMenu.checkForUpdates,
          click() {
            shell.openExternal('https://github.com/sparkmemo/editor/releases');
          },
        },
      ],
    },
  ];
};
