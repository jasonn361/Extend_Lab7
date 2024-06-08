const Chatroom = require('../models/Chatroom');
const Message = require('../models/Message');

async function getRoom(request, response) {
    const { roomName } = request.params;
    const chatroom = await Chatroom.findOne({ roomName });
    if (!chatroom) {
        return response.status(404).send('Chatroom not found');
    }

    response.render('room', { title: 'Chatroom', roomName });
}

async function getMessages(request, response) {
    const { roomName } = request.params;
    const messages = await Message.find({ roomName }).sort({ datetime: 1 });
    response.json(messages);
}

async function postMessage(request, response) {
    const { roomName } = request.params;
    const { nickname, text } = request.body;

    const newMessage = new Message({ roomName, nickname, text });
    await newMessage.save();
    response.sendStatus(200);
}

module.exports = {
    getRoom,
    getMessages,
    postMessage
};
