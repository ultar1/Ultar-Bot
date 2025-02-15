// Remove the hardcoded API key
// const API_KEY = 'AIzaSyDsvDWz-lOhuGyQV5rL-uumbtlNamXqfWM';

// Use environment variable instead
const API_KEY = process.env.GEMINI_API_KEY || 'YOUR_API_KEY';

document.addEventListener('DOMContentLoaded', () => {
    const chatContainer = document.getElementById('chatContainer');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    const newChatBtn = document.getElementById('newChatBtn');

    // Auto-resize textarea
    userInput.addEventListener('input', () => {
        userInput.style.height = 'auto';
        userInput.style.height = userInput.scrollHeight + 'px';
    });

    // Send message to Gemini API
    async function sendMessageToGemini(message) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: message
                        }]
                    }]
                })
            });

            const data = await response.json();
            return data.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error('Error:', error);
            return 'Sorry, I encountered an error. Please try again.';
        }
    }

    // Send message function
    async function sendMessage() {
        const message = userInput.value.trim();
        if (message === '') return;

        // Add user message
        addMessage(message, 'user');

        // Clear input
        userInput.value = '';
        userInput.style.height = 'auto';

        // Show typing indicator
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('message', 'bot-message');
        typingDiv.textContent = 'Typing...';
        chatContainer.appendChild(typingDiv);

        // Get response from Gemini
        const response = await sendMessageToGemini(message);
        
        // Remove typing indicator and add response
        chatContainer.removeChild(typingDiv);
        addMessage(response, 'bot');
    }

    // Add message to chat
    function addMessage(text, sender) {
        const messageContainer = document.createElement('div');
        messageContainer.classList.add('message-container');

        const avatar = document.createElement('div');
        avatar.classList.add('avatar', `${sender}-avatar`);
        avatar.textContent = sender === 'user' ? 'U' : 'B';  // Changed 'G' to 'B' for Bot

        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        messageDiv.textContent = text;

        if (sender === 'user') {
            messageContainer.appendChild(messageDiv);
            messageContainer.appendChild(avatar);
        } else {
            messageContainer.appendChild(avatar);
            messageContainer.appendChild(messageDiv);
        }

        chatContainer.appendChild(messageContainer);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    // Event listeners
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    newChatBtn.addEventListener('click', () => {
        chatContainer.innerHTML = `
            <div class="welcome-message">
                <h1>Ultar Bot</h1>
                <p>How can I help you today?</p>
            </div>
        `;
    });
});
