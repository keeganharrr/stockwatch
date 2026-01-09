const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

const NEWS_API_KEY = '91c13d23b4184585a2253c9fe48fdf0e';
const NEWS_API_BASE = 'https://newsapi.org/v2/everything';

app.use(cors());
app.use(express.static(path.join(__dirname)));

// API endpoint to fetch news for a stock
app.get('/api/news', async (req, res) => {
    const { q } = req.query;

    if (!q) {
        return res.status(400).json({ error: 'Search term (q) is required' });
    }

    try {
        const params = new URLSearchParams({
            q: q,
            apiKey: NEWS_API_KEY,
            pageSize: 3,
            sortBy: 'publishedAt',
            language: 'en'
        });

        const response = await fetch(`${NEWS_API_BASE}?${params}`);
        const data = await response.json();

        res.json(data);
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ error: 'Failed to fetch news' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
