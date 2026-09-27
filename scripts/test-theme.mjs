import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import assert from "node:assert/strict";
import test from "node:test";
import ts from "typescript";

const source = readFileSync(new URL("../src/scripts/theme.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText;
const layout = readFileSync(new URL("../src/layouts/SiteLayout.astro", import.meta.url), "utf8");
const bootstrap = layout.match(/<script is:inline>([\s\S]*?)<\/script>/)[1];

function browser({ saved = null, lightSystem = false, blockedStorage = false } = {}) {
  const handlers = {};
  const attributes = {};
  const label = {};
  let stored = saved;
  let systemChange;
  const media = { matches: lightSystem, addEventListener: (_, fn) => { systemChange = fn; } };
  const button = {
    setAttribute: (key, value) => { attributes[key] = value; },
    querySelector: () => label,
    addEventListener: (name, fn) => { handlers[name] = fn; }
  };
  const root = { dataset: {} };
  const events = [];
  const context = {
    document: { documentElement: root, querySelectorAll: () => [button] },
    localStorage: {
      getItem: () => { if (blockedStorage) throw Error("Denied"); return stored; },
      setItem: (_, value) => { if (blockedStorage) throw Error("Denied"); stored = value; }
    },
    matchMedia: () => media,
    window: {
      addEventListener: (name, fn) => { handlers[name] = fn; },
      dispatchEvent: (event) => events.push(event)
    },
    CustomEvent: class { constructor(type, options) { this.type = type; this.detail = options.detail; } }
  };
  runInNewContext(bootstrap, context);
  const initial = root.dataset.theme;
  runInNewContext(compiled, context);
  return { root, initial, attributes, label, handlers, events, stored: () => stored,
    system: (light) => { media.matches = light; systemChange?.(); } };
}

test("first visit defaults to dark before paint regardless of system preference", () => {
  for (const lightSystem of [false, true]) {
    const b = browser({ lightSystem });
    assert.equal(b.initial, "dark");
    assert.equal(b.attributes["aria-checked"], "false");
    b.system(!lightSystem);
    assert.equal(b.root.dataset.theme, "dark");
    assert.equal(b.label.textContent, "Dark");
    assert.equal(b.stored(), null);
  }
});
test("explicit selection persists and overrides later system changes", () => {
  const b = browser();
  b.handlers.click();
  assert.equal(b.stored(), "light");
  b.system(false);
  assert.equal(b.root.dataset.theme, "light");
  const nextPage = browser({ saved: b.stored() });
  assert.equal(nextPage.initial, "light");
  assert.equal(nextPage.attributes["aria-checked"], "true");
  assert.equal(nextPage.events.at(-1).detail, "light");
});
test("cross-tab changes synchronize; clearing storage restores dark", () => {
  const b = browser({ saved: "dark", lightSystem: true });
  assert.equal(b.initial, "dark");
  b.handlers.storage({ key: "nyan-matt-theme", newValue: "light" });
  assert.equal(b.root.dataset.theme, "light");
  b.handlers.storage({ key: "nyan-matt-theme", newValue: null });
  assert.equal(b.root.dataset.theme, "dark");
  b.handlers.storage({ key: "nyan-matt-theme", newValue: "light" });
  b.handlers.storage({ key: null, newValue: null });
  assert.equal(b.root.dataset.theme, "dark");
});
test("unavailable storage and invalid saved preferences do not break switching", () => {
  assert.equal(browser({ saved: "invalid", lightSystem: true }).initial, "dark");
  const b = browser({ blockedStorage: true, lightSystem: true });
  assert.equal(b.initial, "dark");
  b.handlers.click();
  assert.equal(b.root.dataset.theme, "light");
  b.handlers.click();
  assert.equal(b.root.dataset.theme, "dark");
});


const canvasMath = {};
runInNewContext(ts.transpileModule(readFileSync(new URL("../src/lib/canvasField.ts", import.meta.url), "utf8"),
  { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, { exports: canvasMath });
const dotModule = {};
runInNewContext(ts.transpileModule(readFileSync(new URL("../src/lib/dotCanvas.ts", import.meta.url), "utf8"),
  { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, { exports: dotModule, require: () => canvasMath });
const controllerSource = ts.transpileModule(readFileSync(new URL("../src/scripts/experimentCanvases.ts", import.meta.url), "utf8"),
  { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
function previewController() {
  const calls = [];
  const frames = new Map();
  const cardEvents = {}, windowEvents = {}, documentEvents = {};
  let nextFrame = 1, onMotion, onResize;
  const context = { clearRect() {}, setTransform() {} };
  const card = { getAttribute: () => null, addEventListener: (name, fn) => { cardEvents[name] = fn; },
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 300, height: 132 }) };
  const canvas = { closest: () => card, getContext: () => context,
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 300, height: 132 }) };
  const media = { matches: false, addEventListener: (_, fn) => { onMotion = fn; } };
  const doc = { hidden: false, documentElement: { dataset: { theme: "light" } },
    querySelectorAll: () => [canvas], fonts: { ready: { then() {} } },
    addEventListener: (name, fn) => { documentEvents[name] = fn; } };
  const record = (field, reduced, monoFont, palette) => calls.push({ reduced, active: field.active, width: field.width, palette });
  runInNewContext(controllerSource, {
    exports: {}, require: (path) => path.endsWith("canvasField") ? canvasMath
      : { defaultDotPalette: dotModule.defaultDotPalette, drawDotField: record },
    document: doc, getComputedStyle: () => ({ getPropertyValue: (property) => {
      if (property === "--font-mono") return '"Geist Mono", monospace';
      const light = doc.documentElement.dataset.theme === "light";
      return property === "--preview-ink-rgb" ? light ? "22 28 31" : "122 126 132"
        : property === "--preview-ascii-rgb" ? light ? "22 28 31" : "130 130 130"
        : property === "--preview-accent-rgb" && light ? "0 145 170" : "";
    } }),
    window: { matchMedia: () => media, devicePixelRatio: 2,
      addEventListener: (name, fn) => { windowEvents[name] = fn; } },
    requestAnimationFrame: (fn) => { const id = nextFrame++; frames.set(id, fn); return id; },
    cancelAnimationFrame: (id) => frames.delete(id),
    ResizeObserver: class { constructor(fn) { onResize = fn; } observe() {} }
  });
  function tick() { const pending = [...frames.values()]; frames.clear(); pending.forEach(fn => fn()); }
  return { calls, frames, cardEvents, canvas, tick,
    theme: (theme) => { doc.documentElement.dataset.theme = theme; windowEvents.themechange(); },
    motion: (reduced) => { media.matches = reduced; onMotion(); },
    visibility: (hidden) => { doc.hidden = hidden; documentEvents.visibilitychange(); },
    resize: () => onResize([{ target: canvas }]) };
}


test("both themes share interaction and animation scheduling, with refreshed colors on toggle", () => {
  const p = previewController();
  p.tick();
  assert.equal(p.calls.at(-1).palette.accent.g, 145);
  assert.equal(p.frames.size, 1);
  p.cardEvents.focus(); p.tick();
  assert.ok(p.calls.at(-1).active > 0);
  p.cardEvents.blur();
  for (let n = 0; n < 80; n++) p.tick();
  assert.ok(p.calls.at(-1).active < .001);
  p.theme("dark"); p.tick();
  assert.equal(p.calls.at(-1).palette.accent, undefined);
  assert.equal(p.calls.at(-1).palette.ink.r, 122);
  p.theme("light"); p.tick();
  assert.equal(p.calls.at(-1).palette.ink.r, 22);
  p.visibility(true);
  assert.equal(p.frames.size, 0);
  p.visibility(false);
  assert.equal(p.frames.size, 1);
});

test("shared previews resize and respect reduced motion and touch in both themes", () => {
  const p = previewController();
  assert.equal(p.canvas.width, 600);
  assert.equal(p.canvas.height, 264);
  for (const theme of ["light", "dark"]) {
    p.theme(theme);
    p.cardEvents.pointermove({ pointerType: "touch", clientX: 240, clientY: 50 });
    p.tick();
    assert.equal(p.calls.at(-1).active, 0);
    p.motion(true);
    p.cardEvents.focus(); p.tick();
    assert.equal(p.calls.at(-1).active, 0);
    assert.equal(p.calls.at(-1).reduced, true);
    assert.equal(p.frames.size, 0);
    p.resize();
    assert.equal(p.calls.at(-1).width, 300);
    p.motion(false);
  }
});

function dotFrame(mode, active, palette) {
  const colors = [], geometry = [];
  const context = new Proxy({}, {
    get: (_, method) => (...args) => geometry.push([method, ...args]),
    set: (_, name, value) => { (name === "fillStyle" || name === "strokeStyle" ? colors : geometry).push([name, value]); return true; }
  });
  dotModule.drawDotField({ context, width: 300, height: 132, index: 1, mode, shape: "circle",
    label: "K10K", accent: { r: 125, g: 211, b: 252 }, phase: 18, active,
    easedPointer: { x: .75, y: .35 } }, false, "Geist Mono", palette);
  return { colors, geometry };
}
test("light palette changes only colors for all three effects, at rest and during interaction", () => {
  const light = { ink: { r: 22, g: 28, b: 31 }, asciiInk: { r: 22, g: 28, b: 31 }, accent: { r: 0, g: 145, b: 170 } };
  for (const mode of ["color-cluster", "outline-repel", "ascii-reveal"]) {
    for (const active of [0, 1]) {
      const darkFrame = dotFrame(mode, active);
      const lightFrame = dotFrame(mode, active, light);
      assert.ok(lightFrame.geometry.length > 50);
      assert.deepEqual(lightFrame.geometry, darkFrame.geometry);
      assert.notDeepEqual(lightFrame.colors, darkFrame.colors);
    }
    assert.notDeepEqual(dotFrame(mode, 0, light), dotFrame(mode, 1, light));
  }
});
