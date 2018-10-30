'use strict';

const { BrowserWindow, app, protocol, ipcMain, shell, Menu } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const url = require('url');
const log = require('electron-log');

// Configure logger
log.transports.console.level = 'silly';
log.transports.file.level = 'silly';

// Configure auto updater
autoUpdater.logger = log;
autoUpdater.autoDownload = false;

const appName = 'Merit Lightwallet';

let mainWindow;

function buildMenuTemplate() {
  const template = [
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'pasteandmatchstyle' },
        { role: 'delete' },
        { role: 'selectall' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forcereload' },
        { type: 'separator' },
        { role: 'resetzoom' },
        { role: 'zoomin' },
        { role: 'zoomout' },
        { type: 'separator' }
      ]
    },
    {
      role: 'window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' },
        { role: 'toggledevtools' }
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click() { shell.openExternal('https://www.merit.me'); }
        }
      ]
    }
  ];

  if (process.platform === 'darwin') {
    template.unshift({
      label: appName,
      submenu: [
        { role: 'about', label: `About ${appName}` },
        { type: 'separator' },
        { role: 'services', submenu: [] },
        { type: 'separator' },
        { role: 'hide', label: `Hide ${appName}` },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit', label: `Quit ${appName}` }
      ]
    });
  }

  return template;
}

function createWindow() {
  log.verbose('Creating BrowserWindow object');

  protocol.interceptFileProtocol('file', (request, cb) => {
    const { dir, base } = path.parse(request.url);

    let after;

    if (dir.includes('assets'))
      after = path.resolve(__dirname, 'dist', 'assets', dir.split(/assets\/?/).pop(), base);
    else
      after = path.resolve(__dirname, 'dist', base);

    cb(after);
  });

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    autoHideMenuBar: true,
    webPreferences: {
      devTools: true
    }
  });

  const URL = url.format({
    pathname: path.resolve(__dirname, './dist/index.html'),
    protocol: 'file:',
    slashes: true
  });

  mainWindow.webContents.on('new-window', function(event, url){
    event.preventDefault();
    shell.openExternal(url);
  });

  mainWindow.loadURL(URL);
  mainWindow.maximize();

  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  const menuTemplate = buildMenuTemplate();
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
}

ipcMain.on('notificationClick', () => {
  // maximize & focus window when the user clicks on the notification
  if (mainWindow) {
    mainWindow.maximize();
    mainWindow.focus();
  }
});

app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  log.verbose('App activated');
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
