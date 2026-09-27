# Light theme ink assets

The initial assets were generated with the built-in imagegen tool and later replaced by the site owner. The prompts below document the original versions, not the current replacement images.

- `streak.png`: independent cyan/charcoal streak. Used by the rail and entry borders with different fixed crops; entries can use a separate asset through `--ink-entry-mark`.
- `transfer.png`: pale cyan ghost transfer. Used behind the hero, feed, and entries at independently controlled opacity.

Replace either file to change the material without changing layout. Change asset URLs and strengths in `src/styles/theme.css`, font families in `src/styles/base.css`, and entry crops in `src/styles/content.css`. Keep alpha when exporting replacements; avoid baking white rectangles into the images.

## Generation prompts

### streak.png

Create a production website texture asset, a very narrow tall VERTICAL streak of cyan ink overprinted with charcoal black ink on a genuinely TRANSPARENT background, 512x1536 portrait. Scanned dry ink dragged over paper, broken uneven edges, fine irregular speckles and holes, many white/transparent gaps, incomplete short black strokes near upper quarter and lower third, cyan more continuous but also broken. Overall streak occupies middle half of canvas width with fully transparent margins, fades out irregularly at top and bottom. Authentic 2001 experimental graphic print texture. Flat scan, no objects, no letters, no text, no shadows, no paper backing, no backdrop, no frame. Cyan #00bdd6 and near-black #151a1d. Strong varied opacity, no uniform noise. Must be isolated ink with alpha channel.

### transfer.png

Create a production website decorative texture asset on a genuinely TRANSPARENT background, landscape 1536x1024. Faint cyan ink ghost transfer, scanned uneven roller residue with irregular rubbed fragments, delicate grain and vertical ink dragging. Main ink concentrated across LOWER THIRD and LEFT EDGE, rest largely empty transparent negative space. Sparse dusty cyan marks with very subtle gray traces, pale cyan color, no solid rectangle. Authentic ink-on-paper imperfections but NO paper backing: isolated semitransparent ink residue only with alpha channel. Think early 2000s experimental print studio, airy and understated. No objects, shapes, letters, words, watermarks, borders, gradients, checkerboard pattern or shadows. This will sit behind readable website text and should be subtle.
