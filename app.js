const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');
const ejs = require('ejs');
const exampleMiddleware = require('./middleware');
const contactRoute = require('./routes/contact'); // Corrected path
const recycleRoute = require('./routes/recycle'); // Corrected path
const signupRoute = require('./routes/signup'); // Corrected path

dotenv.config(); // Load environment variables from .env

const app = express();

// Set up view engine (EJS)
app.set('view engine', 'ejs');
app.use(express.static('public')); // Serve static files (CSS, images)

// Middleware
app.use(exampleMiddleware);
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// CORS configuration (adjust as needed for production)
app.use(cors());

// Routes
app.get('/', (req, res) => {
    res.render('home', { title: 'Home' });  // Render the home.ejs view
});

app.use('/contact', contactRoute); // Use the contact route
app.use('/recycle', recycleRoute); // Use the recycle route
app.use('/signup', signupRoute); // Use the signup route


// Gemini API Proxy Route
app.post('/generate', async (req, res) => {
    const promptText = req.body.prompt;
    const apiKey = process.env.GEMINI_API_KEY; // Access API key from environment variable
    const model = 'gemini-1.5-pro-latest'; // Or your preferred model

    if (!apiKey) {
        return res.status(500).json({ error: 'Gemini API key not configured on the server.' });
    }

    if (!promptText) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const data = {
        contents: [{
            parts: [{ text: promptText }]
        }]
    };

    try {
        const response = await axios.post(url, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.data.candidates && response.data.candidates.length > 0) {
            res.json({ response: response.data.candidates[0].content.parts[0].text });
        } else {
            res.status(500).json({ error: 'No response from the model' });
        }
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        res.status(500).json({ error: error.message });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});