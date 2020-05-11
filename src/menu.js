const { app, shell } = require('electron');
const path = require('path');
const langPack = require('./i18n/lang.js');

module.exports.buildMenuTemplate = function (locale) {
  // console.log(`${locale} from menu.js`);
  // t -> translation
  const t = langPack[locale];
  return [
    {
      label: t.menu.file,
      submenu: [
        {
          label: t.menu.fileMenu.open,
          accelerator: 'CmdOrCtrl+o',
          click(menuItem, window) {
            //
          },
        },
        {
          label: t.menu.fileMenu.save,
          accelerator: 'CmdOrCtrl+s',
          click(menuItem, window) {
            //
          },
        },
        {
          label: t.menu.fileMenu.saveAs,
          accelerator: 'CmdOrCtrl+shift+s',
          click(menuItem, window) {
            //
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
                //
              },
            },
          ],
        },
        {
          type: 'separator',
        },
        {
          label: t.menu.fileMenu.settings,
          accelerator: 'CmdOrCtrl+,',
          click(menuIte, parentWindow) {
            //
          },
        },
        {
          type: 'separator',
        },
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
              accelerator: 'Alt+1',
              click(menuItem, parentWindow) {
                //
              },
            },
            {
              label: t.menu.insertMenu.headingMenu.heading2,
              accelerator: 'Alt+2',
              click(menuItem, parentWindow) {
                //
              },
            },
            {
              label: t.menu.insertMenu.headingMenu.heading3,
              accelerator: 'Alt+3',
              click(menuItem, parentWindow) {
                //
              },
            },
            {
              label: t.menu.insertMenu.headingMenu.heading4,
              accelerator: 'Alt+4',
              click(menuItem, parentWindow) {
                //
              },
            },
            {
              label: t.menu.insertMenu.headingMenu.heading5,
              accelerator: 'Alt+5',
              click(menuItem, parentWindow) {
                //
              },
            },
            {
              label: t.menu.insertMenu.headingMenu.heading6,
              accelerator: 'Alt+6',
              click(menuItem, parentWindow) {
                //
              },
            },
          ],
        },
        {
          label: t.menu.insertMenu.format,
          submenu: [
            {
              label: t.menu.insertMenu.formatMenu.bold,
              accelerator: 'Alt+b',
              click(menuItem, parentWindow) {
                //
              },
            },
            {
              label: t.menu.insertMenu.formatMenu.italic,
              accelerator: 'Alt+i',
              click(menuItem, parentWindow) {
                //
              },
            },
            {
              label: t.menu.insertMenu.formatMenu.strikethrough,
              accelerator: 'Alt+d',
              click(menuItem, parentWindow) {
                //
              },
            },
          ],
        },
        {
          type: 'separator',
        },
        {
          label: t.menu.insertMenu.inlineCode,
          accelerator: 'Alt+c',
          click(menuItem, parentWindow) {
            //
          },
        },
        {
          label: t.menu.insertMenu.inlineMath,
          accelerator: 'Alt+m',
          click(menuItem, parentWindow) {
            //
          },
        },
        {
          type: 'separator',
        },
        {
          label: t.menu.insertMenu.codeBlock,
          accelerator: 'CmdOrCtrl+Alt+c',
          click(menuItem, parentWindow) {
            //
          },
        },
        {
          label: t.menu.insertMenu.mathBlock,
          accelerator: 'CmdOrCtrl+Alt+m',
          click(menuItem, parentWindow) {
            //
          },
        },
        {
          type: 'separator',
        },
        {
          label: t.menu.insertMenu.hyperlink,
          accelerator: 'Alt+l',
          click(menuItem, parentWindow) {
            //
          },
        },
        {
          label: t.menu.insertMenu.image,
          accelerator: 'Alt+p',
          click(menuItem, parentWindow) {
            //
          },
        },
        {
          label: t.menu.insertMenu.quote,
          accelerator: 'Alt+q',
          click(menuItem, parentWindow) {
            //
          },
        },
        {
          type: 'separator',
        },
        {
          label: t.menu.insertMenu.orderedList,
          accelerator: 'Alt+o',
          click(menuItem, parentWindow) {
            //
          },
        },
        {
          label: t.menu.insertMenu.unorderedList,
          accelerator: 'Alt+u',
          click(menuItem, parentWindow) {
            //
          },
        },
        {
          type: 'separator',
        },
        {
          label: t.menu.insertMenu.horizontalRule,
          accelerator: 'Alt+h',
          click(menuItem, parentWindow) {
            //
          },
        },
      ],
    },
    {
      label: t.menu.view,
      submenu: [
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
            shell.openExternal('https://sparkmemo.com/editor');
          },
        },
        {
          label: t.menu.helpMenu.checkForUpdates,
          click() {
            shell.openExternal('https://github.com/sparkmemo/editor');
          },
        },
      ],
    },
  ];
};
