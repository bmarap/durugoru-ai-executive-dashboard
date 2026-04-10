const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const FILE_PATH = path.join(__dirname, 'user_feedback.json');

app.use(cors());
app.use(express.json());

// Ensure the local file exists with an empty array if missing
const initFile = async () => {
    try {
        await fs.access(FILE_PATH);
    } catch {
        await fs.writeFile(FILE_PATH, JSON.stringify([]));
    }
};

initFile();

// GET all feedback
app.get('/api/feedback', async (req, res) => {
    try {
        const data = await fs.readFile(FILE_PATH, 'utf8');
        res.json(JSON.parse(data));
    } catch (err) {
        console.error('Error reading feedback file:', err);
        res.status(500).json({ error: 'Failed to read feedback data' });
    }
});

// POST feedback
app.post('/api/feedback', async (req, res) => {
    const { server_name, reason, timestamp } = req.body;
    
    if (!server_name || !reason) {
        return res.status(400).json({ error: 'server_name and reason are required' });
    }

    try {
        const data = await fs.readFile(FILE_PATH, 'utf8');
        let feedbacks = JSON.parse(data || '[]');
        
        // Find existing to upsert
        const existingIndex = feedbacks.findIndex(f => f.server_name === server_name);
        if (existingIndex >= 0) {
            feedbacks[existingIndex] = { server_name, reason, timestamp: timestamp || new Date().toISOString() };
        } else {
            feedbacks.push({ server_name, reason, timestamp: timestamp || new Date().toISOString() });
        }
        
        await fs.writeFile(FILE_PATH, JSON.stringify(feedbacks, null, 2));
        res.status(200).json({ success: true });
    } catch (err) {
        console.error('Error writing feedback file:', err);
        res.status(500).json({ error: 'Failed to write feedback data' });
    }
});

app.listen(PORT, () => {
    console.log(`Feedback API running on port ${PORT}`);
});
