// Import required modules
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // For making API calls

// Create an Express app
const app = express();

// Enable CORS to allow requests from your frontend
app.use(cors());

// Parse JSON bodies from frontend requests
app.use(express.json());

// Load environment variables (e.g., GROK_API_KEY)
require('dotenv').config();

// Define the port (Render sets PORT automatically)
const PORT = process.env.PORT || 5000;

// Endpoint to generate logo
app.post('/generate-logo', async (req, res) => {
  const { prompt } = req.body;

  // Check if prompt is provided
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    // Get the Grok API key from environment variables set in Render
    const apiKey = process.env.GROK_API_KEY;

    // Replace with the actual Grok API endpoint for image generation
    const apiUrl = 'https://api.x.ai/v1/generate-image'; // Example placeholder

    // Make a request to the Grok API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    const imageUrl = data.imageUrl; // Assuming the API returns { imageUrl: '...' }

    // Send the image URL back to the frontend
    res.json({ imageUrl });
  } catch (error) {
    console.error('Error generating logo:', error);
    res.status(500).json({ error: 'Failed to generate logo' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
