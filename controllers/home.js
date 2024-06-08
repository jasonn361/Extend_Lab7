const Chatroom = require('../models/Chatroom');
const roomGenerator = require('../util/roomIdGenerator');

async function getHome(request, response) {
    try {
        const chatrooms = await Chatroom.find().lean(); // Add .lean() to get plain JS objects
        response.render('home', { title: 'Home', chatrooms });
    } catch (error) {
        console.error("Error fetching chatrooms:", error);
        response.status(500).send("Internal Server Error");
    }
}

async function createRoom(request, response) {
    let { roomName } = request.body;
    if (!roomName) {
        roomName = roomGenerator.roomIdGenerator();
    }

    const newRoom = new Chatroom({ roomName });
    await newRoom.save();
    response.redirect(`/${roomName}`);
}

module.exports = {
    getHome,
    createRoom
};
