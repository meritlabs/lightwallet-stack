const electron = require('electron');
const childProcess = require('child_process');
const path = require('path');
const url = require('url');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const appName = 'Merit Wallet';

let mainWindow;
let meritd;

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

  mainWindow.setTitle(appName);

  mainWindow.loadURL(startUrl);

  mainWindow.on('closed', function () {
    mainWindow = null;
    app.quit();
  })
}

function getAppContents() {
  if ( process.platform === 'win32' ) {
    return path.join( app.getAppPath(), '/../' );
  }  else {
    return path.join( app.getAppPath(), '/../../' );
  }
}

function launchMeritd() {
  let fs = require('fs');
  let meritBin = `${getAppContents().split(' ').join('\\ ')}meritd`;
  meritd = childProcess.spawn(`${meritBin} -testnet`, { detached: true, stdio: 'ignore', shell: true, });
  meritd.unref();
}

app.on('ready', function() {
  createWindow();
  launchMeritd();
});

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
