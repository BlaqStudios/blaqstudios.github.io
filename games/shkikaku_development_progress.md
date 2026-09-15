# Shikaku - Divide by Box | Development Progress & Master System Architecture

Comprehensive developer documentation and living system specification detailing technical architecture, game mechanics, scene hierarchies, UI controls, confirmation popups, navigation flow, workspace files, mobile viewport engine, save persistence, audio synthesis, localization, and state management of the **Shikaku** Godot 4 project.

> 📖 **Chronological Development Changelog**: For the complete milestone log detailing all 239 historical milestones, see [shikaku_changelog.md](file:///d:/Godot_projects/shikaku/shikaku_changelog.md).

---

## Table of Contents
1. [Executive Overview & Core Puzzle Rules](#1-executive-overview--core-puzzle-rules)
2. [Technical Architecture & Singleton Topology](#2-technical-architecture--singleton-topology)
3. [Game Navigation & Scene Routing Flow Map](#3-game-navigation--scene-routing-flow-map)
4. [Game Modes & Dual-Progression Framework](#4-game-modes--dual-progression-framework)
5. [Complete Game Scenes & Hierarchy Breakdown](#5-complete-game-scenes--hierarchy-breakdown)
6. [Comprehensive Button & Interactive UI Control Inventory](#6-comprehensive-button--interactive-ui-control-inventory)
7. [Confirmation Modals & Dynamic Popup Systems](#7-confirmation-modals--dynamic-popup-systems)
8. [Workspace File Inventory & Directory Structure](#8-workspace-file-inventory--directory-structure)
9. [Core Game Mechanics & Pure 3-Star Condition System](#9-core-game-mechanics--pure-3-star-condition-system)
10. [Touch Interaction, Snap & Gesture Engines](#10-touch-interaction-snap--gesture-engines)
11. [Mobile Viewport, Pan/Zoom & GPU Frustum Culling Engine](#11-mobile-viewport-panzoom--gpu-frustum-culling-engine)
12. [GPU MSDF Vector Typography & Visual Asset Suite](#12-gpu-msdf-vector-typography--visual-asset-suite)
13. [Audio Synthesizer & Procedural Sound Engine](#13-audio-synthesizer--procedural-sound-engine)
14. [Monetization Architecture: Google AdMob & Google Play Billing](#14-monetization-architecture-google-admob--google-play-billing)
15. [Multi-Language Localization & Fixed 100% Base Typography](#15-multi-language-localization--fixed-100-base-typography)
16. [Procedural CSP & Cluster Growth Generators](#16-procedural-csp--cluster-growth-generators)
17. [Interactive Visual Onboarding & Tutorial Systems](#17-interactive-visual-onboarding--tutorial-systems)
18. [Developer Diagnostics, Hotkeys & Major Bug Resolutions](#18-developer-diagnostics-hotkeys--major-bug-resolutions)
19. [Weird Mode (Freeform Polyomino Partition) Master Specifications](#19-weird-mode-freeform-polyomino-partition-master-specifications)
20. [Full Milestone History & Changelog (`shikaku_changelog.md`)](file:///d:/Godot_projects/shikaku/shikaku_changelog.md)

---

## 1. Executive Overview & Core Puzzle Rules

**Shikaku** (also known as *Divide by Box*) is a spatial logic puzzle played on a grid with numbered clue cells. The objective is to partition the grid into non-overlapping geometric shapes such that every shape encloses exactly one clue matching its area.

### 1. Classic Mode Rules (Rectangular Partition)
1. **Single Clue Anchor**: Each rectangle must enclose **exactly one** clue tile. 0 clues (`❓`) or $2+$ clues (`N ⚠️`) invalidates the box.
2. **Exact Area Match**: Rectangle area ($W \times H$) must **exactly equal** the enclosed clue value. Size mismatches are marked (`📐±N`).
3. **100% Geometry Coverage**: Rectangles cannot overlap, cannot leave empty gaps, and must collectively cover 100% of grid cells.

### 2. Weird Mode Rules (Freeform Polyomino Partition)
1. **Orthogonal Contiguity**: Polyomino cells must connect horizontally or vertically (BFS contiguity). Diagonal-only touches are invalid.
2. **Exact Area Equality**: Total cell count $|\mathcal{S}|$ must exactly equal the enclosed clue value.
3. **Single Clue Anchor**: Each polyomino must enclose exactly one clue tile.
4. **100% Geometry Tessellation**: All grid cells must be partitioned into valid, non-overlapping polyominoes ($\bigcup \mathcal{S}_i = \mathcal{G}$, $\mathcal{S}_i \cap \mathcal{S}_j = \emptyset$).
5. **Freeform Morphology**: Shapes are not restricted to rectangles (L-shapes, T-shapes, Crosses, Serpents, U-bends, corridors).

---

## 2. Technical Architecture & Singleton Topology

### Engine Configuration
- **Engine**: Godot Engine 4.7 (Compatibility Renderer / `gl_compatibility`), D3D12 on Windows.
- **Viewport**: Base $720 \times 1280$ (Portrait) with `canvas_items` stretch mode and `expand` aspect handling.
- **Input Emulation**: Native mobile touch emulation enabled (`pointing/emulate_touch_from_mouse = true`).
- **Data Persistence**: JSON at `user://save_data.json` via [SaveManager](file:///d:/Godot_projects/shikaku/scripts/save_manager.gd) (Schema v3) + AES-256 encrypted `user://entitlement.dat` via [SecureStorage](file:///d:/Godot_projects/shikaku/scripts/secure_storage.gd).
- **Mobile Production Optimization**: Engine-level release stdout/stderr suppression (`run/disable_stdout.release=true`, `run/disable_stderr.release=true`) + [GameLog](file:///d:/Godot_projects/shikaku/scripts/game_log.gd) to eliminate mobile Binder IPC CPU stalls.
- **Official App Icon**: 100% solved $3\times 3$ grid partition at [`assets/app_icons/concept_3a_dark_neon_v2.png`](file:///d:/Godot_projects/shikaku/assets/app_icons/concept_3a_dark_neon_v2.png) (PNG-32 normalized).
- **Binary Datasets**: [data/puzzle_dataset.dat](file:///d:/Godot_projects/shikaku/data/puzzle_dataset.dat) ($2.24\text{ MB}$, `SHKQ`, 1,000 Classic levels) and [data/weird_puzzle_dataset.dat](file:///d:/Godot_projects/shikaku/data/weird_puzzle_dataset.dat) ($3.5\text{ MB}$, `WRDK`, 1,000 Weird levels). Deserializes in $<15\text{ms}$. Explicitly packaged via `include_filter="*.dat, *.csv, .env"` in `export_presets.cfg`.

### Autoload Singletons & Core Utilities

| Singleton / Class | Type | File Path | Core Role & Responsibilities |
| :--- | :--- | :--- | :--- |
| **Env** | Autoload / Tool | `scripts/env.gd` | Centralized environment parser (`.env`, `user://.env`, OS env). Provides type-safe getters with safe fallbacks for AdMob IDs, billing SKUs, and paths. |
| **SaveManager** | Autoload | `scripts/save_manager.gd` | Persistence engine (Schema v3). Manages level unlocks (1–1000), stars, in-progress states, 2,000 Weird unlock points, audio, haptics, theme, and IAP proxy. |
| **GameState** | Autoload | `scripts/game_state.gd` | Central game coordinator. Manages modes (`CAMPAIGN`, `RANDOM`, `CUSTOM`), ruleset (`CLASSIC`, `WEIRD`), 1Hz timer, undo/redo stacks, $O(1)$ spatial clue maps, and `THEMES` registry. |
| **EntitlementManager** | Autoload | `scripts/entitlement_manager.gd` | Single Source of Truth (SSOT) for ad-removal entitlement. Coordinates billing adapters, encrypted storage, and ad gating via `ads_removed_changed` signal. |
| **AdManager** | Autoload | `scripts/ad_manager.gd` | Google AdMob SDK integration (Poing Studios v5). Onboarding shield (Lvls 1–5), 6 action-point pacing, 180s exit cooldown, and rewarded video ad hint refills. |
| **IAPManager** | Autoload | `scripts/iap_manager.gd` | In-app purchase facade for `remove_ads` SKU ($1.99). Delegates to `EntitlementManager` and queries localized store prices. |
| **SoundManager** | Autoload | `scripts/sound_manager.gd` | Real-time procedural PCM synthesizer via `AudioStreamGeneratorPlayback`. Generates clicks, drag ticks, chords, buzzers, chimes, and fanfares with 0 audio files. |
| **TranslationManager** | Autoload | `scripts/translation_manager.gd` | Manages 19-language translation matrix (`game_translations.csv`) and builds dynamic non-Latin `SystemFont` fallbacks (CJK, Arabic RTL, Devanagari, Cyrillic, Thai). |
| **FontScaleManager** | Autoload | `scripts/font_scale_manager.gd` | Universal typography anchor. Locks base text and UI element dimensions strictly to 100% scale across all screens and modals. |
| **TutorialManager** | Autoload | `scripts/tutorial_manager.gd` | State machine orchestrating interactive visual onboarding tours for Classic and Weird modes with spotlight cutouts and guidance. |
| **WebAdBridge** | Autoload | `scripts/web_ad_bridge.gd` | Web ad SDK bridge for browser deployment. Auto-detects CrazyGames SDK v3 or GameDistribution SDK, binds persistent JS callbacks, manages gameplayStart/Stop lifecycle, and pauses audio/engine during ads. Falls back cleanly in ad-free environments (itch.io / local). |
| **PuzzleGenerator** | RefCounted | `scripts/puzzle_generator.gd` | Geometry engine: BSP with perimeter clue bias, CSP backtracking solver, organic cluster growth for Weird Mode, and Hamiltonian branch par moves calculation. |
| **PuzzleLoader** | RefCounted | `scripts/puzzle_loader.gd` | Zero-allocation high-speed binary stream deserializer reading 1,000 Classic (`SHKQ`) and 1,000 Weird (`WRDK`) levels. |
| **PolyShape** | RefCounted | `scripts/poly_shape.gd` | Freeform polyomino data model: cell arrays, $O(1)$ `_cell_set`, BFS contiguity (`is_contiguous()`), centroid calculation, and concave badge placement. |
| **SafeAreaHelper** | RefCounted | `scripts/safe_area_helper.gd` | Mobile Safe Area & Hardware Cutout engine. Analyzes DisplayServer safe area & cutouts (left/center/right), converts coordinates, and provides desktop mock testing modes. |
| **GameLog** | RefCounted | `scripts/game_log.gd` | Editor-only diagnostic logging engine (`OS.has_feature("editor")`). Eliminates Android logcat Binder IPC overhead in production builds. |
| **McpTestSuite** | RefCounted | `addons/godot_ai/testing/test_suite.gd` | Automated testing base class. Powers 18 test suites (122 tests total, 100% pass rate) with `track(node)` zero-leak memory management. |

---

## 3. Game Navigation & Scene Routing Flow Map

```
[Boot] -> SplashScreen (3s intro) -> MainMenu
                                        ├── Campaign Play -> LevelSelectScreen (Pages 1-50) -> Gameplay (scenes/main.tscn)
                                        ├── Random Mode   -> RandomModeSelect (Easy/Med/Hard/Exp) -> LoadingScreen -> Gameplay
                                        │                     └── Custom Grid (5x5 to 30x30)      -> LoadingScreen -> Gameplay
                                        ├── Settings      -> SettingsScreen (Audio, Haptic, Theme, Language, Reset)
                                        │                     ├── ThemeSelectModal (Live preview on tap -> OK/Back exit)
                                        │                     ├── LanguageSelectModal (19 locales -> MarginContainer outer padding)
                                        │                     └── ConfirmationModal [RESET_SAVE_DATA]
                                        ├── How to Play   -> HowToPlayScreen (5 Classic / 4 Weird cards + Replay Tour)
                                        ├── Remove Ads    -> PurchaseModal ($1.99 USD IAP)
                                        ├── Mode Switch   -> Toggle Classic/Weird (or WeirdUnlockPopup if < 2,000 pts)
                                        └── Quit          -> ConfirmationModal [QUIT_APP] -> get_tree().quit()

Gameplay Area:
  - HUD BackBtn -> ConfirmationModal [LEAVE_GAMEPLAY] -> LevelSelect / RandomSelect
  - HUD ResetBtn -> ConfirmationModal [RESET_GAMEPLAY] -> Clear placed blocks
  - HUD HintBtn  -> Hint outline (or ConfirmationModal [REFILL_HINTS_AD] if 0 left)
  - HUD InfoBtn  -> SymbolLegendModal (Rules, 3-Star conditions, error badges)
  - Hold Block   -> BlockInspectorPopup (CanvasLayer 95, 4 themes, 100ms hold -> release to dismiss)
  - Grid Solved  -> ConfettiParticles (z=100 dual cannons) -> VictoryModal (Stars, Fanfare, MilestoneBanner, Next/Replay)
```

### Scene State Isolation & Screen Routing
- In `scenes/main.tscn`, all secondary screens are `visible = false` by default (`SplashScreen` is `visible = true`).
- `_show_screen(active_screen)` in `main.gd` hides other screens, dismisses active floating modals, resets pan/zoom, and pauses the timer outside gameplay.
- `_transition_to_screen(target_screen, on_covered)` executes a 0.2s fade-in overlay $\to$ seamless scene swap & level load $\to$ 0.3s fade-out overlay via `TransitionOverlay`.
- Centralized back navigation (`main.gd` `_handle_back_request()`) prioritizes active modals before screens, intercepting Android hardware back / `ui_cancel`.

---

## 4. Game Modes & Dual-Progression Framework

### 1. Classic Campaign Mode (1,000 Rectangular Levels)
- 1,000 pre-generated unique puzzles spanning 26 dimensions ($5\times 5$ to $30\times 30$). Stored in `puzzle_dataset.dat` ($2.24\text{ MB}$, `SHKQ`).
- Progression: $5\times 5$ (Lvls 1–5), $6\times 6$ to $29\times 29$ (Lvls 6–425), $30\times 30$ Master (Lvls 426–1000, 575 levels).

### 2. Weird Campaign Mode (1,000 Polyomino Levels)
- 1,000 verified freeform polyomino puzzles across 26 dimensions. Stored in `weird_puzzle_dataset.dat` ($3.5\text{ MB}$, `WRDK`).
- Handcrafted tutorial levels 1 & 2 ($5\times 5$) teaching polyomino drawing and 4-color graph shading. Levels 3–1000 procedurally generated with compact dense bounds (`min_area = 2, max_area = 6..8`) and centroid clue alignment.

### 3. Random & Custom Grid Modes
- **Random Presets**: Easy ($5\times 5$), Medium ($8\times 8$), Hard ($11\times 11$), Expert ($15\times 15$). Powered by background worker thread (`loading_screen.gd`).
- **Custom Mode**: Independent Width & Height sliders ($5$ to $30$) + preset chips ($5\times 5$, $10\times 10$, $15\times 15$, $20\times 20$, $30\times 30$).

### 4. 2,000-Point Weird Mode Unlock Gate
- **Threshold**: Exactly $2,000\text{ Points}$ required to unlock (`SaveManager.weird_unlock_points >= 2000`).
- **Formula**: $\text{Points} = W \times H$ awarded on any $\ge 1$-star clear across Campaign, Random, or Custom modes (e.g. $5\times 5 = +25$, $8\times 8 = +64$, $10\times 10 = +100$, $15\times 15 = +225$, $30\times 30 = +900$). Once unlocked, point calculation bypasses.

### 5. 50-Level Milestone Crown Progression
- Every 50 completed campaign levels (Levels 50, 100, ..., 1,000) awards a Milestone Crown tier. Classic and Weird modes track milestones independently.
- **Level Select Screen**: `MilestonePill` capsule below title displays `CrownIcon` ($22\times 22\text{px}$), tier label (`Level 300`), horizontal progress bar ($100\times 6\text{px}$), and counter (`33 / 50`).
- **Victory Modal**: Clears on milestone multiples trigger illuminated `MilestoneBanner` (`"👑 MILESTONE REACHED: LEVEL N MASTER!"`) with elastic pop-in and `SoundManager.play_grand_fanfare()` (ascending $C_5 \to E_5 \to G_5 \to C_6$).
- **Distinction from IAP**: Crown is strictly gameplay mastery. Remove Ads uses dedicated vector billboard `icon_no_ads.svg`.

### 6. Mode Comparison Matrix

| Feature | Classic Mode (Shikaku) | Weird Mode (Polyomino Partition) |
| :--- | :--- | :--- |
| **Unlock Gate** | Unlocked by default | 2,000 Points ($W \times H$ per $\ge 1$-star clear) |
| **Atmosphere** | Deep Navy base, floating rectangles | Cosmic Violet base, floating polyominoes |
| **Shape Topology** | Strictly rectangular ($W \times H$) | Freeform orthogonal polyominoes |
| **Input Gesture** | 2-corner diagonal drag + $\pm 0.85$ snap | Drag-to-paint path + $\pm 0.85$ snap |
| **Backtracking** | Shrink diagonal corner | Slice backtrack trimming at touched cell |
| **Extension** | Redraw box | Hold & drag outward from boundary to extend |
| **Erase Tool** | Persistent toggle (clears rectangle) | Persistent toggle (cell-by-cell BFS carving) |
| **Error Feedback** | Yellow (Mismatch), Red (Multi), White (No Clue) | Yellow (Mismatch), Red (Multi), White (No Clue) |
| **Border Styling** | Retains assigned theme/palette border | Retains assigned theme/palette border |
| **Dataset** | `puzzle_dataset.dat` (1,000 levels, `SHKQ`) | `weird_puzzle_dataset.dat` (1,000 levels, `WRDK`) |

---

## 5. Complete Game Scenes & Hierarchy Breakdown

| Scene Path | Script Path | Layer / Z | Key Child Nodes & Purpose |
| :--- | :--- | :--- | :--- |
| `scenes/main.tscn` | `scenes/main.gd` | Default | Root orchestrator. Manages screen containers, transitions (`TransitionOverlay`), developer hotkeys, and back-navigation queue. |
| `scenes/board/board.tscn` | `scenes/board/board.gd` | Default | Grid manager: `TilesContainer` (`CellTile` grid), `BlocksContainer` (`RectangleBlock` pool), `PolyRenderer`, `PreviewPanel`, `HintRect`, and `PanSliderH/V`. |
| `scenes/board/cell_tile.tscn` | `scenes/board/cell_tile.gd` | Default | Individual grid tile: `BgPanel`, `ClueLabel` with MSDF font, cached `_bg_style` and `_badge_style`. |
| `scenes/board/rectangle_block.tscn` | `scenes/board/rectangle_block.gd` | Default | Placed rectangular block: `Panel` with neon border, `LabelContainer` with `IconTexture` and `IconLabel` (`✓`, `📐±N`, `N ⚠️`, `❓`), `DimLabel`. |
| `scenes/board/polyomino_renderer.gd` | Custom CanvasItem | Default | Custom vector drawer: sharp $90^\circ$ miter boundaries ($3.6\text{px}$ stroke), $0.52\alpha$ cell fills, drag prediction pills, and centroid badges. |
| `scenes/effects/confetti_particles.tscn` | `scenes/effects/confetti_particles.gd` | `z_index=100` | Dual bottom-corner rainbow cannons (`LeftCannon`, `RightCannon`, 90 particles each = 180 total) firing inward at $(0.58, -0.82)$ / $(-0.58, -0.82)$ with 300ms stagger. |
| `scenes/ui/ambient_bg.tscn` | `scenes/ui/ambient_bg.gd` | Background | Mode-adaptive background: Classic navy (`#0F1424`) with floating rectangles; Weird violet (`#120A24`) with rotating polyominoes. Features 550ms shockwave on toggle. `_process` auto-disabled when hidden. |
| `scenes/ui/block_inspector_popup.tscn` | `scenes/ui/block_inspector_popup.gd` | `layer=95` | Dedicated CanvasLayer status popup immune to pan/zoom. Houses `Card` with 4-theme styling, `IconTexture`, `TitleLabel`, `DescLabel`, `TipLabel`. 100ms hold trigger. |
| `scenes/ui/confirmation_modal.tscn` | `scenes/ui/confirmation_modal.gd` | Dialog | Reusable modal with scale-bounce entrance (`Tween.TRANS_BACK`): title, unescaped body, confirm button, cancel button. |
| `scenes/ui/custom_grid_select.tscn` | `scenes/ui/custom_grid_select.gd` | Screen | Grid setup: `WidthSlider`, `HeightSlider` ($5$–$30$), preset chips ($5\times 5$ to $30\times 30$), `GenerateBtn`, `BackBtn`. |
| `scenes/ui/how_to_play_screen.tscn` | `scenes/ui/how_to_play_screen.gd` | Screen | Illustrated scrollable rules guide (5 Classic cards, 4 Weird cards), `IDidntUnderstandBtn` to trigger onboarding tour. |
| `scenes/ui/hud.tscn` | `scenes/ui/hud.gd` | HUD | Single-row TopBar (`BackBtn`, `CenterStatsHBox` with diff badge, timer, moves, `InfoBtn`), 2-row BottomBar (Undo, Redo, Erase, Reset, Hint, Zoom, Random), `EraseWarningLabel`. |
| `scenes/ui/language_select_modal.tscn` | `scenes/ui/language_select_modal.gd` | Modal | 19-locale picker with native names, flags, `MarginContainer` outer padding (24px/26px), localized settings tip, and OK exit. |
| `scenes/ui/level_select_screen.tscn` | `scenes/ui/level_select_screen.gd` | Screen | 1,000 levels across 50 pages (20 cards/page). `MilestonePill` capsule, swipe navigation ($>60\text{px}$), RTL-mirrored `NextPageBtn`. |
| `scenes/ui/loading_screen.tscn` | `scenes/ui/loading_screen.gd` | Screen | Threaded generator loader with dynamic theming and adaptive duration ($0.3\text{s}$ to $0.8\text{s}$). |
| `scenes/ui/main_menu.tscn` | `scenes/ui/main_menu.gd` | Screen | Tactile buttons (`ContinueBtn`, `PlayBtn`, `RandomPlayBtn`, `SettingsBtn`, `HowToPlayBtn`, `RemoveAdsIconBtn`, `QuitBtn`), `TopControlsContainer` housing centered `ModeSliderSwitch`. |
| `scenes/ui/mode_slider_switch.tscn` | `scenes/ui/mode_slider_switch.gd` | Component | Standalone 200% capsule switch ($192\times 68\text{px}$) with sliding knob ($56\times 56\text{px}$) displaying `■` (Classic), `☶` (Weird), or `🔒`. |
| `scenes/ui/purchase_modal.tscn` | `scenes/ui/purchase_modal.gd` | Modal | Store modal: $1.99 USD Remove Ads buy button, restore purchases button, feature list, localized price. |
| `scenes/ui/random_mode_select.tscn` | `scenes/ui/random_mode_select.gd` | Screen | Difficulty browser (`EasyBtn`, `MediumBtn`, `HardBtn`, `ExpertBtn`, `CustomBtn`, `BackBtn`). |
| `scenes/ui/settings_screen.tscn` | `scenes/ui/settings_screen.gd` | Screen | Audio sliders, sound/haptic toggles, Theme button, Language button, Remove Ads, Restore Purchases, Reset All Progress. Fixed 100% typography. |
| `scenes/ui/splash_screen.tscn` | `scenes/ui/splash_screen.gd` | Intro | 3-second animated studio intro sequence with drag box, hand cursor, and unlocalized "BLAQ STUDIOS" branding (forced LTR). |
| `scenes/ui/symbol_legend_modal.tscn` | `scenes/ui/symbol_legend_modal.gd` | Modal | Comprehensive guide modal explaining 4 block validation states (`✓`, `📐±N`, `N ⚠️`, `❓`), 3-star rules, and HUD controls. |
| `scenes/ui/theme_select_modal.tscn` | `scenes/ui/theme_select_modal.gd` | Modal | 3 theme cards (Light Zen, Dark Zen, Dark Neon). Real-time live switching on tap; dedicated exit via OK button or phone back button; 19-language settings tip. |
| `scenes/ui/tutorial_overlay.tscn` | `scenes/ui/tutorial_overlay.gd` | Overlay | 4-panel perimeter dimming cutout (`DimTop/Bottom/Left/Right`), animated pointing arrow `👇`, glowing spotlight box, dynamic recovery. |
| `scenes/ui/victory_modal.tscn` | `scenes/ui/victory_modal.gd` | Modal | Star reveal celebration, 3-star fanfare, `MilestoneBanner` on 50-level multiples, actions (`NextBtn`, `ReplayBtn`, `RandomBtn`, `MenuBtn`, `RemoveAdsLink`). |
| `scenes/ui/weird_unlock_popup.tscn` | `scenes/ui/weird_unlock_popup.gd` | Popup | Near-switch floating card with progress bar (`X / 2,000 Points`), rules summary, and +900 pts reward card. |

---

## 6. Comprehensive Button & Interactive UI Control Inventory

### 1. Main Menu (`scenes/ui/main_menu.tscn`)
- `ContinueBtn`: Resumes highest unlocked level for active mode. Uses `icon_play.png` with `#989187` warm stone outline.
- `PlayBtn`: Opens `LevelSelectScreen` on active mode's unlocked page. Uses `icon_campaign.png` with warm stone outline.
- `RandomPlayBtn`: Navigates to `RandomModeSelect`. Uses `icon_random.png` with warm stone outline.
- `SettingsBtn`: Navigates to `SettingsScreen`. Uses `icon_settings.png` with warm stone outline.
- `HowToPlayBtn`: $188\times 55\text{px}$, left-aligned with $14\text{px}$ margin and $10\text{px}$ icon gap. Opens `HowToPlayScreen`.
- `RemoveAdsIconBtn`: $206\times 65\text{px}$, gold border with `icon_no_ads.svg`. Opens `PurchaseModal`.
- `QuitBtn`: Triggers `ConfirmationModal` (`QUIT_APP`). Uses `icon_quit.png` with warm stone outline.
- `ModeSliderSwitch`: Toggles Classic/Weird mode (or opens `WeirdUnlockPopup` if locked).

### 2. Level Select Screen (`scenes/ui/level_select_screen.tscn`)
- `MilestonePill`: Capsule pill below title with `CrownIcon` ($22\times 22\text{px}$), tier label, $100\times 6\text{px}$ progress bar, and counter (`X / 50`).
- Level Cards (20 per page, 50 pages): Unlocked shows number + 3 stars (outlined in Light Zen, glow in Dark themes). 3-star levels have gold border (`#FFD600`). Locked shows dark fill + $58\times 58\text{px}$ padlock (`icon_lock.png`).
- `PrevPageBtn` / `NextPageBtn`: Decrements/increments page. `NextPageBtn` uses `LAYOUT_DIRECTION_RTL` so chevron is on the right.
- `BackBtn`: Returns to `MainMenu`. Horizontal swipe ($>60\text{px}$) flips pages.

### 3. Gameplay HUD (`scenes/ui/hud.tscn`)
- **TopBar (`HeaderHBox`)**:
  - `BackBtn`: Square icon-only ($66\times 66\text{px}$), triggers `LEAVE_GAMEPLAY` confirmation.
  - `CenterStatsHBox`: `DiffBadge` (`"Lvl N (WxH)"`), `TimerLabel` (`"00:00"`), `MovesLabel` (`"Moves: N"`).
  - `InfoBtn`: Square icon-only ($66\times 66\text{px}$), opens `SymbolLegendModal`.
- **BottomBar**:
  - Row 1 (Icon-Only, $80\text{px}$ height): `UndoBtn`, `RedoBtn`, `DeleteBtn` (Erase toggle with 1.0 Hz sinusoidal red pulse and hover expansion), `ResetBtn`.
  - Row 2 (Icon + Text, $80\text{px}$ height): `HintBtn` (`💡 Hint (N)`), `ZoomBtn` (`🔍 Zoom`), `RandomBtn` (`🎲 Next Puzzle`).
  - `EraseWarningLabel`: 5.0s sinusoidal blinking banner (`"Turn off the erase to draw"`) triggered on empty cell tap during Erase mode.

### 4. Victory Modal (`scenes/ui/victory_modal.tscn`)
- `MilestoneBanner`: Appears on 50-level milestone clears (`"👑 MILESTONE REACHED: LEVEL N MASTER!"`).
- `NextBtn` ("▶ Next Level"): Advances to level $N+1$ ($58\text{px}$ height).
- `ReplayBtn` ("🔄 Replay"): Resets and reloads the active puzzle across all modes (Campaign level reload, Random mode exact grid replay, or Custom grid replay) with zero-delay board clearing and timer/moves reset.
- `RandomBtn` ("🎲 Next"): Generates new random puzzle.
- `MenuBtn` ("🎮 Levels" / "🎯 Difficulty"): Returns to Level Select or Random Select via `icon_map.png`.
- `RemoveAdsLink`: Centered button with `icon_no_ads.svg` directly opening `PurchaseModal`.
- **Condition Rows & Vector Checkboxes**: Star 1 (`Grid Completed`), Star 2 (`Speed Master`), and Star 3 (`Flawless Finish`). Replaced generic text symbols with vector `icon_checkbox_checked.svg` and `icon_checkbox_empty.svg` assets, calibrated to $37\times 37\text{px}$ (`expand_mode = EXPAND_IGNORE_SIZE`), with checkboxes vertically aligned in a column centered under the 3 stars. Star 3 features dynamic contextual failure reasons (`Erase Used`, `Undo Used`, `Hint Used`, `Erase & Undo Used`, compact multi-tags, and move ratios) maintaining full $18\text{px}$ base typography without shrinking for up to 55 characters.

### 5. Settings Screen (`scenes/ui/settings_screen.tscn`)
- Volume slider, Sound Effects toggle, Haptic Vibration toggle (automatically hidden on Web builds; completely turned off via `SaveManager.haptic_enabled` property getter with zero browser vibration prompts).
- Theme Select button (`KEY_THEME_*` with clean typography and zero trailing unicode glyphs, eliminating web tofu boxes; opens `ThemeSelectModal`), Language Select button (opens `LanguageSelectModal`).
- Remove Ads button (`icon_no_ads.svg`, hidden on Web), Restore Purchases button (hidden on Web), Reset All Progress button (`RESET_SAVE_DATA`).
- `BackBtn` returning to Main Menu. Universal 100% fixed base typography.

---

## 7. Confirmation Modals & Dynamic Popup Systems

### Action Confirmation Modals

| Action ID | Trigger Location | Popup Title | Message Body | Confirm Text | Execution Action |
| :--- | :--- | :--- | :--- | :---: | :--- |
| `QUIT_APP` | Main Menu `QuitBtn` | Quit Game | *"Are you sure you want to exit Shikaku?"* | Quit | Calls `get_tree().quit()`. |
| `RESET_SAVE_DATA` | Settings `ResetDataBtn` | Reset All Progress | *"WARNING: All unlocked levels, stars, and high scores will be permanently deleted!"* | Delete All | Calls `SaveManager.reset_all_save_data()`. Resets levels to 1 across both modes while strictly preserving paid `ads_removed` IAP. |
| `LEAVE_GAMEPLAY` | HUD `BackBtn` | Leave Game | *"Your current level progress will be saved. Return to Level Select?"* (or unsaved warning for Random) | Leave | Saves in-progress state (Campaign) and transitions to Level/Random select. |
| `RESET_GAMEPLAY` | HUD `ResetBtn` | Reset Board | *"Reset all placed blocks for this level?"* | Reset | Clears placed blocks, resets moves, timer, and undo/redo stacks. |
| `REFILL_HINTS_AD` | HUD `HintBtn` (0 left) | Out of Hints! | *"Watch a short video to refill +3 Hints?"* | Watch Video | Plays rewarded video ad and grants $+3$ hints upon completion. |

### Dynamic Informational Modals
1. **Block Inspector Popup (`scenes/ui/block_inspector_popup.tscn`)**:
   - `CanvasLayer` (`layer = 95`) rendering in pure $720\times 1280$ viewport coordinates, immune to board zoom ($1.0\times$ to $6.0\times$) and pan.
   - Trigger: 100ms hold (`_inspect_hold_timer`) over any covered cell without dragging past $22\text{px}$.
   - Content: Status icon (`icon_check`, `icon_warning`, `icon_no_clue`, `icon_mismatch`), Title, balanced two-line Description, and two-line Tip ("Release touch to close").
   - Theming: Adapts across Light Zen, Dark Zen, Dark Neon, and Weird Cyberpunk.
   - Dismissal: Instant fade/hide on releasing touch/cursor.
2. **Weird Mode Unlock Progress Popup (`scenes/ui/weird_unlock_popup.tscn`)**:
   - Triggered on mode toggle when `weird_unlock_points < 2000`. Shows progress bar (`X / 2,000 Points`), rules summary, and +900 pts master reward card.
3. **Symbol Legend Modal (`scenes/ui/symbol_legend_modal.tscn`)**:
   - HUD `InfoBtn` guide detailing 3-star conditions, block validation badges (`✓`, `❓`, `N ⚠️`, `📐±N`), and bottom bar controls.
   - **Touch & Drag Kinetic Scrolling Engine**: Unified touch (`InputEventScreenTouch` / `InputEventScreenDrag`) and desktop mouse drag/wheel controller with 0-deadzone responsiveness, instantaneous 1:1 finger tracking, recursive child `MOUSE_FILTER_IGNORE` overrides (preventing icon badges and card panels from consuming drags), exponential kinetic inertia glide (`KINETIC_FRICTION = 0.90`), instant touch arrest on tap-down, and max scroll boundary clamping.
4. **Theme Selection Modal (`scenes/ui/theme_select_modal.tscn`)**:
   - Real-time live switching on card tap (`GameState.set_theme()`) allowing immediate comparison. Dedicated exit via "OK" button or phone back button (`main.gd` Priority 3d). Displays localized tip (`KEY_THEME_SELECT_TIP`) across 19 languages.
5. **Language Selection Modal (`scenes/ui/language_select_modal.tscn`)**:
   - 19-locale grid with native names and checkmark indicators. Integrated `MarginContainer` (24px H, 26px V) outer padding. Dynamic multi-theme styling engine (`_style_modal_theme()`): harmonizes OK button (`confirm_btn`), dialog panel, headers, and language cards across Light Zen, Dark Zen, and Dark Neon. Dedicated exit via "OK" button or phone back button (`main.gd` Priority 3e) with elastic button hover micro-animations. Displays localized tip (`KEY_LANG_SELECT_TIP`).
6. **Purchase Modal (`scenes/ui/purchase_modal.tscn`)**:
   - Store modal with $1.99 USD Remove Ads buy button, restore purchases button, feature checklist, and localized price. Fully reactive multi-theme styling engine: dynamically evaluates and applies styles across Light Zen, Dark Zen, Weird Mode, and Dark Neon upon opening (`popup_modal`), visibility changes (`visibility_changed`), and theme selection (`SaveManager.save_data_updated` / `theme_selected`). Includes theme-tailored separators and tactile pressed button styleboxes.

---

## 8. Workspace File Inventory & Directory Structure

```
d:\Godot_projects\shikaku\
├── .env                              # Environment secrets (AdMob IDs, billing SKUs, paths)
├── .env.example                      # Documented template with Google Demo defaults
├── .gitignore                        # Git rules protecting .env and build caches
├── project.godot                     # Godot 4.7 config, Autoloads & translation tables
├── export_presets.cfg                # Android, Desktop & Web (itch.io, CrazyGames, GameDistribution) presets
├── export_templates/                 # Custom HTML5 boot shells with canvas touch optimization
│   ├── web_shell_itch.html           # Ad-free web shell for itch.io
│   ├── web_shell_crazygames.html     # CrazyGames SDK v3 web shell with async initialization
│   └── web_shell_gamedistribution.html # GameDistribution SDK web shell with event listeners
├── shikaku_changelog.md              # Complete chronological changelog (Milestones 1–243)
├── shkikaku_development_progress.md  # Master system architecture & progress reference
├── android/plugins/                  # Native Android plugins (.aar, .gdap) for Google Play Billing
├── addons/
│   ├── admob/                        # Poing Studios AdMob v5 SDK integration
│   └── godot_ai/                     # MCP AI paired programming & automated test runner
├── data/
│   ├── puzzle_dataset.dat            # 1,000 Classic levels (2.24 MB, SHKQ magic header)
│   └── weird_puzzle_dataset.dat      # 1,000 Weird levels (3.5 MB, WRDK magic header)
├── assets/
│   ├── app_icons/
│   │   └── concept_3a_dark_neon_v2.png # Official 512x512 3x3 tessellated app icon (PNG-32)
│   ├── fonts/
│   │   └── game_font_bold.ttf        # High-precision GPU MSDF vector typography font
│   └── icons/                        # 46+ 128x128 RGBA icons (incl. icon_no_ads.svg, #989187 outlines)
├── translations/
│   ├── game_translations.csv         # Master multi-language CSV across 19 locales (353+ verified keys)
│   └── game_translations.*.translation # 19 compiled binary translation tables
├── scripts/
│   ├── env.gd                        # Centralized Environment Autoload (incl. Web platform IDs)
│   ├── ad_manager.gd                 # Unified AdManager routing to WebAdBridge on Web & AdMob on Android
│   ├── web_ad_bridge.gd              # Web ad SDK bridge singleton (CrazyGames v3 & GameDistribution)
│   ├── billing/                      # BillingService, GooglePlayBillingService, MockBillingService
│   ├── entitlement_manager.gd        # Autoload SSOT for ad-removal entitlement
│   ├── font_scale_manager.gd         # Universal 100% fixed base typography anchor
│   ├── game_log.gd                   # Editor-only gated logging engine
│   ├── game_state.gd                 # Central state machine, timer, clue map, 3-star logic
│   ├── iap_manager.gd                # IAP facade delegating to EntitlementManager
│   ├── poly_shape.gd                 # Polyomino data model, BFS contiguity & centroid math
│   ├── puzzle_generator.gd           # BSP & cluster generators, CSP solver, par calculations
│   ├── puzzle_loader.gd              # Fast binary stream deserializer reading datasets
│   ├── safe_area_helper.gd           # Mobile safe area & hardware cutout detection and mock engine
│   ├── save_manager.gd               # Persistence engine at user://save_data.json (Schema v3)
│   ├── secure_storage.gd             # Hardware-bound AES-256 encrypted storage + Web anonymous fallback
│   ├── sound_manager.gd              # Real-time procedural AudioStreamGenerator synthesizer
│   ├── system_audit_verifier.gd      # Automated F9 diagnostic test verifier
│   ├── translation_manager.gd        # Dynamic locale loader & non-Latin SystemFont fallbacks
│   └── tutorial_manager.gd           # Visual onboarding tour state machine
├── scenes/
│   ├── main.tscn / main.gd           # Root orchestrator & screen transition manager
│   ├── board/                        # board, cell_tile, polyomino_renderer, rectangle_block
│   ├── effects/                      # confetti_particles (dual rainbow cannons)
│   └── ui/                           # 17 UI screens, modals, HUD, and components
└── tests/                            # 19 McpTestSuite suites (133 automated tests, 100% pass rate)
```

---

## 9. Core Game Mechanics & Pure 3-Star Condition System

### Pure 3-Star Evaluation
Evaluated independently during play:
- **⭐ Star 1 (Grid Completed)**: 100% valid grid partition without empty or illegal cells.
- **⭐ Star 2 (Speed Master)**: Completed within the target time budget for the grid size (`Speed Master (%02d:%02d / %02d:%02d)`).
- **⭐ Star 3 (Flawless Finish)**: Completed satisfying all 4 accuracy criteria (`Flawless Finish (%d / %d Moves)`). If failed, dynamically displays the exact reason:
  1. `Erase Used` (when `GameState.erase_tool_used` is true)
  2. `Undo Used` (when `GameState.undo_redo_tool_used` is true)
  3. `Hint Used` (when `GameState.hint_tool_used` is true)
  4. `Too Many Moves (%d/%d)` (when `GameState.move_count > par_moves`)
  5. Compound descriptors (e.g. `Erase & Undo Used`, `Erase, Undo, Hint Used, 11/6 Moves`).

### Polyomino Par Moves Algorithm (`calculate_min_target_moves`)
In Weird Mode, branching polyominoes (T-shapes, Crosses `+`, forks) require multiple strokes. `PuzzleGenerator.calculate_min_target_moves()` analyzes the orthogonal adjacency graph:
- Shapes with a valid single-stroke Hamiltonian path $\to$ **1 move**.
- Shapes with branches decompose into minimum path segments $\to$ **$1 + \text{branches}$ moves**.
- Evaluated via bounded DFS ($N \le 14$) with Warnsdorff greedy heuristic for $N > 14$ ($<0.05\text{ms}$).

---

## 10. Touch Interaction, Snap & Gesture Engines

1. **Magnetic Hysteresis Snap Hold ($\pm 0.85$ Deadzone)**:
   - Eliminates finger roll-off slip upon touchscreen release.
   - Classic: Locks `_locked_valid_rect` when area and clue match; $\pm 0.85$ cell deadzone prevents size changes.
   - Weird: Locks `_locked_poly_last_cell`; hysteresis measured from outer bounding box ($0.85\times\text{cell}$ buffer).
2. **Freeform Drag-to-Paint & Branching Path-Tracing**:
   - Touching down initiates a stroke. Moving across orthogonal neighbors expands seamlessly into any cell adjacent to *any* cell in the active stroke, enabling single-stroke L, T, and cross shapes.
3. **Slice Backtracking & Base-Preserving Extension**:
   - Dragging backward across a previously visited cell slices the array at `find(cell)`, instantaneously trimming trailing cells.
   - Touching and dragging from an existing polyomino enters extension mode. Decoupled into `_base_extension_cells` (immutable) and `_extension_stroke_cells` (new); backtracking never truncates the original base shape.
4. **Persistent Manual Erase Toggle**:
   - Active state has red fill, glowing border, and 1.0 Hz sinusoidal pulse.
   - Weird Mode: Tapping/dragging carves individual cells; `_partition_contiguous_cells()` performs orthogonal BFS to split remaining cells into connected pieces. Turning ON requires $\ge 1$ placed box; turning OFF has zero preconditions.
   - Tapping empty cells in Erase mode emits `erase_empty_cell_warning_requested` showing a 5.0s sinusoidal blinking banner.
5. **Press-and-Hold Inspector (CanvasLayer 95)**:
   - 100ms hold (`_inspect_hold_timer`) with $22\text{px}$ movement tolerance opens status card directly above touch point with $104\text{px}$ clearance (+90px offset over 14px base, flipped below near TopBar). Renders in pure $720\times 1280$ viewport coordinates. Releasing touch immediately dismisses.

---

## 11. Mobile Viewport, Pan/Zoom & GPU Frustum Culling Engine

- **Cell Sizing**: Clamped between $18\text{px}$ and $96\text{px}$ based on viewport aspect ratio and grid dimensions ($5\times 5$ to $30\times 30$).
- **6-Tier Zoom Progression Sequence**:
  $$\mathbf{1.0\times \longrightarrow 1.6\times \longrightarrow 2.4\times \longrightarrow 3.6\times \longrightarrow 5.0\times \longrightarrow 6.0\times \longrightarrow 1.0\times}$$
- **High-Visibility Touch Sliders**: $72\text{px}$ touch-padded neon sliders with dark espresso grabbers appear when zoomed.
- **Frustum Culling**: Off-screen tiles and blocks are hidden (`visible = false`), maintaining 60 FPS on $30\times 30$ boards (900 cells).
- **Mobile Safe Area & Hardware Notch Avoidance Engine (`scripts/safe_area_helper.gd`)**:
  - **Cutout & Inset Analysis**: Translates hardware display cutouts (`DisplayServer.get_display_cutouts()`) and safe area insets (`DisplayServer.get_display_safe_area()`) into logical canvas coordinates under Godot's `canvas_items` + `expand` stretch mode. Categorizes top cutouts into left-side, center, or right-side positions.
  - **Gameplay Scene (Option A Seamless Full-Cover TopBar)**: When a notch or top safe inset is detected, `TopBar.offset_top` anchors to $0.0$ while `offset_bottom` extends to `top_safe + 86.0`. Its inner `MarginContainer` sets `margin_top = top_safe + 8.0`, safely dropping `BackBtn`, `CenterStatsHBox`, and `InfoBtn` below the notch while the dark header seamlessly covers the hardware status bar.
  - **Dynamic BoardContainer Realignment (`scenes/main.gd`)**: `hud.topbar_resized` dynamically updates `$GameplayArea/BoardContainer.offset_top = topbar_bottom + 6.0`, ensuring the puzzle grid dynamically centers without colliding with the top bar.
  - **Main Menu Top Buttons Side-Notch Inset Clearance (`scenes/ui/main_menu.gd`)**: Both `HowToPlayBtn` and `RemoveAdsIconBtn` drop to a unified vertical level (`max(40.0, top_safe + 10.0)`). In addition, if a hardware cutout is detected on the side (e.g. left punch-hole or right punch-hole), the affected button automatically pushes inward with $+16\text{px}$ safety clearance.
  - **Desktop/Editor Mock Engine**: Supports `SafeAreaHelper.MockNotchMode` (`TOP_CENTER`, `TOP_LEFT`, `TOP_RIGHT`, `TALL_ISLAND`) for instantaneous local development and testing.

---

## 12. GPU MSDF Vector Typography & Visual Asset Suite

- **GPU MSDF Vector Fonts**: [assets/fonts/game_font_bold.ttf](file:///d:/Godot_projects/shikaku/assets/fonts/game_font_bold.ttf) configured with `multichannel_signed_distance_field = true`, `msdf_pixel_range = 16`. Numbers stay sharp at any zoom level ($1.0\times$ to $6.0\times$) with 0 CPU rasterization.
- **Official App Icon (`concept_3a_dark_neon_v2.png`)**: 100% solved $3\times 3$ grid partition ($4 + 5 = 9$ cells: cyan $2\times 2$ box `4` wrapped by violet L-pentomino `5`), modern white vector numerals, squircle safe-zone centering, normalized PNG-32 bitstream (`89-50-4E-47`).
- **Vector Icons**: 46+ high-res $128\times 128\text{px}$ icons in `assets/icons/`:
  - Dedicated vector Remove Ads billboard (`icon_no_ads.svg`).
  - Faceted Royal Crown (`icon_crown.png`) with 3D golden facets and cyan gems.
  - Just-noticeable warm stone grey outline (`#989187`) around menu icons for Light Zen paper readability.
  - No-clue icon interior (`icon_no_clue.png`) filled with `#24242A` dark grey cavity for WCAG AAA 14.2:1 contrast.

---

## 13. Audio Synthesizer & Procedural Sound Engine

Real-time PCM synthesis via `AudioStreamGeneratorPlayback` in [sound_manager.gd](file:///d:/Godot_projects/shikaku/scripts/sound_manager.gd):
- **Click**: $0.03\text{s}$ sine chirp ($800\text{Hz} \to 400\text{Hz}$).
- **Drag Tick**: $0.015\text{s}$ subtle click ($600\text{Hz}$).
- **Valid Placement**: Harmonious C-Major chord ($523.25\text{Hz}, 659.25\text{Hz}, 783.99\text{Hz}$).
- **Invalid Placement**: $0.12\text{s}$ dissonant square-wave buzzer ($150\text{Hz}$).
- **Star Reveal**: Ascending tiered crystal chimes ($D_5 \to G_5 \to C_6$).
- **Victory Fanfare**: Harmonized victory chord and 3-star fanfare.
- **Milestone Grand Fanfare**: Ascending major arpeggio ($C_5 \to E_5 \to G_5 \to C_6$) via `play_grand_fanfare()`.
- **Mode Switch**: Ascending E-Major shimmer ($659 \to 1318\text{Hz}$) for Weird; descending chord ($880 \to 440\text{Hz}$) for Classic.
- **Dynamic Pitch Variation Engine**: Organic $\pm 10\%$ procedural pitch variation (`pitch_variation_range = 0.10`, `pitch_variation_enabled = true`) applied via sample-accurate phase increments. Chords and multi-note arpeggios transpose as cohesive harmonic units to prevent microtonal discordance.

---

## 14. Monetization Architecture: Google AdMob & Google Play Billing

- **Decoupled Configuration**: App IDs, ad unit IDs, and billing SKUs loaded via `Env` from `.env` with fallback defaults.
- **AdMob (Poing Studios v5)**:
  - Onboarding shield: Levels 1–5 in Campaign are 100% ad-free.
  - Pacing: Requires 6 cumulative action points (2 pts per clear/reset, 1 pt per random switch) before interstitial ad.
  - Cooldown: 180s exit/reset guard prevents rapid ad triggers.
- **Google Play Billing Entitlement (`EntitlementManager`, `IAPManager` & `GooglePlayBillingService`)**:
  - SSOT singleton exposing `is_ads_removed() -> bool` and `ads_removed_changed(is_removed: bool)`.
  - Adapters: `GooglePlayBillingService` (Android production utilizing first-party `BillingClient` wrapper node with auto-acknowledgment and typed signal routing) and `MockBillingService` (Desktop/CI simulator).
  - Encrypted Persistence: `user://entitlement.dat` encrypted with AES-256 via hardware-bound key (`OS.get_unique_id() + salt`) and HMAC SHA-256 tamper verification.
  - Immediate Ad Eviction: On purchase, forced interstitials/banners are suppressed and in-memory ads are instantly freed.
  - Opt-in Rewarded Ads: Video ads remain available for hint refills with paid perks (15 max hints, 1 ad per refill for first 5 refills).
  - Official Godot 4 Android IAP Spec: Direct integration with `addons/GodotGooglePlayBilling/BillingClient.gd`, wrapping JNI singletons with typed signals (`connected`, `disconnected`, `connect_error`, `query_product_details_response`, `query_purchases_response`, `on_purchase_updated`, `acknowledge_purchase_response`).
  - Permissions & Packaging: `export_presets.cfg` explicitly declares `permissions/custom_permissions=PackedStringArray("com.android.vending.BILLING")`, `permissions/internet=true`, and `gradle_build/use_gradle_build=true` with target version code 12 (v1.1.2).
  - Localized Price Synchronization: `GooglePlayBillingService` queries store catalog details via `query_product_details(..., BillingClient.ProductType.INAPP)`, buffering results in `cached_sku_details`. `IAPManager` extracts `formatted_price` from `one_time_purchase_offer_details_list` (Array) / `one_time_purchase_offer_details` (Dictionary), updates `price_remove_ads_display`, and broadcasts `price_updated(sku, formatted_price)`. Both `purchase_modal.gd` (Buy CTA button + Feature 4 bullet) and `victory_modal.gd` (`RemoveAdsLink`) dynamically render the player's local store price in real time across all 19 supported languages.

---

## 15. Multi-Language Localization & Fixed 100% Base Typography

- **19 Languages Supported**: English (`en`), Arabic (`ar`), Japanese (`ja`), Simplified Chinese (`zh`), Korean (`ko`), German (`de`), Hindi (`hi`), Portuguese (`pt`), Spanish (`es`), French (`fr`), Italian (`it`), Russian (`ru`), Turkish (`tr`), Indonesian (`id`), Vietnamese (`vi`), Polish (`pl`), Dutch (`nl`), Thai (`th`), Ukrainian (`uk`).
- **Smart Web Platform Filter (Zero Font Bloat Architecture)**: On Web (HTML5/WASM) builds, browser sandboxing isolates the engine from OS system fonts (`SystemFont`), causing non-Latin scripts to display "tofu" boxes (hex character glyphs). `TranslationManager.get_supported_languages()` dynamically filters the 19-language catalog down to the 13 built-in Latin/Cyrillic languages (`en`, `es`, `pt`, `fr`, `de`, `it`, `ru`, `uk`, `tr`, `pl`, `nl`, `id`, `vi`) with 0 KB font overhead. Unsupported web locales (`ar`, `ja`, `zh`, `ko`, `hi`, `th`) automatically fallback to `en` in `LanguageSelectModal` and `SaveManager`, while Android and native desktop retain all 19 languages using native Noto/system font resolution.
- **353 Verified Translation Keys**: Complete, zero-defect coverage across all 19 supported locales in [translations/game_translations.csv](file:///d:/Godot_projects/shikaku/translations/game_translations.csv) (0 empty cells, 0 mojibake characters, 0 format specifier mismatches).
- **100% Zero-Hardcoded GDScript UI Controllers**: All How-To-Play screen cards (Classic & Weird), TutorialOverlay guided tours (47 dialog calls across Steps 1–7 & Erase/Delete modes), SymbolLegendModal star rating conditions & section headers, Out of Hints ad popups, HUD multi-ad hint badges, Board drag preview tags, AdManager sequence toasts, and victory reason fallbacks use dynamic `tr()` lookups.
- **Dynamic Fallbacks**: Non-Latin `SystemFont` fallbacks for CJK, Devanagari, Arabic RTL, Cyrillic, and Thai.
- **Fixed 100% Base Typography**: Base scale permanently locked to 100% via `FontScaleManager` and `SaveManager`. Resizing sliders removed to guarantee zero layout clipping.
- **Real-Time Re-Translation**: Switching language instantly updates all visible and cached UI elements in live memory.
- **Studio Branding**: "BLAQ STUDIOS" branding remains unlocalized in English across all locales.

---

## 16. Procedural CSP & Cluster Growth Generators

- **Binary Space Partitioning (BSP)**: Decomposes grid into rectangular partitions with difficulty-scaled split probabilities (`0.85` Easy $\to$ `0.55` Expert) and $65\%$ perimeter clue bias to break symmetry.
- **CSP Backtracking Solver**: Validates candidate clue placements using flat 1D occupancy grid to guarantee **strictly 1 unique solution**. Accurately distinguishes budget exhaustion (`-1`) from unsolvability (`0`).
- **Organic Cluster Growth (Weird Mode)**: Multi-source randomized Prim's/Dijkstra expansion growing target polyominoes with bottleneck clue placement.

---

## 17. Interactive Visual Onboarding & Tutorial Systems

- **Perimeter Dimming Cutout**: 4 panels (`DimTop`, `DimBottom`, `DimLeft`, `DimRight`) create transparent spotlight cutout over target buttons with pulsing borders and animated `👇` arrow.
- **Classic 9-Step Guided Tour**: Covers Campaign play, Level 1 & 2 solving, Random Mode, and Large Grid Zoom/Sliders ($\ge 15\times 15$).
- **Weird Mode 5-Stage Onboarding**: Unlock celebration, campaign entry, level select spotlight, Level 1 polyomino drawing/erase, and Level 2 interlocking shapes/4-color shading.
- **Strict One-Time Guard**: Weird switch tutorial triggers only once upon reaching 2,000 points and is permanently dismissed once entered or skipped (`weird_mode_unlocked_celebrated = true`).

---

## 18. Developer Diagnostics, Hotkeys & Major Bug Resolutions

### Developer Keyboard Hotkeys (Debug Builds)
- **`F9`**: Runs automated system audit verifier ([system_audit_verifier.gd](file:///d:/Godot_projects/shikaku/scripts/system_audit_verifier.gd)) testing 1,000 Classic + 1,000 Weird levels, translations, and icons.
- **`F10`**: Unlocks and completes the next 10 campaign levels for active mode.
- **`F11`**: Instantly solves the active board with correct partition and 4-color graph shading (desktop/editor debug builds only; deactivated on Web).
- **`F12`**: Complete developer reset (wipes save data, re-arms tutorial, resets encrypted entitlement; desktop/editor debug builds only; deactivated on Web).

### Automated Test Harness (19 Suites / 133 Tests)
- Built on `McpTestSuite` in `tests/test_*.gd`. 100% pass rate with 0 failures, 0 skips, and 0 warnings across all 19 test suites.
- Zero ObjectDB orphan leaks enforced via `track(node)` lifecycle management.

### Major Problems & Architectural Fixes
1. **$30\times 30$ Weird Grid Generator Freeze**: Bounded Hamiltonian DFS to $N \le 14$ and added Warnsdorff greedy heuristic for $N > 14$, reducing par calculation from minutes to $<0.05\text{ms}$. Multi-pass attachment resolved orphan cells.
2. **Android Logcat IPC Performance Stalls**: Introduced `GameLog`, gating print calls strictly to editor sessions (`OS.has_feature("editor")`), completely eliminating Android Binder IPC overhead in release builds.
3. **AI Image PNG Magic Header Corruption**: Re-encoded AI-generated JPEG streams to authentic 32-bit PNG headers (`89-50-4E-47`), resolving Godot `ERR_CANT_OPEN` import failures.
4. **Theme Selection Modal Auto-Dismiss**: Decoupled theme selection from modal closing in `ThemeSelectModal`. Card taps switch themes live for instant comparison; dedicated exit via OK button or phone back button.
5. **Language Selection Modal Margin Alignment**: Integrated `MarginContainer` (24px H, 26px V) into `language_select_modal.tscn`, eliminating flush card boundaries against dialog borders.
6. **Random Mode Victory Replay Same Grid Reload Resolution**: Preserved active grid configuration via `current_puzzle.duplicate(true)` in `GameState.replay_current_puzzle()`, preventing the board from loading an unintended new puzzle when the player requests a replay.
7. **Procedural Audio Pitch Variation Engine**: Added dynamic $\pm 10\%$ procedural pitch variation (`pitch_variation_range = 0.10`) with sample-accurate phase increments while ensuring polyphonic chords and arpeggios transpose as cohesive harmonic units to prevent microtonal dissonance.
8. **Google Play Billing Connection & Diagnostics Hardening**: Enhanced [google_play_billing_service.gd](file:///d:/Godot_projects/shikaku/scripts/billing/google_play_billing_service.gd) with safe dynamic signal wiring (`connect()`), 4-parameter JNI `purchase()` / 2-parameter `queryPurchases()` calls matching GodotGooglePlayBilling v3.3.0, `isReady()` state synchronization, on-demand reconnection upon user purchase action, and descriptive Play Store error code reporting.
9. **Gameplay Info Box Touch Scrolling & Kinetic Momentum Resolution**: Resolved unresponsive touch drag on `SymbolLegendModal` by recursively configuring child cards inside `CardsVBox` to `MOUSE_FILTER_IGNORE`, implementing a zero-deadzone unified touch/mouse drag engine in `_on_scroll_area_gui_input`, and adding exponential kinetic momentum decay (`KINETIC_FRICTION = 0.90`) with instant touch arrest and boundary clamping.
10. **Android Startup Optimization & Seamless Boot Splash Hand-Off**: Eliminated the 2–5 second unresponsive cold-boot black screen by configuring Godot's native boot splash and Android export preset to the game's dark electric navy brand background (`Color(0.04, 0.06, 0.12, 1)`) with the centered 512px app icon (`concept_3a_dark_neon_v2.png`), providing instant visual response upon app launch before seamlessly handing off to the in-game animated Blaq Studios splash. Bypassed the 400 KB GDScript CSV translation parsing in exported builds to leverage instant native C++ binary `.translation` loading, offloaded the 1,000-puzzle binary dataset loading to `WorkerThreadPool` during the splash animation in `main.gd`, and converted modal button/swatch population (`LanguageSelectModal`, `ThemeSelectModal`) to lazy generation.
11. **Automated Test Suite Stabilization & Zero-Placeholder UI Compliance**: Configured `@tool` and `Engine.is_editor_hint()` guards across all modal and control scripts (`hud.gd`, `main_menu.gd`, `purchase_modal.gd`, `victory_modal.gd`, `symbol_legend_modal.gd`) to prevent `PlaceholderScriptInstance` invocation when scenes are instantiated inside editor-space test runners. Resolved mutable closure capture in `test_entitlement_system.gd`, added fallback translation string handling in `purchase_modal.gd`, and added tree root lifecycle attachment in `test_safe_area_system.gd`, achieving 100% test pass rate across all 18 suites (123/123 passing).
12. **Multi-Platform Web Architecture (itch.io, CrazyGames & GameDistribution)**: Engineered a unified, single-codebase web export pipeline targeting itch.io (ad-free), CrazyGames (SDK v3 midgame & rewarded ads), and GameDistribution (GD SDK interstitial & rewarded ads). Implemented `WebAdBridge` (`scripts/web_ad_bridge.gd`) to auto-detect SDKs via `JavaScriptBridge`, handle lifecycle hooks (`gameplayStart`/`gameplayStop`), manage ad callbacks, and pause audio/timers during ad playback with graceful passthrough on ad-free platforms. Created 3 custom HTML5 shells (`export_templates/web_shell_*.html`) with responsive touch canvas styling and dark `#0A0F1F` boot splashes, configured single-threaded presets (`preset.2`, `preset.3`, `preset.4`) in `export_presets.cfg`, added web device-ID fallback in `SecureStorage`, and conditionally hid IAP and Quit controls across Main Menu, Settings, and Victory modals on web (`OS.has_feature("web")`).
13. **Responsive Desktop Web Layout & Proportional UI Clamping**: Addressed horizontal button and tutorial card distortion when running on desktop widescreen displays (16:9 / 1920x1080) under canvas expand mode. In `hud.gd`, dynamically clamped the BottomBar buttons container (`VBox`) to 700px max width centered horizontally on viewports $>720\text{px}$, preserving natural button aspect ratios (~160x80px) while maintaining full-width panel backgrounds. In `tutorial_overlay.gd`, implemented `_position_dialog_panel()` clamping popup tutorial cards to 680px max width centered horizontally across viewport resize events. Enhanced all custom HTML5 shells with visual progress bars and informative local `file://` protocol safety warnings.
14. **Web Input Hardening (Escape Modal Suppression & Developer Hotkey Deactivation)**: Suppressed the 'Quit Game?' confirmation modal on Web builds (`OS.has_feature("web")`) when pressing Escape on the Main Menu across `main.gd`, `main_menu.gd`, and `confirmation_modal.gd`. In addition, guarded developer hotkeys (`F9`–`F12`) against execution on Web builds in `main.gd`, ensuring browser native shortcuts (such as F11 fullscreen and F12 developer console) operate without interfering with the game.

---

## 19. Weird Mode (Freeform Polyomino Partition) Master Specifications

- **Capsule Switch (`ModeSliderSwitch`)**: Standalone $192\times 68\text{px}$ toggle in `TopControlsContainer` with animated knob displaying `■`, `☶`, or `🔒`. Subtitle morphs between `"DIVIDE BY BOX"` and `"DIVIDE BY WEIRD BOX"`.
- **Atmospheric Theming**: Cosmic Cyber-Violet base (`#120A24`), luminous purple grid, rotating polyominoes, and $550\text{ms}$ shockwave transition on toggle.
- **Centralized `GameState.THEMES` Registry**:
  - Curated 12-color graph palette avoiding conflict with error colors:
    - **Yellow**: Size Mismatch (`Color(1.0, 0.88, 0.15, 0.52)`).
    - **Red**: Multiple Clues (`Color(0.95, 0.15, 0.22, 0.52)`).
    - **White**: No Clues (`Color(0.96, 0.96, 0.98, 0.52)`).
    - **Valid Box**: Assigned theme palette color ($0.52\alpha$).
  - **Border Preservation**: Borders strictly retain assigned theme palette color across valid and error states, ensuring adjacent error boxes remain visually distinct.
- **Dual-Mode Save Schema v3**: Completely isolated dictionaries in `save_data.json` for Classic and Weird progression, stars, high scores, and saved board states.

---

## 20. Full Milestone History & Changelog

👉 **[Click here to view the complete development changelog (`shikaku_changelog.md`)](file:///d:/Godot_projects/shikaku/shikaku_changelog.md)** for the full chronological record of all 244 development milestones, bug fixes, algorithmic evolutions, asset pipelines, and test validations.
