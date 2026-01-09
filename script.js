// Stock configuration
const stocks = [
    { name: 'Amplitude', ticker: 'AMPL', searchTerm: 'Amplitude analytics' },
    { name: 'PubMatic', ticker: 'PUBM', searchTerm: 'PubMatic' },
    { name: 'BlackSky Technology', ticker: 'BKSY', searchTerm: 'BlackSky Technology' },
    { name: 'Serve Robotics', ticker: 'SERV', searchTerm: 'Serve Robotics' },
    { name: 'Magnite', ticker: 'MGNI', searchTerm: 'Magnite advertising' },
    { name: 'Credo Technology', ticker: 'CRDO', searchTerm: 'Credo Technology' },
    { name: 'Oklo Inc.', ticker: 'OKLO', searchTerm: 'Oklo nuclear' },
    { name: 'SoundHound AI', ticker: 'SOUN', searchTerm: 'SoundHound AI' },
    { name: 'Rocket Lab', ticker: 'RKLB', searchTerm: 'Rocket Lab space' }
];

// API configuration - use our backend
const API_BASE = '/api/news';

// Initialize the dashboard
async function initDashboard() {
    const stocksGrid = document.getElementById('stocksGrid');

    // Show loading state
    stocksGrid.innerHTML = '<div class="loading">Loading stock news...</div>';

    // Fetch news for all stocks
    await loadStockNews();
}

// Fetch news for all stocks
async function loadStockNews() {
    const stocksGrid = document.getElementById('stocksGrid');
    stocksGrid.innerHTML = '';

    for (const stock of stocks) {
        const stockCard = createStockCard(stock);
        stocksGrid.appendChild(stockCard);

        try {
            const articles = await fetchNewsForStock(stock);
            updateStockCard(stockCard, articles);
        } catch (error) {
            console.error(`Error fetching news for ${stock.name}:`, error);
            updateStockCard(stockCard, [], true);
        }
    }
}

// Fetch news from our backend
async function fetchNewsForStock(stock) {
    const params = new URLSearchParams({
        q: stock.searchTerm
    });

    const response = await fetch(`${API_BASE}?${params}`);
    const data = await response.json();

    if (data.status === 'ok') {
        // Remove duplicates by title and limit to available articles
        const seen = new Set();
        const uniqueArticles = data.articles.filter(article => {
            if (seen.has(article.title)) return false;
            seen.add(article.title);
            return true;
        });
        return uniqueArticles;
    } else {
        throw new Error(data.message || 'Failed to fetch news');
    }
}

// Create stock card HTML
function createStockCard(stock) {
    const card = document.createElement('div');
    card.className = 'stock-card';
    card.innerHTML = `
        <div class="stock-header">
            <div class="stock-name">${stock.name}</div>
            <div class="stock-ticker">${stock.ticker}</div>
        </div>
        <div class="news-articles">
            <div class="loading">Loading news...</div>
        </div>
    `;
    return card;
}

// Update stock card with articles
function updateStockCard(card, articles, hasError = false) {
    const newsContainer = card.querySelector('.news-articles');

    if (hasError) {
        newsContainer.innerHTML = '<div class="no-news">Unable to load news at this time</div>';
        return;
    }

    if (articles.length === 0) {
        newsContainer.innerHTML = '<div class="no-news">No recent news available</div>';
        return;
    }

    newsContainer.innerHTML = articles.map(article => createArticleHTML(article)).join('');
}

// Create article HTML
function createArticleHTML(article) {
    const date = new Date(article.publishedAt);
    const formattedDate = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    return `
        <div class="article">
            <div class="article-title">
                <a href="${article.url}" target="_blank" rel="noopener noreferrer" class="article-link">
                    ${article.title}
                </a>
            </div>
            <div class="article-meta">
                <span class="article-source">${article.source.name}</span>
                <span class="article-date">${formattedDate}</span>
            </div>
        </div>
    `;
}

// Load demo data when API key is not available
function loadDemoData() {
    const stocksGrid = document.getElementById('stocksGrid');

    stocks.forEach(stock => {
        const card = createStockCard(stock);
        stocksGrid.appendChild(card);

        // Create demo articles
        const demoArticles = [
            {
                title: `${stock.name} Reports Q4 Earnings Beat Expectations`,
                url: '#',
                source: { name: 'Demo News' },
                publishedAt: new Date().toISOString()
            },
            {
                title: `Analysts Upgrade ${stock.name} Stock Rating`,
                url: '#',
                source: { name: 'Demo Finance' },
                publishedAt: new Date(Date.now() - 86400000).toISOString()
            }
        ];

        updateStockCard(card, demoArticles);
    });
}

// Auto-refresh news every 15 minutes
function startAutoRefresh() {
    setInterval(() => {
        console.log('Refreshing news...');
        loadStockNews();
    }, 15 * 60 * 1000); // 15 minutes
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    initDashboard();
    startAutoRefresh();
});
