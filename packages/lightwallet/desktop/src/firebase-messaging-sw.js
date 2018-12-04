// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');

const idb = indexedDB.open('_ionicstorage', 2);

idb.onsuccess = () => {
  const db = idb.result;

  // Initialize the Firebase app in the service worker by passing in the
  // messagingSenderId.
  firebase.initializeApp({
    messagingSenderId: '1091326413792',
  });

  // Retrieve an instance of Firebase Messaging so that it can handle background
  // messages.
  const messaging = firebase.messaging();

  const originalShowNotification = self.registration.showNotification;
  const originalMatchAllClients = self.clients.matchAll;

  // override the matchall function
  // so when we click on a notification, we always open any window
  // that we have open, instead of opening a new one.
  self.clients.matchAll = () =>
    originalMatchAllClients.apply(self.clients, [{ type: 'window', includeUncontrolled: true }]).then(clients => {
      if (clients && clients.length) {
        clients = clients.map(client => {
          Object.defineProperty(client, 'url', {
            get: () => location.origin,
            enumerable: true,
            configurable: true,
          });
          return client;
        });
      }
      return clients;
    });

  const onBackgroundNotification = data => {
    if (!data) return;
    console.log('[firebase-messaging-sw.js] Received background message ', data);
    const tx = db.transaction('_ionickv', 'readwrite');
    const store = tx.objectStore('_ionickv');
    store.get('notifications').onsuccess = ({ target: { result: doc } }) => {
      doc = doc || [];
      doc.push({
        ...data,
        timestamp: Date.now(),
        read: false,
      });
      store.put(doc, 'notifications');
    };
  };

  // Firebase calls this method instead of the background message handler, so we need to intercept it to catch the date~
  self.registration.showNotification = (title, details) => {
    onBackgroundNotification(details.data.FCM_MSG.data);
    return originalShowNotification.apply(self.registration, [title, details]);
  };

  messaging.setBackgroundMessageHandler(payload => {
    if (payload && payload.data) {
      onBackgroundNotification(payload.data);
    }
  });
};
