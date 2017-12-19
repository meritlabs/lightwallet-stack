const electron = require('electron');
const childProcess = require('child_process');
const path = require('path');
const url = require('url');
const fs = require('fs');

const app = electron.app;
const Menu = electron.Menu;
const BrowserWindow = electron.BrowserWindow;

const appName = 'Merit Wallet';

let mainWindow;
let menu;
let meritd;

function buildTemplate(app) {
  const template = [
      {
          role: 'window',
          submenu: [
              {role: 'minimize'},
              {role: 'close'}
          ]
      },
      {
        label: 'Mining',
        submenu: [
          {label: 'Miner State: Stopped', enabled: false, visible: true },
          {label: 'Miner State: Running', enabled: false, visible: false },
          {type: 'separator'},
          {
            label: 'Start Miner',
            click () { startMiner() },
          },
          {
            label: 'Stop Miner',
            enabled: false,
            click () { stopMiner() },
          },
        ]
      },
      {
          role: 'help',
          submenu: [
              {
              label: 'Learn More',
              click () { electron.shell.openExternal('https://merit.me') }
              }
          ]
      }
  ];

  if (process.platform === 'darwin') {
      template.unshift({
          label: appName,
          submenu: [
            {role: 'about'},
            {type: 'separator'},
            {role: 'services', submenu: []},
            {type: 'separator'},
            {role: 'hide'},
            {role: 'hideothers'},
            {role: 'unhide'},
            {type: 'separator'},
            {role: 'quit'}
          ]
      });
  }

  return template;
}

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
  });

  const menuTemplate = buildTemplate(app);
  menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
}

function getAppContents() {
  if ( process.platform === 'win32' ) {
    return path.join( app.getAppPath(), '/../' );
  }  else {
    return path.join( app.getAppPath(), '/../../' );
  }
}

function launchMeritd() {
  const meritBin = `${getAppContents().split(' ').join('\\ ')}meritd`;
  meritd = childProcess.spawn(`${meritBin} -testnet`, { detached: true, stdio: 'ignore', shell: true, });
  meritd.unref();
}

function execCliCommand(paramString) {
  const meritCliBin = `${getAppContents().split(' ').join('\\ ')}merit-cli`;
  const command = childProcess.spawn(`${meritCliBin} -testnet ${paramString}`, { shell: true, });

  command.stdout.on('data', (data) => {
    fs.writeFile("/tmp/test", data);
  });
  
  command.stderr.on('data', (data) => {
    fs.writeFile("/tmp/test", `Error: ${data}`);
  });
}

function startMiner() {
  // DUMMY
  fs.writeFile("/tmp/test", `Start Miner`);
  menu.items[2].submenu.items[0].visible = false;
  menu.items[2].submenu.items[1].visible = true;
  menu.items[2].submenu.items[3].enabled = false;
  menu.items[2].submenu.items[4].enabled = true;
}

function stopMiner() {
  // DUMMY
  fs.writeFile("/tmp/test", `Stop Miner`);
  menu.items[2].submenu.items[0].visible = true;
  menu.items[2].submenu.items[1].visible = false;
  menu.items[2].submenu.items[3].enabled = true;
  menu.items[2].submenu.items[4].enabled = false;
}

app.on('ready', function() {
  createWindow();
  launchMeritd();

  setTimeout(() => { execCliCommand('getblockchaininfo')  }, 10000);
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

app.on('before-quit', function () {
  if (meritd) {
    const signal = 'SIGKILL';
    
    fs.writeFile("/tmp/test", `\nProceess: ${meritd.pid}`);
    process.kill(meritd.pid, signal);
  }
});
