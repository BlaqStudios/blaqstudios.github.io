# Plan 04: Typography, SEO & Design Consistency

> **Target File:** `.agents_plans/04-typography-seo-and-design-consistency.md`  
> **Priority:** P2 (Medium)  
> **Risk Level:** Low (Additive `<head>` tags and meta properties)  
> **Dependencies:** None

---

## 1. Problem Overview & Scope

A polished website requires typographic consistency across all views and complete SEO metadata to ensure proper rendering in search engine indexes and social sharing cards. Currently:
1. Multiple legal and changelog subpages fail to import the brand typography (`Fredoka` and `Inter`), falling back to default system fonts.
2. Several Flux Wall subpages lack basic `<meta name="description">` tags and OpenGraph / Twitter metadata.
3. Root-relative paths for auxiliary assets like `app-ads.txt` can break depending on GitHub Pages domain configurations.

This plan addresses brand design coherence and SEO standards across all secondary pages.

---

## 2. Issues & Root Cause Analysis

### Issue 4.1: Missing Google Fonts on Shikaku Subpages
- **Files:**
  - [games/shikaku/changelog.html](file:///d:/Blaq%20Studios/Website/blaqstudios.github.io/games/shikaku/changelog.html#L8-L10)
  - [games/shikaku/privacy-policy.html](file:///d:/Blaq%20Studios/Website/blaqstudios.github.io/games/shikaku/privacy-policy.html#L8-L10)
  - [games/shikaku/terms-and-conditions.html](file:///d:/Blaq%20Studios/Website/blaqstudios.github.io/games/shikaku/terms-and-conditions.html#L8-L10)
- **Root Cause:**
  These pages only include:
  ```html
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700;800&display=swap" rel="stylesheet">
  ```
  They omit the primary brand font stylesheet (`family=Fredoka:wght@400;500;600;700&family=Inter:wght@400;500;600`).
  Consequently, all `h1`, `h2`, `h3`, badges, buttons, and body copy fall back to unstyled browser serif/sans-serif defaults (Arial/Times).
- **Fix Needed:**
  Add the preconnect and font links for `Fredoka` and `Inter` into the `<head>` of all three pages:
  ```html
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;600;700;800&display=swap" rel="stylesheet">
  ```

---

### Issue 4.2: Missing SEO & Social Graph Meta Tags on Flux Wall Subpages
- **Files:**
  - [games/flux-wall/privacy-policy.html](file:///d:/Blaq%20Studios/Website/blaqstudios.github.io/games/flux-wall/privacy-policy.html#L3-L12)
  - [games/flux-wall/terms-and-conditions.html](file:///d:/Blaq%20Studios/Website/blaqstudios.github.io/games/flux-wall/terms-and-conditions.html#L3-L12)
  - [games/flux-wall/changelog.html](file:///d:/Blaq%20Studios/Website/blaqstudios.github.io/games/flux-wall/changelog.html#L3-L12)
- **Root Cause:**
  These pages lack meta description tags, OpenGraph (`og:title`, `og:description`, `og:url`), and Twitter card metadata, hurting search ranking and social preview generation.
- **Fix Needed:**
  Add descriptive metadata to each page:
  - `changelog.html`: Description focusing on version history, physics milestones, and prototype updates.
  - `privacy-policy.html`: Description detailing offline architecture, data handling, and privacy assurances for Flux Wall.
  - `terms-and-conditions.html`: Clear descriptive summary.

---

### Issue 4.3: App-Ads.txt Path Resiliency
- **Files:**
  - `index.html` (line 243)
  - `games/shikaku/index.html` (line 437)
  - `games/flux-wall/index.html` (line 182)
- **Root Cause:**
  Links use `href="/app-ads.txt"`. If the site is served under a repository path or previewed locally without a web server, root-relative `/` links fail.
- **Fix Needed:**
  Ensure subpages use `../../app-ads.txt` and root pages use `app-ads.txt` (or maintain clean fallback) for universal link integrity.

---

## 3. Step-by-Step Execution Plan

1. **Step 1:** Update font imports in `games/shikaku/changelog.html`, `privacy-policy.html`, and `terms-and-conditions.html`.
2. **Step 2:** Insert complete meta tags (description, OpenGraph, Twitter) in `games/flux-wall/changelog.html`, `privacy-policy.html`, and `terms-and-conditions.html`.
3. **Step 3:** Standardize footer `app-ads.txt` relative links across subpages.

---

## 4. Verification & Testing Criteria

- [ ] Inspect computed font styles in DevTools on `games/shikaku/privacy-policy.html`: headings must compute to `Fredoka`, body copy must compute to `Inter`.
- [ ] Inspect HTML `<head>` on all subpages with an SEO linter or DevTools to verify every page has a unique `<title>` and `<meta name="description">`.
- [ ] Click the `app-ads.txt` footer link from both the homepage and subpages; verify it loads the text file directly without 404 errors.
