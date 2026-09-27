# Site themes

The header switch applies to all pages using SiteLayout. Before first paint, a saved `nyan-matt-theme` preference wins; otherwise dark mode is used, regardless of the system color preference. A selection persists across pages and tabs. Storage failures still allow switching for the current page. Clear this local-storage key to return to the dark default.

## Tuning

`src/styles/global.css` is the single stylesheet entry point. It imports:

- `theme.css`: both palettes, semantic accent colors and image/opacity controls. Dark is the no-JavaScript fallback.
- `base.css`: self-hosted fonts, document defaults, shared typography and content utilities.
- `shell.css`: page widths, header/menu/switch, and the shared image-backed spine.
- `hero.css`: hero layout, dark SVG composition and text animation, light transfer treatment.
- `home.css`: feed, panels, experiment previews, contribution calendar and reveal motion.
- `content.css`: collections, article layouts and entry-card ink treatments.

Each component file owns its theme-specific treatments and responsive rules (900px and 560px). Change shared geometry once; use theme overrides only for intentional visual differences. The dark hero's fixed SVG and text clipping use the same `--abstract-*` coordinates, so keep them together.

- `--font-body`, `--font-heading`: provisional font stacks. Put light-only font overrides in the light-theme block. Load any chosen font files with `@font-face` before changing these values.
- `--font-mono`: Geist Mono, shared by both themes and the text canvas. Regular and italic variable fonts (weights 100–900) and their license are self-hosted directly in `public/fonts/`.
- `--spine-image`: dark uses `/assets/spine-dark.svg`; light uses the ink streak. The shared `.site-spine` is decorative, fixed, and ignores pointer events. Dark retains its homepage-only rail; light retains its rail on all pages. Both share the same rail widths (34px / 8px / 5px) and page gutters across desktop, tablet and mobile, so toggling themes does not move the page shell. Crops and shared widths live in `shell.css`.
- `--ink-streak`, `--ink-transfer`: swappable transparent image assets in `public/assets/ink/`.
- `--spine-opacity`, `--ink-hero-opacity`, `--ink-feed-opacity`, `--ink-entry-opacity`: independent strengths. Mobile reduces background texture.
- `--ink-entry-mark` defaults to the rail image but can point to a dedicated entry-border asset independently.
- Entry selectors set stable alternate crops, flips, sizes and washes. Wash sizing preserves the image aspect ratio and samples its textured edges. The replacement transfer is already pale, so entry opacity is 0.58 on desktop and 0.46 on mobile, with quieter per-entry variations and fading masks.
- `--entry-mark-inset`, `--entry-mark-width`, `--entry-mark-opacity`, and `--entry-mark-mask` control shorter, interrupted border impressions. No runtime randomness or content imagery is added to Notes/Artifacts.

Asset generation prompts are documented in `public/assets/ink/README.md`.

## Canvas interaction

Both themes use the same dot/outline/ASCII renderer in `src/lib/dotCanvas.ts` and the shared controller in `src/scripts/experimentCanvases.ts`. Each preview's `homePreview.mode`, shape, label and motion apply to both themes. Dark retains the per-entry accent colors; light uses charcoal marks and a cyan interaction accent from `--preview-ink-rgb`, `--preview-ascii-rgb` and `--preview-accent-rgb` in `theme.css` (space-separated RGB channels). Palettes refresh immediately on theme changes.

Pointer and keyboard interaction, sizing, hidden-page suspension and reduced-motion handling are shared. The separate halftone and ink-registration prototypes have been removed.

## Legacy cleanup

The unused Atlas, Notebook and Terminal study layouts were removed after checking source/content references. Retained live styles were renamed by their current purpose:

- `mockup-page` → `content-page`
- `collection-list-terminal` → `collection-list-connected`
- `entry-terminal-hero` → `entry-header`
- `entry-body-terminal` → `entry-body-panel`

The unused `collection-hero-terminal` marker was removed. Content utilities and the live legacy `post-page` route remain. The header no longer includes the poptart mark; the old spine's text/collage markup was replaced with one image surface. The dark hero SVG asset, its placement, text color bleed, animation timings and reduced-motion behavior are retained.

## Checks

`npm run test:theme` checks first-paint resolution, persistence, the dark default regardless of system preference, cross-tab changes, unavailable storage, palette-only changes across all three effects, live palette switching, keyboard interaction, touch handling, reduced-motion/hidden scheduling and resizing. `npm run build` validates the Astro production build.
