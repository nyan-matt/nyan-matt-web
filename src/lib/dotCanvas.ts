import { clamp, mix, ease, type DotField } from "./canvasField";

type RGB = { r: number; g: number; b: number };
export type DotPalette = { ink: RGB; asciiInk: RGB; accent?: RGB };
export const defaultDotPalette: DotPalette = {
  ink: { r: 122, g: 126, b: 132 },
  asciiInk: { r: 130, g: 130, b: 130 }
};

const asciiChars = ".:/\\|+-<>[]01";

// Main editor for the three preview effects.
// radius controls the cursor's magnetic/color field; smaller values make the active area tighter.
const fieldPresets = {
  "color-cluster": {
    gap: 9,
    radius: 0.54,
    pull: 4,
    minSignal: 0.16,
    size: { base: 1.8, signal: 0.46, pressure: 0.72 },
    massA: { x: 0.32, y: 0.42, falloff: 2.1, strength: 1 },
    massB: { x: 0.84, y: 0.64, falloff: 2.4, strength: 0.82 }
  },
  "outline-repel": {
    gap: 10,
    radius: 0.25,
    pull: -9,
    minSignal: 0.18,
    fillAt: 0.22,
    size: { base: 2, pressure: 2.2 },
    ridge: { y: 0.34, wave: 0.18, falloff: 5, strength: 0.38 },
    massB: { x: 0.84, y: 0.84, falloff: 4, strength: 0.24 }
  },
  "ascii-reveal": {
    gap: 12,
    radius: 0.32,
    labelRow: 0.54,
    bandY: 0.55,
    bandFalloff: 4.4,
    revealBoost: 0.8
  }
};

type DotPreset = {
  gap: number; radius: number; pull: number; minSignal: number; fillAt?: number;
  size: { base: number; signal?: number; pressure: number };
  massA?: { x: number; y: number; falloff: number; strength: number };
  massB?: { x: number; y: number; falloff: number; strength: number };
  ridge?: { y: number; wave: number; falloff: number; strength: number };
};

function hash(x: number, y: number, salt = 0) {
  return Math.sin(x * 127.1 + y * 311.7 + salt * 74.7) * 43758.5453 % 1;
}

function drawCircle(context: CanvasRenderingContext2D, x: number, y: number, size: number, fillStyle: string | null, strokeStyle?: string, lineWidth = 1) {
  context.beginPath();
  context.arc(x, y, size / 2, 0, Math.PI * 2);

  if (fillStyle) {
    context.fillStyle = fillStyle;
    context.fill();
  }

  if (strokeStyle) {
    context.lineWidth = lineWidth;
    context.strokeStyle = strokeStyle;
    context.stroke();
  }
}

function drawSquare(context: CanvasRenderingContext2D, x: number, y: number, size: number, fillStyle: string | null, strokeStyle?: string, lineWidth = 1) {
  const offset = size / 2;

  if (fillStyle) {
    context.fillStyle = fillStyle;
    context.fillRect(x - offset, y - offset, size, size);
  }

  if (strokeStyle) {
    context.lineWidth = lineWidth;
    context.strokeStyle = strokeStyle;
    context.strokeRect(x - offset, y - offset, size, size);
  }
}

function drawMark(context: CanvasRenderingContext2D, field: DotField, x: number, y: number, size: number, fillStyle: string | null, strokeStyle?: string, lineWidth = 1) {
  if (field.shape === "circle") {
    drawCircle(context, x, y, size, fillStyle, strokeStyle, lineWidth);
    return;
  }

  drawSquare(context, x, y, size, fillStyle, strokeStyle, lineWidth);
}

function drawAsciiField(field: DotField, monoFont: string, palette: DotPalette) {
  const { context, width, height, label } = field;
  const accent = palette.accent ?? field.accent;
  const preset = fieldPresets["ascii-reveal"];
  const gap = preset.gap;
  const cols = Math.floor(width / gap);
  const rows = Math.floor(height / gap);
  const labelText = label || "LAB";
  const labelRow = Math.floor(rows * preset.labelRow);
  const labelStart = Math.floor((cols - labelText.length) / 2);
  const pointerX = field.easedPointer.x * width;
  const pointerY = field.easedPointer.y * height;
  const maxDistance = Math.max(width, height) * preset.radius;

  context.font = `12px ${monoFont}`;
  context.textAlign = "center";
  context.textBaseline = "middle";

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const x = col * gap + gap * 0.5;
      const y = row * gap + gap * 0.5;
      const nx = x / width;
      const ny = y / height;
      const distance = Math.hypot(x - pointerX, y - pointerY);
      const pressure = ease(clamp(1 - distance / maxDistance, 0, 1)) * field.active;
      const staticNoise = Math.abs(hash(col, row, field.index));
      const labelIndex = col - labelStart;
      const isLabelCell = row === labelRow && labelIndex >= 0 && labelIndex < labelText.length;
      const reveal = isLabelCell ? ease(clamp(pressure * preset.revealBoost + field.active * 0.35, 0, 1)) : 0;
      const fieldBand = ease(clamp(1 - Math.abs(ny - preset.bandY) * preset.bandFalloff, 0, 1));
      const signal = clamp(staticNoise * 0.48 + fieldBand * 0.34 + pressure * 0.74 + reveal, 0, 1);

      if (signal < 0.34 && !isLabelCell) continue;

      const char = reveal > 0.38
        ? labelText[labelIndex]
        : asciiChars[Math.floor(staticNoise * asciiChars.length) % asciiChars.length];
      const r = mix(palette.asciiInk.r + staticNoise * 45, accent.r, pressure * 0.9 + reveal);
      const g = mix(palette.asciiInk.g + staticNoise * 45, accent.g, pressure * 0.9 + reveal);
      const b = mix(palette.asciiInk.b + staticNoise * 45, accent.b, pressure * 0.9 + reveal);
      const alpha = clamp((isLabelCell ? 0.3 : 0.08) + signal * 0.48 + reveal * 0.42, 0, 0.96);

      context.fillStyle = `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${alpha})`;
      context.fillText(char, x, y + Math.sin(field.phase + nx * 6) * pressure * 2);
    }
  }
}

export function drawDotField(field: DotField, reduceMotion: boolean, monoFont: string, palette = defaultDotPalette) {
  const { context, width, height, mode } = field;
  const accent = palette.accent ?? field.accent;
  if (mode === "ascii-reveal") {
    drawAsciiField(field, monoFont, palette);
    return;
  }

  const preset: DotPreset = mode === "outline-repel" ? fieldPresets["outline-repel"] : fieldPresets["color-cluster"];
  const gap = preset.gap;
  const startX = -gap;
  const startY = -gap;
  const pointerX = field.easedPointer.x * width;
  const pointerY = field.easedPointer.y * height;
  const maxDistance = Math.max(width, height) * preset.radius;

  for (let y = startY; y <= height + gap; y += gap) {
    for (let x = startX; x <= width + gap; x += gap) {
      const nx = x / width;
      const ny = y / height;
      const dx = x - pointerX;
      const dy = y - pointerY;
      const distance = Math.hypot(dx, dy);
      const pressure = ease(clamp(1 - distance / maxDistance, 0, 1)) * field.active;
      const grain = Math.sin(nx * 18 + ny * 11 + field.index * 2.4) * 0.5 + 0.5;
      // Static masses define the non-hover composition; falloff is the cluster size.
      const leftMass = preset.massA
        ? ease(clamp(1 - Math.hypot(nx - preset.massA.x, ny - preset.massA.y) * preset.massA.falloff, 0, 1)) * preset.massA.strength
        : 0;
      const rightMass = preset.massB
        ? ease(clamp(1 - Math.hypot(nx - preset.massB.x, ny - preset.massB.y) * preset.massB.falloff, 0, 1)) * preset.massB.strength
        : 0;
      // The outline preview gets a wave-like ridge so it does not read as another blob field.
      const ridge = preset.ridge
        ? ease(clamp(1 - Math.abs(ny - (preset.ridge.y + Math.sin(nx * 5 + field.phase) * preset.ridge.wave)) * preset.ridge.falloff, 0, 1)) * preset.ridge.strength
        : 0;
      const baseField = mode === "outline-repel"
        ? Math.max(ridge, rightMass)
        : Math.max(leftMass, rightMass);
      const shimmer = reduceMotion || mode === "color-cluster" ? 0 : Math.sin(field.phase + nx * 14 + ny * 20) * 0.08;
      const signal = clamp(baseField * 0.86 + grain * 0.18 + pressure * 0.95 + shimmer, 0, 1);

      if (signal < preset.minSignal) continue;

      const pull = pressure * preset.pull;
      const safeDistance = distance || 1;
      const warpX = dx / safeDistance * pull;
      const warpY = dy / safeDistance * pull;
      const r = mix(palette.ink.r + grain * 44, accent.r, pressure * 0.95);
      const g = mix(palette.ink.g + grain * 44, accent.g, pressure * 0.95);
      const b = mix(palette.ink.b + grain * 44, accent.b, pressure * 0.95);
      const alpha = clamp(0.14 + signal * 0.58 + pressure * 0.28, 0, 0.96);
      const fillStyle = `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${alpha})`;

      if (mode === "outline-repel") {
        const size = preset.size.base + pressure * preset.size.pressure;
        const strokeStyle = `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${clamp(0.26 + signal * 0.44, 0, 0.9)})`;
        const fill = pressure > preset.fillAt! ? fillStyle : null;

        drawMark(context, field, x + warpX, y + warpY, size, fill, strokeStyle, 1);
      } else {
        const size = preset.size.base + signal * preset.size.signal! + pressure * preset.size.pressure;

        drawMark(context, field, x + warpX, y + warpY, size, fillStyle);
      }
    }
  }
}
