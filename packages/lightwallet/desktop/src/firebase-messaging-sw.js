// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');

const idb = indexedDB.open('_merit', 1);

idb.onupgradeneeded = () => {
  idb.result.createObjectStore('Notifications', { keyPath: 'timestamp' });
};

idb.onsuccess = () => {
  const db = idb.result;

  // Initialize the Firebase app in the service worker by passing in the
  // messagingSenderId.
  firebase.initializeApp({
    messagingSenderId: '1091326413792'
  });

  // Retrieve an instance of Firebase Messaging so that it can handle background
  // messages.
  const messaging = firebase.messaging();

  messaging.setBackgroundMessageHandler((data) => {
    console.log('[firebase-messaging-sw.js] Received background message ', data);
    const tx = db.transaction('Notifications', 'write');
    const store = tx.objectStore('Notifications');
    store.put({ timestamp: Date.now(), data });
  });
};
