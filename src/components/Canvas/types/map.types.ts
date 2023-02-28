export type TCoord = { x: number; y: number };

export type TDrawOption = {
  ctx: CanvasRenderingContext2D;
  mapData: TMapData;
};

export type TKeys = "mouse" | "char" | "offset";
export type TCacheKeys = "charMemo" | "dragMemo" | "offsetMemo";

export type TMapData = Record<TKeys, TCoord> &
  Partial<Record<TCacheKeys, TCoord | null>>;
