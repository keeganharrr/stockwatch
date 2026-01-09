# Stock News Dashboard

A beautiful, responsive stock news dashboard that displays real-time news articles for your favorite stocks.

## Features

- 📈 Real-time news updates for 9 stocks
- 🎨 Modern, visually accessible design
- 📱 Fully responsive layout
- ♿ WCAG accessibility compliant
- 🔄 Auto-refreshes every 15 minutes
- 🎯 2 latest articles per stock

## Stocks Included

1. Amplitude (AMPL)
2. PubMatic (PUBM)
3. BlackSky Technology (BKSY)
4. Serve Robotics (SERV)
5. Magnite (MGNI)
6. Credo Technology (CRDO)
7. Oklo Inc. (OKLO)
8. SoundHound AI (SOUN)
9. Rocket Lab (RKLB)

## Setup Instructions

### Option 1: Demo Mode (No API Key)
Simply open `index.html` in your browser. The site will display demo data.

### Option 2: Live News (Requires API Key)

1. **Get a free NewsAPI key:**
   - Visit https://newsapi.org/
   - Sign up for a free account
   - Copy your API key

2. **Add API key to the project:**
   - Open `script.js`
   - Find the line: `const NEWS_API_KEY = 'YOUR_API_KEY_HERE';`
   - Replace `YOUR_API_KEY_HERE` with your actual API key
   - Save the file

3. **Open the dashboard:**
   - Open `index.html` in your web browser
   - News will automatically load for all stocks

## Files

- `index.html` - Main HTML structure
- `styles.css` - Styling and theme
- `script.js` - JavaScript logic and API integration
- `README.md` - This file

## Browser Compatibility

Works on all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Accessibility Features

- High contrast mode support
- Reduced motion support
- Keyboard navigation friendly
- Screen reader compatible
- Semantic HTML structure

## Customization

### Add More Stocks
Edit the `stocks` array in `script.js`:

```javascript
const stocks = [
    { name: 'Company Name', ticker: 'TICK', searchTerm: 'Company Name' },
    // Add more stocks here
];
```

### Change Refresh Interval
Modify the interval in `script.js` (default is 15 minutes):

```javascript
setInterval(() => {
    loadStockNews();
}, 15 * 60 * 1000); // Time in milliseconds
```

### Color Theme
Adjust colors in `styles.css`. Main brand colors:
- Primary: `#667eea`
- Secondary: `#764ba2`

## Notes

- NewsAPI free tier allows 100 requests per day
- Each page load makes 9 requests (one per stock)
- Auto-refresh is set to 15 minutes to conserve API calls
- News articles link to original sources

## License

Free to use and modify for personal and commercial projects.
