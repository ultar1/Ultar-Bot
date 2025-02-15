// ...existing code...

    // Improved mobile input handling
    userInput.addEventListener('focus', () => {
        if (isMobile()) {
            setTimeout(() => {
                userInput.scrollIntoView({ behavior: 'smooth' });
            }, 300);
        }
    });

    // Send button handler
    sendBtn.addEventListener('click', (e) => {
        e.preventDefault();
        sendMessage();
    });

    // Handle mobile and desktop submission
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            if (!e.shiftKey) {
                e.preventDefault();
                if (!isMobile()) {
                    sendMessage();
                }
            }
        }
    });

    // Helper function to detect mobile devices
    function isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // Update the sendMessage function
    async function sendMessage() {
        const message = userInput.value.trim();
        if (message === '' && uploadedFiles.length === 0) return;

        // Add user message
        addMessage(message, 'user');

        // Clear input and reset height
        userInput.value = '';
        userInput.style.height = 'auto';

        // Unfocus input on mobile to hide keyboard
        if (isMobile()) {
            userInput.blur();
        }

        // ...rest of the sendMessage function...
    }

// ...existing code...
