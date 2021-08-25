const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const hotelOffersSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    images:{
        type: [],
        required: true
    },
    offer:{
        type: Number,
        required: true,
    },

});

module.exports = mongoose.model('HotelOffers', hotelOffersSchema);