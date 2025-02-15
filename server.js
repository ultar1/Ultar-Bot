const express = require('express');
const path = require('path');
const app = express();

// Serve static files
app.use(express.static('public'));

// API endpoint for key
app.get('/api/key', (req, res) => {
    res.json({ key: process.env.GEMINI_API_KEY || 'AIzaSyDsvDWz-lOhuGyQV5rL-uumbtlNamXqfWM' });
});

// Serve index.html for all routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
