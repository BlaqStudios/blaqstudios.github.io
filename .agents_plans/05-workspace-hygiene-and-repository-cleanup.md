# Plan 05: Workspace Hygiene & Repository Cleanup

> **Target File:** `.agents_plans/05-workspace-hygiene-and-repository-cleanup.md`  
> **Priority:** P3 (Low / Housekeeping)  
> **Risk Level:** Very Low (File removal and documentation update)  
> **Dependencies:** None

---

## 1. Problem Overview & Scope

During previous rapid iteration commits, several temporary and redundant files were left tracked in the git repository:
1. A draft file `index.html.new` in `games/flux-wall/`.
2. Raw markdown drafts (`privacy_policy.md` and `terms_and_conditons.md`) in `games/flux-wall/` that duplicate the actual production HTML files.
3. A bare 2-line `README.md` that provides no guidance on project architecture, local testing, or directory structure.

This plan removes obsolete files and provides a clear, professional `README.md` for developers and AI agents working on this site.

---

## 2. Issues & Root Cause Analysis

### Issue 5.1: Leftover Temporary File `games/flux-wall/index.html.new`
- **File:** `games/flux-wall/index.html.new`
- **Root Cause:**
  Created during a previous file-replacement experiment in commit `bd8f0e9`. It is not referenced anywhere in production and adds clutter to the project.
- **Fix Needed:**
  Delete `games/flux-wall/index.html.new`.

---

### Issue 5.2: Redundant Markdown Drafts in Web Folder
- **Files:**
  - `games/flux-wall/privacy_policy.md`
  - `games/flux-wall/terms_and_conditons.md`
- **Root Cause:**
  These markdown files were generated during legal drafting. The actual live production pages are `privacy-policy.html` and `terms-and-conditions.html`. Having these `.md` files directly inside public web paths creates confusion and potential clutter if published by static hosting.
- **Fix Needed:**
  Remove these raw `.md` drafts from the web folder, or move them to an internal documentation archive if archival is desired.

---

### Issue 5.3: Minimal Root `README.md`
- **File:** [README.md](file:///d:/Blaq%20Studios/Website/blaqstudios.github.io/README.md)
- **Root Cause:**
  The README contains only `# blaqstudios.github.io\nWebsite for Blaq Studios`.
- **Fix Needed:**
  Update `README.md` with:
  - Studio overview and live site URL (`https://blaqstudios.github.io`).
  - Directory structure map (`/games/`, `/styles/`, `/scripts/`, `/data/`).
  - How to preview locally without CORS issues (e.g. `python -m http.server` or `npx serve`).
  - Version changelog update guidelines (editing both `data/shikaku-versions.json` and `data/shikaku-versions.js`).

---

## 3. Step-by-Step Execution Plan

1. **Step 1:** Delete `games/flux-wall/index.html.new` via `git rm`.
2. **Step 2:** Delete `games/flux-wall/privacy_policy.md` and `games/flux-wall/terms_and_conditons.md` via `git rm`.
3. **Step 3:** Overwrite [README.md](file:///d:/Blaq%20Studios/Website/blaqstudios.github.io/README.md) with comprehensive project documentation.

---

## 4. Verification & Testing Criteria

- [ ] Run `git status` to verify only the intended files were removed.
- [ ] Verify no valid links or build scripts depend on the removed files.
- [ ] View rendered `README.md` to ensure markdown formatting, links, and instructions are clear and accurate.
