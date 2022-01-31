const config = require("config");
const winston = require("winston");
const nodemailer = require("nodemailer");
module.exports = function () {
  
  //Configuration
  if (
    !config.has("TWILIO_ACCOUNT_SID") ||
    !config.has("TWILIO_AUTH_TOKEN") ||
    !config.has("TWILIO_API_KEY") ||
    !config.has("TWILIO_API_SECRET") ||
    !config.has("TWILIO_CHAT_SERVICE_SID") ||
    !config.has("FCM_CREDENTIALS_SID")
  ) {
    console.log(
      "FATAL ERROR: you must set the environment variables that are related to the configuration file."
    );
    winston.error(
      "FATAL ERROR: you must set the environment variables that are related to the configuration file."
    );
  }
};
