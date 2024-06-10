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
    console.log(`Getting messages in room '${roomName}'`);
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

async function searchMessages(request, response) {
    const { roomName } = request.params;
    const { query } = request.query;

    console.log(`Search in room '${roomName}' for query '${query}'`);

    try {
        const messages = await Message.find({
            roomName,
            text: { $regex: `^${query}$`, $options: 'i' }
        }).sort({ datetime: 1 });

        console.log(`Found ${messages.length} messages for query '${query}' in room '${roomName}'`);

        response.json(messages);
    } catch (error) {
        console.error('Error searching messages:', error);
        response.status(500).send("Error processing search request");
    }
}


module.exports = {
    getRoom,
    getMessages,
    postMessage,
    searchMessages
};
