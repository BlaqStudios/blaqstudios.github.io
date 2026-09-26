# Plan 03: Header Navigation & Scroll Performance Refactor

> **Target File:** `.agents_plans/03-header-navigation-and-scroll-performance.md`  
> **Priority:** P1 (High Visual & Performance Impact)  
> **Risk Level:** High (Modifies global `styles/base.css` and `scripts/main.js`, impacting all pages)  
> **Dependencies:** Complete Plan 01 first

---

## 1. Problem Overview & Scope

The website uses a hybrid navigation header designed to morph between an initial top-of-page state and a floating pill navigation bar on scroll. Due to conflicting CSS rules and unthrottled JavaScript scroll listeners, the current implementation suffers from:
1. Visible horizontal twitching and layout shifts when scrolling begins.
2. Severe DOM thrashing and garbage collection pressure caused by continuously spawning DOM particle elements on every single scroll event.
3. Brittle class manipulation (`header.classList.remove('initial')` was commented out in previous hotfixes because it caused the header to vanish or jump).

This plan isolates the header layout, animation keyframes, and scroll event pipeline into a clean, performant, and stable implementation.

---

## 2. Issues & Root Cause Analysis

### Issue 3.1: CSS Transform & Position Conflicts
- **File:** [styles/base.css](file:///d:/Blaq%20Studios/Website/blaqstudios.github.io/styles/base.css#L121-L157) & [lines 865-900](file:///d:/Blaq%20Studios/Website/blaqstudios.github.io/styles/base.css#L865-L900)
- **Root Cause:**
  - Base `header` is styled as:
    ```css
    header {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        width: calc(100% - 48px);
        max-width: 1100px;
        border-radius: 50px;
    }
    ```
  - But `header.initial` overrides this with:
    ```css
    header.initial {
        position: sticky;
        top: 0;
        left: 0;
        transform: none;
        width: 100%;
        max-width: none;
    }
    ```
  - When scrolling down, `scripts/main.js` adds `.morphing-down`. The `@keyframes headerMorphDown` enforces:
    ```css
    transform: translateX(-50%) scale(1);
    ```
  - Because `left: 0` is still active from `header.initial`, applying `transform: translateX(-50%)` displaces the header 50% off-screen to the left! After 600ms, `setTimeout` removes `.morphing-down`, snapping the header back violently.
- **Fix Needed:**
  Unify the header layout model:
  - Keep `position: sticky; top: 0; width: 100%;` with a clean transition, OR use a consistent `position: fixed; top: 16px; left: 50%; transform: translateX(-50%);` floating island with `opacity: 1` as the default on all pages.
  - When scrolled (`.scrolled`), transition `padding`, `background`, `box-shadow`, and `border-color` using CSS transitions (`transition: all 300ms var(--ease-smooth)`), eliminating conflicting `@keyframes` that fight with `transform`.

---

### Issue 3.2: Unthrottled Particle Generation & DOM Thrashing
- **File:** [scripts/main.js](file:///d:/Blaq%20Studios/Website/blaqstudios.github.io/scripts/main.js#L59-L136)
- **Root Cause:**
  ```javascript
  function updateNavigation(scrollPos) {
      if (window.innerWidth > 768) {
          if (scrollPos > scrollThreshold) {
              createStarParticles(header, 'down', scrollPos);
              ...
          }
      }
  }
  ```
  While `requestAnimationFrame` throttles the scroll handler, `updateNavigation` fires on **every frame** of scrolling as long as `scrollPos > 100`.
  `createStarParticles` executes:
  1. `existingParticles.forEach(p => p.remove())` (query & delete existing DOM nodes)
  2. Creates 5 to 15 new `div.star-particle` elements.
  3. Appends them to the DOM.
  4. Sets 5 to 15 new `setTimeout(..., 1000)` callbacks.
  During a 2-second scroll, this creates and destroys hundreds of DOM elements, causing stutter and high battery/CPU consumption.
- **Fix Needed:**
  1. State transition gate: Only fire header transition effects when entering or leaving the scrolled state (`isScrolled !== wasScrolled`).
  2. Throttle star particles so they only burst once upon crossing the 100px threshold, not continuously while remaining scrolled.
  3. Strictly bypass particles if `window.matchMedia('(prefers-reduced-motion: reduce)').matches`.

---

## 3. Step-by-Step Execution Plan

1. **Step 1: Simplify Header CSS in `styles/base.css`**:
   - Establish a single, predictable coordinate system for `header`.
   - Make `header` default to `position: sticky; top: 0; left: 0; width: 100%; z-index: 100;` with smooth backdrop blur.
   - When scrolled (`header.is-scrolled`), apply compact height, elevated background `rgba(26, 22, 37, 0.85)`, and enhanced border glow.
   - Remove glitchy `@keyframes headerMorphUp` and `@keyframes headerMorphDown` transforms that displace the X coordinate.
2. **Step 2: Refactor Scroll Engine in `scripts/main.js`**:
   - Track state:
     ```javascript
     var wasScrolled = false;
     function updateNavigation(scrollPos) {
         var isScrolled = scrollPos > 80;
         if (isScrolled !== wasScrolled) {
             wasScrolled = isScrolled;
             if (isScrolled) {
                 header.classList.add('is-scrolled');
                 triggerThresholdEffect('down');
             } else {
                 header.classList.remove('is-scrolled');
                 triggerThresholdEffect('up');
             }
         }
     }
     ```
   - Limit `createStarParticles` to fire strictly on state transition crossing, and clean up previous nodes with a shared container or CSS animations.
3. **Step 3: Ensure Smooth Mobile Support**:
   - On viewports `<= 768px`, header remains sticky with steady 56px/64px height and zero particle animations.

---

## 4. Verification & Testing Criteria

- [ ] Scroll slowly from top of `index.html` to bottom; verify header transitions smoothly without any horizontal jumping, jerking, or teleporting.
- [ ] Monitor Chrome DevTools Performance panel during scroll: verify 60fps frame rate with zero layout shifts (CLS = 0) and negligible DOM element count increase.
- [ ] Test in Mobile emulation (375px width): verify header stays visible and sticky, navigation hamburger functions cleanly.
- [ ] Test on subpages (`games/shikaku/index.html`, `games/flux-wall/index.html`): verify header remains perfectly stable.
