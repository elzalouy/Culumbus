const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: false,
  },
  birthdate: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  socialID: {
    type: String,
    required: false,
  },
  socialType: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: true,
  },
  chat: {
    type: String,
    required: false,
  },
  chatID: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  startedChat: {
    type: Boolean,
    required: true,
  },
  data: {
    type: Schema.Types.ObjectId,
    ref: "Data",
  },
  FCM: { type: String, required: true },
});

module.exports = mongoose.model("User", userSchema);
