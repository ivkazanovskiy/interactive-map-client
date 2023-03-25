export type TCoord = { x: number; y: number };
export type TToken = TCoord & { color: string; id: number };

export type TDrawOption = {
  ctx: CanvasRenderingContext2D;
  mapData: TMapData;
};

export type TKeys = "mouse" | "offset";
export type TCacheKeys = "dragMemo" | "offsetMemo";

export type TMapData = Record<TKeys, TCoord> &
  Partial<Record<TCacheKeys, TCoord | null>> & { tokens: TToken[] } & {
    tokenMemo?: TToken | null;
  };
