---
title: "VS Code Theme"
subtitle: "Visual Studio Code theme example"
date: 2026-07-30
homePreview:
  enabled: true
  mode: "outline-repel"
  shape: "circle"
  kicker: "theme / tooling"
  accent: [125, 211, 252]
tags: ["theme", "tooling", "design"]
---

A theme for VS Code based entirely on personal preferences. It is not published to the extension marketplace right now, partly because that path involves creating accounts and more steps than is needed. There is a vsix theme package available below if you would like to take if for a spin yourself.

<figure class="u-media-frame">
  <img class="u-img-fill" style="max-width: 1920px; margin: auto" src="/assets/nyan-matt-theme.png" alt="VS Code using the Nyan Matt theme colors" />
</figure>

<p class="u-caption">Applied theme example.</p>

[Download VSIX](/downloads/nyan-matt-theme-0.0.2.vsix)

[Download JSON](/downloads/Nyan-Matt-color-theme.json)

## Local install

This theme is not published to the VS Code Marketplace. To try it locally, download the `.vsix` file and install it directly.

Using the command line:

```sh
code --install-extension nyan-matt-theme-0.0.2.vsix
```

Or from VS Code:

1. Open the Extensions panel.
2. Open the `...` menu in the panel header.
3. Choose `Install from VSIX...`.
4. Select the downloaded `nyan-matt-theme-0.0.2.vsix` file.
5. Choose the theme from `Preferences: Color Theme`.

The raw theme JSON is included separately for inspection or tinkering, but the `.vsix` is the easiest way to install it.
