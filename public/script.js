document.addEventListener('DOMContentLoaded', () => {
    // Improved mobile input handling
    userInput.addEventListener('focus', () => {
        if (isMobile()) {
            setTimeout(() => {
                userInput.scrollIntoView({ behavior: 'smooth' });
            }, 300);
        }
    });

    // Send message function with simplified mobile handling
    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        try {
            // Add user message
            addMessage(message, 'user');

            // Clear input
            userInput.value = '';
            userInput.style.height = 'auto';

            // Show typing indicator
            const typingDiv = document.createElement('div');
            typingDiv.classList.add('message', 'bot-message', 'typing');
            typingDiv.textContent = 'Typing...';
            chatContainer.appendChild(typingDiv);

            // Get response from API
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
        }
    }

    // Event listeners with improved mobile support
    sendBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
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
