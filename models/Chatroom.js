const mongoose = require('mongoose');

const chatroomSchema = new mongoose.Schema({
    roomName: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('Chatroom', chatroomSchema);
