const nn = require('node-notifier');
const { ipcRenderer } = require('electron');
const { join } = require('path');

const icon = join(__dirname, 'build/1024x1024.png')

const showNotification = (title, message = ' ') => {
  nn.notify({
    title,
    message,
    wait: true,
    sound: true,
    icon
  });
};

nn.on('click', () => {
  ipcRenderer.send('notificationClick', true);
});

window['electron'] = {
  showNotification
};
