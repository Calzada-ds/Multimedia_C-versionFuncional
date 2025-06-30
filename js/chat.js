document.addEventListener("DOMContentLoaded", () => {
  const chatMessages = document.getElementById("chat-messages");
  const userMessageInput = document.getElementById("user-message");
  const sendMessageBtn = document.getElementById("send-message");

  if (!chatMessages || !userMessageInput || !sendMessageBtn) return;

  // Function to add a message to the chat
  function addMessage(text, isUser = false) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${isUser ? "user" : "bot"}`;

    const contentDiv = document.createElement("div");
    contentDiv.className = "message-content";

    const paragraph = document.createElement("p");
    paragraph.textContent = text;

    contentDiv.appendChild(paragraph);
    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);

    // Scroll to the bottom of the chat
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Function to send the message to the server (PHP) and get the response from Convai
  function getBotResponse(userMessage) {
    // Enviar la solicitud AJAX al servidor PHP
    fetch('chatbot.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `message=${encodeURIComponent(userMessage)}`
    })
    .then(response => response.text())
    .then(data => {
      // Mostrar la respuesta del bot en el chat
      addMessage(data);
    })
    .catch(error => {
      console.error("Error:", error);
      addMessage("Lo siento, hubo un error. Intenta de nuevo.");
    });
  }

  // Event listener for send button
  sendMessageBtn.addEventListener("click", () => {
    const message = userMessageInput.value.trim();
    if (message) {
      // Add user message to chat
      addMessage(message, true);

      // Clear input field
      userMessageInput.value = "";

      // Get the bot response from Convai API via PHP backend
      setTimeout(() => {
        getBotResponse(message);
      }, 500);
    }
  });

  // Event listener for Enter key
  userMessageInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendMessageBtn.click();
    }
  });
});
