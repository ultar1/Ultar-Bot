const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();

// Serve static files from the public directory
app.use(express.static('public'));

// API endpoint to get the key
app.get('/api/key', (req, res) => {
    res.json({ key: process.env.GEMINI_API_KEY });
});

// Handle all other routes by serving index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
