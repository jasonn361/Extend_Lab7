const Chatroom = require("../models/Chatroom");
const Message = require("../models/Message");

async function getRoom(request, response) {
  const { roomName } = request.params;
  const chatroom = await Chatroom.findOne({ roomName });
  if (!chatroom) {
    return response.status(404).send("Chatroom not found");
  }

  response.render("room", {
    title: "Chatroom",
    roomName,
    nickname: request.query.nickname,
  });
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
      text: { $regex: query, $options: "i" },
    }).sort({ datetime: 1 });

    console.log(
      `Found ${messages.length} messages for query '${query}' in room '${roomName}'`
    );

    response.json(messages);
  } catch (error) {
    console.error("Error searching messages:", error);
    response.status(500).send("Error processing search request");
  }
}

async function deleteMessage(request, response) {
  const { messageId } = request.params;
  const { nickname } = request.body;
  const message = await Message.findById(messageId);

  if (message.nickname === nickname) {
    await Message.findByIdAndDelete(messageId);
    response.sendStatus(200);
  } else {
    response
      .status(403)
      .send("Forbidden: You can only delete your own messages.");
  }
}

async function editMessage(request, response) {
  const { messageId } = request.params;
  const { text, nickname } = request.body;
  const message = await Message.findById(messageId);

  if (message.nickname === nickname) {
    message.text = text;
    message.edited = true;
    await message.save();
    response.sendStatus(200);
  } else {
    response
      .status(403)
      .send("Forbidden: You can only edit your own messages.");
  }
}

module.exports = {
  getRoom,
  getMessages,
  postMessage,
  searchMessages,
  deleteMessage,
  editMessage,
};
