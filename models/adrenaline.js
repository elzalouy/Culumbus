const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const adrenalineSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    images:{
        type: [],
        required: true
    },
    price:{
        type: String,
        required: true,
    },
    duration:{
        type: String,
        reqired: true
    }
  
});

module.exports = mongoose.model('Events', adrenalineSchema);