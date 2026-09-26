# Blaq Studios — Official Website

> **Live Website:** [https://blaqstudios.github.io](https://blaqstudios.github.io)  
> **Studio Focus:** Independent game development crafting focused, distraction-free spatial logic puzzles and reflex arcade experiences for Web and Mobile.

---

## 🎮 Featured Titles

- **[Shikaku](https://blaqstudios.github.io/games/shikaku/)**: A pure logic Japanese puzzle game where players partition numerical grids into rectangles. Includes responsive web gameplay, full release history, and legal policies.
- **[Flux Wall](https://blaqstudios.github.io/games/flux-wall/)**: A minimalist, high-speed reflex arcade game where reality shifts every 25 points—flipping gravity, inverting controls, and testing reaction speed.

---

## 📂 Repository Directory Structure

```text
blaqstudios.github.io/
├── index.html                   # Studio homepage with game portfolio and studio mission
├── app-ads.txt                  # Authorized digital sellers specification for mobile ads
├── README.md                    # Repository documentation and development guide
│
├── games/                       # Game landing pages, legal policies, and changelogs
│   ├── shikaku/                 # Shikaku logic puzzle game suite
│   │   ├── index.html           # Shikaku interactive showcase & web player
│   │   ├── changelog.html       # Dynamic release history page
│   │   ├── privacy-policy.html  # Legal privacy documentation
│   │   └── terms-and-conditions.html # Terms of service
│   │
│   └── flux-wall/               # Flux Wall arcade reflex game suite
│       ├── index.html           # Flux Wall game landing page
│       ├── changelog.html       # Version history
│       ├── privacy-policy.html  # Privacy policy
│       └── terms-and-conditions.html # Terms of service
│
├── data/                        # Static datasets and changelog feeds
│   ├── shikaku-versions.json    # Machine-readable JSON array of releases
│   └── shikaku-versions.js      # Global script fallback (window.SHIKAKU_VERSIONS_DATA)
│
├── styles/                      # Modular CSS architecture
│   ├── base.css                 # Global design tokens, navbar, footer, typography, cards
│   ├── home.css                 # Studio homepage specific layout and hero sections
│   ├── shikaku.css              # Shikaku branding and game-specific layout styling
│   └── flux-wall.css            # Flux Wall neon theme and game-specific styling
│
├── scripts/                     # Client-side scripts
│   ├── main.js                  # Global navigation, ambient glow, mobile menu, ripple effects
│   └── changelog.js             # Dual-mode changelog renderer (Fetch API + global fallback)
│
└── .agents_plans/               # Modular audit, performance, and maintenance plans
```

---

## 🚀 Local Development & Preview

The site is built with **Vanilla HTML5, Modern CSS, and Vanilla JavaScript** with zero compilation or build dependencies. 

Because the changelog dynamic loader uses the browser `fetch()` API to read `data/shikaku-versions.json`, running directly over the `file://` protocol may trigger browser CORS restrictions. To preview the site locally with full functionality, serve the root directory over a local HTTP server:

### Option 1: Python (Built-in)
```bash
# Python 3
python -m http.server 8000
```
Then navigate to `http://localhost:8000` in your web browser.

### Option 2: Node.js / npx
```bash
# Using 'serve'
npx serve .

# Or using 'http-server'
npx http-server . -p 8000
```

### Option 3: VS Code Live Server
Right-click [index.html](index.html) and select **"Open with Live Server"**.

---

## 📝 Version Changelog Update Guidelines

To guarantee 100% reliability both when served over HTTP/HTTPS and when accessed offline or in restricted webview environments, release history is maintained with **Dual-File Parity**:

1. **`data/shikaku-versions.json`**: Primary JSON feed consumed asynchronously via `fetch()` on web servers.
2. **`data/shikaku-versions.js`**: Synchronous global script defining `window.SHIKAKU_VERSIONS_DATA`. This acts as an immediate zero-latency fallback when CORS or offline restrictions prevent asynchronous network requests.

### How to Publish a New Release Note:

Whenever adding a new version entry (e.g. `v1.2.2`), update **BOTH** files with identical data:

#### 1. In `data/shikaku-versions.json`:
```json
[
  {
    "version": "1.2.2",
    "title": "Performance & Stability Update",
    "date": "2026-10-01",
    "highlights": [
      "Optimized grid rendering for low-end mobile devices",
      "Fixed timer alignment issue on high-DPI displays"
    ]
  },
  ...
]
```

#### 2. In `data/shikaku-versions.js`:
```javascript
window.SHIKAKU_VERSIONS_DATA = [
  {
    "version": "1.2.2",
    "title": "Performance & Stability Update",
    "date": "2026-10-01",
    "highlights": [
      "Optimized grid rendering for low-end mobile devices",
      "Fixed timer alignment issue on high-DPI displays"
    ]
  },
  ...
];
```

---

## 🎨 Design & Architecture System

- **Typography**: 
  - Brand & Headings: `Fredoka` (Google Fonts, weights 400–700) for approachable, rounded geometry.
  - Body & UI: `Inter` (Google Fonts, weights 400–600) for clean readability.
- **Color Palette & Accents**:
  - Dark Theme Foundation: Deep void backgrounds (`#0d0c1d`, `#16152b`) with purple/violet ambient highlights (`#7928ca`, `#c77dff`).
  - Card Containers: Glassmorphic borders and semi-transparent panels with backdrop filters.
- **Performance & SEO**:
  - Zero heavy third-party framework overhead.
  - Complete OpenGraph, Twitter Card, and Google-friendly meta tags on all game and legal pages.
  - Passive event listeners and hardware-accelerated transforms for jitter-free 60fps scrolling.

---

## 📬 Contact & Support

- **Email**: [aaljinantony@gmail.com](mailto:aaljinantony@gmail.com)
- **Publisher**: Blaq Studios
- **GitHub**: [https://github.com/blaqstudios/blaqstudios.github.io](https://github.com/blaqstudios/blaqstudios.github.io)
