const API_KEY = 'AIzaSyDsvDWz-lOhuGyQV5rL-uumbtlNamXqfWM';  // Put the API key back for development

document.addEventListener('DOMContentLoaded', () => {
    const chatContainer = document.getElementById('chatContainer');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    const newChatBtn = document.getElementById('newChatBtn');

    // Add new element references
    const uploadBtn = document.getElementById('uploadBtn');
    const fileInput = document.getElementById('fileInput');
    const previewArea = document.getElementById('previewArea');
    let uploadedFiles = [];

    // Auto-resize textarea
    userInput.addEventListener('input', () => {
        userInput.style.height = 'auto';
        userInput.style.height = userInput.scrollHeight + 'px';
    });

    // File upload handling
    uploadBtn.addEventListener('click', () => fileInput.click());
    
    fileInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            const reader = new FileReader();
            
            reader.onload = (event) => {
                const fileData = {
                    name: file.name,
                    type: file.type,
                    data: event.target.result
                };
                uploadedFiles.push(fileData);
                displayFilePreview(fileData);
            };

            if (file.type.startsWith('image/')) {
                reader.readAsDataURL(file);
            } else {
                reader.readAsText(file);
            }
        });
    });

    function displayFilePreview(file) {
        const previewItem = document.createElement('div');
        previewItem.className = 'preview-item';

        if (file.type.startsWith('image/')) {
            const img = document.createElement('img');
            img.src = file.data;
            previewItem.appendChild(img);
        } else {
            const filePreview = document.createElement('div');
            filePreview.className = 'file-preview';
            filePreview.textContent = file.name;
            previewItem.appendChild(filePreview);
        }

        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-file';
        removeBtn.textContent = '×';
        removeBtn.onclick = () => {
            uploadedFiles = uploadedFiles.filter(f => f.name !== file.name);
            previewItem.remove();
        };

        previewItem.appendChild(removeBtn);
        previewArea.appendChild(previewItem);
    }

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

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('API Response:', data);  // Add this for debugging

            if (!data.candidates || !data.candidates[0]?.content?.parts[0]?.text) {
                throw new Error('Invalid response structure');
            }

            return data.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error('Error details:', error);  // Add detailed error logging
            return `Error: ${error.message}. Please try again.`;
        }
    }

    // Send message function
    async function sendMessage() {
        const message = userInput.value.trim();
        if (message === '' && uploadedFiles.length === 0) return;

        // Create message content
        let messageContent = message;
        if (uploadedFiles.length > 0) {
            messageContent += '\n[Attached files: ' + uploadedFiles.map(f => f.name).join(', ') + ']';
        }

        // Add user message
        addMessage(messageContent, 'user');

        // Add file previews to chat if they're images
        uploadedFiles.forEach(file => {
            if (file.type.startsWith('image/')) {
                const imgContainer = document.createElement('div');
                imgContainer.className = 'message-container';
                const img = document.createElement('img');
                img.src = file.data;
                img.style.maxWidth = '200px';
                img.style.borderRadius = '5px';
                imgContainer.appendChild(img);
                chatContainer.appendChild(imgContainer);
            }
        });

        // Clear input and files
        userInput.value = '';
        userInput.style.height = 'auto';
        uploadedFiles = [];
        previewArea.innerHTML = '';

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

    // Get or set username
    function initializeUsername() {
        let username = localStorage.getItem('username');
        if (!username) {
            username = prompt('Please enter your name:') || 'Guest';
            localStorage.setItem('username', username);
        }
        updateWelcomeMessage(username);
    }

    // Update welcome message with username
    function updateWelcomeMessage(username) {
        chatContainer.innerHTML = `
            <div class="welcome-message">
                <h1>Ultar Bot</h1>
                <p>Welcome back, ${username}! 👋</p>
                <p>How can I help you today?</p>
            </div>
        `;
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
        const username = localStorage.getItem('username') || 'Guest';
        updateWelcomeMessage(username);
    });

    // Initialize with username
    initializeUsername();
});
