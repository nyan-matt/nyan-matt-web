export type CanvasField = {
  context: CanvasRenderingContext2D;
  width: number;
  height: number;
  index: number;
  active: number;
  easedPointer: { x: number; y: number };
};

export type DotField = CanvasField & {
  mode: string;
  shape: string;
  label: string;
  accent: { r: number; g: number; b: number };
  phase: number;
};

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
export const mix = (a: number, b: number, amount: number) => a + (b - a) * amount;
export const ease = (value: number) => value * value * (3 - 2 * value);
