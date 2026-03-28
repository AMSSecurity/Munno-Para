// firebase-messaging-sw.js
// This file MUST be named exactly "firebase-messaging-sw.js"
// and placed in the ROOT of your GitHub repo (same folder as index.html)
// It handles background push notifications when the app is closed

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBbTOumW81sugPgASGoP4EDCo5Yv9ntQv0",
  authDomain: "ams-security---munno-para.firebaseapp.com",
  projectId: "ams-security---munno-para",
  storageBucket: "ams-security---munno-para.firebasestorage.app",
  messagingSenderId: "911636742865",
  appId: "1:911636742865:web:344ee071bc52dd44823bf0"
});

const messaging = firebase.messaging();

// Handle background messages (app closed or minimised)
messaging.onBackgroundMessage(function(payload) {
  console.log('Background message received:', payload);

  const title = payload.notification?.title || '📋 New Shift Note';
  const body  = payload.notification?.body  || 'A new shift note has been posted.';

  self.registration.showNotification(title, {
    body:    body,
    icon:    '/Munno-Para/icon-192.png',
    badge:   '/Munno-Para/icon-192.png',
    tag:     'shift-note',
    renotify: true,
    data:    payload.data || {},
    actions: [
      { action: 'view', title: '👁 View Note' }
    ]
  });
});

// Handle notification click — open/focus the portal
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const url = 'https://amssecurity.github.io/Munno-Para/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      // Focus existing tab if open
      for (const client of clientList) {
        if (client.url.includes('Munno-Para') && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open a new tab
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
