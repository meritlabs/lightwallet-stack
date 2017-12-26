const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');

const appName = 'Merit Wallet';

let mainWindow;

function createWindow() {
  // iPhone X logical dimentions
  // not resizable and frameless
  mainWindow = new BrowserWindow({
    width: 768,
    height: 1024,
    title: appName,
    resizable: false,
    movable: true,
  });

  const startUrl = url.format({
    pathname: path.join(__dirname, '/../www/index.html'),
    protocol: 'file:',
    slashes: true
  });

  mainWindow.setTitle('Merit Wallet');

  mainWindow.loadURL(startUrl);

  mainWindow.on('closed', function () {
    mainWindow = null;
    app.quit();
  })
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
});
