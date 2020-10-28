const webPush = require('web-push');

const vapidKeys = {
   "publicKey": "BBFZLjvizFoF6qX79KTXyQNwr2F30f684clKHQ5yit4tj6QMrGdcl4x-nExLZ7KsdS9jM4sYR_dG_MkFiZmRlKA",
   "privateKey": "_89QD3v6iuPmH26g4hFCXBFZWX1jlS67G-XGk1wD1DM"
};

webPush.setVapidDetails(
   'mailto:example@yourdomain.org',
   vapidKeys.publicKey,
   vapidKeys.privateKey
);

var pushSubscription = {
   "endpoint": "https://fcm.googleapis.com/fcm/send/dB4xNQybMFA:APA91bFU-kysZ9rDo860Wm9gGVppjkWQS4K35lRj8OQPTjkH0kK_0kdEgkEnLW59zoBJWWOF0BIJRhQCzIn5AVIo25xY8N4Ff0KBvyRMTWBlfxoMkAVIAfyiKMWxvTCbMY3q1507zfiw",
   "keys": {
       "p256dh": "BJgAOopcYbDOCWFtEZeCbspmKYThdSDs93MqHTeIZTYmSGsTnIyKNlYYQVeodw1bHuPIdFv/uxFpJkxUWkflppk=",
       "auth": "mSEF40RvIZ+nStfVlQWXTw=="
   }
};

var payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!';

var options = {
   gcmAPIKey: '196273722426',
   TTL: 60
};
webPush.sendNotification(
   pushSubscription,
   payload,
   options
);