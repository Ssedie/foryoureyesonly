# 💝 Valentine's Card - HTML/CSS/JS Edition

A sweet and romantic interactive Valentine's Day card with heart-catching mini-game built with pure HTML, CSS, and JavaScript!

## Files Included

- `index.html` - Main HTML structure
- `style.css` - All styling and animations
- `script.js` - Game logic and interactivity

## Features

✨ **LocalStorage Persistence**
- Saves game progress in browser
- Resume where you left off even after closing the tab
- Tracks score, game state, and answers

💖 **Interactive Elements**
- Heart-catching mini-game (must catch 10 hearts)
- Beautiful animations and effects
- Funny multiple choice answers
- The "No" button runs away on hover!

🎨 **Design**
- Sweet romantic blue gradient theme
- Floating heart animations
- Sparkle effects
- Celebration confetti on "Yes"

## How to Use

### Option 1: Simple Double-Click (Easiest!)

1. Download all three files (`index.html`, `style.css`, `script.js`)
2. Put them in the same folder
3. Double-click `index.html`
4. It will open in your default browser!

### Option 2: Using a Local Server

If you want to test it like a real website:

**Using Python:**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Using Node.js:**
```bash
npx http-server
```

Then open: `http://localhost:8000`

### Option 3: Web Hosting

Upload all three files to any web hosting service:
- GitHub Pages (free!)
- Netlify (free!)
- Vercel (free!)
- Any traditional web host

## File Structure

```
valentine-card/
│
├── index.html      # Main page structure
├── style.css       # All styles and animations
└── script.js       # Game logic and interactions
```

**Important:** All three files must be in the same folder for the page to work correctly!

## How It Works

### LocalStorage Features

The application uses browser localStorage to track:
- **Score**: Number of hearts caught (0-10)
- **Game State**: Whether game started/completed
- **Answer**: User's response to the Valentine question
- **Progress**: Automatically resumes from where they left off

### Flow

1. **Initial Screen**: Welcome message
2. **Heart-Catching Game**: Interactive mini-game (catch 10 hearts)
3. **The Question**: "Will You Be My Valentine?" with 3 options
4. **Final Screen**: Response based on their answer

### Answer Options

- **Yes! 💕**: Celebration with confetti and sweet message
- **Maybe... 🤔**: Playfully encourages them to say yes
- **No...**: Button runs away on hover until it's off-screen!

## The "No" Button Behavior

The "No" button is extra playful:
1. **Runs away when you hover over it** (no need to click!)
2. **Keeps moving** away from your mouse cursor
3. **Spins while running** for extra fun effect
4. **Eventually disappears** off-screen
5. **Auto-submits "no"** once it's completely gone

## Customization Ideas

### Change Messages

Open `index.html` and find the messages you want to change:

```html
<p class="message">
    Before I ask you something important...<br>
    Let's see if you can catch my heart first! 💕
</p>
```

### Adjust Game Difficulty

Open `script.js` and find:
```javascript
if (GameState.score >= 10) {
```
Change `10` to any number!

### Change Colors

Open `style.css` and modify:
```css
background: linear-gradient(135deg, #ffeef8 0%, #ffe0f0 50%, #ffd4e8 100%);
```

### Change "No" Button Speed

In `script.js`, find:
```javascript
const moveDistance = 150;
```
Higher number = moves farther away each time!

## Sharing Your Card

### Method 1: Send Files
Zip all three files and send them. The recipient just needs to extract and open `index.html`.

### Method 2: Host Online (Recommended!)

**Using GitHub Pages (Free & Easy):**

1. Create a GitHub account
2. Create a new repository
3. Upload all three files
4. Go to Settings → Pages
5. Enable GitHub Pages
6. Share the URL: `https://yourusername.github.io/repository-name/`

**Using Netlify (Even Easier!):**

1. Go to [netlify.com](https://netlify.com)
2. Drag and drop your folder
3. Get instant URL to share!

### Method 3: Local Network

If you're on the same WiFi:
1. Run a local server (see Option 2 above)
2. Find your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
3. Share: `http://your-ip:8000`

## Browser Compatibility

Works on all modern browsers:
- ✅ Chrome
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

**Problem**: Hearts not falling or buttons not working
- **Solution**: Make sure all three files are in the same folder
- Check browser console (F12) for errors

**Problem**: Progress not saving
- **Solution**: Some browsers block localStorage in file:// mode
- Use a local server (Option 2) or host it online

**Problem**: Styles not loading
- **Solution**: Verify `style.css` is in the same folder as `index.html`
- Check that the filename is exactly `style.css` (case-sensitive on some systems)

**Problem**: JavaScript not working
- **Solution**: Verify `script.js` is in the same folder
- Make sure JavaScript is enabled in your browser

## Privacy Note

All data is stored locally in the browser (localStorage). Nothing is sent to any server. The recipient's answers stay private on their device!

## Clear Saved Data

To reset everything:
1. Click the "🔄 Restart" button, OR
2. Open browser console (F12) and type:
   ```javascript
   localStorage.removeItem('valentineGameState');
   location.reload();
   ```

## Credits

Made with 💖 for Valentine's Day

Enjoy and good luck! 🥰

## License

Free to use and customize for personal Valentine's cards! 💕
