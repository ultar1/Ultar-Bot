const API_KEY = 'AIzaSyDsvDWz-lOhuGyQV5rL-uumbtlNamXqfWM';

document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const chatContainer = document.getElementById('chatContainer');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');

    // Add date and time display
    function updateDateTime() {
        const now = new Date();
        const dateTimeStr = now.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        // Add timestamp to messages
        const timestamp = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
        return { dateTimeStr, timestamp };
    }

    // Update addMessage function to include timestamp
    function addMessage(text, sender) {
        const messageContainer = document.createElement('div');
        messageContainer.classList.add('message-container');

        const { timestamp } = updateDateTime();

        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');

        const avatar = document.createElement('div');
        avatar.classList.add('avatar', `${sender}-avatar`);
        avatar.textContent = sender === 'user' ? 'U' : 'B';

        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        
        const textDiv = document.createElement('div');
        textDiv.textContent = text;
        
        const timeDiv = document.createElement('div');
        timeDiv.classList.add('message-time');
        timeDiv.textContent = timestamp;

        messageDiv.appendChild(textDiv);
        messageDiv.appendChild(timeDiv);

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

    // Update welcome message to include date and time
    function updateWelcomeMessage() {
        const { dateTimeStr } = updateDateTime();
        const username = localStorage.getItem('username') || 'Guest';
        chatContainer.innerHTML = `
            <div class="welcome-message">
                <h1>Ultar Bot</h1>
                <p>Welcome back, ${username}! 👋</p>
                <p>${dateTimeStr}</p>
                <p>How can I help you today?</p>
            </div>
        `;
    }

    // Initialize welcome message with date/time
    updateWelcomeMessage();

    // Update date/time every second
    setInterval(updateWelcomeMessage, 1000);

    // Basic API call
    async function sendMessageToGemini(message) {
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: message }] }]
                })
            });

            const data = await response.json();
            return data.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error('API Error:', error);
            return 'Sorry, I encountered an error.';
        }
    }

    // Send message handler
    async function handleSendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        // Add user message
        addMessage(message, 'user');
        userInput.value = '';

        // Show typing indicator
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('message-container');
        typingDiv.innerHTML = `
            <div class="avatar bot-avatar">B</div>
            <div class="message bot-message typing">Ultar's Bot is Typing...</div>
        `;
        chatContainer.appendChild(typingDiv);

        // Get bot response
        const response = await sendMessageToGemini(message);
        chatContainer.removeChild(typingDiv);
        addMessage(response, 'bot');
    }

    // Event listeners
    sendBtn.onclick = handleSendMessage;
    
    userInput.onkeypress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };
});
