const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const citySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  images: {
    type: [],
    required: true,
  },
});

module.exports = mongoose.model("City", citySchema);
