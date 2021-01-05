var admin = require("firebase-admin");

var serviceAccount = require("../eventsity-server-firebase-adminsdk-v70gn-e7accb0065.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'eventsity-server.appspot.com',
});

module.exports.admin = admin;