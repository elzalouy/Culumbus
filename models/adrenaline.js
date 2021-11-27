const mongoose = require("mongoose");
const city = require("./city");

const Schema = mongoose.Schema;

const adrenalineSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: {
    type: [],
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    reqired: true,
  },
  city: {
    type: mongoose.Types.ObjectId,
    ref: city.modelName,
    reqired: true,
  },
});

module.exports = mongoose.model("Events", adrenalineSchema);
