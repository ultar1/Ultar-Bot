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

    // Update addMessage function to include local timestamp
    function addMessage(text, sender) {
        const messageContainer = document.createElement('div');
        messageContainer.classList.add('message-container');

        const localTime = new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });

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
        timeDiv.textContent = localTime;

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

    // Add time-related keywords
    const timeKeywords = ['time', 'date', 'clock', 'hour', 'minute', 'today', 'now'];

    // Update sendMessageToGemini function
    async function sendMessageToGemini(message) {
        // Check if message is asking for time
        if (timeKeywords.some(keyword => message.toLowerCase().includes(keyword))) {
            return "I apologize, but I don't have real-time capabilities. Please check your device's clock for the current time and date.";
        }

        try {
            // Update the API endpoint to use Gemini 2.0 Flash
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2-flash:generateContent?key=${API_KEY}`;

            const response = await fetch(url, {
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

    // Simplified welcome message
    function updateWelcomeMessage() {
        const username = localStorage.getItem('username') || 'Guest';
        chatContainer.innerHTML = `
            <div class="welcome-message">
                <h1>Ultar Bot</h1>
                <p>Welcome back, ${username}! 👋</p>
                <p>How can I help you today?</p>
            </div>
        `;
    }

    // Initialize welcome message
    updateWelcomeMessage();

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

    // Improved mobile input handling
    userInput.addEventListener('focus', () => {
        if (isMobile()) {
            setTimeout(() => {
                window.scrollTo(0, document.body.scrollHeight);
            }, 300);
        }
    });

    // Helper function for mobile detection
    function isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
});
