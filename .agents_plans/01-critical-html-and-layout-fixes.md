# Plan 01: Critical HTML & Layout Fixes

> **Target File:** `.agents_plans/01-critical-html-and-layout-fixes.md`  
> **Priority:** P0 (Critical / High)  
> **Risk Level:** Low (Static markup only, isolated blast radius)  
> **Dependencies:** None (Execute first)

---

## 1. Problem Overview & Scope

This plan addresses immediate structural markup errors, broken CSS grid hierarchies, invisible navigation bars, and 404 dead links across the public-facing HTML pages. These issues directly degrade usability, cause layout breakage on desktop, and present malformed HTML in production.

All fixes in this plan are strictly scoped to static HTML markup. No shared CSS stylesheets or global JavaScript logic are touched, guaranteeing zero cross-component regression.

---

## 2. Issues & Root Cause Analysis

### Issue 1.1: Truncated & Malformed HTML in Flux Wall Theme Table
- **File:** [games/flux-wall/index.html](file:///d:/Blaq%20Studios/Website/blaqstudios.github.io/games/flux-wall/index.html#L146-L153)
- **Root Cause:** In commit `f5e76be`, the HTML table in `games/flux-wall/index.html` was truncated mid-tag:
  ```html
  <tr>
      <td>6</td>
      <td>Solar</td
      </td>
  </tr>
  ```
  The closing bracket `>` is missing on `</td>`, and themes 6 through 9 are omitted entirely even though the page advertises "9 Rotating Themes".
- **Fix Needed:**
  1. Fix the malformed tag on theme 6.
  2. Restore themes 6 through 9 with the canonical game design specs from the design bible:
     - **Theme 6: Solar** | Physics: Super speed (+20% world speed) | Pickup: Time Warp
     - **Theme 7: Vapor** | Physics: Low gravity (×0.6) | Pickup: Anchor
     - **Theme 8: Inverted** | Physics: Chaos (fast pattern switches) | Pickup: Shield
     - **Theme 9: Prism** | Physics: Normal (Mastery victory lap) | Pickup: Score multiplier

---

### Issue 1.2: Broken 2-Column Grid Layout on Homepage Flux Wall Card
- **File:** [index.html](file:///d:/Blaq%20Studios/Website/blaqstudios.github.io/index.html#L131-L163)
- **Root Cause:** In the second `.game-card` (Flux Wall), the `.game-info` container was prematurely closed on line 146 before the button row:
  ```html
  <div class="game-card reveal-on-scroll">
      <div class="game-info">
          ...
          <div class="feature-pills">...</div>
      </div> <!-- PREMATURE CLOSE -->

      <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-top: 8px;">
          <a href="..." class="btn-itch ...">Play on itch.io</a>
          <a href="games/flux-wall/" class="btn-play ...">Learn more</a>
      </div>

      <div class="game-visual">...</div>
  </div>
  ```
  Because [styles/home.css](file:///d:/Blaq%20Studios/Website/blaqstudios.github.io/styles/home.css#L34-L40) sets `.game-card:nth-child(even) { grid-template-columns: 0.9fr 1.1fr; }`, the grid expects exactly **two** direct children (`.game-info` and `.game-visual`). Having 3 children places the buttons into column 2 and forces the visual mockup into an unintended 2nd row or misaligned placement.
- **Fix Needed:**
  Move the `<div style="display: flex; gap: 12px; ...">` button container inside `<div class="game-info">` right below `.feature-pills`, matching the clean structure of the Shikaku card.

---

### Issue 1.3: 100% Invisible Header on Shikaku Subpages
- **Files:**
  - [games/shikaku/changelog.html](file:///d:/Blaq%20Studios/Website/blaqstudios.github.io/games/shikaku/changelog.html#L23)
  - [games/shikaku/privacy-policy.html](file:///d:/Blaq%20Studios/Website/blaqstudios.github.io/games/shikaku/privacy-policy.html#L17)
  - [games/shikaku/terms-and-conditions.html](file:///d:/Blaq%20Studios/Website/blaqstudios.github.io/games/shikaku/terms-and-conditions.html#L17)
- **Root Cause:**
  These pages use `<header>` without `class="initial"`. In [styles/base.css](file:///d:/Blaq%20Studios/Website/blaqstudios.github.io/styles/base.css#L121-L144), bare `header` is styled with `opacity: 0; pointer-events: none;`. Without `initial`, the header is completely invisible and non-interactive until the user scrolls down 100px. If the page is short or the user doesn't scroll, they cannot access the navigation or logo.
- **Fix Needed:**
  Change `<header>` to `<header class="initial">` on all three pages.

---

### Issue 1.4: 404 Dead Link in Flux Wall Changelog
- **File:** [games/flux-wall/changelog.html](file:///d:/Blaq%20Studios/Website/blaqstudios.github.io/games/flux-wall/changelog.html#L82-L91)
- **Root Cause:**
  Lines 84 & 86 link directly to `FluxWall_GDD.md`, which was removed in commit `bd8f0e9` and does not exist in the web directory. Clicking this produces an HTTP 404 error on GitHub Pages.
- **Fix Needed:**
  Replace the missing GDD callout with an in-page CTA directing players to the playable prototype / game overview or support link, removing the broken link:
  ```html
  <section class="cta-banner reveal-on-scroll">
      <h3>Ready to experience the flux?</h3>
      <p>Follow development updates and play early prototypes on itch.io.</p>
      <div class="cta-actions">
          <a href="https://blaqstudios.itch.io/flux-wall" target="_blank" rel="noopener noreferrer" class="btn-play ripple-container">
              Play Prototype on itch.io
          </a>
          <a href="index.html" class="btn-secondary">← Back to Flux Wall</a>
      </div>
  </section>
  ```

---

## 3. Step-by-Step Execution Plan

1. **Step 1:** Edit `games/flux-wall/index.html` — replace broken `<tr>` on line 147 with fully formed rows for themes 6 to 9.
2. **Step 2:** Edit `index.html` — reposition the button container inside `<div class="game-info">`.
3. **Step 3:** Edit `games/shikaku/changelog.html`, `games/shikaku/privacy-policy.html`, and `games/shikaku/terms-and-conditions.html` — update `<header>` to `<header class="initial">`.
4. **Step 4:** Edit `games/flux-wall/changelog.html` — replace broken `FluxWall_GDD.md` link with active itch.io prototype link.

---

## 4. Verification & Testing Criteria

- [ ] Open `games/flux-wall/index.html` in browser; verify table shows all 9 themes cleanly with no syntax errors.
- [ ] Open `index.html` on desktop viewport (> 768px); verify Flux Wall card has exactly 2 grid columns with CTA buttons cleanly aligned inside the left info column.
- [ ] Open `games/shikaku/changelog.html`, `privacy-policy.html`, and `terms-and-conditions.html` at `scrollTop = 0`; verify the header, logo, and nav links are fully visible and clickable without scrolling.
- [ ] In `games/flux-wall/changelog.html`, verify no 404 links exist and all CTAs point to valid destinations.
