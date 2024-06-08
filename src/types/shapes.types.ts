export type coordinate = { x: number; y: number };
export type LineType = { id: string; points: number[]; active: boolean };
export type RectType = {
  id: string;
  points: [number, number, number, number];
  active: boolean;
};
export type pinWithId = coordinate & { id: string, active: boolean };
