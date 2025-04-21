importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBm_CiCwn8yZCBXM29RnvO0hnYoHNhsAIE",
  authDomain: "notifikasi-shahaba.firebaseapp.com",
  projectId: "notifikasi-shahaba",
  messagingSenderId: "306837572369",
  appId: "1:306837572369:web:a6818d93a6a9db3b37dab0",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  const { title, body } = payload.notification;
  self.registration.showNotification(title, {
    body,
    icon: "/assets/icons/logopresensi192.png",
  });
});
