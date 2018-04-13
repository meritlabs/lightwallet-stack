'use strict';
const electron = require('electron');
const path = require('path');
const url = require('url');

let mainWindow;

function createWindow() {
  mainWindow = new electron.BrowserWindow({
    width: 1280,
    height: 720,
    autoHideMenuBar: true
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

electron.app.on('ready', createWindow);

// Quit when all windows are closed.
electron.app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    electron.app.quit();
  }
});

electron.app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
