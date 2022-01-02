const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const globalFieldsSchema = new Schema({
    LastUpdatedAt: {
        type: String,
    },
});

module.exports = mongoose.model('GlobalFields', globalFieldsSchema);