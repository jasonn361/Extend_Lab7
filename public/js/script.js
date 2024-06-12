const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

document.addEventListener("DOMContentLoaded", () => {
  const roomName = document.getElementById("room-name").innerHTML;
  console.log(roomName);

  initializeChatroom(roomName);

  document.getElementById("search-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const searchQuery = document.getElementById("search").value.trim();

    if (!searchQuery) {
      return;
    } else {
      searchMessages(roomName, searchQuery);
    }
  });

  document.getElementById("clear-search").addEventListener("click", () => {
    // Clear the search input
    document.getElementById("search").value = "";
    // Hide and clear the search results
    const searchResultsDiv = document.getElementById("search-results");
    searchResultsDiv.style.display = "none";
    searchResultsDiv.innerHTML = "";

    // Remove the classes from the respective elements
    const messagesDiv = document.getElementById("messages");
    const contentContainer = document.getElementById("content-container");

    messagesDiv.classList.remove("col-md-7");
    contentContainer.classList.remove("row", "justify-content-between");
  });
});

let chatroomInitialized = false;
let chatroomInterval;

function initializeChatroom(roomName) {
  console.log("Initializing chatroom with room name:", roomName);

  if (chatroomInitialized) {
    clearInterval(chatroomInterval);
    removeEventListeners();
    return;
  }

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
      const currentNickname = JSON.parse(localStorage.getItem("loggedInUser")).username;
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

  async function handleEditMessage(event) {
    const messageElement = event.target.closest(".message");
    const messageId = messageElement.getAttribute("data-id");
    const newText = prompt(
      "Edit your message:",
      messageElement.querySelector(".message-text").innerText
    );
    if (newText) {
      try {
        const response = await fetch(`/messages/${messageId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: newText,
            nickname: JSON.parse(localStorage.getItem("loggedInUser")).username,
          }),
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
  }

  async function handleDeleteMessage(event) {
    const messageElement = event.target.closest(".message");
    const messageId = messageElement.getAttribute("data-id");
    try {
      const response = await fetch(`/messages/${messageId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nickname: JSON.parse(localStorage.getItem("loggedInUser")).username,
        }),
      });
      if (response.ok) {
        loadMessages();
      } else {
        console.error("Failed to delete message:", await response.text());
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  }

  function submitMessage(e) {
    e.preventDefault();

    const text = document.getElementById("text").value;
    const nickname = JSON.parse(localStorage.getItem("loggedInUser")).username;
    fetch(`/${roomName}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nickname, text }),
    }).then(() => {
      document.getElementById("text").value = "";
      loadMessages();
    });
  }

  document
    .getElementById("message-form")
    .addEventListener("submit", submitMessage);
  document.getElementById("text").addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      document.getElementById("message-form").requestSubmit();
    }
  });

  chatroomInitialized = true;
  chatroomInterval = setInterval(loadMessages, 3000);

  function removeEventListeners() {
    document
      .getElementById("message-form")
      .removeEventListener("submit", submitMessage);
  }

  function updateNicknameDisplay(nickname) {
    document.getElementById(
      "nickname-display"
    ).innerText = `Nickname: ${nickname}`;
  }

  function scrollToBottom(element) {
    element.scrollTop = element.scrollHeight;
  }
}

async function searchMessages(roomName, searchQuery) {
  const response = await fetch(
    `/${roomName}/search?query=${encodeURIComponent(searchQuery)}`
  );
  const messages = await response.json();

  console.log(`Received ${messages.length} messages`);

  const messagesDiv = document.getElementById("messages");
  const searchResultsDiv = document.getElementById("search-results");
  const contentContainer = document.getElementById("content-container");

  messagesDiv.classList.add("col-md-7");
  contentContainer.classList.add("row", "justify-content-around");
  searchResultsDiv.style.display = "block";

  if (messages.length > 0) {
    searchResultsDiv.innerHTML = messages
      .map(
        (message, index) =>
          `<div class="message ${index % 2 === 0 ? "even" : "odd"}">
                <div class="message-header">
                    <div>
                        <p><strong>${message.nickname}</strong>:</p>
                        <span class="message-text">${message.text.replace(
                          /\n/g,
                          "<br>"
                        )}</span>
                    </div>
                    <span class="message-timestamp">${new Date(
                      message.datetime
                    ).toLocaleString()}</span>
                </div>
            </div>`
      )
      .join("");
  } else {
    searchResultsDiv.innerHTML =
      '<div class="message">No messages found.</div>';
  }
}
