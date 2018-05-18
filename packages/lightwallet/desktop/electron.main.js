'use strict';
const { BrowserWindow, app, protocol, ipcMain } = require('electron');
const path = require('path');
const url = require('url');


let mainWindow;

function createWindow() {
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
  });

  const URL = url.format({
    pathname: path.resolve(__dirname, './dist/index.html'),
    protocol: 'file:',
    slashes: true
  });

  mainWindow.loadURL(URL);
  mainWindow.maximize();

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
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
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
