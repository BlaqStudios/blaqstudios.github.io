# Plan 02: Data Sync & Changelog Fetch Reliability

> **Target File:** `.agents_plans/02-data-sync-and-changelog-reliability.md`  
> **Priority:** P1 (High)  
> **Risk Level:** Low-to-Medium (Data & Client-Side Fetch Logic)  
> **Dependencies:** None

---

## 1. Problem Overview & Scope

The Shikaku version history page ([games/shikaku/changelog.html](file:///d:/Blaq%20Studios/Website/blaqstudios.github.io/games/shikaku/changelog.html)) is powered by a client-side changelog loader script ([scripts/changelog.js](file:///d:/Blaq%20Studios/Website/blaqstudios.github.io/scripts/changelog.js)) and two data files:
1. [data/shikaku-versions.json](file:///d:/Blaq%20Studios/Website/blaqstudios.github.io/data/shikaku-versions.json)
2. [data/shikaku-versions.js](file:///d:/Blaq%20Studios/Website/blaqstudios.github.io/data/shikaku-versions.js)

Currently, the HTTP fetch in `scripts/changelog.js` points to an invalid path that always generates an HTTP 404 error on the web, and the JSON file is severely out of sync with the JavaScript version data.

This plan addresses data synchronization and client fetch paths to ensure version history loads accurately both on GitHub Pages and during local offline inspection.

---

## 2. Issues & Root Cause Analysis

### Issue 2.1: Invalid Relative Path in Changelog Fetch
- **File:** [scripts/changelog.js](file:///d:/Blaq%20Studios/Website/blaqstudios.github.io/scripts/changelog.js#L75-L105)
- **Root Cause:**
  Lines 75 and 98 use `../data/shikaku-versions.json`:
  ```javascript
  fetch('../data/shikaku-versions.json?t=' + Date.now())
  ```
  Since `changelog.html` lives at `/games/shikaku/changelog.html`, navigating `../` goes up to `/games/`. The browser therefore attempts to fetch:
  `https://blaqstudios.github.io/games/data/shikaku-versions.json` (Returns HTTP 404).
  The only reason releases appear at all is because `fetch()` fails and triggers the `.catch()` fallback to `window.SHIKAKU_VERSIONS_DATA`.
- **Fix Needed:**
  Update the fetch URL in `scripts/changelog.js` to `../../data/shikaku-versions.json?t=` so it correctly reaches the repository root `/data/` directory from any 2-level deep subpage (`/games/shikaku/`). Also support an intelligent fallback array of candidate paths (`'../../data/shikaku-versions.json'`, `'../data/shikaku-versions.json'`, `'/data/shikaku-versions.json'`) so it works regardless of folder nesting.

---

### Issue 2.2: Data Desynchronization between JSON and JS
- **Files:**
  - [data/shikaku-versions.json](file:///d:/Blaq%20Studios/Website/blaqstudios.github.io/data/shikaku-versions.json)
  - [data/shikaku-versions.js](file:///d:/Blaq%20Studios/Website/blaqstudios.github.io/data/shikaku-versions.js)
- **Root Cause:**
  - `data/shikaku-versions.json` only contains **1 single release** (`1.1.0` from 2026-09-12).
  - `data/shikaku-versions.js` contains **8 releases** (`1.1.3`, `1.1.2`, `1.1.0`, `1.0.5`, `1.0.0`, `0.9.0`, `0.5.0`, `0.1.0`).
  If the `fetch()` call is repaired to succeed, the changelog would instantly regress from 8 releases down to only 1!
- **Fix Needed:**
  Synchronize `data/shikaku-versions.json` so that its `releases` array contains the exact 8 release entries that exist in `data/shikaku-versions.js`. Keep both files identical in data content.

---

## 3. Step-by-Step Execution Plan

1. **Step 1:** Read [data/shikaku-versions.js](file:///d:/Blaq%20Studios/Website/blaqstudios.github.io/data/shikaku-versions.js) and extract the full `releases` JSON structure.
2. **Step 2:** Update [data/shikaku-versions.json](file:///d:/Blaq%20Studios/Website/blaqstudios.github.io/data/shikaku-versions.json) to contain the full array of 8 releases.
3. **Step 3:** Modify [scripts/changelog.js](file:///d:/Blaq%20Studios/Website/blaqstudios.github.io/scripts/changelog.js) lines 75 and 98:
   - Change `'../data/shikaku-versions.json'` to `'../../data/shikaku-versions.json'`.
   - Ensure the offline fallback mechanism (`window.SHIKAKU_VERSIONS_DATA`) remains intact for `file:///` local protocol testing where browsers block local CORS fetch.

---

## 4. Verification & Testing Criteria

- [ ] Validate JSON syntax of `data/shikaku-versions.json` using a JSON parser to prevent parse errors.
- [ ] Open `games/shikaku/changelog.html` via HTTP server (e.g. `npx serve` or Python HTTP server); open DevTools Network tab.
- [ ] Confirm `shikaku-versions.json` returns HTTP 200 OK (no 404).
- [ ] Verify that all 8 releases (from v1.1.3 down to v0.1.0) render on the page with "Latest" pill badge on v1.1.3.
- [ ] Open `games/shikaku/changelog.html` via `file:///` in browser; verify `window.SHIKAKU_VERSIONS_DATA` fallback renders all 8 releases without error.
