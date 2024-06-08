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
        const response = await fetch(`/${roomName}/messages`);
        const messages = await response.json();
        const messagesDiv = document.getElementById('messages');
        messagesDiv.innerHTML = messages.map((message, index) => 
            `<div class="message ${index % 2 === 0 ? 'even' : 'odd'}">
                <div class="message-header">
                    <div>
                        <p><strong>${message.nickname}</strong>:</p>
                        <span class="message-text">${message.text.replace(/\n/g, '<br>')}</span>
                    </div>
                    <span class="message-timestamp">${new Date(message.datetime).toLocaleString()}</span>
                </div>
            </div>`
        ).join('');
    };

    const updateNicknameDisplay = (nickname) => {
        document.getElementById('nickname-display').innerText = `Nickname: ${nickname}`;
    };

    const submitMessage = async (e) => {
        e.preventDefault();
        const text = document.getElementById('text').value;

        await fetch(`/${roomName}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nickname, text })
        });

        document.getElementById('text').value = '';
        loadMessages();
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
