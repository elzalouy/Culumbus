const admin = require("firebase-admin");
var serviceAccount = require("../culumbus-d97c4-firebase-adminsdk-p413l-b9aaa9cfa5.json");

module.exports = {
  send: async (message, token) => {
    await admin.messaging().send({
      notification: {
        title: message.title,
        body: message.body,
        imageUrl: message.imageUrl,
      },
      token: token,
    });
  },
  initialize: () => {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  },
};
