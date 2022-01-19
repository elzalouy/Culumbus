const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const userScema = new Schema({
  FCM: { type: String, required: true },
  id: { type: String, required: true },
});
const channelsSchema = new Schema({
  user: [userScema],
  channelSid: { type: String, required: true },
});

module.exports = mongoose.model("Channels", channelsSchema);