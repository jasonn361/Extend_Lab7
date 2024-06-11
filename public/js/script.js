document.addEventListener('DOMContentLoaded', () => {
    const roomNameElement = document.getElementById('roomName');
    if (roomNameElement) {
        const roomName = roomNameElement.textContent.split(': ')[1];
        initializeChatroom(roomName);
    }
});

let chatroomInitialized = false;
let chatroomInterval;

function initializeChatroom(roomName) {
    if (chatroomInitialized) {
        clearInterval(chatroomInterval);
        removeEventListeners();
    }

    let nickname = '';

    const loadMessages = async () => {
        try {
            const response = await fetch(`/${roomName}/messages`);
            const messages = await response.json();
            renderMessages(messages);
        } catch (error) {
            console.error("Error loading messages:", error);
        }
    };

    const renderMessages = (messages) => {
        const currentNickname = document.getElementById('currentNickname').value;
        const messagesDiv = document.getElementById('messages');
        messagesDiv.innerHTML = messages.map((message, index) => 
            `<div class="message ${index % 2 === 0 ? 'even' : 'odd'}" data-id="${message._id}">
                <div class="message-header d-flex justify-content-between align-items-center">
                    <div>
                        <p><strong>${message.nickname}</strong>:</p>
                        <span class="message-text">${message.text.replace(/\n/g, '<br>')}</span>
                        ${message.edited ? '<span class="edited">(edited)</span>' : ''}
                    </div>
                    <div class="ml-auto">
                        ${message.nickname === currentNickname ? 
                            `<button class="btn btn-primary btn-sm edit-button">Edit</button>
                             <button class="btn btn-danger btn-sm delete-button">Delete</button>` 
                            : ''}
                    </div>
                </div>
                <span class="message-timestamp">${new Date(message.datetime).toLocaleString()}</span>
            </div>`
        ).join('');

        document.querySelectorAll('.edit-button').forEach(button => {
            button.addEventListener('click', handleEditMessage);
        });

        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', handleDeleteMessage);
        });
    };

    const handleEditMessage = async (event) => {
        const messageElement = event.target.closest('.message');
        const messageId = messageElement.getAttribute('data-id');
        const newText = prompt('Edit your message:', messageElement.querySelector('.message-text').innerText);
        if (newText) {
            try {
                const response = await fetch(`/messages/${messageId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ text: newText, nickname: document.getElementById('currentNickname').value })
                });
                if (response.ok) {
                    loadMessages();
                } else {
                    console.error("Failed to edit message:", await response.text());
                }
            } catch (error) {
                console.error("Error editing message:", error);
            }
        }
    };

    const handleDeleteMessage = async (event) => {
        const messageElement = event.target.closest('.message');
        const messageId = messageElement.getAttribute('data-id');
        try {
            const response = await fetch(`/messages/${messageId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nickname: document.getElementById('currentNickname').value })
            });
            if (response.ok) {
                loadMessages();
            } else {
                console.error("Failed to delete message:", await response.text());
            }
        } catch (error) {
            console.error("Error deleting message:", error);
        }
    };

    const submitMessage = async (e) => {
        e.preventDefault();
        const text = document.getElementById('text').value;
        const nickname = document.getElementById('currentNickname').value;

        try {
            const response = await fetch(`/${roomName}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nickname, text })
            });
            if (response.ok) {
                document.getElementById('text').value = '';
                loadMessages();
            } else {
                console.error("Failed to post message:", await response.text());
            }
        } catch (error) {
            console.error("Error posting message:", error);
        }
    };

    document.getElementById('message-form').addEventListener('submit', submitMessage);
    document.getElementById('text').addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            document.getElementById('message-form').requestSubmit();
        }
    });

    document.getElementById('nickname-form').addEventListener('submit', (e) => {
        e.preventDefault();
        nickname = document.getElementById('nickname').value;
        document.getElementById('currentNickname').value = nickname; // Set nickname in hidden input
        $('#nicknameModal').modal('hide');
        updateNicknameDisplay(nickname);
    });

    $('#nicknameModal').modal({
        keyboard: false,
        backdrop: 'static'
    });

    chatroomInitialized = true;
    chatroomInterval = setInterval(loadMessages, 3000);
    loadMessages();

    function removeEventListeners() {
        document.getElementById('message-form').removeEventListener('submit', submitMessage);
    }
}

const updateNicknameDisplay = (nickname) => {
    document.getElementById('nickname-display').innerText = `Nickname: ${nickname}`;
};
