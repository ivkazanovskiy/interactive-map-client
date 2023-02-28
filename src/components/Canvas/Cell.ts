import { TCoord, TDrawOption } from "./types/map.types";

export class Cell {
  id: string;

  constructor(
    public startX: number,
    public startY: number,
    public cellSize: number
  ) {
    this.id = `${startX}:${startY}:${cellSize}`;
  }

  draw({ ctx, mapData }: TDrawOption, zoom: number) {
    ctx.beginPath();
    ctx.lineWidth = 1;

    if (this.doesIncludeCoords(mapData.char, mapData.offset, zoom)) {
      ctx.strokeStyle = "green";
    } else if (
      mapData.charMemo &&
      this.doesIncludeCoords(mapData.charMemo, mapData.offset, zoom)
    ) {
      ctx.strokeStyle = "black";
    } else if (this.doesIncludeCoords(mapData.mouse, mapData.offset, zoom)) {
      ctx.strokeStyle = "red";
    } else {
      ctx.strokeStyle = "gray";
    }

    ctx.rect(
      this.startX * zoom + mapData.offset.x,
      this.startY * zoom + mapData.offset.y,
      this.cellSize * zoom,
      this.cellSize * zoom
    );
    ctx.stroke();
    ctx.closePath();
  }

  private doesIncludeCoords(
    coord: TCoord,
    offset: TCoord,
    zoom: number
  ): boolean {
    if (!coord) return false;

    const fieldX = (coord.x - offset.x) / zoom;
    const fieldY = (coord.y - offset.y) / zoom;
    return (
      this.startX <= fieldX &&
      this.startY <= fieldY &&
      this.startX + this.cellSize > fieldX &&
      this.startY + this.cellSize > fieldY
    );
  }
}
