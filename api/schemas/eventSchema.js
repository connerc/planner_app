const mongoose = require('mongoose');

eventSchema = new mongoose.Schema({
    user: Number,
    date: String,
    color: String,
    data: String
});

module.exports = eventSchema;