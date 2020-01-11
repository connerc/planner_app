const mongoose = require('mongoose');

colorSchema = new mongoose.Schema({
    user: Number,
    color: String,
    label: String
});

module.exports = colorSchema;