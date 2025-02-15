const API_KEY = 'AIzaSyDsvDWz-lOhuGyQV5rL-uumbtlNamXqfWM';

document.addEventListener('DOMContentLoaded', () => {
    const chatContainer = document.getElementById('chatContainer');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');

    // Improved mobile input handling
    userInput.addEventListener('focus', () => {
        if (isMobile()) {
            setTimeout(() => {
                userInput.scrollIntoView({ behavior: 'smooth' });
            }, 300);
        }
    });

    // Fixed send message function
    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        // Add user message immediately
        addMessage(message, 'user');

        // Clear input
        userInput.value = '';
        userInput.style.height = 'auto';

        try {
            // Show typing indicator
            const typingDiv = document.createElement('div');
            typingDiv.classList.add('message-container');
            typingDiv.innerHTML = `
                <div class="avatar bot-avatar">B</div>
                <div class="message bot-message typing">Typing...</div>
            `;
            chatContainer.appendChild(typingDiv);

            // Get bot response
            const response = await sendMessageToGemini(message);
            
            // Remove typing indicator
            chatContainer.removeChild(typingDiv);
            
            // Add bot response
            addMessage(response, 'bot');

            // Scroll to bottom
            chatContainer.scrollTop = chatContainer.scrollHeight;

            // Hide keyboard on mobile
            if (isMobile()) {
                userInput.blur();
            }
        } catch (error) {
            console.error('Error:', error);
            addMessage('Sorry, I encountered an error. Please try again.', 'bot');
        }
    }

    // Simplified API call
    async function sendMessageToGemini(message) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;
        
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
        return data.candidates[0].content.parts[0].text;
    }

    // Updated event listeners
    sendBtn.addEventListener('click', () => {
        sendMessage();
    });

    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // File upload handling with error checking
    if (uploadBtn && fileInput) {
        uploadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            fileInput.click();
        });

        fileInput.addEventListener('change', (e) => {
            const files = Array.from(e.target.files || []);
            if (files.length === 0) return;

            files.forEach(file => {
                if (file.size > 5 * 1024 * 1024) { // 5MB limit
                    alert('File size too large. Please upload files smaller than 5MB.');
                    return;
                }

                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        displayFilePreview({
                            name: file.name,
                            type: file.type,
                            data: event.target.result
                        });
                    } catch (error) {
                        console.error('Error displaying file:', error);
                    }
                };

                if (file.type.startsWith('image/')) {
                    reader.readAsDataURL(file);
                } else {
                    reader.readAsText(file);
                }
            });
        });
    }

    // Helper function for mobile detection
    function isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
});
