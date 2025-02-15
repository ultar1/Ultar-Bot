// ...existing code...

    // Improved mobile input handling
    userInput.addEventListener('focus', () => {
        setTimeout(() => {
            window.scrollTo(0, document.body.scrollHeight);
        }, 300);
    });

    // Handle mobile submission
    userInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter' && !e.shiftKey && !isMobile()) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Helper function to detect mobile devices
    function isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

// ...existing code...
