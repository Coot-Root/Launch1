const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());

// Enable CORS (uncomment if frontend and backend domains differ)
// const cors = require('cors');
// app.use(cors());

const PORT = process.env.PORT || 5000; // Use Render's dynamic port or fallback to 5000

app.post('/chat-response', async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    try {
        const apiKey = process.env.GROK_API_KEY;
        if (!apiKey) {
            throw new Error('GROK_API_KEY is not set');
        }
        const apiUrl = 'https://api.x.ai/v1/chat/completions';

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'grok-2-latest', // Verify this model with xAI docs
                messages: [
                    { role: 'system', content: 'You are Grok, a helpful assistant.' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error(`Grok API request failed: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('API Response:', data); // Log for debugging
        const chatResponse = data.choices[0].message.content; // Adjust if structure differs

        res.json({ response: chatResponse });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Failed to get chat response' });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
