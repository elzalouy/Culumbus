const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const codeSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    expire_at: {
        type: Date,
        default: Date.now, 
        expires: 600
    } 
});

module.exports = mongoose.model('ForgetCodes', codeSchema);