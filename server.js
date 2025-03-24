const express = require('express');
const app = express();
const path = require('path');

// Serve static files from the root directory
app.use(express.static(__dirname));

// Specific route for the character image
app.get('/assets/character.jpg', (req, res) => {
    res.sendFile(path.join(__dirname, 'assets', 'character.jpg'));
});

// Start server
const port = 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 