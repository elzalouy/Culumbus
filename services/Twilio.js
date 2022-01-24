const config = require("config");
const client = require("twilio")(
  config.get("TWILIO_ACCOUNT_SID"),
  config.get("TWILIO_AUTH_TOKEN")
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
    .services(config.get("TWILIO_CHAT_SERVICE_SID"))
    .update({
      "notifications.NewMessage.enabled": true,
      "notifications.NewMessage.sound": "default",
      "notifications.addedToChannel.template":
        "A New message in ${CHANNEL} from ${USER}: ${MESSAGE}",
    })
    .then((service) => console.log("service", service));
};
