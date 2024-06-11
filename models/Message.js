const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    roomName: { type: String, required: true },
    nickname: { type: String, required: true },
    text: { type: String, required: true },
    datetime: { type: Date, default: Date.now },
    edited: { type: Boolean, default: false }
});

module.exports = mongoose.model('Message', messageSchema);
