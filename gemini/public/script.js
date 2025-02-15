// Replace the hardcoded API key with a fetch to get it from the server
async function getApiKey() {
    try {
        const response = await fetch('/api/key');
        const data = await response.json();
        return data.key;
    } catch (error) {
        console.error('Error fetching API key:', error);
        return null;
    }
}

// Update the sendMessageToGemini function
async function sendMessageToGemini(message) {
    const API_KEY = await getApiKey();
    if (!API_KEY) {
        return 'Error: Could not access API key';
    }
    // ...existing code...
}

// ...existing code...
