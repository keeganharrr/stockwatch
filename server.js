const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

const NEWS_API_KEY = '91c13d23b4184585a2253c9fe48fdf0e';
const NEWS_API_BASE = 'https://newsapi.org/v2/everything';
const CACHE_FILE = path.join(__dirname, 'cache.json');
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

// Load cache from file on startup
let cache = {};
try {
    if (fs.existsSync(CACHE_FILE)) {
        cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
    }
} catch (e) {
    cache = {};
}

// Save cache to file
function saveCache() {
    try {
        fs.writeFileSync(CACHE_FILE, JSON.stringify(cache));
    } catch (e) {
        console.error('Error saving cache:', e);
    }
}

app.use(cors());
app.use(express.static(path.join(__dirname)));

// API endpoint to fetch news for a stock
app.get('/api/news', async (req, res) => {
    const { q } = req.query;

    if (!q) {
        return res.status(400).json({ error: 'Search term (q) is required' });
    }

    // Check if we have cached data that's still fresh
    if (cache[q] && Date.now() - cache[q].timestamp < CACHE_DURATION) {
        return res.json(cache[q].data);
    }

    try {
        const params = new URLSearchParams({
            q: q,
            apiKey: NEWS_API_KEY,
            pageSize: 2,
            sortBy: 'publishedAt',
            language: 'en'
        });

        const response = await fetch(`${NEWS_API_BASE}?${params}`);
        const data = await response.json();

        // Store in cache if successful
        if (data.status === 'ok') {
            cache[q] = {
                data: data,
                timestamp: Date.now()
            };
            saveCache();
        } else if (cache[q]) {
            // API failed but we have old cached data - return it
            return res.json(cache[q].data);
        }

        res.json(data);
    } catch (error) {
        console.error('Error fetching news:', error);
        // If API fails but we have cached data, return it
        if (cache[q]) {
            return res.json(cache[q].data);
        }
        res.status(500).json({ error: 'Failed to fetch news' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
