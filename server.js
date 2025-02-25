const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());
require('dotenv').config();

const PORT = process.env.PORT || 5000;

app.post('/generate-logo', async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    try {
        const apiKey = process.env.GROK_API_KEY;
        const apiUrl = 'https://api.x.ai/v1/images/generations'; // Placeholder; update with real endpoint

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                prompt,
                n: 1,
                size: '1024x1024' // High-resolution output
            })
        });

        if (!response.ok) {
            throw new Error('Grok API request failed');
        }

        const data = await response.json();
        const imageUrl = data.data[0].url; // Adjust based on actual API response

        res.json({ imageUrl });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to generate logo' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
