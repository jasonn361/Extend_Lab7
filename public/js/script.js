document.addEventListener('DOMContentLoaded', () => {
    const roomName = document.getElementById('room-name').innerHTML;
    console.log(roomName);
    
    $('#nicknameModal').modal({
        keyboard: false,
        backdrop: 'static'
    });
    initializeChatroom(roomName);

    document.getElementById('search-form').addEventListener('submit', (e) => {
        e.preventDefault();
        searchMessages(roomName);
    });
});

let chatroomInitialized = false;
let chatroomInterval;

function initializeChatroom(roomName) {
    console.log('Initializing chatroom with room name:', roomName);

    if (chatroomInitialized) {
        clearInterval(chatroomInterval);
        removeEventListeners();
        return;
    }

    let nickname = '';

    loadMessages();

    function loadMessages() {
        console.log(`Getting messages in room '${roomName}'`);
        fetch(`/${roomName}/messages`)
            .then(response => response.json())
            .then(messages => {
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
                scrollToBottom(messagesDiv);
            });
    }

    function submitMessage(e) {
        e.preventDefault();
        const text = document.getElementById('text').value;
        fetch(`/${roomName}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nickname, text })
        })
        .then(() => {
            document.getElementById('text').value = '';
            loadMessages();
        });
    }

    document.getElementById('message-form').addEventListener('submit', submitMessage);
    document.getElementById('text').addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            document.getElementById('message-form').requestSubmit();
        }
    });

    document.getElementById('nickname-form').addEventListener('submit', (e) => {
        e.preventDefault();
        nickname = document.getElementById('nickname').value; $('#nicknameModal').modal('hide');
        updateNicknameDisplay(nickname);
    });

    $('#nicknameModal').modal({
        keyboard: false,
        backdrop: 'static'
    });

    chatroomInitialized = true;
    chatroomInterval = setInterval(loadMessages, 3000);

    function removeEventListeners() {
        document.getElementById('message-form').removeEventListener('submit', submitMessage);
    }

    function updateNicknameDisplay(nickname) {
        document.getElementById('nickname-display').innerText = `${nickname}`;
    }

    function scrollToBottom(element) {
        element.scrollTop = element.scrollHeight;
    }
}

async function searchMessages(roomName) {
    const searchQuery = document.getElementById('search').value;
    const response = await fetch(`/${roomName}/search?query=${encodeURIComponent(searchQuery)}`);
    const messages = await response.json();

    console.log(`Received ${messages.length} messages`);

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
