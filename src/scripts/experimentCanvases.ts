import { drawDotField, defaultDotPalette, type DotPalette } from "../lib/dotCanvas";
import { clamp, mix, type DotField } from "../lib/canvasField";

type InteractiveField = DotField & {
  canvas: HTMLCanvasElement;
  card: HTMLElement;
  pointer: { x: number; y: number };
  targetActive: number;
};

// Both themes share sizing, focus/pointer input, motion preferences and scheduling.
const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
let reduceMotion = motionPreference.matches;
function readPalette(): DotPalette {
  const style = getComputedStyle(document.documentElement);
  const rgb = (property: string) => {
    const values = style.getPropertyValue(property).trim().split(/\s+/).map(Number);
    return values.length === 3 && values.every(Number.isFinite)
      ? { r: values[0], g: values[1], b: values[2] } : undefined;
  };
  return {
    ink: rgb("--preview-ink-rgb") ?? defaultDotPalette.ink,
    asciiInk: rgb("--preview-ascii-rgb") ?? defaultDotPalette.asciiInk,
    accent: rgb("--preview-accent-rgb")
  };
}
let palette = readPalette();
const canvases = document.querySelectorAll<HTMLCanvasElement>("[data-experiment-canvas]");
const monoFont = getComputedStyle(document.documentElement).getPropertyValue("--font-mono");
const fields = Array.from(canvases).flatMap((canvas, index): InteractiveField[] => {
  const card = canvas.closest<HTMLElement>("[data-experiment-preview]");
  const context = canvas.getContext("2d");
  if (!context || !card) return [];
  const state: InteractiveField = {
    canvas,
    card,
    context,
    index,
    mode: card?.getAttribute("data-mode") ?? "color-cluster",
    shape: card?.getAttribute("data-shape") ?? "square",
    label: card?.getAttribute("data-label") ?? "",
    accent: {
      r: Number(card?.getAttribute("data-accent-r") ?? 60),
      g: Number(card?.getAttribute("data-accent-g") ?? 255),
      b: Number(card?.getAttribute("data-accent-b") ?? 137)
    },
    width: 0,
    height: 0,
    pointer: { x: 0.5, y: 0.5 },
    easedPointer: { x: 0.5, y: 0.5 },
    active: 0,
    targetActive: 0,
    phase: index * 18
  };

  return [state];
});

function resizeField(field: InteractiveField) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const rect = field.canvas.getBoundingClientRect();
  field.width = rect.width;
  field.height = rect.height;
  field.canvas.width = Math.max(1, Math.round(rect.width * dpr));
  field.canvas.height = Math.max(1, Math.round(rect.height * dpr));
  field.context.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function drawField(field: InteractiveField) {
  const { context, width, height } = field;
  if (!width || !height) return;

  field.active = mix(field.active, field.targetActive, reduceMotion ? 1 : 0.16);
  field.easedPointer.x = mix(field.easedPointer.x, field.pointer.x, reduceMotion ? 1 : 0.22);
  field.easedPointer.y = mix(field.easedPointer.y, field.pointer.y, reduceMotion ? 1 : 0.22);
  field.phase += reduceMotion ? 0 : 0.008 + field.active * 0.01;

  context.clearRect(0, 0, width, height);

  drawDotField(field, reduceMotion, monoFont, palette);
}

let frameId = 0;
function requestFrame() {
  if (!frameId && !document.hidden) frameId = requestAnimationFrame(frame);
}

function frame() {
  frameId = 0;
  fields.forEach((field) => drawField(field));
  if (!reduceMotion && fields.length) requestFrame();
}

fields.forEach((field) => {
  resizeField(field);

  field.card.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch" || reduceMotion) return;
    const rect = field.card.getBoundingClientRect();
    field.pointer.x = clamp((event.clientX - rect.left) / rect.width, 0, 1);
    field.pointer.y = clamp((event.clientY - rect.top) / rect.height, 0, 1);
    field.targetActive = 1;
    requestFrame();
  });

  field.card.addEventListener("pointerleave", () => {
    field.targetActive = 0;
    field.pointer.x = 0.5;
    field.pointer.y = 0.5;
    requestFrame();
  });

  field.card.addEventListener("focus", () => {
    field.targetActive = reduceMotion ? 0 : 1;
    field.pointer = { x: 0.75, y: 0.35 };
    requestFrame();
  });
  field.card.addEventListener("blur", () => {
    field.targetActive = 0;
    field.pointer = { x: 0.5, y: 0.5 };
    requestFrame();
  });
});

const resizeObserver = new ResizeObserver((entries) => {
  entries.forEach((entry) => {
    const field = fields.find((item) => item.canvas === entry.target);
    if (field) {
      resizeField(field);
      drawField(field);
    }
  });
});

fields.forEach((field) => resizeObserver.observe(field.canvas));
fields.forEach((field) => drawField(field));
window.addEventListener("themechange", () => {
  palette = readPalette();
  requestFrame();
});
motionPreference.addEventListener("change", () => {
  reduceMotion = motionPreference.matches;
  fields.forEach((field) => {
    field.active = 0; field.targetActive = 0;
  });
  requestFrame();
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    cancelAnimationFrame(frameId);
    frameId = 0;
  } else requestFrame();
});
if (fields.length) requestFrame();
document.fonts.ready.then(() => { if (fields.length) requestFrame(); });
