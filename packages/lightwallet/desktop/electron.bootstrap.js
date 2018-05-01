const nn = require('node-notifier');
const { ipcRenderer } = require('electron');

const showNotification = (title, message = ' ') => {
  nn.notify({
    title,
    message,
    wait: true
  });
};

nn.on('click', () => {
  ipcRenderer.send('notificationClick', true);
});

window['electron'] = {
  showNotification
};
