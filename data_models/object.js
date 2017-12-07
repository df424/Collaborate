
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    content: {type: String, required: true},
    in_use: {type: Boolean, required: true},
});

module.exports = mongoose.model('ColabObject', schema);
