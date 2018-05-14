const { ipcRenderer } = require('electron');

const showNotification = (title, message = ' ') => {
  ipcRenderer.send('showNotification', {
    title,
    message,
    wait: true,
    sound: true
  });
};

window['electron'] = {
  showNotification
};
