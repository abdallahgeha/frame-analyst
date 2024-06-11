export type KeyActions = (event: KeyboardEvent) => void;
export type SettingsType = {
  gridSize: number;
  snapToGrid: boolean;
  snapToCap: boolean;
  snapToPin: boolean;

  showGrid: boolean;
  showCoordinates: boolean;
};

export const ActiveTypes = {
  view: "view",
  line: "line",
  polyline: "polyline",
  pin: "pin",
  rect: "rect",
  delete: "delete",
  clear: "clear",
  undo: "undo",
  redo: "redo",
} as const;

export type DrawType = keyof typeof ActiveTypes;

export type coordinate = { x: number; y: number };
export type LineType = {
  id: string;
  points: number[];
  active: boolean;
  itemType: "line";
};
export type RectType = {
  id: string;
  points: [number, number, number, number];
  active: boolean;
  itemType: "rect";
};
export type pinWithId = coordinate & {
  id: string;
  active: boolean;
  itemType: "pin";
};
export type ObjectsType = LineType | pinWithId | RectType;
