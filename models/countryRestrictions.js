const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const countryRestrictionsSchema = new Schema({
    country:{
        type: String,
        required: true
    },
    openForEgyptians: {
        type: Boolean,
        required: true
    },
    pcr:{
        value:{
            type:Boolean
        },
        label:{
            type:String
        },
    },
    vaccination: {
        value:{
            type:Boolean
        },
        label:{
            type:String
        },
    },
    doses: {
        type: String,
        required: true
    },
    quarantine: {
        type: String,
        required: false
    },
    travelForm: {
        type: String,
        required: true
    },
    travelBetweenRegions:{
        type: Boolean,
        required: false
    },
    shops:{
        type: String,
        required: true
    },
    restaurants:{
        type: String,
        required: true
    },
    touristicPlaces:{
        type: String,
        required: true
    },
    publicTransport:{
        type: String,
        ref: 'Data',
    },
    visaApplying:{
        type: String,
        ref: 'Data',
    }
});

module.exports = mongoose.model('CountryRestrictions', countryRestrictionsSchema);