const express = require('express');
const fetch = require('node-fetch'); // Ensure this is installed
const app = express();

app.use(express.json());

app.post('/chat-response', async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    try {
        const apiKey = process.env.GROK_API_KEY; // Set this in your hosting platform
        const apiUrl = 'https://api.x.ai/v1/chat/completions'; // Verify the correct Grok endpoint

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'grok-2-latest', // Use the model you specified
                messages: [
                    { role: 'system', content: 'You are Grok, a helpful assistant.' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error('Grok API request failed');
        }

        const data = await response.json();
        const chatResponse = data.choices[0].message.content; // Adjust based on API response structure

        res.json({ response: chatResponse });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to get chat response' });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
