const client = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
module.exports = async () => {
  
  // let response = await client.chat.credentials
  //   .create({
  //     apiKey: process.env.TWILIO_API_KEY,
  //     friendlyName: "FCM Credentials",
  //     type: "fcm",
  //     secret:
  //   })
  //   .then((credentials) => console.log("credentials", credentials));
  client.chat
    .services(process.env.TWILIO_CHAT_SERVICE_SID)
    .update({
      "notifications.NewMessage.enabled": true,
      "notifications.NewMessage.sound": "default",
      "notifications.addedToChannel.template":
        "A New message in ${CHANNEL} from ${USER}: ${MESSAGE}",
    })
    .then((service) => console.log("service", service));
};